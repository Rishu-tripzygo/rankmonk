import next from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...next,
  ...nextTs,
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "design_handoff_rankmonk_website/**"] },
];

export default config;
