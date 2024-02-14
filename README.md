# Uses maplibre + deck.gl + nebula.gl

Even though we're using MapLibre, because of history, some libraries refer to mapbox. This is because maplibre was forked from Mapbox (due to licensing issues). Therefore, whenever a MapLibre component/library is not available, an open source mapbox one would usually work.

## TODOs (stuff to experiment with)

- connecting zustand to map state
- Rendering 3D objects on map (threejs)
- keyboard shortcuts / handling for switching modes: https://dev.to/kolot/building-hotkeys-in-react-apps-2p5d and https://v4.mantine.dev/hooks/use-hotkeys/
- Draggable/pinnable panels for UI: https://archive.ph/AegcX#selection-247.55-253.90
- Compare experience with Cesium.js
- Move to local SQLite (Time series (playback) of data, including update map)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
