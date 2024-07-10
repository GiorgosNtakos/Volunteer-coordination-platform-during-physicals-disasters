// // ΝΑ ΔΩ ΓΙΑΤΙ ΟΤΑΝ ΜΕ ΒΑΣΗ ΤΑ ΣΤΟΙΧΕΙΑ ΤΗΣ ΔΙΈΥΘΥΝΣΗΣ ΜΟΥ ΠΕΤΑΕΙ 2 τιμες για τα LAT και LON
//* NA ΦΤΙΑΞΩ PHP ΕΛΕΓΧΟΥ ΤΥΠΟΥ ΧΡΗΣΤΗ ΓΙΑ ΝΑ ΕΜΦΑΝΙΖΩ ΤΙΣ ΦΟΡΜΕΣ ΚΑΤΑΛΛΗΛΑ ΕΧΟΝΤΑΣ ΜΟΝΟ ΜΙΑ ΣΕΛΙΔΑ ΔΙΑΧΕΙΡΙΣΗΣ HTML ΓΙΑ ΤΗΝ ΦΟΡΜΑ
//! ΦΤΙΑΞΙΜΟ ΓΙΑ ΤΑ ΚΟΥΜΠΙΑ (ΠΟΙΑ ΝΑ ΛΕΙΤΟΥΡΓΟΥΝ ΜΕ ENTER ΚΑΙ ΠΟΙΑ ΟΧΙ)

var formData;
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Admin/form_completion.html"){
  ChangeForms();
}
  document
    .getElementById("Global_form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      var full_name = $("#full_name").val();
      var phone = $("#phone").val();
      var street = $("#street").val();
      var number = $("#number").val();
      const town = "Πάτρα";

      var trimmedFullName = full_name.trim();

      var greekRegex = /^[Α-ΩΆ-Ώα-ωά-όώΐϊΰύ\s]*$/u;
      var nameFormatRegex = /^[Α-ΩΆ-Ώα-ωά-όώΐϊΰύ]+\s[Α-ΩΆ-Ώα-ωά-όώΐϊΰύ]+$/u;

      if (window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Admin/form_completion.html"){

      console.log(checkActiveForm())
      if (full_name.trim() === "" && (!checkActiveForm())) {
        showMessage(
          "error-message",
          "Συμπληρώστε το πεδίο Όνομα Όχηματος.",
          "#full_name"
        );
        return;
      } else if (full_name.trim() === "" && checkActiveForm()) {
        showMessage(
          "error-message",
          "Συμπληρώστε το πεδίο Ονομ/νυμο.",
          "#full_name"
        );
        return;
      }

      if (
        (!greekRegex.test(trimmedFullName) ||
        !nameFormatRegex.test(trimmedFullName) ) && checkActiveForm()
      ) {
        showMessage(
          "error-message",
          "Παρακαλώ εισάγετε έγκυρο Όνομα και Επίθετο με ελληνικούς μόνο χαρακτήρες.(πχ Νίκος Κούκος)",
          "#full_name"
        );
        return;
      }

      if (!validatePhoneNumber(phone) && checkActiveForm()) {
        showMessage(
          "error-message",
          "Το κινητό τηλέφωνο πρεπει να ακολουθεί τα στανταρ του ελληνικου προτυπου τηλεφωνίας(πχ. +30 69********).",
          "#phone"
        );
        return;
      }
     }

     if (window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/User/personal_info_form.html"){

     if (full_name.trim() === "") {
      showMessage(
        "error-message",
        "Συμπληρώστε το πεδίο Ονομ/νυμο.",
        "#full_name"
      );
      return;
    }

    if (
      (!greekRegex.test(trimmedFullName) ||
      !nameFormatRegex.test(trimmedFullName) )
    ) {
      showMessage(
        "error-message",
        "Παρακαλώ εισάγετε έγκυρο Όνομα και Επίθετο με ελληνικούς μόνο χαρακτήρες.(πχ Νίκος Κούκος)",
        "#full_name"
      );
      return;
    }

    if (!validatePhoneNumber(phone)) {
      showMessage(
        "error-message",
        "Το κινητό τηλέφωνο πρεπει να ακολουθεί τα στανταρ του ελληνικου προτυπου τηλεφωνίας(πχ. +30 69********).",
        "#phone"
      );
      return;
    }
    }


      if (street.trim() === "") {
        showMessage("error-message", "Συμπληρώστε το πεδίο Οδός.", "#street");
        return;
      }

      if (!greekRegex.test(street.trim())) {
        showMessage(
          "error-message",
          "Η Οδός πρέπει να περιέχει μόνο ελληνικούς χαρακτήρες.",
          "#street"
        );
        return;
      }

      if (number.trim() === "") {
        showMessage(
          "error-message",
          "Συμπληρώστε το πεδίο Αριθμός Οδού.",
          "#number"
        );
        return;
      }

      if (!/^\d+$/.test(number)) {
        showMessage("error-message", "Λάθος αριθμός διεύθυνσης.", "#number");
        $("#number").val('');
        return;
      }

      console.log("Full Name:", full_name);
      console.log("Phone:", phone);
      console.log("Street:", street);
      console.log("Number:", number);
      console.log("Town:", town);

        createForm(full_name, phone, street, number, town);

    });
});


function createForm(full_name, phone, street, number, town) {
  console.log("Create Rescuer - Full Name:", full_name);
  console.log("Create Rescuer - Phone:", phone);
  console.log("Create Rescuer - Street:", street);
  console.log("Create Rescuer - Number:", number);
  console.log("Create Rescuer - Town:", town);


  var address = street + " " + number + ", " + town;

  getCoordinatesFromAddress(address)
    .then((coordinates) => {
    if(window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Admin/form_completion.html"){
      if (checkActiveForm()) {
        formData = $("#Global_form").serialize();
      } else {
        // Είμαστε στη φόρμα του οχήματος, αποκλείουμε το πεδίο τηλεφώνου από τη σειριοποίηση
        formData = $("#Global_form").find("input, select, textarea").not("#phone").serialize();
      }
    } else {
      formData = $("#Global_form").serialize();
    }
      formData +=
        "&town=" +
        town +
        "&location_lat=" +
        coordinates.lat +
        "&location_lon=" +
        coordinates.lon;

      // Κλήση της συνάρτησης createRescuer στο PHP
      if (window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Admin/form_completion.html" && checkActiveForm()) {


        var username = generateUsername(full_name);
        username = convertToEnglishChars(username);
        formData += "&username=" + username;
      
        var password = generatePassword();
        formData += "&password=" + password;
      
        var email = username + "@VolunteersInAction.gr";
        formData += "&email=" + email;
        console.log(formData);

      $.ajax({
        url: "../../PHP/Admin/create_rescuer.php",
        method: "POST",
        data: formData,
        dataType: "json",
        success: function (response) {
          if (response.status === "created") {
            showMessage("success-message", response.message, "#full_name");
          } else {
            showMessage(
              "error-message",
              "Ενώ η εγγραφή ήταν επιτυχής κάτι πήγε στραβά.Παρακακλώ δοκιμάστε ξανά",
              "full_name"
            );
          }
        },
        error: function (response) {
          var errorResponse = JSON.parse(response.responseText);

          if (errorResponse.status === "need_connection") {
            window.location.href = "login_signup.html";
            showMessage("error-message", errorResponse.message, "#full_name");
          } else if (errorResponse.status === "server_error") {
            showMessage("error-message", errorResponse.message, "#full_name");
          } else if (errorResponse.status === "exists_phone") {
            showMessage("error-message", errorResponse.message, "#phone");
          } else if (errorResponse.status === "missing_400") {
            console.log("Form Data: ", formData);

            showMessage("error-message", errorResponse.message, "#full_name");
          } else if (errorResponse.status === "wrong_method_405") {
            showMessage("error-message", errorResponse.message, "#full_name");
          } else {
            showMessage("error-message", errorResponse.message, "#full_name");
          }
        },
      });
    } else if(window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Admin/form_completion.html" && (!checkActiveForm())){

    $.ajax({
      url: "../../PHP/Admin/create_vehicle.php",
      method: "POST",
      data: formData,
      dataType: "json",
      success: function (response) {
        if (response.status === "created") {
          showMessage("success-message", response.message, "#full_name");
        } else {
          showMessage(
            "error-message",
            "Ενώ η εγγραφή ήταν επιτυχής κάτι πήγε στραβά.Παρακακλώ δοκιμάστε ξανά",
            "full_name"
          );
        }
      },
      error: function (response) {
        var errorResponse = JSON.parse(response.responseText);

        if (errorResponse.status === "need_connection") {
          window.location.href = "login_signup.html";
          showMessage("error-message", errorResponse.message, "#full_name");
        } else if (errorResponse.status === "server_error") {
          showMessage("error-message", errorResponse.message, "#full_name");
        } else if (errorResponse.status === "exists_phone") {
          showMessage("error-message", errorResponse.message, "#phone");
        } else if (errorResponse.status === "missing_400") {
          console.log("Form Data: ", formData);

          showMessage("error-message", errorResponse.message, "#full_name");
        } else if (errorResponse.status === "wrong_method_405") {
          showMessage("error-message", errorResponse.message, "#full_name");
        } else {
          showMessage("error-message", errorResponse.message, "#full_name");
        }
      },
    });

    } else if(window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/User/personal_info_form.html"){
      $.ajax({
        url: "../../PHP/User/personal_info_form.php",
        method: "POST",
        data: formData,
        dataType: "json",
        success: function (response) {
          if (response.status === "updated") {
            showMessage("success-message", response.message, "#full_name");
            window.location.href =
            "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Global/index_page.html";
          } else {
            showMessage(
              "error-message",
              "Ενώ η εγγραφή των προσωπικών σας στοιχείων ήταν επιτυχής κάτι πήγε στραβά.Παρακακλώ δοκιμάστε ξανά",
              "full_name"
            );
          }
        },
        error: function (response) {
          var errorResponse = JSON.parse(response.responseText);

          if (errorResponse.status === "need_connection") {
            window.location.href = "login_signup.html";
            showMessage("error-message", errorResponse.message, "#full_name");
          } else if (errorResponse.status === "server_error") {
            showMessage("error-message", errorResponse.message, "#full_name");
          } else if (errorResponse.status === "exists_phone") {
            showMessage("error-message", errorResponse.message, "#phone");
          } else if (errorResponse.status === "missing_400") {
            console.log("Form Data: ", formData);

            showMessage("error-message", errorResponse.message, "#full_name");
          } else if (errorResponse.status === "wrong_method_405") {
            showMessage("error-message", errorResponse.message, "#full_name");
          } else {
            showMessage("error-message", errorResponse.message, "#full_name");
          }
        },
      });
    }
    })
    .catch((error) => {
      showMessage(
        "error-message",
        "Σφάλμα κατά την ανάκτηση των συντεταγμένων: " + error.message,
        "#full_name"
      );
    });
}

function getCoordinatesFromAddress(address) {
  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      } else {
        showMessage(
          "error-message",
          "Δεν βρέθηκαν συντεταγμένες για τη διεύθυνση",
          "#street"
        );
        throw new Error("Δεν βρέθηκαν συντεταγμένες για τη διεύθυνση");
      }
    });
}

function generateUsername(fullName) {
  return fullName.replace(/\s/g, "_");
}

function generatePassword() {
  var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var numbers = "0123456789";
  var specialChars = "!@#$%^&*";

  var allChars = uppercase + numbers + specialChars;

  var password = "";
  var length = 8;

  for (var i = 0; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  return password;
}

function validatePhoneNumber(phone) {
  var phoneRegex = /^\+30\s69\d{8}$/;

  return phoneRegex.test(phone);
}

function convertToEnglishChars(username) {
  const greekCharsLower = {
    α: "a",
    ά: "a",
    β: "b",
    γ: "g",
    δ: "d",
    ε: "e",
    έ: "e",
    ζ: "z",
    η: "i",
    ή: "i",
    θ: "th",
    ι: "i",
    ί: "i",
    ϊ: "i",
    ΐ: "i",
    κ: "k",
    λ: "l",
    μ: "m",
    ν: "n",
    ξ: "x",
    ο: "o",
    ό: "o",
    π: "p",
    ρ: "r",
    σ: "s",
    ς: "s",
    τ: "t",
    υ: "y",
    ύ: "y",
    ϋ: "y",
    ΰ: "y",
    φ: "f",
    χ: "ch",
    ψ: "ps",
    ω: "o",
    ώ: "o",
  };

  const greekCharsUpper = {};
  for (const key in greekCharsLower) {
    greekCharsUpper[key.toUpperCase()] = greekCharsLower[key].toUpperCase();
  }

  const greekChars = { ...greekCharsLower, ...greekCharsUpper };

  return username
    .split("")
    .map((char) => (greekChars[char] !== undefined ? greekChars[char] : char))
    .join("");
}

function ChangeForms(){
  document.getElementById("toggleForm").addEventListener("click", function() {
      var rescuerFields = document.getElementById("rescuerFields");
      var fullNameLabel = document.querySelector("label[for='full_name']");
      var fullNameInput = document.getElementById("full_name");
      var streetInput = document.getElementById("street");
      var numberInput = document.getElementById("number");
      var phoneInput = document.getElementById("phone");
      var submitFormButton = document.getElementById("submitForm");
      var toggleFormButton = document.getElementById("toggleForm");

      fullNameInput.value = "";
      streetInput.value = "";
      numberInput.value = "";
      phoneInput.value = "+30 "; 

      if (toggleFormButton.textContent === "Φόρμα Προσθήκης Νέου Οχήματος") {
          rescuerFields.style.display = "none";
          fullNameLabel.textContent = "Όνομα Οχήματος:";
          fullNameInput.placeholder = "Όνομα Οχήματος";
          submitFormButton.textContent = "Προσθήκη Νέου Οχήματος";
          toggleFormButton.textContent = "Φόρμα Προσθήκης Νέου Διασώστη";

      } else {
        rescuerFields.style.display = "block";
        fullNameLabel.textContent = "Ονομ/νυμο:";
        fullNameInput.placeholder = "Ονομ/νυμο";
        submitFormButton.textContent = "Δημιουργία Λογαριασμού Διασώστη";
        toggleFormButton.textContent = "Φόρμα Προσθήκης Νέου Οχήματος";
      }
      });
  }

if (window.location.href === "http://localhost/Collaborative-product-search-platform-of-wide-consumption/Code/HTML/Admin/form_completion.html"){
  function checkActiveForm()
  {
    var phoneFieldDisplay = document.getElementById("rescuerFields").style.display;
    var isActiveRescuerForm = phoneFieldDisplay !== "none";
    return isActiveRescuerForm;
  }
}