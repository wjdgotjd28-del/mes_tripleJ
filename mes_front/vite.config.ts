import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], 
  server: { //객체 형태로. 이거 자바 스크립트라서
    host: "localhost",
    proxy: {
      '/api' : {
        target: 'http://localhost:8080',
        //정규 표현식? \/라 쓰면 (슬래시임) 그냥 슬래시만 쓰면 예약어라서 안된다.
        rewrite: (path) => path.replace(/^\/api/, ""), 
        changeOrigin: true
      }
    }

  }
})
