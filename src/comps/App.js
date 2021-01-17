import React, { useState, useEffect } from 'react'
import * as THREE from 'three'
import ThreeGlobe from 'three-globe'
import TrackballControls from 'three-trackballcontrols'
import lerp from 'lerp'
import Anim from '../lib/anim'
import { easeInOut } from '../lib/ease-expo'
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
  .polygonStrokeColor(() => '#386781')
  .polygonSideColor(() => '#ace4f9')
  .polygonAltitude(0.01)
  .polygonsTransitionDuration(500)
  .showAtmosphere(false)
  .showGraticules(true)

let date = '2021-01-10'

fetch('http://localhost:3001/?month=2021-01')
  .then(res => res.json())
  .then(res => {
    let dateIndex = 0
    for (let i = 0; i < res.length; i++) {
      if (res[i].date === date) {
        dateIndex = i
        i = res.length
      }
    }

    const highestCaseCountry = Object.keys(res[dateIndex].countries).sort((a, b) =>
      parseInt(res[dateIndex].countries[b]) - parseInt(res[dateIndex].countries[a]))[0]
    const highestCases = res[dateIndex].countries[highestCaseCountry]

    globe.polygonCapColor(country => {
      const intensity = res[dateIndex].countries[country.properties.ISO_A3]
      if (intensity) {
        const red = (intensity / highestCases) * 255
        const green = 255 - red
        return `rgba(${red}, ${green}, 0, 1)`
      }
      return 'rgba(128, 128, 128, 1)'
    })
  })

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

let flight = null
let ms = start

export default function App () {
  const [popup, setPopup] = useState(false)
  const [time, setTime] = useState(start)
  let [select, setSelect] = useState(null)

  function openPopup () {
    setPopup(true)
  }

  function closePopup () {
    setPopup(false)
  }

  function selectCountry (id) {
    setSelect(id)
    select = id
    globe.polygonAltitude(country => {
      if (country.properties.ISO_A3 === id) {
        const p1 = [country.bbox[1], country.bbox[0]]
        const p2 = [country.bbox[3], country.bbox[2]]
        const center = [
          (p1[0] + p2[0]) / 2,
          (p1[1] + p2[1]) / 2
        ]
        flyTo(...center)
        return 0.1
      } else {
        return 0.01
      }
    })
    openPopup()
  }

  function flyTo (lat, lng) {
    const offset = globe.rotation.y / Math.PI * 180
    lng += offset
    const coords = globe.getCoords(lat, lng)
    const point = new THREE.Vector3(coords.x, coords.y, coords.z)
    const camdist = camera.position.length()

    const { x: startX, y: startY, z: startZ } = camera.position
    const start = new THREE.Vector3(startX, startY, startZ)

    camera.position
      .copy(point)
      .normalize()
      .multiplyScalar(camdist)

    const { x: goalX, y: goalY, z: goalZ } = camera.position
    const goal = new THREE.Vector3(goalX, goalY, goalZ)

    camera.position
      .copy(start)
      .normalize()
      .multiplyScalar(camdist)

    flight = { start, goal, anim: Anim(30) }
  }

  function deselectCountry () {
    setSelect(null)
    select = null
    globe.polygonAltitude(0.01)
    closePopup()
  }

  function getProgress () {
    return (time - start) / (end - start) * 100 + '%'
  }

  useEffect(_ => {
    renderer.domElement.addEventListener('click', function onclick (evt) {
      mouse.x = 2 * (evt.clientX / window.innerWidth) - 1
      mouse.y = 1 - 2 * (evt.clientY / window.innerHeight)
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(globe.children, true)
      const target = intersects[0]
      if (target && target.object.geometry.type === 'ConicPolygonBufferGeometry') {
        const feature = target.object.parent.__data.data
        selectCountry(feature.properties.ISO_A3)
      } else {
        deselectCountry()
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
      if (flight) {
        const t = flight.anim.update()
        if (t === -1) {
          flight = null
        } else {
          const x = easeInOut(t)
          camera.position.x = lerp(flight.start.x, flight.goal.x, x)
          camera.position.y = lerp(flight.start.y, flight.goal.y, x)
          camera.position.z = lerp(flight.start.z, flight.goal.z, x)
        }
      } else if (!select && !flight) {
        globe.rotation.y -= 0.005
      }
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
               onClose={deselectCountry} />
      : null}
  </main>
}
