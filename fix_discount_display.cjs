const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldSidebarTravel = `  if(q.travelFee>0) {
    const reg = REGIONS.find(r=>r.id===state.region);
    html+=\`<div class="sb-section"><div class="sb-section-title">\${L('السفر','Travel')}</div>
    <div class="sb-line"><span class="sb-line-label">\${L(reg?.ar||'سفر',reg?.name||'Travel')}</span><span class="sb-line-val">\${q.travelFee} \${state.currency||"JOD"}</span></div></div>\`;
  }`;

const newSidebarTravel = `  if(q.travelFee>0) {
    const reg = REGIONS.find(r=>r.id===state.region);
    html+=\`<div class="sb-section"><div class="sb-section-title">\${L('السفر','Travel')}</div>
    <div class="sb-line"><span class="sb-line-label">\${L(reg?.ar||'سفر',reg?.name||'Travel')}</span><span class="sb-line-val">\${q.travelFee} \${state.currency||"JOD"}</span></div></div>\`;
  }
  
  if(q.discountAmt > 0) {
    html+=\`<div class="sb-section"><div class="sb-section-title" style="color:var(--gold)">\${L('الخصم','Discount')}</div>
    <div class="sb-line"><span class="sb-line-label" style="color:var(--gold); font-weight:700;">\${L(q.discountLabelAr, q.discountLabel)}</span><span class="sb-line-val" style="color:var(--gold); font-weight:700;">− \${q.discountAmt} \${state.currency||"JOD"}</span></div></div>\`;
  }`;

html = html.replace(oldSidebarTravel, newSidebarTravel);


const oldPreviewTable = `      <table class="q-table">
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Cost</th>
            <th>Qty / Duration</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>\${rows}</tbody>
      </table>`;

const newPreviewTable = `      <table class="q-table">
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Cost</th>
            <th>Qty / Duration</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          \${rows}
          \${q.discountAmt > 0 ? \`<tr>
            <td colspan="3" style="text-align:right; font-weight:700; color:var(--gold);">\${q.discountLabel}</td>
            <td style="font-weight:700; color:var(--gold);">− \${q.discountAmt} \${state.currency||"JOD"}</td>
          </tr>\` : ''}
        </tbody>
      </table>`;
      
html = html.replace(oldPreviewTable, newPreviewTable);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed sidebar and preview discount display');
