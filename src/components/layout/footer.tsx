import { Button, buttonVariants } from '../ui/button'

export default function Footer() {
	return (
		<footer className="w-full text-center p-4">
			Made with ❤️ by{' '}
			<a
				className="hover:underline"
				href="https://github.com/ConradOsvik"
				target="_blank"
			>
				Conrad
			</a>
		</footer>
	)
}
