document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname;
  const links = document.querySelectorAll("nav ul li a");
  const hamburgerMenu = document.getElementById("hamburgerMenu");

  // Προσθήκη event listener για το κλικ στο εικονίδιο hamburger
  hamburgerMenu.addEventListener("click", function () {
    const navMenu = document.querySelector("nav ul");
    navMenu.classList.toggle("show");
    hamburgerMenu.classList.toggle("show");

    // Προσθήκη της κλάσης "show" και στο body για να κλείνει το μενού και με κλικ εκτός αυτού
    document.body.classList.toggle("menu-open", navMenu.classList.contains("show"));
  });

  // Προσθήκη event listener σε κάθε link για κλείσιμο του μενού μετά το κλικ
  links.forEach((link) => {
    link.addEventListener("click", function () {
      const navMenu = document.querySelector("nav ul");
      navMenu.classList.remove("show");
      hamburgerMenu.classList.remove("show");
      document.body.classList.remove("menu-open");
    });

    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});
