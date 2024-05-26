"use strict";

let map;

$(document).ready(function() {
    initializeMap();
});

function initializeMap() {
    // Create the map object
    map = L.map('map').setView([38.246242, 21.7350847], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Check if the user is signed in
    if (isUserSignedIn()) {
        fetchMapData(); // Fetch and display map data
    } else {
        console.log('User is not signed in.');
    }
}

function isUserSignedIn() {
    let signedIn = false;
    $.ajax({
        url: '../../PHP/Global/check_session.php',
        method: 'GET',
        async: false, // Make the request synchronous
        success: function(response) {
            if (response.status === 'success') {
                signedIn = true;
            }
        },
        error: function() {
            signedIn = false;
        }
    });
    return signedIn;
}

function fetchMapData() {
    $.ajax({
        url: '../../PHP/Global/get_map_data.php',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const { rescuer, base, unassignedTasks, assignedTasks } = response;

                console.log('Rescuer:', rescuer);
                console.log('Base:', base);
                console.log('Unassigned Tasks:', unassignedTasks);
                console.log('Assigned Tasks:', assignedTasks);

                // Validate rescuer's location
                if (rescuer.location_lat && rescuer.location_lon) {
                    L.marker([rescuer.location_lat, rescuer.location_lon], {
                        icon: L.icon({
                            iconUrl: '../../../upload_img/vehicle.png',
                            iconSize: [45, 45],
                            iconAnchor: [17, 35],
                            popupAnchor: [0, -35]
                        })
                    }).addTo(map).bindPopup("Rescuer: " + rescuer.username);
                } else {
                    console.error('Invalid rescuer coordinates');
                }

                // Validate base location
                if (base.location_lat && base.location_lon) {
                    L.marker([base.location_lat, base.location_lon], {
                        icon: L.icon({
                            iconUrl: '../../../upload_img/base_marker.png',
                            iconSize: [45, 45],
                            iconAnchor: [17, 35],
                            popupAnchor: [0, -35]
                        })
                    }).addTo(map).bindPopup("Base Location");
                } else {
                    console.error('Invalid base coordinates');
                }

                // Display unassigned tasks
                unassignedTasks.forEach(task => {
                    if (task.location_lat && task.location_lon) {
                        const iconUrl = task.type === 'Offer' ? '../../../upload_img/offer_pending.png' : '../../../upload_img/request_pending.png';
                        const taskPopupContent = `
                            <b>Task ID:</b> ${task.id}<br>
                            <b>Type:</b> ${task.type}<br>
                            <b>Name:</b> ${task.full_name}<br>
                            <b>Phone:</b> ${task.phone}<br>
                            <b>Quantity:</b> ${task.quantity}<br>
                            <b>Created At:</b> ${task.created_at}<br>
                            <b>Accepted At:</b> ${task.accepted_at ? task.accepted_at : 'Not accepted yet'}<br>
                            <b>Vehicle:</b> ${task.vehicle_name ? task.vehicle_name : 'None'}<br>
                            <button onclick="undertakeTask('${task.id}')">Undertake Task</button>
                        `;
                        L.marker([task.location_lat, task.location_lon], {
                            icon: L.icon({
                                iconUrl: iconUrl,
                                iconSize: [45, 45],
                                iconAnchor: [17, 35],
                                popupAnchor: [0, -35]
                            })
                        }).addTo(map).bindPopup(taskPopupContent);
                    } else {
                        console.error('Invalid unassigned task coordinates', task);
                    }
                });

                // Display assigned tasks and connect with lines
                assignedTasks.forEach(task => {
                    if (task.location_lat && task.location_lon && rescuer.location_lat && rescuer.location_lon){
                        const iconUrl = task.type === 'Offer' ? '../../../upload_img/offer_accepted.png' : '../../../upload_img/request_accepted.png';
                        const taskPopupContent = `
                        <b>Task ID:</b> ${task.id}<br>
                        <b>Type:</b> ${task.type}<br>
                        <b>Name:</b> ${task.full_name}<br>
                        <b>Phone:</b> ${task.phone}<br>
                        <b>Quantity:</b> ${task.quantity}<br>
                        <b>Created At:</b> ${task.created_at}<br>
                        <b>Accepted At:</b> ${task.accepted_at}<br>
                        <b>Vehicle:</b> ${task.vehicle_name}<br>
                    `;
                        const taskMarker = L.marker([task.location_lat, task.location_lon], {
                            icon: L.icon({
                                iconUrl: iconUrl,
                                iconSize: [45, 45],
                                iconAnchor: [17, 35],
                                popupAnchor: [0, -35]
                            })
                        }).addTo(map).bindPopup(taskPopupContent);

                        // Draw line between rescuer's vehicle and task location
                        L.polyline([[rescuer.location_lat, rescuer.location_lon], [task.location_lat, task.location_lon]], {
                            color: 'green',
                            weight: 3,
                            opacity: 0.7,
                            smoothFactor: 1
                        }).addTo(map);
                    } else {
                        console.error('Invalid assigned task coordinates', task);
                    }
                });

            } else {
                console.error('Error fetching map data:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching map data:', status, error, xhr.responseText);
        }
    });
}


function undertakeTask(taskId, taskType) {
    console.log('undertakeTask function called with Task ID:', taskId, 'and Task Type:', taskType);

    $.ajax({
        url: '../../PHP/Global/undertake_task.php',
        method: 'POST',
        data: {
            task_id: taskId,
            task_type: taskType
        },
        success: function(response) {
            if (response.status === 'success') {
                alert('Task successfully undertaken!');
                fetchMapData();
            } else {
                alert('Failed to undertake task: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error undertaking task:', status, error, xhr.responseText);
        }
       
    });
}

