import geopandas as gpd
import shapely
from shapely.geometry import shape
from shapely.ops import unary_union
from shapely import box
import json

def create_hex_grid_from_geojson(geojson_geometry, grid_size, crs="EPSG:32631"):
    """
    Generate a hexagonal grid clipped to a GeoJSON geometry.

    Parameters:
        geojson_geometry: dict (GeoJSON geometry, e.g. Polygon or MultiPolygon)
        grid_size: float (distance from center to corner of hexagons, in CRS units)
        crs: str or CRS object (default EPSG:32631)

    Returns:
        GeoDataFrame with 'geometry' and 'grid_id'
    """
    # Convert GeoJSON geometry to Shapely
    geom = shape(geojson_geometry)

    # Wrap in GeoDataFrame and set CRS
    gdf = gpd.GeoDataFrame(geometry=[geom], crs=crs)

    # Get bounds for grid extent
    minx, miny, maxx, maxy = gdf.total_bounds

    # Calculate spacing for hexagons
    dx = grid_size * 3 ** 0.5  # horizontal spacing
    dy = grid_size * 1.5       # vertical spacing

    # Generate hex grid
    hexes = []
    x = minx
    row = 0
    while x < maxx + dx:
        y = miny - dy if row % 2 else miny
        while y < maxy + dy:
            hexagon = shapely.geometry.Polygon([
                (
                    x + grid_size * shapely.math.cos(angle),
                    y + grid_size * shapely.math.sin(angle)
                )
                for angle in [shapely.math.radians(a) for a in range(0, 360, 60)]
            ])
            hexes.append(hexagon)
            y += dy
        x += dx
        row += 1

    grid = gpd.GeoDataFrame(geometry=hexes, crs=crs)

    # Clip the grid to input shape
    clipped = gpd.clip(grid, gdf)
    clipped["grid_id"] = range(1, len(clipped) + 1)
    return clipped
