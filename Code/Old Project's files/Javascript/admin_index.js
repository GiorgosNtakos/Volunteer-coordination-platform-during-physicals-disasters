"use strict";

document.addEventListener("DOMContentLoaded", function () {
  GetAdminName();
});

function GetAdminName() {
  var adminNameElement = document.getElementById("adminName");
  var adminImageElement = document.getElementById("adminImage");
  $.ajax({
    url: "https://localhost/webproject/Code/PHP/admin_index.php",
    method: "GET",
    success: function (response) {
      if (response.status === "success") {
        adminNameElement.textContent = response.admin_name.replace("_", " ");
        adminImageElement.src = response.img_path;
        console.log("Απάντηση από τον διακομιστή:", response);
      } else {
        window.location.href = "admin_login.html";
        showMessage(
          "error-message",
          "Ενώ η ανάκτηση στοιχείων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ συνδεθείτε ξανά.",
          "admin-name"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "need_connection") {
        window.location.href = "admin_login.html";
        showMessage("error-message", errorResponse.message, "admin-name");
      } else if (errorResponse.status === "not_found_404") {
        showMessage("error-message", errorResponse.message, "showbox");
      } else if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "showbox");
      } else if (errorResponse.status === "server_error") {
        showMessage("error-message", errorResponse.message, "showbox");
      } else {
        showMessage(
          "error-message",
          "Σφάλμα κατά την διάρκεια φόρτωσης των στοιχείων. Παρακαλώ συνδεθείτε ξανά.",
          "showbox"
        );
      }
    },
  });
}
