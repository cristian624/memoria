        // Clase para gestionar usuarios
        class User {
           
			constructor(name) {
                this.name = name;
				this.correctAnswers = 0;
                this.incorrectAnswers = 0;
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
			
			
			           
            saveToStorage() {
                const userData = {
                    name: this.name,
                    //score: this.score,
                    correctAnswers: this.correctAnswers,
                    incorrectAnswers: this.incorrectAnswers,
                    startTime: this.date.toISOString()
                };
                
                // Guardar en localStorage (simulando SQLite)
                let users = JSON.parse(localStorage.getItem('memoryVisualUsers')) || [];
                users.push(userData);
                localStorage.setItem('memoryVisualUsers', JSON.stringify(users));
                
                return userData;
            }
        }

        // Clase para el bloque de pregunta
		
        class QuestionBlock {
            constructor(image, questions) {
                this.image = image;
                this.questions = questions;
                this.currentQuestionIndex = 0;
            }
            
            getCurrentQuestion() {
                return this.questions[this.currentQuestionIndex];
            }
            
            hasNextQuestion() {
                return this.currentQuestionIndex < this.questions.length - 1;
            }
            
            nextQuestion() {
                if (this.hasNextQuestion()) {
                    this.currentQuestionIndex++;
                    return true;
                }
                return false;
            }
            
            reset() {
                this.currentQuestionIndex = 0;
            }
        }

        // Clase para gestionar la retroalimentación
        class FeedbackManager {
            constructor() {
                this.feedbackContainer = document.getElementById('feedback-container');
                this.feedbackTitle = document.getElementById('feedback-title');
                this.feedbackText = document.getElementById('feedback-text');
                this.nextBtn = document.getElementById('next-btn');
            }
            
            showCorrect() {
                this.feedbackTitle.textContent = "¡Correcto!";
                this.feedbackText.textContent = "Has respondido correctamente.";
                this.feedbackContainer.style.display = 'block';
                
                // Reproducir sonido de acierto (simulado)
                this.playSound('correct');
            }
            
            showIncorrect(correctAnswer) {
                this.feedbackTitle.textContent = "Incorrecto";
                this.feedbackText.textContent = `La respuesta correcta era: ${correctAnswer}`;
                this.feedbackContainer.style.display = 'block';
                
                // Reproducir sonido de error (simulado)
                this.playSound('incorrect');
            }
            
            hide() {
                this.feedbackContainer.style.display = 'none';
            }
            
            playSound(type) {
                // En un entorno real, aquí cargaríamos y reproduciríamos archivos de sonido
                console.log(`Reproduciendo sonido: ${type}`);
            }
        }

        // Clase para el fondo estelar
        class Starfield {
            constructor(canvasId) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext('2d');
                this.stars = [];
                this.resize();
                this.init();
                
                window.addEventListener('resize', () => this.resize());
            }
            
            resize() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.init();
            }
            
            init() {
                this.stars = [];
                const starCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
                
                for (let i = 0; i < starCount; i++) {
                    this.stars.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        size: Math.random() * 2 + 0.5,
                        speed: Math.random() * 0.5 + 0.1,
                        brightness: Math.random() * 0.5 + 0.5
                    });
                }
            }
            
            update() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.ctx.fillStyle = '#0a0a2a';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.stars.forEach(star => {
                    star.y += star.speed;
                    
                    if (star.y > this.canvas.height) {
                        star.y = 0;
                        star.x = Math.random() * this.canvas.width;
                    }
                    
                    this.ctx.beginPath();
                    this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
                    this.ctx.fill();
                });
                
                requestAnimationFrame(() => this.update());
            }
        }

        // Clase principal del juego
        class MemoryVisualGame {
            constructor() {
                this.user = null;
				this.currentUser = null;
                this.currentQuestionBlock = null;
                this.questionBlocks = [];
                this.currentBlockIndex = 0;
                this.correctCount = 0;
                this.incorrectCount = 0;
                this.isShowingImage = false;
                this.imageTimer = null;
                this.questionTimer = null;
                
                this.feedbackManager = new FeedbackManager();
                this.starfield = new Starfield('stars');
                this.backgroundMusic = document.getElementById('background-music');
                
                this.initializeElements();
                this.loadQuestionData();
                this.setupEventListeners();
                
                this.starfield.update();
            }
            
            initializeElements() {
                this.startBtn = document.getElementById('start-btn');
                this.imageContainer = document.getElementById('image-container');
                this.currentImage = document.getElementById('current-image');
                this.imageTimerElement = document.getElementById('image-timer');
                this.questionContainer = document.getElementById('question-container');
                this.questionText = document.getElementById('question-text');
                this.alternativesContainer = document.getElementById('alternatives-container');
                this.correctCountElement = document.getElementById('correct-count');
                this.incorrectCountElement = document.getElementById('incorrect-count');
                this.questionCountElement = document.getElementById('question-count');
                this.finalScreen = document.getElementById('final-screen');
                this.finalCorrect = document.getElementById('final-correct');
                this.finalIncorrect = document.getElementById('final-incorrect');
                this.finalPercentage = document.getElementById('final-percentage');
                this.userNameInput = document.getElementById('user-name');
                this.saveBtn = document.getElementById('save-btn');
                this.restartBtn = document.getElementById('restart-btn');
                this.nextBtn = document.getElementById('next-btn');
            }
            
            loadQuestionData() {
				 if (!username) {
                    alert('Por favor, ingresa tu nombre para comenzar.');
                    return;
                }
				
				this.user = new User(username);
                this.currentUser = username;
                // Datos de preguntas para cada imagen
                this.questionBlocks = [
                    new QuestionBlock('imagen1.png', [
                        {
                            question: "¿Cómo describirías la escena?",
                            alternatives: ["Ciudad", "Playa", "Granja", "Circo", "Aeropuerto"],
                            correctAnswer: "Ciudad"
                        },
                        {
                            question: "¿Cuántas personas están en la calle?",
                            alternatives: ["5", "2", "8", "4", "6"],
                            correctAnswer: "5"
                        },
                        {
                            question: "¿Qué hora está en el reloj?",
                            alternatives: ["3 PM", "5 PM", "7 PM", "9 PM"],
                            correctAnswer: "3 PM"
                        },
                        {
                            question: "¿Cuántos niños y niñas hay en la escena?",
                            alternatives: ["3", "2", "5", "4", "1"],
                            correctAnswer: "3"
                        },
                        {
                            question: "¿Qué llevan todos los  niños y niñas ?",
                            alternatives: ["Mochilas", "Pelotas", "Frutas", "Golosinas", "nada"],
                            correctAnswer: "Mochilas"
                        },
						{
                            question: "¿El cabello de la mujer es?",
                            alternatives: ["Amarillo", "Rojo", "Blanco", "Café", "Oscuro"],
                            correctAnswer: "Amarillo"
                        },
                        {
                            question: "¿Qué sostiene el hombre?",
                            alternatives: ["Maletín", "Un vaso", "Una botella", "Una pelota", "Un perro"],
                            correctAnswer: "Maletín"
                       },
                       {
                            question: "¿Cómo se llama la calle?",
                            alternatives: ["Japón", "Colon", "Amazonas", "Patria", "Chile"],
                            correctAnswer: "Japón"
                       },
                       { 
                            question: "¿De qué color es el abrigo de la mujer?",
                            alternatives: ["Amarillo", "Verde", "Café", "Negro", "Plomo"],
                            correctAnswer: "Amarillo"
                        },
                        {
                            question: "¿La señora lleva un bolso de color?",
                            alternatives: ["Negro", "Blanco", "Café", "Celeste", "No tiene nada"],
                            correctAnswer: "No tiene nada"           
                       },
                       { 
                            question: "¿Cómo está vestido el hombre?",
                            alternatives: ["Traje negro", "Camisa celeste y pantalón", "Saco Azul y pantalón", "Como Futbolista", "Como Pirata"],
                            correctAnswer:  "Traje negro" 
                        },
                        {
                            question: "¿Cuántos taxis hay en la imagen?",
                            alternatives: ["1", "2", "4", "5", "6"],
                            correctAnswer: "1"
                        },
                        {
                            question: "¿Que dice la señal del taxi? ",
                            alternatives: ["Libre", "Ocupado", "Con Pasajero", "Con Ruta", "nada"],
                            correctAnswer:  "Libre"
                       }
                    ]),
                    new QuestionBlock('imagen2.png', [
                        {
                            question: "¿Dónde ocurre la escena?",
                            alternatives: ["Ciudad", "Playa", "Granja", "Circo", "Aeropuerto"],
                            correctAnswer: "Ciudad"
                        },
                        {
                            question: "¿Qué está haciendo el Señor?",
                            alternatives: ["Paleando", "Jugando", "Nadando", "Corriendo", "nada"],
                            correctAnswer: "Paleando"
                        },
                        {
                            question: "¿Cuántos niños o chicos hay en la imagen?",
                            alternatives: ["3", "2", "4", "5", "6"],
                            correctAnswer: "2"
                        },
                        {
                            question: "¿Cuantas niñas o chicas están en la imagen?",
                            alternatives: ["3", "2", "4", "5", "6"],
                            correctAnswer: "2"
                        },
                        {
                            question: "¿Cuántos llevan sombreros?",
                            alternatives: ["3", "2", "4", "5", "6"],
                            correctAnswer: "5"
                        },
						{
                            question:	"¿Qué están haciendo los chicos?",
                            alternatives:	["Paleando", "Jugando", "Nadando", "Corriendo", "nada"],
                            correctAnswer:	"Jugando"
                         },
                         {	
                            question:	"¿Qué está haciendo el perro?",
                            alternatives:	["Paleando", "Jugando", "Nadando", "Corriendo", "nada"],
                            correctAnswer:	"Corriendo"
                         },
                         {	
                            question:	"¿Quién está en el trineo?",
                            alternatives:	["Perro", "Gato", "Niña", "Niño", "Señor"],
                            correctAnswer:	"Niña"
                         },
                         {
                            question:	"¿Está nevando?",
                            alternatives:	["Si", "No"],
                            correctAnswer:	"Si"
                         },
                         {	
                            question:	"¿Parecen feliz las niñas?",
                            alternatives:	["Si", "No"],
                            correctAnswer:	"Si"
                         },
                         {
                            question:	"¿Qué lleva una bufanda amarilla?",
                            alternatives:	["Perro", "Gato", "Niña", "Niño", "Señor"],
                            correctAnswer:	"Niña"
                         },
                         {
                            question:	"¿Cuántas casas hay en la imagen?",
                            alternatives:	["3","2","4","5","6"],
                            correctAnswer:	"3"
                         },
                         {
                            question:	"¿Tiene arboles la imagen?",
                            alternatives:	["Si", "No"],
                            correctAnswer:	"Si"
                         }
						
                    ]),
                    new QuestionBlock('imagen3.png', [
                        {
                            question: "¿Cómo describirías la escena o la imagen?",
                            alternatives: ["La Ciudad", "La Playa", "Granja", "Circo", "Aeropuerto"],
                            correctAnswer: "La Playa"
                        },
                        {
                            question: "¿Qué está sosteniendo la mujer en la playa?",
                            alternatives: ["Sombrilla", "Botella", "Hielera", "Pelota", "nada"],
                            correctAnswer: "Sombrilla"
                        },
                        {
                            question: "¿Hay nubes en el cielo?",
                            alternatives: ["Si", "No"],
                            correctAnswer: "Si"
                        },
                        {
                            question: "¿Además de las nubes, qué más hay en el cielo?",
                            alternatives: ["gaviotas", "aviones", "El Sol", "mariposas"],
                            correctAnswer: "gaviotas"
                        },
                        {
                            question: "¿Qué está haciendo el hombre en la playa?",
                            alternatives: ["tomando cola", "jugando", "corriendo", "nadando"],
                            correctAnswer: "tomando cola"
                        },
						{
                          question:	"¿Qué están haciendo los niños en la arena?",
                          alternatives:	["saltar", "castillos de arena", "nada", "correr"],
                          correctAnswer:	"castillos de arena"
                       },
                       {	
                          question:	"¿El traje de baño del hombre tiene rayas?",
                          alternatives:	["Si", "No"],
                          correctAnswer:	"Si"
                       },
                       {
                          question:	"¿De quién es el castillo de arena más grande?",
                          alternatives:	["niña", "niño", "son iguales"],
                          correctAnswer:	"niño"
                       },
                       {	
                          question:	"¿Lleva puesto la mujer un sombrero?",
                          alternatives:	["Si", "No"],
                          correctAnswer:	"Si"
                       },
                       {   	
                          question:	"¿Cuántas toallas están en la arena?",
                          alternatives:	["3","2","4","5","6"],
                          correctAnswer:	"2"
                       },
                       {   	
                          question:	"¿Cuantas cosas sostiene el hombre en sus manos?",
                          alternatives:	["3","2","4","5","6"],
                          correctAnswer:	"2"
                       },
                       {   	
                          question:	"¿Hay un perro en la imagen?",
                          alternatives:	["Si", "No"],
                          correctAnswer:	"No"
                       },
                       {   
                          question:	"¿Cuántas personas hay en el agua?",
                          alternatives:	["3","2","4","5","6"],
                          correctAnswer:	"4"
                       }   
                       
						
						
                    ]),
                    new QuestionBlock('imagen4.png', [
                        {
                            question: "¿Cómo se llama el hotel?",
                            alternatives: ["Hotel Colon", "Hotel Suisse", "Hotel Real", "Hotel Regal"],
                            correctAnswer: "Hotel Regal"
                        },
                        {
                            question: "¿Cuántos pisos tiene el hotel?",
                            alternatives: ["3", "2", "4", "5", "6"],
                            correctAnswer: "3"
                        },
                        {
                            question: "¿Qué actividades tiene el hotel?",
                            alternatives: ["Piscina/jacuzzi", "Juegos", "Salas de Baile", "Gym"],
                            correctAnswer: "Piscina/jacuzzi"
                        },
                        {
                            question: "¿Tienen sombrilla las personas que están en la mesa?",
                            alternatives: ["Si", "No"],
                            correctAnswer: "Si"
                        },
                        {
                            question: "¿Cuántos balcones tiene el hotel?",
                            alternatives: ["3", "2", "4", "5", "6"],
                            correctAnswer: "6"
                        },
						{
                           question:	"¿Cuál reglas no permite la piscina?",
                           alternatives:	["No bucear", "No Cantar", "No correr", "No comer" ],
                           correctAnswer:	"No bucear"
                        },
                        {	
                           question:	"¿A qué hora cierra la piscina?",
                           alternatives:	["3 pm","2 pm","4 pm","5 pm","6 pm"],
                           correctAnswer:	"4 pm"
                        },
                        {
                           question:	"¿Cuántas personas traen sombrero?",
                           alternatives:	["3","1","4","5","6"],
                           correctAnswer:	"1"
                        },
                        {	
                           question:	"¿Cuantos están en la piscina?",
                           alternatives:	["3","1","4","5","6"],
                           correctAnswer:	"3"
                        },
                        {
                           question:	"¿Cuantos están en el jacuzzi?",
                           alternatives:	["3","1","4","5","6"],
                           correctAnswer:	"1"
                        },
                        {
                           question:	"¿Qué están haciendo las personas en la mesa?",
                           alternatives:	["Comiendo", "Cantando", "tomando vino", "durmiendo"],
                           correctAnswer:	"Comiendo"
                        },
                        {
                           question:	"¿De qué color es el hotel?",
                           alternatives:	["azul", "blanco", "café", "amarillo", "rojo"],
                           correctAnswer:	"amarillo" 
                        },
                        {	
                           question:	"¿Cuántas nubes hay en el cielo?",
                           alternatives:	["3","2","4","5","6"],
                           correctAnswer:	"3"
                        }
                        						
						
                    ])
                ];
            }
            
            setupEventListeners() {
                this.startBtn.addEventListener('click', () => this.startGame());
                this.nextBtn.addEventListener('click', () => this.hideFeedbackAndContinue());
          //      this.saveBtn.addEventListener('click', () => this.saveResults());
                this.restartBtn.addEventListener('click', () => this.restartGame());
            }
            
            startGame() {
				//user
				 const username = document.getElementById('username').value.trim();
                if (!username) {
                    alert('Por favor, ingresa tu nombre para comenzar.');
                    return;
                }
                
                this.user = new User(username);
                this.currentUser = username;
				
                // Iniciar música de fondo
                this.backgroundMusic.play().catch(e => console.log("La reproducción automática fue bloqueada:", e));
                
                // Ocultar instrucciones y mostrar elementos del juego
                document.querySelector('.instructions').style.display = 'none';
                this.scorePanel = document.querySelector('.score');
                //this.scorePanel.style.display = 'flex';
                
                this.currentBlockIndex = 0;
                this.correctCount = 0;
                this.incorrectCount = 0;
                this.updateScoreDisplay();
                
                this.showNextImage();
            }
            
            showNextImage() {
                if (this.currentBlockIndex >= this.questionBlocks.length) {
                    this.registrar();
					this.showFinalScreen();
					
                    return;
                }
                
                this.currentQuestionBlock = this.questionBlocks[this.currentBlockIndex];
				                
				var  imgvar =  this.currentQuestionBlock.image;
                this.currentImage.src = `images/${imgvar}`;
                this.imageContainer.classList.remove('hidden');
                this.questionContainer.classList.add('hidden');
                
                this.isShowingImage = true;
                let timeLeft = 15
                this.imageTimerElement.textContent = timeLeft;
                
                this.imageTimer = setInterval(() => {
                    timeLeft--;
                    this.imageTimerElement.textContent = timeLeft;
                    
                    if (timeLeft <= 0) {
                        clearInterval(this.imageTimer);
                        this.hideImageAndShowQuestions();
                    }
                }, 1000);
            }
            
            hideImageAndShowQuestions() {
                this.imageContainer.classList.add('hidden');
                this.questionContainer.classList.remove('hidden');
                this.isShowingImage = false;
                
                this.currentQuestionBlock.reset();
                this.showCurrentQuestion();
            }
            
            showCurrentQuestion() {
                const question = this.currentQuestionBlock.getCurrentQuestion();
                this.questionText.textContent = question.question;
                
                this.alternativesContainer.innerHTML = '';
                
                const colorClasses = ['hot-blue', 'spring-green', 'orange', 'gold'];
                
                question.alternatives.forEach((alternative, index) => {
                    const alternativeElement = document.createElement('div');
                    alternativeElement.classList.add('alternative');
                    alternativeElement.classList.add(colorClasses[index % colorClasses.length]);
                    alternativeElement.textContent = alternative;
                    alternativeElement.addEventListener('click', () => this.selectAlternative(alternative, question.correctAnswer));
                    
                    this.alternativesContainer.appendChild(alternativeElement);
                });
                
                this.updateQuestionCount();
            }
            
            selectAlternative(selectedAnswer, correctAnswer) {
                // Deshabilitar todas las alternativas
                const alternatives = document.querySelectorAll('.alternative');
                alternatives.forEach(alt => {
                    alt.style.pointerEvents = 'none';
                    
                    if (alt.textContent === correctAnswer) {
                        alt.classList.add('correct');
                    } else if (alt.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
                        alt.classList.add('incorrect');
                    }
                });
                
                // Verificar respuesta
                if (selectedAnswer === correctAnswer) {
                    this.correctCount++;
					this.user.addCorrect();
					this.Continue();
                    //this.feedbackManager.showCorrect();
                } else {
                    this.incorrectCount++;
					this.user.addIncorrect();
					this.Continue();
                    //this.feedbackManager.showIncorrect(correctAnswer);
                }
                
                this.updateScoreDisplay();
            }
            
            Continue() {
                //this.feedbackManager.hide();
                
                if (this.currentQuestionBlock.hasNextQuestion()) {
                    this.currentQuestionBlock.nextQuestion();
                    this.showCurrentQuestion();
                } else {
                    this.currentBlockIndex++;
                    this.showNextImage();
                }
            }
            
            updateScoreDisplay() {
                this.correctCountElement.textContent = this.correctCount;
                this.incorrectCountElement.textContent = this.incorrectCount;
            }
            
            updateQuestionCount() {
                const current = this.currentQuestionBlock.currentQuestionIndex + 1;
                const total = this.currentQuestionBlock.questions.length;
                this.questionCountElement.textContent = `${current}/${total}`;
            }
            
            showFinalScreen() {
                              
				
				this.finalCorrect.textContent = this.correctCount;
                this.finalIncorrect.textContent = this.incorrectCount;
                
                const totalQuestions = this.correctCount + this.incorrectCount;
                const percentage = totalQuestions > 0 ? Math.round((this.correctCount / totalQuestions) * 100) : 0;
                this.finalPercentage.textContent = `${percentage}%`;
               
                this.user.correctAnswers = this.correctCount;
                this.user.incorrectAnswers = this.incorrectCount;
                
				this.registrar();
				
                this.finalScreen.style.display = 'flex';
            }
            
            saveResults() {
                const userName = this.userNameInput.value.trim();
                if (!userName) {
                    alert('Por favor, ingresa tu nombre para guardar los resultados.');
                    return;
                }
                
                this.user = new User(userName);
                this.user.correctAnswers = this.correctCount;
                this.user.incorrectAnswers = this.incorrectCount;
                //this.user.score = Math.round((this.correctCount / (this.correctCount + this.incorrectCount)) * 100);
                
                //const savedData = this.user.saveToStorage();
                //alert(`Resultados guardados para ${savedData.name}. Puntuación: ${this.getPercentage()}%`);
            }
            
            restartGame() {
                this.finalScreen.style.display = 'none';
                this.imageContainer.classList.add('hidden');
                this.questionContainer.classList.add('hidden');
                document.querySelector('.instructions').style.display = 'block';
                this.scorePanel.style.display = 'block';
				this.scorePanel = document.querySelector('.score');
                //this.scorePanel.style.display = 'flex';
                
                this.currentBlockIndex = 0;
                this.correctCount = 0;
                this.incorrectCount = 0;
                this.updateScoreDisplay();
            }
			
			registrar() {
                     const stats = contador.cargarEstadisticas();
					 const results = this.user.getResults();
		            
                        // alert(`Resultados guardados:\nAciertos: ${results.correctAnswers}\nErrores: ${results.incorrectAnswers}\nFecha: ${new Date(results.date).toLocaleString()}`);
	                 console.log("registro",stats);
                     stats.imgA = results.correct;
		             stats.imgE = results.incorrect;
					 console.log(`resultados corre ${results.correct}  error ${results.incorrect}`);
                     contador.guardarEstadisticas(results.correct,results.incorrect,4);
		
           }
			
        }

        // Inicializar el juego cuando se carga la página
        document.addEventListener('DOMContentLoaded', () => {
            const game = new MemoryVisualGame();
        });
