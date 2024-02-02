import BackButton from '../back-button'
import DarkMode from '../dark-mode'

export default function Header() {
	return (
		<header className="absolute top-0 w-full flex justify-between items-center flex-row-reverse">
			<DarkMode />
			<BackButton />
		</header>
	)
}
