module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  globals: {
    nova: "readonly",
    Process: "readonly",
    NotificationRequest: "readonly",
  },
  extends: "airbnb",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    quotes: ["error", "double"],
    "no-console": "off",
    "comma-dangle": ["error", "only-multiline"],
    "operator-linebreak": "off",
  },
};
