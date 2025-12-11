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
            constructor(wordsToRemember, question, alternatives, correctAnswer) {
                this.wordsToRemember = wordsToRemember;
                this.question = question;
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
                this.correctSound = new Audio();
                this.incorrectSound = new Audio();
                this.backgroundMusic = new Audio('background.mp3');
                this.backgroundMusic.loop = true;
                this.isMuted = false;
                
                // En un entorno real, cargaríamos archivos de sonido reales
                // this.correctSound.src = 'correct.mp3';
                // this.incorrectSound.src = 'incorrect.mp3';
            }
            
            playCorrect() {
                if (!this.isMuted) {
                    // Simulación de sonido correcto
                    console.log("Sonido correcto reproducido");
                }
            }
            
            playIncorrect() {
                if (!this.isMuted) {
                    // Simulación de sonido incorrecto
                    console.log("Sonido incorrecto reproducido");
                }
            }
            
            playBackgroundMusic() {
                 
				if (this.isMuted) {
                    this.backgroundMusic.play().catch(e => console.log("Error reproduciendo música:", e));
                }
            }
            
            stopBackgroundMusic() {
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
            }
            
            toggleMute() {
                this.isMuted = !this.isMuted;
                if (this.isMuted) {
                    this.backgroundMusic.pause();
                } else {
                    this.backgroundMusic.play().catch(e => console.log("Error reproduciendo música:", e));
                }
                return this.isMuted;
            }
        }

        // Clase para el fondo estelar
        class Starfield {
            constructor(container) {
                this.container = container;
                this.stars = [];
                this.createStars();
            }
            
            createStars() {
                // Crear estrellas de diferentes tamaños y brillos
                for (let i = 0; i < 150; i++) {
                    const star = document.createElement('div');
                    star.classList.add('star');
                    
                    // Tamaño aleatorio entre 1 y 3 píxeles
                    const size = Math.random() * 2 + 1;
                    star.style.width = `${size}px`;
                    star.style.height = `${size}px`;
                    
                    // Posición aleatoria
                    star.style.left = `${Math.random() * 100}%`;
                    star.style.top = `${Math.random() * 100}%`;
                    
                    // Brillo aleatorio
                    const opacity = Math.random() * 0.7 + 0.3;
                    star.style.opacity = opacity;
                    
                    this.container.appendChild(star);
                    this.stars.push(star);
                }
            }
            
            animateStars() {
                // Animación sutil de las estrellas (parpadeo)
                this.stars.forEach(star => {
                    if (Math.random() < 0.01) {
                        star.style.opacity = Math.random() * 0.7 + 0.3;
                    }
                });
                
                requestAnimationFrame(() => this.animateStars());
            }
        }

        // Clase principal del juego
        class MemoryGame {
            constructor() {
                this.user = null;
                this.currentUser = null;
                this.feedbackManager = new FeedbackManager();
                this.starfield = new Starfield(document.getElementById('stars-container'));
                this.currentTest = 0;
                this.currentQuestion = 0;
                this.correctAnswers = 0;
                this.incorrectAnswers = 0;
                this.tests = this.initializeTests();
                this.isRemembering = false;
                this.rememberTimer = null;
                this.rememberTime = 25; // 15 segundos para memorizar
                this.timeLeft = this.rememberTime;
                
                this.initializeEventListeners();
                this.starfield.animateStars();
                this.feedbackManager.playBackgroundMusic();
				
				
			
				
            }
            
            initializeTests() {
				 if (!username) {
                    alert('Por favor, ingresa tu nombre para comenzar.');
                    return;
                }
				console.log(`username ${username}`);
				
				this.user = new User(username);
                this.currentUser = username;
                return [
                    {
                        wordsToRemember: ["coche - raya", "avispa - árbol", "serpiente - arcoíris", "garaje - revista", "círculo - escaleras", "conejo - palomitas", "margarita - caja", "jirafa - espejo"],
                        questions: [
                            { question: "garaje", alternatives: ["raya", "árbol", "arcoíris", "revista", "escaleras", "palomitas", "caja", "espejo"], correct: "revista" },
                            { question: "serpiente", alternatives: ["raya", "árbol", "arcoíris", "revista", "escaleras", "palomitas", "caja", "espejo"], correct: "arcoíris" },
                            { question: "círculo", alternatives: ["raya", "árbol", "arcoíris", "revista", "escaleras", "palomitas", "caja", "espejo"], correct: "escaleras" },
                            { question: "margarita", alternatives: ["raya", "árbol", "arcoíris", "revista", "escaleras", "palomitas", "caja", "espejo"], correct: "caja" },
                            { question: "jirafa", alternatives: ["raya", "árbol", "arcoíris", "revista", "escaleras", "palomitas", "caja", "espejo"], correct: "espejo" },
                            { question: "coche", alternatives: ["raya", "árbol", "arcoíris", "revista", "escaleras", "palomitas", "caja", "espejo"], correct: "raya" },
                            { question: "avispa", alternatives: ["raya", "árbol", "arcoíris", "revista", "escaleras", "palomitas", "caja", "espejo"], correct: "árbol" },
                            { question: "conejo", alternatives: ["raya", "árbol", "arcoíris", "revista", "escaleras", "palomitas", "caja", "espejo"], correct: "palomitas" }
                        ]
                    },
                    {
                        wordsToRemember: ["círculo - escaleras", "jirafa - espejo", "avispa - árbol", "coche - raya", "serpiente - arcoíris", "garaje - revista", "conejo - palomitas", "margarita - caja"],
                        questions: [
                            { question: "jirafa", alternatives: ["escaleras", "espejo", "árbol", "raya", "arcoíris", "revista", "palomitas", "caja"], correct: "espejo" },
                            { question: "avispa", alternatives: ["escaleras", "espejo", "árbol", "raya", "arcoíris", "revista", "palomitas", "caja"], correct: "árbol" },
                            { question: "serpiente", alternatives: ["escaleras", "espejo", "árbol", "raya", "arcoíris", "revista", "palomitas", "caja"], correct: "arcoíris" },
                            { question: "margarita", alternatives: ["escaleras", "espejo", "árbol", "raya", "arcoíris", "revista", "palomitas", "caja"], correct: "caja" },
                            { question: "círculo", alternatives: ["escaleras", "espejo", "árbol", "raya", "arcoíris", "revista", "palomitas", "caja"], correct: "escaleras" },
                            { question: "conejo", alternatives: ["escaleras", "espejo", "árbol", "raya", "arcoíris", "revista", "palomitas", "caja"], correct: "palomitas" },
                            { question: "garaje", alternatives: ["escaleras", "espejo", "árbol", "raya", "arcoíris", "revista", "palomitas", "caja"], correct: "revista" },
                            { question: "coche", alternatives: ["escaleras", "espejo", "árbol", "raya", "arcoíris", "revista", "palomitas", "caja"], correct: "raya" }
                        ]
                    }
					,
                    {
                        wordsToRemember: ["margarita - caja","conejo - palomitas", "círculo - escaleras", "serpiente - arcoíris", "jirafa - espejo", "avispa - árbol", "garaje - revista", "coche - raya"],
                        questions: [
						
						   { question: "avispa" , alternatives: ["caja", "palomitas", "escaleras", "arcoíris", "espejo", "árbol", "revista", "raya"], correct: "árbol"},
						   { question: "círculo", alternatives: ["caja", "palomitas", "escaleras", "arcoíris", "espejo", "árbol", "revista", "raya"], correct:"escaleras"},
						   { question: "coche", alternatives: ["caja", "palomitas", "escaleras", "arcoíris", "espejo", "árbol", "revista", "raya"], correct: "raya"},
						   {question: "margarita", alternatives: ["caja", "palomitas", "escaleras", "arcoíris", "espejo", "árbol", "revista", "raya"], correct: "caja"},
						   {question: "jirafa", alternatives: ["caja", "palomitas", "escaleras", "arcoíris", "espejo", "árbol", "revista", "raya"], correct:"espejo"},							
                           {question: "serpiente", alternatives: ["caja", "palomitas", "escaleras", "arcoíris", "espejo", "árbol", "revista", "raya"], correct: "arcoíris"},							
                           {question: "garaje", alternatives: ["caja","palomitas","escaleras","arcoíris","espejo","árbol","revista","raya"], correct: "revista"},						
                           {question: "conejo", alternatives: ["caja","palomitas","escaleras","arcoíris","espejo","árbol","revista","raya"], correct: "palomitas"}
                        ]
                    } 
					,
                    {
                        wordsToRemember: ["conejo - palomitas","coche - raya","círculo - escaleras","avispa - árbol","margarita - caja","serpiente - arcoíris","garaje - revista","jirafa - espejo"],
                        questions: [
						
						   {question: "círculo", alternatives: ["palomitas", "raya", "escaleras", "árbol", "caja", "arcoíris", "revista", "espejo"], correct: "escaleras"},
                           {question: "margarita",alternatives: ["palomitas", "raya", "escaleras", "árbol", "caja", "arcoíris", "revista", "espejo"], correct: "caja"},					
                           {question: "avispa", alternatives: ["palomitas", "raya", "escaleras", "árbol", "caja", "arcoíris", "revista", "espejo"], correct: "árbol"},
                           {question: "conejo", alternatives: ["palomitas", "raya", "escaleras", "árbol", "caja", "arcoíris", "revista", "espejo"], correct: "palomitas"},
                           {question: "jirafa", alternatives: ["palomitas", "raya", "escaleras", "árbol", "caja", "arcoíris", "revista", "espejo"], correct: "espejo"},
                           {question: "garaje", alternatives: ["palomitas", "raya", "escaleras", "árbol", "caja", "arcoíris", "revista", "espejo"], correct: "revista"},
                           {question: "serpiente", alternatives: ["palomitas", "raya", "escaleras","árbol","caja","arcoíris", "revista", "espejo"], correct: "arcoíris"},
							   {question: "coche", alternatives: ["palomitas", "raya", "escaleras", "árbol", "caja", "arcoíris", "revista", "espejo"], correct: "raya"}
                        ]
                    }
                ];
            }
            
            initializeEventListeners() {
                document.getElementById('start-btn').addEventListener('click', () => this.startGame());
                document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
                document.getElementById('save-results-btn').addEventListener('click', () => this.saveResults());
                document.getElementById('audio-control').addEventListener('click', () => this.toggleAudio());
            }
            
            startGame() {
				
				
                this.showScreen('remember-screen');
                this.displayWordsToRemember();
                this.startRememberTimer();
				
				const username = document.getElementById('username').value.trim();
				document.getElementById('background-music').play();
              console.log("username ",username);
			 	
            }
            
            displayWordsToRemember() {
                const wordsContainer = document.getElementById('words-container');
                wordsContainer.innerHTML = '';
                
                const currentTest = this.tests[this.currentTest];
                currentTest.wordsToRemember.forEach(wordPair => {
                    const wordElement = document.createElement('div');
                    wordElement.classList.add('word-pair');
                    wordElement.textContent = wordPair;
                    wordsContainer.appendChild(wordElement);
                });
            }
            
            startRememberTimer() {
                this.isRemembering = true;
                this.timeLeft = this.rememberTime;
                this.updateRememberProgress();
                
                this.rememberTimer = setInterval(() => {
                    this.timeLeft--;
                    this.updateRememberProgress();
                    
                    if (this.timeLeft <= 0) {
                        clearInterval(this.rememberTimer);
                        this.startQuestions();
                    }
                }, 1000);
            }
            
            updateRememberProgress() {
                const progress = document.getElementById('remember-progress');
                const percentage = ((this.rememberTime - this.timeLeft) / this.rememberTime) * 100;
                progress.style.width = `${percentage}%`;
                
                document.getElementById('countdown').textContent = `Tiempo restante: ${this.timeLeft} segundos`;
            }
            
            startQuestions() {
                this.showScreen('question-screen');
                this.displayQuestion();
            }
            
            displayQuestion() {
                const currentTest = this.tests[this.currentTest];
                const currentQuestion = currentTest.questions[this.currentQuestion];
                
                document.getElementById('question').textContent = `"${currentQuestion.question}"`;
                
                const alternativesContainer = document.getElementById('alternatives-container');
                alternativesContainer.innerHTML = '';
                
                // Mezclar alternativas para que no siempre estén en el mismo orden
                const shuffledAlternatives = this.shuffleArray([...currentQuestion.alternatives]);
                
                shuffledAlternatives.forEach(alternative => {
                    const alternativeElement = document.createElement('div');
                    alternativeElement.classList.add('alternative');
                    alternativeElement.textContent = alternative;
                    alternativeElement.addEventListener('click', () => this.checkAnswer(alternative, currentQuestion.correct));
                    alternativesContainer.appendChild(alternativeElement);
                });
            }
            
            checkAnswer(selectedAnswer, correctAnswer) {
                const alternatives = document.querySelectorAll('.alternative');
                
				// Deshabilitar todos los botones después de seleccionar una respuesta
                alternatives.forEach(alt => {
                    alt.style.pointerEvents = 'none';
                });
                
				 
				
                if (selectedAnswer === correctAnswer) {
                    // Respuesta correcta
                    //this.correctAnswers++;
					this.user.addCorrect();
                    
					document.getElementById('correct-count').textContent = this.user.correctAnswers;
                    console.log("Respuesta correcta",this.user.correctAnswers);
                    // Encontrar y destacar la alternativa correcta
                    alternatives.forEach(alt => {
                        if (alt.textContent === correctAnswer) {
                            alt.classList.add('correct');
                        }
                    });
                    
                    this.feedbackManager.playCorrect();
                    
                    // Esperar 1 segundo y pasar a la siguiente pregunta
                    setTimeout(() => {
                        this.nextQuestion();
                    }, 1000);
                } else {
                    // Respuesta incorrecta
					 this.user.addIncorrect();
					 
                    //this.incorrectAnswers++;
                    document.getElementById('incorrect-count').textContent = this.user.incorrectAnswers;
                    console.log("Respuesta incorrecta",this.user.incorrectAnswers);
                    // Encontrar y destacar las alternativas correcta e incorrecta
                    alternatives.forEach(alt => {
                        if (alt.textContent === correctAnswer) {
                            alt.classList.add('correct');
                        } else if (alt.textContent === selectedAnswer) {
                            alt.classList.add('incorrect');
                        }
                    });
                    
                    this.feedbackManager.playIncorrect();
                    
                    // Esperar 1 segundo y pasar a la siguiente pregunta
                    setTimeout(() => {
                        this.nextQuestion();
                    }, 1000);
                }
            }
            
            nextQuestion() {
                this.currentQuestion++;
                const currentTest = this.tests[this.currentTest];
                
                if (this.currentQuestion < currentTest.questions.length) {
                    this.displayQuestion();
                } else {
                    this.currentQuestion = 0;
                    this.currentTest++;
                    
                    if (this.currentTest < this.tests.length) {
                        this.startGame();
                    } else {
                        this.endGame();
                    }
                }
            }
            
            endGame() {
                this.showScreen('results-screen');
                
                const totalQuestions = this.tests.reduce((total, test) => total + test.questions.length, 0);
                document.getElementById('score-value').textContent = this.user.correctAnswers;
                document.getElementById('total-questions').textContent = totalQuestions;
                this.registrar();
				
                const percentage = (this.user.correctAnswers / totalQuestions) * 100;
                let message = "";
                
                if (percentage >= 90) {
                    message = "¡Excelente! Tu memoria asociativa es excepcional.";
                } else if (percentage >= 70) {
                    message = "¡Muy bien! Tienes una buena memoria asociativa.";
                } else if (percentage >= 50) {
                    message = "Buen trabajo. Sigue practicando para mejorar.";
                } else {
                    message = "Sigue practicando. La memoria mejora con el entrenamiento.";
                }
                
                document.getElementById('performance-message').textContent = message;
                
                // Guardar resultados en el objeto usuario
                //this.user.addScore(this.user.incorrectAnswers, this.user.incorrectAnswers);
            }
			
			registrar() {
                     const stats = contador.cargarEstadisticas();
					 const results = this.user.getResults();
		            
                        // alert(`Resultados guardados:\nAciertos: ${results.correctAnswers}\nErrores: ${results.incorrectAnswers}\nFecha: ${new Date(results.date).toLocaleString()}`);
	                 console.log("registro",stats);
                     stats.recA = results.correct;
		             stats.recE = results.incorrect;
                     contador.guardarEstadisticas(results.correct,results.incorrect,3);
		
           }
			
            
            restartGame() {
				 this.user = new User(this.currentUser);
                this.currentTest = 0;
                this.currentQuestion = 0;
                this.correctAnswers = 0;
                this.incorrectAnswers = 0;
                
                document.getElementById('correct-count').textContent = '0';
                document.getElementById('incorrect-count').textContent = '0';
                
                this.showScreen('start-screen');
            }
            
            saveResults() {
                // En un entorno real, aquí guardaríamos los resultados en una base de datos
                // Por ahora, simulamos el guardado mostrando un mensaje
                alert(`Resultados guardados para ${this.user.name}:\nAciertos: ${this.user.correctAnswers}\nErrores: ${this.user.incorrectAnswers}\nPorcentaje: ${((this.user.correctAnswers / (this.user.correctAnswers + this.user.incorrectAnswers)) * 100).toFixed(2)}%`);
                
                // En una implementación real, podríamos usar:
                // localStorage, una API web, o SQLite mediante una extensión
            }
            
            toggleAudio() {
                const isMuted = this.feedbackManager.toggleMute();
                const audioIcon = document.querySelector('#audio-control i');
                audioIcon.textContent = isMuted ? '🔇' : '♪';
            }
            
            showScreen(screenId) {
                // Ocultar todas las pantallas
                document.querySelectorAll('.screen').forEach(screen => {
                    screen.style.display = 'none';
                });
                
                // Mostrar la pantalla solicitada
                document.getElementById(screenId).style.display = 'flex';
            }
            
            shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
        }

        // Inicializar el juego cuando se carga la página
        document.addEventListener('DOMContentLoaded', () => {
            const game = new MemoryGame();
        });