document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".input-area input");
  const button = document.querySelector(".input-area button");

  button.addEventListener("click", () => {
    if (input.value.trim()) {
      alert("Вы спросили: " + input.value);
      input.value = "";
    }
  });
});
