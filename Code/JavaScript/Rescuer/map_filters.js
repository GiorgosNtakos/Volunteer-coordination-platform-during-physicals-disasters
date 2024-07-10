import { map, polylineLayers, unassignedtaskMarkers, assignedtaskMarkers } from './map.js';

const filters = {
    assignedRequests: false,
    unassignedRequests: false,
    assignedOffers: false,
    unassignedOffers: false,
    showLines: false
};

function toggleFilter(filterType, isChecked) {
    filters[filterType] = isChecked;
    updateMapVisibility();
}

function anyFiltersActive() {
    return Object.values(filters).some(type => type);
}



function updateMapVisibility() {
    const anyFilterIsActive = anyFiltersActive();

    unassignedtaskMarkers.forEach(marker => {
        let shouldBeVisible = true;
        if (anyFilterIsActive) {
            const markerStatus = marker.options.type;
            shouldBeVisible = (filters.unassignedRequests &&  markerStatus === "Request" ) ||
                              (filters.unassignedOffers &&  markerStatus === "Offer" );
        }
        updateVisibility(marker, shouldBeVisible);
    });

    assignedtaskMarkers.forEach(marker => {
        let shouldBeVisible = true;
        if (anyFilterIsActive) {
            const markerStatus = marker.options.type;
            shouldBeVisible = (filters.assignedRequests && markerStatus === "Request") ||
                              (filters.assignedOffers && markerStatus === "Offer" );
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
['assignedRequests', 'unassignedRequests', 'assignedOffers', 'unassignedOffers', 'showLines'].forEach(id => {
    
    const element = document.getElementById(id + 'Switch');
    console.log('Element:', element); // Check if element is found
    if (element) {
        element.addEventListener('change', function() {
            toggleFilter(id, this.checked);
        });
    } else {
        console.error(`Element with ID '${id}Switch' not found.`);
    }
});