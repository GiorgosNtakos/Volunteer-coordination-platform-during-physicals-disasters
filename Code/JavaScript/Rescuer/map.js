"use strict";
import { updateTaskPanel } from "./task_panel.js";

let map;
let unassignedtaskMarkers = [];
let assignedtaskMarkers = [];
let polylineLayers = [];

$(document).ready(function () {
  initializeMap();
});

function initializeMap() {
  // Create the map object
  map = L.map("map").setView([38.246242, 21.7350847], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  // Check if the user is signed in
  if (isUserSignedIn()) {
    fetchMapData(); // Fetch and display map data
  } else {
    console.log("User is not signed in.");
  }
}

function isUserSignedIn() {
  let signedIn = false;
  $.ajax({
    url: "../../PHP/Global/check_session.php",
    method: "GET",
    async: false, // Make the request synchronous
    success: function (response) {
      if (response.status === "success") {
        signedIn = true;
      }
    },
    error: function () {
      signedIn = false;
    },
  });
  return signedIn;
}

function fetchMapData() {
  $.ajax({
    url: "../../PHP/Rescuer/get_map_data.php",
    method: "GET",
    dataType: "json",
    success: function (response) {
      if (response.status === "success") {
        const { rescuer, base, unassignedTasks, assignedTasks } = response;

        console.log("Rescuer:", rescuer);
        console.log("Base:", base);
        console.log("Unassigned Tasks:", unassignedTasks);
        console.log("Assigned Tasks:", assignedTasks);

        // Validate rescuer's location
        if (rescuer.location_lat && rescuer.location_lon) {
          var marker = L.marker([rescuer.location_lat, rescuer.location_lon], {
            icon: L.icon({
              iconUrl: "../../../upload_img/vehicle_marker.png",
              iconSize: [45, 45],
              iconAnchor: [17, 35],
              popupAnchor: [0, -35],
            }),
            draggable: true,
          }).addTo(map).bindPopup(`
                    <div class="popup-content">
                        <div class="popup-title">Όχημα ${rescuer.name}</div>
                        <div class="popup-info"><strong>Διεύθυνση:</strong> ${rescuer.street} ${rescuer.number}, ${rescuer.town}</div>
                        <div class="popup-info"><strong>Συνολικό Πλήρωμα:</strong> ${rescuer.assigned_rescuers}</div>
                        <div class="popup-info"><strong>Ενεργά Tasks:</strong> ${rescuer.assigned_tasks}</div>
                    </div>`);
        } else {
          console.error("Invalid rescuer coordinates");
        }

        marker.on("dragend", function (e) {
          var newPos = marker.getLatLng();
          var confirmChange = confirm(
            "Επιβεβαίωση αλλαγής τοποθεσίας του οχήματος σε: " +
              newPos.lat +
              ", " +
              newPos.lng +
              ";"
          );
          if (confirmChange) {
            // Κάνουμε reverse geocoding για να βρούμε τη διεύθυνση από τις συντεταγμένες
            var geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}&zoom=18&addressdetails=1`;
            $.ajax({
              url: geocodingUrl,
              method: "GET",
              success: function (geoResponse) {
                var street = geoResponse.address.road || "";
                var number = geoResponse.address.house_number || "";
                var town =
                  geoResponse.address.town || geoResponse.address.city || "";

                // Ενημερώνουμε τη βάση με τη νέα τοποθεσία και διεύθυνση
                $.ajax({
                  url: "../../PHP/Rescuer/change_vehicle_address.php",
                  method: "POST",
                  data: {
                    location_lat: newPos.lat,
                    location_lon: newPos.lng,
                    street: street,
                    number: number,
                    town: town,
                  },
                  success: function (response) {
                    console.log(response.message);
                  },
                  error: function (xhr, status, error) {
                    console.error(
                      "An error occurred updating the warehouse location: " +
                        status +
                        ", " +
                        error
                    );
                  },
                });
              },
              error: function (xhr, status, error) {
                console.error(
                  "An error occurred with the geocoding request: " +
                    status +
                    ", " +
                    error
                );
              },
            });
          } else {
            // Επαναφέρετε το marker στην αρχική του θέση εάν ο χρήστης ακυρώσει την αλλαγή
            baseMarker
              .setLatLng([
                response.cordinates.location_lat,
                response.cordinates.location_lon,
              ])
              .update();
          }
        });

        // Validate base location
        if (base.location_lat && base.location_lon) {
          L.marker([base.location_lat, base.location_lon], {
            icon: L.icon({
              iconUrl: "../../../upload_img/base_marker.png",
              iconSize: [45, 45],
              iconAnchor: [17, 35],
              popupAnchor: [0, -35],
            }),
          }).addTo(map).bindPopup(`<div class="popup-content">
                    <div class="popup-title">Κεντρική Αποθήκη</div>
                    <div class="popup-info"><strong>Διεύθυνση:</strong> ${base.street} ${base.number}, ${base.town}</div>
                    </div>`);
        } else {
          console.error("Invalid base coordinates");
        }

        // Display unassigned tasks
        unassignedTasks.forEach((task) => {
          if (task.location_lat && task.location_lon) {
            const iconUrl =
              task.type === "Offer"
                ? "../../../upload_img/offer_pending.png"
                : "../../../upload_img/request_pending.png";
            var taskPopupContent = `<div class="popup-content">
                            <div class="popup-title">${task.full_name}</div>
                            <div class="popup-info"><strong>Τηλέφωνο:</strong> ${
                              task.phone
                            }</div>
                            <div class="popup-info"><strong>Διεύθυνση:</strong> ${
                              task.street
                            } ${task.number}, ${task.town}</div>
                            <div class="popup-info"><strong>Είδος: </strong> ${
                              task.item_name
                            }</div>
                            <div class="popup-info"><strong>Ποσότητα Είδους:</strong> ${
                              task.quantity
                            }</div>
                            <div class="popup-info"><strong>Ημερομηνία Καταχώρησης:</strong> ${formatDateIntl(
                              task.created_at
                            )}</div>`;

            if (task.status === "accepted") {
              taskPopupContent += `<div class="popup-info"><strong>Όνομα Οχήματος:</strong> ${
                task.vehicle_name
              }</div>
                                  <div class="popup-info"><strong>Ημερομηνία Ανάληψης:</strong> ${formatDateIntl(
                                    task.updated_at
                                  )}</div>`;
            } else {
              taskPopupContent += `<div class="popup-info"><strong>Κατάσταση:</strong> Δεν έχει αναληφθεί ακόμα</div>`;
            }
            taskPopupContent += `<button onclick="undertakeTask('${task.id}', '${task.type}')">Ανάληψη Καθήκοντος</button>`;
            taskPopupContent += `</div>`;
            let unassignedtaskMarker = L.marker(
              [task.location_lat, task.location_lon],
              {
                icon: L.icon({
                  iconUrl: iconUrl,
                  iconSize: [45, 45],
                  iconAnchor: [17, 35],
                  popupAnchor: [0, -35],
                }),
                type: task.type,
              }
            )
              .addTo(map)
              .bindPopup(taskPopupContent);
            unassignedtaskMarkers.push(unassignedtaskMarker);
          } else {
            console.error("Invalid unassigned task coordinates", task);
          }
        });

        // Display assigned tasks and connect with lines
        assignedTasks.forEach((task) => {
          if (
            task.location_lat &&
            task.location_lon &&
            rescuer.location_lat &&
            rescuer.location_lon
          ) {
            console.log("Processing task:", task);
            const iconUrl =
              task.type === "Offer"
                ? "../../../upload_img/offer_accepted.png"
                : "../../../upload_img/request_accepted.png";
            const taskPopupContent = `<div class="popup-content">
                        <div class="popup-title">${task.full_name}</div>
                        <div class="popup-info"><strong>Τηλέφωνο:</strong> ${
                          task.phone
                        }</div>
                        <div class="popup-info"><strong>Διεύθυνση:</strong> ${
                          task.street
                        } ${task.number}, ${task.town}</div>
                        <div class="popup-info"><strong>Είδος: </strong> ${
                          task.item_name
                        }</div>
                        <div class="popup-info"><strong>Ποσότητα Είδους:</strong> ${
                          task.quantity
                        }</div>
                        <div class="popup-info"><strong>Ημερομηνία Καταχώρησης:</strong> ${formatDateIntl(
                          task.created_at
                        )}</div>
                        <div class="popup-info"><strong>Ημερομηνία Ανάληψης:</strong> ${formatDateIntl(
                          task.accepted_at
                        )}</div>`;
            let assignedtaskMarker = L.marker(
              [task.location_lat, task.location_lon],
              {
                icon: L.icon({
                  iconUrl: iconUrl,
                  iconSize: [45, 45],
                  iconAnchor: [17, 35],
                  popupAnchor: [0, -35],
                }),
                type: task.type,
              }
            )
              .addTo(map)
              .bindPopup(taskPopupContent);
            assignedtaskMarkers.push(assignedtaskMarker);

            // Draw line between rescuer's vehicle and task location
            const polylineLayer = L.polyline(
              [
                [rescuer.location_lat, rescuer.location_lon],
                [task.location_lat, task.location_lon],
              ],
              {
                color: "green",
                weight: 3,
                opacity: 0.7,
                smoothFactor: 1,
              }
            ).addTo(map);
            polylineLayers.push(polylineLayer);
          } else {
            console.error("Invalid assigned task coordinates", task);
          }
        });

        // Update the task panel
        updateTaskPanel(assignedTasks);
      } else {
        console.error("Error fetching map data:", response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error(
        "Error fetching map data:",
        status,
        error,
        xhr.responseText
      );
    },
  });
}

window.undertakeTask = function (taskId, taskType) {
  console.log(
    "undertakeTask function called with Task ID:",
    taskId,
    "and Task Type:",
    taskType
  );

  $.ajax({
    url: "../../PHP/Rescuer/undertake_task.php",
    method: "POST",
    data: {
      task_id: taskId,
      task_type: taskType,
    },
    success: function (response) {
      if (response.status === "success") {
        alert("Task successfully undertaken!");
        fetchMapData();
      } else {
        alert("Failed to undertake task: " + response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error undertaking task:", status, error, xhr.responseText);
    },
  });
};

window.completeTask = function (taskId) {
  $.ajax({
    url: "../../PHP/Rescuer/complete_task.php",
    method: "POST",
    data: { task_id: taskId },
    dataType: "json", // Expect JSON response
    success: function (response) {
      console.log("Server response:", response); // Log the server response for debugging
      if (response.status === "success") {
        alert("Task successfully completed!");
        fetchMapData();
      } else {
        alert("Failed to complete task: " + response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error completing task:", status, error, xhr.responseText);
      alert("Failed to complete task: " + error);
    },
  });
};

window.cancelTask = function (taskId) {
  console.log("cancelTask function called with Task ID:", taskId);

  $.ajax({
    url: "../../PHP/Rescuer/cancel_task.php",
    method: "POST",
    data: {
      task_id: taskId,
    },
    success: function (response) {
      if (response.status === "success") {
        alert("Task successfully cancelled!");
        fetchMapData();
      } else {
        alert("Failed to cancel task: " + response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error cancelling task:", status, error, xhr.responseText);
    },
  });
};

function formatDateIntl(dateStr) {
  const dateObj = new Date(dateStr); // Δημιουργία ενός αντικειμένου Date από τη συμβολοσειρά
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
}

export {
  map,
  polylineLayers,
  unassignedtaskMarkers,
  assignedtaskMarkers,
  fetchMapData,
};
