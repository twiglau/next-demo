# 服务端组件 page.tsx 中，为什么可以调用 client 端 backable-dialog 组件

- 这是一个非常好的问题，触及了 Next.js App Router 的核心设计理念：服务端组件（Server Components）可以导入并渲染客户端组件（Client Components）。

- 在你的代码中，InterceptingCreateApp是一个服务端组件（默认），而BackableDialog是一个客户端组件（带有 'use client'）。这种模式不仅是被允许的，而且是 Next.js 推荐的架构方式。

## 为什么可以这样调用？

1. 服务端组件是“骨架”： 在 App Router 中，服务端组件负责数据获取和基础结构的渲染。当你需要交互（如 useRouter、useState 或浏览器事件）时，你就引入一个客户端组件作为“交互节点”。
2. 客户端边界（Client Boundary）： 当你从服务端组件导入并使用 BackableDialog时，你实际上是定义了一个“客户端边界”。Next.js 在构建时会识别这个边界，确保 BackableDialog及其内部逻辑被打包发送到浏览器进行水合（Hydration）。
3. 组合模式（Composition Pattern）： 你代码中最精妙的地方在于：服务端组件可以将另一个服务端组件作为 children 传递给客户端组件。

```tsx
// page.tsx (Server Component)
<BackableDialog>
  <CreateApp /> {/_ CreateApp 仍然可以在服务端预渲染 _/}
</BackableDialog>
```

- 在这种情况下：
  - BackableDialog 在客户端运行，处理弹窗逻辑和路由跳转。
  - CreateApp 作为 children 传入。如果 CreateApp 是服务端组件，它仍然会在服务器上渲染，然后再把渲染结果传递给
    BackableDialog 。这样你既保留了CreateApp的服务端特性（如 Server Actions），又获得了弹窗的交互能力。

## 总结

- 可以：Server Component -> Client Component (通过导入)
- 不可以：Client Component -> Server Component (直接导入会把 Server Component 变成 Client Component)
- 折中方案：Client Component 可以接受 Server Component 作为 children 或 props。
