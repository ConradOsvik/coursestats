import { api, HydrateClient, prefetch } from "~/trpc/server";
import GradeChartContainer from "./_components/grade-chart";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return {
    title: `coursestats / ${id.toUpperCase()}`,
    description: `statistics for ${id.toUpperCase()}`,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  prefetch(api.course.getCourse.queryOptions({ id }));

  return (
    <HydrateClient>
      <main className="flex w-full max-w-5xl flex-col items-start justify-start">
        Course {id}
        <GradeChartContainer />
      </main>
    </HydrateClient>
  );
}
