const fs = require('fs');

function patch(path, replacements) {
  let s = fs.readFileSync(path, 'utf8');
  for (const [from, to] of replacements) {
    if (!s.includes(from)) {
      console.warn(`[patch-finance-terms] Pattern not found in ${path}: ${from.slice(0, 80)}`);
      continue;
    }
    s = s.split(from).join(to);
  }
  fs.writeFileSync(path, s);
}

// Dashboard + Panen:
// Pendapatan Kotor adalah uang hasil panen yang diterima setelah potongan biaya bongkar.
// Laba Bersih = Pendapatan Kotor - biaya operasional - biaya perawatan.
patch('app/page.tsx', [
  [
    '<small>Pendapatan Kotor</small><h3>{money(gross)}</h3><small>Pendapatan Bersih</small><h2 className="green">{money(net)}</h2>',
    '<small>Nilai TBS Sebelum Potongan</small><h3>{money(gross)}</h3><small>Pendapatan Kotor</small><h2 className="green">{money(net)}</h2>'
  ],
  ['Pendapatan Bersih', 'Pendapatan Kotor'],
  ['<th>Pendapatan</th>', '<th>Pendapatan Kotor</th>'],
  ['<p>Pendapatan <b>{money(revenue)}</b>', '<p>Pendapatan Kotor <b>{money(revenue)}</b>']
]);

// Laporan PDF: biaya bongkar langsung mengurangi pendapatan hasil panen,
// sehingga tidak dihitung lagi sebagai biaya saat menghitung laba bersih.
patch('app/laporan/page.tsx', [
  [
    'const revenue=fh.reduce((a,h)=>a+Number(h.weight_kg)*Number(h.price_per_kg),0);const unloading=fh.reduce((a,h)=>a+Number(h.unloading_cost||0),0);const expense=unloading+fe.reduce((a,e)=>a+Number(e.amount),0)+fc.reduce((a,c)=>a+Number(c.cost||0),0);',
    'const revenue=fh.reduce((a,h)=>a+Number(h.weight_kg)*Number(h.price_per_kg)-Number(h.unloading_cost||0),0);const expense=fe.reduce((a,e)=>a+Number(e.amount),0)+fc.reduce((a,c)=>a+Number(c.cost||0),0);'
  ],
  [
    'const pKg=ph.reduce((a,h)=>a+Number(h.weight_kg),0),rev=ph.reduce((a,h)=>a+Number(h.weight_kg)*Number(h.price_per_kg),0),cost=ph.reduce((a,h)=>a+Number(h.unloading_cost||0),0)+pe.reduce((a,e)=>a+Number(e.amount),0)+pc.reduce((a,c)=>a+Number(c.cost||0),0);',
    'const pKg=ph.reduce((a,h)=>a+Number(h.weight_kg),0),rev=ph.reduce((a,h)=>a+Number(h.weight_kg)*Number(h.price_per_kg)-Number(h.unloading_cost||0),0),cost=pe.reduce((a,e)=>a+Number(e.amount),0)+pc.reduce((a,c)=>a+Number(c.cost||0),0);'
  ],
  [
    '<td>{money(Number(h.weight_kg)*Number(h.price_per_kg))}</td>',
    '<td>{money(Number(h.weight_kg)*Number(h.price_per_kg)-Number(h.unloading_cost||0))}</td>'
  ]
]);

console.log('[patch-finance-terms] SawitPro finance terminology applied.');
