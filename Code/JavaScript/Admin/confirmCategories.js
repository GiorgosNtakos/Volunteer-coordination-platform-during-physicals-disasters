//! Υπαρχει καποιο περιεργο bug με το refresh δηλαδη αν κανουμε πολλα refresh σε
//! συντομο χρονικο διαστημα (refresh ανα 1 sec) τοτε αν εχουμε 6 refresh τα 5
//! πρωτα θα εχουν τα αναμενομενα αποτελεσματα αλλα στο 6ο refresh θα μας δειχνει
//! οτι ολες οι κατηγοριες ειναι ανενεργες πραγμα που δεν ισχυει
//? Solution 1: Εφαρμογή ενός μηχανισμού κράτησης (throttling) για τα refresh requests: καποια setTimeout
//? Solution 2:Επιβεβαίωση ότι το αίτημα προς τον server ολοκληρώνεται προτού ξεκινήσετε τον επόμενο κύκλο του refresh : χρηση συναρτησης complete στο αιτημα ajax

$(document).ready(function () {
  const showCheckCategoriesFormButton = document.getElementById(
    "show-check-categories-form"
  );

  const CheckCategoriesFormContainer = document.getElementById(
    "check-categories-form-container"
  );

  showCheckCategoriesFormButton.addEventListener("click", function () {
    // Αλλάζετε το φόντο του overlay σε θολό χρώμα και το εμφανίζετε όταν εμφανίζεται η φόρμα
    const overlay = document.getElementById("overlay");
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Προσαρμόστε το χρώμα ανάλογα με τις ανάγκες σας
    overlay.style.display = "block";
    CheckCategoriesFormContainer.style.display = "block";

    loadCategories("checkbox-activate", "#categoriesList", false);
    categoriesStatus();
  });

  overlay.addEventListener("click", function () {
    document.getElementById("categoriesList").innerHTML = "";
    // Κλείστε τη φόρμα και το overlay όταν γίνει κλικ στο overlay
    CheckCategoriesFormContainer.style.display = "none";
    overlay.style.display = "none";
  });

  // Προσθήκη event listener στο κουμπί με id "submitCategories"
  $("#submitCategories").on("click", function () {
    // Εδώ μπορείτε να εκτελέσετε τον κώδικα που θέλετε πριν το confirm
    // Σε αυτό το σημείο, μπορείτε να ελέγξετε τις εισαγωγές ή να κάνετε άλλες ενέργειες
    // Καλεί τη συνάρτηση confirmSelection όταν το κουμπί πατηθεί
    confirmSelection();
  });
});

// Συνάρτηση που επιβεβαιώνει τις επιλογές
function confirmSelection() {
  // Εδώ μπορείτε να τοποθετήσετε τον κώδικα που χρειάζεται για να επιβεβαιώσετε τις επιλογές
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

  // Δημιουργία κειμένου που θα προβληθεί στο confirm box
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

  // Εμφάνιση του confirm box με το προσαρμοσμένο κείμενο
  var confirmed = confirm(confirmationText);

  if (confirmed) {
    // Εάν ο χρήστης πατήσει "ΟΚ", καλέστε το PHP για να επικυρώσετε τις επιλεγμένες κατηγορίες
    $.ajax({
      method: "POST",
      url: "../../PHP/Admin/confirmCategories.php",
      data: {
        activeCategories: activeCategories,
        inactiveCategories: inactiveCategories,
      },
      success: function (response) {
        // Επεξεργασία της απάντησης από τον διακομιστή (πιθανόν μήνυμα επικύρωσης)
        alert(response.message);
      },
      error: function (xhr, status, error) {
        console.error("AJAX Error: " + status, error);
      },
    });
  } else {
    // Εάν ο χρήστης πατήσει "Άκυρο", επαναφέρετε ή κάντε ό,τι χρειάζεται
    console.log("Οι κατηγορίες δεν επιβεβαιώθηκαν.");
  }
}

function categoriesStatus() {
  $.ajax({
    method: "GET",
    url: "../../PHP/Admin/categoriesStatus.php",
    success: function (categoriesStatus) {
      // Έλεγχος της κατάστασης και τσεκάρισμα των κουτιών
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
