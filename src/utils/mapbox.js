const defaultDuration = 1000;

// Helper to check if string is coordinates
function isCoordinates(str) {
  if (typeof str !== 'string') return false;
  const parts = str.split(',').map(Number);
  return parts.length === 2 && !parts.some(isNaN);
}

// Helper to check if string is bbox
function isBBox(str) {
  if (typeof str !== 'string') return false;
  const parts = str.split(',').map(Number);
  return parts.length === 4 && !parts.some(isNaN);
}

// Get bounds of a GeoJSON layer
function getLayerBounds(geojson) {
  const coords = geojson.features[0].geometry.coordinates[0];
  const bounds = coords.reduce((bounds, coord) => {
    return [
      [Math.min(bounds[0][0], coord[0]), Math.min(bounds[0][1], coord[1])],
      [Math.max(bounds[1][0], coord[0]), Math.max(bounds[1][1], coord[1])]
    ];
  }, [[coords[0][0], coords[0][1]], [coords[0][0], coords[0][1]]]);
  return bounds;
}

export function convertBBoxToCoords(bbox) {
	let numbers;
	if (typeof bbox == 'string') {
		numbers = bbox.split(',').map((d) => Number(d.replace(/[^\d.-]/g, '')));
	} else {
		numbers = bbox;
	}

	// Check if the array length is exactly four for a valid bbox
	if (numbers.length !== 4) {
		throw new Error('Invalid bbox format');
	}

	// Create the coordinate pair for Mapbox
	const coords = [
		[numbers[0], numbers[1]],
		[numbers[2], numbers[3]]
	];

	return coords;
}

export function flyToLocation({
  map,
  target,
  duration = defaultDuration,
  padding = { top: 100, bottom: 100, left: 100, right: 100 },
  zoom = 16
}) {
  if (!target) return;

  if (isCoordinates(target)) {
    const coords = target.split(',').map(Number).reverse();
    if (duration === 0) {
      map.jumpTo({
        center: coords,
        zoom,
        essential: true
      });
    } else {
      map.flyTo({
        center: coords,
        zoom,
        essential: true,
        duration
      });
    }
  } 
  else if (isBBox(target)) {
    const bbox = convertBBoxToCoords(target);
    map.fitBounds(bbox, {
      padding,
      duration: duration || 0
    });
  }
  else if (map.getSource(target)) {
    // If target is a layer ID, fly to its bounds
    const source = map.getSource(target);
    const data = source._data; // Get the GeoJSON data
    const bounds = getLayerBounds(data);
    map.fitBounds(bounds, {
      padding,
      duration: duration || 0
    });
  }
}

export function showLayer({
  map,
  layerId,
  duration = defaultDuration
}) {
  // Handle compound layers (like kankakee-marsh which has fill and line)
  const layers = [`${layerId}-fill`, `${layerId}-line`];
  
  layers.forEach(layer => {
    if (map.getLayer(layer)) {
      map.setLayoutProperty(layer, 'visibility', 'visible');
    }
  });

  // If it's a single layer, try showing that
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', 'visible');
  }
}

export function hideLayer({
  map,
  layerId,
  duration = defaultDuration
}) {
  const layers = [`${layerId}-fill`, `${layerId}-line`];
  
  layers.forEach(layer => {
    if (map.getLayer(layer)) {
      map.setLayoutProperty(layer, 'visibility', 'none');
    }
  });

  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', 'none');
  }
}