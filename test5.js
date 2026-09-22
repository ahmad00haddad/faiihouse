
document.addEventListener('DOMContentLoaded', () => {
  // 1. Session Toast
  if(localStorage.getItem('faiihouse_quote_state')) {
    const toastHtml = '<div id="sessionToast" class="session-toast">✨ استعدنا بياناتك السابقة لتوفير وقتك</div>';
    document.body.insertAdjacentHTML('beforeend', toastHtml);
    setTimeout(() => { document.getElementById('sessionToast')?.classList.add('show'); }, 500);
    setTimeout(() => { document.getElementById('sessionToast')?.classList.remove('show'); }, 4000);
  }

  // 2. Ghost PDF in Sidebar
  const sidebarHeader = document.querySelector('.sidebar .sb-header');
  if(sidebarHeader) {
    sidebarHeader.style.position = 'relative';
    sidebarHeader.insertAdjacentHTML('beforeend', `
      <div id="ghostPdf" class="ghost-pdf">
        <div class="line primary" id="g-title"></div>
        <div class="line"></div>
        <div class="line short"></div>
        <div style="flex:1"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    `);
  }

  // 3. Documentary Hint Setup
  const sec5 = document.getElementById('sec-5');
  if(sec5) {
    const p = sec5.querySelector('.section-head');
    if(p) p.insertAdjacentHTML('beforeend', '<div id="docHint" class="doc-hint">💡 <strong>نصيحة للمخرجات الوثائقية:</strong> الأفلام الوثائقية غالباً ما تحتاج لخدمة <strong>تصحيح الألوان (Color Grading)</strong> الاحترافية لإعطاء الطابع السينمائي، هل ندرجها لك؟</div>');
  }

  // 4. Hook into updateQuote for Ghost PDF and Doc Hint
  const originalUpdate2 = window.updateQuote;
  window.updateQuote = function() {
    if(originalUpdate2) originalUpdate2();
    setTimeout(() => {
      // Documentary Hint
      const docHint = document.getElementById('docHint');
      if(docHint && typeof state !== 'undefined') {
        if(state.projectType === 'documentary') docHint.classList.add('show');
        else docHint.classList.remove('show');
      }

      // Ghost PDF Fill
      const gTitle = document.getElementById('g-title');
      if(gTitle && typeof state !== 'undefined') {
        if(state.clientName || state.projectType) {
          gTitle.style.opacity = '1';
          gTitle.style.width = '80%';
        }
      }
    }, 100);
  };

});
