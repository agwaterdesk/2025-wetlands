import kankakeeMarsh from "../data/kankakee-marsh.json";
import grandPrairie from "../data/grand-prairie-region.json";
import horiconMarsh from "../data/horicon-marsh.json";

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
          'fill-color': '#B85450',
          'fill-opacity': 0
        }
      },
      {
        type: 'line',
        paint: {
          'line-color': '#B85450',
          'line-width': 6
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
          'fill-opacity': 0
        }
      },
      {
        type: 'line',
        paint: {
          'line-color': '#B85450',
          'line-width': 6
        }
      }
    ]
  },
  {
    source: {
      id: 'horicon-marsh',
      data: horiconMarsh
    },
    layers: [
      {
        type: 'fill',
        paint: {
          'fill-color': '#B85450',
          'fill-opacity': 0
        }
      },
      {
        type: 'line',
        paint: {
          'line-color': '#B85450',
          'line-width': 6
        }
      }
    ]
  },
]; 