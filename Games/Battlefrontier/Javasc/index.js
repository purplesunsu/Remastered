const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.4

//PLAYER AND ENEMY SPRITE
class Sprite {
  constructor({position}) {
    this.position = position
    this.height = 150
    this.width = 50
  }

  draw() {}

  //UPDATE
  update() {
    this.draw()
  }
}

// FIGHTER CLASS
class Fighter {
  constructor({position, velocity, color = 'yellow', offset}) {
    this.position = position
    this.velocity = velocity
    this.height = 150
    this.width = 50
    this.lastKey
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset,
      width: 100,
      height: 50
    }
    this.color = color
    this.isAttacking
    this.health = 100
  }

  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

    //atttckBox
    if (this.isAttacking){
      c.fillStyle = 'green'
      c.fillRect(
        this.attackBox.position.x, 
        this.attackBox.position.y, 
        this.attackBox.width, 
        this.attackBox.height
      )
    }
  }

  //UPDATE
  update() {
    this.draw()
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    
    if (this.position.y + this.height + this.velocity.y >= canvas.height){
      this.velocity.y = 0
    } else this.velocity.y += gravity
  }

  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100) // miliiseconds
  }
}

const player = new Fighter({
    position: {
    x: 0,
    y: 0
  }, 
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  }
})

const enemy = new Fighter({
  position: {
  x: 400,
  y: 100
  }, 
  velocity: {
  x: 0,
  y: 0
  },
  color: 'red',
  offset: {
    x: -50,
    y: 0
  }
  })

console.log(player);

const keys= {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}
// Functions
//ATTACK BOX FUNCTION
function rectangularCollison({rectangle1, rectangle2}) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
      rectangle2.position.x && 
    rectangle1.attackBox.position.x <= 
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= 
      rectangle2.position.y && 
    rectangle1.attackBox.position.y <= 
      rectangle2.position.y + rectangle2.height
  )
}


function determineWinner({player, enemy, timerId}) {
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins!'
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins!'
  }
}

// TIMER
let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }
  if(timer === 0) {
    document.querySelector('#displayText').style.display = 'flex'
    determineWinner({player, enemy, timerId})
  }
}

decreaseTimer()

// animtion loop
function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -6
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = 6
  }

  //player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -6
  } else if (keys.d.pressed && player.lastKey === 'd'){
    player.velocity.x = 6
  }

  //detect for collision
  if (
    rectangularCollison({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false
    enemy.health -= 5
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }

  if (
    rectangularCollison({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false
    player.health -= 5
    document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerId})
  } 
}

animate()

//Pressing down on the keys
window.addEventListener('keydown', (event) => {

  //player keys
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break
    
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
  
    case 'w':
      player.velocity.y = -15
      break

    case ' ':
      player.attack()
      break

    // enemy keys
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break

    case 'ArrowUp':
      enemy.velocity.y = -15
      break

    case 'ArrowDown':
      enemy.isAttacking = true
      break
  }
})

// Lifting finger off the key
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }
// enemy keys
switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowDown':
      enemy.isAttacking = false
      break
  }
})