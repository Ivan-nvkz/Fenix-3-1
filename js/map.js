'use strict';

document.addEventListener('DOMContentLoaded', () => {

   // Карта ==========================================================
   const map = L.map('map',
      {
         scrollWheelZoom: false
      })
      .setView({
         lat: 59.79832912348303,
         lng: 30.553540987463812,
      }, 13.5);
   // Add OSM tile leayer to the Leaflet map.
   L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
   ).addTo(map);

   const points = [
      {
         title: `
         ООО «Научно-Производственное Объединение Феникс»
         Адрес: 196641, Санкт-Петербург, пос. Металлострой,
         ул. дорога на Металлострой, д. 3, корп 5, лит. Д
                   `,
         lat: 59.79832912348303,
         lng: 30.553540987463812,
      },
   ];

   points.forEach(({ lat, lng, title }) => {
      const icon = L.icon({
         iconUrl: "images/icons/logo-map-bg.svg",
         iconSize: [195, 199],
         iconAnchor: [0, 0],
      });

      const marker = L.marker(
         {
            lat,
            lng,
            title,
         },
         {
            icon,
         },
      );
      marker.addTo(map)
         .bindPopup(title);
   });

   // Карта ==========================================================















});








