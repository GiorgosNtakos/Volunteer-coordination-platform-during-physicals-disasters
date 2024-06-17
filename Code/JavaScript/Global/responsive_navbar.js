document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname;

  function initializeMenu() {
    const links = document.querySelectorAll("nav ul li a");
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const bars = document.querySelectorAll(".hamburger-menu .bar"); // Επιλογή των γραμμών του hamburger menu
    const navMenu = document.querySelector("nav ul");

    console.log("Initializing menu...");

    // Έλεγχος αν βρέθηκε το hamburgerMenu
    if (!hamburgerMenu) {
      console.error("Hamburger menu not found");
      return;
    }

    // Συνάρτηση για την αλλαγή του χρώματος των γραμμών
    function toggleMenu() {
      navMenu.classList.toggle("show");
      hamburgerMenu.classList.toggle("show");

      console.log("Hamburger menu clicked");

      // Προσθήκη της κλάσης "show" και στο body για να κλείνει το μενού και με κλικ εκτός αυτού
      document.body.classList.toggle("menu-open", navMenu.classList.contains("show"));
      console.log("Menu state:", navMenu.classList.contains("show"));

      // Αλλαγή χρώματος στις γραμμές του hamburger menu
      if (navMenu.classList.contains("show")) {
        bars.forEach(bar => bar.style.backgroundColor = 'tan'); // Κίτρινο χρώμα όταν το μενού είναι ανοιχτό
      } else {
        bars.forEach(bar => bar.style.backgroundColor = 'white'); // Λευκό χρώμα όταν το μενού είναι κλειστό
      }
    }

    // Προσθήκη event listener για το κλικ στο εικονίδιο hamburger
    hamburgerMenu.addEventListener("click", toggleMenu);

    // Προσθήκη event listener σε κάθε link για κλείσιμο του μενού μετά το κλικ
    links.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("show");
        hamburgerMenu.classList.remove("show");
        document.body.classList.remove("menu-open");
        console.log("Link clicked, menu closed");

        // Επαναφορά χρώματος στις γραμμές του hamburger menu
        bars.forEach(bar => bar.style.backgroundColor = 'white'); // Λευκό χρώμα όταν το μενού είναι κλειστό
      });
    });

    // Συνάρτηση για το κλείσιμο του μενού όταν πατάς έξω από αυτό
    function closeMenuOnClickOutside(event) {
      if (!navMenu.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        navMenu.classList.remove("show");
        hamburgerMenu.classList.remove("show");
        document.body.classList.remove("menu-open");
        console.log("Clicked outside, menu closed");

        // Επαναφορά λευκού χρώματος όταν το μενού είναι κλειστό
        bars.forEach(bar => bar.style.backgroundColor = 'white');
      }
    }

    // Προσθήκη event listener για κλικ έξω από το μενού
    document.addEventListener("click", closeMenuOnClickOutside);
  }

  // Ελέγχει αν το Header έχει φορτωθεί ήδη
  const header = document.getElementById("Header");
  if (header) {
    console.log("Header found");
    setTimeout(initializeMenu, 100); // Προσθέτουμε μικρή καθυστέρηση
  } else {
    console.log("Header not found, waiting for load...");
    header.addEventListener('load', function() {
      console.log("Header loaded");
      initializeMenu();
    });
  }

  // Αν ο Header έχει ήδη φορτωθεί, αρχικοποίησε αμέσως το μενού
  if (header.complete) {
    console.log("Header already loaded");
    setTimeout(initializeMenu, 100); // Προσθέτουμε μικρή καθυστέρηση
  }
});
