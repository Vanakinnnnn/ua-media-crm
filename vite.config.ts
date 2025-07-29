import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // GitHub Pages 部署时取消注释下面这行，并将 'your-repo-name' 替换为实际仓库名
  // base: '/your-repo-name/',
});
