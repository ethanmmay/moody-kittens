/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = []
let kitten = {}
catNames = []

/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()
  let form = event.target

  let name = form.name.value
  if (catNames.indexOf(name) !== -1) {
    alert("You already had a cat named " + name)
    saveKittens()
    form.reset()
  } else {
    let img = "https://robohash.org/" + name + "?set=set4"

    kitten = kittens.find(kitten => kitten.name == name)

    if (!kitten) {
      kitten = {
        id: generateId(),
        name: name,
        img: img,
        affection: 5,
        mood: "tolerant",
        favorite: false
      }
      kittens.push(kitten)
    }

    catNames.push(kitten.name)
    saveKittens()
    form.reset()
  }
}


/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  window.localStorage.setItem("catNames", JSON.stringify(catNames))
  drawKittens()
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let kittenData = JSON.parse(window.localStorage.getItem("kittens"))
  if (kittenData) {
    kittens = kittenData
  }
  let catNameData = JSON.parse(window.localStorage.getItem("catNames"))
  if (catNameData) {
    catNames = catNameData
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let template = ""

  kittens.forEach(kitten => {
    if (kitten.favorite == false) {
      template += `
      <div class="card mt-1 mb-1 kitten container" id="${kitten.id}">
        <div class="d-flex space-between">
          <img class="" src = "${kitten.img}" height="100px" alt="${kitten.name}">
        </div>
        <div class="mt-2">
            <span class="bold">Name: </span>
            <span>${kitten.name}</span>
        </div>
        <div class="">
            <span class="bold">Mood: </span>
            <span>${kitten.mood}</span>
        </div>
        <div class="">
            <span class="bold">Affection: </span>
            <span>${kitten.affection}</span>
        </div>
        <div class="d-flex space-between mt-2">
          <button class="red" onclick = "pet('${kitten.id}', '${kitten.affection}', '${kitten.mood}')">Pet</button>
          <button class="align-right" onclick = "catnip('${kitten.id}')">Catnip</button>
        </div>
      </div>
      `
    } else {
      template += `
      <div class="card mt-1 mb-1 kitten container favorite" id="${kitten.id}">
        <div class="d-flex space-between">
          <img class="" src = "${kitten.img}" height="100px" alt="${kitten.name}">
        </div>
        <div class="mt-2">
            <span class="bold">Name: </span>
            <span>${kitten.name}</span>
        </div>
        <div class="">
            <span class="bold">Mood: </span>
            <span>${kitten.mood}</span>
        </div>
        <div class="">
            <span class="bold">Affection: </span>
            <span>${kitten.affection}</span>
        </div>
        <div class="d-flex space-between mt-2">
          <button class="red" onclick = "pet('${kitten.id}', '${kitten.affection}', '${kitten.mood}')">Pet</button>
          <button class="align-right" onclick = "catnip('${kitten.id}')">Catnip</button>
        </div>
      </div>
      `
    }
  })
  document.getElementById("kittens").innerHTML = template
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  let index = kittens.findIndex(kitten => kitten.id == id)
  if (index == -1) {
    throw new Error("Invalid Kitten ID")
  } else {
    return kittens[index];
  }
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  kitten = findKittenById(id)
  let rng = Math.random()
  if (rng > 0.7) {
    kitten.affection++
  } else {
    kitten.affection--
  }
  kitten.mood = setKittenMood(kitten)
  saveKittens()
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  kitten = findKittenById(id)
  kitten.affection++
  kitten.mood = setKittenMood(kitten)
  saveKittens()
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {

  switch (kitten.affection) {
    case 15:
      alert(kitten.name + " loves you.")
      kitten.favorite = true
      break
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
      kitten.mood = "happy"
      break
    case 7:
    case 8:
    case 9:
      kitten.mood = "content"
      break
    case 6:
    case 5:
      kitten.mood = "tolerant"
      break
    case 4:
    case 3:
    case 2:
      kitten.mood = "angry"
      break
    case 1:
      kitten.mood = "furious"
      break
    case 0:
      alert(kitten.name + " ran away!")
      kittens.splice(kitten, 1)
      break
    default:
      console.log("ERROR: Couldn't find Affection")
      break
  }

  return kitten.mood;
}

function getStarted() {
  document.getElementById("welcome").remove()
  drawKittens()
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

loadKittens()
drawKittens()