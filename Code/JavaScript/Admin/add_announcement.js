"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const addannouncementFormContainer = document.getElementById(
    "add-announcement-form-container"
  );
  const showAddannouncementFormButton = document.getElementById(
    "show-add-announcement-form"
  );
  const addannouncementForm = document.getElementById("add-announcement-form");

  showAddannouncementFormButton.addEventListener("click", function () {
    // Αλλάζει το φόντο του overlay σε θολό χρώμα όταν εμφανίζεται η φόρμα
    const overlay = document.getElementById("overlay");
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "block";
    addannouncementFormContainer.style.display = "block";       
  });

  overlay.addEventListener("click", function () {
    // Κλείνει τη φόρμα όταν γίνει κλικ στο overlay
    addannouncementFormContainer.style.display = "none";
    overlay.style.display = "none";
  });



  addannouncementForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("announcement_title").value;
    const task_type = document.getElementById("task_type").value;
    const quantity = document.getElementById("quantity").value;
    const username = document.getElementById("username").value;

    // Ελέγξτε αν όλα τα πεδία έχουν συμπληρωθεί
    if (
      title.trim() === "" ||
      task_type.trim() === "" ||
      quantity.trim() === "" ||
      username.trim() === ""
    ) {
      showMessage(
        "error-message",
        "Συμπληρώστε όλα τα πεδία με έγκυρες τιμές.",
        "title"
      );
      return;
    }
    insertannouncementToDatabase(title, quantity, task_type, username);
    document.getElementById("title").value = "";
    document.getElementById("task_type").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("username").value = "";
  });
});

// Κώδικας για εισαγωγή της ανακοίνωσης στη βάση δεδομένων
function insertannouncementToDatabase(title, quantity, task_type, username) {
  // Κώδικας για την αποστολή των δεδομένων προς τον διακομιστή για την εισαγωγή του προϊόντος
  // Χρησιμοποιήστε τα $title, $quantity, $task_type και $username όπως πριν

  fetch('../../PHP/Admin/add_announcement.php')
    .then(response => response.text())
    .then(data => {
      // Εδώ μπορείτε να χρησιμοποιήσετε τα δεδομένα που λάβατε από το PHP
      console.log(data);
    })
    .catch(error => {
      console.error('Σφάλμα:', error);
    });
}
