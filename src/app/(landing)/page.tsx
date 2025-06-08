import { getInstitutionsFromDb } from "~/server/db/queries/institutions";
import Hero from "./_components/hero";

export default async function Home() {
  const institutions = await getInstitutionsFromDb();
  console.log("Institutions:", institutions);

  return (
    <main className="flex w-full max-w-5xl flex-grow flex-col items-center justify-start">
      <Hero />
    </main>
  );
}
