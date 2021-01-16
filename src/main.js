import * as THREE from 'three'
import ThreeGlobe from 'three-globe'
import TrackballControls from 'three-trackballcontrols'
import data from './data/countries.json'
const renderer = new THREE.WebGLRenderer({
  antialias: false
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Set up camera
const camera = new THREE.PerspectiveCamera()
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
camera.position.z = 500

const globe = new ThreeGlobe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
  .polygonData(data.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
  .polygonCapColor(() => 'rgba(200, 0, 0, 0.7)')
  .polygonSideColor(() => 'rgba(0, 200, 0, 0.1)')
  .polygonStrokeColor(() => '#111')

setTimeout(() => globe.polygonAltitude(() => Math.random()), 4000)

// Set up scene
const scene = new THREE.Scene()
scene.add(globe)
scene.add(new THREE.AmbientLight(0xbbbbbb))
scene.add(new THREE.DirectionalLight(0xffffff, 0.6))

// Set up camera controls
const controls = new TrackballControls(camera, renderer.domElement)
controls.minDistance = 101
controls.rotateSpeed = 4
controls.zoomSpeed = 0.8

requestAnimationFrame(function animate () {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
})
