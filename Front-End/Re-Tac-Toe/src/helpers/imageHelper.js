import duskull from "../assets/avatars/Duskull.png";
import marill from "../assets/avatars/Marill.png";
import meowth from "../assets/avatars/Meowth.png";
import pikachu from "../assets/avatars/Pikachu.png";
import voltorb from "../assets/avatars/Voltorb.png";

const imageMap = {
  "Duskull.png": duskull,
  "Marill.png": marill,
  "Meowth.png": meowth,
  "Pikachu.png": pikachu,
  "Voltorb.png": voltorb,
}

const imageNames = Object.keys(imageMap)

export function getRandomImageName() {
  const randomIdx = Math.floor(Math.random() * imageNames.length);
  return imageNames[randomIdx];
}

export function resolveImage(name) {
  return imageMap[name] || pikachu; 
}
