/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs", // Adjust this to match your template files
    "./public/**/*.html", // Adjust this to match any static HTML files
  ],
  theme: {
    extend: {
      screens: {
        xs: "320px",
      },
    },
  },
  plugins: [],
};

//use this line to build tailwind classes that are not in public/css/tailwind.css
// npx tailwindcss -i ./public/css/styles.css -o ./public/css/tailwind.css --watch
