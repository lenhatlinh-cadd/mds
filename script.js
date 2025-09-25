// Cập nhật năm
document.getElementById('year').textContent = new Date().getFullYear();

const content = document.getElementById('content');
const stepButtons = document.querySelectorAll('.toc button');

// Hàm load nội dung theo step
function loadStep(step) {
  fetch(`steps/step${step}.html`)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      content.innerHTML = `<h2>Step ${step}</h2><p style="color:red">Không tải được nội dung.</p>`;
    });

  // Xoá highlight cũ
  stepButtons.forEach(b => b.classList.remove('active'));
  // Gán highlight cho nút vừa click
  document.querySelector(`.toc button[data-step="${step}"]`).classList.add('active');
}

// Gắn sự kiện click cho từng nút
stepButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const step = btn.dataset.step;
    loadStep(step);
  });
});

// Mặc định load Step 1 khi mở trang
loadStep(1);

function enhanceCodeBlocks() {
  document.querySelectorAll('.code').forEach(block => {
    // tránh thêm nút lặp lại
    if (block.querySelector('.copy-btn')) return;

    const btn = document.createElement('button');
    btn.textContent = "Copy";
    btn.className = "copy-btn";
    block.appendChild(btn);

    btn.addEventListener('click', () => {
      const codeText = block.querySelector('pre').innerText;
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

// Gọi lại mỗi khi load step mới
function loadStep(step) {
  fetch(`steps/step${step}.html`)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      enhanceCodeBlocks(); // thêm nút copy cho code mới
    })
    .catch(err => {
      console.error(err);
      content.innerHTML = `<h2>Step ${step}</h2><p style="color:red">Không tải được nội dung.</p>`;
    });

  stepButtons.forEach(b => b.classList.remove('active'));
  document.querySelector(`.toc button[data-step="${step}"]`).classList.add('active');
}
