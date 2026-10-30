import { useEffect, useRef } from 'react';


// KakaoMaps 타입 설정
type KakaoMaps = {
  load: (callback: () => void) => void

  LatLng: new (latitude: number, longitude: number) => object

  Map: new (
    container: HTMLElement,
    options: { center: object; level: number }
  ) => object
}


// 카카오 SDK를 불러오면 SDK가 window에 지도 기능 추가하기 때문에 kakaoWindow 변수로 기능에 접근
const kakaoWindow = window as Window & {
  kakao?: {
    maps: KakaoMaps;
  }
}




function KaKaoMap() {

    // return에 있는 div요소를 참조해서 기능적으로 사용하기 위해 객체 정의
    const mapContainer = useRef<HTMLDivElement>(null);




    // 화면의 엘리먼트들이 만들어지고 실제 기능동작, 의존성 배열은 화면이 처음 만들어지면 실행
    useEffect(() => {

        // 화면에서 사용하는 div 요소의 엘리먼트 객체(mapContainer)에 대한 실제 요소를 가져옴.
        const container = mapContainer.current


        // 만약에 container를 가져온 지금 상황에서 아무 것도 없다면 함수 중단
        if (!container) return

        // `환경 변수에서 카카오 JavaScript 키를 변수에 저장` import.meta.env는 현재 모듈에 대한 환경변수
        // ?.(옵셔널 체이닝) 으로 있으면 . 뒤에 있는 걸 실행, 아니면 undefined를 반환
        const key = import.meta.env.VITE_KAKAO_MAP_KEY?.trim()


        // 만약 카카오 JavaScript 키가 없다면 함수 중단.
        if (!key) {
          console.error('.env.local에 VITE_KAKAO_MAP_KEY를 설정해 주세요.')
          return
        }

        // 그럼 현재 container의 div 요소가 있고, 카카오 JavaScript 키가 있을 때,
        
        // `script 요소 만들기` script는 html에 js 코드를 실행할 수 있도록 하는 것
        const script = document.createElement('script')

        // `불러올 카카오 SDK 주소 지정` src=처럼 작성
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`

        // src의 주소가 불러와지면 코드 실행
        script.onload = () => {
          console.log('카카오 SDK 파일을 불러왔습니다.')

          // 카카오 SDK에 있는 걸 윈도우에 기능을 추가하고 거기에 있는 maps를 변수에 넣음
          const maps = kakaoWindow.kakao?.maps;

          // SDK를 불러왔는데, 지도 기능이 없으면 함수 중단
          if (!maps) return;

          // 지도 기능이 있으면 객체 함수 실행
          maps.load( () => {
            // 중심 좌표 만들기
            const center = new maps.LatLng(37.5665, 126.9780)

            // 지도 설정
            const options = {
              center: center,
              level: 2, 
            }

            // container div에 지도 만들기 -> mapContainer에도 참조됨.
            new maps.Map(container, options);

          })


        }

        // index.html의 head에 script 삽입 -> 카카오 SDK 다운로드
        document.head.appendChild(script)

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
