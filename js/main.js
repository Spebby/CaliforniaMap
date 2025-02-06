const assetPath = "./California/"

const yx = L.latLng;
function xy(x, y) {
    if (Array.isArray(x)) { // When doing xy([x, y]);
        return yx(x[1], x[0]);
    }
    return yx(y, x); // When doing xy(x, y);
}

function capitalise(str) {
    if (!str) return str; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function fetchData(path) {
    const response = await fetch(path);
    return await response.json();
}

async function initIconClass() {
    fetchData(`${assetPath}${ROOT.classDefs}`).then(data => {
        Object.keys(data).forEach(key => {
            classes[key] = data[key];
        });
    });
    fetchData(`${assetPath}${ROOT.iconDefs}`).then(data => {
        Object.keys(data).forEach(key => {
            const def = data[key];
            icons[key] = L.icon({
                iconUrl: `${assetPath}${def.path}`,
                //shadowUrl: 'assets/icons/BusIcon-Shadow.png',
            
                iconSize:     def.iconSize, // size of the icon
                shadowSize:   def.shadowSize, // size of the shadow
                iconAnchor:   def.iconAnchor, // point of the icon which will correspond to marker's location
                shadowAnchor: def.shadowAnchor,  // the same for the shadow
                popupAnchor:  def.popupAnchor // point from which the popup should open relative to the iconAnchor
            });
        });
    });
}


const letPath = `${assetPath}California.json`;
let ROOT = null;
let CONFIG = null;
let VIEW = null;

var classes = [];
var icons   = [];

var categories = {};

fetchData(letPath).then(data => {
    ROOT   = data;
    CONFIG = ROOT.config;
    VIEW   = CONFIG.view;
    initIconClass().then(() => {
        main();
    });
});

function main() {
    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: VIEW.hasOwnProperty("minzoom") ? VIEW.minzoom : -2
    });

    var layerControl = null;
    {
        const bounds = [xy(CONFIG.bounds.w, CONFIG.bounds.s), xy(CONFIG.bounds.e, CONFIG.bounds.n)];
        var overlay = {};
        CONFIG.layers.forEach(layer => {
            overlay[layer.name] = L.imageOverlay(`${assetPath}${layer.path}`, bounds);
        });
        overlay[CONFIG.initialState].addTo(map);
        layerControl = L.control.layers(overlay, {}).addTo(map);
    }

    // Add the image overlay to the map (and make sure it's not part of the layer control)
    // Define layer control: BaseMaps is our base layer, so one is always displayed.

    L.marker(xy(0, 0)).addTo(map).bindPopup('Centre');
    const centre = VIEW.hasOwnProperty("centre") ? xy(VIEW.centre[0], VIEW.centre[1]) : xy(0, 0);
    const zoom   = VIEW.hasOwnProperty("zoom") ? VIEW.zoom : -5;
    map.setView(centre, zoom);


    let promises = [];

    promises.push(loadIconData(`${assetPath}${ROOT.bulkIcons}`)
        .then(() => {
            console.log(categories);
        })
        .catch(error => {
            console.error('Error processing all GeoJSON files:', error);
        }));

    // ------------------

    promises.push(zoneGenerator(`${assetPath}${ROOT.bulkZones}`)
        .then(() => {
            console.log(categories);
        })
        .catch(error => {
            console.error('Error processing all GeoJSON files:', error);
        }));

    // Setup Layers
    const defaultSet = CONFIG.defaultOn;
    Promise.all(promises)
        .then(() => {
            console.log(categories);

            let sortedKeys = ["Listed Locations", "Unlisted Locations", ...Object.keys(categories).sort().filter(key => !["Listed Locations", "Unlisted Locations"].includes(key))];
            sortedKeys.forEach(key => {
                let layer = categories[key];
                if (defaultSet.includes(key)) {
                    layer.addTo(map);
                }
                layerControl.addOverlay(layer, key);
            });
        })
        .catch(error => {
            console.log('Error processing all layers:', error);
        });



    function onMapClick(e) {
        L.popup()
            .setLatLng(e.latlng)
            .setContent(`${e.latlng.toString()}`)
            .openOn(map);
    }

    map.on('click', onMapClick);
}