import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: {eager: true},
  outDir: 'dist',
  format: ['esm', 'cjs', 'umd'],
  globalName: 'easepick',
  entry: ['src/index.ts'],
  platform: 'browser',
  banner: () => {
      const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
    return `/**
* @license
* Package: ${pkg.name}
* Version: ${pkg.version}
* https://github.com/YuaFox/easepick2
* Copyright ${new Date().getFullYear()} YuaFox
*
* Licensed under the terms of GNU General Public License Version 2 or later. (http://www.gnu.org/licenses/gpl.html)
*/`},
  workspace: {
    include: ['packages/*'], 
  },
  outputOptions: (options, format) => {
    if (format === 'umd') {
      return {...options, extend: true, globals: (id: string) => id.startsWith('@yuafox/easepick2') ? 'easepick' : id}
    }
  },
  css: {
    fileName: 'index.css', 
  },
  exports: true,
})
