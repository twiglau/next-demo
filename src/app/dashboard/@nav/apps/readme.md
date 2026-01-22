# 获取参数

```tsx
//这么写合适吗;
const { appId } = React.use(props.params);
```

- 在 Next.js 15 和 React 19 的环境下，你这么写是完全正确且推荐的。

## 为什么这么写是合适的？

1. Next.js 15 的重大变化：从 Next.js 15 开始，params 和 searchParams 变成了 Promise。这意味着你不能再像以前那样直接同步访问 props.params.appId。
2. React.use() 的作用：在 客户端组件（Client Components，首行有 'use client'）中，React.use() 是专门用来“解构（unwrap）” Promise 的新 Hook。它能让你以同步的写法获取异步数据，而不会触发额外的渲染周期。
3. 类型对齐：在你的 Props定义中，params 已经被正确地声明为了 Promise<{appId: string}>，这与 Next.js 15 的类型定义完美契合。

## 总结

- 你当前的代码：
- 这是符合 Next.js 15 最佳实践的标准写法。

```tsx
type Props = {
  params: Promise<{ appId: string }>;
};

export default function AppDashboardNav(props: Props) {
  const { appId } = React.use(props.params); // 正确用法
}
```

## 补充建议

- 如果你是在 服务端组件（Server Component） 中（即没有 'use client' 的文件），则习惯上使用 await：

```tsx
export default async function Page({ params }: Props) {
  const { appId } = await params;
  // ...
}
```
