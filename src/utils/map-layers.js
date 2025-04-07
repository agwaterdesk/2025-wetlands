import kankakeeMarsh from "../data/kankakee-marsh.json";
import bootheel from "../data/bootheel.json";
import bootheelPolygon from "../data/bootheel-polygon.json";
import grandPrairie from "../data/grand-prairie-region.json";
import horiconMarsh from "../data/horicon-marsh.json";
import cairoLake from "../data/cairo-lake.json";
import tensasRiverNws from "../data/tensas-river-nws.json";
import atchafalayaRiver from "../data/atchafalaya-river.json";
import wetlandsRectangles from "../data/wetland-rectangles.geo.json";
import peatBogs from "../data/peat-bogs.json";

export const layers = [
  {
    source: {
      id: "peat-bogs",
      data: peatBogs
    },
    layers: [
      {
        type: "circle",
        paint: {
          "circle-color": "#F1B82D",
          "circle-radius": 2.5,
          "circle-opacity": 1,
          "circle-stroke-width": 1
        },
        layout: {
          "visibility": "visible"
        }
      }
    ]
  },
  {
    source: {
      id: "kankakee-marsh",
      data: kankakeeMarsh,
    },
    layers: [
      {
        type: "fill",
        paint: {
          "fill-color": "#F1B82D",
          "fill-opacity": 0,
        },
      },
      {
        type: "line",
        paint: {
          "line-color": "#F1B82D",
          "line-width": 4,
        },
      },
    ],
  },
  {
    source: {
      id: "bootheel",
      data: bootheel,
    },
    layers: [
      {
        type: "line",
        paint: {
          "line-color": "#F1B82D",
          "line-width": 4,
        },
      },
    ],
  },
  {
    source: {
      id: "bootheel-polygon",
      data: bootheelPolygon,
    },
    layers: [
      {
        type: "fill",
        paint: {
          "fill-color": "#F1B82D",
          "fill-opacity": 0,
        },
      },
      {
        type: "line",
        paint: {
          "line-color": "#F1B82D",
          "line-width": 4,
        },
      },
    ],
  },
  {
    source: {
      id: "grand-prairie-region",
      data: grandPrairie,
    },
    layers: [
      {
        type: "fill",
        paint: {
          "fill-color": "#F1B82D",
          "fill-opacity": 0,
        },
      },
      {
        type: "line",
        paint: {
          "line-color": "#F1B82D",
          "line-width": 4,
        },
      },
    ],
  },
  {
    source: {
      id: "horicon-marsh",
      data: horiconMarsh,
    },
    layers: [
      {
        type: "fill",
        paint: {
          "fill-color": "#F1B82D",
          "fill-opacity": 0,
        },
      },
      {
        type: "line",
        paint: {
          "line-color": "#F1B82D",
          "line-width": 4,
        },
      },
    ],
  },
  {
    source: {
      id: "cairo-lake",
      data: cairoLake,
    },
    layers: [
      {
        type: "fill",
        paint: {
          "fill-color": "#F1B82D",
          "fill-opacity": 0,
        },
      },
      {
        type: "line",
        paint: {
          "line-color": "#F1B82D",
          "line-width": 4,
        },
      },
    ],
  },
  {
    source: {
      id: "tensas-river-nws",
      data: tensasRiverNws,
    },
    layers: [
      {
        type: "fill",
        paint: {
          "fill-color": "#F1B82D",
          "fill-opacity": 0,
        },
      },
      {
        type: "line",
        paint: {
          "line-color": "#F1B82D",
          "line-width": 4,
        },
      },
    ],
  },
  {
    source: {
      id: "atchafalaya-river",
      data: atchafalayaRiver,
    },
    layers: [
      {
        type: "line",
        paint: {
          "line-color": "#B9DAF3",
          "line-width": 4,
        },
      },
    ],
  },
  {
    source: {
      id: "original-wetlands",
      data: {
        ...wetlandsRectangles,
        features: [wetlandsRectangles.features[0]],
      },
    },
    layers: [
      {
        type: "fill",
        paint: {
          "fill-color": "#F1B82D",
          "fill-opacity": 0.6,
        },
      },
      {
        type: "line",
        paint: {
          "line-color": "#F1B82D",
          "line-width": 2,
        },
      },
    ],
  },
  {
    source: {
      id: "remaining-wetlands",
      data: {
        ...wetlandsRectangles,
        features: [wetlandsRectangles.features[1]],
      },
    },
    layers: [
      {
        type: "fill",
        paint: {
          "fill-color": "#333333",
          "fill-opacity": 0.4,
        },
      },
      {
        type: "line",
        paint: {
          "line-color": "#333333",
          "line-width": 2,
        },
      },
    ],
  },
];
