// Cập nhật năm tự động
document.getElementById('year').textContent = new Date().getFullYear();

// Danh sách số step cần load
const steps = 2; // có thể đổi thành 12 khi đủ file

for (let i = 1; i <= steps; i++) {
  fetch(`steps/step${i}.html`)
    .then(res => res.text())
    .then(html => {
      document.querySelector(`#step${i}`).innerHTML = html;
    })
    .catch(err => {
      console.error(`Không load được step${i}.html`, err);
      document.querySelector(`#step${i}`).innerHTML =
        `<h2>Step ${i}</h2><p style="color:red">Chưa có nội dung.</p>`;
    });
}
