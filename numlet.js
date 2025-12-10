        // Clase para gestionar usuarios
        class User {
            constructor() {
                this.name = name;
				this.correctAnswers = 0;
                this.incorrectAnswers = 0;
                this.currentQuestion = 0;
				this.startTime = new Date();
                this.results = [];
            }	

            addCorrect() {
                this.correctAnswers++;
                //this.saveToStorage();
            }

            addIncorrect() {
                this.incorrectAnswers++;
                //this.saveToStorage();
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
                const result = {
                    date: new Date().toISOString(),
                    correct: this.correctAnswers,
                    incorrect: this.incorrectAnswers,
                    total: this.correctAnswers + this.incorrectAnswers
                };
                
                this.results.push(result);
                
                // Guardar en localStorage
                let savedResults = JSON.parse(localStorage.getItem('memoryGameResults')) || [];
                savedResults.push(result);
                localStorage.setItem('memoryGameResults', JSON.stringify(savedResults));
                
                return result;
            }
        }

        // Clase para el bloque de pregunta
        class QuestionBlock {
            constructor(sequence, correctAnswer) {
                this.sequence = sequence;
                this.correctAnswer = correctAnswer;
            }
            
            displaySequence(element) {
                element.textContent = this.sequence;
            }
            
            checkAnswer(userAnswer) {
                return userAnswer.toUpperCase().replace(/\s/g, '') === this.correctAnswer.toUpperCase().replace(/\s/g, '');
            }
        }

        // Clase para gestionar la retroalimentación
        class FeedbackManager {
            static showFeedback(element, isCorrect, correctAnswer = '') {
                element.classList.remove('correct-feedback', 'incorrect-feedback');
                element.style.display = 'block';
                
                if (isCorrect) {
                    element.textContent = '¡Correcto!';
                    element.classList.add('correct-feedback');
                } else {
                    element.textContent = `Incorrecto. La respuesta correcta es: ${correctAnswer}`;
                    element.classList.add('incorrect-feedback');
                }
            }
            
            static hideFeedback(element) {
                element.style.display = 'none';
            }
        }

        // Clase para el fondo estelar
        class Starfield {
            constructor(container) {
                this.container = container;
                this.stars = [];
                this.init();
            }
            
            init() {
                // Crear estrellas
                for (let i = 0; i < 150; i++) {
                    this.createStar();
                }
            }
            
            createStar() {
                const star = document.createElement('div');
                star.classList.add('star');
                
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
                
                // Animación de parpadeo
                this.animateStar(star);
            }
            
            animateStar(star) {
                const duration = Math.random() * 3 + 2;
                const delay = Math.random() * 5;
                
                star.style.animation = `twinkle ${duration}s infinite ${delay}s`;
            }
        }

        // Clase principal del juego
        class MemoryGame {
            constructor() {
                this.user = new User();
                this.questions = this.generateQuestions();
                this.currentQuestionIndex = 0;
                this.isSoundOn = true;
                
                this.initializeElements();
                this.initializeEventListeners();
                this.starfield = new Starfield(document.getElementById('stars-container'));
                
                // Iniciar música de fondo
                this.backgroundMusic = document.getElementById('background-music');
                this.backgroundMusic.volume = 0.3;
            }
            
            initializeElements() {
                // Pantallas
                this.welcomeScreen = document.getElementById('welcome-screen');
                this.gameScreen = document.getElementById('game-screen');
                this.resultsScreen = document.getElementById('results-screen');
                
                // Elementos de juego
                this.sequenceDisplay = document.getElementById('sequence-display');
                this.answerSection = document.getElementById('answer-section');
                this.answerInput = document.getElementById('answer-input');
                this.submitBtn = document.getElementById('submit-btn');
                this.feedback = document.getElementById('feedback');
                this.progressBar = document.getElementById('progress-bar');
                
                // Contadores
                this.correctCount = document.getElementById('correct-count');
                this.incorrectCount = document.getElementById('incorrect-count');
                this.questionCount = document.getElementById('question-count');
                this.totalQuestions = document.getElementById('total-questions');
                this.finalScore = document.getElementById('final-score');
                this.completionMessage = document.getElementById('completion-message');
                
                // Botones
                this.startBtn = document.getElementById('start-btn');
                this.restartBtn = document.getElementById('restart-btn');
                this.saveBtn = document.getElementById('save-btn');
                this.soundToggle = document.getElementById('sound-toggle');
                
                // Establecer el total de preguntas
                this.totalQuestions.textContent = this.questions.length;
            }
            
            initializeEventListeners() {
                this.startBtn.addEventListener('click', () => this.startGame());
                this.submitBtn.addEventListener('click', () => this.checkAnswer());
                this.restartBtn.addEventListener('click', () => this.restartGame());
                this.saveBtn.addEventListener('click', () => this.saveResults());
                this.soundToggle.addEventListener('click', () => this.toggleSound());
                
                // Permitir enviar respuesta con Enter
                this.answerInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.checkAnswer();
                    }
                });
            }
            
            generateQuestions() {
                return [
                    new QuestionBlock("R1", "1R"),
                    new QuestionBlock("D2", "2D"),
                    new QuestionBlock("7T", "7T"),
                    new QuestionBlock("PG2", "2GP"),
                    new QuestionBlock("K93", "39K"),
                    new QuestionBlock("A5P", "5AP"),
                    new QuestionBlock("R921", "129R"),
                    new QuestionBlock("C34Z", "34CZ"),
                    new QuestionBlock("7N2U", "27NU"),
                    new QuestionBlock("2E6B4", "246BE"),
                    new QuestionBlock("X1C8H", "18CHX"),
                    new QuestionBlock("7Y26A", "267AY"),
                    new QuestionBlock("M7E4Y2", "247EMY"),
                    new QuestionBlock("Q9I8K3", "389IKQ"),
                    new QuestionBlock("4R6B2S", "246BRS"),
                    new QuestionBlock("R3J1U5E", "135EJRU"),
                    new QuestionBlock("Y7D3N4", "347DNY"),
                    new QuestionBlock("W9P2S6", "269PSW"),
                    new QuestionBlock("G1E7N2P6", "1267EGNP"),
                    new QuestionBlock("D1J4K2L7", "1247DJKL")
                ];
            }
            
            startGame() {
                this.welcomeScreen.classList.add('hidden');
                this.gameScreen.classList.remove('hidden');
                
                // Reproducir música de fondo si está activada
                if (this.isSoundOn) {
                    this.backgroundMusic.play().catch(e => console.log("Autoplay bloqueado:", e));
                }
                
                this.showNextQuestion();
            }
            
            showNextQuestion() {
                if (this.currentQuestionIndex >= this.questions.length) {
                    this.showResults();
                    return;
                }
                let miElemento = document.getElementById('question');
                    miElemento.classList.remove('hidden');
                // Actualizar contadores
                this.questionCount.textContent = this.currentQuestionIndex + 1;
                this.correctCount.textContent = this.user.correctAnswers;
                this.incorrectCount.textContent = this.user.incorrectAnswers;
                
                // Ocultar sección de respuesta y retroalimentación
                this.answerSection.classList.add('hidden');
                FeedbackManager.hideFeedback(this.feedback);
                
                // Mostrar secuencia actual
                const currentQuestion = this.questions[this.currentQuestionIndex];
                currentQuestion.displaySequence(this.sequenceDisplay);
                
                // Iniciar barra de progreso
                this.animateProgressBar(4, () => {
                    // Ocultar secuencia después de 4 segundos
					let miElemento = document.getElementById('question');
                    miElemento.classList.add('hidden');
					
                    this.sequenceDisplay.textContent = '';
                    this.answerSection.classList.remove('hidden');
                    this.answerInput.focus();
                });
            }
            
            animateProgressBar(duration, callback) {
                this.progressBar.style.width = '0%';
                
                let startTime = null;
                const animate = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = (timestamp - startTime) / (duration * 1000);
                    
                    if (progress < 1) {
                        this.progressBar.style.width = `${progress * 100}%`;
                        requestAnimationFrame(animate);
                    } else {
                        this.progressBar.style.width = '100%';
                        if (callback) callback();
                    }
                };
                
                requestAnimationFrame(animate);
            }
            
            checkAnswer() {
                const userAnswer = this.answerInput.value.trim();
                if (!userAnswer) return;
                
                const currentQuestion = this.questions[this.currentQuestionIndex];
                const isCorrect = currentQuestion.checkAnswer(userAnswer);
                
                if (isCorrect) {
                    this.user.addCorrect();
                } else {
                    this.user.addIncorrect();
                }
                
                // Mostrar retroalimentación
                FeedbackManager.showFeedback(this.feedback, isCorrect, currentQuestion.correctAnswer);
                
                // Limpiar campo de entrada
                this.answerInput.value = '';
                
                // Avanzar a la siguiente pregunta después de un breve retraso
                setTimeout(() => {
                    this.currentQuestionIndex++;
                    this.showNextQuestion();
                }, 1500);
            }
			
			registrar() {
                     const stats = contador.cargarEstadisticas();
					 const results = this.user.getResults();
		         
                        // alert(`Resultados guardados:\nAciertos: ${results.correctAnswers}\nErrores: ${results.incorrectAnswers}\nFecha: ${new Date(results.date).toLocaleString()}`);
	                 console.log("registro",stats);
                     stats.letA = results.correct;
		             stats.letE = results.incorrect;
                     contador.guardarEstadisticas(results.correct,results.incorrect,6);
		
           }
			
            
            showResults() {
                this.gameScreen.classList.add('hidden');
                this.resultsScreen.classList.remove('hidden');
                this.registrar();
                // Mostrar puntuación final
                const totalQuestions = this.questions.length;
                const correctAnswers = this.user.correctAnswers;
                const percentage = Math.round((correctAnswers / totalQuestions) * 100);
                
                this.finalScore.textContent = `${correctAnswers} / ${totalQuestions} (${percentage}%)`;
                
                // Mensaje personalizado según el rendimiento
                if (percentage >= 90) {
                    this.completionMessage.textContent = "¡Excelente! Tu memoria de trabajo es excepcional.";
                } else if (percentage >= 70) {
                    this.completionMessage.textContent = "¡Muy bien! Tienes una buena capacidad de memoria.";
                } else if (percentage >= 50) {
                    this.completionMessage.textContent = "Buen trabajo. Sigue practicando para mejorar.";
                } else {
                    this.completionMessage.textContent = "Sigue practicando. La memoria mejora con el ejercicio.";
                }
            }
            
            restartGame() {
                this.user = new User();
                this.currentQuestionIndex = 0;
                
                this.resultsScreen.classList.add('hidden');
                this.gameScreen.classList.remove('hidden');
                
                this.showNextQuestion();
            }
			
			registrar() {
                     const stats = contador.cargarEstadisticas();
					 const results = this.user.getResults();
		            
                        // alert(`Resultados guardados:\nAciertos: ${results.correctAnswers}\nErrores: ${results.incorrectAnswers}\nFecha: ${new Date(results.date).toLocaleString()}`);
	                 console.log("registro",stats);
                     stats.nleA = results.correct;
		             stats.nleE = results.incorrect;
                     contador.guardarEstadisticas(results.correct,results.incorrect,6);
		
           }
			
            
            saveResults() {
                const result = this.user.saveResults();
                alert(`Resultados guardados:\nFecha: ${new Date(result.date).toLocaleString()}\nAciertos: ${result.correct}\nErrores: ${result.incorrect}`);
            }
            
            toggleSound() {
                this.isSoundOn = !this.isSoundOn;
                
                if (this.isSoundOn) {
                    this.backgroundMusic.play();
                    this.soundToggle.innerHTML = '<i>🔊</i>';
                } else {
                    this.backgroundMusic.pause();
                    this.soundToggle.innerHTML = '<i>🔇</i>';
                }
            }
        }

        // Inicializar el juego cuando se carga la página
        document.addEventListener('DOMContentLoaded', () => {
            const game = new MemoryGame();
            
            // Agregar estilos para la animación de parpadeo de estrellas
            const style = document.createElement('style');
            style.textContent = `
                @keyframes twinkle {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; }
                }
            `;
            document.head.appendChild(style);
        });
