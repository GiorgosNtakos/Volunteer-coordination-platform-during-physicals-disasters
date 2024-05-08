// map_filter.js
import { map, vehicleMarkers, offerMarkers, requestMarkers, polylineLayers } from './new_map.js';

const filters = {
    acceptedRequests: false,
    pendingRequests: false,
    offers: false,
    vehiclesWithTasks: false,
    vehiclesWithoutTasks: false,
    showLines: false
};

function toggleFilter(filterType, isChecked) {
    filters[filterType] = isChecked;
    updateMapVisibility();
}

function anyFiltersActive() {
    return Object.values(filters).some(status => status);
}

function updateMapVisibility() {
    const anyFilterIsActive = anyFiltersActive();

    vehicleMarkers.forEach(marker => {
        let shouldBeVisible = true;  // Default to true
        if (anyFilterIsActive) {
            const hasTask = marker.taskStatus === "accepted";
            shouldBeVisible = (filters.vehiclesWithTasks && hasTask) ||
                              (filters.vehiclesWithoutTasks && !hasTask);
        }
        updateVisibility(marker, shouldBeVisible);
    });

    offerMarkers.forEach(marker => {
        let shouldBeVisible = !anyFilterIsActive || filters.offers;
        updateVisibility(marker, shouldBeVisible);
    });

    requestMarkers.forEach(marker => {
        let shouldBeVisible = true;  // Default to true
        if (anyFilterIsActive) {
            const markerStatus = marker.status;
            shouldBeVisible = (filters.acceptedRequests && markerStatus === "accepted") ||
                              (filters.pendingRequests && markerStatus === "pending");
        }
        updateVisibility(marker, shouldBeVisible);
    });

    polylineLayers.forEach(line => {
        let shouldBeVisible = !anyFilterIsActive || filters.showLines;
        updateVisibility(line, shouldBeVisible);
    });
}

function updateVisibility(layer, shouldBeVisible) {
    if (shouldBeVisible) {
        if (!map.hasLayer(layer)) {
            map.addLayer(layer);
        }
    } else {
        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    }
}

// Event listeners
['acceptedRequests', 'pendingRequests', 'offers', 'vehiclesWithTasks', 'vehiclesWithoutTasks', 'showLines'].forEach(id => {
    document.getElementById(id + 'Switch').addEventListener('change', function() {
        toggleFilter(id, this.checked);
    });
});
