// Λειτουργικότητα για το Sign In //TODO(OXI MONO ALLA KAI OPOY ALLOY XREIAZETAI) Na ginoyn oloi oi js opoy xreiazetai document.addEventListener("DOMContentLoaded", function()) 
//TODO(SYNEXEIA) kalontas synarthseis ekei mesa.Epishs opoy xreiazetai ektos apo to pathma me aristero click na ginetai kai me to pathma toy koympioy "ENTER" apo to keyboard(opoy xreaizetai kai ayto)
"use strict";

function login(event) {
    event.preventDefault();
      var username = document.getElementById("user-login").value;
      var password = document.getElementById("pass-login").value;
    
      // Εδώ κάνουμε την AJAX κλήση για το Sign In
      $.ajax({
        url: "http://localhost/webproject/Code/PHP/sign_in.php",
        method: "GET",
        data: {username: username, password: password},
        success: function(response) {
          if (response.status === "success") {
            // Η σύνδεση ήταν επιτυχής
            window.location.href = "user_index_page.html";
            showMessage("success-message", response.message , "user-login")
            // Ενέργειες που θέλετε να κάνετε μετά την επιτυχημένη σύνδεση
          } else {
            // Η σύνδεση απέτυχε
            showMessage("error-message", "Ενώ η σύνδεση ήταν επιτυχής κάτι πήγε στραβά.Παρακάκω δοκιμάστε ξανά" , "user-login");
            // Ενέργειες που θέλετε να κάνετε αν η σύνδεση αποτύχει
          }
        },
        error: function(response) {
          // Κάτι πήγε στραβά με την κλήση AJAX
          var errorResponse = JSON.parse(response.responseText);
          if (errorResponse.status === "username_401") {

                showMessage("error-message", errorResponse.message, "user-login");
                
            } else if(errorResponse.status === "password_401"){
              
              showMessage("error-message", errorResponse.message, "pass-login");

            } else if(errorResponse.status === "not_found_404"){

              showMessage("error-message", errorResponse.message, "user-login");

            } else if(errorResponse.status === "missing_400"){

              showMessage("error-message", errorResponse.message, "user-login");

            } else if(errorResponse.status === "wrong_method_405"){

              showMessage("error-message", errorResponse.message, "user-login");

            } else{
                showMessage("error-message", "Σφάλμα κατά την σύνδεση. Παρακαλώ δοκιμάστε ξανά.", "user-login");
            }
          // Ενέργειες που θέλετε να κάνετε αν υπάρξει σφάλμα
        }
      });
    }