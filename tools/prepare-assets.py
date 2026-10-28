from pathlib import Path
from PIL import Image
import json,hashlib,shutil,re,argparse
parser=argparse.ArgumentParser(description='Optimise approved Orbit assets for the introduction website.')
parser.add_argument('--source-root',type=Path,required=True,help='Orbit checkout containing the exhibition source assets')
W=parser.parse_args().source_root.resolve();E=W/'extension/preview/exhibition/assets';OUT=Path(__file__).resolve().parents[1]/'src/assets';records=[]
def image(source,target,maxw,crop=False):
 im=Image.open(source).convert('RGB')
 if crop:im=im.crop((0,0,im.width,min(im.height,round(im.width*1.2))))
 im.thumbnail((maxw,2000),Image.Resampling.LANCZOS);file=OUT/target;im.save(file,'WEBP',quality=88,method=6)
 records.append({'file':target,'source':str(source.relative_to(W)),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'width':im.width,'height':im.height,'bytes':file.stat().st_size,'processing':'Resize for web; top crop only' if crop else 'Resize for web only','content':'Existing real public capture' if target.startswith('pages') else 'Real Orbit product screen with demonstration fixtures'})
for name in ['seongsan','dining','flight','saebyeol','udo','hallasan','route','seopjikoji']:
 image(E/f'main03-v12/{name}-page.png',f'pages/{name}.webp',520,True)
for source,name,width in [('main01-v1/newtab-keep-exploring.png','home',1600),('main01-v2/timeline-landed.png','timeline',760),('main03-v12/retrieval-ui.png','orbit-ai',1500),('main03-v32/restore-before.png','restore-before',1000),('main03-v32/restore-after.png','restore-after',1500),('main05-v2/team-sessions.png','team-sessions',850),('main05-v2/team-ask.png','team-ai',850)]:image(E/source,f'screens/{name}.webp',width)
shutil.copytree(E/'main03-v12/fonts',OUT/'fonts',dirs_exist_ok=True)
for f in (OUT/'fonts').glob('*.json'):f.unlink()
shutil.copy2(E/'main03-v14/Oswald-wght.ttf',OUT/'fonts/Oswald-wght.ttf')
font=(OUT/'fonts/fonts.css').read_text();(OUT/'fonts/fonts.css').write_text(font+'\n@font-face {font-family:Orbit Oswald;src:url(./Oswald-wght.ttf) format("truetype");font-weight:200 700;font-display:swap;}\n')
brand=(E/'side-panels-v1/brand-symbol.ts').read_text();path=json.loads(re.search(r' = (".*");',brand).group(1))
(OUT/'orbit-symbol.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 580"><path fill="#f07550" d="'+path+'"/></svg>')
shutil.copy2(W/'extension/public/orbit-mark-32.png',OUT/'favicon.png')
(OUT/'provenance.json').write_text(json.dumps({'screens':records,'notice':'Product screens use demonstration fixture data. Named demo users are not real Orbit team member profiles.','symbol':'Original orbit_icon.png silhouette, vectorised by existing exhibition source.','colours':['#fefaf6','#2b2521','#f07550']},ensure_ascii=False,indent=2))
print('Optimised images bytes:',sum(r['bytes'] for r in records))
