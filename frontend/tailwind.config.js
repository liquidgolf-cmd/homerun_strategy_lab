/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Loam Strategy colors - will be customized based on actual branding
        primary: {
          DEFAULT: '#0f4761', // Dark teal/blue from RTF color scheme
          light: '#1a6b8a',
          dark: '#0a3344',
        },
        secondary: {
          DEFAULT: '#595959',
          light: '#808080',
          dark: '#393939',
        },
      },
    },
  },
  plugins: [],
}

