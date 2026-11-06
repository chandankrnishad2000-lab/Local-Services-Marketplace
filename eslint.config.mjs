import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  {
    ignores: [".next/**", "node_modules/**", "backend/node_modules/**", "next-env.d.ts"]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript")
];

config.push({
  files: ["backend/**/*.js", "otp-auth/**/*.js"],
  rules: {
    // The Express API is CommonJS; converting it piecemeal to ESM would change its runtime contract.
    "@typescript-eslint/no-require-imports": "off"
  }
});

export default config;
