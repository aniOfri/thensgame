import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		  https: true,
		  hmr: {
			host: '0.0.0.0',
			port: 3000,
			protocol: 'wss'
		  }
		}
})
