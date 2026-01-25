//! NA FTIAKSO SWSTA RA RESETS STO CARGO PAGE ME TA FILTRA

document.addEventListener("DOMContentLoaded", function () {
  var numberPattern = /^[1-9]\d*$/;
  const unloadButton = document.getElementById("unload-vehicle-cargo");
  const AddItemInCargo = document.getElementById("add-stock-form");
  const removeStockCargo = document.getElementById("remove-stock-form");

  unloadButton.addEventListener("click", function () {
    unloadAllCargo();
  });

  AddItemInCargo.addEventListener("submit", function (event) {
    event.preventDefault();

    var itemQuantity = document.getElementById("a_quantity").value;

    if (itemQuantity.trim() === "") {
      showMessage(
        "error-message",
        "Παρακαλώ εισάγετε την ποσότητα του είδους.",
        "#a_quantity"
      );
      return;
    }

    if (!numberPattern.test(itemQuantity)) {
      showMessage(
        "error-message",
        "Η ποσότητα πρέπει να είναι ακέραια και οχι αρνητική.",
        "#a_quantity"
      );
      return;
    }

    addItemInCargo(itemQuantity);
  });

  removeStockCargo.addEventListener("submit", function (event) {
    event.preventDefault();

    var removeQuantity = document.getElementById("r_quantity").value;

    if (removeQuantity.trim() === "") {
      showMessage(
        "error-message",
        "Παρακαλώ εισάγετε την ποσότητα του είδους.",
        "#r_quantity"
      );
      return;
    }

    if (!numberPattern.test(removeQuantity)) {
      showMessage(
        "error-message",
        "Η ποσότητα πρέπει να είναι ακέραια και οχι αρνητική.",
        "#r_quantity"
      );
      return;
    }

    removeStockItem(removeQuantity);
    updateItemsBasedOnCategoryAndSearch();
  });

});

function getitemInformation(itemName) {
    $.ajax({
      url: "../../PHP/Admin/get_item_info.php",
      method: "GET",
      data: { itemName: itemName },
      success: function (response) {
        if (response.status === "success") {
          document.getElementById("a_name").readOnly = false;
          document.getElementById("a_name").value = response.item_info.name;
          document.getElementById("a_quantity").value = response.item_info.quantity;
          document.getElementById("a_name").readOnly = true;
          showMessage("success-message", response.message, "#add-stock-form");
        } else if (response.status === "success_but_empty") {
          showMessage("success-message", response.message, "#add-stock-form");
        } else {
          showMessage(
            "error-message",
            "Ενώ η ανάκτηση πληροφοριών του είδους ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
            "#add-stock-form"
          );
        }
      },
      error: function (response) {
        var errorResponse = JSON.parse(response.responseText);
  
        if (errorResponse.status === "wrong_method_405") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#add-stock-form"
          );
        } else if (errorResponse.status === "server_error") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#add-stock-form"
          );
        } else if (errorResponse.status === "missing_400") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#add-stock-form"
          );
        } else {
          showMessage(
            "error-message",
            "Προέκυψε σφάλμα κατά την ανάκτηση πληροφοριών του είδους. Παρακαλώ δοκιμάστε ξανά.",
            "#items-list"
          );
        }
      },
    });
  }

  function getVehicleitemInformation(itemName) {
    $.ajax({
      url: "../../PHP/Rescuer/get_vehicle_item_info.php",
      method: "GET",
      data: { itemName: itemName },
      success: function (response) {
        if (response.status === "success") {
          document.getElementById("r_name").readOnly = false;
          document.getElementById("r_name").value = response.item_info.name;
          document.getElementById("r_quantity").value = response.item_info.quantity;
          document.getElementById("r_name").readOnly = true;
          showMessage("success-message", response.message, "#remove-stock-form");
        } else if (response.status === "success_but_empty") {
          showMessage("success-message", response.message, "#remove-stock-form");
        } else {
          showMessage(
            "error-message",
            "Ενώ η ανάκτηση πληροφοριών του είδους ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
            "#remove-stock-form"
          );
        }
      },
      error: function (response) {
        var errorResponse = JSON.parse(response.responseText);
  
        if (errorResponse.status === "wrong_method_405") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#remove-stock-form"
          );
        } else if (errorResponse.status === "server_error") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#remove-stock-form"
          );
        } else if (errorResponse.status === "vehicle_not_found") {
            showMessage(
              "error-message",
              errorResponse.message,
              "#remove-stock-form"
            );
          } else if (errorResponse.status === "need_connection") {
            showMessage(
              "error-message",
              errorResponse.message,
              "#remove-stock-form"
            );
          }  else if (errorResponse.status === "missing_400") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#remove-stock-form"
          );
        } else {
          showMessage(
            "error-message",
            "Προέκυψε σφάλμα κατά την ανάκτηση πληροφοριών του είδους. Παρακαλώ δοκιμάστε ξανά.",
            "#items-list"
          );
        }
      },
    });
  }

  function isInDistance(){
    return new Promise((resolve, reject) => {
    $.ajax({
        url: "../../PHP/Rescuer/distance_VW.php",
        method: "GET",
        success: function (response) {
          if (response.status === "success") {
            resolve(response.distance <= 100);
          } else if (response.status === "too_far"){
            resolve(false);
          }
        },
        error: function (response) {
          var errorResponse = JSON.parse(response.responseText);
          reject(new Error(errorResponse.message));

        },
      });
    });
    }

    function unloadAllCargo(){
      isInDistance().then(isClose => {
        if(isClose) {
      $.ajax({
        url: "../../PHP/Rescuer/unload_all_cargo.php",
        method: "DELETE",
        success: function (response) {
          if (response.status === "success") {
            showMessage(
              "success-message",
              response.message,
              "#items-list"
            );
          } else if(response.status === "cargo_empty"){
            showMessage(
              "success-message",
              response.message,
              "#items-list"
            );
          } else{
            showMessage(
              "error-message",
              "Ενώ ήταν επιτυχής η διαδικασία προέκυψε κάκοιο σφάλμα. Παρακαλώ δοκιμάστε ξανά.",
              "#items-list"
            );
          }
        },
        error: function (response) {
          var errorResponse = JSON.parse(response.responseText);

          if (errorResponse.status === "wrong_method_405") {
            showMessage(
              "error-message",
              errorResponse.message,
              "#items-list"
            );
          } else if (errorResponse.status === "server_error") {
            showMessage(
              "error-message",
              errorResponse.message,
              "#items-list"
            );
          } else if (errorResponse.status === "vehicle_not_found") {
              showMessage(
                "error-message",
                errorResponse.message,
                "#items-list"
              );
            } else if (errorResponse.status === "need_connection") {
              showMessage(
                "error-message",
                errorResponse.message,
                "#items-list"
              );
            }  else {
            showMessage(
              "error-message",
              "Προέκυψε σφάλμα κατά την διαδικασία. Παρακαλώ δοκιμάστε ξανά.",
              "#items-list"
            );
          }
        },
      });
    } else{
      showMessage(
        "error-message",
        "Το όχημα δεν βρίσκεται σε ακτίνα 100 μέτρων από την Βάση/Αποθήκη.",
        "#items-list"
    );
   }
 }).catch(error =>{
  console.error("Σφάλμα κατά τον έλεγχο της απόστασης", error);
 });
}

function addItemInCargo(quantity){
  isInDistance().then(isClose => {
    if(isClose) {
  $.ajax({
    url: "../../PHP/Rescuer/add_items_quantity.php",
    method: "POST",
    data:{quantity : quantity},
    success: function (response) {
      if (response.status === "success") {
        showMessage(
          "success-message",
          response.message,
          "#add-stock-form"
        );
      } else{
        showMessage(
          "error-message",
          "Ενώ ήταν επιτυχής η διαδικασία προέκυψε κάκοιο σφάλμα. Παρακαλώ δοκιμάστε ξανά.",
          "#add-stock-form"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#add-stock-form"
        );
      } else if (errorResponse.status === "server_error") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#add-stock-form"
        );
      } else if (errorResponse.status === "vehicle_not_found") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#add-stock-form"
          );
        } else if (errorResponse.status === "noSuch_quantity") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#add-stock-form"
          );
        }  else if (errorResponse.status === "missing_400") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#add-stock-form"
          );
        } else if (errorResponse.status === "need_connection") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#add-stock-form"
          );
        }  else {
        showMessage(
          "error-message",
          "Προέκυψε σφάλμα κατά την διαδικασία. Παρακαλώ δοκιμάστε ξανά.",
          "#add-stock-form"
        );
      }
    },
  });
} else{
  showMessage(
    "error-message",
    "Το όχημα δεν βρίσκεται σε ακτίνα 100 μέτρων από την Βάση/Αποθήκη.",
    "#items-list"
);
}
}).catch(error =>{
console.error("Σφάλμα κατά τον έλεγχο της απόστασης", error);
});
}

function removeStockItem(quantity){
  isInDistance().then(isClose => {
    if(isClose) {
  $.ajax({
    url: "../../PHP/Rescuer/remove_stock_items.php",
    method: "POST",
    data:{quantity : quantity},
    success: function (response) {
      if (response.status === "success") {
        showMessage(
          "success-message",
          response.message,
          "#remove-stock-form"
        );
      } else{
        showMessage(
          "error-message",
          "Ενώ ήταν επιτυχής η διαδικασία προέκυψε κάκοιο σφάλμα. Παρακαλώ δοκιμάστε ξανά.",
          "#remove-stock-form"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);

      if (errorResponse.status === "wrong_method_405") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#remove-stock-form"
        );
      } else if (errorResponse.status === "server_error") {
        showMessage(
          "error-message",
          errorResponse.message,
          "#remove-stock-form"
        );
      } else if (errorResponse.status === "vehicle_not_found") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#remove-stock-form"
          );
        } else if (errorResponse.status === "noSuch_quantity") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#remove-stock-form"
          );
        } else if (errorResponse.status === "need_connection") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#remove-stock-form"
          );
        } else if (errorResponse.status === "missing_400") {
          showMessage(
            "error-message",
            errorResponse.message,
            "#remove-stock-form"
          );
        } else {
        showMessage(
          "error-message",
          "Προέκυψε σφάλμα κατά την διαδικασία. Παρακαλώ δοκιμάστε ξανά.",
          "#remove-stock-form"
        );
      }
    },
  });
} else{
  showMessage(
    "error-message",
    "Το όχημα δεν βρίσκεται σε ακτίνα 100 μέτρων από την Βάση/Αποθήκη.",
    "#items-list"
);
}
}).catch(error =>{
console.error("Σφάλμα κατά τον έλεγχο της απόστασης", error);
});
}
