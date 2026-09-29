const fs=require('fs');const p='app/page.tsx';let s=fs.readFileSync(p,'utf8');
// Finance: maintenance records are activities only; money is recorded in Operasional.
s=s.replace(/\+fc\.reduce\(\(a:number,c:any\)=>a\+Number\(c\.cost\),0\)/g,'');
s=s.replace(/\+pc\.reduce\(\(a:number,c:any\)=>a\+Number\(c\.cost\),0\)/g,'');
// Maintenance forms: hide/remove cost field and always store zero for backward-compatible DB schema.
s=s.replace(/<F l="Biaya"><input[^>]*value=\{f\.cost\}[^>]*><\/F>/g,'');
s=s.replace(/<F l="Biaya"><input[^>]*value=\{cost\}[^>]*><\/F>/g,'');
s=s.replace(/cost:Number\(f\.cost\|\|0\)/g,'cost:0');
s=s.replace(/cost:Number\(cost\|\|0\)/g,'cost:0');
// Remove cost column/cells from maintenance tables when exact labels are present.
s=s.replace(/<th>Biaya<\/th>/g,'');
s=s.replace(/<td>\{money\(c\.cost\)\}<\/td>/g,'');
fs.writeFileSync(p,s);