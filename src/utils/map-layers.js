import kankakeeMarsh from "../data/kankakee-marsh.json";
import grandPrairie from "../data/grand-prairie-region.json";
import horiconMarsh from "../data/horicon-marsh.json";
import cairoLake from "../data/cairo-lake.json";
import tensasRiverNws from "../data/tensas-river-nws.json";
import atchafalayaRiver from "../data/atchafalaya-river.json";

export const layers = [
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
          "line-width": 4
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
          "line-width": 4
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
  }
];
