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
