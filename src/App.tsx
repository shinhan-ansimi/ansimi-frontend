import { Route, Routes } from 'react-router'

import LocationCard from './components/LocationCard'
import LocationSearchExample from './examples/LocationSearchExample'




function App() {
  return (

    <main className='min-h-screen bg-[#EEEf2E9] p-4'>
      
      {/* 라우팅 화면 목록 */}
      <Routes>

        {/* 실제 화면 */}
        <Route path='/' element={<LocationCard />} />
        
        {/* 예시 화면 */}
        <Route path='/example' element={<LocationSearchExample />}/>
      </Routes>

    </main>

  )
}

export default App
