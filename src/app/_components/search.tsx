'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useEffect, useMemo, useRef } from 'react'
import { useTypewriter } from 'react-simple-typewriter'

import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'

export default function Search() {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)

    const [text] = useTypewriter({
        words: ['TMA4100', 'IMAT1002', 'TDT4100', 'TMA4240'],
        loop: false,
        delaySpeed: 2000
    })

    const isMac = useMemo(
        () => /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent),
        []
    )

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()

            if (!inputRef.current) return

            inputRef.current.focus()
        }

        if (e.key === 'Escape') {
            if (!inputRef.current) return

            inputRef.current.focus()
            inputRef.current.blur()
        }
    }

    useEffect(() => {
        if (!window) return

        window.addEventListener('keydown', handleKeyDown)

        if (inputRef.current) inputRef.current.focus()

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const input = form.elements[0] as HTMLInputElement

        if (input.value === '') return

        router.push(`/course/${input.value.trim().toLowerCase()}`)
    }

    return (
        <form onSubmit={handleSubmit} className='relative'>
            <Input
                ref={inputRef}
                placeholder={text}
                className='w-96 px-4 py-6 text-2xl uppercase'
            />
            <kbd className='text pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md bg-muted px-2'>
                <span
                    className={cn(
                        'mr-1',
                        isMac && 'text-xl',
                        !isMac && 'text-sm'
                    )}
                >
                    {isMac ? '⌘' : 'Ctrl'}
                </span>
                K
            </kbd>
        </form>
    )
}
