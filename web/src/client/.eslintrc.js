module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Disable the rule for unescaped entities if needed
    "react/no-unescaped-entities": "off",
    // Set unused vars to warning or off if you're actively developing
    "@typescript-eslint/no-unused-vars": ["warn", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_" 
    }]
  }
};
