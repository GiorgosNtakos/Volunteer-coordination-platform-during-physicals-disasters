"use strict";

let map;
let vehicleMarkers = [];
let offerMarkers = [];
let requestMarkers = [];
let polylineLayers = [];


$(document).ready(function() {
    initializeMap();
    setupDataLayers();
});

function initializeMap() {
    // Δημιουργία του map object
    map = L.map('map').setView([38.246242, 21.7350847], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
}

function setupDataLayers() {
    // Κλήσεις συναρτήσεων για τη φόρτωση δεδομένων στον χάρτη
    fetchAndDisplayBase();
    displayPendingOffers();
    displayPendingRequests();
}

// Συνάρτηση για την ανάκτηση και εμφάνιση της βάσης
function fetchAndDisplayBase() {
    $.ajax({
        url: "../../PHP/Global/get_warehouse_adress.php",
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                var baseIcon = L.icon({
                    iconUrl: '../../../upload_img/base_marker.png',
                    iconSize: [50, 50],
                    iconAnchor: [25, 50],
                    popupAnchor: [0, -50]
                });

                var baseMarker = L.marker([response.cordinates.location_lat, response.cordinates.location_lon], {icon: baseIcon, draggable: 'true'}).addTo(map)
                    .bindPopup("Όνομα: Κεντρική Αποθήκη" + "<br>Διεύθυνση: " + response.cordinates.street + " " + response.cordinates.number + " " + response.cordinates.town);

                    fetchAndDisplayVehicles(map);

                    baseMarker.on('dragend', function(e) {
                        var newPos = baseMarker.getLatLng();
                        var confirmChange = confirm("Επιβεβαίωση αλλαγής τοποθεσίας της βάσης σε: " + newPos.lat + ", " + newPos.lng + ";");
    
                        if (confirmChange) {
                                
                            // Κάνουμε reverse geocoding για να βρούμε τη διεύθυνση από τις συντεταγμένες
                                var geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}&zoom=18&addressdetails=1`;

                                $.ajax({
                                    url: geocodingUrl,
                                    method: "GET",
                                    success: function(geoResponse) {
                                        var street = geoResponse.address.road || '';
                                        var number = geoResponse.address.house_number || '';
                                        var town = geoResponse.address.town || geoResponse.address.city || '';

                                        // Ενημερώνουμε τη βάση με τη νέα τοποθεσία και διεύθυνση
                                        $.ajax({
                                            url: "../../PHP/Admin/change_warehouse_adress.php",
                                            method: "POST",
                                            data: {
                                                location_lat: newPos.lat,
                                                location_lon: newPos.lng,
                                                street: street,
                                                number: number,
                                                town: town
                                            },
                                            success: function(response) {
                                                console.log(response.message);
                                            },
                                            error: function(xhr, status, error) {
                                                console.error("An error occurred updating the warehouse location: " + status + ", " + error);
                                            }
                                        });
                                    },
                                    error: function(xhr, status, error) {
                                        console.error("An error occurred with the geocoding request: " + status + ", " + error);
                                    }
                                });
                        } else {
                            // Επαναφέρετε το marker στην αρχική του θέση εάν ο χρήστης ακυρώσει την αλλαγή
                            baseMarker.setLatLng([response.cordinates.location_lat, response.cordinates.location_lon]).update();
                        }
                    });

                // Αφού φορτώσει η βάση, φορτώνουμε τα οχήματα
            } else {
                console.log(response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("An error occurred: " + status + ", " + error);
        }
    });
}

// Συνάρτηση για την ανάκτηση και εμφάνιση των οχημάτων
function fetchAndDisplayVehicles() {
    $.ajax({
        url: "../../PHP/Global/get_all_vehicles.php",
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                response.vehicles.forEach(function(vehicle) {
                    var vehicleIcon = L.icon({
                        iconUrl: '../../../upload_img/vehicle_marker.png',
                        iconSize: [45, 45],
                        iconAnchor: [17, 35],
                        popupAnchor: [0, -35]
                    });

                    var taskStatus = vehicle.tasks.length > 0 ? vehicle.tasks[0].task_status : "No tasks";
                    var vehicleMarker = L.marker([vehicle.location_lat, vehicle.location_lon], {icon: vehicleIcon}).addTo(map)
                    .bindPopup("Όνομα: " + vehicle.name + "<br>Διεύθυνση: " + vehicle.street + " " + vehicle.number + ", " + vehicle.town
                        + "<br>status: " + taskStatus   );
                    
                    vehicleMarker.taskStatus = taskStatus;
                    vehicleMarkers.push(vehicleMarker);  // Προσθήκη στο array
                     // Draw lines to each task
                    vehicle.tasks.forEach(task => {
                        if (task.location_lat && task.location_lon) {  // Check task has valid location data
                            var linePoints = [
                                [vehicle.location_lat, vehicle.location_lon],
                                [task.location_lat, task.location_lon]
                            ];
                            const polylineLayer = L.polyline(linePoints, { color: 'green' }).addTo(map);
                            polylineLayers.push(polylineLayer); // Storing layer for potential later use or manipulation
                        }
                    });

            });

            } else {
                console.error("An error occurred fetching vehicles: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("An error occurred: " + status + ", " + error);
        }
    });
}

function displayPendingOffers() {
    $.ajax({
        url: "../../PHP/Global/get_pending_offers.php",
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                console.log(response);
                response.offers.forEach(function(offer) {
                    var offerIcon = L.icon({
                        iconUrl: '../../../upload_img/offer_pending.png',
                        iconSize: [45, 45],
                        iconAnchor: [17, 35],
                        popupAnchor: [0, -35]
                    });

                     var offerMarker = L.marker([offer.location_lat, offer.location_lon], {icon: offerIcon}).addTo(map)
                        .bindPopup("Προσφορά: " + offer.quantity + "<br>Από: " + offer.username + "<br>Όνομα: " + offer.full_name +
                         "<br>οχημα: " + offer.vehicle_username);

                    offerMarkers.push(offerMarker);  // Προσθήκη στο array
                        
                });
            }
        },
        error: function(xhr, status, error) {
            console.error("An error occurred fetching offers: " + status + ", " + error);
        }
    });
}

function displayPendingRequests() {
    $.ajax({
        url: "../../PHP/Global/get_pending_requests.php",
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                response.requests.forEach(function(request) {
                    var requestIcon = L.icon({
                        iconUrl: '../../../upload_img/request_pending.png',
                        iconSize: [45, 45],
                        iconAnchor: [17, 35],
                        popupAnchor: [0, -35]
                    });

                    var requestMarker = L.marker([request.location_lat, request.location_lon], {icon: requestIcon}).addTo(map)
                    .bindPopup("Αίτημα: " + request.quantity + "<br>Από: " + request.username + "<br> status: " + request.status);
                    // Store the status as a property of the marker object
                    requestMarker.status = request.status;

                    requestMarkers.push(requestMarker);  // Προσθήκη στο array
                });
            }
        },
        error: function(xhr, status, error) {
            console.error("An error occurred fetching requests: " + status + ", " + error);
        }
    });
}

export { offerMarkers, vehicleMarkers, requestMarkers, map, polylineLayers };

