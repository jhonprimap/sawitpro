const fs=require('fs');const p='app/page.tsx';let s=fs.readFileSync(p,'utf8');
// Kontrol should reflect activities entered in Perawatan, whether scheduled or completed.
s=s.replace("const completed=cs.filter((c:any)=>c.status==='completed'&&inPeriod(c.scheduled_date));","const completed=cs.filter((c:any)=>inPeriod(c.scheduled_date));");
// Rename/recategorize the fourth summary as pruning/tunas.
s=s.replace("if(x.includes('babat')||x.includes('bersih')||x.includes('piringan')||x.includes('gawangan'))return'bersih';","if(x.includes('pruning')||x.includes('tunas')||x.includes('penunasan'))return'bersih';");
s=s.replace(/Babat \/ Pembersihan/g,'Pruning / Tunas');
s=s.replace(/Babat \/ Bersih/g,'Pruning / Tunas');
fs.writeFileSync(p,s);