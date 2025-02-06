# Interactive Map JSON Demo

This repository serves as a template for any map using my interactive map format.

I've re-implemented all the data the California interactive map would load.
The expectation is that all maps loaded on the interactive map would follow
the format presented here. That is, similar file structure.
Ultimately, as long as it is linked to properly via the root
json (which should ideally be named </DirName>/.json).

## NOTES

The only expected data in the root json are definitions for

* bulkIcons
* bulkZones
* iconDefs
* classDefs

Due to the nature of Leaflet's Geojson handling, to my understanding,
zones and icons defined as geojson cannot be parsed in the same way.
For that reason, references to a seperate bulkIcons and bulkZones json are mandatory,
even if nothing is included.

iconDefs defines everything regarding what icons are used.
classDefs defines all classes.

## Config

The config contains more specific information about how the website should behave.
Each property and their range of values, default values (if they exist).
Unless specified optional, all parameters are required.

### initialState

**Type**: Key
The layer that should be loaded by default.

### defaultOn

**Type**: List, *Optional*
Lists all categories that are enabled by default.

### Layers

**Type**: List
Each entry is a name and path to a satelite.

### Bounds

**Type**: Cords
N, S, E, W bounds for the map.

### View

**Type**: Cords, Key *Optional*

* *centre*: XY cords Where view will be anchored on load. Defaults to *(0, 0)*
* *zoom*: Zoom factor. Defaults to *-5*
* "minzoom": Mininum zoom factor. Defaults to *-2*

### Groupings

**Type**: List, *Optional*
Each entry is a list of catagories to group together.
Catagories cannot be in more than one group, and an error will be thrown if violated.

***CURRENTLY NOT IMPLEMENTED!!***

## Feature Collections

Icon placements are pointed to by bulkIcons.
For simplicity, each "Feature Collection" is a singular category.
Every icon in any given catagory do not need to be in the same file,
but every icon in any given file are interpreted as being in the same category.
Icons cannot be in more than one category.
I intend to add "Groups" of categories, but this is not a current priority.

You can specify a "Icon" at a file level or at a feature level.
A file level icon is reqiured for fallback purposes.
If you don't want an icon to be visible, you can set `show_on_map` false.

If a feature colleciton instead defines a "class", it is assumed it is text.
The respective configuration file must be specified in the classDef file.

Any type supported by the
[GeoJson](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1)
standard should theoretically be supported here.
For reference, below I list what I have personally verified to work.

* Point
* LineString
* MultiLineString
