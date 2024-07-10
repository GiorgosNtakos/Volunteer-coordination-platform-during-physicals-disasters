import { map, vehicleMarkers, offerMarkers, requestMarkers, polylineLayers } from './new_map.js';

const filters = {
    acceptedRequests: false,
    pendingRequests: false,
    acceptedOffers: false,
    pendingOffers: false,
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
        let shouldBeVisible = true; 
        if (anyFilterIsActive) {
            const hasTask = marker.options.tasks ;
            shouldBeVisible = (filters.vehiclesWithTasks && (hasTask > 0)) ||
                              (filters.vehiclesWithoutTasks && !(hasTask>0));
        }
        updateVisibility(marker, shouldBeVisible);
    });

    offerMarkers.forEach(marker => {
        let shouldBeVisible = true; 
        if (anyFilterIsActive) {
            const markerStatus = marker.options.status;
            shouldBeVisible = (filters.acceptedOffers && markerStatus === "accepted") ||
                              (filters.pendingOffers && markerStatus === "pending");
        }
        updateVisibility(marker, shouldBeVisible);
    });

    requestMarkers.forEach(marker => {
        let shouldBeVisible = true; 
        if (anyFilterIsActive) {
            const markerStatus = marker.options.status;
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
['acceptedRequests', 'pendingRequests', 'acceptedOffers', 'pendingOffers', 'vehiclesWithTasks', 'vehiclesWithoutTasks', 'showLines'].forEach(id => {
    document.getElementById(id + 'Switch').addEventListener('change', function() {
        toggleFilter(id, this.checked);
    });
});
