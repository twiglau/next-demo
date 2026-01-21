# 在 Next.js 的 App Router 架构中，@intercepting 和 (.)new 是实现并行路由 (Parallel Routes) 和 拦截路由 (Intercepting Routes) 的特殊语法。

这类模式通常用于实现弹窗（Modal）或侧边栏抽屉，以便在不丢失当前页面上下文（背景）的情况下显示新内容。

## @intercepting 代表什么？

- 这是一个 并行路由插槽 (Parallel Route Slot)。

1. 语法：文件夹名称以 @ 开头。
2. 作用：它允许你在同一个布局 ( layout.tsx) 中同时渲染多个页面。
3. 在你的代码中：查看src/app/dashboard/apps/layout.tsx
   ```ts
   export default function AppLayout(props: Props) {
        const { children, intercepting } = props; // 这里接收了 intercepting 插槽
        return (
                <>
                {children} {/_ 渲染主内容 _/}
                {intercepting} {/_ 渲染并行的插槽内容 _/}
                </>
        );
   }
   ```

- Next.js 会自动将 @intercepting 文件夹下的内容注入到 intercepting 这个 prop 中。

## (.)new 代表什么？

- 这是一个 拦截路由 (Intercepting Route)。

1. 语法：(.)表示拦截同一层级的路由。
2. 作用：当你从 `/dashboard/apps` 点击链接跳转到 `/dashboard/apps/new` 时，Next.js 会“拦截”这次导航，并改而渲染 @intercepting/(.)new 下的内容（通常是一个弹窗）。
3. 为什么这么做？：
   > 软导航（点击链接）：用户会看到一个弹窗浮在当前列表页之上，背景依然是原来的列表。
   > 硬导航（刷新页面/直接输入 URL）：拦截路由失效，Next.js 会渲染正常的 src/app/dashboard/apps/new/page.tsx（全屏页面）。

## 总结

- 在你的项目中，这两个文件夹配合使用实现了以下交互：

1. 用户在 apps 列表页点击“新建应用”。
2. 浏览器 URL 变为 /dashboard/apps/new。
3. 但是，页面并没有发生全屏跳转，而是在layout.tsx的 {intercepting} 位置渲染了(.)new/page.tsx（这通常是一个遮罩弹窗）。
4. 如果你直接把这个 URL 发给别人或刷新，用户看到的就是 new/page.tsx 的独立页面。
