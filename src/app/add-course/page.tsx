import Search from './components/search'

export default function AddCourse({
	searchParams,
}: {
	searchParams: { code: string }
}) {
	return (
		<>
			<h1 className="text-5xl font-bold">Legg til et nytt emne</h1>
			<Search value={searchParams.code} />
		</>
	)
}
