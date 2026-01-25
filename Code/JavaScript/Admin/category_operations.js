$(document).ready(function () {
  const deleteCategoryFormContainer = document.getElementById(
    "deleteCategory-form-container"
  );

  const showDeleteCategoryFormButton = document.getElementById(
    "show-delete-categories-form"
  );
  $("#add-category-form").submit(function (event) {
    event.preventDefault();

    addCategory();
  });

  showDeleteCategoryFormButton.addEventListener("click", function () {
    // Αλλάζετε το φόντο του overlay σε θολό χρώμα και το εμφανίζετε όταν εμφανίζεται η φόρμα
    const overlay = document.getElementById("overlay");
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Προσαρμόστε το χρώμα ανάλογα με τις ανάγκες σας
    overlay.style.display = "block";
    deleteCategoryFormContainer.style.display = "block";

    loadCategories("checkbox-activate", "#deleteCategoriesList", false);
  });

  overlay.addEventListener("click", function () {
    document.getElementById("deleteCategoriesList").innerHTML = "";
    // Κλείστε τη φόρμα και το overlay όταν γίνει κλικ στο overlay
    deleteCategoryFormContainer.style.display = "none";
    overlay.style.display = "none";
  });

  document
    .getElementById("deleteCategory")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      deleteCategories(); // Call the delete function
    });
});

function addCategory() {
  var categoryName = document.getElementById("category_name").value;
  var pattern = /^[a-zA-Zα-ωΑ-Ωίϊΐόάέύϋΰήώ\s]+$/;

  if (categoryName.trim() === "") {
    alert("Παρακαλώ εισάγετε ένα όνομα κατηγορίας.");
    return;
  }

  if (!pattern.test(categoryName)) {
    alert("Το όνομα κατηγορίας πρέπει να περιέχει μόνο χαρακτήρες.");
    return;
  }

  // Κλήση στο PHP για προσθήκη κατηγορίας
  $.ajax({
    method: "POST",
    url: "../../PHP/Admin/addCategory.php",
    data: { category_name: categoryName },
    success: function (response) {
      // Επεξεργασία της απάντησης από τον διακομιστή (ενδεχομένως εμφάνιση μηνύματος)
      alert(response);
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error: " + status, error);
    },
  });
}

function deleteCategories() {
  let selectedCategories = [];
  document
    .querySelectorAll('#deleteCategoriesList input[type="checkbox"]:checked')
    .forEach(function (checkbox) {
      selectedCategories.push(checkbox.id);
    });
  console.log(selectedCategories);
  if (!selectedCategories.length) {
    showMessage(
      "error-message",
      "Δεν έχει επιλεχθεί κάποια κατηγορία για διαγραφή",
      "#deleteCategory"
    );
    return;
  }
  $.ajax({
    method: "DELETE",
    url: "../../PHP/Admin/deleteCategories.php",
    data: { categories: selectedCategories.join(",") },
    success: function (response) {
      if (response.status === "success") {
        loadItems(1, 15, "");
        showMessage("success-message", response.message, "#deleteCategory");
      } else {
        showMessage(
          "error-message",
          "Ενώ η διαγραφή ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
          "#deleteCategory"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "#deleteCategory");
      } else if (errorResponse.status === "server_error") {
        showMessage("error-message", errorResponse.message, "#deleteCategory");
      } else if (errorResponse.status === "missing_400") {
        showMessage("error-message", errorResponse.message, "#deleteCategory");
      } else {
        showMessage(
          "error-message",
          "Σφάλμα κατά την διάρκεια διαγραφής. Παρακαλώ δοκιμάστε ξανά.",
          "#deleteCategory"
        );
      }
    },
  });
}
