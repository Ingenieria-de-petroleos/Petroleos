const fs = require('fs');

const files = ['index.html', 'malla.html', 'intercampus.html', 'convenios.html', 'info.html', 'js/comun.js'];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/img\/logo-ambiental\.(png|svg|jpg)/g, 'img/logo-petroleos.png');
  fs.writeFileSync(f, content, 'utf8');
  console.log('Successfully updated logo references in', f);
});
