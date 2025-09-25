// Cập nhật năm
document.getElementById('year').textContent = new Date().getFullYear();

const content = document.getElementById('content');
const stepButtons = document.querySelectorAll('.toc button');

// Hàm thêm nút copy cho tất cả .code
function enhanceCodeBlocks() {
  document.querySelectorAll('#content .code').forEach(block => {
    if (block.querySelector('.copy-btn')) return; // tránh thêm lặp
    const btn = document.createElement('button');
    btn.textContent = "Copy";
    btn.className = "copy-btn";
    block.appendChild(btn);

    btn.addEventListener('click', () => {
      const codeText = block.querySelector('pre')
        ? block.querySelector('pre').innerText
        : block.innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        btn.textContent = "✓ Copied";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 2000);
      });
    });
  });
}

// Load nội dung step
function loadStep(step) {
  fetch(`steps/step${step}.html`)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      enhanceCodeBlocks(); // gắn nút copy
    })
    .catch(err => {
      console.error(err);
      content.innerHTML = `<h2>Step ${step}</h2><p style="color:red">Không tải được nội dung.</p>`;
    });

  stepButtons.forEach(b => b.classList.remove('active'));
  document.querySelector(`.toc button[data-step="${step}"]`).classList.add('active');
}

// Gắn click event
stepButtons.forEach(btn => {
  btn.addEventListener('click', () => loadStep(btn.dataset.step));
});

// Mặc định Step 1
loadStep(1);
