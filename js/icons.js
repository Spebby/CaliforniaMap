const busIcon = L.icon({
    iconUrl: './assets/icons/BusIcon.png',
    //shadowUrl: 'assets/icons/BusIcon-Shadow.png',

    iconSize:     [32, 32], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
    shadowAnchor: [32, 32],  // the same for the shadow
    popupAnchor:  [32, 32] // point from which the popup should open relative to the iconAnchor
});

const airdropStartIcon = L.icon({
    iconUrl: './assets/icons/AirdropStartIcon.png',
    //shadowUrl: 'assets/icons/BusIcon-Shadow.png',

    iconSize:     [48, 48], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
    shadowAnchor: [32, 32],  // the same for the shadow
    popupAnchor:  [32, 32] // point from which the popup should open relative to the iconAnchor
});

const airdropEndIcon = L.icon({
    iconUrl: './assets/icons/AirdropEndIcon.png',
    //shadowUrl: 'assets/icons/BusIcon-Shadow.png',

    iconSize:     [48, 48], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
    shadowAnchor: [32, 32],  // the same for the shadow
    popupAnchor:  [32, 32] // point from which the popup should open relative to the iconAnchor
});

const mineIcon = L.icon({
    iconUrl: './assets/icons/MineIcon.png',
    //shadowUrl: 'assets/icons/BusIcon-Shadow.png',

    iconSize:     [32, 32], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
    shadowAnchor: [32, 32],  // the same for the shadow
    popupAnchor:  [32, 32] // point from which the popup should open relative to the iconAnchor
});

const caveIcon = L.icon({
    iconUrl: './assets/icons/CaveIcon.png',
    //shadowUrl: 'assets/icons/BusIcon-Shadow.png',

    iconSize:     [32, 32], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
    shadowAnchor: [16, 16],  // the same for the shadow
    popupAnchor:  [16, 32] // point from which the popup should open relative to the iconAnchor
});

const bunkerIcon = L.icon({
    iconUrl: './assets/icons/BunkerIcon.png',
    //shadowUrl: 'assets/icons/BusIcon-Shadow.png',

    iconSize:     [32, 32], // size of the icon
    shadowSize:   [32, 32], // size of the shadow
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
    shadowAnchor: [16, 16],  // the same for the shadow
    popupAnchor:  [16, 32] // point from which the popup should open relative to the iconAnchor
});

const wellIcon = L.icon({
    iconUrl: './assets/icons/WellIcon.png',
    //shadowUrl: 'assets/icons/BusIcon-Shadow.png',

    iconSize:     [16, 16], // size of the icon
    shadowSize:   [16, 16], // size of the shadow
    iconAnchor:   [8, 8], // point of the icon which will correspond to marker's location
    shadowAnchor: [8, 8],  // the same for the shadow
    popupAnchor:  [8, 16] // point from which the popup should open relative to the iconAnchor
});


let tagToIcon = {
    "bus": busIcon,
    "airdropStart": airdropStartIcon,
    "airdropEnd": airdropEndIcon,
    "mine": mineIcon,
    "cave": caveIcon,
    "bunker": bunkerIcon,
    "well": wellIcon
};

let tagToClass = {
    "listed": "listed-location",
    "unlisted": "unlisted-location"
};