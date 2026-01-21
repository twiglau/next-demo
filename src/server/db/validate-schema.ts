import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { apps, files, users, storageConfiguration } from "./schema";
// 通过 drizzle schema 来生成 zod schema
// 用于校验数据，保证数据库安全性

export const createUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email(),
});

// 对获取的数据进行校验
export const fileSchema = createSelectSchema(files);

// 只需要校验，挑选出的两个字段
export const filesCanOrderByColumn = fileSchema.pick({
  createdAt: true,
  deletedAt: true,
});

export const createAppSchema = createInsertSchema(apps, {
  name: (schema) => schema.min(3),
});
export const createStorageSchema = createInsertSchema(storageConfiguration);
