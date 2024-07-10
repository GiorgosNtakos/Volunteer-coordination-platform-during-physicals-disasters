"use strict";

function login(event) {
  event.preventDefault();
  var username = document.getElementById("user-login").value;
  var password = document.getElementById("pass-login").value;

  $.ajax({
    url: "../../PHP/Global/sign_in.php",
    method: "GET",
    data: { username: username, password: password },
    success: function (response) {
      if (response.status === "success" && response.type === "Citizen") {
        if(response.form === 1){

          window.location.href = "../../HTML/Global/index_page.html";
          showMessage("extra-success-message", response.message, "#user-login");

        } else {

          window.location.href = "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/User/personal_info_form.html";
          showMessage("extra-success-message", response.message, "#user-login");

        }
      } else if (response.status === "success" && response.type === "Admin") {
        window.location.href = "../../HTML/Global/index_page.html";
        showMessage("extra-success-message", response.message, "#user-login");
      } else if (response.status === "success" && response.type === "Rescuer") {
        window.location.href = "../../HTML/Global/index_page.html";
        showMessage("extra-success-message", response.message, "#user-login");
      } else {
        showMessage(
          "extra-error-message",
          "Ενώ η σύνδεση ήταν επιτυχής κάτι πήγε στραβά.Παρακάκω δοκιμάστε ξανά",
          "#user-login"
        );
      }
    },
    error: function (response) {
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
    },
  });
}
