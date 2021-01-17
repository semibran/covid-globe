import React, { useState, useEffect } from 'react'
import * as THREE from 'three'
import ThreeGlobe from 'three-globe'
import TrackballControls from 'three-trackballcontrols'
import Popup from './Popup'
import config from '../config'
import data from '../data/countries.json'
import covid from '../data/covid.json'

const start = Date.parse(config.startDate)
const end = Date.parse(config.endDate)

// Set up renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
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

// Set up camera controls
const controls = new TrackballControls(camera, renderer.domElement)
controls.minDistance = 150
controls.rotateSpeed = 1.75
controls.zoomSpeed = 0.8

const globe = new ThreeGlobe()
  .globeImageUrl('//i.imgur.com/Uiwi43V.png')
  .polygonsData(data.features)
  .polygonCapColor(country => {
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
    return 'rgba(255, 0, 0, 1)'
  })
  .polygonStrokeColor(() => '#386781')
  .polygonSideColor(() => '#ace4f9')
  .polygonAltitude(0.01)
  .polygonsTransitionDuration(500)
  .showAtmosphere(false)
  .showGraticules(true)

// Set up scene
const scene = new THREE.Scene()
scene.add(globe)
scene.add(new THREE.AmbientLight(0xffffff))

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const globeMaterial = globe.globeMaterial()
globeMaterial.bumpScale = 10
new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-water.png', texture => {
  globeMaterial.specularMap = texture
  globeMaterial.specular = new THREE.Color('white')
})

export default function App () {
  const [select, setSelect] = useState(null)
  const [popup, setPopup] = useState(false)
  const [time, setTime] = useState(start)
  let ms = start

  function openPopup () {
    setPopup(true)
  }

  function closePopup () {
    setPopup(false)
    setSelect(null)
  }

  function selectCountry (id) {
    globe.polygonAltitude(country => {
      if (country.properties.ISO_A3 === id) {
        return 0.1
      } else {
        return 0.01
      }
    })
    setSelect(id)
    openPopup()
  }

  function getProgress () {
    return (time - start) / (end - start) * 100 + '%'
  }

  useEffect(_ => {
    renderer.domElement.addEventListener('click', function onclick (evt) {
      mouse.x = 2 * (evt.clientX / window.innerWidth) - 1
      mouse.y = 1 - 2 * (evt.clientY / window.innerHeight)
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects([globe.parent], true)
      const target = intersects.find(target => target.object.geometry.type === 'ConicPolygonBufferGeometry')
      if (target) {
        const feature = target.object.parent.__data.data
        console.log(feature.properties.NAME)
        selectCountry(feature.properties.ISO_A3)
      } else {
        globe.polygonAltitude(0.01)
        closePopup()
      }
    }, true)

    setInterval(function update () {
      ms += config.step
      if (ms >= end) {
        ms = start
      }
      setTime(ms)
    }, config.interval)

    requestAnimationFrame(function animate () {
      globe.rotation.y -= 0.005
      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    })
  }, [])

  return <main className='app'>
    <h1>COVID-19 Worldwide</h1>
    <button onClick={openPopup} className='button material-icons-round'>launch</button>
    <div className='bar'>
      <div className='bar-progress'
           style={{ width: getProgress() }}></div>
    </div>
    {popup
      ? <Popup select={select}
               onChange={evt => selectCountry(evt.target.value)}
               onClose={closePopup} />
      : null}
  </main>
}
