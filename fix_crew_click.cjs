const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const searchRegex = /<td><input type="checkbox" \$\{s\.enabled\?'checked':''\} onchange="toggleRole\('\$\{r\.id\}',this\.checked\)"><\/td>\s*<td class="role-info-td" style="position:relative; cursor:help;">/;

const replacement = `<td onclick="document.getElementById('cb-' + '${'${r.id}'}').click()" style="cursor:pointer; text-align:center;">
        <input type="checkbox" id="cb-\${r.id}" \${s.enabled?'checked':''} onchange="toggleRole('\${r.id}',this.checked)" onclick="event.stopPropagation()">
      </td>
      <td class="role-info-td" style="position:relative; cursor:pointer;" onclick="document.getElementById('cb-' + '${'${r.id}'}').click()">`;

html = html.replace(searchRegex, replacement);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed crew row click area');
