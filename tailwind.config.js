/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./public/assets/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
      colors: {
        fuji: { 50:'#F0F9FF',100:'#E0F2FE',200:'#BAE6FD',300:'#7DD3FC',400:'#38BDF8',500:'#00A8E8',600:'#0077B6',700:'#023E8A',800:'#03045E' }
      }
    }
  },
  safelist: [
    "grid", "grid-cols-1", "md:grid-cols-2", "gap-5",
    "from-sky-400", "to-sky-600", "via-amber-300", "via-amber-400",
    "from-rose-400", "to-emerald-500",
  ],
  plugins: [],
};
