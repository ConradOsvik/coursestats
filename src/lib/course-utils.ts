export const extractCourseCode = (rawCode: string): string => {
  const regex = /^([A-ZÆØÅ]+)(\d{4})/
  const match = regex.exec(rawCode)
  if (!match?.[1] || !match?.[2]) return rawCode

  return match[1] + match[2]
}

export const isValidCourseCodeFormat = (code: string): boolean => {
  const regex = /^[A-ZÆØÅ]+\d{4}$/
  return regex.test(code)
}
