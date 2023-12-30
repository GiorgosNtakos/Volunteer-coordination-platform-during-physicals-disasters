document.addEventListener("DOMContentLoaded", function () {
  var deleteAllButton = document.getElementById("delete-all-button");

  const addItemFormContainer = document.getElementById(
    "add-item-form-container"
  );

  const showAddItemFormButton = document.getElementById("show-add-item-form");

  const addItemForm = document.getElementById("add-item-form");

  deleteAllButton.addEventListener("click", function () {
    // Καλείτε τη συνάρτηση για διαγραφή όλων των προϊόντων
    deleteAllProducts();
  });

  showAddItemFormButton.addEventListener("click", function () {
    // Αλλάζετε το φόντο του overlay σε θολό χρώμα και το εμφανίζετε όταν εμφανίζεται η φόρμα
    const overlay = document.getElementById("overlay");
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Προσαρμόστε το χρώμα ανάλογα με τις ανάγκες σας
    overlay.style.display = "block";
    addItemFormContainer.style.display = "block";

    loadCategories("select", "#item_category");
  });

  overlay.addEventListener("click", function () {
    // Κλείστε τη φόρμα και το overlay όταν γίνει κλικ στο overlay
    addItemFormContainer.style.display = "none";
    overlay.style.display = "none";
  });
});

function deleteAllProducts() {
  $.ajax({
    url: "http://localhost/webproject/Code/PHP/Admin/delete_all_products.php",
    method: "DELETE",
    success: function (response) {
      console.log("Απάντηση από τον διακομιστή:", response);

      if (response.status === "success") {
        showMessage("success-message", response.message, "delete-all-button");
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
