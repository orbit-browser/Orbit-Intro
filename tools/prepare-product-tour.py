"""Make lossless responsive derivatives of actual Orbit preview captures."""
from pathlib import Path
from PIL import Image
import json,hashlib,re
root=Path(__file__).resolve().parents[1]
source=root/'artifacts/product-tour-2026-10-28';assets=root/'src/assets';p=assets/'provenance.json';manifest=json.loads(p.read_text())
names={'atlas-overview':1920,'atlas-detail':1600,'extension-timeline':1000,'team-atlas':1920,'team-collect-start':1000}
html=(root/'src/index.html').read_text()
for name,width in names.items():
 origin=source/({'atlas-overview':'atlas-development.png','team-collect-start':'team-collect-start-sheet.png','extension-timeline':'extension-sessions.png'}.get(name,name+'.png'))
 if not origin.exists():print('Pending:',origin.name);continue
 raw=Image.open(origin).convert('RGB');detail=raw.copy()
 if name=='team-collect-start':raw=raw.crop((45,1190,2130,1775))
 sha=hashlib.sha256(origin.read_bytes()).hexdigest()
 def save(suffix,target):
  im=(detail if suffix=='-detail' else raw).copy();im.thumbnail((target,12000),Image.Resampling.LANCZOS);out=assets/'screens'/(name+suffix+'.webp');im.save(out,'WEBP',lossless=True,method=6)
  return {'file':'screens/'+out.name,'width':im.width,'height':im.height,'bytes':out.stat().st_size,'source':str(origin.relative_to(root)),'sourceSha256':sha}
 record=save('',width);record['variants']=[save('-small',width//2),save('-detail',max(width,min(3600,raw.width)))];record['processing']='Lossless responsive resize; no UI text, controls or member data composited into the capture.';record['backend']='Latest application 059aa45 preview fixtures, not live user data.'
 if name=='team-collect-start':record['crop']=[45,1190,2130,1775];record['detailUncropped']=True
 manifest['screens']=[r for r in manifest['screens'] if r['file']!=record['file']]+[record]
 pattern=r'<img\b[^>]*src="\./assets/screens/'+re.escape(name)+r'\.webp"[^>]*>'
 def update(m):
  s=m[0];s=re.sub(r'width="\d+"',f'width="{record["width"]}"',s);s=re.sub(r'height="\d+"',f'height="{record["height"]}"',s)
  if 'srcset=' not in s:s=s.replace(' loading=',f' srcset="./assets/screens/{name}-small.webp {record["variants"][0]["width"]}w, ./assets/screens/{name}.webp {record["width"]}w" sizes="(max-width:700px) 90vw, 80vw" loading=')
  return s
 html=re.sub(pattern,update,html);print(name,record['width'],record['height'],record['bytes'])
p.write_text(json.dumps(manifest,ensure_ascii=False,indent=2));(root/'src/index.html').write_text(html)
