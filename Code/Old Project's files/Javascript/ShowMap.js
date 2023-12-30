"use strict";

// Create the map
const map = L.map('map').setView([38.239798, 21.737137], 13);

// Add the tile layer (you'll need to replace 'your_api_key' with an actual API key)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
}).addTo(map);

// Placeholder function to handle subcategory clicks
function handleSubcategoryClick(event) {
    event.preventDefault();
    const subcategory = event.target.innerText;
    // Use the subcategory to fetch data or manipulate the map as needed
    console.log(`Clicked on subcategory: ${subcategory}`);
}

// Add click event listeners to subcategory links
const subcategoryLinks = document.querySelectorAll('.subcategory');
subcategoryLinks.forEach(link => {
    link.addEventListener('click', handleSubcategoryClick);
});
