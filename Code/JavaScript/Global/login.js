// Λειτουργικότητα για το Sign In 
//TODO(OXI MONO ALLA KAI OPOY ALLOY XREIAZETAI) Na ginoyn oloi oi js opoy xreiazetai document.addEventListener("DOMContentLoaded", function())
//TODO(SYNEXEIA) kalontas synarthseis ekei mesa.Epishs opoy xreiazetai ektos apo to pathma me aristero click na ginetai kai me to pathma toy koympioy "ENTER" apo to keyboard(opoy xreaizetai kai ayto)
"use strict";

function login(event) {
  event.preventDefault();
  var username = document.getElementById("user-login").value;
  var password = document.getElementById("pass-login").value;

  // Εδώ κάνουμε την AJAX κλήση για το Sign In
  $.ajax({
    url: "../../PHP/Global/sign_in.php",
    method: "GET",
    data: { username: username, password: password },
    success: function (response) {
      if (response.status === "success" && response.type === "Citizen") {
        // Η σύνδεση ήταν επιτυχής
        if(response.form === 1){

          window.location.href = "../../HTML/Global/index_page.html";
          showMessage("extra-success-message", response.message, "#user-login");
          // Ενέργειες που θέλετε να κάνετε μετά την επιτυχημένη σύνδεση

        } else {

          window.location.href = "personal_info_form.html";
          showMessage("extra-success-message", response.message, "#user-login");
          // Ενέργειες που θέλετε να κάνετε μετά την επιτυχημένη σύνδεση

        }
      } else if (response.status === "success" && response.type === "Admin") {
        window.location.href = "../../HTML/Global/index_page.html";
        showMessage("extra-success-message", response.message, "#user-login");
      } else if (response.status === "success" && response.type === "Rescuer") {
        window.location.href = "../../HTML/Global/index_page.html";
        showMessage("extra-success-message", response.message, "#user-login");
      } else {
        // Η σύνδεση απέτυχε
        showMessage(
          "extra-error-message",
          "Ενώ η σύνδεση ήταν επιτυχής κάτι πήγε στραβά.Παρακάκω δοκιμάστε ξανά",
          "#user-login"
        );
        // Ενέργειες που θέλετε να κάνετε αν η σύνδεση αποτύχει
      }
    },
    error: function (response) {
      // Κάτι πήγε στραβά με την κλήση AJAX
      var errorResponse = JSON.parse(response.responseText);
      if (errorResponse.status === "username_401") {
        showMessage(
          "extra-error-message",
          errorResponse.message,
          "#user-login"
        );
      } else if (errorResponse.status === "password_401") {
        showMessage(
          "extra-error-message",
          errorResponse.message,
          "#pass-login"
        );
      } else if (errorResponse.status === "not_found_404") {
        showMessage(
          "extra-error-message",
          errorResponse.message,
          "#user-login"
        );
      } else if (errorResponse.status === "missing_400") {
        showMessage(
          "extra-error-message",
          errorResponse.message,
          "#user-login"
        );
      } else if (errorResponse.status === "wrong_method_405") {
        showMessage(
          "extra-error-message",
          errorResponse.message,
          "#user-login"
        );
      } else {
        showMessage(
          "extra-error-message",
          "Σφάλμα κατά την σύνδεση. Παρακαλώ δοκιμάστε ξανά.",
          "#user-login"
        );
      }
      // Ενέργειες που θέλετε να κάνετε αν υπάρξει σφάλμα
    },
  });
}
