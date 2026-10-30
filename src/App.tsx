import { Route, Routes } from 'react-router'

import MainPage from './pages/MainPage'
import ExamplePage from './examples/ExamplePage'
import LocationCard from './components/LocationCard'
import KaKaoMap from './components/KaKaoMap'






function App() {
  return (

    <main>
      
      {/* 라우팅 화면 목록 */}
      <Routes>

        {/* 메인 화면 */}
        <Route path='/' element={<MainPage />} />

        {/* 예제 화면 */}
        <Route path='/example' element={<ExamplePage />}/>




        {/* 출발·도착 카드 화면 */}
        <Route path='/card' element={<LocationCard />} />

        {/* 카카오 맵 화면 */}
        <Route path='/map' element={<KaKaoMap />} />

      </Routes>

    </main>

  )
}

export default App
