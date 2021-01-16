import * as THREE from 'three'
import ThreeGlobe from 'three-globe'
import TrackballControls from 'three-trackballcontrols'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './comps/App'
import data from './data/countries.json'
import covid from './data/covid.json'

ReactDOM.render(<App/>, document.getElementById('root'))

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
camera.aspect = window.outerWidth / window.innerHeight
camera.updateProjectionMatrix()
camera.position.z = 500

const globe = new ThreeGlobe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-water.png')
  .polygonsData(data.features)
  .polygonCapColor((country) => {
    for (i = 0; i < covid.length; i++) {
      if (country.properties.ISO_A3 == covid[i].ISO_A3) {
        let intensity = covid[i].intensity;
        if (intensity < 0.25) {
          return 'rgba(0, 255, 0, 1)';
        } else if (intensity < 0.75) {
          return 'rgba(255, 255, 0, 1)';
        } else {
          return 'rgba(255, 0, 0, 1)';
        }
      }
    }
    return 'rgba(255, 0, 0, 1)';
  })
  .polygonStrokeColor(() => 'rgba(0, 0, 0, 0.25)')
  .polygonSideColor(() => 'rgba(200, 200, 200, 1)')
  .polygonAltitude(0.01)
  .polygonsTransitionDuration(0)
  .showAtmosphere(false)
  // .showGraticules(true)

  const globeMaterial = globe.globeMaterial();
    globeMaterial.bumpScale = 10;
    new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-water.png', texture => {
      globeMaterial.specularMap = texture;
      globeMaterial.specular = new THREE.Color('white');
      
    });

// setTimeout(() => globe.polygonAltitude(() => Math.random()), 4000)

// Set up scene
const scene = new THREE.Scene()
scene.add(globe)
scene.add(new THREE.AmbientLight(0xffffff))
//scene.add(new THREE.DirectionalLight(0xffffff, 0.6))

// Set up camera controls
const controls = new TrackballControls(camera, renderer.domElement)
controls.minDistance = 101
controls.rotateSpeed = 4
controls.zoomSpeed = 0.8

requestAnimationFrame(function animate () {
  globe.rotation.y -= 0.001
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
})

fetch('http://localhost:3001/?q=foobar')
  .then(res => res.json())
  .then(res => console.log(res))
