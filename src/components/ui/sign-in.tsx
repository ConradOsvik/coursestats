'use client'

import { signIn } from 'next-auth/react'

import { Button } from './button'

export default function SignIn(props: any) {
    return (
        <Button {...props} onClick={() => signIn()}>
            Sign in
        </Button>
    )
}
