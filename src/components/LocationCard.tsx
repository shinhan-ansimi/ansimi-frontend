
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


            {/* 버튼영역 `space는 요소끼리의 간격` */}
            <div className='mt-4 space-y-2'>


                {/* 출발 · 현재 위치 버튼 */}
                <button 

                    // `클릭 시 동작` setSearchType으로 searchType의 상태를 바꾸고 삼항연산자를 사용해서 start이면 null로 넣고, 아니라면 start 적용
                    onClick={() => setSearchType(searchType === 'start' ? null : 'start')}

                    // `버튼 스타일` text-left는 버튼 내부에 있는 모든 요소의 텍스트는 왼쪽 정렬이 될 수 있도록 함.
                    className='flex h-12 w-full items-center rounded-xl bg-[#F4F7F2] px-3 text-left'
                    >
                    {/* `초록점` shrink-0은 점이 작아지지 않게. */}
                    <span className='h-2.5 w-2.5 shrink-0 rounded-full bg-[#25A77A]'/>
                    <span className='ml-2.5 w-11 text-[11px] text-[#7A8D81]'>출발</span>
                    <span className='text-sm text-[#86998C]'>장소 또는 주소 검색</span>
                </button>


                {/* 도착 · 도착지 선택 버튼 */}
                <button

                    onClick={() => setSearchType(searchType === 'end' ? null : 'end')}
                    className='flex h-12 w-full items-center rounded-xl bg-[#F4F7F2] px-3 text-left'
                >
                    {/* `검은점` shrink-0은 점이 작아지지 않게. */}
                    <span className='h-2.5 w-2.5 shrink-0 rounded-full bg-[#183B36]'/>
                    <span className='ml-2.5 w-11 text-[11px] text-[#7A8D81]'>도착</span>
                    <span className='text-sm text-[#86998C]'>장소 또는 주소 검색</span>
                </button>


            </div>

            
        </section>




    ) // return
} // LocationCard

export default LocationCard