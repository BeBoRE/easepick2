import { defineConfig } from "tsdown";

export default defineConfig({
  noExternal: [/^@yuafox\/easepick2/],
})
