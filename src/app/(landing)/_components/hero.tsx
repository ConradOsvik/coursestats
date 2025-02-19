import Search from "~/components/search";

export default function Hero() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <h1 className="mb-6 text-4xl font-extrabold">Search a course at NTNU</h1>
      <Search />
    </div>
  );
}
