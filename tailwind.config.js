module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.html"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
      },
      colors: {
        primary: "#7B5EEA",
        primary_hover: "#886aff",
        secondary: "#2D375B",
        light_grey: "#e0e0e0",
        medium_grey: "#bdbdbd",
        dark_grey: "#9e9e9e",
        darker_grey: "#757575",
      },
    },
  },
  plugins: [],
};

//use this line to build tailwind classes that are not in public/css/tailwind.css
// npx tailwindcss -i ./public/css/styles.css -o ./public/css/tailwind.css --watch
