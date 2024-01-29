//! Φτιαξιμο ετσι ωστε οταν κλεινει η φορμα να πηγαινει στις default τιμες (οπως εγινε δηλαδη και με την φορμα του upload data)
$(document).ready(function () {
  document
    .getElementById("loadTypeQuantities")
    .addEventListener("change", function () {
      var fileSection = document.getElementById("fileSectionQuantities");

      displayFileName("jsonFileQuantities");

      if (this.value === "rng") {
        fileSection.style.display = "none";
      } else if (this.value === "file") {
        fileSection.style.display = "block";
      }
    });

  const loadQuantitiesFormContainer = document.getElementById(
    "load-quantities-form-container"
  );
  const loadQuantitiesFormButton = document.getElementById(
    "show-load-quantities-form"
  );

  loadQuantitiesFormButton.addEventListener("click", function () {
    // Αλλάζετε το φόντο του overlay σε θολό χρώμα και το εμφανίζετε όταν εμφανίζεται η φόρμα
    const overlay = document.getElementById("overlay");
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Προσαρμόστε το χρώμα ανάλογα με τις ανάγκες σας
    overlay.style.display = "block";
    loadQuantitiesFormContainer.style.display = "block";
    uploadQuantities();
  });

  overlay.addEventListener("click", function () {
    // Κλείστε τη φόρμα και το overlay όταν γίνει κλικ στο overlay
    //resetUploadForm();
    loadQuantitiesFormContainer.style.display = "none";
    overlay.style.display = "none";
  });
});

function uploadQuantities() {
  $("#uploadQuantitiesForm").submit(function (event) {
    event.preventDefault();

    var loadType = $("#loadTypeQuantities").val();
    var formData = new FormData();

    if (loadType === "rng") {
      formData.append("loadTypeQuantities", "rng");
    } else if (loadType === "file") {
      formData.append("loadTypeQuantities", "file");
      formData.append(
        "jsonFileQuantities",
        $("#jsonFileQuantities")[0].files[0]
      );
    }

    $.ajax({
      url: "http://localhost/webproject/Code/PHP/Admin/uploadQuantities.php",
      method: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        console.log(response);
        if (response.status === "created") {
          loadItems(1, 15, "");
          showMessage(
            "success-message",
            response.message,
            "#uploadQuantitiesForm"
          );
        } else if (response.status === "success_but_empty") {
          loadItems(1, 15, "");
          showMessage(
            "success-message",
            response.message,
            "#uploadQuantitiesForm"
          );
        } else {
          showMessage(
            "error-message",
            "Ενώ η προσθήκη του νέου είδους ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
            "#uploadQuantitiesForm"
          );
        }
      },
      error: function (response) {
        var errorResponse = JSON.parse(response.responseText);

        if (errorResponse.status === "wrong_method_405") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#uploadQuantitiesForm"
          );
        } else if (errorResponse.status === "server_error") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#uploadQuantitiesForm"
          );
        } else if (errorResponse.status === "missing_400") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#uploadQuantitiesForm"
          );
        } else {
          showMessage(
            "error-message",
            "Σφάλμα κατά την διάρκεια διαγραφής. Παρακαλώ δοκιμάστε ξανά.",
            "#uploadQuantitiesForm"
          );
        }
      },
    });
  });
}
