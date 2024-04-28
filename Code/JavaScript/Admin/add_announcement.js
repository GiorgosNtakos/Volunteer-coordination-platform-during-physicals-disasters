"use strict";

let taskSelect;
let overlay = document.getElementById("overlay");

document.addEventListener("DOMContentLoaded", function () {
  taskSelect = document.getElementById("taskSelect");

  const addannouncementFormContainer = document.getElementById(
    "add-announcement-form-container"
  );
  const showAddannouncementFormButton = document.getElementById(
    "show-add-announcement-form"
  );
  let addannouncementForm = document.getElementById(
    "add-announcement-form"
  );

  showAddannouncementFormButton.addEventListener("click", function () {
    console.log("Το κουμπί προσθηκη ανακοινωσης πατήθηκε!");
    // Αλλάζει το φόντο του overlay σε θολό χρώμα όταν εμφανίζεται η φόρμα
    const overlay = document.getElementById("overlay");
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "block";
    addannouncementFormContainer.style.display = "block";  
    // Πέρνει διναμικά το κουμπί για να μπορεσει να προσθεσει event listener στην σειρα 54
    addannouncementForm = document.getElementById(
      "add-announcement-form"
    );    
  });

  overlay.addEventListener("click", function () {
    // Κλείνει τη φόρμα όταν γίνει κλικ στο overlay
    addannouncementFormContainer.style.display = "none";
    overlay.style.display = "none";
  });

  // Φορτώνει δυναμικά τις εργασίες όταν η σελίδα φορτώνεται
  fetch('../../PHP/Admin/get_tasks.php')
      .then(response => response.json())
      .then(data => {
          // Προσθέτει κάθε εργασία ως επιλογή στο select
          data.forEach(task => {
              const option = document.createElement("option");
              option.value = task.id;
              option.text = `Task ID: ${task.id}`;
              taskSelect.appendChild(option);
          });
      })
      .catch(error => {
          console.error('Σφάλμα:', error);
      });

  addannouncementForm.addEventListener("submit", function (event) {
    console.log("ΠΑΤΗΘΗΚΕ!!");
    event.preventDefault();
    const formData = new FormData(addannouncementForm);
    const taskId = formData.get('task_id');
    const item = document.getElementById("item").value;
    const task_type = document.getElementById("task_type").value;
    const quantity = document.getElementById("quantity").value;
    const username = document.getElementById("username").value;    

    // Ελέγξτε αν όλα τα πεδία έχουν συμπληρωθεί
    if (
      item.trim() === "" ||
      task_type.trim() === "" ||
      quantity.trim() === "" ||
      username.trim() === ""
    ) {
      showMessage(
        "error-message",
        "Συμπληρώστε όλα τα πεδία με έγκυρες τιμές.",
        "item"
      );
      return;
    }
    insertannouncementToDatabase(taskId, item, quantity, task_type, username);
    document.getElementById("item").value = "";
    document.getElementById("task_type").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("username").value = "";
  });
});

// Κώδικας για εισαγωγή της ανακοίνωσης στη βάση δεδομένων
function insertannouncementToDatabase(taskId, item, quantity, task_type, username) {
  // Κώδικας για την αποστολή των δεδομένων προς τον διακομιστή για την εισαγωγή του προϊόντος
  // Χρησιμοποιήστε τα $item, $quantity, $task_type και $username όπως πριν

fetch('../../PHP/Admin/add_announcement.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task_id: taskId,
      item: item,
      quantity: quantity,
      task_type: task_type,
      username: username
    })
  })
  .then(response => response.text())
  .then(data => {
    // Εδώ μπορείτε να χρησιμοποιήσετε τα δεδομένα που λάβατε από το PHP
    console.log(data);
  })
  .catch(error => {
    console.error('Σφάλμα:', error);
  });
  
}
