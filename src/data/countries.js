import data from './countries.json'

export default data.features.map(feature => feature.properties.NAME).sort()
