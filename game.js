/*
Añadir:
- Jugador no jugable
- Tit for tat: Este jugador empieza cooperando y en las siguientes rondas imita la ultima jugada del adversario
*/

// Puntuación máxima permitida
const puntuacionFinal = 25;
// Indicar si la partida ha terminado
let partidaFinalizada = false;


class Jugador {
    constructor(id, nombre, teclaCooperar, teclaTraicionar) {
        this.id = id;
        this.nombre = nombre;
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
    new Jugador('player1', 'P1', '1', '2'),
    new Jugador('player2', 'P2', '3', '4')
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
    // Si la partida ya ha terminado, salimos de la función sin hacer nada
    if (partidaFinalizada) {
        return;
    }

    const { cooperaciones, traiciones } = contarDecisiones();

    // Todos cooperan
    if (traiciones === 0) {
        console.log("Todos cooperan");
        jugadores.forEach(jugador => jugador.actualizarPuntos(jugador.puntos + 2));
    }
    // Hay un traidor
    else if (traiciones === 1) {
        console.log("Hay un traidor");
        jugadores.forEach(jugador => {
            if (jugador.decision === 'T') {
                jugador.actualizarPuntos(jugador.puntos + 3);
            }
        });
    }
    // WAR
    else {
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
    const roundEntry = `Ronda ${ronda}:  &nbsp;&nbsp;&nbsp;&nbsp;  P1 ${jugadores[0].decision} ${jugadores[0].puntos}  &nbsp;&nbsp;&nbsp;&nbsp; P2 ${jugadores[1].decision} ${jugadores[1].puntos}<br>`;
    // &nbsp; = espacio
    roundLog.innerHTML += roundEntry;
    ronda++;

    // Verificar si hay un ganador
    const ganadores = jugadores.filter(jugador => jugador.puntos >= puntuacionFinal);
    if (ganadores.length > 0) {
        const ganadoresString = ganadores.map(ganador => ganador.nombre).join(' y ');

        if (ganadores.length === 1) {
            roundLog.innerHTML += `${ganadoresString} ha ganado! <br>¡FIN!`;
        } else {
            roundLog.innerHTML += `Empate entre ${ganadoresString}! <br>¡FIN!`;
        }
        partidaFinalizada = true; // Marcar la partida como finalizada
    }

}

// Listener para Enter fuera de la clase Jugador
document.addEventListener("keyup", (event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'INPUT') {
        resolveRound();
    }
});