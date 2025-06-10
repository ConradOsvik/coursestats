export default function CourseLayout({
  children
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-start">{children}</div>
  )
}
