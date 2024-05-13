"use strict";

let overlay = document.getElementById("overlay");

document.addEventListener("DOMContentLoaded", function () {

  var numberPattern = /^[1-9]\d*$/;

  const addannouncementFormContainer = document.getElementById(
    "add-form-container"
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
    loadItems("select_item");    
  });

  overlay.addEventListener("click", function () {
    // Κλείνει τη φόρμα όταν γίνει κλικ στο overlay
    addannouncementFormContainer.style.display = "none";
    overlay.style.display = "none";
  });

  addannouncementForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Αποτρέψτε την προεπιλεγμένη υποβολή φόρμας

    // Δημιουργία αντικειμένου FormData για τη συλλογή δεδομένων φόρμας
    var formData = new FormData(addannouncementForm);

    var item_name = document.getElementById("item_name").value;
    var content   = document.getElementById("content").value;

    if (content.trim() === "") {
      showMessage(
        "error-message",
        "Παρακαλώ εισάγεται κάποια ποσότητα.",
        "#content"
      );
      return; // Σταματά την εκτέλεση της function
    }

    if (!numberPattern.test(content)) {
      showMessage(
        "error-message",
        "Η ποσότητα πρέπει να είναι ακέραια και οχι αρνητική.",
        "#content"
      );
      return;
    }

    formData.append("item_name", item_name);
    formData.append("content",  content);

    var select_item = [];
    var itemNames = document.querySelectorAll(
      'select[name="item-name[]"]'
    );
    var itemValues = document.querySelectorAll(
      'input[name="item-value[]"]'
    );
    for (var i = 0; i < itemNames.length; i++) {
      select_item.push({
        item_name: itemNames[i].value,
        content: itemValues[i].value,
      });
    }

    for (var i = 0; i < itemNames.length; i++) {
      if (
        itemValues[i].value.trim() === ""
      ) {
        event.preventDefault(); // Αποτροπή υποβολής της φόρμας
        showMessage(
          "error-message",
          "Παρακαλώ συμπληρώστε όλα τα πεδία ποσοτήτων.",
          "#content"
        );
        return; // Διακοπή της εκτέλεσης της συνάρτησης
      }

      if (!numberPattern.test(itemValues[i].value)) {
        event.preventDefault(); // Αποτροπή υποβολής της φόρμας
        showMessage(
          "error-message",
          "Οι ποσότητες πρέπει να είναι ακέραιες θετικές τιμές.",
          "#content"
        );
        return; // Διακοπή της εκτέλεσης της συνάρτησης
      }
    }

    formData.append("items", JSON.stringify(select_item));

    addAnnouncement(formData);
  });

  var addItemButton = document.getElementById("add-item");
  addItemButton.addEventListener("click", function () {
    var container = document.getElementById("more-items-container");

    var labelItemName = document.createElement("label");
    labelItemName.textContent = "Είδος:";

    var newItemName = document.createElement("select");
    newItemName.name = "item-name[]";
    newItemName.className = "select_item";
    loadItems("select_item");    

    var labelItemValue = document.createElement("label");
    labelItemValue.textContent = "Ποσότητα:";

    var newItemValue = document.createElement("input");
    newItemValue.type = "number";
    newItemValue.name = "item-value[]";

    container.appendChild(labelItemName);
    container.appendChild(newItemName);
    container.appendChild(labelItemValue);
    container.appendChild(newItemValue);
    container.appendChild(document.createElement("br"));
  });

  
});

function loadItems(elementClass) {
  var itemsMapping = {}
  $.ajax({
    method: "GET",
    url: "../../PHP/Admin/get_all_items.php",
    success: function (response) {
      
      var items = response.items;

      var itemsList = document.querySelectorAll('.' + elementClass);
      
      itemsList.forEach(function (list) {
        $(list).empty(); // Καθαρίζει τα προηγούμενα στοιχεία από τη λίστα

        items.forEach(function (item) {
          itemsMapping[item.name] = item.id;
          $(list).append(
            `<option value="${item.id}">${item.name}</option>`
          );
        });
      });
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error: " + status, error);
    },
  });
}


// Eισαγωγή νέας ανακοίνωσης στη βάση δεδομένων
function addAnnouncement(form) {

  $.ajax({
    url: "../../PHP/Admin/add_announcement.php", 
    method: "POST",
    data: form,
    processData: false,
    contentType: false,
    success: function (response) {

      if (response.status === "success") {
        showMessage("success-message", response.message, "#item_name");
      } else {
        showMessage(
          "error-message",
          "Ενώ η προσθήκη της νέας ανακοίνωσης ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
          "#item_name"
        );
      }
    },
    error: function (response) {
      // Χειριστείτε εδώ τα σφάλματα
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "#item_name");
      } else if (errorResponse.status === "server_error") {
        showMessage("error-message", errorResponse.message, "#item_name");
      } else if (errorResponse.status === "missing_400") {
        showMessage("error-message", errorResponse.message, "#item_name");
      } else if (errorResponse.status === "need_connection") {
        showMessage("error-message", errorResponse.message, "#item_name");
      } else {
        showMessage(
          "error-message",
          "Σφάλμα κατά την διάρκεια δημιουργίας της νέας ανακοίνωσης. Παρακαλώ δοκιμάστε ξανά.",
          "#item_name"
        );
      }
    },
  });
}
