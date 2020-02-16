module.exports = {
  env: {
    "jest/globals": true
  },
  extends: "airbnb-typescript-prettier",
  plugins: ["jest"],
  rules: {
    "import/prefer-default-export": "off",
    "no-param-reassign": ["error", { props: true, ignorePropertyModificationsFor: ["draft", "state"] }], // Rule ignored for immer state
    "@typescript-eslint/no-unused-vars": ["error", { "ignoreRestSiblings": true }]
  },
  settings: {
    "import/resolver": {
      // use <root>/tsconfig.json
      "typescript": {
        "alwaysTryTypes": true
      }
    }
  }
};
