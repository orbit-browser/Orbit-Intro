from pathlib import Path
from PIL import Image
import argparse,json,hashlib
p=argparse.ArgumentParser();p.add_argument('--source-root',type=Path,required=True);root=p.parse_args().source_root.resolve()
a=root/'extension/preview/exhibition/assets/main05-v3';out=Path(__file__).resolve().parents[1]/'src/assets'
provenance=json.loads((out/'provenance.json').read_text());records=provenance['screens']
def save(source,name,width):
 im=Image.open(source).convert('RGB');im.thumbnail((width,width*4),Image.Resampling.LANCZOS);f=out/'screens'/name;im.save(f,'WEBP',lossless=True,method=6)
 return {'file':'screens/'+name,'width':im.width,'height':im.height,'bytes':f.stat().st_size,'source':str(source.relative_to(root)),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest()}
for who in ['kim','park','lee','answer']:
 stem='team-shared-'+who
 source=a/(f'shared-{who}-header.png' if who!='answer' else 'team-ask-conversation.png')
 detail=a/(f'shared-{who}-row.png' if who!='answer' else 'team-ask-focused-with-scope.png')
 width=1000 if who!='answer' else 1920
 record=save(source,stem+'.webp',width);record.update({'processing':'Lossless derivative of unmodified product crop; editorial author labels outside UI','content':'Real Orbit team demo, shared workspace w-capstone','variants':[save(source,stem+'-small.webp',width//2),save(detail,stem+'-detail.webp',3600)]})
 records=[r for r in records if r['file']!=record['file']];records.append(record)
provenance['screens']=records;provenance['teamEvidence']={'query':'팀에 공유된 FastAPI 프롬프트 기록 찾아줘','resultIds':['s-fastapi','s-prompt'],'authors':{'s-fastapi':'김오르빗','s-prompt':'박지은','s-sse':'이도현'},'uiModified':False,'scope':'w-capstone','backend':'preview-mock'}
(out/'provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2))
