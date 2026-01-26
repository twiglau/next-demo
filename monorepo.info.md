# monorepo 配置

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
