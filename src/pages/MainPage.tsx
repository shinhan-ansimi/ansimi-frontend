import LocationCard from "../components/LocationCard"




function MainPage () {

    return (

        // `메인태크` 요소의 최소 높이를 화면 높이와 맞춰야함. min-h-screen
        <main className='min-h-screen bg-[#EEF2E9] p-12'>
            
            {/* 화면 상단 카드 */}
            <LocationCard />

        </main>
    )

}

export default MainPage