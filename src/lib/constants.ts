export const SEMESTERS = ["spring", "fall"] as const;

export const INSTITUTIONS = [
  {
    name: "Norges teknisk-naturvitenskapelige universitet",
    initial: "NTNU",
    id: 1150,
  },
] as const;

export const CACHE_TAGS = {
  INSTITUTIONS: "institutions",
  INSTITUTION: (institutionId: number) => `institution:${institutionId}`,
  COURSES: "courses",
  COURSE: (courseId: string) => `course:${courseId}`,
};
