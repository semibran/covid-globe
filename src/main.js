import * as THREE from 'three'
import ThreeGlobe from 'three-globe'
import TrackballControls from 'three-trackballcontrols'

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera()
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
camera.position.z = 500

const globe = new ThreeGlobe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')

const scene = new THREE.Scene()
scene.add(globe)
scene.add(new THREE.AmbientLight(0xbbbbbb))
scene.add(new THREE.DirectionalLight(0xffffff, 0.6))

const controls = new TrackballControls(camera, renderer.domElement)
controls.minDistance = 101
controls.rotateSpeed = 4
controls.zoomSpeed = 0.8

requestAnimationFrame(function animate () {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
})
