// Λειτουργικότητα για το Sign In
"use strict";

function login(event) {
    event.preventDefault();
      var admin_name = document.getElementById("admin-name").value;
      var password = document.getElementById("admin-pass").value;
    
      // Εδώ κάνουμε την AJAX κλήση για το Sign In
      $.ajax({
        url: "http://localhost/webproject/Code/PHP/admin_sign_in.php",
        method: "GET",
        dataType: "json",
        data: {admin_name: admin_name, password: password},
        success: function(response) {
          if (response.status === "success") {

            // Η σύνδεση ήταν επιτυχής
            showMessage("success-message", response.message , "admin-name");
            window.location.href = "admin_index_page.html";
            // Ενέργειες που θέλετε να κάνετε μετά την επιτυχημένη σύνδεση

          } else {
            showMessage("error-message", "Ενώ η σύνδεση ήταν επιτυχής κάτι πήγε στραβά.Παρακάκω δοκιμάστε ξανά" , "admin-name");
          }
        },
        error: function(response) {
          var errorResponse = JSON.parse(response.responseText);
          if (errorResponse.status === "username_401") {

                showMessage("error-message", errorResponse.message, "admin-name");
                
            } else if(errorResponse.status === "password_401"){
              
              showMessage("error-message", errorResponse.message, "admin-pass");

            } else if(errorResponse.status === "not_found_404"){

              showMessage("error-message", errorResponse.message, "admin-name");

            } else if(errorResponse.status === "missing_400"){

              showMessage("error-message", errorResponse.message, "admin-name");

            } else if(errorResponse.status === "wrong_method_400"){

              showMessage("error-message", errorResponse.message, "admin-name");

            } else{
                showMessage("error-message", "Σφάλμα κατά την σύνδεση. Παρακαλώ δοκιμάστε ξανά.", "admin-name");
            }
      }
      });
    }