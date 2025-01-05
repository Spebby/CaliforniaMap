const busIcon = L.icon({
    iconUrl: '/icons/BusIcon.png',
    //shadowUrl: '/icons/BusIcon-Shadow.png',

    iconSize:     [32, 32], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
    shadowAnchor: [32, 32],  // the same for the shadow
    popupAnchor:  [32, 32] // point from which the popup should open relative to the iconAnchor
});

const airdropStartIcon = L.icon({
    iconUrl: '/icons/AirdropStartIcon.png',
    //shadowUrl: '/icons/BusIcon-Shadow.png',

    iconSize:     [48, 48], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
    shadowAnchor: [32, 32],  // the same for the shadow
    popupAnchor:  [32, 32] // point from which the popup should open relative to the iconAnchor
});

const airdropEndIcon = L.icon({
    iconUrl: '/icons/AirdropEndIcon.png',
    //shadowUrl: '/icons/BusIcon-Shadow.png',

    iconSize:     [48, 48], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
    shadowAnchor: [32, 32],  // the same for the shadow
    popupAnchor:  [32, 32] // point from which the popup should open relative to the iconAnchor
});

const mineIcon = L.icon({
    iconUrl: '/icons/MineIcon.png',
    //shadowUrl: '/icons/BusIcon-Shadow.png',

    iconSize:     [32, 32], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
    shadowAnchor: [32, 32],  // the same for the shadow
    popupAnchor:  [32, 32] // point from which the popup should open relative to the iconAnchor
});

const caveIcon = L.icon({
    iconUrl: '/icons/CaveIcon.png',
    //shadowUrl: '/icons/BusIcon-Shadow.png',

    iconSize:     [32, 32], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
    shadowAnchor: [16, 16],  // the same for the shadow
    popupAnchor:  [16, 32] // point from which the popup should open relative to the iconAnchor
});

const bunkerIcon = L.icon({
    iconUrl: '/icons/BunkerIcon.png',
    //shadowUrl: '/icons/BusIcon-Shadow.png',

    iconSize:     [32, 32], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
    shadowAnchor: [16, 16],  // the same for the shadow
    popupAnchor:  [16, 32] // point from which the popup should open relative to the iconAnchor
});


let tagToIcon = {
    "bus": busIcon,
    "airdropStart": airdropStartIcon,
    "airdropEnd": airdropEndIcon,
    "mine": mineIcon,
    "cave": caveIcon
};

let tagToClass = {
    "listed": "listed-location",
    "unlisted": "unlisted-location"
};