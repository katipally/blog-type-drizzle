"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTags = exports.tags = exports.comments = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.comments = (0, mysql_core_1.mysqlTable)('comments', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    content: (0, mysql_core_1.text)('content').notNull(),
    userId: (0, mysql_core_1.int)('user_id').notNull(),
    postId: (0, mysql_core_1.int)('post_id').notNull(),
    createdAt: (0, mysql_core_1.datetime)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    updatedAt: (0, mysql_core_1.datetime)('updated_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});
exports.tags = (0, mysql_core_1.mysqlTable)('tags', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull().unique(),
    description: (0, mysql_core_1.text)('description'),
    createdAt: (0, mysql_core_1.datetime)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    updatedAt: (0, mysql_core_1.datetime)('updated_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});
exports.postTags = (0, mysql_core_1.mysqlTable)('post_tags', {
    postId: (0, mysql_core_1.int)('post_id').notNull(),
    tagId: (0, mysql_core_1.int)('tag_id').notNull(),
    createdAt: (0, mysql_core_1.datetime)('created_at')
        .notNull()
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
}, (table) => ({
    pk: (0, mysql_core_1.primaryKey)({ columns: [table.postId, table.tagId] }),
}));
//# sourceMappingURL=schema.js.map