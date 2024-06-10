/*
Añadir:
- Final de partida y ganador
*/

class Jugador {
    constructor(id, teclaCooperar, teclaTraicionar) {
        this.id = id;
        this.puntos = 0;
        this.decision = '-';
        this.teclaCooperar = teclaCooperar;
        this.teclaTraicionar = teclaTraicionar;
        this.setupTeclado();
    }

    setupTeclado() {
        document.addEventListener("keyup", (event) => {
            if (event.key === this.teclaCooperar) {
                this.actualizarDecision('C');
            } else if (event.key === this.teclaTraicionar) {
                this.actualizarDecision('T');
            }
        });
    }

    actualizarPuntos(puntos) {
        this.puntos = puntos;
        document.getElementById(`${this.id}-points`).innerText = this.puntos;
    }

    actualizarDecision(decision) {
        this.decision = decision;
        document.getElementById(`${this.id}-decision`).innerText = this.decision;
    }
}

// Crear jugadores y agregarlos a una lista
const jugadores = [
    new Jugador('player1', '1', '2'),
    new Jugador('player2', '3', '4')
];
let ronda = 1;

// Función para contar las decisiones de los jugadores
function contarDecisiones() {
    let cooperaciones = 0;
    let traiciones = 0;

    jugadores.forEach(jugador => {
        if (jugador.decision === 'C') {
            cooperaciones++;
        } else if (jugador.decision === 'T') {
            traiciones++;
        }
    });

    return { cooperaciones, traiciones };
}


// Función para resolver la ronda
function resolveRound() {
    const { cooperaciones, traiciones } = contarDecisiones();

    if (traiciones === 0) {
        // Todos cooperan
        console.log("Todos cooperan");
        jugadores.forEach(jugador => jugador.actualizarPuntos(jugador.puntos + 2));
    } else if (traiciones === 1) {
        // Hay un traidor
        console.log("Hay un traidor");
        jugadores.forEach(jugador => {
            if (jugador.decision === 'T') {
                jugador.actualizarPuntos(jugador.puntos + 3);
            }
        });
    } else {
        // WAR
        console.log("Guerra");
        // Bote
        const bote = Math.floor(jugadores.reduce((sum, jugador) => sum + jugador.puntos, 0) / 2);
        console.log("Bote = " + bote);

        // Filtrar los jugadores traidores
        const traidores = jugadores.filter(jugador => jugador.decision === 'T');
        // Calcular ganador de la guerra al azar entre los traidores
        const ganador = traidores[Math.floor(Math.random() * traidores.length)];

        // Imprimir el ganador en el log
        console.log("El ganador de la guerra es el jugador:", ganador.id);
        // Actualizar puntos del ganador
        ganador.actualizarPuntos(ganador.puntos + bote);

        // Actualizar puntos de los traidores que han perdido 
        traidores.forEach(jugador => {
            if (jugador !== ganador) {
                jugador.actualizarPuntos(Math.floor(jugador.puntos / 2));
            }
        });
    }

    // Actualizar log de movimientos
    const roundLog = document.getElementById('round-log');
    // &nbsp; = espacio
    const roundEntry = `Ronda ${ronda}:  &nbsp;&nbsp;&nbsp;&nbsp;  P1 ${jugadores[0].decision} ${jugadores[0].puntos}  &nbsp;&nbsp;&nbsp;&nbsp; P2 ${jugadores[1].decision} ${jugadores[1].puntos}<br>`;

    roundLog.innerHTML += roundEntry;
    ronda++;
}

// Listener para Enter fuera de la clase Jugador
document.addEventListener("keyup", (event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'INPUT') {
        resolveRound();
    }
});