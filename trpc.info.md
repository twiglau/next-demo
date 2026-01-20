# TRPC - 如何做到全栈 typesafe

## 介绍

- tRPC 是一个类型安全的 API 框架，它可以帮助我们构建类型安全的 API。
- RPC（Remote Procedure Call，远程过程调用）

## router

router 是 tRPC 的核心概念，它可以帮助我们组织和管理 API。

- Query: 获取数据
- Mutation: 处理数据

## zod 库

- 在传统的开发中，你通常需要写两遍类型：

1. TypeScript 层面：定义 interface（但编译成 JS 后就消失了，无法阻止非法数据进入）。
2. 验证层面：写手动判断逻辑（比如 if (typeof data !== 'string') ...），代码又长又难维护。

- Zod 合二为一：你定义一个 Zod Schema，它既是验证器，也是类型的源头。

## z.infer<typeof ...> 是什么意思？

```ts
export type FilesOrderByColumn = z.infer<typeof filesOrderByColumnSchema>;
```

- z.infer<typeof ...> 是 zod 库中的一个类型工具，用于从 Zod Schema 中推导出类型。
- 这行代码是 Zod 的“魔法密码”，它的目的是：从你写的 Zod 验证规则中，自动提取出对应的 TypeScript type。

- 拆解分析：
  > 1. filesOrderByColumnSchema: 这是你在代码里用 z.object({ ... }) 定义的一个运行时变量。它描述了排序字段应该是哪些、是升序还是降序。
  > 2. typeof filesOrderByColumnSchema: 这是 TypeScript 的关键字，用来获取这个“运行时变量”的类型。
  > 3. z.infer<...>: 这是 Zod 提供的工具，它告诉 TypeScript：“请帮我分析一下这个 Schema 最终验证通过后的数据结构是什么样的”。

```ts
const filesOrderByColumnSchema = z.object({
  field: z.enum(["name", "createdAt", "size"]),
  order: z.enum(["asc", "desc"]),
});
// 使用 z.infer 自动生成类型
export type FilesOrderByColumn = z.infer<typeof filesOrderByColumnSchema>;

// 生成的 FilesOrderByColumn 类型如下：
type FilesOrderByColumn = {
  field: "name" | "createdAt" | "size";
  order: "asc" | "desc";
};
```

- 为什么要这样写？（核心优势）

1. 单一事实来源（Single Source of Truth）：你只需要修改 filesOrderByColumnSchema 的规则（比如增加一个排序字段），对应的 TypeScript 类型 FilesOrderByColumn 会自动更新。你不需要同步去修改 interface 或 type。
2. 零冗余：避免了在 JS 对象定义和 TS 类型定义之间重复劳动。
3. 类型安全：当你把这个类型用在前端（比如你的FileList Props）时，TypeScript 能确保你传入的排序参数完全符合后端验证器的预期。

- 总结

1. Zod = 运行时的数据检查员 + 类型工厂。
2. z.infer = 从检查员那里“套取”一份对应的类型说明书，让 TypeScript 也能看懂。

## inferRouterOutputs

```ts
type FileResult = inferRouterOutputs<AppRouter>["file"]["infinityQueryFiles"];
```

- 这行代码是 tRPC 中非常核心的一个用法。它的目的是：在前端（Client）自动“推导”出后端（Server）某个接口返回的数据结构类型。

- 我们可以把它拆解为三个层次来理解：

1. inferRouterOutputs<AppRouter>
   - AppRouter: 这是你在后端定义的整个 API 路由树的类型。它包含了所有的接口、输入参数和返回类型。
   - inferRouterOutputs: 这是 tRPC 提供的一个“类型工具（Utility Type）”。
   - 合起来的意思：把后端整个路由树拿过来，提取出所有接口的返回类型。
2. ['file']['infinityQueryFiles']
   - 这一部分就像是在“查字典”或“点外卖”：
   - ['file']: 定位到后端路由中名为 file 的路由模块（Router）。
   - ['infinityQueryFiles']: 定位到这个模块下名为 infinityQueryFiles 的具体接口（Procedure）。
3. 为什么需要它？（解决了什么痛点？）
   - 如果没有这行代码，你可能需要手动在前端定义一遍接口返回的数据类型：

```ts
typescript;
interface FileItem {
  id: string;
  name: string;
  path: string;
  // ...等等，万一后端改了字段名，这里就会报错或产生 Bug
}
```

- 使用 inferRouterOutputs 的好处是：
  1. 强一致性：前端的 FileResult 类型永远和后端的返回结果保持 100% 同步。后端改了代码，前端类型会自动更新。
  2. 无需手动维护：你不需要自己写接口文档或 interface，类型是“飘”过来的。
  3. 精确到数组项：在你的 FileList.tsx中，它通常被用来给文件列表数组定义类型，例如：

  ```ts
  // 拿到整个接口返回的类型后，可以进一步拿到单项的类型
  type Items = FileResult["items"];
  ```

- 总结

  > 这行代码的意思是：“请帮我算一下，后端那个叫 file.infinityQueryFiles 的接口到底会返给我什么样的数据结构，我要把这个结构定义为 FileResult 类型。”

  > 它实现了所谓的 "End-to-end Type Safety"（端到端类型安全），是 tRPC 的灵魂所在。

## const utils = trpcClientReact.useUtils(); 是做什么的？ FileList.tsx 中， 为什么 saveFile 成功后，需要同步 infinityQueryFiles ?

这两个问题触及了 tRPC / TanStack Query 状态管理的核心。

1. const utils = trpcClientReact.useUtils(); 是做什么的？

- useUtils() 是 tRPC 提供的一个“工具箱” Hook（它本质上是对 TanStack Query 的 useQueryClient 的一层封装）。

- 它的作用是让你能够直接操作前端的缓存数据。通过 utils，你可以：

> 1. invalidate() (失效)：告诉 React，“这个接口的数据过期了，请立刻去后端重新抓取一次”。
> 2. setInfiniteData() / setData() (手动更新)：直接修改内存里的缓存。比如：后端返回了一个新对象，我直接把它塞进缓存数组里，而不需要重新请求一遍完整的列表。
> 3. cancel() (取消)：取消正在进行的请求。
> 4. refetch() (手动触发)：手动重新获取。

2. 为什么 saveFile 成功后，需要同 infinityQueryFiles？

- 这是一个关于**“数据同步与用户体验”**的问题。
- 核心矛盾：后端变了，但前端缓存没变
- 当你点击上传并执行 saveFile 时，后端数据库多了一条记录。但是，前端展示文件列表时使用的是 infinityQueryFiles 接口的缓存结果。

- 如果不做同步处理，会发生以下情况：

> 1. 用户上传了一个文件。
> 2. 后端存好了。
> 3. 列表页依然没显示这个新文件。
> 4. 用户必须手动刷新页面，或者触发滚动加载更多，列表才会更新。

3. 解决办法：手动修改缓存

- 为了让用户感到“秒级反馈”（即上传完立刻就能在列表看到），你在代码里通过
  `utils.file.infinityQueryFiles.setInfiniteData` 进行了手动同步：

4. 好处：

- 极速响应：用户无需等待网络延迟重新获取几百个文件，仅仅把这一个新对象塞进数组即可，UI 会立刻响应。
- 节省带宽：不需要为了更新一个文件而重新拉取整个列表。

5. 总结：

- useUtils() 是操作缓存的遥控器。
- 同步 infinityQueryFiles 是为了确保前端看的数据和后端存的数据是一致的，从而避免“数据灵异消失”或者“必须刷新才能看到”的糟糕体验。
