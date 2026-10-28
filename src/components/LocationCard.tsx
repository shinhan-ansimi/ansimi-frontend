
// 상태 변환 후 화면을 다시 그리는 useState함수를 사용하기 위해 import
import {useState} from 'react'


function LocationCard() {

    // 출발, 도착을 구분하는 상태 관리 훅
    const [searchType, setSearchType] = useState<'start' | 'end' | null>(null) 




    // 화면 리턴
    return (

        // 섹션 카드
        <section className='rounded-2xl bg-white p-4 shadow-sm'>

            {/* 안심이 제목 */}
            <h1 className='text-xl font-bold text-[#183B36]'>안심이</h1>

            <p className='mt-1 text-xs text-[#829087]'>
                오늘도 안심하고 집으로
            </p>



            
        </section>




    ) // return
} // LocationCard

export default LocationCard