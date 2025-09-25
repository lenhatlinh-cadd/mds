// Cập nhật năm
document.getElementById('year').textContent = new Date().getFullYear();

const content = document.getElementById('content');
const stepButtons = document.querySelectorAll('.toc button');

stepButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const step = btn.dataset.step;

    // Load nội dung
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
    btn.classList.add('active');
  });
});
