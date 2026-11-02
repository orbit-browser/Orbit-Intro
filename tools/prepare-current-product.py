"""Encode actual current-product captures; retain verifiable source hashes."""
from pathlib import Path
from PIL import Image
import json, hashlib, re, sys, os
root = Path(__file__).resolve().parents[1]
source = root / 'artifacts/current-product'
assets = root / 'src/assets'
manifest_path = assets / 'provenance.json'
manifest = json.loads(manifest_path.read_text())
captures = {r['name']: r for r in json.loads((source / 'captures.json').read_text())}
names = {'atlas-overview':1920, 'atlas-detail':1600, 'atlas-orbit':1920,
         'home':1920, 'orbit-ai':1920, 'timeline':920, 'extension-timeline':920,
         'restore-before':672, 'restore-after':672, 'team-collect-start':760,
         'team-sharing':544, 'team-atlas':1920}
html = (root / 'src/index.html').read_text()
for name, width in names.items():
    if len(sys.argv) > 1 and name not in sys.argv[1:]: continue
    original = source / f'{name}.png'
    raw = Image.open(original).convert('RGB')
    sha = hashlib.sha256(original.read_bytes()).hexdigest()
    def save(suffix, limit):
        im = raw.copy()
        im.thumbnail((limit,12000),Image.Resampling.LANCZOS)
        dest = assets / 'screens' / f'{name}{suffix}.webp'
        im.save(dest, 'WEBP', lossless=True, method=6)
        return dict(file=f'screens/{dest.name}', width=im.width, height=im.height,
                    bytes=dest.stat().st_size, source=str(original.relative_to(root)), sourceSha256=sha)
    record = save('',width)
    record.update(variants=[save('-small',width//2),save('-detail',min(3600,raw.width))],
        processing='Lossless responsive derivative of actual product component capture; no composited UI.',
        productCommit=os.environ['ORBIT_PRODUCT_REVISION'],
        content='Synthetic demonstration records; isolated API/Chrome doubles; not live user data.',
        captureRoute=('Team story frame 6; see team-atlas-frames/provenance.json' if name == 'team-atlas' else captures.get(name,{}).get('url','')))
    existing = next((i for i, item in enumerate(manifest['screens']) if item['file'] == record['file']), None)
    if existing is None:
        manifest['screens'].append(record)
    else:
        manifest['screens'][existing] = record
    def update(match):
        tag=match[0]
        tag=re.sub(r'width="\d+"',f'width="{record["width"]}"',tag)
        tag=re.sub(r'height="\d+"',f'height="{record["height"]}"',tag)
        sizes=f'./assets/screens/{name}-small.webp {record["variants"][0]["width"]}w, ./assets/screens/{name}.webp {record["width"]}w'
        if 'srcset=' in tag: tag=re.sub(r'srcset="[^"]*"',f'srcset="{sizes}"',tag)
        else: tag=tag.replace(' loading=',f' srcset="{sizes}" sizes="(max-width:700px) 90vw, 80vw" loading=')
        return tag
    html=re.sub(r'<img\b[^>]*src="\./assets/screens/'+re.escape(name)+r'\.webp"[^>]*>',update,html)
    print(name,record['width'],record['height'],record['bytes'])
# A selective correction must not relabel unchanged baseline images.
if len(sys.argv) == 1:
    manifest['currentProductCommit']=os.environ['ORBIT_PRODUCT_REVISION']
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(root/'src/index.html').write_text(html)
