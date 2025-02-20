import { ulid } from "ulid";
import { getCourseData } from "./courses";
import { getAllSemestersData } from "./semesters";

export const getCourseAndSemestersData = async (
  institution: number,
  code: string,
) => {
  const [courseData, semestersData] = await Promise.all([
    getCourseData(institution, code),
    getAllSemestersData(institution, code),
  ]);

  const courseId = ulid();
  const course = {
    ...courseData,
    id: courseId,
  };

  const semestersWithGrades = semestersData.map((semester) => {
    const semesterId = ulid();
    const formattedGrades = semester.grades.map((grade) => ({
      ...grade,
      semesterId,
      id: ulid(),
    }));

    return {
      semester: semester.semester,
      year: semester.year,
      courseId,
      id: semesterId,
      grades: formattedGrades,
    };
  });

  const semesters = semestersWithGrades.map(({ grades, ...rest }) => ({
    ...rest,
  }));
  const grades = semestersWithGrades.map((semester) => semester.grades).flat();

  return { course, semesters, grades };
};
