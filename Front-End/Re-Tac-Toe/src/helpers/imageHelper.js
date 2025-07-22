import bellsprout from "../assets/avatars/Bellsprout.png"
import diglett from "../assets/avatars/Diglett.png"
import duskull from "../assets/avatars/Duskull.png"
import gastly from "../assets/avatars/Gastly.png"
import gloom from "../assets/avatars/Gloom.png"
import jigglypuff from "../assets/avatars/Jigglypuff.png"
import marill from "../assets/avatars/Marill.png"
import meowth from "../assets/avatars/Meowth.png"
import munchlax from "../assets/avatars/Munchlax.png"
import oddish from "../assets/avatars/Oddish.png"
import pikachu from "../assets/avatars/Pikachu.png"
import psyduck from "../assets/avatars/Psyduck.png"
import staryu from "../assets/avatars/Staryu.png"
import voltorb from "../assets/avatars/Voltorb.png"

const imageMap = {
  "Bellsprout.png": bellsprout,
  "Diglett.png": diglett,
  "Duskull.png": duskull,
  "Gastly.png": gastly,
  "Gloom.png": gloom,
  "Jigglypuff.png": jigglypuff,
  "Marill.png": marill,
  "Meowth.png": meowth,
  "Munchlax.png": munchlax,
  "Oddish.png": oddish,
  "Pikachu.png": pikachu,
  "Psyduck.png": psyduck,
  "Staryu.png": staryu,
  "Voltorb.png": voltorb,
}

const imageNames = Object.keys(imageMap)

export function getRandomImageName() {
  const randomIdx = Math.floor(Math.random() * imageNames.length)
  return imageNames[randomIdx]
}

export function startImageGenerator(callback, interval = 999) {
  callback(getRandomImageName())
  
  const intervalId = setInterval(() => {
    const newImageName = getRandomImageName()
    callback(newImageName)
  }, interval)

  return () => clearInterval(intervalId)
}

export function resolveImage(name) {
  return imageMap[name] || pikachu
}
