document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname;

  function initializeMenu() {
    const links = document.querySelectorAll("nav ul li a");
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const mainContent = document.querySelector("main, .main");
    const bars = document.querySelectorAll(".hamburger-menu .bar"); // Επιλογή των γραμμών του hamburger menu
    const navMenu = document.querySelector("nav ul");

    console.log("Initializing menu...");

    if (!hamburgerMenu) {
      console.error("Hamburger menu not found");
      return;
    }

    function toggleMenu() {
      navMenu.classList.toggle("show");
      hamburgerMenu.classList.toggle("show");

      console.log("Hamburger menu clicked");

      // Προσθήκη της "show" και στο body για να κλείνει το μενού και με κλικ εκτός αυτού
      document.body.classList.toggle("menu-open", navMenu.classList.contains("show"));
      console.log("Menu state:", navMenu.classList.contains("show"));

      if (mainContent) {
        if (navMenu.classList.contains("show")) {
          const menuHeight = navMenu.scrollHeight;
          mainContent.style.marginTop = `${menuHeight}px`;
        } else {
          mainContent.style.marginTop = "0";
        }
      }
    
      // Αλλαγή χρώματος στις γραμμές
      if (navMenu.classList.contains("show")) {
        bars.forEach(bar => bar.style.backgroundColor = 'tan'); // Κίτρινο χρώμα όταν το μενού είναι ανοιχτό
      } else {
        bars.forEach(bar => bar.style.backgroundColor = 'white'); // Λευκό χρώμα όταν το μενού είναι κλειστό
      }
    }

    // Προσθήκη event listener για το κλικ στο εικονίδιο hamburger
    hamburgerMenu.addEventListener("click", toggleMenu);

    links.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("show");
        hamburgerMenu.classList.remove("show");
        document.body.classList.remove("menu-open");
        console.log("Link clicked, menu closed");
        if (mainContent) {
          mainContent.style.marginTop = "0";
        }

        // Επαναφέρει το λευκό χρώμα όταν το μενού είναι κλειστό
        bars.forEach(bar => bar.style.backgroundColor = 'white');
      });
    });

    // Συνάρτηση για το κλείσιμο του μενού και για όταν πατάμε έξω από αυτό
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

    // Extra κώδικας για να εμφανίζουμε όποτε χρειάζεται το toolbar
    document.querySelector('.show-toolbar').addEventListener('click', function() {
    const toolbar = document.querySelector('.toolbar');
    toolbar.classList.toggle('show');
    });
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
