export default function BarChart({
	likes,
	dislikes,
}: {
	likes: number
	dislikes: number
}) {
	const likesRatio = likes / (likes + dislikes)

	return (
		<div className="m-4 w-[40rem] h-12 bg-red-500/20 transition-colors duration-150">
			<span className={`w-[${likesRatio}%] bg-green-500/20`} />
		</div>
	)
}
