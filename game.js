/*
Añadir:
- Alternar entre IA y humano
- No se puede resolver la ronda si no están todas las elecciones
- Alternar entre IA y Humano por interfaz
- Tit for tat: Este jugador empieza cooperando y en las siguientes rondas imita la ultima jugada del adversario
*/

// Puntuación máxima permitida
const puntuacionFinal = 25;
// Indicar si la partida ha terminado
let partidaFinalizada = false;
// Variable para indicar si el jugador 2 es una IA o humano
let jugador2IA = false;

class Jugador {
    constructor(id, nombre, teclaCooperar, teclaTraicionar, esIA = false) {
        this.id = id;
        this.nombre = nombre;
        this.puntos = 0;
        this.decision = '-';
        this.teclaCooperar = teclaCooperar;
        this.teclaTraicionar = teclaTraicionar;
        this.esIA = esIA;
        if (!esIA) {
            this.setupTeclado();
        }
    }

    setupTeclado() {
        document.addEventListener("keyup", (event) => {
            // Jugador 1
            if (this.id === 'P1') {
                if (event.key === this.teclaCooperar) {
                    this.actualizarDecision('C');
                    if (jugador2IA) jugadores[1].actualizarDecision(jugadores[1].tomarDecision());
                    
                } else if (event.key === this.teclaTraicionar) {
                    this.actualizarDecision('T');
                    if (jugador2IA) jugadores[1].actualizarDecision(jugadores[1].tomarDecision());
                }
            }
            
            // Jugador 2 elige si no es IA
            if (this.id === 'P2') {
                if (!jugador2IA) {
                    if (event.key === this.teclaCooperar) {
                        this.actualizarDecision('C');
                    } else if (event.key === this.teclaTraicionar) {
                        this.actualizarDecision('T');
                    }
                }
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

    tomarDecision() {
        return Math.random() < 0.5 ? 'C' : 'T'; // Decisiones aleatorias
    }
}

// Crear jugadores y agregarlos a una lista
const jugadores = [
    new Jugador('P1', 'P1', '1', '2', false),
    new Jugador('P2', 'P2', '3', '4', false)
];
let ronda = 1;

function cambiarJugador2() {
    jugador2IA = !jugador2IA;
    // jugadores[1] = new Jugador('player2', 'P2', '3', '4', jugador2IA);
    jugadores[1].esIA = jugador2IA;
    console.log(`Jugador 2 es ${jugador2IA ? 'IA' : 'humano'}`);
}

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

    // Lógica para el jugador 2 IA
    if (jugador2IA) {
        const decisionIA = jugadores[1].tomarDecision(); // Obtener la decisión de la IA
        jugadores[1].actualizarDecision(decisionIA); // Actualizar la decisión del jugador 2
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

// LISTENER
// Enter = resolver ronda
document.addEventListener("keyup", (event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'INPUT') {
        resolveRound();
    }
});

// Tab = altenar entre IA y humano en el jugador 2
document.addEventListener("keyup", (event) => {
    if (event.key === 'Tab') {
        cambiarJugador2();
        // console.log(`Jugador 2 ahora es ${jugador2IA ? 'IA' : 'humano'}`);
    }
});