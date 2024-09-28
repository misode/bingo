const essentialGoals = [
]

const optionalGoals = [
  'Fletching table use',
  'Epic Minecraft musical animation',
  'Someone asks if there are capes',
  'Marketplace victory lap',
  'People playing on consoles center-stage',
  'Subtle Minecraft merch mention',
  'Marketplace DLC announcement',
  'Awkward laugh',
  'Fireworks in Minecraft',
  'Accessibility in Minecraft',
  'Showcasing concept art',
  'Live reactions from social media',
  'Minecraft being used by students',
  'Jeb screams "nooooooo"',
  'Minecraft Legends gameplay',
  'Something with Realms',
  'Crossover with another game',
  'Uncanny CGI set',
  'Minecraft Lego',
  'Cringe Minecraft Movie teaser',
  'Looking back on the mob votes',
  'Doing things "a little differently"',
  'Highlighting community feedback',
  'Another spin-off is announced',
]

const freeSpaces = [
  'Jeb is awkward',
  'Agnes is excited',
  'Devs are wholesome',
]

function generateSeed(length = 12) {
  var arr = new Uint8Array(length / 2)
  window.crypto.getRandomValues(arr)
  const seed = Array.from(arr, d => ('0' + d.toString(16)).substr(-2)).join('')
  localStorage.setItem('minecraftlive.seed', seed)
  return seed
}

function fisherYates(originalArray) {
  const array = originalArray.slice(0)
  for (let i = (array.length - 1); i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]]
  }
  return array
}

function initGrid() {
  /** @type {string[]} */
  let shuffledGoals
  let attempts = 0
  while (true) {
    shuffledGoals = fisherYates(essentialGoals.concat(fisherYates(optionalGoals)).slice(0, 24))
    const freeSpace = freeSpaces[Math.floor(Math.random() * freeSpaces.length)]
    shuffledGoals.splice(12, 0, freeSpace)
    let isValid = true
    // let count1 = 0
    // let count2 = 0
    // for (let i = 0; i < 5; i += 1) {
    //   if (shuffledGoals[i + 5*i].endsWith('wins the Mob Vote')) count1 += 1
    //   if (shuffledGoals[(4-i) + 5*i].endsWith('wins the Mob Vote')) count2 += 1
    //   let count3 = 0
    //   let count4 = 0
    //   for (let j = 0; j < 5; j += 1) {
    //     if (shuffledGoals[i + 5*j].endsWith('wins the Mob Vote')) count3 += 1
    //     if (shuffledGoals[j + 5*i].endsWith('wins the Mob Vote')) count4 += 1
    //   }
    //   if (count3 > 1 || count4 > 1) isValid = false
    // }
    // if (count1 > 1 || count2 > 1) isValid = false
    attempts += 1
    if (isValid || attempts > 50) {
      console.log(`Generated card after ${attempts} attempts`)
      break
    }
  }

  const grid = document.querySelector('.grid')
  grid.innerHTML = ''
  for (let y = 0; y < 5; y += 1) {
    const row = document.createElement('div')
    grid.appendChild(row)
    row.className = 'row'
    for (let x = 0; x < 5; x += 1) {
      let i = x + 5*y
      const label = shuffledGoals[i]
      const cell = document.createElement('div')
      row.appendChild(cell)
      cell.classList.add('cell')
      cell.classList.toggle('checked', checked[i])
      cell.textContent = label
      if (i === 12) {
        cell.classList.add('free-space')
        continue
      }
      cell.addEventListener('click', () => {
        checked[i] = !checked[i]
        cell.className = checked[i] ? 'cell checked' : 'cell'
        setChecked()
        ga('send', 'event', 'Grid', 'toggle-cell', label)
        if (checked[i]) {
          ga('send', 'event', 'Grid', 'check-cell', label)
        } else {
          ga('send', 'event', 'Grid', 'uncheck-cell', label)
        }
      })
    }
  }
}

function setChecked() {
  localStorage.setItem('minecraftlive.checked', checked.map(e => e ? '1' : '0').join(''))
  ga('set', 'metric1', checked.filter(e => e).length)
}

document.querySelector('.new-seed').addEventListener('click', () => {
  Math.seedrandom(generateSeed())
  checked = new Array(25).fill(false)
  setChecked()
  ga('send', 'event', 'Grid', 'reset')
  initGrid()
})

Math.seedrandom(localStorage.getItem('minecraftlive.seed') ?? generateSeed())

const checkedString = localStorage.getItem('minecraftlive.checked') ?? '0'.repeat(24)
let checked = checkedString.split('').map(c => c !== '0')

initGrid()
