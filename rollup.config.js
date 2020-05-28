import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

export default {
  input: "source/Main.js",
  output: {
    file: "bundle.js",
    name: "Mint",
    format: "iife",
  },
  plugins: [
    resolve(),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    terser({
      compress: {
        passes: 2,
      },
      mangle: {
        reserved: ["Record", "_d"],
      },
    }),
  ],
};
