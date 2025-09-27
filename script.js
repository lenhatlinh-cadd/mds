// Cập nhật năm
document.getElementById('year').textContent = new Date().getFullYear();

const content = document.getElementById('content');
const stepButtons = Array.from(document.querySelectorAll('.toc button'));

// Thêm nút copy cho code block
function enhanceCodeBlocks() {
  document.querySelectorAll('#content .code').forEach(block => {
    if (block.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.textContent = "Copy";
    btn.className = "copy-btn";
    block.appendChild(btn);

    btn.addEventListener('click', () => {
      const codeText = block.querySelector('pre')?.innerText || block.innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        if (btn.classList.contains("copied")) {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        } else {
          btn.textContent = "✓ Copied";
          btn.classList.add("copied");
        }
      });
    });
  });
}

// Lấy step khởi tạo từ hash/query/active TOC
function getInitialStep() {
  const hash = window.location.hash.match(/#step(\d+)/);
  if (hash) return parseInt(hash[1], 10);

  const params = new URLSearchParams(window.location.search);
  if (params.has('step')) return parseInt(params.get('step'), 10);

  const activeBtn = document.querySelector('.toc button.active');
  if (activeBtn) return parseInt(activeBtn.dataset.step, 10);

  return 0;
}

// Load step
function loadStep(stepIndex) {
  stepIndex = Math.max(0, Math.min(stepIndex, stepButtons.length - 1));

  fetch(`steps/step${stepIndex}.html`)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;

      // Nút điều hướng
      const nav = document.createElement('div');
      nav.className = "step-nav";

      if (stepIndex > 0) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = "← Previous";
        prevBtn.className = "nav-btn";
        prevBtn.addEventListener('click', () => goToStep(stepIndex - 1));
        nav.appendChild(prevBtn);
      }

      if (stepIndex < stepButtons.length - 1) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = "Next →";
        nextBtn.className = "nav-btn";
        nextBtn.addEventListener('click', () => goToStep(stepIndex + 1));
        nav.appendChild(nextBtn);
      }

      content.appendChild(nav);

      enhanceCodeBlocks();

      // Active TOC
      stepButtons.forEach(b => b.classList.remove('active'));
      const tocBtn = document.querySelector(`.toc button[data-step="${stepIndex}"]`);
      if (tocBtn) tocBtn.classList.add('active');

      // Cuộn lên đầu trang
      window.scrollTo({ top: 0, behavior: "smooth" });
    })
    .catch(err => {
      console.error(err);
      content.innerHTML = `<h2>Step ${stepIndex}</h2><p style="color:red">Không tải được nội dung.</p>`;
    });
}

// Điều hướng + pushState
function goToStep(step, addHistory = true) {
  step = Math.max(0, Math.min(parseInt(step, 10) || 0, stepButtons.length - 1));
  if (addHistory) history.pushState({ step }, '', `#step${step}`);
  else history.replaceState({ step }, '', `#step${step}`);
  loadStep(step);
}

// Click TOC
stepButtons.forEach(btn => {
  btn.addEventListener('click', () => goToStep(btn.dataset.step, true));
});

// Back/Forward
window.addEventListener('popstate', ev => {
  if (ev.state && typeof ev.state.step !== 'undefined') loadStep(ev.state.step);
  else loadStep(getInitialStep());
});

// Load step khởi tạo
goToStep(getInitialStep(), false);
