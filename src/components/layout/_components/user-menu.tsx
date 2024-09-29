import { Button } from '@/components/ui/button'
import { auth, signIn, signOut } from '@/lib/auth'

export default async function UserMenu() {
	const session = await auth()

	if (session)
		return (
			<form
				action={async () => {
					'use server'
					await signOut()
				}}
			>
				<Button type="submit">Sign out</Button>
			</form>
		)

	return (
		<form
			action={async () => {
				'use server'
				await signIn()
			}}
		>
			<Button type="submit">Sign in</Button>
		</form>
	)
}
