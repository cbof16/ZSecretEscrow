module.exports = {
  content: [
    "./web/src/client/pages/**/*.{js,ts,jsx,tsx}",
    "./web/src/client/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          light: "#1a2348",
          DEFAULT: "#0f172a",
          dark: "#0a0f1d"
        },
        accent: {
          blue: "#6366f1",
          purple: "#8866ff"
        }
      }
    }
  },
  plugins: []
}
