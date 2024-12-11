import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

  

// https://vitejs.dev/config/

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['@zxing/library'], // Mark the module as external
    },
  },
  plugins: [react()],
  // The line below is compulsory if you want to add your custom models
  assetsInclude: ['src/**/*.gltf', '*src/**/*.glb'],

})
