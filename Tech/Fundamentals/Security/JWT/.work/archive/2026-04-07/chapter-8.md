# 第 8 章：实战案例与检查清单

> **本章目标**：掌握 JWT 在生产环境的完整实现，包括用户认证系统、API 网关中间件、刷新令牌轮换、微服务 Token 传递，以及部署前的安全检查清单

---

## 8.1 用户认证系统完整实现（前端 + 后端全流程）

### 8.1.1 系统架构设计

**技术栈选择**：
- **后端**：Node.js + Express + MongoDB
- **前端**：React + TypeScript
- **认证库**：jsonwebtoken + bcryptjs
- **缓存**：Redis（黑名单 + Refresh Token 存储）

**系统架构图**：

```
┌──────────────────────────────────────────────────────────────────┐
│                         前端（React）                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐     │
│  │  登录组件   │  │  Token 管理器 │  │  HTTP 拦截器        │     │
│  │  Login.tsx  │  │  useAuth.ts  │  │  api/axios.ts       │     │
│  └─────────────┘  └──────────────┘  └─────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (Authorization: Bearer <token>)
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      API 网关 / 后端（Express）                    │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐     │
│  │  认证中间件 │  │   路由控制器  │  │    业务逻辑层       │     │
│  │  auth.js    │  │  auth.routes │  │   auth.service      │     │
│  └─────────────┘  └──────────────┘  └─────────────────────┘     │
│  ┌─────────────┐  ┌──────────────┐                              │
│  │   Redis     │  │   MongoDB    │                              │
│  │  (黑名单)   │  │   (用户数据)  │                              │
│  └─────────────┘  └──────────────┘                              │
└──────────────────────────────────────────────────────────────────┘
```

### 8.1.2 后端实现

#### 8.1.2.1 项目初始化

```bash
# 创建项目目录
mkdir jwt-auth-system && cd jwt-auth-system

# 初始化 npm 项目
npm init -y

# 安装核心依赖
npm install express mongoose jsonwebtoken bcryptjs dotenv cors helmet
npm install redis express-rate-limit express-validator

# 开发依赖
npm install -D nodemon @types/express @types/node typescript ts-node
```

#### 8.1.2.2 环境变量配置（.env）

```env
# 服务器配置
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/jwt_auth_db
REDIS_URL=redis://localhost:6379

# JWT 配置
JWT_SECRET=your-super-secret-key-min-32-bytes-long
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
JWT_ISSUER=auth.yourapp.com
JWT_AUDIENCE=api.yourapp.com

# 安全配置
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 8.1.2.3 用户模型（models/User.js）

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // 默认不返回密码字段
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  permissionVersion: {
    type: Number,
    default: 1 // 用于权限变更即时生效
  }
}, {
  timestamps: true
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 实例方法：比较密码
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 实例方法：更新登录时间
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
```

#### 8.1.2.4 Token 服务（services/token.service.js）

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redis = require('../config/redis');

class TokenService {
  constructor() {
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
    this.jwtSecret = process.env.JWT_SECRET;
    this.issuer = process.env.JWT_ISSUER;
    this.audience = process.env.JWT_AUDIENCE;
  }

  /**
   * 生成 Access Token 和 Refresh Token
   */
  async generateTokens(user) {
    const refreshTokenId = crypto.randomBytes(32).toString('hex');
    const tokenFamily = crypto.randomBytes(16).toString('hex');

    // 生成 Access Token
    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        type: 'access',
        permissionVersion: user.permissionVersion
      },
      this.jwtSecret,
      {
        expiresIn: this.accessTokenExpiry,
        issuer: this.issuer,
        audience: this.audience,
        jwtid: crypto.randomBytes(16).toString('hex')
      }
    );

    // 生成 Refresh Token
    const refreshToken = jwt.sign(
      {
        userId: user._id.toString(),
        type: 'refresh',
        jti: refreshTokenId,
        family: tokenFamily
      },
      this.jwtSecret,
      {
        expiresIn: this.refreshTokenExpiry,
        issuer: this.issuer,
        audience: this.audience
      }
    );

    // 存储 Refresh Token 到 Redis（用于黑名单和轮换）
    await redis.setEx(
      `refresh:${refreshTokenId}`,
      7 * 24 * 60 * 60, // 7 天
      JSON.stringify({
        userId: user._id.toString(),
        family: tokenFamily,
        createdAt: Date.now()
      })
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiryToSeconds(this.accessTokenExpiry)
    };
  }

  /**
   * 刷新 Access Token
   */
  async refreshAccessToken(refreshToken) {
    try {
      // 验证 Refresh Token
      const decoded = jwt.verify(refreshToken, this.jwtSecret, {
        issuer: this.issuer,
        audience: this.audience
      });

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // 检查是否在黑名单
      const isBlacklisted = await redis.exists(`blacklist:${decoded.jti}`);
      if (isBlacklisted) {
        throw new Error('Token has been revoked');
      }

      // 检查 Token 重用攻击
      const reusedToken = await redis.get(`reuse:${decoded.jti}`);
      if (reusedToken) {
        // 检测到攻击！撤销该家族所有 Token
        await this.revokeTokenFamily(decoded.family);
        throw new Error('Token reuse detected, all sessions revoked');
      }

      // 检查 Refresh Token 是否有效
      const storedToken = await redis.get(`refresh:${decoded.jti}`);
      if (!storedToken) {
        throw new Error('Refresh token not found');
      }

      // 获取用户最新信息（用于权限检查）
      const User = require('../models/User');
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // 生成新 Access Token
      const newAccessToken = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
          role: user.role,
          type: 'access',
          permissionVersion: user.permissionVersion
        },
        this.jwtSecret,
        {
          expiresIn: this.accessTokenExpiry,
          issuer: this.issuer,
          audience: this.audience,
          jwtid: crypto.randomBytes(16).toString('hex')
        }
      );

      // 标记旧 Refresh Token 为已使用（用于重用检测）
      await redis.setEx(
        `reuse:${decoded.jti}`,
        this.parseExpiryToSeconds(this.refreshTokenExpiry),
        'used'
      );

      // 生成新的 Refresh Token（轮换）
      const newRefreshTokenId = crypto.randomBytes(32).toString('hex');
      const newRefreshToken = jwt.sign(
        {
          userId: user._id.toString(),
          type: 'refresh',
          jti: newRefreshTokenId,
          family: decoded.family
        },
        this.jwtSecret,
        {
          expiresIn: this.refreshTokenExpiry,
          issuer: this.issuer,
          audience: this.audience
        }
      );

      // 存储新 Refresh Token
      await redis.setEx(
        `refresh:${newRefreshTokenId}`,
        this.parseExpiryToSeconds(this.refreshTokenExpiry),
        JSON.stringify({
          userId: user._id.toString(),
          family: decoded.family,
          createdAt: Date.now()
        })
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: this.parseExpiryToSeconds(this.accessTokenExpiry)
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new Error('Invalid or expired refresh token');
      }
      throw error;
    }
  }

  /**
   * 登出（撤销 Refresh Token）
   */
  async logout(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtSecret, {
        issuer: this.issuer,
        audience: this.audience
      });

      // 将 Refresh Token 加入黑名单
      const ttl = await redis.ttl(`refresh:${decoded.jti}`);
      if (ttl > 0) {
        await redis.setEx(`blacklist:${decoded.jti}`, ttl, 'revoked');
      }

      // 删除 Refresh Token 记录
      await redis.del(`refresh:${decoded.jti}`);

      return { success: true };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        // Token 已过期，直接返回成功
        return { success: true };
      }
      throw error;
    }
  }

  /**
   * 撤销用户所有 Token（安全事件响应）
   */
  async revokeAllUserTokens(userId) {
    const pattern = `refresh:*:${userId}`;
    const keys = await redis.keys(pattern);
    
    for (const key of keys) {
      const tokenData = await redis.get(key);
      if (tokenData) {
        const parsed = JSON.parse(tokenData);
        const ttl = await redis.ttl(key);
        if (ttl > 0) {
          await redis.setEx(`blacklist:${key.split(':')[1]}`, ttl, 'revoked');
        }
        await redis.del(key);
      }
    }
  }

  /**
   * 撤销 Token 家族（检测到重用时）
   */
  async revokeTokenFamily(family) {
    const pattern = `refresh:*`;
    const keys = await redis.keys(pattern);
    
    for (const key of keys) {
      const tokenData = await redis.get(key);
      if (tokenData) {
        const parsed = JSON.parse(tokenData);
        if (parsed.family === family) {
          const ttl = await redis.ttl(key);
          if (ttl > 0) {
            await redis.setEx(`blacklist:${key.split(':')[1]}`, ttl, 'revoked');
          }
          await redis.del(key);
        }
      }
    }
  }

  /**
   * 解析有效期字符串为秒数
   */
  parseExpiryToSeconds(expiry) {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // 默认 15 分钟

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 900;
    }
  }
}

module.exports = new TokenService();
```

#### 8.1.2.5 认证中间件（middleware/auth.middleware.js）

```javascript
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

/**
 * JWT 验证中间件
 */
const authenticate = async (req, res, next) => {
  try {
    // 从 Header 获取 Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
    }

    const token = authHeader.split(' ')[1];

    // 验证 Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    });

    // 检查 Token 类型
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type'
      });
    }

    // 检查是否在黑名单（虽然 Access Token 通常不检查，但高安全场景需要）
    const isBlacklisted = await redis.exists(`blacklist:${decoded.jti}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        error: 'Token has been revoked'
      });
    }

    // 附加用户信息到请求
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      permissionVersion: decoded.permissionVersion
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    next(error);
  }
};

/**
 * 角色授权中间件
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * 可选认证中间件（某些路由允许访客访问）
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // 没有 Token，继续处理
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    });

    req.user = decoded;
    next();
  } catch (error) {
    // Token 无效，继续处理（不阻止请求）
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};
```

#### 8.1.2.6 认证路由（routes/auth.routes.js）

```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const AuthService = require('../services/auth.service');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();
const authService = new AuthService();

/**
 * 错误处理中间件
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

/**
 * POST /api/v1/auth/register
 * 用户注册
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('username').isLength({ min: 3, max: 30 }).trim()
], validate, async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const result = await authService.register({ email, password, username });
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/v1/auth/login
 * 用户登录
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/v1/auth/refresh
 * 刷新 Access Token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    const result = await authService.refreshToken(refreshToken);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/v1/auth/logout
 * 用户登出
 */
router.post('/logout', authenticate, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    await authService.logout(refreshToken);
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/v1/auth/logout-all
 * 登出所有设备（撤销所有 Token）
 */
router.post('/logout-all', authenticate, authorize('admin'), async (req, res) => {
  try {
    await authService.logoutAll(req.user.userId);
    
    res.json({
      success: true,
      message: 'All sessions revoked'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/v1/auth/me
 * 获取当前用户信息
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    
    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
});

/**
 * PUT /api/v1/auth/password
 * 修改密码
 */
router.put('/password', authenticate, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
], validate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.user.userId, currentPassword, newPassword);
    
    // 密码修改后，撤销所有 Token
    await authService.logoutAll(req.user.userId);
    
    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
```

#### 8.1.2.7 认证服务（services/auth.service.js）

```javascript
const User = require('../models/User');
const tokenService = require('./token.service');

class AuthService {
  /**
   * 用户注册
   */
  async register({ email, password, username }) {
    // 创建用户
    const user = new User({ email, password, username });
    await user.save();

    // 生成 Token
    const tokens = await tokenService.generateTokens(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      ...tokens
    };
  }

  /**
   * 用户登录
   */
  async login({ email, password }) {
    // 查找用户（包括密码字段）
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // 检查账户状态
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // 更新最后登录时间
    await user.updateLastLogin();

    // 生成 Token
    const tokens = await tokenService.generateTokens(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      ...tokens
    };
  }

  /**
   * 刷新 Token
   */
  async refreshToken(refreshToken) {
    return await tokenService.refreshAccessToken(refreshToken);
  }

  /**
   * 登出
   */
  async logout(refreshToken) {
    return await tokenService.logout(refreshToken);
  }

  /**
   * 登出所有设备
   */
  async logoutAll(userId) {
    return await tokenService.revokeAllUserTokens(userId);
  }

  /**
   * 获取用户信息
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * 修改密码
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw new Error('User not found');
    }

    // 验证当前密码
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // 更新密码（会自动加密）
    user.password = newPassword;
    user.permissionVersion += 1; // 增加权限版本号
    await user.save();

    return { success: true };
  }
}

module.exports = AuthService;
```

### 8.1.3 前端实现

#### 8.1.3.1 Axios 拦截器配置（src/api/axios.js）

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// 请求拦截器：自动添加 Access Token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：处理 Token 过期和刷新
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 如果是 401 错误且未重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // 调用刷新接口
        const response = await axios.post(
          `${originalRequest.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // 保存新 Token
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // 重试原请求
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 刷新失败，清除 Token 并跳转到登录页
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

#### 8.1.3.2 Auth Hook（src/hooks/useAuth.js）

```javascript
import { useState, useCallback, createContext, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时检查登录状态
  useState(() => {
    const initAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      } catch (error) {
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  });

  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    return response.data;
  }, []);

  const register = useCallback(async (email, password, username) => {
    const response = await api.post('/auth/register', { email, password, username });
    const { user, accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    return response.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await api.post('/auth/logout-all');
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    logoutAll
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

#### 8.1.3.3 登录组件（src/pages/Login.jsx）

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/register" className="text-indigo-600 hover:text-indigo-500">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
```

#### 8.1.3.4 受保护路由（src/components/ProtectedRoute.jsx）

```javascript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

---

## 8.2 API 网关 JWT 校验中间件实现

### 8.2.1 Express 网关实现

```javascript
// middleware/gateway/jwt.validator.js
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

class GatewayJWTValidator {
  constructor(options = {}) {
    this.issuer = options.issuer;
    this.audience = options.audience;
    this.algorithms = options.algorithms || ['HS256', 'RS256'];
    
    // JWKS 客户端（用于 RS256 非对称加密）
    if (options.jwksUri) {
      this.jwksClient = jwksClient({
        jwksUri: options.jwksUri,
        cache: true,
        cacheMaxAge: 600000, // 10 分钟
        rateLimit: true
      });
    }
  }

  /**
   * 获取验证密钥
   */
  async getSigningKey(header) {
    if (this.jwksClient && header.alg.startsWith('RS')) {
      return new Promise((resolve, reject) => {
        this.jwksClient.getSigningKey(header.kid, (err, key) => {
          if (err) reject(err);
          else resolve(key.publicKey || key.rsaPublicKey);
        });
      });
    }
    // HS256 使用共享密钥
    return process.env.JWT_SECRET;
  }

  /**
   * JWT 验证中间件
   */
  validate() {
    return async (req, res, next) => {
      try {
        // 1. 从 Header 获取 Token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            error: 'Missing or invalid authorization header'
          });
        }

        const token = authHeader.split(' ')[1];

        // 2. 解码 Header（不验证签名）获取 kid
        const decodedHeader = jwt.decode(token, { complete: true });
        if (!decodedHeader) {
          return res.status(400).json({
            success: false,
            error: 'Invalid token format'
          });
        }

        // 3. 获取验证密钥
        const key = await this.getSigningKey(decodedHeader.header);

        // 4. 验证 Token
        const decoded = jwt.verify(token, key, {
          algorithms: this.algorithms,
          issuer: this.issuer,
          audience: this.audience
        });

        // 5. 附加用户信息到请求头（传递给下游服务）
        req.user = decoded;
        req.headers['x-user-id'] = decoded.userId;
        req.headers['x-user-role'] = decoded.role;
        req.headers['x-user-email'] = decoded.email;

        // 6. 透传原始 Token（下游服务可能需要）
        req.headers['x-forwarded-jwt'] = token;

        next();
      } catch (error) {
        console.error('JWT validation error:', error);
        
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            error: 'Token has expired',
            code: 'TOKEN_EXPIRED'
          });
        }
        
        return res.status(401).json({
          success: false,
          error: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
      }
    };
  }
}

module.exports = GatewayJWTValidator;
```

### 8.2.2 网关主入口（gateway/app.js）

```javascript
const express = require('express');
const httpProxy = require('http-proxy-middleware');
const GatewayJWTValidator = require('./middleware/gateway/jwt.validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// 安全中间件
app.use(helmet());

// 限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 最多 100 请求
  message: { error: 'Too many requests, please try again later' }
});
app.use(limiter);

// 初始化 JWT 验证器
const jwtValidator = new GatewayJWTValidator({
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  algorithms: ['HS256', 'RS256'],
  jwksUri: process.env.JWKS_URI // 可选，用于 RS256
});

// 白名单路由（不需要认证）
const whitelistPaths = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/health',
  '/api-docs'
];

// 应用 JWT 验证（白名单除外）
app.use((req, res, next) => {
  if (whitelistPaths.some(path => req.path.startsWith(path))) {
    return next();
  }
  jwtValidator.validate()(req, res, next);
});

// 代理到用户服务
app.use('/api/v1/users', httpProxy.createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // 传递用户上下文
    if (req.user) {
      proxyReq.setHeader('x-user-id', req.user.userId);
      proxyReq.setHeader('x-user-role', req.user.role);
    }
  }
}));

// 代理到订单服务
app.use('/api/v1/orders', httpProxy.createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    if (req.user) {
      proxyReq.setHeader('x-user-id', req.user.userId);
      proxyReq.setHeader('x-user-role', req.user.role);
    }
  }
}));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.GATEWAY_PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
```

### 8.2.3 Spring Cloud Gateway 实现（Java）

```java
// GatewayJwtFilter.java
package com.example.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class GatewayJwtFilter implements GlobalFilter, Ordered {

    private String jwtSecret;
    private String jwtIssuer;
    private String jwtAudience;

    @PostConstruct
    public void init() {
        this.jwtSecret = System.getenv("JWT_SECRET");
        this.jwtIssuer = System.getenv("JWT_ISSUER");
        this.jwtAudience = System.getenv("JWT_AUDIENCE");
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();

        // 白名单检查
        if (isWhitelisted(path)) {
            return chain.filter(exchange);
        }

        // 获取 Token
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return onError(exchange, "Missing authorization header", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        try {
            // 验证 Token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .requireIssuer(jwtIssuer)
                    .requireAudience(jwtAudience)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // 添加用户信息到请求头
            ServerWebExchange modifiedExchange = exchange.mutate()
                    .request(req -> req.mutate()
                            .header("x-user-id", claims.get("userId", String.class))
                            .header("x-user-role", claims.get("role", String.class))
                            .header("x-user-email", claims.get("email", String.class))
                            .header("x-forwarded-jwt", token)
                            .build())
                    .build();

            return chain.filter(modifiedExchange);

        } catch (Exception e) {
            return onError(exchange, "Invalid token: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    private boolean isWhitelisted(String path) {
        List<String> whitelist = List.of(
                "/api/v1/auth/login",
                "/api/v1/auth/register",
                "/health",
                "/api-docs"
        );
        return whitelist.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(
                org.springframework.http.MediaType.APPLICATION_JSON);
        return exchange.getResponse().writeWith(
                Mono.just(exchange.getResponse().bufferFactory().wrap(
                        ("{\"success\":false,\"error\":\"" + message + "\"}").getBytes()
                ))
        );
    }

    @Override
    public int getOrder() {
        return -100; // 高优先级
    }
}
```

---

## 8.3 JWT 刷新令牌轮换实现

### 8.3.1 刷新令牌轮换架构

```
┌──────────────────────────────────────────────────────────────────┐
│                    Refresh Token Rotation                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. 首次登录                                                      │
│     Client ──> Auth Server: 登录凭证                              │
│     Auth Server ──> Client: RT1 (jti=abc, family=xyz)            │
│     Redis: SET refresh:abc {userId, family:xyz} EX 7d            │
│                                                                   │
│  2. 第一次刷新                                                    │
│     Client ──> Auth Server: RT1                                   │
│     Auth Server: 验证 RT1 有效                                    │
│     Auth Server: SET reuse:abc RT2 EX 7d  (标记旧 Token 已使用)     │
│     Auth Server: SET refresh:RT2 {userId, family:xyz} EX 7d      │
│     Auth Server ──> Client: RT2 (jti=RT2, family=xyz)            │
│                                                                   │
│  3. 重用检测（攻击场景）                                           │
│     Attacker ──> Auth Server: RT1 (已失效)                        │
│     Auth Server: 发现 reuse:abc 存在                               │
│     Auth Server: 检测到重用攻击！撤销 family=xyz 所有 Token         │
│     Redis: DEL refresh:*xyz                                       │
│     Redis: SET blacklist:abc EX 7d                               │
│     Auth Server ──> Attacker: 401 Token reuse detected           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 8.3.2 完整实现代码

```javascript
// services/refreshTokenRotation.service.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redis = require('../config/redis');

class RefreshTokenRotationService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.refreshTokenExpiry = '7d';
    this.tokenFamilyExpiry = '90d'; // Token 家族最长生命周期
  }

  /**
   * 生成新的 Refresh Token
   */
  async createRefreshToken(userId) {
    const jti = crypto.randomBytes(32).toString('hex');
    const family = crypto.randomBytes(16).toString('hex');

    const refreshToken = jwt.sign(
      {
        userId,
        type: 'refresh',
        jti,
        family
      },
      this.jwtSecret,
      {
        expiresIn: this.refreshTokenExpiry,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
      }
    );

    // 存储 Refresh Token 元数据
    await redis.setEx(
      `refresh:${jti}`,
      7 * 24 * 60 * 60,
      JSON.stringify({
        userId,
        family,
        createdAt: Date.now(),
        used: false
      })
    );

    // 存储 Token 家族信息（用于撤销所有会话）
    await redis.setEx(
      `family:${family}`,
      90 * 24 * 60 * 60,
      JSON.stringify({
        userId,
        createdAt: Date.now()
      })
    );

    return { refreshToken, jti, family };
  }

  /**
   * 刷新 Access Token（带轮换）
   */
  async rotateRefreshToken(refreshToken) {
    let decoded;
    
    try {
      // 1. 验证 Refresh Token
      decoded = jwt.verify(refreshToken, this.jwtSecret, {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
      });
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // 2. 检查是否在黑名单
    const isBlacklisted = await redis.exists(`blacklist:${decoded.jti}`);
    if (isBlacklisted) {
      throw new Error('Token has been revoked');
    }

    // 3. 检查重用攻击
    const reusedWithToken = await redis.get(`reuse:${decoded.jti}`);
    if (reusedWithToken) {
      // 检测到重用攻击！撤销该家族所有 Token
      await this.revokeTokenFamily(decoded.family);
      
      // 记录安全事件
      await this.logSecurityEvent({
        type: 'TOKEN_REUSE_DETECTED',
        userId: decoded.userId,
        family: decoded.family,
        timestamp: Date.now(),
        details: {
          oldTokenJti: reusedWithToken,
          reusedTokenJti: decoded.jti
        }
      });

      throw new Error('Token reuse detected. All sessions have been revoked for security.');
    }

    // 4. 验证 Token 是否有效（存在于 Redis）
    const storedToken = await redis.get(`refresh:${decoded.jti}`);
    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    const tokenData = JSON.parse(storedToken);

    // 5. 检查是否已使用
    if (tokenData.used) {
      // 异常：已使用的 Token 不应出现在这里
      await this.revokeTokenFamily(tokenData.family);
      throw new Error('Token has already been used. All sessions revoked.');
    }

    // 6. 获取用户最新状态
    const User = require('../models/User');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // 7. 标记旧 Token 为已使用（用于重用检测）
    const ttl = await redis.ttl(`refresh:${decoded.jti}`);
    await redis.setEx(
      `reuse:${decoded.jti}`,
      ttl > 0 ? ttl : 7 * 24 * 60 * 60,
      'used'
    );

    // 8. 生成新 Token
    const newJti = crypto.randomBytes(32).toString('hex');
    const newRefreshToken = jwt.sign(
      {
        userId: user._id.toString(),
        type: 'refresh',
        jti: newJti,
        family: tokenData.family
      },
      this.jwtSecret,
      {
        expiresIn: this.refreshTokenExpiry,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
      }
    );

    // 9. 存储新 Token
    await redis.setEx(
      `refresh:${newJti}`,
      7 * 24 * 60 * 60,
      JSON.stringify({
        userId: user._id.toString(),
        family: tokenData.family,
        createdAt: Date.now(),
        used: false
      })
    );

    // 10. 生成新 Access Token
    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        type: 'access',
        permissionVersion: user.permissionVersion
      },
      this.jwtSecret,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
      }
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900, // 15 分钟
      tokenType: 'Bearer'
    };
  }

  /**
   * 撤销 Token 家族（所有相关会话）
   */
  async revokeTokenFamily(family) {
    const pattern = `refresh:*`;
    const keys = await redis.keys(pattern);

    for (const key of keys) {
      const tokenData = await redis.get(key);
      if (tokenData) {
        const parsed = JSON.parse(tokenData);
        if (parsed.family === family) {
          const jti = key.split(':')[1];
          const ttl = await redis.ttl(key);
          
          // 加入黑名单
          if (ttl > 0) {
            await redis.setEx(`blacklist:${jti}`, ttl, 'revoked');
          }
          
          // 删除 Refresh Token
          await redis.del(key);
        }
      }
    }

    // 删除家族记录
    await redis.del(`family:${family}`);
  }

  /**
   * 撤销单个 Token
   */
  async revokeToken(jti) {
    const ttl = await redis.ttl(`refresh:${jti}`);
    if (ttl > 0) {
      await redis.setEx(`blacklist:${jti}`, ttl, 'revoked');
    }
    await redis.del(`refresh:${jti}`);
  }

  /**
   * 撤销用户所有会话
   */
  async revokeAllUserSessions(userId) {
    // 通过 family 撤销
    const familyKeys = await redis.keys(`family:*:${userId}`);
    for (const familyKey of familyKeys) {
      const familyData = await redis.get(familyKey);
      if (familyData) {
        const parsed = JSON.parse(familyData);
        await this.revokeTokenFamily(parsed.family);
      }
    }

    // 直接撤销所有该用户的 Refresh Token
    const refreshKeys = await redis.keys(`refresh:*`);
    for (const key of refreshKeys) {
      const tokenData = await redis.get(key);
      if (tokenData) {
        const parsed = JSON.parse(tokenData);
        if (parsed.userId === userId) {
          const jti = key.split(':')[1];
          await this.revokeToken(jti);
        }
      }
    }
  }

  /**
   * 记录安全事件
   */
  async logSecurityEvent(event) {
    const eventKey = `security_event:${Date.now()}:${crypto.randomBytes(8).toString('hex')}`;
    await redis.setEx(
      eventKey,
      30 * 24 * 60 * 60, // 保留 30 天
      JSON.stringify(event)
    );
    await redis.lpush('security_events', eventKey);
    await redis.ltrim('security_events', 0, 9999); // 最多保留 10000 条
  }

  /**
   * 获取安全事件列表
   */
  async getSecurityEvents(limit = 100) {
    const eventKeys = await redis.lrange('security_events', 0, limit - 1);
    const events = [];

    for (const key of eventKeys) {
      const eventData = await redis.get(key);
      if (eventData) {
        events.push(JSON.parse(eventData));
      }
    }

    return events;
  }
}

module.exports = new RefreshTokenRotationService();
```

---

## 8.4 微服务间 Token 传递方案

### 8.4.1 Token 传递模式对比

| 模式 | 描述 | 优点 | 缺点 | 适用场景 |
|------|------|------|------|---------|
| **透传模式** | 原始 JWT 直接传递给下游 | 简单，下游可独立验证 | Token 较大，网络开销 | 服务间信任度高 |
| **提取模式** | 网关提取用户信息，通过 Header 传递 | 减少网络开销 | 下游依赖网关 | 内部服务 |
| **转换模式** | 网关生成新 Token（服务特定） | 最小权限，安全 | 复杂，性能开销 | 高安全场景 |

### 8.4.2 透传模式实现

```javascript
// middleware/tokenForwarding.js
const jwt = require('jsonwebtoken');

/**
 * Token 透传中间件
 * 将验证后的用户信息附加到请求，并保留原始 Token
 */
function tokenForwarding(options = {}) {
  return (req, res, next) => {
    // 从认证中间件获取用户信息（已由前序中间件验证）
    if (!req.user) {
      return next(new Error('User not authenticated'));
    }

    // 提取原始 Token
    const authHeader = req.headers.authorization;
    const originalToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    // 设置转发 Header
    req.headers['x-user-id'] = req.user.userId;
    req.headers['x-user-role'] = req.user.role;
    req.headers['x-user-email'] = req.user.email;
    
    if (originalToken && options.forwardOriginalToken !== false) {
      req.headers['x-forwarded-jwt'] = originalToken;
    }

    next();
  };
}

module.exports = tokenForwarding;
```

### 8.4.3 服务间调用（Axios 拦截器）

```javascript
// services/internalHttpClient.js
const axios = require('axios');

class InternalHttpClient {
  constructor() {
    this.client = axios.create({
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 请求拦截器：自动传递用户上下文
    this.client.interceptors.request.use((config) => {
      // 从当前请求上下文获取用户信息
      const { getCurrentRequest } = require('../context/requestContext');
      const currentReq = getCurrentRequest();

      if (currentReq) {
        // 传递用户 ID
        if (currentReq.headers['x-user-id']) {
          config.headers['x-user-id'] = currentReq.headers['x-user-id'];
        }
        
        // 传递用户角色
        if (currentReq.headers['x-user-role']) {
          config.headers['x-user-role'] = currentReq.headers['x-user-role'];
        }

        // 传递原始 Token（可选）
        if (currentReq.headers['x-forwarded-jwt']) {
          config.headers['x-forwarded-jwt'] = currentReq.headers['x-forwarded-jwt'];
        }
      }

      return config;
    });

    // 响应拦截器：统一错误处理
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // 服务间认证失败，记录日志
          console.error('Internal service authentication failed');
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

module.exports = new InternalHttpClient();
```

### 8.4.4 请求上下文管理

```javascript
// context/requestContext.js
const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

/**
 * 设置当前请求上下文
 */
function withRequestContext(req, callback) {
  return asyncLocalStorage.run({ req }, callback);
}

/**
 * 获取当前请求
 */
function getCurrentRequest() {
  const store = asyncLocalStorage.getStore();
  return store?.req;
}

/**
 * 获取当前用户 ID
 */
function getCurrentUserId() {
  const req = getCurrentRequest();
  return req?.user?.userId || req?.headers?.['x-user-id'];
}

/**
 * 获取当前用户角色
 */
function getCurrentUserRole() {
  const req = getCurrentRequest();
  return req?.user?.role || req?.headers?.['x-user-role'];
}

module.exports = {
  withRequestContext,
  getCurrentRequest,
  getCurrentUserId,
  getCurrentUserRole
};
```

### 8.4.5 在 Express 中应用

```javascript
// app.js
const express = require('express');
const { withRequestContext } = require('./context/requestContext');
const { authenticate } = require('./middleware/auth.middleware');
const tokenForwarding = require('./middleware/tokenForwarding');

const app = express();

// 包装所有请求在 AsyncLocalStorage 中
app.use((req, res, next) => {
  withRequestContext(req, () => {
    next();
  });
});

// 认证中间件
app.use(authenticate);

// Token 转发中间件
app.use(tokenForwarding({ forwardOriginalToken: true }));

// 业务路由
app.use('/api/v1/orders', require('./routes/orders.routes'));

module.exports = app;
```

### 8.4.6 gRPC 服务间传递

```protobuf
// proto/common.proto
syntax = "proto3";

package common;

// 用户上下文元数据
message UserContext {
  string user_id = 1;
  string user_email = 2;
  string user_role = 3;
  string jwt_token = 4; // 可选，透传原始 Token
}

// 通用请求元数据
message RequestMetadata {
  string request_id = 1;
  UserContext user = 2;
  map<string, string> headers = 3;
}
```

```javascript
// grpc/interceptors.js
const grpc = require('@grpc/grpc-js');

/**
 * gRPC 请求拦截器：注入用户上下文
 */
function createUserContextInterceptor(userId, userEmail, userRole, jwtToken) {
  return (options, nextCall) => {
    return new grpc.InterceptingCall(nextCall(options), {
      startMetadata: function(metadata, next) {
        if (userId) metadata.set('x-user-id', userId);
        if (userEmail) metadata.set('x-user-email', userEmail);
        if (userRole) metadata.set('x-user-role', userRole);
        if (jwtToken) metadata.set('x-forwarded-jwt', jwtToken);
        next(metadata);
      }
    });
  };
}

module.exports = { createUserContextInterceptor };
```

---

## 8.5 安全检查清单（部署前必查）

### 8.5.1 配置安全

| 检查项 | 检查内容 | 状态 | 备注 |
|--------|---------|------|------|
| □ | JWT_SECRET 长度 ≥ 32 字节 | [ ] | 使用 `crypto.randomBytes(32)` 生成 |
| □ | JWT_SECRET 未硬编码在代码中 | [ ] | 必须从环境变量读取 |
| □ | JWT_ACCESS_EXPIRY ≤ 30 分钟 | [ ] | 推荐 15 分钟 |
| □ | JWT_REFRESH_EXPIRY ≤ 30 天 | [ ] | 高安全场景 ≤ 7 天 |
| □ | 强制 HTTPS 传输 | [ ] | HSTS 头已配置 |
| □ | 签名算法明确指定（不使用 none） | [ ] | `algorithms: ['HS256']` |
| □ | Issuer 和 Audience 验证启用 | [ ] | 防止 Token 混淆 |

### 8.5.2 代码安全

| 检查项 | 检查内容 | 状态 | 备注 |
|--------|---------|------|------|
| □ | 使用 `verify()` 而非`decode()` | [ ] | decode 不验证签名 |
| □ | Payload 无敏感数据 | [ ] | 密码、SSN、银行卡号等 |
| □ | 错误信息不泄露敏感信息 | [ ] | 不返回详细错误堆栈 |
| □ | 密码使用 bcrypt/argon2 加密 | [ ] |  Rounds ≥ 12 |
| □ | Token 存储于 HttpOnly Cookie | [ ] | 避免 LocalStorage |
| □ | CSRF 保护启用 | [ ] | SameSite Cookie 策略 |
| □ | 输入验证完整 | [ ] | 邮箱、密码强度校验 |

### 8.5.3 刷新令牌安全

| 检查项 | 检查内容 | 状态 | 备注 |
|--------|---------|------|------|
| □ | Refresh Token 轮换启用 | [ ] | 每次使用生成新 Token |
| □ | 重用检测启用 | [ ] | reuse:* 键已配置 |
| □ | 黑名单机制启用 | [ ] | Redis 黑名单已配置 |
| □ | 检测到重用后撤销家族 | [ ] | 所有相关会话撤销 |
| □ | Refresh Token 存储加密 | [ ] | Redis 数据加密存储 |
| □ | 最大刷新次数限制 | [ ] | 防止无限刷新 |
| □ | 绝对过期时间设置 | [ ] | 最长生命周期 ≤ 90 天 |

### 8.5.4 网络安全

| 检查项 | 检查内容 | 状态 | 备注 |
|--------|---------|------|------|
| □ | 限流策略配置 | [ ] | 登录接口 ≤ 5 次/分钟 |
| □ | CORS 配置正确 | [ ] | 只允许可信域名 |
| □ | 安全响应头配置 | [ ] | Helmet.js 已启用 |
| □ | API 网关 JWT 验证 | [ ] | 网关层验证签名 |
| □ | 微服务间 Token 传递安全 | [ ] | mTLS 或内网隔离 |
| □ | Redis 访问控制 | [ ] | 密码认证、内网访问 |
| □ | 数据库连接加密 | [ ] | SSL/TLS 连接 |

### 8.5.5 监控与告警

| 检查项 | 检查内容 | 状态 | 备注 |
|--------|---------|------|------|
| □ | Token 验证失败率监控 | [ ] | > 5% 触发告警 |
| □ | 登录失败率监控 | [ ] | 暴力破解检测 |
| □ | 异常 IP 检测 | [ ] | 高频访问告警 |
| □ | Token 重用攻击告警 | [ ] | 立即通知安全团队 |
| □ | 黑名单命中率监控 | [ ] | 异常高时检查 |
| □ | 审计日志记录 | [ ] | 登录、登出、Token 刷新 |
| □ | 安全事件保留 ≥ 90 天 | [ ] | 合规要求 |

### 8.5.6 部署前自动化检查脚本

```bash
#!/bin/bash
# security-check.sh - JWT 安全部署检查脚本

echo "=== JWT Security Pre-Deployment Checklist ==="
echo ""

# 检查 JWT_SECRET
SECRET=${JWT_SECRET:-}
if [ -z "$SECRET" ]; then
  echo "❌ JWT_SECRET not set"
  exit 1
fi

SECRET_LEN=${#SECRET}
if [ $SECRET_LEN -lt 32 ]; then
  echo "❌ JWT_SECRET too short ($SECRET_LEN chars, need ≥32)"
  exit 1
fi
echo "✅ JWT_SECRET length: $SECRET_LEN"

# 检查有效期配置
ACCESS_EXPIRY=${JWT_ACCESS_EXPIRY:-}
if [[ "$ACCESS_EXPIRY" =~ ^([0-9]+)([mhd])$ ]]; then
  VALUE=${BASH_REMATCH[1]}
  UNIT=${BASH_REMATCH[2]}
  
  # 转换为分钟
  MINUTES=0
  case $UNIT in
    m) MINUTES=$VALUE ;;
    h) MINUTES=$((VALUE * 60)) ;;
    d) MINUTES=$((VALUE * 24 * 60)) ;;
  esac
  
  if [ $MINUTES -gt 30 ]; then
    echo "⚠️  JWT_ACCESS_EXPIRY > 30 minutes ($MINUTES min)"
  else
    echo "✅ JWT_ACCESS_EXPIRY: $ACCESS_EXPIRY"
  fi
fi

# 检查是否使用 HttpOnly Cookie
if grep -r "localStorage.*token" src/ > /dev/null; then
  echo "⚠️  Token stored in localStorage detected"
fi

# 检查是否使用 verify()
if grep -r "jwt.decode" src/ > /dev/null; then
  echo "⚠️  jwt.decode() usage detected (should use verify())"
else
  echo "✅ No jwt.decode() usage"
fi

# 检查密码加密
if grep -r "crypto.createHash.*password" src/ > /dev/null; then
  echo "⚠️  Plain hash for password detected (use bcrypt)"
else
  echo "✅ No plain password hash"
fi

echo ""
echo "=== Security Check Complete ==="
```

### 8.5.7 渗透测试检查项

```markdown
## JWT 渗透测试清单

### 1. 签名验证绕过
- [ ] 尝试将 alg 改为 none
- [ ] 尝试其他算法（RS256 vs HS256）
- [ ] 尝试删除签名部分
- [ ] 尝试使用公钥作为 HMAC 密钥（RSA 混淆攻击）

### 2. Token 泄露测试
- [ ] 检查 Token 是否在 URL 中传输
- [ ] 检查 Token 是否在日志中明文记录
- [ ] 检查 Referer 头是否泄露 Token
- [ ] 检查 LocalStorage 可访问性（XSS 测试）

### 3. 重放攻击测试
- [ ] 使用旧 Refresh Token 刷新
- [ ] 并发使用同一 Refresh Token
- [ ] 使用已过期的 Access Token

### 4. 权限提升测试
- [ ] 修改 Payload 中的 role 字段
- [ ] 尝试访问其他用户的资源（IDOR）
- [ ] 尝试访问 admin 接口

### 5. 暴力破解测试
- [ ] 尝试爆破 JWT_SECRET
- [ ] 尝试爆破用户密码
- [ ] 尝试生成合法 Token
```

---

## 8.6 本章检查清单

### 实现完整性检查

- [ ] **用户认证系统**
  - [ ] 注册功能（含输入验证）
  - [ ] 登录功能（密码验证）
  - [ ] Access Token + Refresh Token 双令牌
  - [ ] Token 刷新机制
  - [ ] 登出功能
  - [ ] 修改密码功能
- [ ] **前端集成**
  - [ ] Axios 请求拦截器
  - [ ] Token 自动刷新
  - [ ] 登录状态管理
  - [ ] 受保护路由
- [ ] **API 网关**
  - [ ] JWT 验证中间件
  - [ ] 白名单配置
  - [ ] 用户上下文传递
- [ ] **刷新令牌轮换**
  - [ ] 轮换逻辑实现
  - [ ] 重用检测
  - [ ] 家族撤销机制
- [ ] **微服务集成**
  - [ ] Token 透传
  - [ ] 用户上下文管理
  - [ ] 服务间调用拦截器

### 安全检查

- [ ] 完成 8.5 节所有检查项
- [ ] 运行自动化检查脚本
- [ ] 完成渗透测试清单
- [ ] 配置监控告警

### 文档完整性

- [ ] API 文档完整（Swagger/OpenAPI）
- [ ] 部署文档完整
- [ ] 故障排查指南
- [ ] 安全事件响应流程

---

## 8.7 引用来源

1. RFC 7519 - JSON Web Token (JWT)
2. RFC 7523 - JSON Web Token (JWT) Profile for OAuth 2.0
3. Auth0 - "Refresh Token Rotation"
4. OWASP - "JSON Web Token Cheat Sheet"
5. Curity.io - "JWT Best Practices"
6. Node.js best practices - "Authentication and JWT"
7. Spring Security - "OAuth2 Resource Server"
8. GitHub - "awesome-jwt"
9. CSDN - "JWT refresh token 实践"
10. 阿里云 - "基于 JWT 的 token 认证"

---

**上一章**：[第 7 章：JWT 常见误区与面试问题](./chapter-7.md)

**返回目录**：[JWT 核心知识体系](../JWT 核心知识体系.md)
