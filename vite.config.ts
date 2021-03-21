import { resolve } from 'path'
// https://vitejs.dev/config/
export default {
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'role-control'
    },
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['lodash'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量

      }
    }
  }
}
