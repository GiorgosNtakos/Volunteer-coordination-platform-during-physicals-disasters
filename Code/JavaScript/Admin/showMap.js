"use strict";

// Function to create Leaflet icon
function createLeafletIcon(iconUrl) {
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
}

// Function to handle AJAX requests
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Function to add marker to the map
function addMarkerToMap(map, lat, lon, popupContent, icon) {
    const marker = L.marker([lat, lon], { icon: icon }).addTo(map);
    marker.bindPopup(popupContent);
    return marker;
}

document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOMContentLoaded');

    const map = L.map('map').setView([38.2466, 21.7346], 12);
    var baseMarker;
    const vehicleMarkers = [];
    const taskMarkers = [];

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Define icons
    const vehicleIcon = createLeafletIcon('../../../upload_img/location.png');
    const acceptedIcon = createLeafletIcon('../../../upload_img/accepted.png');
    const requestIcon = createLeafletIcon('../../../upload_img/request.png');
    const offerIcon = createLeafletIcon('../../../upload_img/offer.png');

    try {
        // Fetch vehicle data
        const vehicleData = await fetchData('../../PHP/Admin/get_vehicles.php');
        for (const vehicle of vehicleData) {
            const marker = L.marker([vehicle.location_lat, vehicle.location_lon]);
            // Reverse geocoding to get street address
            const geoData = await fetchData(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${vehicle.location_lat}&lon=${vehicle.location_lon}`);
            let address = '';
            if (geoData.address) {
                address = geoData.address.road || '';
                if (geoData.address.house_number) {
                    address += ' ' + geoData.address.house_number;
                }
            }
            marker.bindPopup(`<b>${vehicle.name}</b><br>${address || 'Address not found'}`);
            marker.addTo(map);
            vehicleMarkers.push(marker);

            if (vehicle.name === 'Base') {
                baseMarker = marker;
                baseMarker.dragging.enable(); // Enable dragging only for the base marker
            }
            
        }

        // Fetch task data
        const taskData = await fetchData('../../PHP/Admin/get_tasks.php');
        for (const task of taskData) {
            const geoData = await fetchData(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${task.location_lat}&lon=${task.location_lon}`);
            let address = '';
            if (geoData.address) {
                address = geoData.address.road || '';
                if (geoData.address.house_number) {
                    address += ' ' + geoData.address.house_number;
                }
            }
            let popupContent = '';
            if (task.type === 'Request') {
                popupContent = `<b>Αιτήματα</b><br>`;
                popupContent += `Όνοματεπώνυμο: ${task.full_name}<br>`;
                popupContent += `Τηλέφωνο: ${task.phone}<br>`;
                popupContent += `Ημερομηνία Καταχώρησης: ${task.created_at}<br>`;
            } else if (task.type === 'Offer') {
                popupContent = `<b>Προσφορές</b><br>`;
                popupContent += `Όνοματεπώνυμο: ${task.full_name}<br>`;
                popupContent += `Τηλέφωνο: ${task.phone}<br>`;
                popupContent += `Ημερομηνία Καταχώρησης: ${task.created_at}<br>`;
            }
            const icon = task.type === 'Request' ? requestIcon : offerIcon;
            const marker = addMarkerToMap(map, task.location_lat, task.location_lon, popupContent, icon);
            taskMarkers.push(marker);
            // Connect task marker with corresponding vehicle marker if task is accepted
            if (task.status === 'accepted') {
                const correspondingVehicle = vehicleMarkers.find(vehicleMarker => vehicleMarker.options.id === task.vehicle_id);
                if (correspondingVehicle) {
                    const latlngs = [correspondingVehicle.getLatLng(), marker.getLatLng()];
                    const polyline = L.polyline(latlngs, { color: 'green' }).addTo(map);
                }
            }
        }
    } catch (error) {
        alert('An error occurred while fetching data.');
    }

    // Add event listener for mouseup to confirm the new location
    map.on('mouseup', function () {
        if (baseMarker && confirm('Είστε σίγουροι ότι θέλετε να ορίσετε τη θέση της βάσης στις νέες συντεταγμένες;')) {
            // Get the new base location from the marker
            const baseLocation = baseMarker.getLatLng();
            // Make an AJAX request to update the database with the new coordinates
            updateBaseLocationInDatabase(baseLocation.lat, baseLocation.lng);
        }
    });

    // Function to make an AJAX request and update the database
    async function updateBaseLocationInDatabase(newLat, newLng) {
        const formData = new FormData();
        formData.append('lat', newLat);
        formData.append('lng', newLng);
        try {
            const response = await fetch('../../PHP/Admin/update_vehicles.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log(data);
            alert(data.message);
        } catch (error) {
            console.error('Error updating base location:', error);
            alert('Σφάλμα κατά την ενημέρωση της βάσης δεδομένων.');
        }
    }
});
