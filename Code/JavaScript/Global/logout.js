$(document).ready(function () {
  $("#logout-link").click(function () {
    event.preventDefault();
    console.log("CLICKED");
    Logout();
  });
});

function Logout() {
  $.ajax({
    url: "https://localhost/webproject/Code/PHP/logout.php",
    method: "POST",
    dataType: "json",
    success: function (response) {
      if (response.status === "success") {
        window.location.href = "admin_login.html";
        console.log("APOSYNDESH ENTAJEI");
      } else {
        showMessage(
          "error-message",
          "Σφάλμα κατά την αποσύνδεση. Παρακαλώ προσπαθήστε ξανά.",
          "showbox"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "need_connection") {
        showMessage("error-message", errorResponse.message, "showbox");
      } else if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "showbox");
      } else {
        showMessage(
          "error-message",
          "Σφάλμα κατά την αποσύνδεση. Παρακαλώ προσπαθήστε ξανά.",
          "showbox"
        );
      }
    },
  });
}
