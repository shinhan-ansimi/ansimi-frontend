import { useEffect, useRef } from 'react';

function KaKaoMap() {

    // return에 있는 div요소를 참조해서 기능적으로 사용하기 위해 객체 정의
    const mapContainer = useRef<HTMLDivElement>(null);


    // 화면의 엘리먼트들이 만들어지고 실제 기능동작, 의존성 배열은 화면이 처음 만들어지면 실행
    useEffect(() => {

        // 화면에서 사용하는 div 요소의 엘리먼트 객체(mapContainer)에 대한 실제 요소를 가져옴.
        const container = mapContainer.current

        if



    }, [])



  return (

    // 지도 div
    <div 
        ref={mapContainer}
        className="w-full h-[600px] border-2 border-gray-300 rounded-lg"
    >
    </div>




  )
}

export default KaKaoMap;
