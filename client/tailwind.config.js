/** @type {import('tailwindcss').Config} */
/*eslint-env node*/
const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
 content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        gwendolyn: ['Gwendolyn', 'cursive'],
        garamond: ['EB Garamond', 'serif']
      },
      colors: {
        netprem_yellow: '#f5c50d',
        almond: '#EADDCA',
        camel: '#C19A6B',
        coffee: '#6F4E37'
      },
    }
  },
  plugins: [],
});
