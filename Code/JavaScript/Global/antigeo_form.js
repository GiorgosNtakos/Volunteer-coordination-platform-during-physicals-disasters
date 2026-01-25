"use strict";

document.addEventListener("DOMContentLoaded", function () {
  let map;
  var mapInitialized = false;
  var wasDragged = false;
  const showMap = document.getElementById("showMap");

  showMap.addEventListener("click", function () {
    var mapContainer = document.getElementById("map");

    if (mapContainer.classList.contains("hidden")) {
      // Εμφάνιση του χάρτη
      mapContainer.classList.remove("hidden");
      this.textContent = "Απόκρυψη Χάρτη"; // Αλλαγή του κειμένου του κουμπιού

      if (!mapInitialized) {
        map = L.map("map").setView([38.246242, 21.7350847], 18); // Συντεταγμένες για την Πλατεία Γεωργίου Πάτρας
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Προσθήκη marker
        var marker = L.marker(map.getCenter(), { draggable: false }).addTo(map);

        // Ενημέρωση των πεδίων κατά το drag end του marker
        map.on("dragstart", function() {
            wasDragged = true;
        });

        map.on("move", function () {
            var center = map.getCenter();
            marker.setLatLng(center);
          });

        map.on("moveend", debounce(function () {
        if (wasDragged) {
            var center = map.getCenter();
            marker.setLatLng(center);
            reverseGeocoding(center.lat, center.lng);
            wasDragged = false
        }
        }, 500));

        mapInitialized = true;
      } else {
        map.invalidateSize();
      }
    } else {
      // Απόκρυψη του χάρτη
      mapContainer.classList.add("hidden");
      this.textContent = "Προβολή Χάρτη"; // Αλλαγή του κειμένου του κουμπιού
    }
  });
});

async function reverseGeocoding(lat, lng, attempts = 3) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data.address) {
      const street = data.address.road || data.address.street || "";
      const number = data.address.house_number || "";
      document.getElementById("street").value = street;
      document.getElementById("number").value = number;
    } else {
      console.log("No address found for these coordinates.");
      document.getElementById("street").value = "";
      document.getElementById("number").value = "";
    }
  } catch (error) {
    console.error("Problem fetching coordinates:", error);
    if (attempts > 1) {
      console.log(`Retrying... Attempts left: ${attempts - 1}`);
      reverseGeocoding(lat, lng, attempts - 1);
    } else {
      document.getElementById("street").value = "";
      document.getElementById("number").value = "";
    }
  }
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
