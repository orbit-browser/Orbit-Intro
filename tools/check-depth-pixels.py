# Chrome hit-test order does not reliably follow preserve-3d paint order.
# Verify actual raster colours on overlapping planes instead.
from PIL import Image
import json,sys
im=Image.open(sys.argv[1]).convert('RGB')
points=json.load(open(sys.argv[2]));front=back=wrong=0
for p in points:
 r,g,b=im.getpixel((p['x'],p['y']))
 green=g>220 and r<25 and b<25
 pink=r>220 and b>220 and g<25
 if not(green or pink):continue
 # Exclude a two-pixel edge band: perspective edges are antialiased,
 # while hit-test coverage is rounded to CSS pixels.
 same=True
 for dx,dy in [(-2,0),(2,0),(0,-2),(0,2)]:
  nr,ng,nb=im.getpixel((p['x']+dx,p['y']+dy))
  same &= (ng>220 and nr<25 and nb<25) if green else (nr>220 and nb>220 and ng<25)
 if not same:continue
 front+=green;back+=pink
 wrong+=bool(green)!=p['front']
print(json.dumps({'front':front,'back':back,'wrong':wrong}))
