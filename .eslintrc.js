module.exports = {
  env: {
    "jest/globals": true
  },
  extends: "airbnb-typescript-prettier",
  plugins: ["jest"],
  rules: {
    "import/prefer-default-export": "off",
    "no-param-reassign": ["error", { props: true, ignorePropertyModificationsFor: ["draft"] }], // Rule ignored for immer draft
  }
};