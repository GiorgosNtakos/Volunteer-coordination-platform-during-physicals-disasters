"use strict";
import { vehicleMarkers, taskMarkers, map, lineMarkers } from './map.js';

// Define the filterMarkers function
function filterMarkers() {
    // Retrieve the state of each checkbox
    const acceptedRequests = document.getElementById('acceptedRequestsSwitch').checked;
    const pendingRequests = document.getElementById('pendingRequestsSwitch').checked;
    const offers = document.getElementById('offersSwitch').checked;
    const vehiclesWithTasks = document.getElementById('vehiclesWithTasksSwitch').checked;
    const vehiclesWithoutTasks = document.getElementById('vehiclesWithoutTasksSwitch').checked;
    const showLines = document.getElementById('showLinesSwitch').checked;

    // Filter task markers based on checkbox states
    taskMarkers.forEach(marker => {

        if (!marker.options || !marker.options.type || !marker.options.status) {
            console.log("Marker options are invalid:", marker);
            return; // Skip processing invalid marker
        }
        const markerType = marker.options.type;
        const markerStatus = marker.options.status;

        // Default visibility
        let shouldBeVisible = true;

        // Apply filters based on checkbox states
        if ((markerType === 'Request' && markerStatus === 'accepted' && !acceptedRequests) ||
            (markerType === 'Request' && markerStatus === 'pending' && !pendingRequests) ||
            (markerType === 'Offer' && !offers)) {
            shouldBeVisible = false;
        }

        // Show or hide the marker based on shouldBeVisible flag
        console.log("Marker:", markerType, markerStatus, "Should be visible:", shouldBeVisible);
        if (shouldBeVisible) {
            map.addLayer(marker);
        } else {
            map.removeLayer(marker);
        }
    });

    lineMarkers.forEach(line => {
        if (!showLines) {
            map.removeLayer(line); // Remove the line marker if showLines checkbox is unchecked
        } else {
            map.addLayer(line); // Add the line marker if showLines checkbox is checked
        }
    });

    // Filter vehicle markers based on checkbox states
    vehicleMarkers.forEach(marker => {
        const hasTask = marker.options.type === "accepted";

        // Default visibility
        let shouldBeVisible = true;

        // Apply filters based on checkbox states
        if ((hasTask && !vehiclesWithTasks) || (!hasTask && !vehiclesWithoutTasks)) {
            shouldBeVisible = false;
        }

        // Show or hide the marker based on shouldBeVisible flag
        if (shouldBeVisible) {
            map.addLayer(marker);
        } else {
            map.removeLayer(marker);
        }
    });

    // Filter line markers based on checkbox states
    // You need to implement this part based on your code structure
}

// Attach event listener to filter checkboxes
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.filter-switch input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', function() {
            // Call the filterMarkers function with the updated checkbox states
            filterMarkers();
        });
    });
});
