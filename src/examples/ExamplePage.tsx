import { useState } from 'react'

// 1. 객체의 모양을 설명하는 타입입니다.
type Position = {
  latitude: number
  longitude: number
}

type MapInfo = {
  center: Position
  level: number
}

type PracticeMaps = {
  createPosition: (lat: number, lng: number) => Position
  createMap: (center: Position, level: number) => MapInfo
}

// 2. 실제 객체입니다. 함수에서 객체를 만들어 반환합니다.
const maps: PracticeMaps = {
  createPosition: (lat, lng) => {
    return { latitude: lat, longitude: lng }
  },
  createMap: (center, level) => {
    return { center: center, level: level }
  },
}

function ExamplePage() {
  const [message, setMessage] = useState('버튼을 눌러 보세요.')

  function handleClick() {
    // 3. 좌표를 만들고, 그 좌표로 지도 정보를 만듭니다.
    const center = maps.createPosition(37.5, 127)
    const map = maps.createMap(center, 3)

    setMessage(`위도 ${map.center.latitude}, 경도 ${map.center.longitude}, 확대 수준 ${map.level}`)
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-bold">좌표와 지도 정보 만들기</h1>
      <button
        type="button"
        onClick={handleClick}
        className="rounded bg-green-800 px-4 py-2 text-white"
      >
        객체 만들기
      </button>
      <p role="status">{message}</p>
      <p>일반 함수로 객체를 반환하는 연습입니다. 실제 카카오 지도 API와는 다릅니다.</p>
    </div>
  )
}

export default ExamplePage
