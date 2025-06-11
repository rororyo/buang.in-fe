// Create this file: types/leaflet.d.ts (create the types folder if it doesn't exist)

declare module 'leaflet-defaulticon-compatibility' {
  // This module doesn't export anything, it just modifies leaflet
  const content: any;
  export = content;
}

declare module 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css' {
  const content: any;
  export = content;
}