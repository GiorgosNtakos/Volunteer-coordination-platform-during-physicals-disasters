"use strict";
import { map, vehicleMarkers, offerMarkers, requestMarkers, polylineLayers } from './new_map.js';

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
    requestMarkers.forEach(marker => {

        if (!marker.status) {
            console.log("Marker options are invalid:", marker);
            return; // Skip processing invalid marker
        }

        const markerStatus = marker.status;

        // Default visibility
        let shouldBeVisible = true;

        // Apply filters based on checkbox states
        if ((markerStatus === 'accepted' && !acceptedRequests) ||
            (markerStatus === 'pending' && !pendingRequests) 
            ) {
            shouldBeVisible = false;
        }

        // Show or hide the marker based on shouldBeVisible flag
        console.log("Marker:", markerStatus, "Should be visible:", shouldBeVisible);
        if (shouldBeVisible) {
            map.addLayer(marker);
        } else {
            map.removeLayer(marker);
        }
    });

    polylineLayers.forEach(line => {
        if (!showLines) {
            map.removeLayer(line); // Remove the line marker if showLines checkbox is unchecked
        } else {
            map.addLayer(line); // Add the line marker if showLines checkbox is checked
        }
    });

    // Filter vehicle markers based on checkbox states
    vehicleMarkers.forEach(marker => {
        const hasTask = marker.task_status === "accepted";

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
