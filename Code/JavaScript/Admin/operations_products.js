document.addEventListener("DOMContentLoaded", function () {
  var deleteAllButton = document.getElementById("delete-all-button");
  var pattern = /^[a-zA-Zα-ωΑ-Ωίϊΐόάέύϋΰήώ\s]+$/;
  var numberPattern = /^[1-9]\d*$/;

  const addItemFormContainer = document.getElementById("add-form-container");

  const showAddItemFormButton = document.getElementById("show-add-form");

  const addItemForm = document.getElementById("add-item-form");

  const ChangeItemInfoForm = document.getElementById("options-item-form");

  deleteAllButton.addEventListener("click", function () {
    // Καλείτε τη συνάρτηση για διαγραφή όλων των προϊόντων
    deleteAllProducts();
    updateItemsBasedOnCategoryAndSearch();
  });

  showAddItemFormButton.addEventListener("click", function () {
    addItemFormContainer.style.display = "block";

    // Click the 'Add Item' tab
    document.getElementsByClassName("tablinks")[0].click();
    // Αλλάζετε το φόντο του overlay σε θολό χρώμα και το εμφανίζετε όταν εμφανίζεται η φόρμα
    const overlay = document.getElementById("overlay");
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Προσαρμόστε το χρώμα ανάλογα με τις ανάγκες σας
    overlay.style.display = "block";
    addItemFormContainer.style.display = "block";

    loadCategories("select", "#item_category", false);
  });

  overlay.addEventListener("click", function () {
    resetForms("add-form-container");
    // Κλείστε τη φόρμα και το overlay όταν γίνει κλικ στο overlay
    addItemFormContainer.style.display = "none";
    overlay.style.display = "none";
  });

  ChangeItemInfoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var itemName = document.getElementById("name").value;
    var itemQuantity = document.getElementById("quantity").value;
    var itemCategory = document.getElementById("category").value;
    var itemDetails = document.getElementById("details").value;
    var formData = new FormData(ChangeItemInfoForm);

    if (itemName.trim() === "") {
      showMessage(
        "error-message",
        "Παρακαλώ εισάγετε το όνομα του είδους.",
        "#name"
      );
      return;
    }

    if (!pattern.test(itemName)) {
      showMessage(
        "error-message",
        "Το όνομα του είδους πρέπει να περιέχει μόνο χαρακτήρες.",
        "#name"
      );
      return;
    }

    if (itemQuantity.trim() === "") {
      showMessage(
        "error-message",
        "Παρακαλώ εισάγετε την ποσότητα του είδους.",
        "#quantity"
      );
      return;
    }

    if (!numberPattern.test(itemQuantity)) {
      showMessage(
        "error-message",
        "Η ποσότητα πρέπει να είναι ακέραια και οχι αρνητική.",
        "#quantity"
      );
      return;
    }

    if (itemDetails.trim() === "") {
      showMessage(
        "error-message",
        "Παρακαλώ εισάγετε τις λεπτομέρειες του είδους.",
        "#details"
      );
      return;
    }
    changeitemInformation(formData);
    updateItemsBasedOnCategoryAndSearch();
  });

  addItemForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Αποτρέψτε την προεπιλεγμένη υποβολή φόρμας

    var itemName = document.getElementById("item-name").value;

    // Δημιουργία αντικειμένου FormData για τη συλλογή δεδομένων φόρμας
    var formData = new FormData(addItemForm);

    // Προσθήκη των λεπτομερειών προϊόντος
    var details = [];
    var detailNames = document.querySelectorAll(
      'input[name="item-detail-name[]"]'
    );
    var detailValues = document.querySelectorAll(
      'input[name="item-detail-value[]"]'
    );
    for (var i = 0; i < detailNames.length; i++) {
      details.push({
        name: detailNames[i].value,
        value: detailValues[i].value,
      });
    }
    formData.append("details", JSON.stringify(details));

    if (itemName.trim() === "") {
      showMessage(
        "error-message",
        "Παρακαλώ εισάγετε το όνομα του είδους.",
        "#item-name"
      );
      return;
    }

    // Αποστολή δεδομένων φόρμας μέσω AJAX
    if (!pattern.test(itemName)) {
      showMessage(
        "error-message",
        "Το όνομα του είδους πρέπει να περιέχει μόνο χαρακτήρες.",
        "#item-name"
      );
      return;
    }

    for (var i = 0; i < detailNames.length; i++) {
      if (
        detailNames[i].value.trim() === "" ||
        detailValues[i].value.trim() === ""
      ) {
        event.preventDefault(); // Αποτροπή υποβολής της φόρμας
        showMessage(
          "error-message",
          "Παρακαλώ συμπληρώστε όλα τα πεδία λεπτομερειών.",
          "#item-name"
        );
        return; // Διακοπή της εκτέλεσης της συνάρτησης
      }

      if (!pattern.test(detailNames[i].value)) {
        event.preventDefault(); // Αποτροπή υποβολής της φόρμας
        showMessage(
          "error-message",
          "Το όνομα λεπτομερειών πρέπει να περιέχει μόνο χαρακτήρες.",
          "#item-name"
        );
        return; // Διακοπή της εκτέλεσης της συνάρτησης
      }
    }
    addProduct(formData);
    updateItemsBasedOnCategoryAndSearch();
  });

  // Προσθήκη λειτουργικότητας για την προσθήκη πεδίων λεπτομερειών
  var addDetailButton = document.getElementById("add-detail");
  addDetailButton.addEventListener("click", function () {
    var container = document.getElementById("item-details-container");

    // Δημιουργία της ετικέτας για το όνομα λεπτομέρειας
    var labelDetailName = document.createElement("label");
    labelDetailName.textContent = "Όνομα λεπτομερειών στοιχείου:";

    var newDetailName = document.createElement("input");
    newDetailName.type = "text";
    newDetailName.name = "item-detail-name[]";
    newDetailName.placeholder = "π.χ. 'βάρος'";

    // Δημιουργία της ετικέτας για την τιμή λεπτομέρειας
    var labelDetailValue = document.createElement("label");
    labelDetailValue.textContent = "Τιμή λεπτομέρειας στοιχείου:";

    var newDetailValue = document.createElement("input");
    newDetailValue.type = "text";
    newDetailValue.name = "item-detail-value[]";
    newDetailValue.placeholder = "π.χ. '500gr'";

    container.appendChild(labelDetailName);
    container.appendChild(newDetailName);
    container.appendChild(labelDetailValue);
    container.appendChild(newDetailValue);
    container.appendChild(document.createElement("br"));
  });
});

function deleteAllProducts() {
  $.ajax({
    url: "../../PHP/Admin/delete_all_products.php",
    method: "DELETE",
    success: function (response) {
      console.log("Απάντηση από τον διακομιστή:", response);

      if (response.status === "success") {
        showMessage("success-message", response.message, "#delete-all-button");
      } else {
        showMessage(
          "error-message",
          "Ενώ η διαγραφή των δεδομένων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
          "delete-all-button"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage(
          "error-message",
          errorResponse.message,
          "delete-all-button"
        );
      } else if (errorResponse.status === "server_error") {
        showMessage(
          "error-message",
          errorResponse.message,
          "delete-all-button"
        );
      } else {
        showMessage(
          "error-message",
          "Σφάλμα κατά την διάρκεια διαγραφής των δεδομένων. Παρακαλώ δοκιμάστε ξανά.",
          "delete-all-button"
        );
      }
    },
  });
}

function addProduct(form) {
  $.ajax({
    url: "../../PHP/Admin/addProduct.php", // Αντικαταστήστε με το δικό σας URL
    method: "POST",
    data: form,
    processData: false,
    contentType: false,
    success: function (response) {
      // Χειριστείτε εδώ την επιτυχή απόκριση
      console.log("Επιτυχής προσθήκη προϊόντος", response);

      if (response.status === "created") {
        showMessage("success-message", response.message, "#item-name");
      } else {
        showMessage(
          "error-message",
          "Ενώ η προσθήκη του νέου είδους ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
          "#item-name"
        );
      }
    },
    error: function (response) {
      // Χειριστείτε εδώ τα σφάλματα
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "#item-name");
      } else if (errorResponse.status === "server_error") {
        showMessage("error-message", errorResponse.message, "#item-name");
      } else if (errorResponse.status === "missing_400") {
        showMessage("error-message", errorResponse.message, "#item-name");
      } else if (errorResponse.status === "exists") {
        showMessage("error-message", errorResponse.message, "#item-name");
      } else {
        showMessage(
          "error-message",
          "Σφάλμα κατά την διάρκεια προσθήκης του νέου αντικειμένου. Παρακαλώ δοκιμάστε ξανά.",
          "#item-name"
        );
      }
    },
  });
}

function deleteItem(item_id) {
  $.ajax({
    url: "../../PHP/Admin/delete_item.php",
    method: "DELETE",
    data: { item_id: item_id },
    success: function (response) {
      if (response.status === "success") {
        showMessage("success-message", response.message, "#items-list");
      } else {
        showMessage(
          "error-message",
          "Ενώ η διαγραφή του είδους ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
          "#items-list"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "#items-list");
      } else if (errorResponse.status === "server_error") {
        showMessage("error-message", errorResponse.message, "#items-list");
      } else if (errorResponse.status === "missing_400") {
        showMessage("error-message", errorResponse.message, "#items-list");
      } else if (errorResponse.status === "not_found_404") {
        showMessage("error-message", errorResponse.message, "#items-list");
      } else {
        showMessage(
          "error-message",
          "Προέκυψε σφάλμα κατά τη διαγραφή του είδους. Παρακαλώ δοκιμάστε ξανά.",
          "#items-list"
        );
      }
    },
  });
}

function getitemInformation(itemName) {
  $.ajax({
    url: "../../PHP/Admin/get_item_info.php",
    method: "GET",
    data: { itemName: itemName },
    success: function (response) {
      if (response.status === "success") {
        document.getElementById("name").value = response.item_info.name;
        document.getElementById("quantity").value = response.item_info.quantity;
        document.getElementById("category").value =
          response.item_info.category_id;
        document.getElementById("details").value = response.item_info.details;
        showMessage("success-message", response.message, "#options-item-form");
      } else if (response.status === "success_but_empty") {
        showMessage("success-message", response.message, "#options-item-form");
      } else {
        showMessage(
          "error-message",
          "Ενώ η ανάκτηση πληροφοριών του είδους ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
          "#options-item-form"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#options-item-form"
        );
      } else if (errorResponse.status === "server_error") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#options-item-form"
        );
      } else if (errorResponse.status === "missing_400") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#options-item-form"
        );
      } else {
        showMessage(
          "error-message",
          "Προέκυψε σφάλμα κατά την ανάκτηση πληροφοριών του είδους. Παρακαλώ δοκιμάστε ξανά.",
          "#items-list"
        );
      }
    },
  });
}

function changeitemInformation(form) {
  $.ajax({
    url: "../../PHP/Admin/change_item_info.php",
    method: "POST",
    data: form,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response.status === "success_change") {
        showMessage("success-message", response.message, "#options-item-form");
      } else if ((response.status = "success_but_no_changes")) {
        showMessage("success-message", response.message, "#options-item-form");
      } else {
        showMessage(
          "error-message",
          "Ενώ η αλλαγή πληροφοριών του είδους ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
          "#options-item-form"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#options-item-form"
        );
      } else if (errorResponse.status === "server_error") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#options-item-form"
        );
      } else if (errorResponse.status === "missing_400") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#options-item-form"
        );
      } else if (errorResponse.status === "no_id_auth") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#options-item-form"
        );
      } else {
        showMessage(
          "error-message",
          "Προέκυψε σφάλμα κατά την αλλαγή πληροφοριών του είδους. Παρακαλώ δοκιμάστε ξανά.",
          "#options-item-form"
        );
      }
    },
  });
}

function resetForms(id) {
  // Get all forms within the container
  var forms = document.getElementById(id).getElementsByTagName("form");
  for (var i = 0; i < forms.length; i++) {
    forms[i].reset(); // This will reset all forms to their default values
  }
}

//! (FREEZE).Φτιαξιμο επεξεργασια προφιλ(Telika tha to paw pros to telos gia na ftiajw mia koinh html poy tha xrhsimopoihoyn kai 3 typoy xrhstwn)
//! 4. ΔΙΑΒΑΣΕ ΘΕΩΡΙΑ ΜΛΚ ΘΑ ΚΟΠΕΙΣ
