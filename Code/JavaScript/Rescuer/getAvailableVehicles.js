document.addEventListener("DOMContentLoaded", function () {
    getAvailableVehicles()

});

function getAvailableVehicles(){
    var vehiclesList = document.getElementById("vehicle_list");

    $.ajax({
        url: "../../PHP/Rescuer/get_available_vehicles.php",
        method: "GET",
        success: function (response) {
          if (response.status === "success") {
            console.log(response);
    
            var vehicles = response.vehicles;
    
            vehiclesList.innerHTML = "";
    
            vehicles.forEach(function (vehicle) {
              var row = document.createElement("tr");
    
              var nameCell = document.createElement("td");
              var decorateIcon = document.createElement("span");
              decorateIcon.innerHTML = "<i id = 'decorate' class='fa'>&#xf0d1;</i>";
              nameCell.textContent = vehicle.name;
              nameCell.appendChild(decorateIcon);
              row.appendChild(nameCell);
    
              var crewCell = document.createElement("td");
              crewCell.textContent = vehicle.crew;
              row.appendChild(crewCell);
    
              var streetCell = document.createElement("td");
              streetCell.textContent = vehicle.street;
              row.appendChild(streetCell);
    
              var numberCell = document.createElement("td");
              numberCell.textContent = vehicle.number;
              row.appendChild(numberCell);
    
              var townCell = document.createElement("td");
              townCell.textContent = vehicle.town;
              row.appendChild(townCell);
    
              var ChoiseButtonCell = document.createElement("td");
              var assignButton = document.createElement("span");
              assignButton.title = "Επιλογή Οχήματος";
              assignButton.innerHTML = "<i id='choose'class='fa'>&#xf055;</i>";
              assignButton.style.marginRight = "20px";
              assignButton.addEventListener("click", function () {
                assignvehicle(vehicle.id);
              });
              ChoiseButtonCell.appendChild(assignButton);
    
              row.appendChild(ChoiseButtonCell);
    
              vehiclesList.appendChild(row);
            });
          } else if (response.status === "success_but_empty") {
            vehiclesList.innerHTML =
              "<tr><td colspan='7'>Δεν υπάρχουν διαθέσιμα Οχήματα.</td></tr>";
            showMessage("success-message", response.message, "#vehicles_list");
          } else {
            vehiclesList.innerHTML =
              "<tr><td colspan='7'>Προέκυψε σφάλμα κατά τη φόρτωση των διαθέσιμων οχημάτων.</td></tr>";
            showMessage(
              "error-message",
              "Ενώ η ανάκτηση των διαθέσιμων οχημάτων ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.",
              "#tables_title"
            );
          }
        },
        error: function (response) {
          var errorResponse = JSON.parse(response.responseText);
    
          if (errorResponse.status === "wrong_method_405") {
            showMessage("error-message", errorResponse.message, "#tables_title");
          } else if (errorResponse.status === "server_error") {
            showMessage("error-message", errorResponse.message, "#tables_title");
          } else {
            showMessage(
              "error-message",
              "Σφάλμα κατά τη διάρκεια φόρτωσης των διαθέσιμων οχημάτων. Παρακαλώ δοκιμάστε ξανά.",
              "delete-all-button"
            );
          }
        },
      });
}

function assignvehicle(id){
  $.ajax({
    url: "../../PHP/Rescuer/assign_to_vehicle.php",
    method: "POST",
    data: {vehicle_id:id},
    success: function (response) {
      if (response.status === "success") {
        showMessage("success-message", response.message, "#tables_title");
      } else {
        showMessage(
          "error-message",
          "Ενώ η ανάθεση ήταν επιτυχής κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανα.",
          "#tables_title"
        );
      }
    },
    error: function (response) {
      var errorResponse = JSON.parse(response.responseText);
      if (errorResponse.status === "need_connection") {
        window.location.href = "login_signup.html";
        showMessage("error-message", errorResponse.message, "#tables_title");
      } else if (errorResponse.status === "wrong_method_405") {
        showMessage("error-message", errorResponse.message, "#tables_title");
      } else if (errorResponse.status === "server_error") {
        showMessage("error-message", errorResponse.message, "#tables_title");
      } else if (errorResponse.status === "missing_400") {
        showMessage("error-message", errorResponse.message, "#tables_title");
      } else if(errorResponse.status === "already_assigned"){
        showMessage("error-message", errorResponse.message, "#tables_title");
      }else {
        showMessage(
          "error-message",
          "Σφάλμα κατά την διάρκεια ανάθεση σας στο όχημα. Παρακαλώ δοκιμάστε ξανά.",
          "#deleteCategory"
        );
      }
    },

  });

}