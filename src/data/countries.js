import data from './countries.json'

export default data.features.map(feature => ({
  id: feature.properties.ISO_A3,
  name: feature.properties.NAME,
  latlng: [
    feature.bbox[0] + feature.bbox[2] / 2,
    feature.bbox[1] + feature.bbox[3] / 2
  ]
})).sort()
