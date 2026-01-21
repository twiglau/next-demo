# drizzle

## apply schema 到数据库

- drizzle-kit

```sh
npx drizzle-kit push:pg
# 启动 studio
npx drizzle-kit studio
```

## sql`("files"."create_at", "files"."id") > (${new Date(cursor.createAt).toISOString()}, ${cursor.id})` 是什么意思？

- 这行代码是 SQL 中的 “行值比较” (Row Value Comparison) 或 “元组比较” (Tuple Comparison)，它是实现 “游标分页” (Keyset Pagination / Cursor-based Pagination) 的一种非常高效且优雅的写法。

- 核心作用
- 它的意思是：找到所有“排在游标（Cursor）之后”的数据。 在数据库（如 PostgreSQL）中，多个字段组成的元组(a, b) > (x, y) 的比较逻辑如下：

1. 首先比较第一个字段：如果 a > x，则整个条件成立。
2. 如果第一个字段相等：则比较第二个字段，如果 a = x 且 b > y，则条件成立。

- 为什么要这样写？（解决“重复时间”问题）
  > 假设你只用时间分页：create_at > '2024-01-01'。

> 问题：如果数据库里有 10 张图是同一秒生成的（create_at 完全相同），当你翻到这一页时，如果你只按时间过滤，可能会漏掉这 10 张图中剩下的部分，或者在翻页时出现重复数据。

- 元组比较的逻辑等效于：

```sql
WHERE "files"."create_at" > 'cursor_time'
OR ("files"."create_at" = 'cursor_time' AND "files"."id" > 'cursor_id')
```

> 使用 (create_at, id) > (val1, val2) 这种写法，SQL 引擎会自动帮你处理上述逻辑。

- 代码细节拆解

1. ("files"."create_at", "files"."id") : 定义了一个由两个字段组成的“排序标准对”。

2. ">" : 比较操作符。
3. ${new Date(cursor.createAt).toISOString()}: 游标的时间戳，作为第一比较级。
4. ${cursor.id}: 游标的 ID（通常是 UUID 或自增 ID），作为第二比较级，保证了排序的唯一性和稳定性。

- 优点
  > 性能极高：如果你在 (create_at, id)上建立了联合索引，数据库可以利用索引快速定位，不像 OFFSET 分页那样需要扫描并跳过大量行。
  > 无感刷新：即使用户在翻页时有新数据插入，也不会导致当前页面数据跳变或重复显示。
- 总结：
  这是在处理海量数据流（如朋友圈、文件列表）时，保证分页不重不漏且速度极快的标准做法。
