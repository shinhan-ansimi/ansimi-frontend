import LocationCard from "../components/LocationCard"
import KaKaoMap from "../components/KaKaoMap"




function MainPage () {

    return (

        // `메인태크` 요소의 최소 높이를 화면 높이와 맞춰야함. min-h-screen
        <main className='min-h-screen bg-[#EEF2E9] p-8'>
            
            {/* 화면 상단 카드 컴포넌트*/}
            <LocationCard />

            {/* 카카오맵 컴포넌트*/}
            <div className="mt-6">
                <KaKaoMap />
            </div>

        </main>
    )

}

export default MainPage