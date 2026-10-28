from pathlib import Path
import xml.etree.ElementTree as ET

OUT = Path(__file__).parent
OUT.mkdir(exist_ok=True)

def text(x, y, value, size=14, color='#183B36', weight=400):
    return f'<text x="{x}" y="{y}" font-family="Pretendard, Noto Sans KR, sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">{value}</text>'

def rect(x, y, w, h, fill='white', r=20, stroke='none'):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}"/>'

def line(points, color, width=7):
    return f'<polyline points="{points}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'

def pin(x, y, label, color, symbol):
    return f'<g><circle cx="{x}" cy="{y}" r="15" fill="white" stroke="{color}" stroke-width="2"/>{text(x-7,y+5,symbol,14,color,700)}{rect(x+20,y-13,68,26,"white",8)}{text(x+28,y+5,label,11,"#51655E",500)}</g>'

def map_base():
    s = rect(0,0,390,844,'#EEF2E9',0)
    for x,y,w,h in [(18,150,69,95),(109,163,80,69),(216,149,61,115),(299,169,76,88),(14,291,91,79),(131,282,59,104),(218,301,70,65),(310,290,64,99),(18,421,80,86),(125,429,61,72),(214,412,72,89),(315,425,67,68),(20,545,87,80),(137,547,58,105),(222,546,61,76),(310,546,63,95),(24,686,72,74),(126,697,76,67),(223,680,62,89)]:
        s += rect(x,y,w,h,'#DFE5D9',9)
    s += rect(209,277,84,100,'#DCEBCF',18)
    s += text(224,333,'작은 공원',11,'#7B946B')
    for p in ['-20,266 410,266','-20,402 410,402','-20,525 410,525','-20,666 410,666','110,120 110,844','202,120 202,844','297,120 297,844']:
        s += line(p,'#FFFFFF',18)
    s += line('-10,772 95,715 178,607 221,500 275,390 335,307 410,274','#FFFFFF',24)
    s += text(22,397,'안심로',10,'#9AA99E') + text(306,517,'중앙길',10,'#9AA99E')
    s += line('110,571 110,525 202,525','#FFFFFF',12)
    s += line('202,525 202,402 297,402','#FFFFFF',12)
    s += line('297,402 297,266 263,266','#FFFFFF',12)
    s += line('110,571 110,525 202,525','#25A77A')
    s += line('202,525 202,402 297,402','#428AE5')
    s += line('297,402 297,330','#ED7267')
    s += line('297,330 297,266 263,266','#25A77A')
    s += '<circle cx="263" cy="266" r="11" fill="#173E35" stroke="white" stroke-width="3"/>'
    s += text(259,270,'집',8,'white',700)
    s += pin(55,447,'편의점','#25A77A','C') + pin(244,358,'병원','#428AE5','+') + pin(324,574,'가게','#9B7FCC','S')
    return s

def base(title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844"><title>{title}</title><desc>안심이 프론트엔드 기획 기반 모바일 화면. 지도, 장소, 거리와 위험 수준은 시안용 예시입니다.</desc>' + map_base() + rect(0,0,390,54,'#FAFCF8',0) + text(24,33,'9:41',14,weight=700) + text(306,33,'● ▰ ▰',12) + rect(134,830,122,5,'#183B36',3)

def legend(x,y):
    s=''
    for dx,c,label in [(0,'#25A77A','낮음'),(79,'#428AE5','보통'),(158,'#ED7267','높음')]:
        s+= f'<circle cx="{x+dx}" cy="{y-4}" r="4" fill="{c}"/>' + text(x+dx+10,y,label,12,'#65756D')
    return s

setup = base('안심이 · 경로 설정')
setup += rect(16,64,358,205) + text(32,96,'안심이',21,weight=800) + text(32,119,'오늘도 안심하고 집으로',12,'#829087')
setup += rect(32,137,326,49,'#F4F7F2',12) + '<circle cx="49" cy="161" r="5" fill="#25A77A"/>' + text(64,166,'출발',11,'#7A8D81') + text(108,166,'현재 위치',14,weight=600)
setup += rect(32,193,326,49,'#F4F7F2',12) + '<circle cx="49" cy="217" r="5" fill="#183B36"/>' + text(64,222,'도착',11,'#7A8D81') + text(108,222,'집 · 안심로 24',14,weight=600) + text(335,222,'›',20,'#8B9B90')
setup += '<circle cx="110" cy="571" r="18" fill="#428AE5" fill-opacity="0.15"/><circle cx="110" cy="571" r="7" fill="#428AE5" stroke="white" stroke-width="3"/>'
setup += rect(322,550,48,48,'white',16) + '<circle cx="346" cy="574" r="9" fill="none" stroke="#183B36" stroke-width="2"/><circle cx="346" cy="574" r="3" fill="#183B36"/>'
setup += rect(16,613,358,204) + text(32,643,'추천 경로',18,weight=700) + rect(259,627,99,25,'#EAF6EF',12) + text(271,644,'안전도 78 / 100',11,'#218862',600)
setup += text(32,678,'18분',28,weight=800) + text(112,676,'·  1.2 km',14,'#78877D')
setup += text(32,701,'추천 이유',11,'#78877D',600) + text(32,722,'후보 경로 중 안전도 점수가 가장 높아요.',12)
setup += text(32,743,'점수·거리·추천 이유는 시안용 예시입니다.',10,'#8A998F')
setup += rect(32,761,326,42,'#173E35',13) + text(143,788,'귀가 모드 시작',15,'white',700)
setup += rect(16,284,250,35,'white',12) + legend(33,306) + '</svg>'

guide = base('안심이 · 사용자 위치 및 경로 안내')
guide += rect(16,64,358,65) + rect(31,84,7,7,'#25A77A',4) + text(48,94,'귀가 모드 진행 중',14,weight=700) + text(48,114,'집까지 경로를 안내할게요',11,'#829087') + rect(299,80,59,31,'#F1F5EF',10) + text(313,100,'종료',12,weight=600)
guide += rect(16,141,358,93,'#173E35',20) + line('44,205 44,175 64,175','#FFFFFF',4) + line('55,165 65,175 55,185','#FFFFFF',4) + text(82,175,'약 120m 앞에서 우회전',18,'white',700) + text(82,201,'현재 구간 · 안심로 직진',12,'#BCD3C7') + text(82,220,'현재 구간 위험 수준 · 보통',11,'#BCD3C7')
guide += '<circle cx="202" cy="497" r="32" fill="#428AE5" fill-opacity="0.12"/><circle cx="202" cy="497" r="19" fill="#428AE5" fill-opacity="0.12"/><circle cx="202" cy="497" r="10" fill="#428AE5" stroke="white" stroke-width="4"/>'
guide += rect(142,539,120,29,'white',12) + text(159,558,'현재 내 위치',12,'#428AE5',600)
guide += rect(322,623,48,48,'white',16) + '<circle cx="346" cy="647" r="9" fill="none" stroke="#183B36" stroke-width="2"/><circle cx="346" cy="647" r="3" fill="#183B36"/>'
guide += rect(16,687,358,130) + text(32,718,'집까지 · 남은 시간 추정',12,'#78877D') + text(32,753,'약 12분',28,weight=800) + text(162,750,'·  800 m 남음',14,'#78877D') + '<line x1="32" y1="768" x2="358" y2="768" stroke="#E7EDE4"/>' + text(32,794,'구간 위험도',12,weight=600) + legend(138,794) + '</svg>'

for name, content in [('Screen_경로설정.svg',setup),('Screen_귀가안내.svg',guide)]:
    ET.fromstring(content)
    (OUT/name).write_text(content,encoding='utf-8')
    print(f'{name}: XML valid, 390 × 844')
