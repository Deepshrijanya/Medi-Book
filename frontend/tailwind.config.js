/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#0F766E",      // Deep Teal
        'secondary': "#115E59",    // Darker Teal for hover
        'accent': "#14B8A6",       // Vibrant Teal Accent
        'ivory': "#F8FAF9",       // Soft Ivory Background
        'teal_tint': "#E6F4F1",    // Soft Teal for card/image bg
        'text_primary': "#0F172A", // Navy
        'text_secondary': "#475569", // Slate
        'text_muted': "#64748B"    // Muted Silver-Slate
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill,minmax(200px,1fr))'
      }
    },
  },
  plugins: [],
}