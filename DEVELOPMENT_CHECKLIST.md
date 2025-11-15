# AirBrB 开发流程清单 (Development Checklist)

> **项目**: COMP6080 Assignment 4 - Airbnb Clone
> **截止日期**: Friday 21st November, 10pm
> **技术栈**: React 18 + Vite + Vitest
> **工作模式**: 个人项目

---

## 📋 目录 (Table of Contents)

1. [项目初始设置](#1-项目初始设置)
2. [技术约束和规范](#2-技术约束和规范)
3. [功能开发路线图](#3-功能开发路线图)
4. [测试要求](#4-测试要求)
5. [部署要求](#5-部署要求)
6. [提交前检查](#6-提交前检查)

---

## 1. 项目初始设置

### 1.1 环境配置

- [ ] **Node.js 版本管理**
  ```bash
  # 安装 nvm（如果还没有）
  # 在 frontend 目录
  cd frontend
  nvm use  # 切换到 v20.17.0
  ```

- [ ] **安装依赖**
  ```bash
  # Frontend
  cd frontend
  npm install

  # Backend (在不同terminal)
  cd backend
  nvm use  # 切换到 backend 指定版本
  npm install
  ```

- [ ] **运行开发服务器**
  ```bash
  # Terminal 1: Backend
  cd backend
  npm start  # 运行在 http://localhost:5005

  # Terminal 2: Frontend
  cd frontend
  npm run dev  # 运行在 Vite 指定端口
  ```

- [ ] **运行 setup.sh**
  ```bash
  ./util/setup.sh  # 设置 Git commit 检查
  ```

### 1.2 项目结构规划

**推荐目录结构：**
```
frontend/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── auth/           # 认证相关组件
│   │   ├── listing/        # 房源相关组件
│   │   ├── booking/        # 预订相关组件
│   │   ├── common/         # 通用组件 (Button, Input, Modal等)
│   │   └── layout/         # 布局组件 (Header, Footer等)
│   ├── pages/              # 页面组件
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── HostedListingsPage.jsx
│   │   ├── ListingDetailPage.jsx
│   │   ├── EditListingPage.jsx
│   │   └── BookingManagementPage.jsx
│   ├── services/           # API 调用
│   │   ├── api.js         # API 基础配置
│   │   ├── authService.js
│   │   ├── listingService.js
│   │   └── bookingService.js
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useAuth.js
│   │   ├── useListings.js
│   │   └── useBookings.js
│   ├── context/            # Context API
│   │   └── AuthContext.jsx
│   ├── utils/              # 工具函数
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── styles/             # 样式文件（如果使用CSS Modules）
│   ├── config.json         # Backend配置
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

---

## 2. 技术约束和规范

### 2.1 ⚠️ 绝对禁止 (PROHIBITED)

- ❌ **禁止使用 universal CSS / 直接导入 CSS 文件**
  - ✅ 必须使用: CSS Modules / Styled Components / UI Framework (Material-UI, Radix UI等)
  - ✅ 允许: Tailwind CSS setup files, UI library setup, body样式覆盖

- ❌ **禁止使用 `alert()`**
  - ✅ 必须使用: UI组件 (Material-UI Snackbar, Dialog等)

- ❌ **禁止修改 backend**（除非 deployment.md 明确要求）

- ❌ **禁止使用其他框架** (Angular, Vue等)
  - ✅ 必须使用: React.js

- ❌ **禁止直接 DOM 操作**
  - ✅ 使用 React 方式处理一切

- ❌ **禁止页面刷新**
  - ✅ 必须是完整的单页应用 (SPA)

- ❌ **禁止使用 git 交互模式**
  - ❌ 不能用: `git rebase -i`, `git add -i`

### 2.2 ✅ 必须遵守的规范

#### 2.2.1 代码质量

- **ESLint**: 代码必须 100% 通过 ESLint（无 warnings/errors）
  ```bash
  cd frontend
  npm run lint  # 必须无错误
  ```

- **代码风格**:
  - 清晰的注释
  - 有意义的变量命名
  - 遵循 React.js 最佳实践
  - 遵循课程 style guide

#### 2.2.2 浏览器兼容性

- 必须在最新版 **Google Chrome** 测试
- 支持多种操作系统

#### 2.2.3 响应式设计

- **最小支持分辨率**: 400px 宽 × 700px 高
- 响应式设计占该部分 **25% 分数**

#### 2.2.4 文件管理

- **必须工作在 `frontend/` 文件夹**（违反扣 50% 分数）
- 所有 package.json 更改必须提交到 Git

#### 2.2.5 引用代码规范

- 可以使用少量来自 Stack Overflow 等的通用代码
- **必须在注释中清晰标注来源**
- 不能使用他人编写的特定于作业的代码

---

## 3. 功能开发路线图

### 阶段 0: 准备工作

#### Step 0.1: 选择 UI 库并设置
```bash
# 推荐选项1: Material-UI
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# 推荐选项2: Radix UI + Tailwind CSS
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install -D tailwindcss postcss autoprefixer
```

#### Step 0.2: 设置路由
```bash
npm install react-router-dom
```

#### Step 0.3: 设置状态管理
- Context API (内置)
- 或安装: `npm install zustand` (可选)

#### Step 0.4: 设置测试环境
- Vitest 已配置
- Component Testing: React Testing Library (已安装)
- UI Testing: 需要配置 Cypress（如果选择用它）
```bash
npm install -D cypress  # 如果使用 Cypress
```

---

### 阶段 1: 认证系统 (Feature Set 1 - 5%)

**优先级**: 🔴 HIGH - 其他功能依赖此模块

#### 2.1.1 登录页面 (Login Screen)

**要做什么：**
- 创建独立路由的登录页面 (`/login`)
- 表单包含 email 和 password 字段
- 提交按钮
- 错误处理和显示

**如何做：**
```jsx
// src/pages/LoginPage.jsx
// 1. 创建表单组件
// 2. 使用 controlled components
// 3. 表单验证
// 4. API 调用: POST /user/auth/login
// 5. 存储 token 到 localStorage
// 6. 使用 Context 管理登录状态
// 7. 成功后重定向到首页
```

**验收标准：**
- [ ] 独立路由 `/login` 存在
- [ ] Email 和 password 输入框正常工作
- [ ] 点击提交按钮或按 Enter 键都能提交
- [ ] 失败时显示合理的错误消息（使用 UI 组件，不是 alert）
- [ ] 成功登录后保存 token 并重定向

**技术要点：**
```javascript
// API 调用示例
const response = await fetch('http://localhost:5005/user/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
if (data.token) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('email', email);
}
```

**要避免什么：**
- ❌ 不要使用 alert() 显示错误
- ❌ 不要硬编码 API URL（使用 config.json）
- ❌ 不要在未加密的情况下存储密码
- ❌ 表单未验证就提交

#### 2.1.2 注册页面 (Register Screen)

**要做什么：**
- 创建独立路由的注册页面 (`/register`)
- 表单包含 email, password, name, confirm password
- 密码匹配验证
- 错误处理

**如何做：**
```jsx
// src/pages/RegisterPage.jsx
// 1. 创建表单（email, password, confirmPassword, name）
// 2. 前端验证密码匹配
// 3. API 调用: POST /user/auth/register
// 4. 注册成功后自动登录或跳转到登录页
```

**验收标准：**
- [ ] 独立路由 `/register` 存在
- [ ] Email, password, name, confirm password 输入框
- [ ] 两次密码不匹配时，提交前显示错误
- [ ] 点击按钮或按 Enter 键都能提交
- [ ] 失败时显示合理错误消息
- [ ] 成功注册后处理（登录或跳转）

**技术要点：**
```javascript
// 密码匹配验证
if (password !== confirmPassword) {
  setError('Passwords do not match');
  return; // 阻止提交
}

// API 调用
const response = await fetch('http://localhost:5005/user/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, name })
});
```

**要避免什么：**
- ❌ 不验证密码匹配就提交到后端
- ❌ 不处理邮箱格式验证
- ❌ 使用 alert 显示错误

#### 2.1.3 登出按钮 (Logout Button)

**要做什么：**
- 创建全局可用的登出按钮
- 点击后清除登录状态
- 返回到首页

**如何做：**
```jsx
// src/components/layout/Header.jsx
// 1. 在导航栏添加登出按钮（仅登录用户可见）
// 2. 调用 POST /user/auth/logout
// 3. 清除 localStorage
// 4. 更新 Context 状态
// 5. 重定向到首页
```

**验收标准：**
- [ ] 登录用户可见登出按钮
- [ ] 点击后调用 logout API
- [ ] 清除本地存储的 token
- [ ] 返回到首页 (`/`)
- [ ] UI 更新为未登录状态

**技术要点：**
```javascript
const handleLogout = async () => {
  const token = localStorage.getItem('token');
  await fetch('http://localhost:5005/user/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  navigate('/');
};
```

#### 2.1.4 所有页面的导航元素

**要做什么：**
- 为登录用户在所有页面显示：
  - 登出按钮
  - "我的房源"按钮（跳转到托管房源页面）
  - "所有房源"按钮（跳转到首页）

**如何做：**
```jsx
// src/components/layout/Header.jsx
// 根据登录状态条件渲染：
// - 未登录: Login, Register 按钮
// - 已登录: My Listings, All Listings, Logout 按钮
```

**验收标准：**
- [ ] 登录用户在所有页面都能看到登出按钮
- [ ] "查看我的房源"按钮存在且跳转正确
- [ ] "查看所有房源"按钮存在且跳转正确
- [ ] 未登录用户看到登录/注册选项

**Progress.csv 更新：**
```csv
2.1.1,YES
2.1.2,YES
2.1.3,YES
2.1.4,YES
```

---

### 阶段 2: 创建和编辑房源 (Feature Set 2 - 11%)

**优先级**: 🔴 HIGH - 核心功能

#### 2.2.1 托管房源列表页面 (Hosted Listings Screen)

**要做什么：**
- 创建独立路由显示当前用户创建的所有房源
- 每个房源显示特定信息
- 提供编辑和删除功能

**如何做：**
```jsx
// src/pages/HostedListingsPage.jsx
// 1. API 调用: GET /listings (获取所有房源)
// 2. 过滤出当前用户的房源 (listing.owner === userEmail)
// 3. 对每个房源显示：
//    - Title, Property Type, Beds数量, Bathrooms数量
//    - Thumbnail, SVG星级评分, 评论总数, 每晚价格
// 4. 每个房源提供：编辑按钮、删除按钮
```

**验收标准：**
- [ ] 独立路由 `/my-listings` 或 `/hosted-listings`
- [ ] 显示所有当前用户创建的房源
- [ ] 每个房源卡片显示：
  - [ ] Title（标题）
  - [ ] Property Type（房产类型）
  - [ ] Number of beds（床位数量，不是卧室数量）
  - [ ] Number of bathrooms（浴室数量）
  - [ ] Thumbnail（缩略图）
  - [ ] SVG rating（星级评分 - 基于用户评分计算）
  - [ ] Total reviews（评论总数）
  - [ ] Price per night（每晚价格）
- [ ] 每个房源有编辑按钮（跳转到编辑页面）
- [ ] 每个房源有删除按钮

**技术要点：**
```javascript
// 计算平均评分
const calculateRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

// SVG 星级显示
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  // 渲染 5 个星星，根据 rating 填充
};

// 删除房源
const handleDelete = async (listingId) => {
  const token = localStorage.getItem('token');
  await fetch(`http://localhost:5005/listings/${listingId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  // 刷新列表
};
```

**要避免什么：**
- ❌ 显示其他用户的房源
- ❌ 未确认就删除（考虑添加确认对话框）
- ❌ 删除后不刷新列表

#### 2.2.2 创建新房源 (Hosted Listing Create)

**要做什么：**
- 在托管房源页面添加"创建新房源"按钮
- 点击后显示表单（可以是模态框或新页面）
- 收集所有必需信息并创建房源

**如何做：**
```jsx
// src/pages/CreateListingPage.jsx 或 Modal
// 表单字段：
// 1. Listing Title (文本)
// 2. Listing Address (对象: street, city, state, postcode, country)
// 3. Price per night (数字)
// 4. Thumbnail (图片 - base64 或默认图)
// 5. Property Type (下拉: house, apartment, etc.)
// 6. Number of bathrooms (数字)
// 7. Bedrooms (数组: [{beds: [{type, count}]}])
// 8. Amenities (数组: WiFi, Kitchen, etc.)
//
// API: POST /listings/new
```

**验收标准：**
- [ ] "创建新房源"按钮在托管房源页面
- [ ] 表单包含所有必填字段：
  - [ ] Title
  - [ ] Address（完整地址）
  - [ ] Price per night
  - [ ] Thumbnail（如未提供使用默认图）
  - [ ] Property Type
  - [ ] Number of bathrooms
  - [ ] Bedrooms（包含床位类型和数量）
  - [ ] Amenities
- [ ] 所有字段填写正确后能成功创建
- [ ] 创建后立即显示在托管房源列表

**技术要点：**
```javascript
// 数据结构示例
const listingData = {
  title: "Cozy Apartment",
  address: {
    street: "123 Main St",
    city: "Sydney",
    state: "NSW",
    postcode: "2000",
    country: "Australia"
  },
  price: 150,
  thumbnail: "base64string...", // 或 URL
  metadata: {
    propertyType: "apartment",
    bathrooms: 2,
    bedrooms: [
      {
        beds: [
          { type: "queen", count: 1 },
          { type: "single", count: 2 }
        ]
      }
    ],
    amenities: ["WiFi", "Kitchen", "Air Conditioning"]
  }
};

// 图片转 base64
const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
```

**要避免什么：**
- ❌ 缺少必填字段就提交
- ❌ 不验证价格为正数
- ❌ 卧室/床位数据结构不正确
- ❌ 不处理图片上传失败

#### 2.2.3 YouTube 视频缩略图 (🙉🙉🙉 双人功能，个人可选)

**要做什么：**
- 允许用户使用 YouTube 视频作为房源缩略图
- 只需要处理 embedded YouTube URLs

**如何做：**
```jsx
// 在创建/编辑表单添加选项：
// - 选择上传图片 或 YouTube URL
// - 如果是 YouTube URL，提取 video ID
// - 存储到 thumbnail 字段
// - 在显示时用 iframe 嵌入

// 提取 YouTube ID
const getYouTubeId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

// 渲染
{isYouTubeUrl ? (
  <iframe
    src={`https://www.youtube.com/embed/${videoId}`}
    frameBorder="0"
    allow="autoplay; encrypted-media"
  />
) : (
  <img src={thumbnail} alt="listing" />
)}
```

**验收标准：**
- [ ] 创建/编辑时可以选择 YouTube URL
- [ ] 只处理 embedded YouTube URLs
- [ ] 视频可播放
- [ ] 在列表和详情页正确显示

#### 2.2.4 编辑房源 (Edit Listing)

**要做什么：**
- 创建编辑页面（带 listing ID 参数的路由）
- 允许修改房源所有信息
- 保存更新

**如何做：**
```jsx
// src/pages/EditListingPage.jsx
// 路由: /listings/:id/edit
// 1. 根据 ID 获取房源详情: GET /listings/:id
// 2. 预填充表单
// 3. 允许编辑所有字段
// 4. PUT /listings/:id 保存更新
// 5. 可以自动保存或提供保存按钮
```

**验收标准：**
- [ ] 独立路由 `/listings/:id/edit`
- [ ] 可编辑字段：
  - [ ] Title
  - [ ] Address
  - [ ] Thumbnail
  - [ ] Price
  - [ ] Property Type
  - [ ] Number of bathrooms
  - [ ] Bedrooms (包括床位)
  - [ ] Amenities
  - [ ] Property images list
- [ ] 保存后返回托管房源页面或自动保存
- [ ] 显示保存成功/失败消息

**技术要点：**
```javascript
// 获取房源详情
const fetchListing = async (id) => {
  const response = await fetch(`http://localhost:5005/listings/${id}`);
  const data = await response.json();
  return data.listing;
};

// 更新房源
const updateListing = async (id, updates) => {
  const token = localStorage.getItem('token');
  await fetch(`http://localhost:5005/listings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
};
```

#### 2.2.5 发布房源 (Publishing a Listing)

**要做什么：**
- 让房源"上线"对其他用户可见
- 必须设置至少一个可用日期范围
- 支持多个日期范围

**如何做：**
```jsx
// 在托管房源页面，每个房源添加"发布"按钮
// 点击后显示日期范围选择器：
// 1. 可以添加多个日期范围
// 2. 每个范围包含 start 和 end 日期
// 3. 聚合所有范围并一次性提交
// API: PUT /listings/publish/:id
```

**验收标准：**
- [ ] 托管房源页面有"发布"功能
- [ ] 必须至少有一个日期范围才能发布
- [ ] 支持多个日期范围
- [ ] 可以按以下任一格式存储：
  ```javascript
  // 格式1:
  availability: [
    { start: "2024-11-15", end: "2024-11-20" },
    { start: "2024-11-25", end: "2024-11-30" }
  ]

  // 格式2:
  availability: [
    "2024-11-15", "2024-11-20",
    "2024-11-25", "2024-11-30"
  ]
  ```
- [ ] 发布后房源在首页可见

**技术要点：**
```javascript
// 发布房源
const publishListing = async (id, availability) => {
  const token = localStorage.getItem('token');
  await fetch(`http://localhost:5005/listings/publish/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ availability })
  });
};

// 日期范围选择器组件
const AvailabilityPicker = () => {
  const [ranges, setRanges] = useState([]);
  const addRange = () => {
    setRanges([...ranges, { start: '', end: '' }]);
  };
  // ...
};
```

**要避免什么：**
- ❌ 允许没有日期范围就发布
- ❌ 不支持多个日期范围（需要支持才能满分）
- ❌ 日期格式不正确

**Progress.csv 更新：**
```csv
2.2.1,YES
2.2.2,YES
2.2.3,YES/NO  # 取决于是否实现（双人功能）
2.2.4,YES
2.2.5,YES
```

---

### 阶段 3: 首页和搜索 (Feature Set 3 - 9%)

**优先级**: 🔴 HIGH - 核心功能

#### 2.3.1 房源列表页面 (Listings Screen / Landing Page)

**要做什么：**
- 创建首页显示所有已发布的房源
- 任何人（登录或未登录）都可以访问
- 特定排序逻辑

**如何做：**
```jsx
// src/pages/LandingPage.jsx
// 路由: / (根路径)
// 1. 获取所有房源: GET /listings
// 2. 过滤出已发布的房源 (published === true)
// 3. 如果用户已登录：
//    - 获取用户的预订: GET /bookings
//    - 将用户有 accepted/pending 预订的房源排在前面
// 4. 剩余房源按标题字母顺序排列
// 5. 每个房源显示：Title, Thumbnail, Reviews数量
```

**验收标准：**
- [ ] 独立路由 `/` (根路径)
- [ ] 这是默认加载的页面
- [ ] 显示所有已发布的房源
- [ ] 每个房源显示：
  - [ ] Title
  - [ ] Thumbnail（或视频）
  - [ ] Total reviews 数量
  - [ ] (可选: 其他信息)
- [ ] 排序逻辑：
  - [ ] 如果用户已登录：
    - [ ] 用户有 accepted/pending 预订的房源排在最前
    - [ ] 其余按标题字母顺序
  - [ ] 如果未登录：
    - [ ] 全部按标题字母顺序

**技术要点：**
```javascript
// 排序逻辑
const sortListings = (listings, userBookings) => {
  const listingsWithBookings = [];
  const listingsWithoutBookings = [];

  listings.forEach(listing => {
    const hasBooking = userBookings.some(booking =>
      booking.listingId === listing.id &&
      (booking.status === 'accepted' || booking.status === 'pending')
    );

    if (hasBooking) {
      listingsWithBookings.push(listing);
    } else {
      listingsWithoutBookings.push(listing);
    }
  });

  // 按字母排序其余房源
  listingsWithoutBookings.sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return [...listingsWithBookings, ...listingsWithoutBookings];
};
```

**要避免什么：**
- ❌ 显示未发布的房源
- ❌ 排序逻辑错误
- ❌ 未登录用户看不到首页

#### 2.3.2 搜索和过滤 (Search Filters)

**要做什么：**
- 添加搜索功能
- 支持多种过滤器（一次使用一个）
- 支持升序/降序排序

**如何做：**
```jsx
// src/components/SearchBar.jsx
// 1. 文本搜索框 - 默认搜索 title 或 city
// 2. 过滤选项：
//    a. 卧室数量范围 (min-max 或 slider)
//    b. 日期范围 (两个日期选择器)
//    c. 价格范围 (min-max 或 slider)
//    d. 评分排序 (highest-to-lowest 或 lowest-to-highest)
// 3. 搜索按钮触发过滤
```

**验收标准：**
- [ ] 搜索区域存在
- [ ] 文本搜索框：
  - [ ] 搜索 title 或 city（不区分大小写，子串匹配）
  - [ ] 支持多个词的匹配
- [ ] 过滤器（一次只需要应用一个）：
  - [ ] 卧室数量（最小-最大）
  - [ ] 日期范围（只显示整个范围都可用的房源）
  - [ ] 价格范围（最小-最大）
  - [ ] 评分排序（高到低 或 低到高）
- [ ] 每个过滤器支持升序/降序
- [ ] 搜索按钮触发过滤
- [ ] 结果实时更新

**技术要点：**
```javascript
// 文本搜索
const textSearch = (listings, query) => {
  if (!query) return listings;

  const words = query.toLowerCase().split(' ');
  return listings.filter(listing => {
    const title = listing.title.toLowerCase();
    const city = listing.address.city.toLowerCase();

    return words.every(word =>
      title.includes(word) || city.includes(word)
    );
  });
};

// 卧室过滤
const filterByBedrooms = (listings, min, max) => {
  return listings.filter(listing => {
    const bedroomCount = listing.metadata.bedrooms.length;
    return bedroomCount >= min && bedroomCount <= max;
  });
};

// 日期范围过滤
const filterByDateRange = (listings, startDate, endDate) => {
  return listings.filter(listing => {
    // 检查房源的 availability 是否完全包含搜索的日期范围
    return listing.availability.some(range => {
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);
      return rangeStart <= new Date(startDate) &&
             rangeEnd >= new Date(endDate);
    });
  });
};

// 评分排序
const sortByRating = (listings, ascending = true) => {
  return [...listings].sort((a, b) => {
    const ratingA = calculateAverageRating(a.reviews);
    const ratingB = calculateAverageRating(b.reviews);
    return ascending ? ratingA - ratingB : ratingB - ratingA;
  });
};
```

**要避免什么：**
- ❌ 搜索区分大小写
- ❌ 不支持多词搜索
- ❌ 日期过滤不正确（必须整个范围都可用）
- ❌ 过滤器不工作或有bug

#### 2.3.3 多重过滤器 (🙉🙉🙉 双人功能，个人可选)

**要做什么：**
- 允许同时应用多个过滤器
- 只显示满足所有条件的房源

**如何做：**
```jsx
// 组合所有过滤器
const applyAllFilters = (listings, filters) => {
  let result = [...listings];

  if (filters.searchText) {
    result = textSearch(result, filters.searchText);
  }
  if (filters.bedrooms) {
    result = filterByBedrooms(result, filters.bedrooms.min, filters.bedrooms.max);
  }
  if (filters.dateRange) {
    result = filterByDateRange(result, filters.dateRange.start, filters.dateRange.end);
  }
  if (filters.priceRange) {
    result = filterByPrice(result, filters.priceRange.min, filters.priceRange.max);
  }
  if (filters.sortByRating) {
    result = sortByRating(result, filters.sortByRating === 'asc');
  }

  return result;
};
```

**验收标准：**
- [ ] 可以同时应用多个过滤器
- [ ] 只显示满足所有条件的房源
- [ ] 过滤器一直保持直到用户重置
- [ ] 无匹配时显示明确的"无房源"消息
- [ ] 有清除/重置过滤器的功能

**Progress.csv 更新：**
```csv
2.3.1,YES
2.3.2,YES
2.3.3,YES/NO  # 取决于是否实现
```

---

### 阶段 4: 查看和预订房源 (Feature Set 4 - 9%)

**优先级**: 🔴 HIGH - 核心功能

#### 2.4.1 房源详情页面 (View a Selected Listing)

**要做什么：**
- 创建房源详情页面
- 显示房源完整信息
- 如果用户已登录且有预订，显示预订状态

**如何做：**
```jsx
// src/pages/ListingDetailPage.jsx
// 路由: /listings/:id
// 1. 根据 ID 获取房源详情: GET /listings/:id
// 2. 显示所有信息
// 3. 如果用户已登录，获取该房源的预订并显示状态
// 4. 显示所有评论
```

**验收标准：**
- [ ] 独立路由 `/listings/:id`
- [ ] 从首页点击房源进入此页面
- [ ] 显示完整信息：
  - [ ] Title
  - [ ] Address (完整字符串格式)
  - [ ] Amenities
  - [ ] Price:
    - [ ] 如果从搜索带日期范围进入 → 显示"总价"
    - [ ] 否则 → 显示"每晚价格"
  - [ ] 所有房源图片（包括缩略图）
  - [ ] Property Type
  - [ ] Reviews (所有评论)
  - [ ] Review rating (平均评分)
  - [ ] Number of bedrooms
  - [ ] Number of beds (总床位数)
  - [ ] Number of bathrooms
- [ ] 如果用户已登录且有预订：
  - [ ] 显示预订状态
  - [ ] 如果有多个预订，显示所有状态

**技术要点：**
```javascript
// 地址格式化
const formatAddress = (address) => {
  return `${address.street}, ${address.city}, ${address.state} ${address.postcode}`;
};

// 计算总床位数
const countTotalBeds = (bedrooms) => {
  return bedrooms.reduce((total, bedroom) => {
    const bedroomBeds = bedroom.beds.reduce((sum, bed) =>
      sum + bed.count, 0
    );
    return total + bedroomBeds;
  }, 0);
};

// 计算价格（如果有日期范围）
const calculateTotalPrice = (pricePerNight, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return pricePerNight * nights;
};

// 获取用户的预订
const getUserBookingsForListing = async (listingId) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5005/bookings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.bookings.filter(b => b.listingId === listingId);
};
```

**要避免什么：**
- ❌ 不显示完整信息
- ❌ 地址格式不正确
- ❌ 价格计算错误
- ❌ 不显示预订状态

#### 2.4.2 预订房源 (Making a Booking)

**要做什么：**
- 允许已登录用户预订房源
- 选择日期范围
- 提交预订

**如何做：**
```jsx
// 在房源详情页添加预订表单
// 1. 两个日期选择器（开始和结束日期）
// 2. 提交按钮
// 3. API: POST /bookings/new
// 4. 显示临时确认消息
```

**验收标准：**
- [ ] 已登录用户可以在详情页看到预订表单
- [ ] 两个日期输入框（日/月/年）
- [ ] 确认预订按钮
- [ ] 可以对同一房源多次预订
- [ ] 可以预订已被其他用户预订的日期
- [ ] 预订长度计算正确（住宿晚数）
- [ ] 提交后显示临时确认消息

**技术要点：**
```javascript
// 预订长度计算（晚数）
// 例如: 11月15日到11月17日 = 2晚
// (15日到16日 + 16日到17日)
const calculateNights = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 创建预订
const createBooking = async (listingId, dateRange) => {
  const token = localStorage.getItem('token');
  await fetch('http://localhost:5005/bookings/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      listingId,
      dateRange: {
        start: dateRange.start,
        end: dateRange.end
      }
    })
  });
};
```

**要避免什么：**
- ❌ 未登录用户能预订
- ❌ 晚数计算错误
- ❌ 不允许重复预订
- ❌ 日期验证不正确

#### 2.4.3 留下评论 (Leaving a Review)

**要做什么：**
- 允许已登录用户留下评论
- 必须有 accepted 状态的预订才能评论
- 评论包括评分和文字

**如何做：**
```jsx
// 在房源详情页添加评论表单
// 1. 检查用户是否有 accepted 预订
// 2. 如果有，显示评论表单：
//    - 评分选择器 (1-5星)
//    - 评论文本框
// 3. API: PUT /listings/:id/review/:bookingid
// 4. 提交后立即显示在页面上
```

**验收标准：**
- [ ] 已登录用户可以留评论
- [ ] 只有有 accepted 预订的用户才能评论
- [ ] 评论包含：
  - [ ] Score (数字，通常1-5)
  - [ ] Comment (文本)
- [ ] 可以对同一房源留多个评论
- [ ] 如果用户有多个预订，可以用任何一个 accepted 的 bookingId
- [ ] 提交后评论立即显示在页面上

**技术要点：**
```javascript
// 检查是否有 accepted 预订
const hasAcceptedBooking = (bookings) => {
  return bookings.some(booking => booking.status === 'accepted');
};

// 提交评论
const submitReview = async (listingId, bookingId, review) => {
  const token = localStorage.getItem('token');
  await fetch(`http://localhost:5005/listings/${listingId}/review/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      review: {
        rating: review.rating,
        comment: review.comment
      }
    })
  });
};
```

**要避免什么：**
- ❌ 未登录用户能评论
- ❌ 没有 accepted 预订的用户能评论
- ❌ 评论不立即显示
- ❌ 不处理评论失败

#### 2.4.4 高级评分显示 (🙉🙉🙉 双人功能，个人可选)

**要做什么：**
- 鼠标悬停在星级评分上显示详细分布
- 点击特定星级查看该评分的所有评论

**如何做：**
```jsx
// 1. 计算每个星级的评论数量和百分比
// 2. 创建 Tooltip 组件显示分布
// 3. 点击星级打开模态框显示该星级的所有评论
```

**验收标准：**
- [ ] 鼠标悬停在星级上显示 tooltip
- [ ] Tooltip 显示：
  - [ ] 每个星级的评论数量
  - [ ] 百分比
- [ ] 点击星级打开对话框
- [ ] 对话框显示该星级的所有评论
- [ ] 可以关闭对话框

**技术要点：**
```javascript
// 计算星级分布
const calculateRatingDistribution = (reviews) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach(review => {
    const roundedRating = Math.round(review.rating);
    distribution[roundedRating]++;
  });

  const total = reviews.length;
  const percentages = {};
  Object.keys(distribution).forEach(star => {
    percentages[star] = {
      count: distribution[star],
      percentage: total > 0 ? (distribution[star] / total * 100).toFixed(1) : 0
    };
  });

  return percentages;
};
```

**Progress.csv 更新：**
```csv
2.4.1,YES
2.4.2,YES
2.4.3,YES
2.4.4,YES/NO  # 取决于是否实现
```

---

### 阶段 5: 管理预订 (Feature Set 5 - 9%)

**优先级**: 🟡 MEDIUM - 重要功能

#### 2.5.1 下架房源 (Removing a Live Listing)

**要做什么：**
- 允许房东下架已发布的房源
- 下架后其他用户无法看到
- 所有可用性被移除

**如何做：**
```jsx
// 在托管房源页面，每个已发布的房源添加"下架"按钮
// API: PUT /listings/unpublish/:id
// 下架后房源不再出现在首页
```

**验收标准：**
- [ ] 托管房源页面有"下架"按钮（针对已发布房源）
- [ ] 点击后调用 unpublish API
- [ ] 下架后房源不在首页显示
- [ ] 已预订的用户无法在首页看到该房源
- [ ] 移除所有可用性

**技术要点：**
```javascript
// 下架房源
const unpublishListing = async (listingId) => {
  const token = localStorage.getItem('token');
  await fetch(`http://localhost:5005/listings/unpublish/${listingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};
```

**要避免什么：**
- ❌ 下架后仍然可见
- ❌ 不移除可用性
- ❌ 未确认就下架（考虑添加确认）

#### 2.5.2 查看预订请求和历史 (Viewing Booking Requests)

**要做什么：**
- 创建预订管理页面
- 显示特定房源的所有预订请求
- 显示房源统计信息
- 允许接受/拒绝预订

**如何做：**
```jsx
// src/pages/BookingManagementPage.jsx
// 路由: /listings/:id/bookings
// 1. 从托管房源页面进入
// 2. 获取该房源的所有预订
// 3. 显示预订列表（可接受/拒绝）
// 4. 显示统计信息：
//    - 房源上线时长
//    - 预订历史
//    - 今年已预订天数
//    - 今年利润
```

**验收标准：**
- [ ] 独立路由 `/listings/:id/bookings`
- [ ] 从托管房源页面通过按钮/链接进入
- [ ] 显示该房源的所有预订请求
- [ ] 每个预订可以接受/拒绝
- [ ] 显示统计信息：
  - [ ] 房源上线时长（天数）
  - [ ] 预订历史（所有预订及其状态）
  - [ ] 今年已预订天数（所有 accepted 预订）
  - [ ] 今年利润（所有 accepted 预订的收入总和）

**技术要点：**
```javascript
// 获取房源的所有预订
const getListingBookings = async (listingId) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5005/bookings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.bookings.filter(b => b.listingId === listingId);
};

// 接受预订
const acceptBooking = async (bookingId) => {
  const token = localStorage.getItem('token');
  await fetch(`http://localhost:5005/bookings/accept/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

// 拒绝预订
const declineBooking = async (bookingId) => {
  const token = localStorage.getItem('token');
  await fetch(`http://localhost:5005/bookings/decline/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

// 计算房源上线天数
const calculateDaysOnline = (listing) => {
  if (!listing.postedOn) return 0;
  const posted = new Date(listing.postedOn);
  const now = new Date();
  const diffTime = Math.abs(now - posted);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 计算今年预订天数
const calculateBookedDaysThisYear = (bookings) => {
  const currentYear = new Date().getFullYear();
  let totalDays = 0;

  bookings.forEach(booking => {
    if (booking.status === 'accepted') {
      const start = new Date(booking.dateRange.start);
      const end = new Date(booking.dateRange.end);

      if (start.getFullYear() === currentYear || end.getFullYear() === currentYear) {
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        totalDays += nights;
      }
    }
  });

  return totalDays;
};

// 计算今年利润
const calculateProfitThisYear = (bookings, pricePerNight) => {
  const daysBooked = calculateBookedDaysThisYear(bookings);
  return daysBooked * pricePerNight;
};
```

**要避免什么：**
- ❌ 显示其他房源的预订
- ❌ 统计计算错误
- ❌ 不包含过去或未来的预订
- ❌ 只计算部分预订

**Progress.csv 更新：**
```csv
2.5.1,YES
2.5.2,YES
```

---

### 阶段 6: 高级功能 (Feature Set 6 - 7%)

**优先级**: 🟢 LOW - 可选/高级功能

#### 2.6.2 利润图表 (Listing Profits Graph)

**要做什么：**
- 在托管房源页面显示利润图表
- 显示过去30天的每日利润
- X轴：天数（0-30天前）
- Y轴：收入（$）

**如何做：**
```bash
# 安装图表库
npm install recharts
# 或
npm install chart.js react-chartjs-2
```

```jsx
// src/components/ProfitGraph.jsx
// 1. 计算过去30天每天的利润
// 2. 使用图表库渲染
// 3. 显示在托管房源页面
```

**验收标准：**
- [ ] 托管房源页面显示图表
- [ ] X轴：0-30（天数前）
- [ ] Y轴：收入（$）
- [ ] 显示所有房源的总利润
- [ ] 每天的利润是该天所有房源的收入总和

**技术要点：**
```javascript
// 计算过去30天每日利润
const calculateDailyProfits = (allListings, allBookings) => {
  const dailyProfits = new Array(31).fill(0);
  const today = new Date();

  allBookings.forEach(booking => {
    if (booking.status !== 'accepted') return;

    const start = new Date(booking.dateRange.start);
    const end = new Date(booking.dateRange.end);
    const listing = allListings.find(l => l.id === booking.listingId);

    if (!listing) return;

    // 对于每一晚
    let currentDate = new Date(start);
    while (currentDate < end) {
      const daysAgo = Math.floor((today - currentDate) / (1000 * 60 * 60 * 24));

      if (daysAgo >= 0 && daysAgo <= 30) {
        dailyProfits[30 - daysAgo] += listing.price;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return dailyProfits;
};

// Recharts 示例
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ProfitGraph = ({ data }) => {
  const chartData = data.map((profit, index) => ({
    daysAgo: 30 - index,
    profit: profit
  }));

  return (
    <LineChart width={600} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="daysAgo" label={{ value: 'Days Ago', position: 'insideBottom' }} />
      <YAxis label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="profit" stroke="#8884d8" />
    </LineChart>
  );
};
```

#### 2.6.3 上传 JSON 文件 (🙉🙉🙉 双人功能)

**要做什么：**
- 允许上传 .json 文件创建房源
- 前端验证数据结构
- 创建示例文件 `2.6.json`

**如何做：**
```jsx
// 在创建房源页面添加"上传JSON"选项
// 1. 文件上传输入
// 2. 读取文件内容
// 3. 验证数据结构
// 4. 填充表单或直接提交
```

**验收标准：**
- [ ] 创建房源时可以上传 .json 文件
- [ ] 前端验证数据结构
- [ ] 验证通过后创建房源
- [ ] 项目文件夹包含 `2.6.json` 示例文件

**技术要点：**
```javascript
// 读取 JSON 文件
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);

      // 验证结构
      if (validateListingJSON(json)) {
        createListingFromJSON(json);
      } else {
        showError('Invalid JSON structure');
      }
    } catch (error) {
      showError('Invalid JSON file');
    }
  };

  reader.readAsText(file);
};

// 验证 JSON 结构
const validateListingJSON = (data) => {
  const requiredFields = ['title', 'address', 'price', 'thumbnail', 'metadata'];
  return requiredFields.every(field => field in data);
};
```

**示例 2.6.json：**
```json
{
  "title": "Luxury Beach House",
  "address": {
    "street": "456 Ocean Drive",
    "city": "Bondi",
    "state": "NSW",
    "postcode": "2026",
    "country": "Australia"
  },
  "price": 300,
  "thumbnail": "https://example.com/image.jpg",
  "metadata": {
    "propertyType": "house",
    "bathrooms": 3,
    "bedrooms": [
      {
        "beds": [
          { "type": "king", "count": 1 }
        ]
      },
      {
        "beds": [
          { "type": "queen", "count": 2 }
        ]
      }
    ],
    "amenities": ["WiFi", "Pool", "Parking", "Beach Access"]
  }
}
```

#### 2.6.4 实时通知 (🙉🙉🙉 双人功能)

**要做什么：**
- 使用轮询实现实时通知
- 通知房东新预订请求
- 通知客人预订状态变更

**如何做：**
```jsx
// 1. 创建轮询机制（每10秒检查一次）
// 2. 检查新的预订或状态变化
// 3. 显示通知面板/下拉菜单
// 4. 区分已读/未读通知
```

**验收标准：**
- [ ] 实现轮询机制
- [ ] 通知事件：
  - [ ] 房东：收到新预订请求
  - [ ] 客人：预订被接受/拒绝
- [ ] 通知面板/下拉菜单在所有页面可访问
- [ ] 未读通知有视觉区分
- [ ] 查看后标记为已读

**技术要点：**
```javascript
// 轮询通知
useEffect(() => {
  const interval = setInterval(async () => {
    await checkForNotifications();
  }, 10000); // 每10秒

  return () => clearInterval(interval);
}, []);

// 检查通知
const checkForNotifications = async () => {
  const token = localStorage.getItem('token');

  // 获取所有预订
  const response = await fetch('http://localhost:5005/bookings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();

  // 对比上次检查的状态
  const newNotifications = findNewNotifications(data.bookings, lastCheckedBookings);

  if (newNotifications.length > 0) {
    setNotifications(prev => [...prev, ...newNotifications]);
  }

  setLastCheckedBookings(data.bookings);
};
```

**Progress.csv 更新：**
```csv
2.6.1,NO  # 注意：spec中没有2.6.1
2.6.2,YES
2.6.3,YES/NO  # 双人功能
```

---

## 4. 测试要求

### 4.1 Linting (必须通过)

**要做什么：**
- 确保代码 100% 通过 ESLint

**如何做：**
```bash
cd frontend
npm run lint
```

**验收标准：**
- [ ] 运行 `npm run lint` 无任何错误
- [ ] 无任何警告
- [ ] 没有部分分数 - 必须完全通过

**要避免什么：**
- ❌ 忽略 ESLint 规则
- ❌ 使用 `// eslint-disable`（除非绝对必要）
- ❌ 提交前不检查 lint

### 4.2 组件测试 (Component Testing - 60% of 5%)

**要做什么：**
- 测试 3 个不同的组件（个人）或 6 个（双人）
- 组件相似度不超过 50%
- 优秀的覆盖率、清晰度和设计

**如何做：**
```bash
# 使用 Vitest + React Testing Library
cd frontend
npm run test
```

**推荐测试的组件类型：**
1. **基础组件** (Button, Input, Card等)
2. **表单组件** (LoginForm, SearchBar等)
3. **列表组件** (ListingCard, BookingList等)

**验收标准：**
- [ ] 测试 3 个不同组件（个人）
- [ ] 每个组件相似度 < 50%
- [ ] 优秀的测试覆盖率（所有用例和边界情况）
- [ ] 清晰的注释和简洁的代码
- [ ] 良好的测试设计（逻辑顺序，无无意义测试）
- [ ] 推荐使用 shallow rendering

**示例测试：**
```jsx
// src/components/common/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass('custom-class');
  });
});
```

**要避免什么：**
- ❌ 测试非常相似的组件（如 Card 和 BigCard）
- ❌ 测试覆盖率不足
- ❌ 没有注释或代码过于复杂
- ❌ 测试没有实际价值

### 4.3 UI 测试 (UI Testing - 40% of 5%)

**要做什么：**
- 实现"happy path"测试
- 个人：在 TESTING.md 写测试说明
- 双人：额外实现另一个路径测试

**Happy Path 步骤：**
1. 成功注册
2. 成功创建新房源
3. 成功更新房源缩略图和标题
4. 成功发布房源
5. 成功下架房源
6. 成功预订
7. 成功登出
8. 成功重新登录

**如何做（使用 Cypress）：**
```bash
npm install -D cypress
npx cypress open
```

**示例 Cypress 测试：**
```javascript
// cypress/e2e/happy-path.cy.js
describe('Happy Path - Admin Flow', () => {
  const uniqueEmail = `test${Date.now()}@example.com`;
  const password = 'TestPass123!';

  it('completes the full admin happy path', () => {
    // 1. 注册
    cy.visit('http://localhost:5173/register');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmPassword"]').type(password);
    cy.get('input[name="name"]').type('Test User');
    cy.get('button[type="submit"]').click();

    cy.wait(1000);

    // 2. 创建房源
    cy.visit('http://localhost:5173/my-listings');
    cy.get('button').contains('Create New Listing').click();

    cy.get('input[name="title"]').type('Test Listing');
    cy.get('input[name="street"]').type('123 Test St');
    cy.get('input[name="city"]').type('Sydney');
    cy.get('input[name="price"]').type('100');
    // ... 填写其他字段
    cy.get('button[type="submit"]').click();

    cy.wait(1000);

    // 3. 更新缩略图和标题
    cy.contains('Test Listing').parent().find('button').contains('Edit').click();
    cy.get('input[name="title"]').clear().type('Updated Test Listing');
    // 更新缩略图
    cy.get('button').contains('Save').click();

    cy.wait(1000);

    // 4. 发布房源
    cy.visit('http://localhost:5173/my-listings');
    cy.contains('Updated Test Listing').parent().find('button').contains('Publish').click();
    // 添加日期范围
    cy.get('input[name="startDate"]').type('2024-12-01');
    cy.get('input[name="endDate"]').type('2024-12-31');
    cy.get('button').contains('Publish').click();

    cy.wait(1000);

    // 5. 下架房源
    cy.contains('Updated Test Listing').parent().find('button').contains('Unpublish').click();

    cy.wait(1000);

    // 6. 预订（需要先重新发布，然后用另一个账号预订）
    // 这里简化...

    // 7. 登出
    cy.get('button').contains('Logout').click();

    cy.wait(1000);

    // 8. 重新登录
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.wait(1000);
    cy.url().should('include', '/');
  });
});
```

**TESTING.md 内容：**
```markdown
# Testing Documentation

## Component Testing

### Tested Components
1. **Button Component** - Basic interactive button
   - Tests: render, onClick, disabled state, custom styling

2. **LoginForm Component** - User authentication form
   - Tests: input validation, form submission, error handling

3. **ListingCard Component** - Display listing information
   - Tests: data rendering, image display, rating calculation

### Testing Approach
- Used Vitest with React Testing Library
- Focused on user interactions and edge cases
- Achieved high coverage for critical user flows

## UI Testing

### Happy Path Test
Implemented comprehensive happy path covering:
1. User registration
2. Listing creation
3. Listing editing (thumbnail and title)
4. Publishing listing
5. Unpublishing listing
6. Making a booking
7. Logout
8. Re-login

### Testing Tool
Used Cypress for end-to-end testing with automatic wait times for async operations.

### Rationale
The happy path ensures all core functionality works together seamlessly, simulating real user workflow from registration to booking.
```

**验收标准：**
- [ ] Happy path 测试实现所有 8 个步骤
- [ ] 测试可以运行：`npm run test`
- [ ] 个人：TESTING.md 包含测试说明
- [ ] 双人：实现额外路径并在 TESTING.md 说明
- [ ] Tutor 会用空白后端运行测试

**要避免什么：**
- ❌ 测试依赖特定数据
- ❌ 测试步骤不完整
- ❌ 没有 cy.wait() 导致测试失败
- ❌ TESTING.md 内容空洞

---

## 5. 部署要求

### 5.1 前端部署到 Vercel (必须 - 5%)

**要做什么：**
- 将前端部署到 Vercel
- 在 progress.csv 填写部署 URL

**步骤：**

#### Step 1: 创建 GitHub 部署仓库
```bash
# 已完成 - 使用现有的 github remote
# 确保代码已推送
git push github master
```

#### Step 2: Vercel 部署
1. 访问 https://vercel.com
2. 使用 GitHub 登录
3. 点击 "Add New" → "Project"
4. 选择你的 GitHub 仓库
5. 配置项目：
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 点击 "Deploy"

#### Step 3: 配置域名
1. 部署成功后，进入 Project Settings
2. 进入 Domains
3. 编辑域名，包含你的 zID
4. 例如：`z5363412-airbrb-fe.vercel.app`

#### Step 4: 更新 progress.csv
```csv
FE_DEPLOYED_URL=https://z5363412-airbrb-fe.vercel.app
```

**验收标准：**
- [ ] 前端成功部署到 Vercel
- [ ] URL 包含 zID 恰好一次
- [ ] progress.csv 正确填写 FE_DEPLOYED_URL
- [ ] URL 以 http/https 开头
- [ ] URL 不以 `/` 结尾
- [ ] 网站可以访问

**要避免什么：**
- ❌ URL 不包含 zID
- ❌ URL 格式错误
- ❌ 网站无法访问
- ❌ 忘记更新 progress.csv

### 5.2 后端部署 (可选 - Bonus)

**要做什么：**
- 修改后端使用 Upstash Redis
- 部署后端到 Vercel
- 连接前端和后端

**如何做：**
参考 deployment.md 中的指南：
- Vercel Upstash Redis Integration
- 修改后端数据库操作
- 创建 vercel.json

**这是高级任务，不是必需的！**

---

## 6. 提交前检查清单

### 6.1 功能完整性

- [ ] **所有必需功能已实现并测试**
  - [ ] 2.1: 认证系统 (Login, Register, Logout)
  - [ ] 2.2: 房源创建和编辑
  - [ ] 2.3: 首页和搜索
  - [ ] 2.4: 查看和预订
  - [ ] 2.5: 管理预订
  - [ ] 2.6: 高级功能（至少 2.6.2）

- [ ] **progress.csv 正确填写**
  ```bash
  # 检查每个功能的状态
  cat progress.csv
  ```

### 6.2 代码质量

- [ ] **ESLint 完全通过**
  ```bash
  cd frontend
  npm run lint
  # 应该无错误和警告
  ```

- [ ] **代码规范**
  - [ ] 有意义的变量命名
  - [ ] 清晰的注释
  - [ ] 遵循 React 最佳实践
  - [ ] 代码模块化良好

- [ ] **样式规范**
  - [ ] 不使用 universal CSS
  - [ ] 使用 CSS Modules / Styled Components / UI Framework
  - [ ] 不使用 alert()

### 6.3 响应式设计

- [ ] **测试最小分辨率：400px × 700px**
  ```
  在 Chrome DevTools 中测试：
  1. F12 打开开发者工具
  2. 切换到移动设备视图
  3. 设置自定义分辨率 400x700
  4. 测试所有页面
  ```

- [ ] **主要页面在移动端正常工作**
  - [ ] 登录/注册
  - [ ] 首页
  - [ ] 房源详情
  - [ ] 创建/编辑房源

### 6.4 测试

- [ ] **组件测试通过**
  ```bash
  cd frontend
  npm run test
  # 确保所有测试通过
  ```

- [ ] **UI 测试实现**
  - [ ] Happy path 完整
  - [ ] TESTING.md 已填写

### 6.5 文档

- [ ] **TESTING.md 已完成**
  - [ ] 组件测试说明
  - [ ] UI 测试说明
  - [ ] 测试理由

- [ ] **A11Y.md 已完成**
  - [ ] 列出所有可访问性改进
  - [ ] 只会评分文件中描述的内容

- [ ] **UIUX.md 已完成**
  - [ ] 列出所有 UI/UX 改进
  - [ ] 只会评分文件中描述的内容

- [ ] **BONUS.md（如果有额外功能）**
  - [ ] 列出所有额外功能
  - [ ] 说明功能价值

### 6.6 部署

- [ ] **前端已部署到 Vercel**
- [ ] **URL 包含 zID**
- [ ] **progress.csv 中 FE_DEPLOYED_URL 正确**
- [ ] **部署的网站正常工作**

### 6.7 Git 提交

- [ ] **所有更改已提交**
  ```bash
  git status
  # 应该显示 "nothing to commit, working tree clean"
  ```

- [ ] **提交到 GitHub（不是 GitLab！）**
  ```bash
  git push github master
  ```

- [ ] **提交历史清晰**
  - [ ] 有意义的提交消息
  - [ ] 定期提交（不是一次性提交所有内容）

### 6.8 禁止事项检查

- [ ] **没有使用 universal CSS**
- [ ] **没有使用 alert()**
- [ ] **没有修改 backend（除非部署需要）**
- [ ] **所有代码在 frontend/ 文件夹**
- [ ] **没有使用 Angular/Vue**
- [ ] **没有直接 DOM 操作**
- [ ] **是完整的 SPA（无刷新）**

---

## 7. 开发建议和最佳实践

### 7.1 开发顺序建议

**推荐按以下顺序开发：**

1. **Week 1: 基础设施**
   - [ ] 设置 UI 库
   - [ ] 创建基础组件（Button, Input, Card等）
   - [ ] 设置路由
   - [ ] 设置 Context/状态管理

2. **Week 2: 认证 + 房源创建**
   - [ ] 实现登录/注册 (2.1)
   - [ ] 实现房源创建和列表 (2.2.1, 2.2.2)

3. **Week 3: 房源管理 + 首页**
   - [ ] 实现房源编辑 (2.2.4)
   - [ ] 实现发布/下架 (2.2.5, 2.5.1)
   - [ ] 实现首页 (2.3.1)

4. **Week 4: 搜索 + 预订**
   - [ ] 实现搜索功能 (2.3.2)
   - [ ] 实现房源详情 (2.4.1)
   - [ ] 实现预订功能 (2.4.2, 2.4.3)

5. **Week 5: 预订管理 + 高级功能**
   - [ ] 实现预订管理 (2.5.2)
   - [ ] 实现利润图表 (2.6.2)
   - [ ] 实现双人功能（如果需要）

6. **Week 6: 测试 + 部署 + 优化**
   - [ ] 编写组件测试
   - [ ] 编写 UI 测试
   - [ ] 部署到 Vercel
   - [ ] 响应式优化
   - [ ] 完成文档

### 7.2 调试技巧

**常见问题排查：**

1. **API 调用失败**
   ```javascript
   // 检查后端是否运行
   // 检查端口号是否正确 (config.json)
   // 检查 token 是否正确传递
   // 检查请求体格式
   ```

2. **路由不工作**
   ```javascript
   // 确保 BrowserRouter 包裹整个 App
   // 检查路由路径拼写
   // 检查嵌套路由配置
   ```

3. **状态不更新**
   ```javascript
   // 检查是否直接修改 state
   // 使用 setState 或 setXxx 函数
   // 检查依赖数组
   ```

### 7.3 性能优化建议

- **使用 React.memo** 避免不必要的重渲染
- **使用 useMemo/useCallback** 缓存计算结果
- **图片优化** - 压缩图片，使用适当大小
- **懒加载** - 对大型组件使用 React.lazy
- **避免过度渲染** - 检查 useEffect 依赖

### 7.4 可访问性（A11Y）建议

在 A11Y.md 中记录以下内容：

- **语义化 HTML** - 使用正确的标签（button, nav, main等）
- **ARIA 标签** - 添加 aria-label, aria-describedby等
- **键盘导航** - 确保所有功能可用键盘操作
- **颜色对比** - 确保足够的对比度
- **焦点管理** - 清晰的焦点指示
- **表单标签** - 所有输入框有相关联的 label

### 7.5 UI/UX 改进建议

在 UIUX.md 中记录以下内容：

- **加载状态** - 显示 loading spinner
- **错误处理** - 友好的错误消息
- **确认对话框** - 删除等危险操作前确认
- **视觉反馈** - 按钮悬停效果、点击效果
- **一致性** - 统一的颜色、字体、间距
- **空状态** - 无数据时的友好提示

---

## 8. 重要提醒

### 8.1 截止日期

**Friday 21st November, 10pm**

- 最后提交的 commit 将被评分
- 迟交政策：参考课程手册

### 8.2 学术诚信

- 代码必须是自己写的
- 可以使用少量 Stack Overflow 代码（需注释来源）
- 不能使用他人的作业代码
- 不能使用 AI 生成整个功能
- 违反将导致严重后果

### 8.3 双人协作（如适用）

- 贡献通过 GitLab commits 衡量
- 必须从自己的账户提交
- 标记 🙉🙉🙉 的功能只需双人完成
- 个人完成双人功能可获得 bonus

### 8.4 评分权重

- Visual Compliance (50%): 功能实现
- Code Quality (50%): 代码质量 + ESLint
- Testing (5%): 组件测试 + UI 测试
- Accessibility (5%): 可访问性
- Deployment (5%): 部署
- Bonus (5%): 额外功能

**总分可超过 100%，但只计入课程作业总分的 80%**

---

## 9. 快速参考

### 9.1 常用命令

```bash
# 启动开发环境
cd backend && npm start
cd frontend && npm run dev

# 运行测试
cd frontend && npm run test

# 运行 linting
cd frontend && npm run lint

# 构建生产版本
cd frontend && npm run build

# 重置后端数据
cd backend && npm run reset

# 清空后端数据
cd backend && npm run clear
```

### 9.2 API 端点参考

**认证：**
- POST `/user/auth/register` - 注册
- POST `/user/auth/login` - 登录
- POST `/user/auth/logout` - 登出

**房源：**
- GET `/listings` - 获取所有房源
- GET `/listings/:id` - 获取房源详情
- POST `/listings/new` - 创建新房源
- PUT `/listings/:id` - 更新房源
- DELETE `/listings/:id` - 删除房源
- PUT `/listings/publish/:id` - 发布房源
- PUT `/listings/unpublish/:id` - 下架房源
- PUT `/listings/:id/review/:bookingid` - 添加评论

**预订：**
- GET `/bookings` - 获取所有预订
- POST `/bookings/new` - 创建预订
- DELETE `/bookings/:id` - 删除预订
- PUT `/bookings/accept/:id` - 接受预订
- PUT `/bookings/decline/:id` - 拒绝预订

### 9.3 数据结构参考

**Listing:**
```javascript
{
  id: number,
  title: string,
  owner: string,  // email
  address: {
    street: string,
    city: string,
    state: string,
    postcode: string,
    country: string
  },
  price: number,
  thumbnail: string,  // base64 or URL
  metadata: {
    propertyType: string,
    bathrooms: number,
    bedrooms: [
      {
        beds: [
          { type: string, count: number }
        ]
      }
    ],
    amenities: string[]
  },
  reviews: [
    {
      rating: number,
      comment: string
    }
  ],
  availability: [
    { start: string, end: string }
  ],
  published: boolean,
  postedOn: string  // ISO date
}
```

**Booking:**
```javascript
{
  id: number,
  owner: string,  // email
  listingId: number,
  dateRange: {
    start: string,  // ISO date
    end: string
  },
  totalPrice: number,
  status: 'pending' | 'accepted' | 'declined'
}
```

---

## 10. 故障排除

### 常见错误及解决方案

**错误：ESLint 失败**
- 解决：运行 `npm run lint` 查看具体错误
- 修复所有警告和错误
- 不要禁用 ESLint 规则

**错误：测试失败**
- 解决：确保后端是空白状态
- 使用 `npm run reset` 重置后端
- 检查测试是否依赖特定数据

**错误：部署失败**
- 解决：检查构建日志
- 确保 Node 版本正确
- 检查 package.json 中的脚本

**错误：API 调用 CORS**
- 解决：后端已配置 CORS
- 检查 fetch 请求格式
- 确保后端在运行

---

## 总结

这份清单涵盖了 AirBrB 项目的所有要求。按照这个清单逐步完成，确保：

1. ✅ 遵守所有技术约束
2. ✅ 实现所有必需功能
3. ✅ 通过所有测试
4. ✅ 成功部署
5. ✅ 完成所有文档

**祝你开发顺利！记得定期提交代码到 GitHub！**

---

**最后更新**: 2025-11-13
**文档版本**: 1.0
