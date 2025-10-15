import argparse
import json
import sys


def parse_coordinates(input_text):
    coords = []
    for line in input_text.strip().splitlines():
        parts = line.strip().split()
        if len(parts) == 2:
            try:
                x, y = map(float, parts)
                coords.append([x, y])
            except ValueError:
                continue  # Skip lines with invalid floats
    return coords


def generate_geojson(coordinates, category, icon):
    features = []
    for coord in coordinates:
        feature = {
            "type": "Point",
            "properties": {"icon": icon, "name": "", "show_on_map": True},
            "coordinates": coord,
        }
        features.append(feature)

    return {
        "type": "FeatureCollection",
        "category": category,
        "icon": icon,
        "features": features,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Generate GeoJSON from coordinate list."
    )
    parser.add_argument(
        "--category", "-c", required=True, help="Category name for GeoJSON"
    )
    parser.add_argument(
        "--icon", "-i", required=True, help="Icon name for GeoJSON features"
    )
    parser.add_argument(
        "--file",
        "-f",
        type=argparse.FileType("r"),
        help="Optional input file with coordinates. If not provided, reads from stdin.",
    )
    parser.add_argument(
        "--output",
        "-o",
        type=argparse.FileType("w"),
        help="Optional output file to save the GeoJSON. If not provided, prints to stdout.",
    )

    args = parser.parse_args()

    # Read coordinate input
    if args.file:
        input_text = args.file.read()
    else:
        print(
            "Reading coordinates from stdin. Press Ctrl+D (or Ctrl+Z on Windows) when done:"
        )
        input_text = sys.stdin.read()

    coordinates = parse_coordinates(input_text)
    geojson_data = generate_geojson(coordinates, args.category, args.icon)

    # Output
    output_json = json.dumps(geojson_data, indent=2)
    if args.output:
        args.output.write(output_json + "\n")
    else:
        print(output_json)


if __name__ == "__main__":
    main()
