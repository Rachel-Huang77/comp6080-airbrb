# 阶段 1 认证系统测试清单

## 测试环境准备

### 前置条件
- [ ] Backend 已启动（`cd backend && npm start`）
- [ ] Frontend 已启动（`cd frontend && npm run dev`）
- [ ] 浏览器：最新版 Google Chrome
- [ ] Backend 数据已重置（`cd backend && npm run reset`）

### 如何重置测试环境
```bash
# 1. 重置后端数据
cd backend
npm run reset

# 2. 清除浏览器数据
# Chrome: F12 > Application > Storage > Clear site data
# 或手动清除 localStorage
```

---

## 2.1.1 登录页面测试

### 测试用例 1.1: 访问登录页面

**测试步骤：**
1. 打开浏览器访问 `http://localhost:5173/login`

**预期结果：**
- [ ] 页面加载成功，不出现空白或错误
- [ ] 显示 "Login" 标题
- [ ] 显示欢迎文字 "Welcome back! Please login to your account."
- [ ] 看到 Email 输入框
- [ ] 看到 Password 输入框
- [ ] 看到 "Login" 按钮
- [ ] 看到 "Don't have an account? Register here" 链接

**检查点：**
- [ ] URL 是 `/login` (独立路由 ✅)
- [ ] 页面使用 Material-UI Paper 卡片设计
- [ ] 响应式设计：最小宽度 400px 可正常显示

---

### 测试用例 1.2: 表单验证 - 空字段

**测试步骤：**
1. 访问登录页面
2. 不填写任何内容
3. 点击 "Login" 按钮

**预期结果：**
- [ ] Email 字段下方显示红色错误提示 "Email is required"
- [ ] Password 字段下方显示红色错误提示 "Password is required"
- [ ] 输入框边框变为红色
- [ ] **不弹出 alert 对话框**（禁止使用 alert）
- [ ] 表单未提交到后端

---

### 测试用例 1.3: 表单验证 - Email 格式错误

**测试步骤：**
1. 访问登录页面
2. Email 输入框输入：`invalidemail`（无 @ 符号）
3. Password 输入框输入：`password123`
4. 点击 "Login" 按钮

**预期结果：**
- [ ] Email 字段下方显示 "Email is invalid"
- [ ] Password 字段无错误
- [ ] 表单未提交

**额外测试：**
- [ ] 尝试：`test@` → 应该显示错误
- [ ] 尝试：`@example.com` → 应该显示错误
- [ ] 尝试：`test@example.com` → 应该通过验证

---

### 测试用例 1.4: 表单验证 - 实时错误清除

**测试步骤：**
1. 访问登录页面
2. 不填写内容，点击 "Login" → 出现错误提示
3. 在 Email 输入框中开始输入

**预期结果：**
- [ ] Email 字段的错误提示立即消失
- [ ] 红色边框消失
- [ ] Password 的错误提示仍然存在（未输入）

---

### 测试用例 1.5: Enter 键提交 - Email 字段

**测试步骤：**
1. 访问登录页面
2. 在 Email 输入框输入有效邮箱
3. **在 Email 输入框按 Enter 键**（不点击按钮）

**预期结果：**
- [ ] 表单尝试提交
- [ ] 因为 Password 为空，显示密码错误提示
- [ ] 不需要点击按钮即可触发提交

---

### 测试用例 1.6: Enter 键提交 - Password 字段

**测试步骤：**
1. 访问登录页面
2. Email: `test@example.com`
3. Password: `password123`
4. **在 Password 输入框按 Enter 键**

**预期结果：**
- [ ] 表单提交到后端
- [ ] 显示加载状态（按钮文字变为 "Logging in..."）

---

### 测试用例 1.7: 登录失败 - 用户不存在

**测试步骤：**
1. 确保后端数据已重置
2. 访问登录页面
3. Email: `nonexistent@example.com`
4. Password: `wrongpassword`
5. 点击 "Login" 按钮

**预期结果：**
- [ ] 按钮变为 "Logging in..." 并禁用
- [ ] 几秒后，页面顶部出现 Snackbar
- [ ] Snackbar 显示错误消息（红色/error）
- [ ] 消息内容类似："Invalid username or password" 或后端返回的错误
- [ ] **不使用 alert() 对话框** ✅
- [ ] 6 秒后 Snackbar 自动消失
- [ ] 可以点击 X 按钮手动关闭 Snackbar
- [ ] 表单字段保留输入内容
- [ ] 未重定向到其他页面

---

### 测试用例 1.8: 登录成功

**前置步骤：先注册一个账号**
```
方法1: 使用 Register 页面注册
方法2: 手动调用 API
curl -X POST http://localhost:5005/user/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password123","name":"Test User"}'
```

**测试步骤：**
1. 访问登录页面
2. Email: `testuser@example.com`
3. Password: `password123`
4. 点击 "Login" 按钮

**预期结果：**
- [ ] 按钮显示 "Logging in..."
- [ ] Snackbar 显示 "Login successful!" (绿色/success)
- [ ] 约 0.5 秒后自动重定向到首页 `/`
- [ ] Header 导航栏变化：
  - [ ] 不再显示 "Login" 和 "Register" 按钮
  - [ ] 显示 "All Listings", "My Listings", "Logout" 按钮
- [ ] 检查 localStorage (F12 > Application > Local Storage):
  - [ ] 存在 `token` 键（值为字符串）
  - [ ] 存在 `email` 键（值为 `testuser@example.com`）

---

### 测试用例 1.9: 跳转到注册页面

**测试步骤：**
1. 访问登录页面
2. 点击 "Register here" 链接

**预期结果：**
- [ ] 页面跳转到 `/register`
- [ ] URL 变化，无刷新（SPA）
- [ ] 显示注册页面

---

## 2.1.2 注册页面测试

### 测试用例 2.1: 访问注册页面

**测试步骤：**
1. 打开浏览器访问 `http://localhost:5173/register`

**预期结果：**
- [ ] 页面加载成功
- [ ] 显示 "Register" 标题
- [ ] 显示 "Create a new account to get started"
- [ ] 看到 Name 输入框
- [ ] 看到 Email 输入框
- [ ] 看到 Password 输入框
- [ ] 看到 Confirm Password 输入框
- [ ] 看到 "Register" 按钮
- [ ] 看到 "Already have an account? Login here" 链接

**检查点：**
- [ ] URL 是 `/register` (独立路由 ✅)
- [ ] 4 个输入字段都存在

---

### 测试用例 2.2: 表单验证 - 所有字段为空

**测试步骤：**
1. 访问注册页面
2. 不填写任何内容
3. 点击 "Register" 按钮

**预期结果：**
- [ ] Name 字段显示 "Name is required"
- [ ] Email 字段显示 "Email is required"
- [ ] Password 字段显示 "Password is required"
- [ ] Confirm Password 字段显示 "Please confirm your password"
- [ ] 所有字段边框变红
- [ ] **不弹出 alert**
- [ ] 表单未提交

---

### 测试用例 2.3: 密码长度验证

**测试步骤：**
1. 访问注册页面
2. Name: `Test User`
3. Email: `test@example.com`
4. Password: `12345` (少于 6 个字符)
5. Confirm Password: `12345`
6. 点击 "Register" 按钮

**预期结果：**
- [ ] Password 字段显示 "Password must be at least 6 characters"
- [ ] 表单未提交

---

### 测试用例 2.4: 密码不匹配 - 字段验证

**测试步骤：**
1. 访问注册页面
2. Name: `Test User`
3. Email: `test@example.com`
4. Password: `password123`
5. Confirm Password: `password456` (不同)
6. 点击 "Register" 按钮

**预期结果：**
- [ ] Confirm Password 字段显示 "Passwords do not match"
- [ ] 表单未提交

---

### 测试用例 2.5: 密码不匹配 - 提交前检查

**测试步骤：**
1. 访问注册页面
2. Name: `Test User`
3. Email: `test@example.com`
4. Password: `password123`
5. Confirm Password: `different123`
6. 点击 "Register" 按钮

**预期结果：**
- [ ] **在提交前**弹出 Snackbar
- [ ] Snackbar 显示 "Passwords do not match! Please check and try again."
- [ ] Snackbar 是红色/error
- [ ] **不使用 alert()** ✅
- [ ] 表单未提交到后端
- [ ] Confirm Password 字段也显示错误提示

---

### 测试用例 2.6: Enter 键提交

**测试步骤：**
1. 访问注册页面
2. 填写所有字段（正确的值）
3. **在任意字段按 Enter 键**

**预期结果：**
- [ ] 表单提交
- [ ] 不需要点击按钮

**测试字段：**
- [ ] 在 Name 字段按 Enter
- [ ] 在 Email 字段按 Enter
- [ ] 在 Password 字段按 Enter
- [ ] 在 Confirm Password 字段按 Enter

---

### 测试用例 2.7: 注册成功

**前置条件：** 确保邮箱未被使用

**测试步骤：**
1. 确保后端数据已重置 (`npm run reset`)
2. 访问注册页面
3. Name: `New User`
4. Email: `newuser@example.com`
5. Password: `password123`
6. Confirm Password: `password123`
7. 点击 "Register" 按钮

**预期结果：**
- [ ] 按钮文字变为 "Registering..."
- [ ] 按钮被禁用（不能再次点击）
- [ ] Snackbar 显示 "Registration successful! Redirecting..." (绿色)
- [ ] 约 1 秒后自动重定向到首页 `/`
- [ ] **自动登录**（Header 显示登录状态的按钮）
- [ ] localStorage 包含 token 和 email
- [ ] token 不为空
- [ ] email 值为 `newuser@example.com`

---

### 测试用例 2.8: 注册失败 - 邮箱已存在

**测试步骤：**
1. 先注册一个用户：`existing@example.com`
2. 再次访问注册页面
3. Name: `Another User`
4. Email: `existing@example.com` (已存在)
5. Password: `password123`
6. Confirm Password: `password123`
7. 点击 "Register"

**预期结果：**
- [ ] Snackbar 显示错误消息（红色）
- [ ] 消息可能是："User already exists" 或类似
- [ ] **不使用 alert()** ✅
- [ ] 未重定向
- [ ] 未登录

---

### 测试用例 2.9: 跳转到登录页面

**测试步骤：**
1. 访问注册页面
2. 点击 "Login here" 链接

**预期结果：**
- [ ] 跳转到 `/login`
- [ ] 无页面刷新（SPA）
- [ ] 显示登录页面

---

## 2.1.3 登出按钮测试

### 测试用例 3.1: 登出按钮可见性 - 已登录

**前置条件：** 用户已登录

**测试步骤：**
1. 登录系统（使用测试用例 1.8）
2. 观察页面顶部导航栏

**预期结果：**
- [ ] Header 中显示 "Logout" 按钮
- [ ] "Logout" 按钮有图标（LogoutIcon）
- [ ] 按钮颜色与主题一致

**在不同页面测试：**
- [ ] 首页 `/` - Logout 按钮存在
- [ ] 我的房源页 `/my-listings` - Logout 按钮存在
- [ ] 其他任何页面 - Logout 按钮存在

---

### 测试用例 3.2: 登出按钮不可见 - 未登录

**前置条件：** 用户未登录

**测试步骤：**
1. 确保已登出（清除 localStorage）
2. 访问首页 `/`

**预期结果：**
- [ ] Header 中**不显示** "Logout" 按钮
- [ ] 显示 "Login" 和 "Register" 按钮

---

### 测试用例 3.3: 点击登出 - 成功流程

**前置条件：** 用户已登录

**测试步骤：**
1. 登录系统
2. 打开浏览器开发者工具 (F12)
3. 切换到 Network 标签
4. 点击 Header 中的 "Logout" 按钮
5. 观察 Network 请求

**预期结果：**

**API 调用：**
- [ ] 发送请求到：`POST http://localhost:5005/user/auth/logout`
- [ ] 请求头包含：`Authorization: Bearer <token>`
- [ ] 请求返回 200 状态码（成功）

**UI 反馈：**
- [ ] Snackbar 显示 "Logged out successfully" (绿色/success)
- [ ] **不使用 alert()** ✅
- [ ] 约 3 秒后 Snackbar 自动消失

**状态变化：**
- [ ] 自动跳转到首页 `/`
- [ ] Header 按钮变化：
  - [ ] 不再显示 "Logout", "All Listings", "My Listings"
  - [ ] 显示 "Login" 和 "Register"
- [ ] localStorage 清空：
  - [ ] `token` 被删除
  - [ ] `email` 被删除

**页面无刷新：**
- [ ] 整个过程是 SPA，页面不刷新

---

### 测试用例 3.4: 登出 - API 失败仍然登出

**测试步骤：**
1. 登录系统
2. **关闭 backend 服务器**（模拟 API 失败）
3. 点击 "Logout" 按钮

**预期结果：**
- [ ] 即使 API 失败，仍然执行本地登出
- [ ] Snackbar 显示 "Logged out (API error occurred)" (黄色/warning)
- [ ] localStorage 被清除
- [ ] 跳转到首页
- [ ] Header 显示未登录状态

**恢复：** 重新启动 backend

---

### 测试用例 3.5: 登出后无法访问受保护资源

**测试步骤：**
1. 登录系统
2. 点击 "My Listings"（假设这是受保护的页面）
3. 点击 "Logout"
4. 手动访问 `http://localhost:5173/my-listings`

**预期结果：**
- [ ] 如果有路由保护，应该重定向到登录页
- [ ] 或者显示"请先登录"的提示
- [ ] 不能查看受保护内容

---

## 2.1.4 导航元素测试

### 测试用例 4.1: 已登录用户 - 导航按钮存在

**前置条件：** 用户已登录

**测试步骤：**
1. 登录系统
2. 检查 Header 导航栏

**预期结果：**

**必须存在的按钮（从左到右）：**
1. [ ] "All Listings" 按钮
   - [ ] 有 HomeIcon 图标
   - [ ] 点击跳转到 `/`

2. [ ] "My Listings" 按钮
   - [ ] 有 ListAltIcon 图标
   - [ ] 点击跳转到 `/my-listings`

3. [ ] "Logout" 按钮
   - [ ] 有 LogoutIcon 图标
   - [ ] 点击执行登出

**不应该存在：**
- [ ] 不显示 "Login" 按钮
- [ ] 不显示 "Register" 按钮

---

### 测试用例 4.2: 未登录用户 - 导航按钮存在

**前置条件：** 用户未登录

**测试步骤：**
1. 清除 localStorage
2. 访问首页

**预期结果：**

**必须存在的按钮：**
1. [ ] "Login" 按钮
   - [ ] 有 LoginIcon 图标
   - [ ] 点击跳转到 `/login`

2. [ ] "Register" 按钮
   - [ ] 有 PersonAddIcon 图标
   - [ ] 点击跳转到 `/register`

**不应该存在：**
- [ ] 不显示 "All Listings" 按钮
- [ ] 不显示 "My Listings" 按钮
- [ ] 不显示 "Logout" 按钮

---

### 测试用例 4.3: 导航 - All Listings 按钮

**前置条件：** 用户已登录

**测试步骤：**
1. 登录系统
2. 访问任意页面（例如 `/my-listings`）
3. 点击 Header 中的 "All Listings" 按钮

**预期结果：**
- [ ] 跳转到首页 `/`
- [ ] 无页面刷新（SPA）
- [ ] URL 变化
- [ ] Header 保持显示

---

### 测试用例 4.4: 导航 - My Listings 按钮

**前置条件：** 用户已登录

**测试步骤：**
1. 登录系统
2. 当前在首页 `/`
3. 点击 Header 中的 "My Listings" 按钮

**预期结果：**
- [ ] 跳转到 `/my-listings`
- [ ] 无页面刷新（SPA）
- [ ] URL 变化
- [ ] Header 保持显示

---

### 测试用例 4.5: Logo 点击返回首页

**测试步骤：**
1. 访问任意页面（例如 `/login`）
2. 点击 Header 左侧的 "AirBrB" Logo/标题

**预期结果：**
- [ ] 跳转到首页 `/`
- [ ] 无页面刷新
- [ ] 适用于已登录和未登录状态

---

### 测试用例 4.6: 导航按钮在所有页面存在

**测试步骤：**
遍历所有页面，检查 Header 是否始终显示

**已登录状态访问：**
- [ ] `/` - Header 存在，显示已登录按钮
- [ ] `/login` - Header 存在
- [ ] `/register` - Header 存在
- [ ] `/my-listings` - Header 存在

**未登录状态访问：**
- [ ] `/` - Header 存在，显示未登录按钮
- [ ] `/login` - Header 存在
- [ ] `/register` - Header 存在

**验证：**
- [ ] 所有页面都显示 Header
- [ ] Header 在页面顶部
- [ ] Header 不会因路由变化而消失

---

### 测试用例 4.7: 可访问性 (Accessibility)

**测试步骤：**
1. 登录系统
2. 打开浏览器开发者工具 (F12)
3. 切换到 Elements/检查 标签
4. 检查导航按钮的 HTML

**预期结果：**

**每个按钮都有 aria-label：**
- [ ] "All Listings" 按钮：`aria-label="View all listings"`
- [ ] "My Listings" 按钮：`aria-label="View my hosted listings"`
- [ ] "Logout" 按钮：`aria-label="Logout"`
- [ ] "Login" 按钮：`aria-label="Login"`
- [ ] "Register" 按钮：`aria-label="Register"`

**好处：**
- 屏幕阅读器可以正确识别按钮功能
- 符合 WCAG 可访问性标准

---

## 附加测试

### 测试用例 A1: 响应式设计

**测试步骤：**
1. 打开浏览器开发者工具 (F12)
2. 切换到设备模拟模式（Toggle device toolbar）
3. 设置屏幕尺寸为 **400px × 700px**（最小要求）
4. 访问所有页面

**预期结果：**
- [ ] 登录页面正常显示，无横向滚动
- [ ] 注册页面正常显示，无横向滚动
- [ ] Header 导航栏正常显示
- [ ] 所有按钮可点击
- [ ] 文字不重叠
- [ ] 输入框宽度适应屏幕

---

### 测试用例 A2: 浏览器兼容性

**测试步骤：**
在以下浏览器测试所有功能：
- [ ] Google Chrome (最新版)
- [ ] Firefox (可选)
- [ ] Safari (可选)

**验证：**
- [ ] 所有功能在 Chrome 上正常工作

---

### 测试用例 A3: ESLint 合规性

**测试步骤：**
```bash
cd frontend
npm run lint
```

**预期结果：**
- [ ] 输出无错误
- [ ] 输出无警告
- [ ] 100% ESLint 通过 ✅

---

### 测试用例 A4: 禁止使用 alert()

**测试步骤：**
1. 在代码中搜索 `alert(`
   ```bash
   cd frontend/src
   grep -r "alert(" .
   ```

**预期结果：**
- [ ] 无任何 `alert()` 调用
- [ ] 所有提示都使用 Snackbar

---

### 测试用例 A5: 单页应用 (SPA) 验证

**测试步骤：**
1. 打开开发者工具 Network 标签
2. 访问首页
3. 点击导航链接（Login, Register, My Listings 等）
4. 观察 Network 请求

**预期结果：**
- [ ] 路由跳转时**不加载** HTML 文档
- [ ] 只有 XHR/Fetch API 请求（调用后端）
- [ ] 页面不刷新
- [ ] URL 变化但无白屏

---

### 测试用例 A6: Token 持久化

**测试步骤：**
1. 登录系统
2. 刷新页面 (F5)

**预期结果：**
- [ ] 刷新后仍然是登录状态
- [ ] Header 显示已登录按钮
- [ ] localStorage 的 token 仍然存在
- [ ] 无需重新登录

---

### 测试用例 A7: 跨页面状态一致性

**测试步骤：**
1. 登录系统（当前在 `/`）
2. 访问 `/login`
3. 观察页面

**预期结果：**
- [ ] Header 仍然显示已登录状态
- [ ] 可以选择停留在登录页（或重定向到首页）
- [ ] 状态一致

---

## 测试总结

### 快速检查清单

**基本功能：**
- [ ] 登录页面存在 (`/login`)
- [ ] 注册页面存在 (`/register`)
- [ ] 登出按钮工作
- [ ] 导航按钮存在并工作

**表单验证：**
- [ ] 空字段验证
- [ ] Email 格式验证
- [ ] 密码长度验证
- [ ] 密码匹配验证（注册）
- [ ] Enter 键提交

**API 集成：**
- [ ] 登录 API 调用成功
- [ ] 注册 API 调用成功
- [ ] 登出 API 调用成功
- [ ] Token 存储到 localStorage

**用户体验：**
- [ ] 所有错误使用 Snackbar（不用 alert）
- [ ] 加载状态显示
- [ ] 成功后自动重定向
- [ ] 响应式设计（400px 可用）

**技术合规：**
- [ ] 100% ESLint 通过
- [ ] 独立路由存在
- [ ] SPA（无页面刷新）
- [ ] 可访问性（aria-labels）

---

## 已知问题记录

**如果发现 bug，记录在这里：**

| 测试用例 | 问题描述 | 严重程度 | 状态 |
|---------|---------|---------|------|
|         |         |         |      |

---

**测试完成时间：** _______________

**测试者：** _______________

**结果：** ⬜ 通过  ⬜ 部分通过  ⬜ 失败

**通过率：** ___ / ___ (___%)
