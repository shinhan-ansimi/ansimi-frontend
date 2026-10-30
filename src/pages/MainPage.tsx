import LocationCard from "../components/LocationCard"
import KaKaoMap from "../components/KaKaoMap"




function MainPage () {

    return (

        // `메인 태그` 요소의 최소 높이를 화면 높이와 맞춰야함. min-h-screen
        <main className='min-h-screen bg-[#EEF2E9] p-8'>
            

            <header className="mb-6">

                {/* tracking-widest는 글자 간격 넓히기 */}
                <p className="text-xs font-medium tracking-widest text-[#55786A]">
                    당신의 일상에 안심을
                </p>

                {/* leading-snug는 줄 간격 좁힘 */}
                <h1 className="mt-2 text-2xl font-semibold leading-snug text-[#183B36]">
                    오늘의 귀갓길, <br />
                    어디로 향하시나요?
                </h1>
            </header>


            {/* 화면 상단 카드 컴포넌트*/}
            <LocationCard />

            {/* 카카오맵 컴포넌트*/}
            <div className="mt-6">
                <KaKaoMap />
            </div>

            {/* 우측 하단 문구 */}
            <footer className="mt-6 text-right">
                <p className="text-sm font-medium tracking-wide text-[#55786A]">
                    집으로 향하는 길, 마음은 가볍게.
                </p>
            </footer>
        </main>


        
    )

}

export default MainPage