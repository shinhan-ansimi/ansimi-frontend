function ExamplePage() {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h1 className="text-xl font-bold text-[#183B36]">안심이</h1>
      <p className="mt-1 text-xs text-[#829087]">
        오늘도 안심하고 집으로
      </p>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          className="flex h-12 w-full items-center rounded-xl border border-transparent bg-[#F4F7F2] px-3 text-left"
        >
          {/* 색상 점, 항목 이름, 현재 위치를 한 줄에 표시합니다. */}
          <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#25A77A]" />
          <span className="ml-2.5 w-11 text-[11px] text-[#7A8D81]">출발</span>
          <span className="flex-1 text-sm font-semibold text-[#183B36]">현재 위치</span>
          <span className="text-[11px] text-[#7A8D81]">자동 설정</span>
        </button>

        <button
          type="button"
          className="flex h-12 w-full items-center rounded-xl border border-[#25A77A] bg-[#EEF7F1] px-3 text-left"
        >
          <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-black" />
          <span className="ml-2.5 w-11 text-[11px] text-[#7A8D81]">도착</span>
          <span className="flex-1 text-sm text-[#86998C]">장소 또는 주소 검색</span>
          {/* 검색 아이콘은 장식이므로 스크린 리더에서 숨깁니다. */}
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#55786A" strokeWidth="1.5" />
            <path d="M12.5 12.5L17 17" stroke="#55786A" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

      </div>
    </section>
  )
}

export default ExamplePage
