import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import {visualizer} from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  //Just adding another package to see what slows down in the system
        visualizer({
        filename: 'dist/stats.html',
        title: 'Bundle Visualizer',
        gzipSize: true,
        brotliSize:true,
        template:'sunburst',
        open:true
    }),],
  build:{
    sourcemap:false,
    rollupOptions: {
      output:{
        manualChunks(id){
          if (id.includes('node_modules')){
            if (id.includes('@supabase')) return 'supabase-operations'
            if (id.includes('react')) return 'react-operations'
          }

        },
      },
    },
    
  }
})
