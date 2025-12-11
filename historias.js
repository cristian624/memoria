
        // Clase para gestionar usuarios
        class User {
            constructor(name) {
                this.name = name;
                this.correctAnswers = 0;
                this.incorrectAnswers = 0;
                this.currentStory = 0;
                this.currentQuestion = 0;
                this.completedStories = [];
				this.startTime = new Date();
            }
			
			addCorrect() {
                this.correctAnswers++;
            }

            addIncorrect() {
                this.incorrectAnswers++;
            }
			
			 getPercentage() {
                const total = this.correctAnswers + this.incorrectAnswers;
                return total > 0 ? Math.round((this.correctAnswers / total) * 100) : 0;
            }
			
			 getResults() {
                return {
                    name: this.name,
                    correct: this.correctAnswers,
                    incorrect: this.incorrectAnswers,
                    percentage: this.getPercentage(),
                    time: new Date() - this.startTime
                };
            }
            
            saveResults() {
                const results = {
                    name: this.name,
                    correctAnswers: this.correctAnswers,
                    incorrectAnswers: this.incorrectAnswers,
                    date: new Date().toISOString()
                };
                
                // Guardar en localStorage
                let allResults = JSON.parse(localStorage.getItem('memoryTestResults') || '[]');
                allResults.push(results);
                localStorage.setItem('memoryTestResults', JSON.stringify(allResults));
                 //funcion  oroginal contador.guardarEstadisticas(stats.hisA, stats.hisE);
				 
                return results;
            }
        }

        // Clase para el bloque de pregunta
        class QuestionBlock {
            constructor(enunciado, alternativas, alternativaCorrecta, retroalimentacion) {
                this.enunciado = enunciado;
                this.alternativas = alternativas;
                this.alternativaCorrecta = alternativaCorrecta;
                this.retroalimentacion = retroalimentacion;
            }
            
            isCorrect(answer) {
                return answer.toLowerCase() === this.alternativaCorrecta.toLowerCase();
            }
        }

        // Clase para gestionar la retroalimentación
        class FeedbackManager {
            static showCorrect(message) {
                const feedbackContainer = document.getElementById('feedback-container');
                const feedbackTitle = document.getElementById('feedback-title');
                const feedbackMessage = document.getElementById('feedback-message');
                
                feedbackContainer.className = 'feedback-container feedback-correct';
                feedbackTitle.textContent = '¡Correcto!';
                feedbackMessage.textContent = message;
                feedbackContainer.style.display = 'block';
                
                // Reproducir sonido de respuesta correcta
                document.getElementById('correct-sound').play();
            }
            
            static showIncorrect(message) {
                const feedbackContainer = document.getElementById('feedback-container');
                const feedbackTitle = document.getElementById('feedback-title');
                const feedbackMessage = document.getElementById('feedback-message');
                
                feedbackContainer.className = 'feedback-container feedback-incorrect';
                feedbackTitle.textContent = '¡Incorrecto!';
                feedbackMessage.textContent = message + " ¡Inténtalo nuevamente!! (Presiona C para continuar)";
                feedbackContainer.style.display = 'block';
                
                // Reproducir sonido de respuesta incorrecta
                document.getElementById('incorrect-sound').play();
            }
            
            static hide() {
                document.getElementById('feedback-container').style.display = 'none';
            }
        }

        // Clase para el fondo estelar
        class Starfield {
            constructor(containerId, starCount = 200) {
                this.container = document.getElementById(containerId);
                this.starCount = starCount;
                this.stars = [];
                this.createStars();
            }
            
            createStars() {
                for (let i = 0; i < this.starCount; i++) {
                    const star = document.createElement('div');
                    star.className = 'star';
                    
                    // Tamaño aleatorio entre 1 y 3 píxeles
                    const size = Math.random() * 2 + 1;
                    star.style.width = `${size}px`;
                    star.style.height = `${size}px`;
                    
                    // Posición aleatoria
                    star.style.left = `${Math.random() * 100}%`;
                    star.style.top = `${Math.random() * 100}%`;
                    
                    // Opacidad aleatoria
                    star.style.opacity = Math.random() * 0.7 + 0.3;
                    
                    this.container.appendChild(star);
                    this.stars.push(star);
                }
            }
            
            animate() {
                this.stars.forEach(star => {
                    // Animación sutil de parpadeo
                    const blink = Math.random();
                    if (blink > 0.95) {
                        star.style.opacity = Math.random() * 0.7 + 0.3;
                    }
                });
                
                requestAnimationFrame(() => this.animate());
            }
        }

        // Datos de las historias y preguntas
        const stories = [
            {
                title: "HISTORIA 1",
                text: "Jacob Welch es un Niño explorador de ocho años cuyo trabajo es obtener la insignia de reclutador de Cub Scouts. Ha estado trabajando para reclutar a otros compañeros de su escuela, la Escuela Primaria Walker. Uno de sus amigos, Andy Parkinson, asistió a la noche de inscripción en la Iglesia de San Pablo con su padre. En la siguiente reunión del Cub Scouts, es el lunes 19 de octubre, Jacob recibió la insignia de reclutador. Sus padres estaban tan felices de él que, después de la reunión, lo invitaron a comer su postre favorito: dos bolas de helado de chocolate en un cono de azúcar.",
                questions: [
                    new QuestionBlock(
                        "1. ¿Cuál es el nombre del niño explorador?",
                        ["Tito Livio", "Jules Michelet", "Aume Vicens", "Jacob Welch"],
                        "Jacob Welch",
                        "Reflexiona sobre el nombre del protagonista del cuento."
                    ),
                    new QuestionBlock(
                        "2. ¿Qué edad tiene?",
                        ["nueve años", "un año", "doce años", "Ocho años"],
                        "Ocho años",
                        "Recuerda la edad mencionada al inicio del cuento."
                    ),
                    new QuestionBlock(
                        "3. ¿Cuál es su trabajo?",
                        ["contador", "cajero", "administrador", "reclutador"],
                        "reclutador",
                        "Piensa en la actividad principal que realiza Jacob en el cuento."
                    ),
                    new QuestionBlock(
                        "4. ¿A qué escuela asiste?",
                        ["Segundaria Walker", "colegio Livio", "Primaria Vincens", "Primaria Walker"],
                        "Primaria Walker",
                        "Recuerda el nombre completo de la escuela mencionada."
                    ),
                    new QuestionBlock(
                        "5. ¿Cuál es el nombre completo de su amigo?",
                        ["Ian Kershaw", "Michelle Perrot", "Rodrigo Fierro", "Andy Parkinson"],
                        "Andy Parkinson",
                        "Fíjate en el nombre del amigo que asistió a la noche de inscripción."
                    ),
				 new QuestionBlock(			
                       	"6. ¿Quién acompañó a Andy a la reunión? " ,       
                       ["La madre","el hijo","la hija","el padre"],
                        "el padre",
                        "Reflexiona "	
                    ),
		         new QuestionBlock(		
                       	"7. ¿asistió Andy en la reunión en que horario?",
                       	["tarde","media noche","Noche","dia"],
                        "Noche",
                        "Reflexiona" 	
                    ),
		         new QuestionBlock(		
                       	"8. ¿En qué mes fue la siguiente reunión de los Cub Scouts?",       
                       	["enero","marzo","octubre","noviembre"],
                        "octubre",
                        "Reflexiona ",
                    ),
		         new QuestionBlock(		
                       	"9. ¿A que Iglesia asistio?",      
                       	["San Pablo","San Lucas","Dominicana","San Nicolas"],
                        "San Pablo",
                        "Reflexiona "	
                    ),
		         new QuestionBlock(		
                       	"10. ¿Jacob recibió la insignia de?",
                       	["administrador","contador","reclutador","cajero"],
                        "reclutador",
                        "Reflexiona "	
                    ),
		         new QuestionBlock(		
                       	"11. ¿Quién estaba en la reunión con Jacob?",
                       	["sus nietos","sus colegas","sus padres","sus hijos "],
                        "sus padres",
                        "Reflexiona "	
                    ),
		         new QuestionBlock(		
                       	"12. ¿Cuál fue la reacción de los padres de Jacob?",
                       	["enojados","ninguno","felices","triste"],
                        "feliz",
                        "Reflexiona "	
                    ),
		         new QuestionBlock(		
                       	"13. ¿Después de la reunión lo invitaron?",      
                       	["frutas","helado","almuerzos","volar"],
                        "helado",
                        "Reflexiona "	
                    ),
		         new QuestionBlock(		
                       	"14. ¿A Jacob le gusta el helado con cuantas bolas?",           
                       	["tres","dos","cuatro","cinco"],
                        "dos",
                        "Reflexiona "	
                    ),
		         new QuestionBlock(		
                       	"15. ¿Cuál era el sabor?", 
                       	["fresa","chocolate","limon","mango"],
                        "chocolate",
                        "Reflexiona "	
                    ),
		         new QuestionBlock(		
                       	"16. ¿El helado estaba en una taza?",   
                       	["Si","No"],
                        "No",
                        "Reflexiona "	
                    ),
		         new QuestionBlock(		
                       	"17. ¿en qué estaba el helado?", 
                       	["vaso","Cono de azúcar","tarrina","ninguno"],
                        "Cono de azúcar",
                        "Reflexiona "	
				  )
					
                ]
            },
            {
                title: "HISTORIA 2",
                text: "Una niña caminaba hacia la escuela un lunes cuando pasó junto a un edificio de ladrillos en construcción. Cinco hombres lo estaban derribando y trabajaban en el séptimo piso. Al girar hacia la calle amazonas, oyó lo que parecían gatitos llorando. Subió al edificio y vio tres gatitos acurrucados en un rincón. Los gatitos eran blancos y negros, y no había la mama de los gatitos a la vista. La niña no podía dejar a los gatitos en la obra que estaba demoliendo, así que los metió en su mochila y los llevó a la escuela. Al final del día, los vendió a sus compañeros por 10 dólares cada uno.",
                questions: [
                    new QuestionBlock(
                        "1. ¿La historia era sobre un niño o una niña?",
                        ["Un niño", "un hombre", "una mujer", "Una niña"],
                        "Una niña",
                        "Presta atención al sujeto principal de la historia."
                    ),
                    new QuestionBlock(
                        "2. ¿Qué día de la semana era?",
                        ["Martes", "Miercoles", "Viernes", "Lunes"],
                        "Lunes",
                        "Recuerda el día específico mencionado al inicio."
                    ),
                    new QuestionBlock(
                        "3. ¿Hacia dónde caminaba?",
                        ["colegio", "cine", "centro", "escuela"],
                        "escuela",
                        "Piensa en el destino de su caminata."
                    ),
                    new QuestionBlock(
                        "4. ¿La niña pasó junto a un?",
                        ["parque", "bosque", "ninguno", "edificio"],
                        "edificio",
                        "Recuerda lo que vio durante su camino."
                    ),
                    new QuestionBlock(
                        "5. ¿De qué estaba hecho el edificio?",
                        ["roca", "arena", "espuma", "Ladrillo"],
                        "Ladrillo",
                        "Fíjate en el material de construcción mencionado."
                    ),
                  new QuestionBlock(
                       "6. ¿El edificio que estaba?",
                       ["dañado", "demolido", "en construcción", "viejo"],
                       "en construcción",
                        "Reflexiona"	
                    ),
                  new QuestionBlock(	
                       "7. ¿Cuántos hombres estaban trabajando en ello?",
                       	["ninguno", "cinco hombres", "dos hombres", "un hombre"],
                        "cinco hombres",
                        "Reflexiona"	
                    ),
                  new QuestionBlock(	
                       "8. ¿Por qué calle giró?",
                       	["calle Amazonas", "Calle Lexington", "calle Canadá", "calle Rusia"],
                        "calle Amazonas",
                        "Reflexiona"	
                    ),
                  new QuestionBlock(	
                       "9. ¿Qué oyó al doblar la esquina?",
                       	["conejos", "gatitos llorando", "perros", "loros"],
                        "gatitos llorando",
                        "Reflexiona"	
                    ),
                  new QuestionBlock(	
                       "10. ¿Qué encontró en el sitio de construcción?",
                       	["cabras", "Gatitos", "perros", "conejitos"],
                        "Gatitos",
                        "Reflexiona"	
                    ),
                  new QuestionBlock(	
                       "11. ¿Cuántos gatos eran?",
                       	["cinco", "tres", "dos", "uno"],
                        "tres",
                        "Reflexiona"	
                    ),
                  new QuestionBlock(	
                       "12. ¿De qué color eran?",
                       	["amarillo", "negro", "Blanco y negro", "café y blanco"],
                        "Blanco y negro",
                        "Reflexiona"	
                    ),
                  new QuestionBlock(	
                       "13. ¿Estaba la madre de los gatos allí?",               
                       	["Si", "No", "talvez"],
                        "No",
                        "Reflexiona"	
                    ),
                  new QuestionBlock(	
                       "14. ¿A dónde los llevó?",
                       	["al centro", "al colegio", "a la escuela"," al cine"],
                        "a la escuela",
                        "Reflexiona"	
                    ),
                  new QuestionBlock(	
                       "15. ¿Dentro de que los puso?",               
                       	["carro", "maleta", "mochila", "cartera"],
                        "mochila",
                        "Reflexiona"	
                    ),
                  new QuestionBlock(	
                       "16. ¿Qué hizo con ellos?",
                       	["nada", "compro", "vendió", "alquilo"],
                        "vendió",
                        "Reflexiona"	
                    ),
                  new QuestionBlock(	
                       "17. ¿Por cuánto los vendió?",
                       	["15 todos", "5 cada uno", "10 cada uno", "20 todos"],
                        "10 cada uno",
                        "Reflexiona"
						)
                ]
            },
            {
                title: "HISTORIA 3",
                text: "Missy y Daniel McKinnon han sido dueños de la Cafetería Saludable en la esquina de las calles Wilson y Benson durante los últimos veinte años, en un local alquilado. En noviembre, el local fue vendido a Bart Styles. Bart decidió aumentar el alquiler en más de $200 al mes. Missy y Daniel consideraron que el alquiler era demasiado caro y buscaron un nuevo local en la calle River. Su local abrirá sus puertas el 14 de enero y ofrecerán café y batidos saludables de fresa, no abra descuentos, ni preciso regulares",
                questions: [
                    new QuestionBlock(
                        "1. ¿Cuáles son los nombres y apellidos de los comerciantes?",
                        ["Missy y Daniel McKinnon", "Jhon y Missy", "Danni y Missy", "Francis y Rose"],
                        "Missy y Daniel McKinnon",
                        "Reflexiona sobre los nombres de los propietarios del negocio."
                    ),
                    new QuestionBlock(
                        "2. ¿Cuál es el nombre de su tienda?",
                        ["La cafetería saludable", "tienda víveres", "panadería", "comidas típicas"],
                        "La cafetería saludable",
                        "Recuerda el nombre específico del establecimiento."
                    ),
                    new QuestionBlock(
                        "3. ¿Dónde estaba ubicada la tienda?",
                        ["Wilson y Benson", "Manhattan y Missy", "Times Square y Missy", "Amsterdam"],
                        "Wilson y Benson",
                        "Piensa en la ubicación exacta mencionada."
                    ),
                    new QuestionBlock(
                        "4. ¿Cuánto tiempo había estado la tienda en esa ubicación?",
                        ["Veinte años", "Treinta años", "Cuarenta años", "Un año"],
                        "Veinte años",
                        "Fíjate en el período de tiempo específico mencionado."
                    ),
                    new QuestionBlock(
                        "5. ¿Eran ellos dueños del edificio donde estaba la tienda?",
                        ["No", "Si", "talvez",""],
                        "No",
                        "Analiza la relación de propiedad mencionada en el texto."
                    ),
                  new QuestionBlock(
                       	"6. ¿Cuándo se vendió el edificio?",
                       	["Diciembre", "Noviembre", "Enero", "Febrero"],
                        	"Noviembre",
                        "Reflexiona"	
                   ),
                  new QuestionBlock(
                       	"7. ¿Cómo se llama los que compraron el local?",
                       	["Comercial Pérez", "Estilos de Bart", "Casa de Blanca", "Ninguno"],
                        	"Estilos de Bart",
                        "Reflexiona"	
				 ),
                  new QuestionBlock(		
                       	"8. ¿Qué hizo el nuevo propietario Bart aumento el alquiler a más de?",
                       	["100 por mes", "200 por mes", "300 por mes", "150 por mes"],
                        	"200 por mes",
                        "Reflexiona"	
                 ),
                  new QuestionBlock(
                       	"9. ¿Qué hicieron Missy y Daniel en reacción al aumento del alquiler buscaron?",
                       	["nueva ciudad", "nueva ubicación", "nuevo país", "nuevo estado"],
                        	"nueva ubicación",
                        "Reflexiona"	
                 ),
                  new QuestionBlock(
	                   	"10. ¿En qué calle está ubicada la nueva tienda?",
                       	["Canada","Italia","River","chile"],
                        	"River",
                        "Reflexiona"	
                 ),
                  new QuestionBlock(
	                   	"11. ¿En qué dia y mes volverán a abrir sus puertas?",
                       	["01 febrero", "05 diciembre", "14 Enero", "20 marzo"],
                        "14 Enero",
                        "Reflexiona"	
                 ),
				 new QuestionBlock(
	                   	"12. ¿Tendra promociones en su Cafeteria?",
                       	["Si", "No sabe ", "No", "talvez"],
                        "No",
                        "Reflexiona"	
                 ),
				 
                  new QuestionBlock(
	                   	"13. ¿Servirán toda su comida con descuento?",
                       	["Si", "No sabe ", "No", "talvez"],
                        	"No",
                        "Reflexiona"	
                 ),
                  new QuestionBlock(
	                   	"14. ¿Tendrán ofertas especiales en ensaladas?",
                       	["Si", "no sabe ","No", "talvez"],
                        	"No",
                        "Reflexiona"	
                 ),
                  new QuestionBlock(
	                   	"15. ¿Qué ofrecerán en la cafetería?",
                       	["Café y empandas", "café y batidos", "café y bolones", "té y ensaladas"],
                        	"café y batidos",
                        "Reflexiona"	
                 ),
				  new QuestionBlock(
	                   	"16. ¿Sirven batidos saludables?",
                       	["Si", "no sabe ","No", "talvez"],
                        "Si",
                        "Reflexiona"	
                 ),
				 
                  new QuestionBlock(
	                   	"17. ¿De qué están hechos los batidos especiales?",
                       	["mangos", "Fresas", "papayas", "melones"],
                        	"Fresas",
                        "Reflexiona"	
                 )
			  ]
            },
			
             {
                title: "HISTORIA 3  RECUERDO",
                text: "Missy y Daniel McKinnon han sido dueños de la Cafetería Saludable en la esquina de las calles Wilson y Benson durante los últimos veinte años, en un local alquilado. En noviembre, el local fue vendido a Bart Styles. Bart decidió aumentar el alquiler en más de $200 al mes. Missy y Daniel consideraron que el alquiler era demasiado caro y buscaron un nuevo local en la calle River. Su local abrirá sus puertas el 14 de enero y ofrecerán café y batidos saludables de fresa, no abra descuentos, ni preciso regulares",
                questions: [
                    new QuestionBlock(
                        "1. ¿Cuáles son los nombres y apellidos de los comerciantes?",
                        ["Missy y Daniel McKinnon", "Jhon y Missy", "Danni y Missy", "Francis y Rose"],
                        "Missy y Daniel McKinnon",
                        "Reflexiona sobre los nombres de los propietarios del negocio."
                    ),
                    new QuestionBlock(
                        "2. ¿Cuál es el nombre de su tienda?",
                        ["La cafetería saludable", "tienda víveres", "panadería", "comidas típicas"],
                        "La cafetería saludable",
                        "Recuerda el nombre específico del establecimiento."
                    ),
                    new QuestionBlock(
                        "3. ¿Dónde estaba ubicada la tienda?",
                        ["Wilson y Benson", "Manhattan y Missy", "Times Square y Missy", "Amsterdam"],
                        "Wilson y Benson",
                        "Piensa en la ubicación exacta mencionada."
                    ),
                    new QuestionBlock(
                        "4. ¿Cuánto tiempo había estado la tienda en esa ubicación?",
                        ["Veinte años", "Treinta años", "Cuarenta años", "Un año"],
                        "Veinte años",
                        "Fíjate en el período de tiempo específico mencionado."
                    ),
                    new QuestionBlock(
                        "5. ¿Eran ellos dueños del edificio donde estaba la tienda?",
                        ["No", "Si", "talvez",""],
                        "No",
                        "Analiza la relación de propiedad mencionada en el texto."
                    ),
                  new QuestionBlock(
                       	"6. ¿Cuándo se vendió el edificio?",
                       	["Diciembre", "Noviembre", "Enero", "Febrero"],
                        	"Noviembre",
                        "Reflexiona"	
                   ),
                  new QuestionBlock(
                       	"7. ¿Cómo se llama los que compraron el local?",
                       	["Comercial Pérez", "Estilos de Bart", "Casa de Blanca", "Ninguno"],
                        	"Estilos de Bart",
                        "Reflexiona"	
				 ),
                  new QuestionBlock(		
                       	"8. ¿Qué hizo el nuevo propietario Bart aumento el alquiler a más de?",
                       	["100 por mes", "200 por mes", "300 por mes", "150 por mes"],
                        	"200 por mes",
                        "Reflexiona"	
                 ),
                  new QuestionBlock(
                       	"9. ¿Qué hicieron Missy y Daniel en reacción al aumento del alquiler buscaron?",
                       	["nueva ciudad", "nueva ubicación", "nuevo país", "nuevo estado"],
                        	"nueva ubicación",
                        "Reflexiona"	
                 ),
                  new QuestionBlock(
	                   	"10. ¿En qué calle está ubicada la nueva tienda?",
                       	["Canada","Italia","River","chile"],
                        	"River",
                        "Reflexiona"	
                 ),
                  new QuestionBlock(
	                   	"11. ¿En qué dia y mes volverán a abrir sus puertas?",
                       	["01 febrero", "05 diciembre", "14 Enero", "20 marzo"],
                        "14 Enero",
                        "Reflexiona"	
                 ),
				 new QuestionBlock(
	                   	"12. ¿Tendra promociones en su Cafeteria?",
                       	["Si", "No sabe ", "No", "talvez"],
                        "No",
                        "Reflexiona"	
                 ),
				 
                  new QuestionBlock(
	                   	"13. ¿Servirán toda su comida con descuento?",
                       	["Si", "No sabe ", "No", "talvez"],
                        	"No",
                        "Reflexiona"	
                 ),
                  new QuestionBlock(
	                   	"14. ¿Tendrán ofertas especiales en ensaladas?",
                       	["Si", "no sabe ","No", "talvez"],
                        	"No",
                        "Reflexiona"	
                 ),
                  new QuestionBlock(
	                   	"15. ¿Qué ofrecerán en la cafetería?",
                       	["Café y empandas", "café y batidos", "café y bolones", "té y ensaladas"],
                        	"café y batidos",
                        "Reflexiona"	
                 ),
				  new QuestionBlock(
	                   	"16. ¿Sirven batidos saludables?",
                       	["Si", "no sabe ","No", "talvez"],
                        "Si",
                        "Reflexiona"	
                 ),
				 
                  new QuestionBlock(
	                   	"17. ¿De qué están hechos los batidos especiales?",
                       	["mangos", "Fresas", "papayas", "melones"],
                        	"Fresas",
                        "Reflexiona"	
                 )
			  ]
            }
        ];

        // Variables globales
        let currentUser = null;
        let currentStoryIndex = 0;
        let currentQuestionIndex = 0;
        let memorizeTimer = null;
        let answerTimer = null;
        let starfield = null;
		let user=null;

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            // Crear fondo estelar
            starfield = new Starfield('starfield');
            starfield.animate();
            
            // Configurar eventos
            document.getElementById('start-btn').addEventListener('click', startTest);
            document.getElementById('save-btn').addEventListener('click', saveResults);
            document.getElementById('restart-btn').addEventListener('click', restartTest);
            
            // Configurar evento de teclado para continuar
            document.addEventListener('keydown', function(e) {
                if (e.key === 'c' || e.key === 'C') {
                    if (document.getElementById('feedback-container').style.display === 'block') {
                        nextQuestion();
                    }
                }
            });
        });

        function startTest() {
            // Ocultar instrucciones
            document.getElementById('instructions').classList.add('hidden');
            console.log("star....");
            // Crear usuario
			  const username = document.getElementById('username').value.trim();
                if (!username) {
                    alert('Por favor, ingresa tu nombre para comenzar.');
                    return;
                }
                
                user = new User(username);
                currentUser = username;
            
			// Iniciar música de fondo (simulada)
            const backgroundMusic = document.getElementById('background-music');
            // En un caso real, aquí se cargaría el archivo background.mp3
            // backgroundMusic.play();
            
            // Mostrar primera historia
            showStory(0);
        }

        function showStory(storyIndex) {
            currentStoryIndex = storyIndex;
            currentQuestionIndex = 0;
            
            const story = stories[storyIndex];
            document.getElementById('story-title').textContent = story.title;
            document.getElementById('story-text').textContent = story.text;
            
            const storyContainer = document.getElementById('story-container');
            storyContainer.classList.remove('hidden');
            
            // Iniciar temporizador para memorización
            let timeLeft = 15;
            document.getElementById('memorize-timer').textContent = timeLeft;
            
            memorizeTimer = setInterval(() => {
                timeLeft--;
                document.getElementById('memorize-timer').textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(memorizeTimer);
                    storyContainer.classList.add('fade-out');
                    
                    setTimeout(() => {
                        storyContainer.classList.add('hidden');
                        storyContainer.classList.remove('fade-out');
                        showQuestion(storyIndex, 0);
                    }, 1000);
                }
            }, 1000);
        }

        function showQuestion(storyIndex, questionIndex) {
			
			
            const story = stories[storyIndex];
            const question = story.questions[questionIndex];
            
            document.getElementById('question-text').textContent = question.enunciado;
            
            const alternativesContainer = document.getElementById('alternatives-container');
            alternativesContainer.innerHTML = '';
            
            question.alternativas.forEach((alternative, index) => {
                const altElement = document.createElement('div');
                altElement.className = 'alternative';
                altElement.textContent = alternative;
                altElement.addEventListener('click', () => checkAnswer(alternative, question));
                alternativesContainer.appendChild(altElement);
            });
            
            const questionContainer = document.getElementById('question-container');
            questionContainer.classList.remove('hidden');
            
            // Iniciar temporizador para respuesta
            let timeLeft = 8;
            //document.getElementById('answer-timer').textContent = timeLeft;
            document.getElementById('answer-timer').classList.add('hidden');
           // answerTimer = setInterval(() => {
           //     timeLeft--;
           //     document.getElementById('answer-timer').textContent = timeLeft;
           //     
           //     if (timeLeft <= 0) {
           //         clearInterval(answerTimer);
           //         questionContainer.classList.add('fade-out');
           //         
           //         setTimeout(() => {
           //             questionContainer.classList.add('hidden');
           //             questionContainer.classList.remove('fade-out');
           //             handleTimeOut(question);
           //         }, 1000);
           //     }
           // }, 1000);
        }

        function checkAnswer(selectedAnswer, question) {
            clearInterval(answerTimer);
			
            console.log(user);
            // Ocultar contenedor de pregunta
            document.getElementById('question-container').classList.add('hidden');
            
            if (question.isCorrect(selectedAnswer)) {
                //currentUser.correctAnswers++;
				user.addCorrect();
				console.log(user.correctAnswers)
                document.getElementById('correct-count').textContent = user.correctAnswers;
                //FeedbackManager.showCorrect(question.retroalimentacion);
            } else {
                //currentUser.incorrectAnswers++;
                user.addIncorrect();
				document.getElementById('incorrect-count').textContent = user.incorrectAnswers;
                //FeedbackManager.showIncorrect(question.retroalimentacion);
            }
			nextQuestion();
        }

        function handleTimeOut(question) {
            user.addIncorrect();
            document.getElementById('incorrect-count').textContent =  user.incorrectAnswers;
			nextQuestion();
           // FeedbackManager.showIncorrect(question.retroalimentacion);
        }

        function nextQuestion() {
            //FeedbackManager.hide();
            
            currentQuestionIndex++;
            const story = stories[currentStoryIndex];
            
			console.log(currentQuestionIndex)
			
            if (currentQuestionIndex < story.questions.length) {
                showQuestion(currentStoryIndex, currentQuestionIndex);
            } else {
                currentStoryIndex++;
                
                if (currentStoryIndex < stories.length) {
                    console.log(" continua 3",currentStoryIndex);
					showStory(currentStoryIndex);
					
                } else {
				console.log("final 4",stories.length);
                    showFinalScreen();
                }
            }
        }

        function showFinalScreen() {
			const results = user.getResults();
            document.getElementById('final-correct').textContent = results.correct;
            document.getElementById('final-incorrect').textContent = results.incorrect;
			document.getElementById('result-percentage').textContent = results.percentage;
            document.getElementById('final-screen').classList.remove('hidden');
			registrar();
        }

        function saveResults() {
            const results = user.saveResults();
            alert(`Resultados guardados:\nAciertos: ${results.correctAnswers}\nErrores: ${results.incorrectAnswers}\nFecha: ${new Date(results.date).toLocaleString()}`);
        }
		
		function registrar() {
             const stats = contador.cargarEstadisticas();
		     
			 const results = user.getResults();
                // alert(`Resultados guardados:\nAciertos: ${results.correctAnswers}\nErrores: ${results.incorrectAnswers}\nFecha: ${new Date(results.date).toLocaleString()}`);
	         console.log("registro",results);
             stats.hisA = results.correct;
		     stats.hisE = results.incorrect;
             contador.guardarEstadisticas(results.correct,results.incorrect,1);
		
        }

        function restartTest() {
            // Reiniciar variables
            currentUser = null;
            currentStoryIndex = 0;
            currentQuestionIndex = 0;
            
            // Reiniciar contadores
            document.getElementById('correct-count').textContent = '0';
            document.getElementById('incorrect-count').textContent = '0';
            
            // Ocultar pantallas
            document.getElementById('final-screen').classList.add('hidden');
            document.getElementById('question-container').classList.add('hidden');
            document.getElementById('story-container').classList.add('hidden');
            FeedbackManager.hide();
            
            // Mostrar instrucciones
            document.getElementById('instructions').classList.remove('hidden');
        }
