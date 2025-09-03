/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  printWidth: 80,
  trailingComma: 'none'
}

export default config
