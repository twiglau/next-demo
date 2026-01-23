# api

## 如何引用外部文件

- 'tsup' 包生成 declaration 文件

```sh
npx tsup -d packages/api/src  src/utils/open-router-dts.ts --dts-only
```

- 安装 `@trpc/client` 到 api 包中

```sh
pnpm add -D @trpc/client --filter @image-sass/api
```

## 如何让第三方项目，使用该 api
