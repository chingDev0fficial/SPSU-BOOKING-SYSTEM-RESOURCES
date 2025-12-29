const selectOption = document.querySelector(".select-option");
const input = selectOption.querySelector("input");
const optionList = document.getElementById("options");
const optionContent = document.querySelector(".content");
const seachOption = document.getElementById("optionSearch");
const noResultMsg = document.getElementById("noResultMsg");
const selectInput = document.getElementById("soValue");

input.addEventListener("focus", () => {
  selectOption.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (
    !selectOption.contains(e.target) &&
    !document.querySelector(".content").contains(e.target)
  ) {
    selectOption.classList.remove("active");
  }
});

seachOption.addEventListener("input", (e) => {
  const keyword = e.target.value;
  const ul = document.getElementById("options"); // or your <ul> id
  const items = ul.querySelectorAll("li");

  let anyVisible = false;

  items.forEach((li) => {
    if (li.textContent.toLowerCase().includes(keyword)) {
      li.style.display = "";
      anyVisible = true;
    } else {
      li.style.display = "none";
    }
  });
  noResultMsg.style.display = anyVisible ? "none" : "block";
});

optionList.addEventListener("click", (e) => {
  if (e.target && e.target.nodeName === "LI") {
    let value = e.target.getAttribute("text-value"); // or e.target.textContent
    input.blur();
    selectOption.classList.remove("active");
    selectInput.value = value;
  }
});
