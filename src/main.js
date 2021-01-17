import React from 'react'
import ReactDOM from 'react-dom'
import App from './comps/App'

ReactDOM.render(<App/>, document.getElementById('root'))

// Set up renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  // TO CHANGE
  antialias: false
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xf3f3f3, 1)
document.body.appendChild(renderer.domElement)

// Set up camera
const camera = new THREE.PerspectiveCamera()
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
camera.position.z = 400

const globe = new ThreeGlobe()
  .globeImageUrl('//i.imgur.com/Uiwi43V.png')
  .polygonsData(data.features)
  /*.polygonCapColor(country => {
    
    for (let i = 0; i < covid.length; i++) {
      if (country.properties.ISO_A3 === covid[i].ISO_A3) {
        const intensity = covid[i].intensity
        if (intensity < 0.25) {
          return 'rgba(0, 255, 0, 1)'
        } else if (intensity < 0.75) {
          return 'rgba(255, 255, 0, 1)'
        } else {
          return 'rgba(255, 0, 0, 1)'
        }
      }
    }
    const group = globe.polygonGeoJsonGeometry(country.geometry)
    console.log(group.children[0])
    group.children[0].children[0].userData.countryCode = country.properties.ISO_A3
    return 'rgba(255, 0, 0, 1)'
  })*/
  .polygonStrokeColor(() => '#386781')
  .polygonSideColor(() => '#ace4f9')
  .polygonAltitude(0.01)
  .polygonsTransitionDuration(0)
  .showAtmosphere(false)
  .showGraticules(true)

let date = '2020-03-31'

fetch('http://localhost:3001/?month=2020-03')
  .then(res => res.json())
  .then(res => {
    let dateIndex = 0
    for (let i = 0; i < res.length; i++) {
      if (res[i].date === date) {
        dateIndex = i
        i = res.length
      }
    }

    console.log(res[30].countries)

    const highestCaseCountry = Object.keys(res[dateIndex].countries).sort((a, b) =>
      parseInt(res[dateIndex].countries[b]) - parseInt(res[dateIndex].countries[a]))[0]
    const highestCases = res[dateIndex].countries[highestCaseCountry]

    globe.polygonCapColor(country => {
      const intensity = res[dateIndex].countries[country.properties.ISO_A3]
      if (intensity < highestCases * 0.1) {
        return 'rgba(0, 255, 0, 1)'
      } else if (intensity < highestCases * 0.25) {
        return 'rgba(255, 255, 0, 1)'
      } else if (intensity) {
        return 'rgba(255, 0, 0, 1)'
      }
      return 'rgba(0, 0, 0, 1)'
    })
  })

let group
const raycast = new THREE.Raycaster()
renderer.domElement.addEventListener('click', onclick, true)

function onclick () {
  const mouse = new THREE.Vector2()
  raycast.setFromCamera(mouse, camera)

  if (!group) {
    group = globe.polygonGeoJsonGeometry(data.features[0].geometry)
  }

  const intersects = raycast.intersectObjects([group], true)
  const target = intersects.find(target => target.object.geometry.type === 'ConicPolygonBufferGeometry')
  if (target) {
    console.log(target.object.parent.__data.data.properties.NAME)
  }
}

const globeMaterial = globe.globeMaterial()
globeMaterial.bumpScale = 10
new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-water.png', texture => {
  globeMaterial.specularMap = texture
  globeMaterial.specular = new THREE.Color('white')
})

// Set up scene
const scene = new THREE.Scene()
scene.add(globe)
scene.add(new THREE.AmbientLight(0xffffff))
// scene.add(new THREE.DirectionalLight(0xffffff, 0.6))

// Set up camera controls
const controls = new TrackballControls(camera, renderer.domElement)
controls.minDistance = 150
controls.rotateSpeed = 1.75
controls.zoomSpeed = 0.8

requestAnimationFrame(function animate () {
  // globe.rotation.y += 0.005
  // globe.rotation.x += 0.005
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
})



// fetch('http://localhost:3001/?country=CAN')
//   .then(res => res.json())
//   .then(res => console.log(res))
