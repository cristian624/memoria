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
        }

        // Clase para el bloque de pregunta
        class QuestionBlock {
            constructor(title, image, alternatives, correctAnswer) {
                this.title = title;
                this.text = "Este Objeto salio?";
                this.image = image;
                this.alternatives = alternatives;
                this.correctAnswer = correctAnswer;
            }

            isCorrect(answer) {
                return answer === this.correctAnswer;
            }
        }

        // Clase para gestionar la retroalimentación
        class FeedbackManager {
            constructor() {
                this.correctSound = document.getElementById('correct-sound');
                this.incorrectSound = document.getElementById('incorrect-sound');
                this.transitionSound = document.getElementById('transition-sound');
            }

            playCorrect() {
                this.correctSound.play();
            }

            playIncorrect() {
                this.incorrectSound.play();
            }

            playTransition() {
                this.transitionSound.play();
            }

            showFeedback(isCorrect, element) {
                if (isCorrect) {
                    element.classList.add('correct');
                    this.playCorrect();
                } else {
                    element.classList.add('incorrect');
                    this.playIncorrect();
                }

                // Quitar la clase después de un tiempo
                setTimeout(() => {
                    element.classList.remove('correct', 'incorrect');
                }, 1000);
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
                
                // Redimensionar cuando cambie el tamaño de la ventana
                window.addEventListener('resize', () => this.resize());
            }

            resize() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.init();
            }

            init() {
                // Crear estrellas
                this.stars = [];
                const starCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
                
                for (let i = 0; i < starCount; i++) {
                    this.stars.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        size: Math.random() * 2 + 1,
                        speed: Math.random() * 0.5 + 0.1,
                        brightness: Math.random() * 0.5 + 0.5
                    });
                }
            }

            draw() {
                // Limpiar canvas
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Dibujar estrellas
                this.ctx.fillStyle = 'white';
                for (const star of this.stars) {
                    this.ctx.globalAlpha = star.brightness;
                    this.ctx.beginPath();
                    this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // Mover estrellas
                    star.y += star.speed;
                    if (star.y > this.canvas.height) {
                        star.y = 0;
                        star.x = Math.random() * this.canvas.width;
                    }
                }
                this.ctx.globalAlpha = 1;
                
                // Solicitar siguiente frame
                requestAnimationFrame(() => this.draw());
            }
        }

        // Clase principal del juego
        class MemoryGame {
            constructor() {
                this.user = null;
                this.currentUser = null;
                this.currentMemorizationIndex = 0;
                this.currentQuestionIndex = 0;
                this.memorizationImages = [
                    "fresas.png", "queso.png", "conejo.png", "trineo.png",
                    "anillo.png", "granja.png", "abanico.png", "florero.png",
                    "lentes.png", "camisa.png", "tigre.png", "yate.png",
                    "fuego.png", "paraguas.png", "violin.png", "television.png",
                    "zanahoria.png", "boton.png", "borrego.png", "lapiz.png",
                    "dientes.png", "taza.png", "sol.png", "carritoare.png"
                ];
                
                this.questions = [
                    // Primer test
                    new QuestionBlock("MEMORIA", "yoyo.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA", "borrego.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "television.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "taza.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "dados.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA", "anillo.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "fuego.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "sapo.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA", "florero.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "descorchador.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA", "camion.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA", "bate.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA", "abanico.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "camisa.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "trineo.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "yate.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "oso.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA", "gusano.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA", "sol.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "ojo.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA", "queso.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA", "avion.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA", "uvas.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA", "martillo.png", ["Si", "No"], "No"),
												  
                    // Segundo test
                    new QuestionBlock("MEMORIA","fresas.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA","lapiz.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA","tigre.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA","dientes.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA","moto.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","granja.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA","bandera.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","iglesia.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","leche.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","arania.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","regla.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","zanahoria.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA","reloj.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","paraguas.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA","boton.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA","violin.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA","nubes.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","carritoare.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA","gallo.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","helado.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","lentes.png", ["Si", "No"], "Si"),
                    new QuestionBlock("MEMORIA","labios.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","platano.png", ["Si", "No"], "No"),
                    new QuestionBlock("MEMORIA","conejo.png", ["Si", "No"], "Si")
                ];                                
				
                this.feedbackManager = new FeedbackManager();
                this.starfield = new Starfield('starfield');
                this.timerInterval = null;
                this.currentTime = 4;
                
                this.init();
            }

            init() {
                // Inicializar elementos del DOM
                this.startScreen = document.getElementById('start-screen');
                this.memorizationScreen = document.getElementById('memorization-screen');
                this.questionScreen = document.getElementById('question-screen');
                this.resultsScreen = document.getElementById('results-screen');
                
                this.correctCount = document.getElementById('correct-count');
                this.incorrectCount = document.getElementById('incorrect-count');
                this.timerDisplay = document.getElementById('timer');
                
                this.memorizationImg = document.getElementById('memorization-img');
                this.questionTitle = document.getElementById('question-title');
                this.questionText = document.getElementById('question-text');
                this.questionImg = document.getElementById('question-img');
                
                this.resultName = document.getElementById('result-name');
                this.resultCorrect = document.getElementById('result-correct');
                this.resultIncorrect = document.getElementById('result-incorrect');
                this.resultPercentage = document.getElementById('result-percentage');
                this.resultMessage = document.getElementById('result-message');
                
                // Configurar event listeners
                document.getElementById('start-btn').addEventListener('click', () => this.startGame());
                document.getElementById('save-btn').addEventListener('click', () => this.saveResults());
                document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
                
                // Configurar alternativas
                const alternatives = document.querySelectorAll('.alternative');
                alternatives.forEach(alt => {
                    alt.addEventListener('click', (e) => this.handleAnswer(e.target.dataset.value));
                });
                
                // Iniciar música de fondo
                const backgroundMusic = document.getElementById('background-music');
                backgroundMusic.volume = 0.3;
                 this.user = new User(username);
                this.currentUser = username;
                // Iniciar animación del fondo estelar
                this.starfield.draw();
            }

            startGame() {
                const username = document.getElementById('username').value.trim();
                if (!username) {
                    alert('Por favor, ingresa tu nombre para comenzar.');
                    return;
                }
                
               
                
                // Reproducir música de fondo
                document.getElementById('background-music').play();
                
                // Iniciar fase de memorización
                this.showScreen('memorization-screen');
                this.startMemorizationPhase();
            }

            startMemorizationPhase() {
                this.currentMemorizationIndex = 0;
                this.showNextMemorizationImage();
            }

            showNextMemorizationImage() {
                if (this.currentMemorizationIndex >= this.memorizationImages.length) {
                    // Terminar fase de memorización y comenzar preguntas
                    this.startQuestionPhase();
                    return;
                }
                
                const image =  this.memorizationImages[this.currentMemorizationIndex];
                this.memorizationImg.src = `images/${image}`;
                this.currentMemorizationIndex++;
                
                // Reiniciar temporizador
                this.currentTime = 4;
                this.timerDisplay.textContent = this.currentTime;
                
                // Iniciar cuenta regresiva
                if (this.timerInterval) clearInterval(this.timerInterval);
                this.timerInterval = setInterval(() => {
                    this.currentTime--;
                    this.timerDisplay.textContent = this.currentTime;
                    
                    if (this.currentTime <= 0) {
                        clearInterval(this.timerInterval);
                        this.feedbackManager.playTransition();
                        this.showNextMemorizationImage();
                    }
                }, 1000);
            }

            startQuestionPhase() {
                this.currentQuestionIndex = 0;
                this.showNextQuestion();
            }

            showNextQuestion() {
                if (this.currentQuestionIndex >= this.questions.length) {
                    // Terminar juego y mostrar resultados
                    this.showResults();
					this.registrar();
                    return;
                }
                
                const question = this.questions[this.currentQuestionIndex];
                this.questionTitle.textContent = question.title;
                this.questionText.textContent =  question.text;
                this.questionImg.src = `images/${question.image}`;
				this.questionScreen.classList.add('QuestionBlock');
				this.questionText.classList.add('QuestionInstru');
                
                this.showScreen('question-screen');
            }

            handleAnswer(answer) {
                const question = this.questions[this.currentQuestionIndex];
                const isCorrect = question.isCorrect(answer);
                
                // Actualizar contadores
                if (isCorrect) {
                    this.user.addCorrect();
                } else {
                    this.user.addIncorrect();
                }
                
                // Actualizar marcador
                this.correctCount.textContent = this.user.correctAnswers;
                this.incorrectCount.textContent = this.user.incorrectAnswers;
                
                // Mostrar retroalimentación
                const alternatives = document.querySelectorAll('.alternative');
                alternatives.forEach(alt => {
                    if (alt.dataset.value === answer) {
                        this.feedbackManager.showFeedback(isCorrect, alt);
                    }
                });
                
                // Avanzar a la siguiente pregunta después de un breve retardo
                setTimeout(() => {
                    this.currentQuestionIndex++;
                    this.showNextQuestion();
                }, 1000);
            }

           

            showResults() {
                const results = this.user.getResults();
                
                this.resultName.textContent = results.name;
                this.resultCorrect.textContent = results.correct;
                this.resultIncorrect.textContent = results.incorrect;
                this.resultPercentage.textContent = results.percentage;
                
                // Mensaje personalizado según el rendimiento
                if (results.percentage >= 90) {
                    this.resultMessage.textContent = "¡Excelente! Tienes una memoria visual excepcional.";
                } else if (results.percentage >= 70) {
                    this.resultMessage.textContent = "¡Muy bien! Tienes una buena memoria visual.";
                } else if (results.percentage >= 50) {
                    this.resultMessage.textContent = "Buen trabajo. Sigue practicando para mejorar.";
                } else {
                    this.resultMessage.textContent = "Sigue practicando. La memoria visual mejora con el ejercicio.";
                }
                
                this.showScreen('results-screen');
            }

            saveResults() {
                const results = this.user.getResults();
                
                // En un entorno real, aquí enviaríamos los resultados a un servidor
                // Por ahora, simularemos el guardado mostrando un mensaje
                alert(`Resultados guardados para ${results.name}\nAciertos: ${results.correct}\nErrores: ${results.incorrect}\nPorcentaje: ${results.percentage}%`);
                
                // En una implementación real, podríamos usar:
                // localStorage, una base de datos SQLite (con una extensión) o enviar a un servidor
            }

            restartGame() {
                // Reiniciar el juego
                this.user = new User(this.currentUser);
                this.currentMemorizationIndex = 0;
                this.currentQuestionIndex = 0;
                
                // Actualizar marcador
                this.correctCount.textContent = '0';
                this.incorrectCount.textContent = '0';
                
                // Volver a la pantalla de inicio
                this.showScreen('start-screen');
            }

            showScreen(screenId) {
                // Ocultar todas las pantallas
                const screens = document.querySelectorAll('.screen');
                screens.forEach(screen => {
                    screen.classList.remove('active');
                });
                
                // Mostrar la pantalla solicitada
                document.getElementById(screenId).classList.add('active');
            }
			
			registrar() {
                     const stats = contador.cargarEstadisticas();
					 const results = this.user.getResults();
		            
                        // alert(`Resultados guardados:\nAciertos: ${results.correctAnswers}\nErrores: ${results.incorrectAnswers}\nFecha: ${new Date(results.date).toLocaleString()}`);
	                 console.log("registro",stats);
                     stats.objA = results.correct;
		             stats.objE = results.incorrect;
                     contador.guardarEstadisticas(results.correct,results.incorrect,2);
		
           }
        }

        // Inicializar el juego cuando se carga la página
        document.addEventListener('DOMContentLoaded', () => {
            new MemoryGame();
        });