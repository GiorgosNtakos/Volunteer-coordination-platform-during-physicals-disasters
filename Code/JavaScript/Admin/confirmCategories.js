$(document).ready(function () {
  const showCheckCategoriesFormButton = document.getElementById(
    "show-check-categories-form"
  );

  const CheckCategoriesFormContainer = document.getElementById(
    "check-categories-form-container"
  );

  showCheckCategoriesFormButton.addEventListener("click", function () {
    const overlay = document.getElementById("overlay");
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "block";
    CheckCategoriesFormContainer.style.display = "block";

    loadCategories("checkbox-activate", "#categoriesList", false);
    categoriesStatus();
  });

  overlay.addEventListener("click", function () {
    document.getElementById("categoriesList").innerHTML = "";
    CheckCategoriesFormContainer.style.display = "none";
    overlay.style.display = "none";
  });

  $("#submitCategories").on("click", function () {
    confirmSelection();
  });
});

function confirmSelection() {
  var categoriesList = $(".category-checkbox");
  console.log(categoriesList);
  var activeCategories = [];
  var inactiveCategories = [];

  categoriesList.each(function () {
    var id = $(this).attr("id");

    if ($(this).prop("checked")) {
      activeCategories.push($(this).attr("value"));
    } else {
      inactiveCategories.push($(this).val());
    }
  });

  console.log(activeCategories);
  console.log(inactiveCategories);

  if (activeCategories.length > 0 && inactiveCategories.length > 0) {
    var confirmationText =
      "Είστε σίγουροι ότι θέλετε να ενεργοποιησετε τις κατηγορίες:\n";
    for (var i = 0; i < activeCategories.length; i++) {
      confirmationText += activeCategories[i];
      if (i < activeCategories.length - 1) {
        confirmationText += ", ";
      }
    }

    confirmationText +=
      ", αλλα και να απενεργοποιηθούν οι παρακατω κατηγοριες:\n";
    for (var i = 0; i < inactiveCategories.length; i++) {
      confirmationText += inactiveCategories[i];
      if (i < inactiveCategories.length - 1) {
        confirmationText += ", ";
      }
    }
    confirmationText += " με τα προϊόντα τους προς διακίνηση;";
  } else if (activeCategories.length < 1 && inactiveCategories.length > 0) {
    confirmationText =
      "Είστε σίγουροι ότι θέλετε να απενεργοποιηθούν οι παρακατω κατηγοριες:\n";
    for (var i = 0; i < inactiveCategories.length; i++) {
      confirmationText += inactiveCategories[i];
      if (i < inactiveCategories.length - 1) {
        confirmationText += ", ";
      }
    }
    confirmationText += " με τα προϊόντα τους προς διακίνηση;";
  } else if (inactiveCategories.length < 1 && activeCategories.length > 0) {
    var confirmationText =
      "Είστε σίγουροι ότι θέλετε να ενεργοποιησετε τις κατηγορίες:\n";
    for (var i = 0; i < activeCategories.length; i++) {
      confirmationText += activeCategories[i];
      if (i < activeCategories.length - 1) {
        confirmationText += ", ";
      }
    }
  }

  var confirmed = confirm(confirmationText);

  if (confirmed) {
    // Εάν ο χρήστης πατήσει "ΟΚ" καλείται το PHP
    $.ajax({
      method: "POST",
      url: "../../PHP/Admin/confirmCategories.php",
      data: {
        activeCategories: activeCategories,
        inactiveCategories: inactiveCategories,
      },
      success: function (response) {
        alert(response.message);
      },
      error: function (xhr, status, error) {
        console.error("AJAX Error: " + status, error);
      },
    });
  } else {
    // Εάν ο χρήστης πατήσει "Άκυρο", επαναφορά
    console.log("Οι κατηγορίες δεν επιβεβαιώθηκαν.");
  }
}

function categoriesStatus() {
  $.ajax({
    method: "GET",
    url: "../../PHP/Admin/categoriesStatus.php",
    success: function (categoriesStatus) {
      for (var id in categoriesStatus) {
        if (categoriesStatus.hasOwnProperty(id)) {
          var isActive = categoriesStatus[id];
          $("#" + id).prop("checked", isActive);
        }
      }

      return categoriesStatus;
    },
    error: function (response, xhr, status, error) {
      var errorResponse = JSON.parse(response.responseText);
      if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "admin-name");
      } else {
        console.error("AJAX Error: " + status, error);
      }
    },
  });
}
