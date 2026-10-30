import { useEffect, useRef, useState } from 'react'

// 이 예제에서 사용하는 SDK 기능의 타입만 선언합니다.
type KakaoMaps = {
  load: (callback: () => void) => void
  LatLng: new (latitude: number, longitude: number) => object
  Map: new (container: HTMLElement, options: { center: object; level: number }) => object
}

const kakaoWindow = window as Window & { kakao?: { maps: KakaoMaps } }
let sdkPromise: Promise<KakaoMaps> | undefined

function loadKakaoMaps(key: string): Promise<KakaoMaps> {
  // 여러 번 렌더링되어도 SDK 스크립트는 한 번만 불러옵니다.
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise<KakaoMaps>((resolve, reject) => {
    const initialize = () => {
      const maps = kakaoWindow.kakao?.maps
      if (!maps) {
        reject(new Error('카카오 지도 SDK를 확인할 수 없습니다.'))
        return
      }
      maps.load(() => resolve(maps))
    }

    if (kakaoWindow.kakao?.maps) {
      initialize()
      return
    }

    const script = document.createElement('script')
    // autoload=false로 설정하고 maps.load() 완료 후 지도를 생성합니다.
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`
    script.async = true
    script.onload = initialize
    script.onerror = () => {
      script.remove()
      reject(new Error('지도를 불러오지 못했습니다. 네트워크와 키, 허용 도메인을 확인해 주세요.'))
    }
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    sdkPromise = undefined
    throw error
  })

  return sdkPromise
}

function ExamplePage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState('지도를 불러오는 중입니다.')

  useEffect(() => {
    let cancelled = false
    const container = mapContainer.current

    async function showMap() {
      try {
        // .env.local에 저장한 JavaScript 키를 읽습니다.
        const key = import.meta.env.VITE_KAKAO_MAP_KEY?.trim()
        if (!key) throw new Error('.env.local에 VITE_KAKAO_MAP_KEY를 설정해 주세요.')

        const maps = await loadKakaoMaps(key)
        if (cancelled || !container) return

        // 서울시청을 중심으로 지도를 표시합니다. level이 작을수록 확대됩니다.
        new maps.Map(container, {
          center: new maps.LatLng(37.5665, 126.9780),
          level: 3,
        })
        setStatus('')
      } catch (error) {
        if (!cancelled) {
          setStatus(error instanceof Error ? error.message : '지도 표시 중 오류가 발생했습니다.')
        }
      }
    }

    void showMap()

    // 화면을 떠난 뒤 비동기 작업이 지도를 생성하지 않도록 합니다.
    return () => {
      cancelled = true
      container?.replaceChildren()
    }
  }, [])

  return (

    <div>
      
      <div
        ref={mapContainer}
        aria-label="서울시청 중심 카카오 지도"
        className="mt-4 h-96 w-full overflow-hidden rounded-xl"
      />
      <p role="status" className="mt-2 text-sm text-[#55786A]">{status}</p>
      
    </div>
      

  )
}

export default ExamplePage
