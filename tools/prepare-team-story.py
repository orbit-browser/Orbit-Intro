from pathlib import Path
from PIL import Image
import json, hashlib, os
root=Path(__file__).resolve().parents[1]
source=root/'artifacts/team-atlas-frames'
assets=root/'src/assets'
out=assets/'team-atlas-frames';out.mkdir(exist_ok=True)
record=[]
for i in range(7):
 p=source/f'frame-{i}.png';im=Image.open(p).convert('RGB');im.thumbnail((1600,760),Image.Resampling.LANCZOS);dest=out/f'frame-{i}.webp';im.save(dest,'WEBP',lossless=True,method=6)
 evidence=json.loads((source/f'frame-{i}.json').read_text())
 assert evidence['cardCount']==i and evidence['layout']==('unified-cards' if i else 'empty')
 public_images=[image for image in evidence['images'] if '/preview/out/team-atlas-public/' in image['src']]
 assert len(public_images)==i and all(image['w']>0 and image['h']>0 for image in public_images)
 record.append(dict(layout=evidence['layout'],cardCount=evidence['cardCount'],loadedPublicImages=len(public_images),file=str(dest.relative_to(assets)),width=im.width,height=im.height,bytes=dest.stat().st_size,sourceSha256=hashlib.sha256(p.read_bytes()).hexdigest(),frame=i))
public=Path(os.environ['ORBIT_PRODUCT_ROOT'])/'extension/preview/out/team-atlas-public'
pages=assets/'team-pages';pages.mkdir(exist_ok=True)
for r in json.loads((public/'provenance.json').read_text()):
 im=Image.open(public/r['file']).convert('RGB');im.thumbnail((720,1000),Image.Resampling.LANCZOS);dest=pages/(Path(r['file']).stem+'.webp');im.save(dest,'WEBP',quality=90,method=6)
record={'productBase':os.environ['ORBIT_PRODUCT_REVISION'],'productBranch':'main','mode':'Actual product components with synthetic public-document visits; not authenticated two-user E2E. Public demo image registry is isolated capture scaffolding; no screenshot upload service is represented.','captureRoute':'http://127.0.0.1:5213/preview/newtab.html?scope=w-team-stream&theme=light&snapshots=on&teamStoryFrame={0..6}#/orbit-atlas?session=s-team-stream-u-me','frames':record,'pages':json.loads((public/'provenance.json').read_text())}
(out/'provenance.json').write_text(json.dumps(record,ensure_ascii=False,indent=2))
print('Frame bytes',sum(r['bytes'] for r in record['frames']))
