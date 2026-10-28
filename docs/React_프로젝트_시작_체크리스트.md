# 안심이 React 프로젝트 시작 체크리스트

현재 `ansimi-frontend` 폴더에 React, TypeScript, Vite 프로젝트를 만들고 Tailwind CSS를 연결하는 순서입니다. 각 단계를 직접 실행한 뒤 체크하세요.

## 1. 작업 폴더와 환경 확인

- [ ] VS Code에서 `ansimi-frontend` 폴더를 열고 **터미널 → 새 터미널**을 선택합니다. 아래 명령은 PowerShell 기준입니다.
- [ ] 현재 위치를 확인하고 필요한 경우 프로젝트 폴더로 이동합니다.

  ```powershell
  Get-Location
  Set-Location 'C:\Users\user\Desktop\ansimi-frontend'
  ```

- [ ] Node.js와 npm 버전을 확인합니다.

  ```powershell
  node --version
  npm --version
  ```

  이 환경에서는 확인 당시 Node.js `v24.21.0`, npm `12.2.1`이 설치되어 있습니다. 다른 환경에서는 [Vite의 Node.js 요구 사항](https://vite.dev/guide/)을 확인하세요.

## 2. 현재 폴더에 React 파일 생성

- [ ] 다음 명령을 실행합니다. `.`은 현재 폴더를 뜻하고, `react-ts`는 React + TypeScript 템플릿입니다.

  ```powershell
  npm create vite@latest . -- --template react-ts
  ```

- [ ] 패키지 설치 여부를 물으면 내용을 확인하고 진행합니다. 폴더가 비어 있지 않다는 선택지가 나오면 **기존 파일을 유지하고 진행하는 선택지**를 고릅니다. 기존 파일을 삭제하는 선택지는 고르지 않습니다. 다른 질문이 나오면 기본 설정을 사용해도 됩니다.
- [ ] 생성 후 `package.json`, `index.html`, `vite.config.ts`, `src/App.tsx`, `src/main.tsx`가 있는지 확인합니다. 기존 `design` 폴더와 가이드 문서도 남아 있어야 합니다.

## 3. 실행 확인

- [ ] 필요한 패키지를 설치합니다.

  ```powershell
  npm install
  ```

- [ ] 개발 서버를 실행합니다.

  ```powershell
  npm run dev
  ```

- [ ] 터미널의 `Local` 주소를 브라우저에서 열고 기본 화면이 보이는지 확인합니다. 보통 `http://localhost:5173/`이지만 포트에 따라 달라질 수 있습니다.
- [ ] 서버를 종료하려면 터미널에서 `Ctrl+C`를 누릅니다. 이후 명령은 서버를 종료하거나 새 터미널에서 실행합니다.

## 4. Tailwind CSS 연결

- [ ] Tailwind CSS와 Vite 플러그인을 설치합니다.

  ```powershell
  npm install tailwindcss @tailwindcss/vite
  ```

- [ ] `vite.config.ts`에 Tailwind 플러그인을 추가합니다. 기존 React 플러그인을 유지합니다.

  ```ts
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tailwindcss from '@tailwindcss/vite'

  export default defineConfig({
    plugins: [react(), tailwindcss()],
  })
  ```

- [ ] `src/index.css`의 기본 내용을 지우고 다음을 작성합니다.

  ```css
  @import "tailwindcss";
  ```

- [ ] `src/App.tsx`의 내용을 아래처럼 바꿔 Tailwind가 적용되는지 확인합니다. 기본 `App.css` import는 제거합니다.

  ```tsx
  function App() {
    return (
      <main className="min-h-screen bg-emerald-50 p-6 text-emerald-950">
        <h1 className="text-3xl font-bold">안심이</h1>
        <p className="mt-2">React와 Tailwind CSS가 준비되었습니다.</p>
      </main>
    )
  }

  export default App
  ```

- [ ] `npm run dev`를 실행하고 연한 초록색 배경과 큰 제목이 보이는지 확인합니다. `src/main.tsx`에서 `./index.css`를 불러오는지도 확인합니다.

## 5. 빌드 확인과 다음 작업

- [ ] 개발 서버를 종료하거나 새 터미널을 열고 빌드를 확인합니다.

  ```powershell
  npm run build
  ```

- [ ] `design/Screen_경로설정.svg`를 참고해 `src/App.tsx`부터 모바일 화면을 구현합니다. 버튼과 카드는 React 컴포넌트로 작성합니다.
- [ ] 이후 도착지 선택과 귀가 안내 화면을 예시 데이터로 연결하고 카카오맵, 백엔드 API, PWA 기능을 단계적으로 추가합니다.

참고: [Vite 시작하기](https://vite.dev/guide/), [Tailwind CSS Vite 설치 가이드](https://tailwindcss.com/docs/installation/using-vite)
