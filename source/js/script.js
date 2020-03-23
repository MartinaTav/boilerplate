
const menuBtn = document.querySelector(".menu-btn");

let showMenu = false;

function toggleMenu() {
  if (!showMenu) {
    menuBtn.classList.add("close");

    showMenu = true;
  } else {
    menuBtn.classList.remove("close");
    showMenu = false;
  }
}

menuBtn.addEventListener("click", toggleMenu);
