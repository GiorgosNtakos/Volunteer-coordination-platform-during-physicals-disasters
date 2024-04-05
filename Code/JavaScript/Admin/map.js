"use strict";
const vehicleMarkers = [];
const taskMarkers = [];
const lineMarkers = [];
const map = L.map('map').setView([38.2466, 21.7346], 12);
let baseMarker;

const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const icons = {
    vehicle: L.icon({ iconUrl: '../../../upload_img/vehicles1.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
    accepted: L.icon({ iconUrl: '../../../upload_img/accepted.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
    request: L.icon({ iconUrl: '../../../upload_img/request.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
    offer: L.icon({ iconUrl: '../../../upload_img/offer.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] })
};

const createMarker = (lat, lng, popupContent, icon, type, status) => {
    const markerOptions = { icon };
    if (type && status) {
        markerOptions.type = type;
        markerOptions.status = status;
    }

    const marker = L.marker([lat, lng], { ...markerOptions }).addTo(map);
    marker.bindPopup(popupContent);
    return marker;
};


// Function to fetch and process data
const fetchAndProcessData = async (url, processData) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        processData(data);
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        alert(`Error fetching data from ${url}`);
    }
};

const handleVehicleData = (vehicleData) => {
    vehicleData.forEach(vehicle => {
        const marker = createMarker(vehicle.location_lat, vehicle.location_lon, vehiclePopupContent(vehicle), icons.vehicle);
        marker.options.id = vehicle.id; // Set the id property
        vehicleMarkers.push(marker);
        if (vehicle.name === 'Base') {
            baseMarker = marker;
            baseMarker.dragging.enable();
        }
    });
};

const handleTaskData = (taskData) => {
    console.log('Task data received:', taskData); // Log the task data received
    taskData.forEach(task => {
        console.log('Processing task:', task);
        console.log('Task vehicle_id:', task.vehicle_id);
        console.log('Task status:', task.status); // Log the task status

        console.log('Creating marker for task:', task);
        console.log('Latitude:', task.location_lat, 'Longitude:', task.location_lon);
        console.log('Popup content:', taskPopupContent(task));
        console.log('Icon:', task.type === 'Request' ? icons.request : icons.offer);
        
        const marker = createMarker(task.location_lat, task.location_lon, taskPopupContent(task), task.type === 'Request' ? icons.request: icons.offer, task.type, task.status);
        console.log('Marker created:', marker); // Log the created marker object

        taskMarkers.push(marker);
        console.log('Task markers array:', taskMarkers); // Log the taskMarkers array
        
        // Check if the task status is 'accepted' instead of 'completed'
        if (task.status === 'accepted') {
            console.log('Task status:', task.status);
            const correspondingVehicle = vehicleMarkers.find(vehicleMarker => vehicleMarker.options.id === task.vehicle_id);
            if (correspondingVehicle) {
                console.log('Connecting task:', task, 'with vehicle:', correspondingVehicle.options.id);
                const latlngs = [correspondingVehicle.getLatLng(), marker.getLatLng()];
                const polyline = L.polyline(latlngs, { color: 'grey' }).addTo(map);
                lineMarkers.push(polyline); // Push the line marker to lineMarkers array
            } else {
                console.log('Corresponding vehicle not found for task:', task);
            }
        }
    });
    console.log('Exiting handleTaskData function'); // Log exit point of the function
};

// Check if there are active tasks for the vehicle
const vehiclePopupContent = (vehicle) => {
    let content = `<b>Οχήματα</b><br>
               Όνομα χρήστη: ${vehicle.name}<br>
               φορτιο: ${vehicle.number}<br>
               κατασταση: ${vehicle.status}`;
   
    return content;      
};

const taskPopupContent = (task) => {
    let content = `<b>${task.type === 'Request' ? "Αιτήματα" : "Προσφορές"}</b><br>
                    Όνοματεπώνυμο: ${task.full_name}<br>
                    Τηλέφωνο: ${task.phone}<br>
                    Ημερομηνία Καταχώρησης: ${task.created_at}<br>
                    Ποσότητα: ${task.quantity}<br>
                    `;
                    
    // Check if the task status is 'accepted'
    if (task.status === 'accepted') {
        content += `Ημερομηνία Ανάληψης: ${task.updated_at}<br>`;
        const correspondingVehicle = vehicleMarkers.find(vehicleMarker => vehicleMarker.options.id === task.vehicle_id);
        if (correspondingVehicle) {
            content += `Ονομασία Οχήματος: ${correspondingVehicle.options.name}<br>`;
        }
    }

    return content;
};

(async () => {
    await fetchAndProcessData('../../PHP/Admin/get_vehicles.php', handleVehicleData);
    await fetchAndProcessData('../../PHP/Admin/get_tasks.php', handleTaskData);
})();

map.on('mouseup', confirmBaseLocation);

function confirmBaseLocation() {
    if (baseMarker && confirm('Είστε σίγουροι ότι θέλετε να ορίσετε τη θέση της βάσης στις νέες συντεταγμένες;')) {
        const baseLocation = baseMarker.getLatLng();
        updateBaseLocationInDatabase(baseLocation.lat, baseLocation.lng);
    }
}

function updateBaseLocationInDatabase(newLat, newLng) {
    const formData = new FormData();
    formData.append('lat', newLat);
    formData.append('lng', newLng);

    fetch('../../PHP/Admin/update_vehicles.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert(data.message); // Display a message to the user
        })
        .catch(error => {
            console.error('Error updating base location:', error);
            alert('Σφάλμα κατά την ενημέρωση της βάσης δεδομένων.');
        });
}
export { taskMarkers,vehicleMarkers, map, lineMarkers  };