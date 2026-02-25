# tRPC + React Query 技术栈说明

这几个库共同构成了 **tRPC + React Query (TanStack Query)** 技术栈，主要用于在 React 应用（如 Next.js）中构建**端到端类型安全 (End-to-end Typesafe)** 的数据获取层。

## 库的功能详解

### 1. @tanstack/react-query (v5)

- **定位**：异步状态管理库（核心底层）。
- **作用**：负责请求完成后的数据管理。
  - **缓存 (Caching)**：自动缓存接口数据，减少冗余请求。
  - **更新 (Refetching)**：在窗口聚焦、网络恢复或手动触发时自动更新数据。
  - **状态管理**：提供 `isLoading`, `isError`, `data` 等 Hook 状态，简化 UI 逻辑。

### 2. @trpc/server

- **定位**：后端逻辑与类型定义。
- **作用**：在服务端定义 **Router** 和 **Procedure**。
  - 集成输入校验（如 Zod）。
  - 将后端逻辑导出为 TypeScript 类型供前端引用，实现“代码即文档”。

### 3. @trpc/client

- **定位**：底层通讯引擎。
- **作用**：前端连接 tRPC 服务端的桥梁。
  - 解析后端路由结构。
  - 将前端的函数调用转换为实际的 HTTP 请求（通常是基于 Fetch）。

### 4. @trpc/react-query & @trpc/tanstack-react-query

- **定位**：粘合层 (Bridge)。
- **作用**：将 tRPC 的类型安全与 React Query 的缓存能力结合。
  - **@trpc/react-query**：提供 React Hooks 封装，让你能以 `trpc.user.getById.useQuery()` 的方式调用接口。
  - **@trpc/tanstack-react-query**：针对 React Query v5 (TanStack Query) 的适配补丁，确保在最新版本下的兼容性。

---

## 协作运作流程

1.  **定义**：在后端使用 `@trpc/server` 编写接口逻辑。
2.  **调用**：前端通过 `@trpc/tanstack-react-query` 提供的 Hooks 发起调用。
3.  **执行**：底层由 `@trpc/client` 负责通讯，数据获取后交由 `@tanstack/react-query` 进行缓存和状态分发。
4.  **优势**：
    - **全链路类型安全**：修改后端字段，前端编译直接报错。
    - **零 API 文档维护**：类型即接口说明。
    - **极致开发体验**：像调用本地异步函数一样调用远程接口。
