import * as THREE from 'three'
import ThreeGlobe from 'three-globe'
import TrackballControls from 'three-trackballcontrols'
import data from './data/countries.json'
import covid from './data/covid.json'
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  // TO CHANGE
  antialias: false
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement)

// Set up camera
const camera = new THREE.PerspectiveCamera()
camera.aspect = window.outerWidth / window.innerHeight
camera.updateProjectionMatrix()
camera.position.z = 500

var x = Math.floor(Math.random() * 255);
const globe = new ThreeGlobe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-water.png')
  .polygonsData(data.features)
  .polygonCapColor((countries) => {
    /*
    console.log(countries);
    for (i = 0; i < 255; i++) {
      for (j = 0; j < 255; j++) {
        if (countries.features[i].properties.ISO_A3 == "CAN") {
          return 'rgba(0, 255, 0, 1)';
        }
      }
    }
    */
    return 'rgba(255, 0, 0, 1)';
  })
  .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
  .polygonStrokeColor(() => 'rgba(0, 0, 0, 1)')
  .polygonAltitude(0.01)
  .polygonsTransitionDuration(0)
  .showAtmosphere(false)
  //.showGraticules(true)

  const globeMaterial = globe.globeMaterial();
    globeMaterial.bumpScale = 10;
    new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-water.png', texture => {
      globeMaterial.specularMap = texture;
      globeMaterial.specular = new THREE.Color('grey');
      globeMaterial.shininess = 25;
    });

//setTimeout(() => globe.polygonAltitude(() => Math.random()), 4000)

// Set up scene
const scene = new THREE.Scene()
scene.add(globe)
scene.add(new THREE.AmbientLight(0xdddddd))
//scene.add(new THREE.DirectionalLight(0xffffff, 0.6))

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

fetch('http://localhost:3001/?q=foobar')
  .then(res => console.log(res))
