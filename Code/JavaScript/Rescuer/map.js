"use strict";
import { updateTaskPanel } from './task_panel.js';

let map;
let unassignedtaskMarkers = [];
let assignedtaskMarkers = [];
let polylineLayers = [];

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
                    let marker = L.marker([rescuer.location_lat, rescuer.location_lon], {
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
                            <b>Vehicle:</b> ${task.name ? task.name : 'None'}<br>
                            <button onclick="undertakeTask('${task.id}', '${task.type}')">Undertake Task</button>
                        `;
                        let unassignedtaskMarker = L.marker([task.location_lat, task.location_lon], {
                            icon: L.icon({
                                iconUrl: iconUrl,
                                iconSize: [45, 45],
                                iconAnchor: [17, 35],
                                popupAnchor: [0, -35]
                            }),
                            type: task.type
                        }).addTo(map).bindPopup(taskPopupContent);
                        unassignedtaskMarkers.push(unassignedtaskMarker);
                    
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
                        <b>Vehicle:</b> ${task.name}<br>
                        <button onclick="completeTask('${task.id}')">Complete Task</button>
                        <button onclick="cancelTask('${task.id}')">Cancel Task</button>
                    `;
                        let assignedtaskMarker = L.marker([task.location_lat, task.location_lon], {
                            icon: L.icon({
                                iconUrl: iconUrl,
                                iconSize: [45, 45],
                                iconAnchor: [17, 35],
                                popupAnchor: [0, -35]
                            }),
                            type: task.type
                        }).addTo(map).bindPopup(taskPopupContent);
                          assignedtaskMarkers.push(assignedtaskMarker);

                        // Draw line between rescuer's vehicle and task location
                        const polylineLayer = L.polyline([[rescuer.location_lat, rescuer.location_lon], [task.location_lat, task.location_lon]], {
                            color: 'green',
                            weight: 3,
                            opacity: 0.7,
                            smoothFactor: 1
                        }).addTo(map);
                        polylineLayers.push(polylineLayer);
                    } else {
                        console.error('Invalid assigned task coordinates', task);
                    }
                });

                // Update the task panel
                updateTaskPanel(assignedTasks);

            } else {
                console.error('Error fetching map data:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching map data:', status, error, xhr.responseText);
        }
    });
}

window.undertakeTask = function(taskId, taskType) {
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

window.completeTask = function(taskId) {
    $.ajax({
        url: '../../PHP/Global/complete_task.php',
        method: 'POST',
        data: { task_id: taskId },
        dataType: 'json', // Expect JSON response
        success: function(response) {
            console.log('Server response:', response); // Log the server response for debugging
            if (response.status === 'success') {
                alert('Task successfully completed!');
                fetchMapData();
            } else {
                alert('Failed to complete task: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error completing task:', status, error, xhr.responseText);
            alert('Failed to complete task: ' + error);
        }
    });
}


window.cancelTask = function(taskId) {
    console.log('cancelTask function called with Task ID:', taskId);

    $.ajax({
        url: '../../PHP/Global/cancel_task.php',
        method: 'POST',
        data: {
            task_id: taskId
        },
        success: function(response) {
            if (response.status === 'success') {
                alert('Task successfully cancelled!');
                fetchMapData();
            } else {
                alert('Failed to cancel task: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error cancelling task:', status, error, xhr.responseText);
        }
    });
}

export { map, polylineLayers, unassignedtaskMarkers, assignedtaskMarkers, fetchMapData };
