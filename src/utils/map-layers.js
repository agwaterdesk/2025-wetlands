import kankakeeMarsh from "../data/kankakee-marsh.json";
import grandPrairie from "../data/grand-prairie-region.json";

export const layers = [
  {
    source: {
      id: 'kankakee-marsh',
      data: kankakeeMarsh
    },
    layers: [
      {
        type: 'fill',
        paint: {
          'fill-color': '#00854B',
          'fill-opacity': 0.3
        }
      },
      {
        type: 'line',
        paint: {
          'line-color': '#00854B',
          'line-width': 2
        }
      }
    ]
  },
  {
    source: {
      id: 'grand-prairie-region',
      data: grandPrairie
    },
    layers: [
      {
        type: 'fill',
        paint: {
          'fill-color': '#B85450',
          'fill-opacity': 0.3
        }
      },
      {
        type: 'line',
        paint: {
          'line-color': '#B85450',
          'line-width': 2
        }
      }
    ]
  }
]; 