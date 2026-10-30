# 카카오맵 SDK 컴포넌트 구현 가이드

이 문서는 README의 지도 및 장소 검색 계획을 현재 React + TypeScript + Vite 프로젝트에 구현하기 위한 안내입니다. 예시 코드는 핵심 흐름을 설명하며, 그대로 복사해서 완성되는 전체 구현은 아닙니다.

## 구현 목표

- 메인 화면에 지도를 표시하고 출발·도착 카드를 지도 위에 배치합니다.
- 장소명이나 주소를 검색하고 결과 목록에서 장소를 선택합니다.
- 선택한 출발지와 도착지를 카드에 표시하고 지도에 마커로 표시합니다.

현재 `MainPage`에는 `LocationCard`가 표시되어 있습니다. 카드의 `searchType` 상태는 버튼 클릭으로 변경되지만 검색 화면이나 지도에는 연결되어 있지 않습니다.

## 1. SDK 사용 준비

1. [카카오 개발자 사이트](https://developers.kakao.com/)에서 앱을 만들고 JavaScript 키를 발급받습니다.
2. 해당 키의 JavaScript SDK 도메인에 개발 서버 주소를 등록합니다. 예를 들어 `http://localhost:5173`을 사용한다면 이 주소를 등록합니다. 배포할 때는 배포 주소도 등록합니다.
3. 프로젝트 루트에 `.env.local` 파일을 만들고 키를 넣습니다.

```env
VITE_KAKAO_MAP_KEY=발급받은_JavaScript_키
```

Vite의 `VITE_` 변수는 브라우저에 전달되므로 키가 공개됩니다. 카카오 개발자 설정에서 허용 도메인을 관리하세요. 환경 변수를 추가하거나 변경한 뒤에는 개발 서버를 다시 시작합니다. 자세한 내용은 [카카오 지도 Web API 가이드](https://apis.map.kakao.com/web/guide/)를 참고하세요.

## 2. 역할과 데이터 흐름

다음과 같이 나누면 지도와 검색 UI를 독립적으로 관리할 수 있습니다.

```text
src/
├─ components/
│  ├─ KakaoMap.tsx       지도 생성과 마커 표시
│  ├─ LocationCard.tsx   출발·도착 버튼과 선택한 장소 표시
│  └─ PlaceSearch.tsx    검색창과 검색 결과 목록
├─ hooks/
│  └─ useKakaoLoader.ts  SDK 로딩 상태 관리
├─ types/
│  └─ location.ts        장소 데이터 타입
└─ pages/
   └─ MainPage.tsx       출발지·도착지 상태 관리
```

```text
MainPage: 출발지와 도착지 저장
  ├─ LocationCard: 선택한 장소 표시, 검색 대상 선택
  ├─ PlaceSearch: 검색 결과 선택 → MainPage 상태 변경
  └─ KakaoMap: 전달받은 장소를 마커로 표시
```

장소 데이터는 예를 들어 다음과 같이 정의합니다.

```ts
// src/types/location.ts
export type Location = {
  name: string
  lat: number
  lng: number
  address?: string
}
```

## 3. SDK 불러오기

장소 검색과 주소 검색을 사용하려면 SDK URL에 `libraries=services`를 포함합니다. React에서는 스크립트를 동적으로 추가하고 `autoload=false`와 `kakao.maps.load()`를 이용해 로딩이 끝난 후 SDK를 사용할 수 있습니다.

```ts
const script = document.createElement('script')
script.src =
  `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}` +
  '&autoload=false&libraries=services'

script.onload = () => {
  window.kakao.maps.load(() => {
    // 이 시점부터 지도와 services를 사용할 수 있습니다.
  })
}

script.onerror = () => {
  // 사용자에게 지도 로딩 실패 메시지를 표시합니다.
}

document.head.appendChild(script)
```

이 코드를 `useKakaoLoader`나 별도 유틸리티로 관리하고 로딩 중·완료·실패 상태를 제공하세요. 여러 컴포넌트가 사용하거나 React 개발 모드에서 effect가 다시 실행되어도 스크립트가 중복 삽입되지 않도록 로딩 작업을 공유합니다. 키가 없을 때도 오류를 표시합니다. TypeScript에서는 `window.kakao`와 SDK 객체에 대한 타입 선언도 필요합니다.

## 4. 지도 컴포넌트 만들기

`KakaoMap`은 지도 영역에 실제 높이를 지정하고, SDK 로딩이 끝난 뒤 `useEffect`에서 지도를 생성합니다.

```tsx
// 핵심 동작 예시: isLoaded는 SDK 로더가 제공하는 상태입니다.
const mapContainer = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (!isLoaded || !mapContainer.current) return

  const map = new window.kakao.maps.Map(mapContainer.current, {
    center: new window.kakao.maps.LatLng(37.5665, 126.9780),
    level: 3,
  })

  // map을 ref에 보관하면 마커 추가와 중심 이동에 사용할 수 있습니다.
}, [isLoaded])

return <div ref={mapContainer} className="h-screen w-full" />
```

출발지와 도착지가 바뀌면 각각의 마커를 갱신하고 선택한 위치로 지도를 이동시킵니다. 이전 마커를 제거하거나 위치를 갱신해 중복을 방지하세요. 지도 영역 크기가 동적으로 바뀐다면 `map.relayout()`을 호출합니다. 관련 메서드는 [카카오 지도 API 문서](https://apis.map.kakao.com/web/documentation/)를 참고하세요.

## 5. 검색과 카드 연결하기

`MainPage`에서 출발지, 도착지, 현재 검색 대상을 관리합니다.

```tsx
const [start, setStart] = useState<Location | null>(null)
const [end, setEnd] = useState<Location | null>(null)
const [searchType, setSearchType] = useState<'start' | 'end' | null>(null)
```

현재 `LocationCard` 내부에 있는 `searchType`을 `MainPage`로 옮깁니다. 카드 버튼을 누르면 검색창을 열고, 결과를 선택하면 검색 대상에 따라 `setStart` 또는 `setEnd`에 저장합니다. 선택한 장소를 카드와 지도에 props로 전달합니다.

검색에는 다음 API를 사용합니다.

- 장소명 검색: `new kakao.maps.services.Places().keywordSearch(...)`
- 주소 검색: `new kakao.maps.services.Geocoder().addressSearch(...)`

장소 검색 결과의 `x`는 경도, `y`는 위도이며 문자열이므로 `Number()`로 변환해 `Location`에 저장합니다. 검색 중, 결과 없음, 검색 실패 상태도 화면에 표시합니다. 결과 목록 구현은 [카카오 공식 장소 검색 예제](https://apis.map.kakao.com/web/sample/keywordList/)를 참고하세요.

## 권장 구현 순서

1. SDK 로딩과 빈 지도 표시를 확인합니다.
2. 기존 카드를 지도 위에 배치합니다.
3. 출발·도착 버튼과 검색창을 연결합니다.
4. 장소명과 주소 검색 결과를 표시하고 선택한 장소를 상태에 저장합니다.
5. 선택한 장소를 카드와 지도 마커에 반영합니다.
