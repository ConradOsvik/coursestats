import { tv } from 'tailwind-variants'

export const focusRing = tv({
    base: 'outline-none ring-0 focus-visible:ring'
})

export const insetFocusRing = tv({
    base: 'outline-none ring-0 focus-visible:ring-inset focus-visible:ring'
})
