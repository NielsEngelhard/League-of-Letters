import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "unused-imports": (await import("eslint-plugin-unused-imports")).default,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_",
        },
      ],
      // Disable the exhaustive deps rule for useEffect
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;