        // Clase para gestionar usuarios
        class User {
            constructor() {
				this.name = name;
				this.correctAnswers = 0;
                this.incorrectAnswers = 0;
				this.startTime = new Date();
				this.currentLevel = 0;
                this.currentQuestion = 0;
                this.section = 'A';
                this.loadFromStorage();
            }

            addCorrect() {
                this.correctAnswers++;
                this.saveToStorage();
            }

            addIncorrect() {
                this.incorrectAnswers++;
                this.saveToStorage();
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

            reset() {
                this.correctAnswers = 0;
                this.incorrectAnswers = 0;
                this.currentLevel = 0;
                this.currentQuestion = 0;
                this.section = 'A';
                this.saveToStorage();
            }

            saveToStorage() {
                const userData = {
                    correctAnswers: this.correctAnswers,
                    incorrectAnswers: this.incorrectAnswers,
                    currentLevel: this.currentLevel,
                    currentQuestion: this.currentQuestion,
                    section: this.section
                };
                localStorage.setItem('memoryTrainingUser', JSON.stringify(userData));
            }

            loadFromStorage() {
                const savedData = localStorage.getItem('memoryTrainingUser');
                if (savedData) {
                    const userData = JSON.parse(savedData);
                    this.correctAnswers = userData.correctAnswers || 0;
                    this.incorrectAnswers = userData.incorrectAnswers || 0;
                    this.currentLevel = userData.currentLevel || 0;
                    this.currentQuestion = userData.currentQuestion || 0;
                    this.section = userData.section || 'A';
                }
            }

            getScore() {
                return {
                    correct: this.correctAnswers,
                    incorrect: this.incorrectAnswers,
                    total: this.correctAnswers + this.incorrectAnswers
                };
            }
        }

        // Clase para el bloque de pregunta
        class QuestionBlock {
            constructor(sequence, correctAnswer, section) {
                this.sequence = sequence;
                this.correctAnswer = correctAnswer;
                this.section = section;
                this.displayTime = 8000; // 4 segundos
            }

            displaySequence() {
                const sequenceDisplay = document.getElementById('sequence-display');
                sequenceDisplay.textContent = this.sequence;
                
                // Mostrar la secuencia por 4 segundos
                setTimeout(() => {
                    sequenceDisplay.textContent = '';
                    this.showInput();
                }, this.displayTime);
            }

            showInput() {
                const inputContainer = document.getElementById('input-container');
                const answerInput = document.getElementById('answer-input');
                
                inputContainer.classList.remove('hidden');
                answerInput.focus();
            }

            checkAnswer(userAnswer) {
                return userAnswer.trim() === this.correctAnswer;
            }
        }

        // Clase para gestionar la retroalimentación
        class FeedbackManager {
            static showFeedback(message, isCorrect) {
                const feedbackElement = document.getElementById('feedback');
                feedbackElement.textContent = message;
                feedbackElement.className = 'feedback';
                
                if (isCorrect) {
                    feedbackElement.classList.add('correct-feedback');
                } else {
                    feedbackElement.classList.add('incorrect-feedback');
                }
                
                // Mostrar con animación
                setTimeout(() => {
                    feedbackElement.style.opacity = '1';
                }, 10);
                
                // Ocultar después de un tiempo
                setTimeout(() => {
                    feedbackElement.style.opacity = '0';
                }, 2000);
            }
        }

        // Clase para el fondo estelar
        class Starfield {
            constructor(containerId, starCount = 100) {
                this.container = document.getElementById(containerId);
                this.starCount = starCount;
                this.stars = [];
                this.createStars();
            }

            createStars() {
                for (let i = 0; i < this.starCount; i++) {
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
                }
            }

            animateStars() {
                this.stars.forEach(star => {
                    // Movimiento sutil de las estrellas
                    const speed = Math.random() * 0.5;
                    let x = parseFloat(star.style.left);
                    x = (x + speed) % 100;
                    star.style.left = `${x}%`;
                });
                
                requestAnimationFrame(() => this.animateStars());
            }
        }

        // Clase principal del juego
        class MemoryGame {
			//this.user = null;
            //this.currentUser = null;
            
            constructor() {

                this.starfield = new Starfield('stars-container');
                this.questions = {
                    'A': [
                        { sequence: "83", answer: "83" },
                        { sequence: "29", answer: "29" },
                        { sequence: "692", answer: "692" },
                        { sequence: "617", answer: "617" },
                        { sequence: "5734", answer: "5734" },
                        { sequence: "8609", answer: "8609" },
                        { sequence: "18639", answer: "18639" },
                        { sequence: "27456", answer: "27456" },
                        { sequence: "725948", answer: "725948" },
                        { sequence: "083125", answer: "083125" },
                        { sequence: "2983576", answer: "2983576" },
                        { sequence: "3986527", answer: "3986527" },
                        { sequence: "87902614", answer: "87902614" },
                        { sequence: "82739540", answer: "82739540" },
                        { sequence: "352796230", answer: "352796230" },
                        { sequence: "728413026", answer: "728413026" }
                    ],
                    'B': [
                        { sequence: "13", answer: "31" },
                        { sequence: "29", answer: "92" },
                        { sequence: "287", answer: "782" },
                        { sequence: "508", answer: "805" },
                        { sequence: "9786", answer: "6879" },
                        { sequence: "7424", answer: "4247" },
                        { sequence: "18639", answer: "93681" },
                        { sequence: "91268", answer: "86219" },
                        { sequence: "725948", answer: "849527" },
                        { sequence: "083125", answer: "521380" },
                        { sequence: "3042718", answer: "8172403" },
                        { sequence: "3541280", answer: "0821453" },
                        { sequence: "69741378", answer: "87314796" },
                        { sequence: "82739540", answer: "04593728" }
                    ]
                };
                
                this.currentQuestionBlock = null;
                this.init();
            }

            init() {

			    if (!username) {
                       alert('Por favor, ingresa tu nombre para comenzar.');
                       return;
                   }
			   	
			    this.user = new User(username);
                this.currentUser = username;
			            

			    this.setupEventListeners();
                this.updateScoreDisplay();
                this.starfield.animateStars();
                
                // Si el usuario ya estaba en medio de un juego, continuar
                if (this.user.currentQuestion > 0) {
                    this.showGameScreen();
                    this.loadQuestion();
                }
            }

            setupEventListeners() {
                document.getElementById('start-btn').addEventListener('click', () => {
                    this.showGameScreen();
                    this.loadQuestion();
                });

                document.getElementById('submit-btn').addEventListener('click', () => {
                    this.checkAnswer();
                });

                document.getElementById('answer-input').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.checkAnswer();
                    }
                });

                document.getElementById('restart-btn').addEventListener('click', () => {
                    this.restartGame();
                });

                document.getElementById('save-btn').addEventListener('click', () => {
                    this.saveResults();
                });

                // Control de audio
                const audioControl = document.getElementById('audio-control');
                const backgroundMusic = document.getElementById('background-music');
                
                audioControl.addEventListener('click', () => {
                    if (backgroundMusic.paused) {
                        backgroundMusic.play();
                        audioControl.innerHTML = '<i>🔊</i>';
                    } else {
                        backgroundMusic.pause();
                        audioControl.innerHTML = '<i>🔇</i>';
                    }
                });

                // Intentar reproducir música automáticamente (con manejo de permisos)
                document.addEventListener('click', () => {
                    if (backgroundMusic.paused) {
                        backgroundMusic.play().catch(e => {
                            console.log("La reproducción automática de audio fue bloqueada");
                        });
                    }
                }, { once: true });
            }

            showGameScreen() {
                document.getElementById('start-screen').classList.add('hidden');
                document.getElementById('game-screen').classList.remove('hidden');
                document.getElementById('final-screen').classList.add('hidden');
            }

            showFinalScreen() {
                document.getElementById('game-screen').classList.add('hidden');
                document.getElementById('final-screen').classList.remove('hidden');
                
                const finalScore = document.getElementById('final-score');
                finalScore.textContent = this.user.correctAnswers;
				this.registrar();
            }

            loadQuestion() {
                const section = this.user.section;
                const questionIndex = this.user.currentQuestion;
                
                if (questionIndex >= this.questions[section].length) {
                    // Cambiar a la siguiente sección o terminar
                    if (section === 'A') {
                        this.user.section = 'B';
                        this.user.currentQuestion = 0;
                        this.loadQuestion();
                        return;
                    } else {
                        this.showFinalScreen();
                        return;
                    }
                }
                
                const questionData = this.questions[section][questionIndex];
                this.currentQuestionBlock = new QuestionBlock(
                    questionData.sequence, 
                    questionData.answer, 
                    section
                );
                
                // Actualizar título de sección
				    let deta = " Ingrese como se muestra el numero";
					if (section === 'A') {
                        let deta = " Ingrese como se muestra el numero";
                    } else {
                        deta = " Ingrese el numero invertido";
						document.getElementById('section-title').style.color = "red";
                    } 
				
                document.getElementById('section-title').textContent = `Sección ${section}` + deta ;
                
                // Ocultar input y feedback
                document.getElementById('input-container').classList.add('hidden');
                document.getElementById('feedback').style.opacity = '0';
                
                // Mostrar la secuencia
                this.currentQuestionBlock.displaySequence();
            }

            checkAnswer() {
                const userAnswer = document.getElementById('answer-input').value;
                const isCorrect = this.currentQuestionBlock.checkAnswer(userAnswer);
                
                if (isCorrect) {
					this.user.addCorrect();
                    FeedbackManager.showFeedback('¡Correcto!', true);
                } else {
                    this.user.addIncorrect();
					FeedbackManager.showFeedback(`Incorrecto. La respuesta era: ${this.currentQuestionBlock.correctAnswer}`, false);
                }
                
                this.updateScoreDisplay();
                
                // Avanzar a la siguiente pregunta después de un breve delay
                setTimeout(() => {
                    this.user.currentQuestion++;
                    this.loadQuestion();
                    document.getElementById('answer-input').value = '';
                }, 1500);
            }

            updateScoreDisplay() {
                document.getElementById('correct-count').textContent = this.user.correctAnswers;
                document.getElementById('incorrect-count').textContent = this.user.incorrectAnswers;
            }

            restartGame() {
                this.user.reset();
                this.updateScoreDisplay();
                this.showGameScreen();
                this.loadQuestion();
            }
			
		 registrar() {
                     const stats = contador.cargarEstadisticas();
					 const results = this.user.getResults();
		            
                        // alert(`Resultados guardados:\nAciertos: ${results.correctAnswers}\nErrores: ${results.incorrectAnswers}\nFecha: ${new Date(results.date).toLocaleString()}`);
	                 console.log("registro",stats);
                     stats.numA = results.correct;
		             stats.numE = results.incorrect;
                     contador.guardarEstadisticas(results.correct,results.incorrect,5);
		
           }

            saveResults() {
                const score = this.user.getScore();
                const results = {
                    correctAnswers: score.correct,
                    incorrectAnswers: score.incorrect,
                    totalQuestions: score.total,
                    date: new Date().toLocaleString(),
                    sectionACompleted: this.user.section === 'B' || this.user.currentQuestion >= this.questions['A'].length,
                    sectionBCompleted: this.user.section === 'B' && this.user.currentQuestion >= this.questions['B'].length
                };
                
                // Guardar en localStorage
                const savedResults = JSON.parse(localStorage.getItem('memoryTrainingResults') || '[]');
                savedResults.push(results);
                localStorage.setItem('memoryTrainingResults', JSON.stringify(savedResults));
                
                alert('Resultados guardados correctamente. Puedes verlos en la consola del navegador (F12).');
                console.log('Resultados guardados:', results);
            }
        }

        // Inicializar el juego cuando se carga la página
        document.addEventListener('DOMContentLoaded', () => {
            new MemoryGame();
        });