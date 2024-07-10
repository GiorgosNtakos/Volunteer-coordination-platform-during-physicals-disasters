"use strict";

let map;
let vehicleMarkers = [];
let offerMarkers = [];
let requestMarkers = [];
let polylineLayers = [];


$(document).ready(function() {
    initializeMap();
    setupDataLayers();

    map.on('popupopen', function(e) {
        var popupAnchor = e.popup.getLatLng();
        var point = map.latLngToContainerPoint(popupAnchor);
    
        var cargoDetailsDiv = document.getElementById('vehicleCargoDetails');
        cargoDetailsDiv.style.top = (point.y + window.scrollY - 107) + 'px';
        cargoDetailsDiv.style.left = (point.x + window.scrollX + 430) + 'px';
    });

    map.on('zoomend moveend', function() {
        updateCargoDetailsPosition();
    });

    map.on('popupclose', function() {
    document.getElementById('vehicleCargoDetails').style.display = 'none';
    document.querySelector('.cargo-title').style.display = 'none';
});
});

function initializeMap() {
    map = L.map('map').setView([38.246242, 21.7350847], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
}

function setupDataLayers() {
    fetchAndDisplayBase();
    displayAllOffers();
    displayAllRequests();
}

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
                    .bindPopup(`<div class="popup-content">
                    <div class="popup-title">Κεντρική Αποθήκη</div>
                    <div class="popup-info"><strong>Διεύθυνση:</strong> ${response.cordinates.street} ${response.cordinates.number}, ${response.cordinates.town}</div>
                    </div>`);

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
                            // Επαναφέρουμε το marker στην αρχική του θέση εάν ο χρήστης ακυρώσει την αλλαγή
                            baseMarker.setLatLng([response.cordinates.location_lat, response.cordinates.location_lon]).update();
                        }
                    });

            } else {
                console.log(response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("An error occurred: " + status + ", " + error);
        }
    });
}

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

                    var taskStatus = vehicle.tasks.length < 4 ? "Διαθέσιμο" : "Μη διαθέσιμο";
                    var vehicleMarker = L.marker([vehicle.location_lat, vehicle.location_lon], {icon: vehicleIcon, tasks: vehicle.tasks.length}).addTo(map)
                    .bindPopup(`
                    <div class="popup-content">
                        <div class="popup-title">Όχημα ${vehicle.name}</div>
                        <div class="popup-info"><strong>Διεύθυνση:</strong> ${vehicle.street} ${vehicle.number}, ${vehicle.town}</div>
                        <div class="popup-info"><strong>Κατάσταση:</strong> ${taskStatus}</div>
                        <div class="popup-info"><strong>Ενεργά Tasks:</strong> ${vehicle.assigned_tasks}</div>
                        <div class="popup-info"><button id = "popup_button_id" class="popup-button" onclick="showCargo('${vehicle.id}')">Εμφάνιση φορτίου οχήματος</button></div>
                    </div>`);
                    
                    vehicleMarker.taskStatus = taskStatus;
                    vehicleMarkers.push(vehicleMarker);

                    vehicle.tasks.forEach(task => {
                        if (task.location_lat && task.location_lon) {
                            var linePoints = [
                                [vehicle.location_lat, vehicle.location_lon],
                                [task.location_lat, task.location_lon]
                            ];
                            const polylineLayer = L.polyline(linePoints, { color: 'green' }).addTo(map);
                            polylineLayers.push(polylineLayer);
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
function displayAllOffers() {
    $.ajax({
        url: "../../PHP/Global/get_all_offers.php",
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                console.log(response);
                response.offers.forEach(function(offer) {
                    var offerIconUrl = offer.status === 'accepted' ? '../../../upload_img/offer_accepted.png' : '../../../upload_img/offer_pending.png';
                    var offerIcon = L.icon({
                        iconUrl: offerIconUrl,
                        iconSize: [45, 45],
                        iconAnchor: [17, 35],
                        popupAnchor: [0, -35]
                    });

                     var offerMarker = L.marker([offer.location_lat, offer.location_lon], {icon: offerIcon, status: offer.status}).addTo(map)
                        .bindPopup(function() {
                            var popupContent = `<div class="popup-content">
                                <div class="popup-title">${offer.full_name}</div>
                                <div class="popup-info"><strong>Τηλέφωνο:</strong> ${offer.phone}</div>
                                <div class="popup-info"><strong>Διεύθυνση:</strong> ${offer.street} ${offer.number}, ${offer.town}</div>
                                <div class="popup-info"><strong>Είδος Προσφοράς:</strong> ${offer.name}</div>
                                <div class="popup-info"><strong>Ποσότητα Προσφοράς:</strong> ${offer.quantity}</div>
                                <div class="popup-info"><strong>Ημερομηνία Καταχώρησης:</strong> ${formatDateIntl(offer.created_at)}</div>`;

                                if (offer.status === 'accepted') {
                                    popupContent += `<div class="popup-info"><strong>Όνομα Οχήματος:</strong> ${offer.vehicle_name}</div>
                                                     <div class="popup-info"><strong>Ημερομηνία Ανάληψης:</strong> ${formatDateIntl(offer.updated_at)}</div>`;
                                } else {
                                    popupContent += `<div class="popup-info"><strong>Κατάσταση:</strong> Δεν έχει αναληφθεί ακόμα</div>`;
                                }
                        
                            popupContent += `</div>`;
                            return popupContent;
                        });

                    offerMarkers.push(offerMarker);
                        
                });
            } 
        },
        error: function(xhr, status, error) {
            console.error("An error occurred fetching offers: " + status + ", " + error);
        }
    });
}

function displayAllRequests() {
    $.ajax({
        url: "../../PHP/Global/get_all_requests.php",
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                response.requests.forEach(function(request) {
                    var requestIconUrl = request.status === 'accepted' ? '../../../upload_img/request_accepted.png' : '../../../upload_img/request_pending.png';
                    var requestIcon = L.icon({
                        iconUrl: requestIconUrl,
                        iconSize: [45, 45],
                        iconAnchor: [17, 35],
                        popupAnchor: [0, -35]
                    });

                    var requestMarker = L.marker([request.location_lat, request.location_lon], {icon: requestIcon, status: request.status}).addTo(map)
                    .bindPopup(function() {
                        var popupContent = `<div class="popup-content">
                            <div class="popup-title">${request.full_name}</div>
                            <div class="popup-info"><strong>Τηλέφωνο:</strong> ${request.phone}</div>
                            <div class="popup-info"><strong>Διεύθυνση:</strong> ${request.street} ${request.number}, ${request.town}</div>
                            <div class="popup-info"><strong>Είδος Αίτησης:</strong> ${request.name}</div>
                            <div class="popup-info"><strong>Ποσότητα Αίτηματος:</strong> ${request.quantity}</div>
                            <div class="popup-info"><strong>Ημερομηνία Καταχώρησης:</strong> ${formatDateIntl(request.created_at)}</div>`;
                    
                            if (request.status === 'accepted') {
                                popupContent += `<div class="popup-info"><strong>Όνομα Οχήματος:</strong> ${request.vehicle_name}</div>
                                                 <div class="popup-info"><strong>Ημερομηνία Ανάληψης:</strong> ${formatDateIntl(request.updated_at)}</div>`;
                            } else {
                                popupContent += `<div class="popup-info"><strong>Κατάσταση:</strong> Δεν έχει αναληφθεί ακόμα</div>`;
                            }
                    
                        popupContent += `</div>`;
                        return popupContent;
                    });

                    requestMarkers.push(requestMarker);
                });
            }
        },
        error: function(xhr, status, error) {
            console.error("An error occurred fetching requests: " + status + ", " + error);
        }
    });
}

function formatDateIntl(dateStr) {
    const dateObj = new Date(dateStr);
    return new Intl.DateTimeFormat('el-GR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(dateObj);
}

window.showCargo = function(vehicleId) {

    var pop_button = document.getElementById('popup_button_id');


    const cargoDetailsDiv = document.getElementById('vehicleCargoDetails');
    const cargoListDiv = document.getElementById('cargoList');

    if (cargoDetailsDiv.style.display === 'block') {
        cargoDetailsDiv.style.display = 'none';
        cargoListDiv.innerHTML = ''; 
        pop_button.innerHTML = `Εμφάνιση φορτίου οχήματος`
    } else {

    cargoListDiv.innerHTML = '';
    

    $.ajax({
        url: "../../PHP/Admin/get_vehicle_cargo.php",
        method: "GET",
        data: {
          vehicleId: vehicleId
        }, success: function (response) {

            if(response.status === 'success'){

                pop_button.innerHTML = `Κλείσιμο Φορτίου`
                cargoDetailsDiv.style.display = 'block';
                document.querySelector('.cargo-title').style.display = 'block';

            var items = response.items;

            const header = document.createElement('div');
            header.className = 'cargo-header';
            header.innerHTML = `<div>Είδος</div><div>Ποσότητα</div>`;
            cargoListDiv.appendChild(header);
            
            items.forEach(function(item){
                const itemElement = document.createElement('div');
                itemElement.className = 'cargo-item';
                itemElement.innerHTML =``
                itemElement.innerHTML = `<div>${item.name}</div><div>${item.quantity}</div>`;
                cargoListDiv.appendChild(itemElement);
            });
        } else if (response.status === 'success_but_empty'){
            showMessage(
                "success-message",
                "Το φορτίο του οχήματος είναι άδειο.",
                "#popup_button_id"
            );
        }

        }, 
        error: function() {
            console.error("Failed to fetch cargo details.");
        }
    });
 }
}

function updateCargoDetailsPosition() {
    const popup = map._popup;
    if (popup && popup.isOpen()) {
        const popupAnchor = popup.getLatLng();
        const point = map.latLngToContainerPoint(popupAnchor);

        const cargoDetailsDiv = document.getElementById('vehicleCargoDetails');
        if (cargoDetailsDiv.style.display !== 'none') {
            cargoDetailsDiv.style.top = (point.y + window.scrollY - 107) + 'px';
            cargoDetailsDiv.style.left = (point.x + window.scrollX + 430) + 'px';
        }
    }
}

export { offerMarkers, vehicleMarkers, requestMarkers, map, polylineLayers };

