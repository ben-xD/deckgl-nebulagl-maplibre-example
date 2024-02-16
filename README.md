# Uses maplibre + deck.gl + nebula.gl

Even though we're using MapLibre, because of history, some libraries refer to mapbox. This is because maplibre was forked from Mapbox (due to licensing issues). Therefore, whenever a MapLibre component/library is not available, an open source mapbox one would usually work.

This repo reproduces some errors/issues I faced using deck.gl, nebula.gl and maplibre in other branches.

## Some learnings
- Either use deck.gl or `@deck.gl/*` packages. deck.gl has all of them. Same of nebula.gl. See https://github.com/maplibre/maplibre-gl-js/issues/2834#issuecomment-1627785928
  - I couldn't find the TS types for deck.gl stuff from `deck.gl` though
- there were conflicts with using @deck.gl/*/typed vs "@danmarshall/deckgl-typings": "^4.9.28", types