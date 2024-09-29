'use client'

import { createContext, use } from 'react'

import { cn } from '@/lib/utils'

const GridContext = createContext(false)

export function Grid({
    rows,
    columns,
    border = false,
    children,
    as: Component = 'div',
    className
}: {
    rows?: number
    columns?: number
    border?: boolean
    children: React.ReactNode
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
    className?: string
}) {
    return (
        <Component
            className={cn('grid', border && 'border-l border-t', className)}
            style={{
                gridRow: `span ${rows || 1} / span ${rows || 1}`,
                gridColumn: `span ${columns || 1} / span ${columns || 1}`
            }}
        >
            <GridContext.Provider value={border}>
                {children}
            </GridContext.Provider>
        </Component>
    )
}

export function Cell({
    rows,
    columns,
    children,
    as: Component = 'div',
    className
}: {
    rows?: number
    columns?: number
    children: React.ReactNode
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
    className?: string
}) {
    const border = use(GridContext)

    return (
        <Component
            className={cn(border && 'border-b border-r', className)}
            style={{
                gridRow: `span ${rows || 1} / span ${rows || 1}`,
                gridColumn: `span ${columns || 1} / span ${columns || 1}`
            }}
        >
            {children}
        </Component>
    )
}
