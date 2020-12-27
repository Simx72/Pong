/// <reference path="/usr/local/lib/node_modules/@types/p5/index.d.ts"/>

class Player {
    constructor() {
        this._p = {
            x: 0,
            y: 0
        }
        this.w = 0
        this.h = 0
        this.puntos = 0
    }

    ajustar = (nPlayer) => {
        if (nPlayer == 1) this._p.x = r(7)
        if (nPlayer == 2) this._p.x = r(-7)
        this.w = r(3)
        this.h = r(20)
        this._p.y = r(50) - this.h / 2
    }

    ganar = () => {
        this.puntos += 1
    }

    _moverY = (dis) => {

        if (dis) this._p.y += dis;

    }

    bajar = (dis) => {
        dis = Math.abs(r(dis))
        let masAbajo2 = masAbajo - r(20)
        if (this._p.y < masAbajo2) {
            if (this._p.y + dis <= masAbajo2) {
                this._moverY(dis)
            } else {
                this._p.y = masAbajo2
            }
        }
        return this._p.y;
    }

    subir = (dis) => {
        dis = -Math.abs(r(dis))
        if (this._p.y > masArriba) {
            if (this._p.y + dis >= masArriba) {
                this._moverY(dis)
            } else {
                this._p.y = masArriba
            }
        }
        return this._p.y;
    }
}


var canvas,
    audio = { choque: null, muerte: null },
    masArriba,
    masAbajo,
    size,
    punto = {
        vel: {
            x: 0,
            y: 0,
            xMax: 0
        },
        _p: {
            x: 0,
            y: 0
        },
        mover: () => {
            punto._p.x += punto.vel.x;
            punto._p.y += punto.vel.y;
            if (punto._p.y > masAbajo || punto._p.y < masArriba) punto.vel.y = -punto.vel.y;

            // choque rect1
            if (punto._p.x >= r(7) && punto._p.x <= (r(7) + rect1.w)) {
                let py = rect1.subir(0);
                if (Math.sign(punto.vel.x) == -1) {
                    if (punto._p.y >= py && punto._p.y <= (py + rect1.h)) {
                        // console.log('Choque!')
                        punto.vel.x = Math.abs(punto.vel.x) + 0.1
                        audio.choque.play()
                    }
                }
            }

            // choque rect2
            if (punto._p.x >= r(-7) && punto._p.x <= (r(-7) + rect2.w)) {
                let py = rect2.subir(0);
                if (Math.sign(punto.vel.x) == 1) {
                    if (punto._p.y >= py && punto._p.y <= (py + rect2.h)) {
                        // console.log('Choque!')
                        punto.vel.x = -(Math.abs(punto.vel.x) + 0.1)
                        audio.choque.play()
                    }
                }
            }

            // perdio rect1
            if (punto._p.x <= r(0)) {
                rect2.ganar()
                punto._p.x = r(50)
                punto._p.y = r(50)
                if (Math.abs(punto.vel.x) < punto.xMax) punto.vel.x = -(Math.abs(punto.vel.x) + 0.1)
                    // console.log(punto.vel.x)
                audio.muerte.play()
            }

            // perdio rect2
            if (punto._p.x >= r(100)) {
                rect1.ganar()
                punto._p.x = r(50)
                punto._p.y = r(50)
                punto.vel.x = Math.abs(punto.vel.x) + 0.1
                if (Math.abs(punto.vel.x) < punto.xMax) punto.vel.x = -(Math.abs(punto.vel.x) + 0.1)
                    // console.log(punto.vel.x)
                audio.muerte.play()
            }

        }
    },
    rect1 = new Player(),
    rect2 = new Player(),
    jugando = false;

function canvasSize() {
    size = (windowWidth < windowHeight) ? windowWidth : windowHeight
        // console.log(size)
}

function windowResized() {
    location.reload()
        /* 
        canvasSize()
        canvas.style('left', ((windowWidth / 2) - (size / 2)) + 'px')
        canvas.style('top', ((windowHeight / 2) - (size / 2)) + 'px')

        canvas.style('width', size + 'px')
        canvas.style('height', size + 'px') 
        */
}

function r(pos) {
    if (pos < 0) return size + (size / 100 * pos)
    return size / 100 * pos
}

function setup() {
    canvasSize();
    canvas = createCanvas(size, size)

    canvas.style('position', 'absolute')
    canvas.style('left', ((windowWidth / 2) - (size / 2)) + 'px')
    canvas.style('top', ((windowHeight / 2) - (size / 2)) + 'px')
        // console.log((windowWidth / 2) - (size / 2), (windowHeight / 2) - (size / 2))

    textFont(loadFont(location.href + 'assets/fonts/Audiowide-Regular.ttf'))
    
    fill(255, 255, 255)

    punto.vel.x = -2;
    punto.vel.y = 3;

    punto._p.x = r(50)
    punto._p.y = r(50)

    punto.xMax = r(1)

    rect1.ajustar(1)
    rect2.ajustar(2)

    masArriba = r(10)
    masAbajo = r(90)

    audio.choque = createAudio('assets/sounds/bip_choque.mp3').autoplay(false)
    audio.muerte = createAudio('assets/sounds/bip_muerte.mp3').autoplay(false)

    var jugarboton = createButton('Jugar');

    jugarboton.size(size, size)
        .style('position', 'absolute')
        .style('left', ((windowWidth / 2) - (size / 2)) + 'px')
        .style('top', ((windowHeight / 2) - (size / 2)) + 'px')
        .style('font-size', '30pt')
        .style('cursor', 'pointer')
        .style('color', '#EEE')
        .style('background-color', '#333')
        .style('font-family', 'mifuente')
        .style('animation', 'animation1 1500ms infinite')
        .mouseClicked(() => {
            jugarboton.hide()
            pausaboton.show()
                .html('▌▌')
                .mouseClicked(() => {
                    jugarboton.show()
                    pausaboton.html('Reiniciar')
                    pausaboton.mouseClicked(() => {
                        location.reload()
                    })
                    jugando = false;
                })
            jugando = true;
            jugarboton.html('Continuar')
        })

    pausaboton = createButton('▌▌')

    pausaboton.size(size, r(10)).hide()
        .style('position', 'absolute')
        .style('left', ((windowWidth / 2) - (size / 2)) + 'px')
        .style('top', ((windowHeight / 2) + (size / 2) - r(10)) + 'px')
        .style('font-size', r(3) + 'pt')
        .style('cursor', 'pointer')
        .style('color', '#EEE')
        .style('background-color', '#333')
        .style('font-family', 'mifuente')
        .mouseClicked(() => {
            jugarboton.show()
            pausaboton.html('Reiniciar')
            pausaboton.mouseClicked(() => {
                location.reload()
            })
            jugando = false;
        })

}

function draw() {
    if (jugando) {

        background(0)
        ellipse(punto._p.x, punto._p.y, r(3), r(3))

        textAlign(CENTER)
        textSize(r(7))
        text('PONG', r(50), r(7))

        text(rect1.puntos, r(9), r(7))
        text(rect2.puntos, r(-9), r(7))

        rect(rect1._p.x, rect1._p.y, rect1.w, rect1.h)
        rect(rect2._p.x, rect2._p.y, rect2.w, rect2.h)

        punto.mover()

        if (keyIsDown(87)) { // w - player1 up
            rect1.subir(1)
        }
        if (keyIsDown(83)) { // s - player1 down
            rect1.bajar(1)
        }
        if (keyIsDown(38)) { // ArrowUp - player2 up
            rect2.subir(1)
        }
        if (keyIsDown(40)) { // ArrowDown - player2 down
            rect2.bajar(1)
        }

    }
}
