import { relations } from 'drizzle-orm'
import {
  int,
  real,
  sqliteTableCreator,
  text,
  primaryKey,
  foreignKey
} from 'drizzle-orm/sqlite-core'
import { SEMESTERS } from '~/lib/constants'

export const createTable = sqliteTableCreator((name) => `coursestats_${name}`)

export const institutions = createTable('institution', {
  id: int('id').primaryKey(),
  shortName: text('short_name').notNull().unique(),
  name: text('name').notNull(),
  createdAt: int('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
})

export const institutionsRelations = relations(institutions, ({ many }) => ({
  courses: many(courses)
}))

export const courses = createTable(
  'course',
  {
    institutionId: int('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'cascade' }),
    code: text('code').notNull(),
    department: text('department').notNull(),
    name: text('name').notNull(),
    credits: real('credits').notNull(),
    lang: text('lang').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
  },
  (courses) => ({
    pk: primaryKey({ columns: [courses.institutionId, courses.code] })
  })
)

export const coursesRelations = relations(courses, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [courses.institutionId],
    references: [institutions.id]
  }),
  semesters: many(semesters)
}))

export const semesters = createTable(
  'semester',
  {
    institutionId: int('institution_id').notNull(),
    courseCode: text('course_code').notNull(),
    year: int('year').notNull(),
    semester: text('semester', { enum: SEMESTERS }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
  },
  (semester) => ({
    pk: primaryKey({
      columns: [
        semester.institutionId,
        semester.courseCode,
        semester.year,
        semester.semester
      ]
    }),
    fk: foreignKey({
      columns: [semester.institutionId, semester.courseCode],
      foreignColumns: [courses.institutionId, courses.code],
      name: 'semesters_course_fk'
    })
  })
)

export const semestersRelations = relations(semesters, ({ one, many }) => ({
  course: one(courses, {
    fields: [semesters.institutionId, semesters.courseCode],
    references: [courses.institutionId, courses.code]
  }),
  grades: many(grades)
}))

export const grades = createTable(
  'grade',
  {
    institutionId: int('institution_id').notNull(),
    courseCode: text('course_code').notNull(),
    year: int('year').notNull(),
    semester: text('semester', { enum: SEMESTERS }).notNull(),
    grade: text('grade').notNull(),
    count: int('count').notNull(),
    womenCount: int('women_count').notNull(),
    menCount: int('men_count').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
  },
  (grade) => ({
    pk: primaryKey({
      columns: [
        grade.institutionId,
        grade.courseCode,
        grade.year,
        grade.semester,
        grade.grade
      ]
    }),
    fk: foreignKey({
      columns: [
        grade.institutionId,
        grade.courseCode,
        grade.year,
        grade.semester
      ],
      foreignColumns: [
        semesters.institutionId,
        semesters.courseCode,
        semesters.year,
        semesters.semester
      ],
      name: 'grades_semester_fk'
    })
  })
)

export const gradesRelations = relations(grades, ({ one }) => ({
  semester: one(semesters, {
    fields: [
      grades.institutionId,
      grades.courseCode,
      grades.year,
      grades.semester
    ],
    references: [
      semesters.institutionId,
      semesters.courseCode,
      semesters.year,
      semesters.semester
    ]
  })
}))
