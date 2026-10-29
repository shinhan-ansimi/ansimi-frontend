import { Route, Routes } from 'react-router'

import MainPage from './pages/MainPage'
import LocationCard from './components/LocationCard'
import ExamplePage from './examples/ExamplePage'




function App() {
  return (

    <main>
      
      {/* 라우팅 화면 목록 */}
      <Routes>

        {/* 메인 화면 */}
        <Route path='/' element={<MainPage />} />

        {/* 출발·도착 카드 화면 */}
        <Route path='/card' element={<LocationCard />} />
        
        {/* 예제 화면 */}
        <Route path='/example' element={<ExamplePage />}/>
      </Routes>

    </main>

  )
}

export default App
