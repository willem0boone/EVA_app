import json

def get_map():
    data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [2.581787109375, 52.58302586141648],
                            [2.186279296875, 51.59072264312017],
                            [3.62548828125, 51.85613885029435],
                            [2.581787109375, 52.58302586141648]
                        ]
                    ]
                }
            }
        ]
    }
    return json.dumps(data)
