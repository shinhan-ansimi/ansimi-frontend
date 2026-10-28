import { useState } from 'react'

function LocationSearchExample() {
  // 어느 항목을 검색 중인지 기억합니다. null이면 검색창을 닫습니다.
  const [searchType, setSearchType] = useState<'start' | 'end' | null>(null)

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h1 className="text-xl font-bold text-[#183B36]">안심이</h1>
      <p className="mt-1 text-xs text-[#829087]">
        오늘도 안심하고 집으로
      </p>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={() => setSearchType(searchType === 'start' ? null : 'start')}
          className="w-full rounded-xl bg-[#F4F7F2] p-4 text-left"
        >
          출발 · 현재 위치
        </button>

        <button
          type="button"
          onClick={() => setSearchType(searchType === 'end' ? null : 'end')}
          className="w-full rounded-xl bg-[#F4F7F2] p-4 text-left"
        >
          도착 · 도착지 선택
        </button>

        {/* 검색창 하나를 재사용하고, 선택 여부에 따라 부드럽게 펼칩니다. */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            searchType !== null ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <input
              type="text"
              // 선택한 항목에 맞춰 안내 문구를 바꿉니다.
              placeholder={searchType === 'start' ? '출발지를 검색하세요' : '도착지를 검색하세요'}
              disabled={searchType === null}
              aria-label={searchType === 'start' ? '출발지 검색' : '도착지 검색'}
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocationSearchExample
