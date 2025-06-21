// multi-step.js

document.addEventListener('DOMContentLoaded', () => {
  const form1 = document.getElementById('step1Form');
  const form2 = document.getElementById('step2Form');

  // Шаг 1 → Сохраняем в localStorage и переходим на шаг 2
  if (form1) {
    form1.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form1).entries());
      localStorage.setItem('reg_step1', JSON.stringify(data));
      window.location.href = 'step2.html';
    });
  }

  // Шаг 2 → Объединяем данные, очищаем localStorage
  if (form2) {
    form2.addEventListener('submit', e => {
      e.preventDefault();
      const step1 = JSON.parse(localStorage.getItem('reg_step1') || '{}');
      const step2 = Object.fromEntries(new FormData(form2).entries());

      const fullData = { ...step1, ...step2 };
      console.log('Форма отправлена:', fullData); // Здесь можно отправить на сервер

      localStorage.removeItem('reg_step1');
      window.location.href = 'success.html';
    });
  }
});

function goBack() {
  window.history.back();
}
