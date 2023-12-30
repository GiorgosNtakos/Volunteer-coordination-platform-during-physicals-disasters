"use strict";
var formData;

// * TA DO ME THN SEIRA POY LENE OI PARENTHESEIS
// TODO(MANDOTARY) Να μονταρω το γαμιδι το node.js για το module (μου εχει βγαλει την ψυχη)

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("rescuer-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      var full_name = $("#full_name").val();
      var phone = $("#phone").val();
      var street = $("#street").val();
      var number = $("#number").val();
      const town = "Πάτρα";

      // Ελέγχουμε το όνομα
      var trimmedFullName = full_name.trim();

      // Ελληνικοί χαρακτήρες και έγκυρη μορφή "Όνομα Επώνυμο"
      var greekRegex = /^[Α-ΩΆ-Ώα-ωά-όώΐϊΰύ\s]*$/u;
      var nameFormatRegex = /^[Α-ΩΆ-Ώα-ωά-όώΐϊΰύ]+\s[Α-ΩΆ-Ώα-ωά-όώΐϊΰύ]+$/u;

      if (full_name.trim() === "") {
        showMessage(
          "error-message",
          "Συμπληρώστε το πεδίο Ονομ/νυμο.",
          "#full_name"
        );
        return;
      }

      if (
        !greekRegex.test(trimmedFullName) ||
        !nameFormatRegex.test(trimmedFullName)
      ) {
        showMessage(
          "error-message",
          "Παρακαλώ εισάγετε έγκυρο Όνομα και Επίθετο με ελληνικούς μόνο χαρακτήρες.(πχ Νίκος Κούκος)",
          $("#full_name")
        );
        return;
      }

      if (!validatePhoneNumber(phone)) {
        showMessage(
          "error-message",
          "Το κινητό τηλέφωνο πρεπει να ακολουθεί τα στανταρ του ελληνικου προτυπου τηλεφωνίας(πχ. +30 69********).",
          $("#phone")
        );
        return;
      }

      //Street

      if (street.trim() === "") {
        showMessage(
          "error-message",
          "Συμπληρώστε το πεδίο Οδός.",
          $("#street")
        );
        return;
      }

      if (!greekRegex.test(street.trim())) {
        showMessage(
          "error-message",
          "Η Οδός πρέπει να περιέχει μόνο ελληνικούς χαρακτήρες.",
          $("#street")
        );
        return;
      }

      if (number.trim() === "") {
        showMessage(
          "error-message",
          "Συμπληρώστε το πεδίο Αριθμός Οδού.",
          $("#number")
        );
        return;
      }

      if (!/^\d+$/.test(number)) {
        showMessage("error-message", "Λάθος αριθμός διεύθυνσης.", $("#number"));
        // Επαναφέρουμε την τιμή στην προκαθορισμένη μορφή
        number.value = "";
      }

      console.log("Full Name:", full_name);
      console.log("Phone:", phone);
      console.log("Street:", street);
      console.log("Number:", number);
      console.log("Town:", town);

      createRescuer(full_name, phone, street, number, town);
    });
});

// ! Δεν το ενεργοποιω ακομα για να μπορω να δουλευω το live server
/*if (
  location.protocol !== "https:" ||
  window.location.hostname !== "localhost"
) {
  location.replace(
    `https://${location.hostname}${location.pathname}${location.search}`
  );
}*/

function createRescuer(full_name, phone, street, number, town) {
  console.log("Create Rescuer - Full Name:", full_name);
  console.log("Create Rescuer - Phone:", phone);
  console.log("Create Rescuer - Street:", street);
  console.log("Create Rescuer - Number:", number);
  console.log("Create Rescuer - Town:", town);

  //const transliterate = require('../../../node_modules/transliteration');

  // Σχηματίστε τη διεύθυνση από τα στοιχεία της φόρμας
  var address = street + " " + number + ", " + town;

  // Καλέστε τη συνάρτηση για να λάβετε τις συντεταγμένες από το OpenStreetMap
  getCoordinatesFromAddress(address)
    .then((coordinates) => {
      // Προετοιμασία των δεδομένων για αποστολή με τη χρήση AJAX
      formData = $("#rescuer-form").serialize();
      formData +=
        "&town=" +
        town +
        "&location_lat=" +
        coordinates.lat +
        "&location_lon=" +
        coordinates.lon;

      //var englishFullName = transliterate(full_name);
      var username = generateUsername(full_name);
      username = convertToEnglishChars(username);
      formData += "&username=" + username;

      var password = generatePassword();
      formData += "&password=" + password;

      var email = username + "@VolunteersInAction.gr";
      formData += "&email=" + email;
      console.log(formData);

      // Κλήση της συνάρτησης createRescuer στο PHP
      $.ajax({
        url: "http://localhost/webproject/Code/PHP/Admin/create_rescuer.php",
        method: "POST",
        data: formData,
        dataType: "json",
        success: function (response) {
          if (response.status === "created") {
            showMessage("success-message", response.message, $("#full_name"));
            // Εδώ μπορείτε να προσθέσετε άλλες ενέργειες μετά την επιτυχή δημιουργία
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
            window.location.href = "admin_login.html";
            showMessage(
              "error-message",
              errorResponse.message,
              $("#full_name")
            );
          } else if (errorResponse.status === "server_error") {
            showMessage(
              "error-message",
              errorResponse.message,
              $("#full_name")
            );
          } else if (errorResponse.status === "exists_phone") {
            showMessage("error-message", errorResponse.message, $("#phone"));
          } else if (errorResponse.status === "missing_400") {
            console.log("Form Data: ", formData);

            showMessage(
              "error-message",
              errorResponse.message,
              $("#full_name")
            );
          } else if (errorResponse.status === "wrong_method_405") {
            showMessage(
              "error-message",
              errorResponse.message,
              $("#full_name")
            );
          } else {
            showMessage(
              "error-message",
              errorResponse.message,
              $("#full_name")
            );
          }
        },
      });
    })
    .catch((error) => {
      showMessage(
        "error-message",
        "Σφάλμα κατά την ανάκτηση των συντεταγμένων: " + error.message,
        $("#full_name")
      );
    });
}

// Συνάρτηση για τη γεωκωδικοποίηση της διεύθυνσης χρησιμοποιώντας το OpenStreetMap
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
          $("#street")
        );
        throw new Error("Δεν βρέθηκαν συντεταγμένες για τη διεύθυνση");
      }
    });
}

function generateUsername(fullName) {
  // Μετατροπή του ονόματος σε πεζούς χαρακτήρες και αφαίρεση των κενών
  return fullName.replace(/\s/g, "_");
}

function generatePassword() {
  var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var numbers = "0123456789";
  var specialChars = "!@#$%^&*";

  var allChars = uppercase + numbers + specialChars;

  var password = "";
  var length = 8; // Μπορείτε να προσαρμόσετε το μήκος του κωδικού πρόσβασης

  for (var i = 0; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  return password;
}

function validatePhoneNumber(phone) {
  // Κανονική έκφραση για επαλήθευση του τηλεφώνου
  var phoneRegex = /^\+30\s69\d{8}$/;

  // Εάν ο αριθμός τηλεφώνου πληροί τα κριτήρια
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
