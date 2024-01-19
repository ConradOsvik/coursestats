import Search from './components/search'

export default function AddCourse() {
	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<h1 className="text-5xl font-bold">Legg til et emne</h1>
			<Search />
		</div>
	)
}
