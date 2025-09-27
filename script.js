// Cập nhật năm
document.getElementById('year').textContent = new Date().getFullYear();

const content = document.getElementById('content');
// Lấy danh sách nút TOC dưới dạng mảng (số phần tử chính xác)
const stepButtons = Array.from(document.querySelectorAll('.toc button'));

// Gắn nút copy cho các khối code
function enhanceCodeBlocks() {
  document.querySelectorAll('#content .code').forEach(block => {
    if (block.querySelector('.copy-btn')) return;

    const btn = document.createElement('button');
    btn.textContent = "Copy";
    btn.className = "copy-btn";
    block.appendChild(btn);

    btn.addEventListener('click', () => {
      const codeText = block.querySelector('pre')
        ? block.querySelector('pre').innerText
        : block.innerText;

      navigator.clipboard.writeText(codeText).then(() => {
        if (btn.classList.contains("copied")) {
          // Nếu đã ở trạng thái copied → click lại reset về mặc định
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        } else {
          // Nếu chưa → đổi sang trạng thái copied
          btn.textContent = "✓ Copied";
          btn.classList.add("copied");
        }
      });
    });
  });
}

// Lấy step khởi tạo từ URL (hash #stepX hoặc ?step=X) hoặc nút active, mặc định 0
function getInitialStep() {
  // hash như #step3
  const hash = window.location.hash.match(/#step(\d+)/);
  if (hash) return parseInt(hash[1], 10);

  // query param ?step=3
  const params = new URLSearchParams(window.location.search);
  if (params.has('step')) {
    const s = parseInt(params.get('step'), 10);
    if (!Number.isNaN(s)) return s;
  }

  // nếu có nút .toc button.active thì lấy nó
  const activeBtn = document.querySelector('.toc button.active');
  if (activeBtn) {
    const s = parseInt(activeBtn.dataset.step, 10);
    if (!Number.isNaN(s)) return s;
  }

  return 0;
}

// Hàm load nội dung step (không thay đổi history)
function loadStep(stepArg) {
  let stepIndex = parseInt(stepArg, 10);
  if (Number.isNaN(stepIndex) || stepIndex < 0) stepIndex = 0;

  fetch(`steps/step${stepIndex}.html`)
    .then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(html => {
      content.innerHTML = html;

      // Thêm nút điều hướng Previous/Next
      const nav = document.createElement('div');
      nav.className = "step-nav";

      // Previous (nếu không phải step đầu)
      if (stepIndex > 0) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = "← Previous";
        prevBtn.className = "nav-btn";
        prevBtn.addEventListener('click', () => {
          goToStep(stepIndex - 1, true);
        });
        nav.appendChild(prevBtn);
      }

      // Next (nếu chưa phải step cuối)
      if (stepIndex < stepButtons.length - 1) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = "Next →";
        nextBtn.className = "nav-btn";
        nextBtn.addEventListener('click', () => {
          goToStep(stepIndex + 1, true);
        });
        nav.appendChild(nextBtn);
      }

      content.appendChild(nav);

      // Thêm nút Copy cho code block
      enhanceCodeBlocks();

      // Cập nhật active state ở TOC (an toàn khi không tìm thấy nút)
      stepButtons.forEach(b => b.classList.remove('active'));
      const tocBtn = document.querySelector(`.toc button[data-step="${stepIndex}"]`);
      if (tocBtn) {
        tocBtn.classList.add('active');
        // focus nhẹ để người dùng nhận biết (tùy chọn)
        // tocBtn.focus();
      }

      // Cuộn về đầu trang sau khi nội dung đã load xong
      window.scrollTo({ top: 0, behavior: "smooth" });
    })
    .catch(err => {
      console.error(err);
      content.innerHTML = `<h2>Step ${stepIndex}</h2><p style="color:red">Không tải được nội dung.</p>`;
    });
}

// Hàm điều hướng và cập nhật history (addHistory = true => pushState; false => replaceState)
function goToStep(step, addHistory = true) {
  let stepIndex = parseInt(step, 10);
  if (Number.isNaN(stepIndex) || stepIndex < 0) stepIndex = 0;

  // nếu step vượt quá giới hạn thì giới hạn lại
  if (stepIndex > stepButtons.length - 1) stepIndex = stepButtons.length - 1;

  // Cập nhật history trước/sau tuỳ chọn:
  if (addHistory) {
    history.pushState({ step: stepIndex }, '', `#step${stepIndex}`);
  } else {
    history.replaceState({ step: stepIndex }, '', `#step${stepIndex}`);
  }

  loadStep(stepIndex);
}

// Xử lý khi user click các nút trong TOC (quicklink)
stepButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const s = parseInt(btn.dataset.step, 10);
    goToStep(Number.isNaN(s) ? 0 : s, true);
  });
});

// Xử lý back/forward của trình duyệt
window.addEventListener('popstate', (ev) => {
  if (ev.state && typeof ev.state.step !== 'undefined') {
    loadStep(ev.state.step);
  } else {
    // fallback: đọc từ URL hash/query
    loadStep(getInitialStep());
  }
});

// Mặc định load step khởi tạo (từ hash/query nếu có) — không push history
goToStep(getInitialStep(), false);
