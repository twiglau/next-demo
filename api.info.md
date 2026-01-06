# 如何写 API

## zod 来做 API 校验： 服务端数据的安全性

```ts
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

export const { GET, POST } = schema;
```

## drizzle-zod 利用 drizzle 的 schema 生成 zod 的 schema
