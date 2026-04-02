# 第 8 章：最佳实践与典型应用场景

## 8.1 典型应用场景

### 场景 1：全栈博客平台

**技术架构：**
- **前端**：Next.js 14 (App Router)
- **后端**：Supabase (Database + Auth + Storage)
- **实时功能**：评论实时通知
- **图片存储**：文章封面图、用户头像

**数据库 Schema：**

```sql
-- 用户资料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 文章表
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'draft',  -- draft/published
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 评论表
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id),  -- 嵌套评论
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 策略：任何人都可以查看已发布的文章
CREATE POLICY "公开文章可读" ON posts
  FOR SELECT
  USING (status = 'published');

-- 策略：作者可以管理自己的文章
CREATE POLICY "作者管理文章" ON posts
  FOR ALL
  USING (author_id = auth.uid());

-- 策略：任何人都可以查看评论
CREATE POLICY "评论可读" ON comments
  FOR SELECT
  USING (true);

-- 策略：认证用户可以发表评论
CREATE POLICY "认证用户评论" ON comments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

```

**前端集成示例：**

```typescript
// app/blog/[slug]/page.tsx

import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const supabase = createClient()
  
  // 获取文章内容
  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(username, avatar_url)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()
  
  if (!post) notFound()
  
  // 获取评论
  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(username, avatar_url)')
    .eq('post_id', post.id)
    .order('created_at', { ascending: false })
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      
      {/* 评论区 - 客户端组件实现实时更新 */}
      <Comments postId={post.id} initialComments={comments} />
    </article>
  )
}

```

**实时评论通知：**

```typescript
// components/Comments.tsx

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useSupabase } from '@/lib/supabase-provider'

export function Comments({ postId, initialComments }: Props) {
  const supabase = useSupabase()
  const [comments, setComments] = useState(initialComments)
  
  useEffect(() => {
    // 订阅新评论
    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          // 收到新评论，更新 UI
          setComments(prev => [payload.new as Comment, ...prev])
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId, supabase])
  
  return (
    <section>
      {comments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </section>
  )
}

```

---

### 场景 2：实时协作看板（Trello 类）

**核心功能：**
- 实时任务卡片拖拽同步
- 多用户在线状态显示
- 操作历史追踪

**数据库设计：**

```sql
-- 看板表
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 列表表
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 卡片表
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INT NOT NULL,
  assigned_to UUID REFERENCES profiles(id),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 活动日志表
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id),
  user_id UUID REFERENCES auth.users,
  action TEXT NOT NULL,  -- created, moved, updated, deleted
  target_type TEXT,      -- card, list
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

```

**实时同步实现：**

```typescript
// hooks/useBoardSync.ts

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export function useBoardSync(boardId: string) {
  const supabase = createClient()
  const [lists, setLists] = useState<List[]>([])
  
  useEffect(() => {
    // 初始加载
    loadBoardData()
    
    // 订阅列表变更
    const listsChannel = supabase
      .channel(`board:${boardId}:lists`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lists',
          filter: `board_id=eq.${boardId}`
        },
        (payload) => {
          handleListsChange(payload)
        }
      )
      .subscribe()
    
    // 订阅卡片变更
    const cardsChannel = supabase
      .channel(`board:${boardId}:cards`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards',
          filter: `board_id=eq.${boardId}`
        },
        (payload) => {
          handleCardsChange(payload)
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(listsChannel)
      supabase.removeChannel(cardsChannel)
    }
  }, [boardId])
  
  // 拖拽更新卡片位置
  const moveCard = async (cardId: string, newListId: string, newPosition: number) => {
    const { error } = await supabase
      .from('cards')
      .update({ 
        list_id: newListId, 
        position: newPosition 
      })
      .eq('id', cardId)
    
    if (error) throw error
    
    // 记录活动日志
    await supabase.from('activities').insert({
      board_id: boardId,
      user_id: supabase.auth.user()?.id,
      action: 'moved',
      target_type: 'card',
      target_id: cardId,
      metadata: { new_list_id: newListId, new_position: newPosition }
    })
  }
  
  return { lists, moveCard }
}

```

**Presence 在线状态：**

```typescript
// components/BoardPresence.tsx

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export function BoardPresence({ boardId, userId }: Props) {
  const supabase = createClient()
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  
  useEffect(() => {
    const channel = supabase.channel(`board:${boardId}:presence`)
    
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const users = Object.values(state).flat()
      setOnlineUsers(users)
    })
    
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // 追踪当前用户在线状态
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString()
        })
      }
    })
    
    // 定期更新在线状态
    const interval = setInterval(() => {
      channel.track({
        user_id: userId,
        online_at: new Date().toISOString()
      })
    }, 30000)  // 30 秒更新一次
    
    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [boardId, userId])
  
  return (
    <div className="online-users">
      {onlineUsers.map(user => (
        <Avatar key={user.user_id} userId={user.user_id} />
      ))}
    </div>
  )
}

```

---

### 场景 3：电商实时库存管理

**需求特点：**
- 库存变更实时同步
- 超卖预防（事务处理）
- 多仓库库存管理

**数据库设计：**

```sql
-- 商品表
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 库存表
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  warehouse_id UUID REFERENCES warehouses(id),
  quantity INT NOT NULL DEFAULT 0,
  reserved INT NOT NULL DEFAULT 0,  -- 已锁定待支付库存
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订单表
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending/paid/shipped
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订单项表
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

-- 库存变更日志
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  warehouse_id UUID REFERENCES warehouses(id),
  change_type TEXT NOT NULL,  -- purchase/sale/return/adjustment
  quantity_change INT NOT NULL,
  reference_type TEXT,  -- order_id, purchase_order_id
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

```

**库存扣减函数（防止超卖）：**

```sql
-- 创建库存扣减函数（事务安全）
CREATE OR REPLACE FUNCTION reserve_inventory(
  p_product_id UUID,
  p_warehouse_id UUID,
  p_quantity INT
) RETURNS BOOLEAN AS $$
DECLARE
  v_available INT;
BEGIN
  -- 获取可用库存
  SELECT quantity - reserved INTO v_available
  FROM inventory
  WHERE product_id = p_product_id 
    AND warehouse_id = p_warehouse_id
  FOR UPDATE;  -- 行级锁，防止并发
  
  -- 检查库存是否充足
  IF v_available >= p_quantity THEN
    -- 锁定库存
    UPDATE inventory
    SET reserved = reserved + p_quantity
    WHERE product_id = p_product_id 
      AND warehouse_id = p_warehouse_id;
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 确认订单（实际扣减库存）
CREATE OR REPLACE FUNCTION confirm_order(
  p_order_id UUID
) RETURNS VOID AS $$
BEGIN
  -- 将预定库存转为实际扣减
  UPDATE inventory i
  SET quantity = quantity - oi.quantity,
      reserved = reserved - oi.quantity
  FROM order_items oi
  WHERE oi.order_id = p_order_id
    AND i.product_id = oi.product_id;
  
  -- 更新订单状态
  UPDATE orders
  SET status = 'paid'
  WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql;

```

**实时库存同步：**

```typescript
// hooks/useInventory.ts

export function useInventory(productId: string) {
  const supabase = useSupabase()
  const [inventory, setInventory] = useState<Inventory | null>(null)
  
  useEffect(() => {
    // 初始加载库存
    loadInventory()
    
    // 订阅库存变更
    const channel = supabase
      .channel(`inventory:${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'inventory',
          filter: `product_id=eq.${productId}`
        },
        (payload) => {
          // 实时更新库存显示
          setInventory(payload.new as Inventory)
        }
      )
      .subscribe()
    
    return () => supabase.removeChannel(channel)
  }, [productId])
  
  // 下单锁定库存
  const reserveStock = async (quantity: number) => {
    const { data, error } = await supabase.rpc('reserve_inventory', {
      p_product_id: productId,
      p_warehouse_id: defaultWarehouseId,
      p_quantity: quantity
    })
    
    if (!data) {
      throw new Error('库存不足')
    }
    
    return data
  }
  
  return { inventory, reserveStock }
}

```

---

## 8.2 性能优化实践

### 数据库查询优化

```sql
-- 1. 为常用查询创建索引
CREATE INDEX idx_posts_author_status ON posts(author_id, status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id, created_at DESC);

-- 2. 使用覆盖索引减少回表
CREATE INDEX idx_posts_cover ON posts(id, title, cover_image) 
  WHERE status = 'published';

-- 3. 物化视图预计算复杂查询
CREATE MATERIALIZED VIEW post_stats AS
SELECT 
  p.id,
  COUNT(c.id) as comment_count,
  COUNT(DISTINCT c.author_id) as unique_commenters
FROM posts p
LEFT JOIN comments c ON c.post_id = p.id
GROUP BY p.id;

-- 定期刷新
REFRESH MATERIALIZED VIEW CONCURRENTLY post_stats;

```

### 前端性能优化

```typescript
// 1. 使用 React Query 缓存
import { useQuery } from '@tanstack/react-query'

function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select()
        .eq('status', 'published')
      return data
    },
    staleTime: 5 * 60 * 1000  // 5 分钟缓存
  })
}

// 2. 分页加载（游标分页）
async function loadComments(postId: string, cursor?: string) {
  let query = supabase
    .from('comments')
    .select()
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .limit(20)
  
  if (cursor) {
    query = query.lt('id', cursor)  // 游标分页
  }
  
  const { data } = await query
  return data
}

// 3. 图片懒加载
<Image 
  src={post.cover_image} 
  alt={post.title}
  loading="lazy"
  width={800}
  height={400}
/>

```

### 批量操作优化

```typescript
// ❌ 避免 N+1 查询
for (const post of posts) {
  const { data } = await supabase
    .from('comments')
    .select()
    .eq('post_id', post.id)  // 每个帖子一次查询
}

// ✅ 使用 IN 查询批量获取
const { data: comments } = await supabase
  .from('comments')
  .select()
  .in('post_id', posts.map(p => p.id))  // 一次查询

// 按 post_id 分组
const commentsByPost = comments.reduce((acc, comment) => {
  acc[comment.post_id] = [...(acc[comment.post_id] || []), comment]
  return acc
}, {})

```

---

## 8.3 安全最佳实践

### RLS 策略检查清单

```sql
-- 1. 确保所有敏感表都启用了 RLS
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename NOT IN (
    SELECT tablename FROM pg_policies
  );

-- 2. 测试 RLS 策略
-- 使用不同角色执行查询验证
SET ROLE authenticated;
SELECT * FROM posts;  -- 应该只看到已发布的文章

-- 3. 避免策略冲突
-- 检查是否存在互相矛盾的策略
SELECT * FROM pg_policies 
WHERE tablename = 'posts';

```

### 敏感数据保护

```sql
-- 1. 不要在 RLS 策略中暴露敏感字段
CREATE TABLE user_secrets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  api_key TEXT,  -- 敏感
  created_at TIMESTAMPTZ
);

-- 策略：只有本人可以查看
CREATE POLICY "本人查看密钥" ON user_secrets
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. 使用视图隐藏敏感列
CREATE VIEW public_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM profiles;  -- 不包含 email、phone 等敏感字段

-- 3. 审计日志
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  table_name TEXT,
  action TEXT,  -- INSERT/UPDATE/DELETE
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

```

### API 密钥管理

```typescript
// ❌ 不要在前端暴露 Service Role Key
const supabase = createClient(url, 'SERVICE_ROLE_KEY')  // 危险！

// ✅ 只使用 Anon Key
const supabase = createClient(url, 'ANON_KEY')  // 安全

// ✅ 敏感操作通过 Edge Function
// 客户端调用
const { data } = await supabase.functions.invoke('admin-action', {
  body: { action: 'delete-user', userId }
})

// Edge Function 内部使用 Service Role Key
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // 服务端安全
)

```

---

## 8.4 常见问题与解决方案

### 问题 1：Realtime 连接频繁断开

**症状：** WebSocket 连接不稳定，实时同步中断

**解决方案：**
```typescript
// 1. 启用自动重连
const channel = supabase.channel('my-channel', {
  config: {
    presence: { key: 'user-1' }
  }
})

// 2. 监听连接状态
channel.on('system', { event: '*' }, (payload) => {
  console.log('System event:', payload)
})

supabase.realtime.onOpen(() => console.log('Connected'))
supabase.realtime.onClose(() => console.log('Disconnected'))
supabase.realtime.onError((error) => {
  console.error('Connection error:', error)
  // SDK 会自动重连（指数退避）
})

// 3. 定期发送心跳
setInterval(() => {
  channel.track({ online_at: new Date().toISOString() })
}, 30000)

```

### 问题 2：RLS 策略导致查询失败

**症状：** 查询返回空数据或权限错误

**调试步骤：**
```sql
-- 1. 检查 RLS 是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 2. 查看现有策略
SELECT * FROM pg_policies 
WHERE tablename = 'your_table';

-- 3. 测试当前用户的权限
SELECT auth.uid();  -- 查看当前用户 ID
SELECT current_setting('request.jwt.claims', true)::jsonb->>'sub';

-- 4. 临时禁用 RLS 测试（仅开发环境）
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
```

### 问题 3：大文件上传失败

**症状：** 超过 50MB 的文件上传超时或失败

**解决方案：**
```typescript
// 使用分片上传
async function uploadLargeFile(file: File, path: string) {
  const CHUNK_SIZE = 5 * 1024 * 1024  // 5MB
  const chunks = []
  
  // 分片
  for (let i = 0; i < file.size; i += CHUNK_SIZE) {
    chunks.push(file.slice(i, i + CHUNK_SIZE))
  }
  
  // 创建上传会话
  const { data: uploadSession } = await supabase.storage
    .from('bucket')
    .createSignedUploadUrl(path)
  
  // 并行上传分片
  await Promise.all(
    chunks.map((chunk, index) => 
      uploadChunk(uploadSession.signedUrl, chunk, index)
    )
  )
  
  // 完成上传
  await supabase.storage.from('bucket').moveToDestination(path)
}

```

---

## 本章小结

本章介绍了 Supabase 的实际应用场景和最佳实践：

1. **典型应用场景**：
   - 全栈博客平台（Next.js + Supabase）
   - 实时协作看板（Trello 类）
   - 电商实时库存管理

2. **性能优化**：
   - 数据库索引、物化视图
   - 前端缓存、分页加载
   - 批量操作避免 N+1

3. **安全实践**：
   - RLS 策略检查
   - 敏感数据保护
   - API 密钥管理

4. **常见问题**：
   - Realtime 连接断开处理
   - RLS 策略调试
   - 大文件上传方案
