# monorepo 配置

## 如何引用外部文件

- 'tsup' 包生成 declaration 文件

```sh
npx tsup -d packages/api/src  src/utils/open-router-dts.ts --dts-only
```

- 安装 `@trpc/client` 到 api 包中

```sh
pnpm add -D @trpc/client --filter @image-sass/api
```

## peerDependencies

- peerDependencies（同版本依赖 / 伙伴依赖）是插件或库开发中一个非常关键的概念。
- 简单来说：它告诉使用你这个包的人：“我的正常运行需要某某软件，但我自己不带，请你自己安装一个。”

1. 形象的比喻

- 想象你在卖手机壳（你的库）：
  - dependencies：是手机壳自带的装饰物。买家买壳时，装饰物已经粘在上面了一起发过来。
  - peerDependencies：是手机。你的包装说明上写着：“本产品仅支持 iPhone 15”。你不会在发货时顺便送买家一台 iPhone 15，但如果买家没有 iPhone 15，这个壳就没法用。

2. 为什么要用它？（核心：防止重复安装）

- 这是最主要的原因，特别是在 React/Vue/Preact 这样的单例框架中：
  - 避免版本冲突：如果你的库把 Vue 放在 dependencies 里，当别人在项目里引用你的库时，项目中可能会存在两个不同版本的 Vue（项目自带一个，你的库拉下来一个）。这会导致非常多诡异的 Bug（例如全局状态不共享、组件无法识别）。
  - 减小包体积：你的库不需要把整个 Vue 或 Preact 的源代码打包进去，只要声明你需要它即可。

3. 如何配置？

- 在你的 packages/preact-vue-connect/package.json 中：

```json
{
  "peerDependencies": {
    "preact": "^10.27.2",
    "vue": "^3.5.27"
  }
}
```

- 这意味着：“如果你想用我的 preact-vue-connect，你的项目里必须已经安装了满足 ^10.27.2 的 Preact 和满足 ^3.5.27 的 Vue。”

4. dependencies vs peerDependencies

   | 区别     | dependencies (必需依赖)                       | peerDependencies (同版本依赖)                             |
   | -------- | --------------------------------------------- | --------------------------------------------------------- |
   | 安装行为 | 自动。安装你的库时，npm/pnpm 会自动安装这些。 | 手动/校验。安装时会检查主项目是否已有，没有会警告或报错。 |
   | 存在位置 | 通常安装在你的库的 node_modules 里。          | 必需存在于主项目（宿主）的 node_modules 里。              |
   | 场景     | 你的内部工具函数（如 axios, lodash）。        | 你作为插件去增强的框架（如 react,vue）。                  |

5. 在你的 Monorepo 里的意义
   你刚才在 preact-vue-connect 中配置了这两项：

> 1. 这样你的 examples/nuxt 在引用它时，会使用 nuxt 项目自己安装的那个 vue 实例。
> 2. 保证了整个应用中只有一个 Vue 实例和一个 Preact 实例在运行，确保了框架运行的稳定性。
> 3. 小贴士： 如果你希望某个依赖是可选的（即使主项目没装也不报错），你可以配合 peerDependenciesMeta 使用：

```json
"peerDependenciesMeta": {
  "vue": {
    "optional": true
  }
}
```

## upload-button 配置

```json
{
  "main": "dist/upload-button.cjs",
  "module": "dist/upload-button.js",
  "types": "dist/index.d.ts"
}
```

- 这三个字段是构建 JavaScript 库时的“标准配置”，它们决定了别人（或你的主项目）如何引用你的这个分包。

- 目前你的项目是一个 Monorepo（大仓库），当 packages/upload-button 被其他包引用时，Node.js 和开发工具会根据这三个字段来找代码。

1. "main": "dist/upload-button.cjs" (CommonJS 入口)
   - 用途：给老的 Node.js 环境或不支持 ES Modules 的工具使用。
   - 为什么：虽然现在 ESM 很流行，但很多后端工具或旧的构建流程仍在使用 require()。.cjs 后缀明确告诉系统：这是一个 CommonJS 规范的文件。

2. "module": "dist/upload-button.js" (ES Module 入口)
   - 用途：给现代的打包工具（如 Webpack, Vite, Rollup）和支持 ES Modules 的环境使用。
   - 为什么（非常重要）：
     - Tree-shaking：使用 ESM 格式，打包工具可以分析出你到底用了库里的哪些函数，没用到的代码会被“摇掉”，减小最终主包的体积。
     - 现代环境优先：现代浏览器和构建工具会优先寻找这个字段。

3. "types": "dist/index.d.ts" (TypeScript 类型定义入口)
   - 用途：告诉 TypeScript 编译器这个包的类型结构是什么样的。
   - 为什么：
     - 如果没有这个字段，当你在其他包里 import { UploadButton } from "@image-sass/upload-button" 时，TypeScript 会报错说“找不到模块的声明文件”。
     - 它指向你刚才用 tsup --dts-only 生成的 .d.ts 文件。有了它，你在写代码时才会有代码补齐（IntelliSense）和类型检查。

总结：为什么要这么配置？
如果你不配置这些，默认情况下：

- 引不到代码：打包工具可能不知道去 dist 目录找编译后的代码。
- 没有自动提示：即使代码能跑，你在主包里写代码时，编辑器也不会告诉你 UploadButton 有哪些 props。
- 兼容性差：某些环境可能因为格式不匹配而报错。

简单来说：

- tsup 的作用是：把你的原始 .tsx 代码翻译并打包到 dist 文件夹里。
- package.json 的这些配置是：给这个库贴上使用说明书，告诉外面的人去哪里拿翻译好的代码和类型。
