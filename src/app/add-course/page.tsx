import Search from './components/search'

export default function AddCourse({
	searchParams,
}: {
	searchParams: { code: string }
}) {
	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<h1 className="text-5xl font-bold">Legg til et nytt emne</h1>
			<Search value={searchParams.code} />
		</div>
	)
}
