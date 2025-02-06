// Consider merging these funcitons.


// Define the setMarkers function
function processGeoJSON(json) {
    const category = json.category || "default";

    // Ensure the category is defined in the categories object
    if (!categories[category]) {
        categories[category] = L.layerGroup();  // Use a LayerGroup for each category
    } 

    L.geoJSON(json, {
        filter: function(feature) {
            return feature.properties.show_on_map;  // Apply your filter logic
        },
        pointToLayer: function(feature, latlng) {
            const popup = L.popup().setContent(`Category: ${category}<br>${feature.properties.name}`);
            const iconName = feature.properties.hasOwnProperty("icon") ? feature.properties.icon : json.icon;

            return L.marker(latlng, {
                icon: icons[iconName]
            }).bindPopup(popup);
        },
        onEachFeature: function (feature, layer) {
            categories[category].addLayer(layer);
        }
    });
}

// Listed & Major Unlisted locations label maker
async function loadLocationNames(json) {
    try {
    const category = json.category || "default";
    // Ensure the category is defined in the categories object
    if (!categories[category]) {
        categories[category] = L.layerGroup();  // Use a LayerGroup for each category
    }

    const classDef = classes[json.class];
    L.geoJSON(json, {
        filter: function(feature) {
            return feature.properties.show_on_map;
        },
        pointToLayer: function(feature, latlng) {
            // Create a custom DivIcon
            let customIcon = L.divIcon({
                className: classDef.class,
                html: feature.properties.title,
                iconSize: classDef.iconSize, // Adjust size based on text length
                iconAnchor: classDef.iconAnchor // Center the icon on the point
            });

            return L.marker(latlng, {
                icon: customIcon
            });
        },
        onEachFeature: function (feature, layer) {
            categories[category].addLayer(layer);
        }
    });

    } catch (error) {
        console.error('Error loading the GeoJSON file:', error);  // Handle any errors
        return Promise.reject(error);  // Return rejected promise in case of an error
    }
}

async function loadIconData(iconPath) {
    const response = await fetch(iconPath);
    const data = (await response.json()).directories;

    let fetchPromises = [];
    
    fetchPromises = data.map(data => 
        fetch(`${assetPath}${data}`)
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
            if (data.hasOwnProperty("class")) {
                loadLocationNames(data);
            } else {
                processGeoJSON(data);  // Call the setMarkers function with the GeoJSON data
            }
        })
        .catch(error => {
            console.error('Error loading the GeoJSON file:', error);  // Handle any errors
        })
    );

    await Promise.all(fetchPromises);
}

async function zoneGenerator(path) {
    const response = await fetch(path);
    const zoneData = (await response.json()).directories;

    let fetchPromises = [];
    
    fetchPromises = zoneData.map(data => 
        fetch(`${assetPath}${data}`)
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
            const catStr    = capitalise(category);
            const catConfig = data.config;

            // Ensure the category is defined in the categories object
            if (!categories[category]) {
                categories[category] = L.layerGroup();  // Use a LayerGroup for each category
            }

            data.features.forEach(zone => {
                const p = zone.properties;
                const content = `Category: ${catStr}<br>${p.name}<br>No Weapons: ${p.no_weapons}<br>No Buildables: ${p.no_buildables}`;
                const popup = L.popup().setContent(content);
                categories[category].addLayer(L.circle(xy(zone.coordinates), {
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