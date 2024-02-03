export default function BarChart({
	likes,
	dislikes,
}: {
	likes: number
	dislikes: number
}) {
	const likesRatio = (likes / (likes + dislikes)) * 100

	return (
		<div className="flex justify-center items-center m-4 w-[34rem] h-12 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-150 rounded-md overflow-hidden">
			<span
				style={{ width: `${likesRatio}%` }}
				className="h-full bg-green-500/20 flex justify-start items-center transition-colors duration-150 box-border"
			>
				{likesRatio >= 10 && (
					<span className="px-4">{Math.round(likesRatio)}%</span>
				)}
			</span>
			<span
				style={{ width: `${100 - likesRatio}%` }}
				className="h-full bg-red-500/20 flex justify-end items-center transition-colors duration-150 box-border"
			>
				{100 - likesRatio >= 10 && (
					<span className="px-4">
						{Math.round(100 - likesRatio)}%
					</span>
				)}
			</span>
			{isNaN(likesRatio) && (
				<span className="px-4">Ingen stemmer enda</span>
			)}
		</div>
	)
}
