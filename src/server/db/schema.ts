import { relations } from "drizzle-orm";
import {
  int,
  real,
  sqliteTableCreator,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";
import { SEMESTERS } from "~/lib/constants";

export const createTable = sqliteTableCreator((name) => `coursestats_${name}`);

export const institutions = createTable(
  "institution",
  {
    id: int("id").primaryKey(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (institution) => ({
    idx: uniqueIndex("institution_unique_idx").on(institution.code),
  }),
);

export const institutionsRelations = relations(institutions, ({ many }) => ({
  courses: many(courses),
}));

export const courses = createTable(
  "course",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => ulid()),
    institutionId: int("institution_id")
      .notNull()
      .references(() => institutions.id, { onDelete: "cascade" }),
    department: text("department").notNull(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    credits: real("credits").notNull(),
    lang: text("lang").notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (courses) => ({
    idx: uniqueIndex("course_unique_idx").on(
      courses.institutionId,
      courses.code,
    ),
  }),
);

export const coursesRelations = relations(courses, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [courses.institutionId],
    references: [institutions.id],
  }),
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
    semester: text("semester", { enum: SEMESTERS }).notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
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
    createdAt: int("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
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
