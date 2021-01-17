import data from './countries.json'

export default data.features.map(feature => ({
  id: feature.properties.ISO_A3,
  name: feature.properties.NAME
})).sort()
