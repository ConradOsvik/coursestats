import {
	bigint,
	int,
	mysqlTableCreator,
	uniqueIndex,
	varchar,
} from 'drizzle-orm/mysql-core'

export const mysqlTable = mysqlTableCreator((name) => `trengerjegbok_${name}`)

export const courses = mysqlTable(
	'courses',
	{
		id: int('id').unique().autoincrement().primaryKey(),
		code: varchar('code', { length: 256 }).notNull().unique(),
		name: varchar('name', { length: 256 }).notNull(),
		likes: bigint('likes', { mode: 'number' }).notNull(),
		dislikes: bigint('dislikes', { mode: 'number' }).notNull(),
	},
	(table) => {
		return {
			codeIdx: uniqueIndex('code_idx').on(table.code),
		}
	}
)
