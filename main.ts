// Interface de la Pregunta
interface Question {
  category: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[]; //Array de strings para todas las posibles respuestas incorrectas
}

// Tipo Jugador
type Player =  {
  name: string
  score: number;
}

/*Funcion que devuelve una promesa de tipo Question. 
 Devuelve un objeto con la pregunta, categoria, respuesta correcta y respuestas incorrectas*/
const preguntaTrivia = async (): Promise<Question> => { 
const response = await fetch('https://opentdb.com/api.php?amount=10&category=21&difficulty=medium');

  const datos = await response.json();

  const questionData = datos.results[0];
  const category = questionData.category; /*Todas van a ser de sport*/
  const question = questionData.question;
  const correctAnswer = questionData.correct_answer;
  const incorrectAnswers = questionData.incorrect_answers;

  return {category,question,correctAnswer,incorrectAnswers};
};


async function main() {
  // Numero de jugadores
  const Jugadores =  prompt("Escriba el número total de jugadores: ");
  const numeroJugadores = Number(Jugadores);


  //Array con el nombre de jugadores. La puntuacion(score) al principio es 0 para todos.
  const players: Player[] = [];
  for (let i = 0; i < numeroJugadores; i++) {
    const playerName = prompt(`Escriba el nombre del jugador ${i + 1}:`) || " ";
    players.push({name: playerName, score: 0});
  }
  
  //Numero de preguntas por jugador
  const PreguntasPorJugador = prompt("Cuántas preguntas por jugador?");
  const NumeroPreguntasPorJugador = Number(PreguntasPorJugador);
  
  //Inicio del juego
  for (let i = 0; i < NumeroPreguntasPorJugador; i++) {
    for (const player of players) {
      
      const Pregunta = await preguntaTrivia();
      console.log("La pregunta es para ", player.name, Pregunta.question);

      // Barajar las respuestas para que la respuesta correcta no siempre esté en la misma posición. La funcion removerRespuestas está abajo
      const respuestasTotales = [Pregunta.correctAnswer, ...Pregunta.incorrectAnswers]; //Juntamos en un array todas las respuestas tanto correcta como incorrectas
      const respuestasAleatorias = removerRespuestas(respuestasTotales); //Las mezclamos para que estén siempre en la misma posición con "suffleArray" y las guardamos en otro Array

      console.log("Categoría de la pregunta: ", Pregunta.category);
      //Con el forEach sacamos las posibles respuestas 
      respuestasAleatorias.forEach((elem) => {
        console.log(elem);
      })

      //Seleccion de respuesta de los jugadores
      const playerAnswer = parseInt(prompt('Elija una respuesta entre (1, 2, 3, 4): ') || '0', 10);
      

      // Comprobar si la respuesta del jugador es correcta //Tiene que ser minimo 1 (1-4) //podíamos poner en tamaño maximo <=4 pero hay respuestad de True o False
      if (playerAnswer >= 1 && playerAnswer <= respuestasAleatorias.length && respuestasAleatorias[playerAnswer - 1] === Pregunta.correctAnswer){
        console.log("Respuesta correcta");
        player.score++;
      }else{
        console.log("Respuesta incorrecta");
      }
    }
  }

  // Encontrar al ganador o ganadores. Para ello calculamos con Reduce el jugador con la mayor puntuacion
  const puntuaciónMaxima = players.reduce((acc,elem) =>{
        return acc>elem.score? acc:elem.score;
  },0)
  const jugadorGanador = players.filter((elem) => elem.score === puntuaciónMaxima);

  // Mostrar los resultados, al ganador y si hubo empate entre jugadores
  console.log("La puntuación final es:");
  players.forEach((elem) => {
    console.log(elem.name, elem.score, "puntos");     
  })
jugadorGanador.forEach((elem)=>{
  console.log("El jugador ganador es", elem.name, "con puntuación:", elem.score);
})

if(jugadorGanador.length!==1){
  console.log("Ha habido un empate entre ganadores");
}

}

// Función para colocar las respuestas en un indice aleatoriamente
const removerRespuestas = (array: string[]): string[] => {
  const remover = [...array];
  for (let i = remover.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remover[i], remover[j]] = [remover[j], remover[i]];
  }
  return remover;
};


// Iniciar el juego
main();

