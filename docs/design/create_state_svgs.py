from pathlib import Path
from html import escape
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).parent

def rect(x,y,w,h,fill='#FFFFFF',radius=20):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}"/>'

def text(x,y,value,size=14,color='#183B36',weight=400):
    return f'<text x="{x}" y="{y}" font-family="Pretendard, Noto Sans KR, sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">{escape(value)}</text>'

def button(y,label,secondary=False):
    return rect(32,y,326,44,'#EEF4EE' if secondary else '#173E35',13) + text(195,y+28,label,14,'#173E35' if secondary else 'white',650).replace('<text ', '<text text-anchor="middle" ',1)

def write(name,svg):
    ET.fromstring(svg)
    (ROOT/f'Screen_{name}.svg').write_text(svg,encoding='utf-8')

def base(name,title):
    s=(ROOT/name).read_text(encoding='utf-8').removesuffix('</svg>')
    return re.sub(r'<title>.*?</title>',f'<title>안심이 · {title}</title>',s)

states=[
    ('경로조회중','Screen_경로설정.svg','경로를 확인하고 있어요',['이동 경로와 안전도를 함께 확인해요.','잠시만 기다려 주세요.'],'요청 취소','진행중'),
    ('경로조회실패','Screen_경로설정.svg','경로를 불러오지 못했어요',['연결 상태를 확인하고 다시 시도해 주세요.','출발지와 도착지는 그대로 유지돼요.'],'다시 시도','오류'),
    ('안전도평가불가','Screen_경로설정.svg','안전도 평가를 완료하지 못했어요',['경로는 있지만 안전도 정보가 부족해요.','안전 추천과 구간별 위험도는 표시하지 않아요.'],'평가 다시 시도','정보 부족'),
    ('위치권한안내','Screen_경로지정.svg','현재 위치를 사용할 수 없어요',['출발지 설정과 귀가 안내에 위치 권한이 필요해요.','브라우저 또는 기기 설정에서 권한을 허용한 뒤','돌아와서 위치를 다시 확인해 주세요.'],'위치 다시 확인','권한 필요'),
    ('위치확인중','Screen_귀가안내.svg','정확한 위치를 확인하고 있어요',['위치 갱신이 끊겼거나 정확도가 낮아요.','이동 안내와 도착 판단을 잠시 보류해요.'],'위치 다시 확인','위치 확인중'),
    ('경로재탐색','Screen_귀가안내.svg','새로운 경로를 찾고 있어요',['현재 위치에서 기존 도착지까지 다시 확인해요.','새 경로의 안전도 평가를 기다려 주세요.'],'귀가 모드 종료','재탐색중'),
    ('도착완료','Screen_귀가안내.svg','목적지에 도착했어요',['집 · 안심로 24','귀가 안내와 위치 추적이 종료되었어요.'],'경로 설정으로 돌아가기','도착'),
    ('귀가안내복원','Screen_경로설정.svg','이전 귀가 안내를 이어갈까요?',['도착지 · 집, 안심로 24','현재 위치를 다시 확인하고 안내를 재개해요.'],'이어서 안내','이전 귀가'),
]

for name,source,title,lines,label,badge in states:
    s=base(source,title)
    if name=='안전도평가불가':
        s=re.sub(r'stroke="#(?:25A77A|428AE5|ED7267)" stroke-width="7"','stroke="#92A398" stroke-width="7"',s)
    s+='<rect x="0" y="54" width="390" height="790" fill="#14382E" fill-opacity="0.24"/>'
    s+=rect(16,510,358,307)+rect(174,522,42,4,'#D9E3DA',2)
    s+=rect(32,544,112,26,'#EEF4EE',13)+text(45,562,badge,11,'#557565',600)
    s+=text(32,606,title,18,weight=750)
    for i,value in enumerate(lines):
        s+=text(32,637+i*22,value,12,'#74857A')
    s+=button(707,label)
    s+=button(759,'새 경로 설정' if name=='귀가안내복원' else ('도착지 다시 선택' if name in ['경로조회실패','안전도평가불가'] else '닫기'),True)
    if name=='위치확인중':
        s+=rect(16,141,358,93,'#173E35')+text(32,177,'위치 확인 중 · 이동 안내 보류',17,'white',650)+text(32,205,'위치가 확인되면 현재 구간을 다시 판단해요',12,'#BCD3C7')
    if name=='경로재탐색':
        s+=rect(16,141,358,93,'#173E35')+text(32,177,'경로 이탈 · 재탐색 중',18,'white',650)+text(32,205,'이전 경로의 이동 안내는 잠시 보류해요',12,'#BCD3C7')
    s+=rect(134,830,122,5,'#183B36',3)+'</svg>'
    write(name,s)

s=base('Screen_귀가안내.svg','주변 시설 정보')
s+=rect(16,651,358,166)+text(32,683,'주변 시설',12,'#74857A')+text(32,718,'안심 편의점',22,weight=750)+text(338,683,'×',20)+text(32,744,'편의점 · 안심로 18',13,'#74857A')+text(32,776,'시설 위치를 확인할 수 있어요.',12,'#74857A')+text(32,798,'시설명과 주소는 시안용 예시입니다.',10,'#98A59C')+'</svg>'
write('시설상세',s)

s=base('Screen_경로지정.svg','도착지 검색 결과')
s+=rect(16,193,358,624)+text(32,224,'안심로',16,weight=650)+text(339,225,'×',20)+text(32,265,'도착지 검색 결과',13,'#74857A')
for i,(title,address) in enumerate([('안심로 24','서울 · 안심로 24'),('안심 공원','서울 · 안심로 12'),('안심 편의점','서울 · 안심로 18')]):
    y=287+i*96
    s+=rect(32,y,326,80,'#F3F6F0',12)+text(48,y+29,title,16,weight=650)+text(48,y+54,address,12,'#74857A')+text(336,y+43,'›',20)
s+=text(32,603,'검색 결과를 선택한 뒤 지도에서 위치를 확인해요.',12,'#74857A')+text(32,631,'장소와 주소는 시안용 예시입니다.',11,'#98A59C')+button(759,'지도에서 직접 선택',True)+'</svg>'
write('도착지검색',s)

svgs=list(ROOT.glob('*.svg'))
for p in svgs:
    tree=ET.parse(p)
    assert tree.getroot().attrib['viewBox']=='0 0 390 844'
print(f'Validated {len(svgs)} SVG files (390 x 844).')
