"""Keep the existing local font family; fetch only newly needed Noto KR glyphs."""
from pathlib import Path
import hashlib,re,urllib.request,urllib.parse
from fontTools.ttLib import TTFont
root=Path(__file__).resolve().parents[1]
base=(root/'src/assets/fonts/fonts.css').read_text()
ranges=[]
for block in base.split('@font-face'):
 if "'Noto Sans KR'" not in block: continue
 for a,b in re.findall(r'U\+([0-9A-F]+)(?:-([0-9A-F]+))?',block,re.I): ranges.append((int(a,16),int(b or a,16)))
content=(root/'src/index.html').read_text()+(root/'src/main.js').read_text()
chars=sorted({c for c in content if '가'<=c<='힣' and not any(a<=ord(c)<=b for a,b in ranges)})
if not chars: raise SystemExit('No additional Korean glyphs required')
params=urllib.parse.urlencode({'family':'Noto Sans KR:wght@300..900','display':'swap','text':''.join(chars)})
url='https://fonts.googleapis.com/css2?'+params
ua='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
css=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':ua}),timeout=30).read().decode()
font_url=re.search(r'url\((https://fonts.gstatic.com/[^)]+)\)',css).group(1)
data=urllib.request.urlopen(font_url,timeout=30).read();assert data[:4]==b'wOF2'
p=root/'src/assets/fonts/noto-kr-additional.woff2';p.write_bytes(data)
font=TTFont(p);assert all(ord(c) in font.getBestCmap() for c in chars)
(root/'src/assets/fonts/additional.css').write_text("/* Noto Sans KR, SIL OFL. Only glyphs absent from the established local subset. */\n@font-face {font-family:'Noto Sans KR';font-style:normal;font-weight:300 900;font-display:swap;src:url('./noto-kr-additional.woff2') format('woff2');unicode-range:"+','.join(f'U+{ord(c):04X}' for c in chars)+";}\n")
(root/'docs/FontSubset.md').write_text('# Additional Korean glyphs\n\n- Family: Noto Sans KR, Google Fonts, SIL OFL (license included in assets).\n- Source CSS: '+url+'\n- Source font: '+font_url+'\n- Characters: '+''.join(chars)+'\n- SHA256: '+hashlib.sha256(data).hexdigest()+'\n- Size: '+str(len(data))+' bytes. Actual cmap verified with fontTools.\n- Regenerate with tools/refresh-korean-subset.py after changing public copy.\n')
print('Verified additional glyphs:', ''.join(chars), 'bytes:',len(data))
