import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import uglify from "rollup-plugin-uglify";

export default {
  input: "source/Main.js",
  output: {
    file: "bundle.js",
    name: "Mint",
    format: "iife"
  },
  plugins: [
    resolve(),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    uglify({
      mangle: {
        reserved: ["Err", "Ok", "Maybe", "Just", "Nothing", "Record", "_d"]
      }
    })
  ]
};
