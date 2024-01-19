export default function BarChart({
	likes,
	dislikes,
}: {
	likes: number
	dislikes: number
}) {
	const likesRatio = (likes / (likes + dislikes)) * 100

	return (
		<div className="m-4 w-[40rem] h-12 flex">
			<span
				style={{ width: `${likesRatio}%` }}
				className="h-full bg-green-500/20 flex justify-start items-center"
			>
				<span className="p-4">
					{likesRatio >= 10 && `${likesRatio}%`}
				</span>
			</span>
			<span
				style={{ width: `${100 - likesRatio}%` }}
				className="h-full bg-red-500/20 flex justify-end items-center"
			>
				<span className="p-4">
					{100 - likesRatio >= 10 && `${100 - likesRatio}%`}
				</span>
			</span>
		</div>
	)
}
