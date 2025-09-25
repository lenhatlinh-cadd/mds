// Cập nhật năm
document.getElementById('year').textContent = new Date().getFullYear();

const content = document.getElementById('content');
const stepButtons = document.querySelectorAll('.toc button');

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
          // nếu đang copied → bấm lại thì trả về trạng thái ban đầu
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        } else {
          // nếu đang copy bình thường → chuyển sang trạng thái copied
          btn.textContent = "✓ Copied";
          btn.classList.add("copied");
        }
      });
    });
  });
}


// Load nội dung Step
function loadStep(step) {
  fetch(`steps/step${step}.html`)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      enhanceCodeBlocks();
    })
    .catch(err => {
      console.error(err);
      content.innerHTML = `<h2>Step ${step}</h2><p style="color:red">Không tải được nội dung.</p>`;
    });

  stepButtons.forEach(b => b.classList.remove('active'));
  document.querySelector(`.toc button[data-step="${step}"]`).classList.add('active');
}

// Gắn sự kiện click
stepButtons.forEach(btn => {
  btn.addEventListener('click', () => loadStep(btn.dataset.step));
});

// Mặc định load Step 1
loadStep(1);

