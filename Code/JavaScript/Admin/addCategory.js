$(document).ready(function () {
  $("#categoriesForm").submit(function (event) {
    event.preventDefault();

    addCategory();
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
    url: "http://localhost/webproject/Code/PHP/Admin/addCategory.php",
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
