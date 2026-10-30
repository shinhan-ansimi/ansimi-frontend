// useEffect: 화면이 DOM에 반영된 뒤 SDK 로딩과 지도 생성을 실행합니다.
// useRef: 지도를 그릴 실제 HTML 요소를 보관합니다.
// useState: 로딩 또는 오류 안내 문구를 보관하고 화면에 반영합니다.
import { useEffect, useRef, useState } from 'react'

// TypeScript에 SDK 객체의 모양을 알려줍니다. SDK 자체를 불러오는 코드는 아닙니다.
// 이 예제에 필요한 기능만 선언하며, object는 객체 내부 속성을 구체적으로 정의하지 않은 타입입니다.
type KakaoMaps = {
  // SDK 준비가 끝나면 인자로 받은 콜백을 실행합니다. void는 반환값을 사용하지 않는다는 뜻입니다.
  load: (callback: () => void) => void
  // new로 위도와 경도를 받아 좌표 객체를 만드는 생성자입니다.
  LatLng: new (latitude: number, longitude: number) => object
  // 실제 HTML 요소와 중심 좌표, 확대 수준을 받아 지도를 만드는 생성자입니다.
  Map: new (container: HTMLElement, options: { center: object; level: number }) => object
}

// window에 SDK가 추가할 kakao.maps 속성이 있을 수 있다고 TypeScript에 알려줍니다.
// &는 기존 Window 타입에 속성을 더하고, ?는 아직 속성이 없을 수도 있다는 뜻입니다.
// as는 타입을 알려줄 뿐 실제 window 객체를 변경하거나 SDK를 설치하지는 않습니다.
const kakaoWindow = window as Window & { kakao?: { maps: KakaoMaps } }
// 컴포넌트 밖에 로딩 작업을 공유합니다. 처음에는 undefined이고, 로딩을 시작하면 Promise를 저장합니다.
// Promise<KakaoMaps>는 비동기 작업이 성공하면 KakaoMaps 객체를 제공한다는 뜻입니다.
let sdkPromise: Promise<KakaoMaps> | undefined

// JavaScript 키를 받아 SDK가 준비되었을 때 완료되는 Promise를 반환합니다.
function loadKakaoMaps(key: string): Promise<KakaoMaps> {
  // 이미 진행 중이거나 성공한 로딩 작업을 재사용해 스크립트 중복 삽입을 막습니다.
  if (sdkPromise) return sdkPromise

  // resolve는 성공 결과를 전달하고, reject는 실패 원인을 전달합니다.
  sdkPromise = new Promise<KakaoMaps>((resolve, reject) => {
    // 스크립트 로딩 후 SDK 내부 초기화까지 기다리는 함수입니다.
    const initialize = () => {
      // ?.는 kakao가 없을 때 오류 대신 undefined를 반환하게 합니다.
      const maps = kakaoWindow.kakao?.maps
      if (!maps) {
        // 스크립트가 로드되어도 SDK 객체가 없으면 실패로 처리하고 함수를 끝냅니다.
        reject(new Error('카카오 지도 SDK를 확인할 수 없습니다.'))
        return
      }
      // SDK 사용 준비가 끝나면 maps 객체를 Promise를 기다리는 코드에 전달합니다.
      maps.load(() => resolve(maps))
    }

    // SDK 객체가 이미 있다면 스크립트를 새로 추가하지 않고 초기화 완료를 기다립니다.
    if (kakaoWindow.kakao?.maps) {
      initialize()
      return
    }

    // SDK 파일을 불러올 script 요소를 메모리에 생성합니다.
    const script = document.createElement('script')
    // appkey에 환경 변수에서 받은 키를 넣습니다. encodeURIComponent는 URL에 맞게 값을 인코딩합니다.
    // autoload=false로 자동 초기화를 끄고 위의 maps.load()로 초기화 시점을 제어합니다.
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`
    // SDK를 비동기로 불러옵니다. 준비 완료 여부는 onload와 maps.load로 확인합니다.
    script.async = true
    // 스크립트 로딩이 끝나면 initialize를 실행하도록 등록합니다.
    script.onload = initialize
    // 스크립트를 불러오지 못하면 실패한 요소를 제거하고 오류를 전달합니다.
    script.onerror = () => {
      script.remove()
      reject(new Error('지도를 불러오지 못했습니다. 네트워크와 키, 허용 도메인을 확인해 주세요.'))
    }
    // script를 문서의 head에 붙이면 브라우저가 SDK 로딩을 시작합니다.
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    // 실패한 Promise를 비워 다음 호출에서 다시 시도할 수 있게 합니다.
    // unknown은 오류가 어떤 타입인지 아직 모른다는 뜻입니다.
    sdkPromise = undefined
    // 오류를 다시 던져 호출한 쪽의 catch에서도 처리하게 합니다.
    throw error
  })

  // 호출한 쪽이 await로 SDK 준비 완료를 기다릴 수 있도록 반환합니다.
  return sdkPromise
}





// /example 경로에서 렌더링되는 React 컴포넌트입니다.
function ExamplePage() {
  // 최초 값은 null이고, 아래 div가 DOM에 반영되면 current에 해당 요소가 들어갑니다.
  const mapContainer = useRef<HTMLDivElement>(null)
  // status는 화면 문구, setStatus는 문구를 바꾸고 다시 렌더링하는 함수입니다.
  const [status, setStatus] = useState('지도를 불러오는 중입니다.')

  // DOM이 준비된 뒤 실행합니다. 개발 모드 StrictMode에서는 설정 → 정리 → 설정을 추가 실행합니다.
  useEffect(() => {
    // SDK를 기다리는 동안 이 effect가 정리됐는지 기록합니다.
    let cancelled = false
    // 이 effect가 사용할 DOM 요소를 저장해 정리 함수에서도 같은 요소를 참조합니다.
    const container = mapContainer.current

    // await를 사용해 SDK 준비를 기다린 다음 지도를 생성하는 비동기 함수입니다.
    async function showMap() {
      // 키 누락, SDK 로딩 실패, 지도 생성 중 발생한 오류를 아래 catch에서 처리합니다.
      try {
        // Vite가 전달한 환경 변수에서 키를 읽고 trim()으로 앞뒤 공백을 제거합니다.
        // ?.는 키가 정의되지 않았을 때 trim()을 호출하지 않도록 합니다.
        const key = import.meta.env.VITE_KAKAO_MAP_KEY?.trim()
        // 키가 없거나 빈 문자열이면 지도 로딩을 중단하고 설정 안내 오류를 발생시킵니다.
        if (!key) throw new Error('.env.local에 VITE_KAKAO_MAP_KEY를 설정해 주세요.')

        // SDK가 준비될 때까지 이 함수의 다음 단계 실행을 기다립니다.
        const maps = await loadKakaoMaps(key)
        // 기다리는 동안 effect가 정리됐거나 DOM 요소가 없으면 지도를 만들지 않습니다.
        if (cancelled || !container) return

        // SDK가 container 내부에 지도용 DOM을 생성합니다.
        new maps.Map(container, {
          // 서울시청의 위도, 경도 순서로 중심 좌표를 지정합니다.
          center: new maps.LatLng(37.5665, 126.9780),
          // 지도의 확대 수준입니다. 숫자가 작을수록 더 확대됩니다.
          level: 3,
        })
        // 지도 객체 생성에 성공하면 안내 문구를 비웁니다. 지도 타일 로딩 완료를 뜻하지는 않습니다.
        setStatus('')
      } catch (error) {
        // effect가 이미 정리됐으면 상태를 변경하지 않습니다.
        if (!cancelled) {
          // Error 객체이면 해당 메시지를, 그 외의 값이면 기본 오류 문구를 표시합니다.
          setStatus(error instanceof Error ? error.message : '지도 표시 중 오류가 발생했습니다.')
        }
      }
    }

    // 비동기 함수를 실행합니다. void는 반환되는 Promise를 여기서 사용하지 않는다는 표시입니다.
    // 함수 안의 try/catch가 오류를 처리합니다.
    void showMap()

    // 화면을 떠나거나 개발 모드에서 effect를 다시 설정하기 전에 실행하는 정리 함수입니다.
    return () => {
      // 진행 중인 네트워크 요청을 취소하지는 않고, 완료 후 지도 생성과 상태 변경을 막습니다.
      cancelled = true
      // SDK가 넣은 지도 DOM을 비웁니다. ?.는 container가 null이면 실행을 건너뜁니다.
      container?.replaceChildren()
    }
    // 빈 의존성 배열이므로 일반적인 상태 변경으로는 effect를 다시 실행하지 않습니다.
  }, [])

  // React가 화면에 표시할 JSX를 반환합니다.
  return (

    <div>
      {/* ref로 이 div를 mapContainer.current와 연결합니다. SDK가 내부에 지도를 그립니다.
          aria-label은 지도 영역을 설명하는 접근성 속성입니다.
          mt-4: 위 여백, h-96: 지도 높이, w-full: 부모 너비 전체,
          overflow-hidden: 영역 밖 내용 숨김, rounded-xl: 모서리 둥글게 표시.
          지도는 높이가 있는 영역이 필요하므로 h-96을 지정합니다. */}
      <div
        ref={mapContainer}
        aria-label="서울시청 중심 카카오 지도"
        className="mt-4 h-96 w-full overflow-hidden rounded-xl"
      />
      {/* status 값을 텍스트로 표시합니다. 빈 문자열이면 안내 문구가 보이지 않습니다.
          role="status"는 보조 기술이 안내 문구의 변화를 인식할 수 있게 합니다.
          mt-2는 위 여백, text-sm은 글자 크기, text-[#55786A]는 글자 색상입니다. */}
      <p role="status" className="mt-2 text-sm text-[#55786A]">{status}</p>
      
    </div>
      

  )
}

// 다른 파일에서 import ExamplePage from '...' 형태로 가져올 수 있게 내보냅니다.
export default ExamplePage
