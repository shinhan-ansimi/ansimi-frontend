from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).parent

def t(x, y, value, size=14, color='#183B36', weight=400):
    return f'<text x="{x}" y="{y}" font-family="Pretendard, Noto Sans KR, sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">{value}</text>'

def r(x,y,w,h,fill='white',radius=16):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}"/>'

# Reuse the existing editable map illustration, without its route or labels.
original = (ROOT/'Screen_경로설정.svg').read_text(encoding='utf-8')
map_part = original[original.index('<rect'):original.index('<circle cx="263"')]
# Remove the example route so this view represents selection before route calculation.
import re
map_part = re.sub(r'<polyline[^>]*stroke="(?:#25A77A|#428AE5|#ED7267)"[^>]*/>', '', map_part)
svg = '<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844"><title>안심이 · 출발지와 도착지 지정</title><desc>첫 번째 경로 설정 화면의 도착지 선택 상태. 검색하거나 지도를 움직여 중앙 핀의 위치를 선택하고 확인합니다. 장소와 주소는 시안용 예시입니다.</desc>' + map_part
svg += r(0,0,390,54,'#FAFCF8',0) + t(24,33,'9:41',14,weight=700) + t(306,33,'● ▰ ▰',12)
svg += r(16,64,358,227) + t(32,96,'‹',28) + t(63,94,'경로 지정',19,weight=800) + t(32,120,'현재 위치에서 출발할 도착지를 선택하세요',12,'#829087')
svg += r(32,136,326,48,'#F4F7F2',12) + '<circle cx="49" cy="160" r="5" fill="#25A77A"/>' + t(64,165,'출발',11,'#7A8D81') + t(108,165,'현재 위치',14,weight=600) + t(301,165,'자동 설정',11,'#7A8D81')
svg += r(32,193,326,48,'#EEF7F1',12) + '<rect x="32" y="193" width="326" height="48" rx="12" fill="none" stroke="#25A77A" stroke-width="1.5"/>' + '<circle cx="49" cy="217" r="5" fill="#183B36"/>' + t(64,222,'도착',11,'#7A8D81') + t(108,222,'장소 또는 주소 검색',14,'#86998C')
svg += '<circle cx="333" cy="214" r="6" fill="none" stroke="#55786A" stroke-width="1.5"/><path d="M337 219L342 224" stroke="#55786A" stroke-width="1.5" stroke-linecap="round"/>'
svg += t(32,263,'주소 검색 또는 지도에서 직접 선택',12,'#687E70') + t(32,281,'안전도 평가는 서울 지역에서 제공해요',10,'#829087')
svg += r(73,310,244,34,'#173E35',17) + t(91,332,'지도를 움직여 도착지를 맞춰주세요',12,'white',500)
svg += '<ellipse cx="195" cy="481" rx="17" ry="6" fill="#183B36" fill-opacity="0.15"/><path d="M195 477C190 468 175 455 175 443A20 20 0 0 1 215 443C215 455 200 468 195 477Z" fill="#173E35" stroke="white" stroke-width="3"/><circle cx="195" cy="443" r="7" fill="white"/>'
svg += '<circle cx="110" cy="571" r="18" fill="#428AE5" fill-opacity="0.15"/><circle cx="110" cy="571" r="7" fill="#428AE5" stroke="white" stroke-width="3"/>' + r(34,597,103,27) + t(48,615,'출발 · 현재 위치',11,'#428AE5',600)
svg += r(322,565,48,48,'white',16) + '<circle cx="346" cy="589" r="9" fill="none" stroke="#183B36" stroke-width="2"/><circle cx="346" cy="589" r="3" fill="#183B36"/>'
svg += r(16,651,358,166) + r(173,662,44,4,'#D9E3DA',2) + t(32,695,'선택한 도착지',12,'#78877D') + t(32,724,'안심로 24',21,weight=750) + t(32,747,'지도 중앙 핀의 위치를 도착지로 설정해요',12,'#78877D')
svg += r(32,764,326,40,'#173E35',12) + t(123,790,'이 위치로 경로 확인',15,'white',700)
svg += r(134,830,122,5,'#183B36',3) + '</svg>'
ET.fromstring(svg)
(ROOT/'Screen_경로지정.svg').write_text(svg,encoding='utf-8')
print('Screen_경로지정.svg: XML valid, 390 x 844')
