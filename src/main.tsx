import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  
  // 개발환경에서 오류 검사 도구(한 번 더 실행)
  <StrictMode>
    
    {/* App 안에 있는 Route를 찾기 위해서 사용 */}
    <BrowserRouter>
      
      {/* 실제 화면 */}
      <App />
    
    </BrowserRouter>
  
  
  </StrictMode>,
)
