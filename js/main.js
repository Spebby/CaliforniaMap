function capitalize(str) {
    if (!str) return str; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


// Define the setMarkers function
function processGeoJSON(geojsonData) {
    const category = geojsonData.category || "default";

    const catStr = capitalize(category);

    // Ensure the category is defined in the categories object
    if (!iconSets[category]) {
        iconSets[category] = L.layerGroup();  // Use a LayerGroup for each category
    } 

    L.geoJSON(geojsonData, {
        filter: function(feature) {
            return feature.properties.show_on_map;  // Apply your filter logic
        },
        pointToLayer: function(feature, latlng) {
            const popup = L.popup().setContent(`Category: ${catStr}<br>${feature.properties.name}`);
            return L.marker(latlng, {
                icon: tagToIcon[feature.properties.tag]  // Customize the icon based on the tag
            }).bindPopup(popup);
        },
        onEachFeature: function (feature, layer) {
            iconSets[category].addLayer(layer);
        }
    });
}

// Listed & Major Unlisted locations label maker
async function loadLocationsNames() {
    try {
    const response = await fetch('./data/locations.geojson');
    const data = await response.json();

    iconSets['Listed Locations'] = L.layerGroup();
    iconSets['Unlisted Locations'] = L.layerGroup();

    data.features.forEach(item => {
        if (item.properties.show_on_map) {
            // Determine the class for the feature
            const tag = item.properties.tag;
            let className = tagToClass[tag];

            // Create a custom DivIcon
            let customIcon = L.divIcon({
                className: className,
                html: item.properties.title,
                iconSize: [150, 40], // Adjust size based on text length
                iconAnchor: [75, 20] // Center the icon on the point
            });

            // Create a marker with the custom icon
            let marker = L.marker([item.coordinates[1], item.coordinates[0]], { icon: customIcon });

            // Add the marker to the appropriate layer based on className
            if (tag === 'listed') {
                iconSets['Listed Locations'].addLayer(marker);
            } else {
                iconSets['Unlisted Locations'].addLayer(marker);
            }
        }
    });

    } catch (error) {
        console.error('Error loading the GeoJSON file:', error);  // Handle any errors
        return Promise.reject(error);  // Return rejected promise in case of an error
    }
}

async function loadData() {
    const response = await fetch(`./bulkIcons.json`);
    const iconData = (await response.json()).directories;

    let fetchPromises = [];
    
    fetchPromises.push(loadLocationsNames());
    fetchPromises = iconData.map(data => 
        fetch(data)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${data}: ${response.statusText}`);
            }
            return response.json();  // Parse the JSON from the response
        })
        .then(data => {
            if (!data) {
                throw new Error(`GeoJSON data is empty or invalid for ${data}`);
            }
            processGeoJSON(data);  // Call the setMarkers function with the GeoJSON data
        })
        .catch(error => {
            console.error('Error loading the GeoJSON file:', error);  // Handle any errors
        })
    );

    await Promise.all(fetchPromises);
}

/* openstreetmap example
const map = L.map('map').setView([51.505, -0.09], 13);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
*/

const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2
});


const yx = L.latLng;
function xy(x, y) {
    if (Array.isArray(x)) { // When doing xy([x, y]);
        return yx(x[1], x[0]);
    }
    return yx(y, x); // When doing xy(x, y);
}

const bounds = [xy(-1440, -1344), xy(2463, 4095)];
const satellite = L.imageOverlay('./assets/Map.png', bounds);
const chart = L.imageOverlay('./assets/Chart.png', bounds);

satellite.addTo(map);
var baseMaps = {
    "Satellite": satellite,
    "Chart": chart
};

// Add the image overlay to the map (and make sure it's not part of the layer control)
// Define layer control: BaseMaps is our base layer, so one is always displayed.
var layerControl = L.control.layers(baseMaps, {}).addTo(map);

const centre = xy(0, 0);
const mCentre = L.marker(centre).addTo(map).bindPopup('Centre');
map.setView(centre, -5);

let iconSets = {};
const defaultIconSet = new Set(["Airdrop", "Bus", "Listed Locations"]);
loadData()
    .then(() => {
        console.log(iconSets);
        for (let key in iconSets) {
            layer = iconSets[key];
            if (defaultIconSet.has(key)) {
                layer.addTo(map);
            }
        
            layerControl.addOverlay(layer, key);
        }
    })
    .catch(error => {
        console.error('Error processing all GeoJSON files:', error);
    });

// ------------------


/*
const marker = L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();

const circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map).bindPopup('I am a circle.');

const polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map).bindPopup('I am a polygon.');
*/


async function zoneGenerator() {
    const response = await fetch(`./bulkZones.json`);
    const zoneData = (await response.json()).directories;

    let fetchPromises = [];
    
    fetchPromises = zoneData.map(data => 
        fetch(data)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${data}: ${response.statusText}`);
            }
            return response.json();  // Parse the JSON from the response
        })
        .then(data => {
            console.log(data);
            if (!data) {
                throw new Error(`JSON data is empty or invalid for ${data}`);
            }

            const category  = data.category || "default";
            const catStr    = capitalize(category);
            const catConfig = data.config;

            // Ensure the category is defined in the categories object
            if (!zoneSets[category]) {
                zoneSets[category] = L.layerGroup();  // Use a LayerGroup for each category
            }

            data.features.forEach(zone => {
                const p = zone.properties;
                const content = `Category: ${catStr}<br>${p.name}<br>No Weapons: ${p.no_weapons}<br>No Buildables: ${p.no_buildables}`;
                const popup = L.popup().setContent(content);
                zoneSets[category].addLayer(L.circle(xy(zone.coordinates), {
                    color: catConfig.color,
                    fillColor: catConfig.fill,
                    fillOpacity: catConfig.opacity,
                    radius: zone.scale
                }).bindPopup(popup));
            });
        })
        .catch(error => {
            console.error('Error loading the JSON file:', error);  // Handle any errors
        })
    );

    await Promise.all(fetchPromises);
}

let zoneSets = {};
zoneGenerator()
    .then(() => {
        console.log(zoneSets);
        for (let key in zoneSets) {
            layer = zoneSets[key];
            layer.addTo(map);
            layerControl.addOverlay(layer, key);
        }
    })
    .catch(error => {
        console.error('Error processing all GeoJSON files:', error);
    });


function onMapClick(e) {
    L.popup()
        .setLatLng(e.latlng)
        .setContent(`${e.latlng.toString()}`)
        .openOn(map);
}

map.on('click', onMapClick);