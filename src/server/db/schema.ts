import { relations } from "drizzle-orm";
import {
  int,
  sqliteTableCreator,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

export const createTable = sqliteTableCreator((name) => `coursestats_${name}`);

export const courses = createTable(
  "course",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => ulid()),
    institution: text("institution").notNull(),
    code: text("code").notNull(),
    name: text("name").notNull(),
  },
  (courses) => ({
    idx: uniqueIndex("course_unique_idx").on(courses.institution, courses.code),
  }),
);

export const coursesRelations = relations(courses, ({ many }) => ({
  semesters: many(semesters),
}));

export const semesters = createTable(
  "semester",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => ulid()),
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    year: int("year").notNull(),
    semester: text("semester", { enum: ["fall", "spring"] }).notNull(),
  },
  (semester) => ({
    idx: uniqueIndex("semester_unique_idx").on(
      semester.courseId,
      semester.year,
      semester.semester,
    ),
  }),
);

export const semestersRelations = relations(semesters, ({ one, many }) => ({
  course: one(courses, {
    fields: [semesters.courseId],
    references: [courses.id],
  }),
  grades: many(grades),
}));

export const grades = createTable(
  "grade",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => ulid()),
    semesterId: text("semester_id").references(() => semesters.id, {
      onDelete: "cascade",
    }),
    grade: text("grade").notNull(),
    count: int("count").notNull(),
    womenCount: int("women_count").notNull(),
    menCount: int("men_count").notNull(),
  },
  (grade) => ({
    idx: uniqueIndex("grade_unique_idx").on(grade.semesterId, grade.grade),
  }),
);

export const gradesRelations = relations(grades, ({ one }) => ({
  semester: one(semesters, {
    fields: [grades.semesterId],
    references: [semesters.id],
  }),
}));
