        // Clase para gestionar usuarios
        class User {
            constructor() {
                this.correctAnswers = 0;
                this.incorrectAnswers = 0;
                this.currentSection = 'A';
                this.currentQuestionIndex = 0;
                this.questions = [];
                this.loadQuestions();
            }

            loadQuestions() {
                // Sección A - Mismo orden
                this.questions = [
                    // Sección A
                    { section: 'A', sequence: "8 3", answer: "8 3" },
                    { section: 'A', sequence: "2 9", answer: "2 9" },
                    { section: 'A', sequence: "6 9 2", answer: "6 9 2" },
                    { section: 'A', sequence: "6 1 7", answer: "6 1 7" },
                    { section: 'A', sequence: "5 7 3 4", answer: "5 7 3 4" },
                    { section: 'A', sequence: "8 6 0 9", answer: "8 6 0 9" },
                    { section: 'A', sequence: "1 8 6 3 9", answer: "1 8 6 3 9" },
                    { section: 'A', sequence: "2 7 4 5 6", answer: "2 7 4 5 6" },
                    { section: 'A', sequence: "7 2 5 9 4 8", answer: "7 2 5 9 4 8" },
                    { section: 'A', sequence: "0 8 3 1 2 5", answer: "0 8 3 1 2 5" },
                    { section: 'A', sequence: "2 9 8 3 5 7 6", answer: "2 9 8 3 5 7 6" },
                    { section: 'A', sequence: "3 9 8 6 5 2 7", answer: "3 9 8 6 5 2 7" },
                    { section: 'A', sequence: "8 7 9 0 2 6 1 4", answer: "8 7 9 0 2 6 1 4" },
                    { section: 'A', sequence: "8 2 7 3 9 5 4 0", answer: "8 2 7 3 9 5 4 0" },
                    { section: 'A', sequence: "3 5 2 7 9 6 2 3 0", answer: "3 5 2 7 9 6 2 3 0" },
                    { section: 'A', sequence: "7 2 8 4 1 3 0 2 6", answer: "7 2 8 4 1 3 0 2 6" },
                    
                    // Sección B - Orden inverso
                    { section: 'B', sequence: "1 3", answer: "3 1" },
                    { section: 'B', sequence: "2 9", answer: "9 2" },
                    { section: 'B', sequence: "2 8 7", answer: "7 8 2" },
                    { section: 'B', sequence: "5 0 8", answer: "8 0 5" },
                    { section: 'B', sequence: "9 7 8 6", answer: "6 8 7 9" },
                    { section: 'B', sequence: "7 4 2 4", answer: "4 2 4 7" },
                    { section: 'B', sequence: "1 8 6 3 9", answer: "9 3 6 8 1" },
                    { section: 'B', sequence: "9 1 2 6 8", answer: "8 6 2 1 9" },
                    { section: 'B', sequence: "7 2 5 9 4 8", answer: "8 4 9 5 2 7" },
                    { section: 'B', sequence: "0 8 3 1 2 5", answer: "5 2 1 3 8 0" },
                    { section: 'B', sequence: "3 0 4 2 7 1 8", answer: "8 1 7 2 4 0 3" },
                    { section: 'B', sequence: "3 5 4 1 2 8 0", answer: "0 8 2 1 4 5 3" },
                    { section: 'B', sequence: "6 9 7 4 1 3 7 8", answer: "8 7 3 1 4 7 9 6" },
                    { section: 'B', sequence: "8 2 7 3 9 5 4 0", answer: "0 4 5 9 3 7 2 8" }
                ];
            }

            getCurrentQuestion() {
                return this.questions[this.currentQuestionIndex];
            }

            checkAnswer(userAnswer) {
                const currentQuestion = this.getCurrentQuestion();
                const normalizedUserAnswer = userAnswer.trim().replace(/\s+/g, ' ');
                const normalizedCorrectAnswer = currentQuestion.answer.trim().replace(/\s+/g, ' ');
                
                return normalizedUserAnswer === normalizedCorrectAnswer;
            }

            recordAnswer(isCorrect) {
                if (isCorrect) {
                    this.correctAnswers++;
                } else {
                    this.incorrectAnswers++;
                }
                
                this.currentQuestionIndex++;
                
                // Cambiar de sección si es necesario
                if (this.currentQuestionIndex < this.questions.length) {
                    const nextQuestion = this.questions[this.currentQuestionIndex];
                    if (nextQuestion.section !== this.currentSection) {
                        this.currentSection = nextQuestion.section;
                    }
                }
                
                return this.currentQuestionIndex < this.questions.length;
            }

            getProgress() {
                return {
                    current: this.currentQuestionIndex + 1,
                    total: this.questions.length,
                    section: this.currentSection
                };
            }

            saveResults() {
                const results = {
                    correct: this.correctAnswers,
                    incorrect: this.incorrectAnswers,
                    total: this.questions.length,
                    date: new Date().toLocaleString()
                };
                
                // Guardar en localStorage
                let savedResults = JSON.parse(localStorage.getItem('memoryTrainingResults') || '[]');
                savedResults.push(results);
                localStorage.setItem('memoryTrainingResults', JSON.stringify(savedResults));
                
                return results;
            }

            reset() {
                this.correctAnswers = 0;
                this.incorrectAnswers = 0;
                this.currentSection = 'A';
                this.currentQuestionIndex = 0;
            }
        }

        // Clase para el bloque de pregunta
        class QuestionBlock {
            constructor() {
                this.displayElement = document.getElementById('question-display');
                this.answerContainer = document.getElementById('answer-container');
                this.answerInput = document.getElementById('answer-input');
                this.timerElement = document.getElementById('timer');
                this.feedbackElement = document.getElementById('feedback');
                this.sectionTitleElement = document.getElementById('section-title');
                this.sectionIndicator = document.getElementById('section-indicator');
                this.progressBar = document.getElementById('progress-bar');
                
                this.displayTime = 4000; // 4 segundos para memorizar
                this.answerTime = 30000; // 30 segundos para responder
                this.displayTimer = null;
                this.answerTimer = null;
                this.timeLeft = 0;
            }

            showQuestion(sequence, section, progress) {
                // Actualizar título de sección e indicador
                this.sectionTitleElement.textContent = `SECCIÓN ${section}`;
                this.sectionIndicator.textContent = `SECCIÓN ${section}`;
                this.sectionIndicator.classList.remove('hidden');
                
                // Actualizar barra de progreso
                const progressPercent = (progress.current / progress.total) * 100;
                this.progressBar.style.width = `${progressPercent}%`;
                
                // Mostrar la secuencia
                this.displayElement.textContent = sequence;
                this.answerContainer.classList.add('hidden');
                this.feedbackElement.classList.add('hidden');
                this.answerInput.value = '';
                
                // Ocultar después de 4 segundos
                this.displayTimer = setTimeout(() => {
                    this.displayElement.textContent = '';
                    this.showAnswerInput();
                }, this.displayTime);
            }

            showAnswerInput() {
                this.answerContainer.classList.remove('hidden');
                this.answerInput.focus();
                
                // Iniciar temporizador de respuesta
                this.timeLeft = this.answerTime / 1000;
                this.updateTimer();
                
                this.answerTimer = setInterval(() => {
                    this.timeLeft--;
                    this.updateTimer();
                    
                    if (this.timeLeft <= 0) {
                        this.timeUp();
                    }
                }, 1000);
            }

            updateTimer() {
                this.timerElement.textContent = `TIEMPO: ${this.timeLeft} SEGUNDOS`;
                
                // Cambiar color cuando quede poco tiempo
                if (this.timeLeft <= 5) {
                    this.timerElement.style.color = '#ff3366';
                } else if (this.timeLeft <= 10) {
                    this.timerElement.style.color = '#ffcc00';
                } else {
                    this.timerElement.style.color = '#00ccff';
                }
            }

            timeUp() {
                clearInterval(this.answerTimer);
                this.feedbackElement.textContent = "¡TIEMPO AGOTADO!";
                this.feedbackElement.className = "feedback incorrect-feedback";
                this.feedbackElement.classList.remove('hidden');
                
                // Esperar 1 segundo y pasar a la siguiente pregunta
                setTimeout(() => {
                    game.nextQuestion(false);
                }, 1000);
            }

            showFeedback(isCorrect, userAnswer, correctAnswer) {
                clearInterval(this.answerTimer);
                
                if (isCorrect) {
                    this.feedbackElement.textContent = "¡CORRECTO!";
                    this.feedbackElement.className = "feedback correct-feedback";
                } else {
                    this.feedbackElement.textContent = `INCORRECTO. RESPUESTA: ${correctAnswer}`;
                    this.feedbackElement.className = "feedback incorrect-feedback";
                }
                
                this.feedbackElement.classList.remove('hidden');
                
                // Esperar 1 segundo y pasar a la siguiente pregunta
                setTimeout(() => {
                    game.nextQuestion(isCorrect);
                }, 1000);
            }

            reset() {
                clearTimeout(this.displayTimer);
                clearInterval(this.answerTimer);
                this.displayElement.textContent = '';
                this.answerContainer.classList.add('hidden');
                this.feedbackElement.classList.add('hidden');
                this.timerElement.textContent = 'TIEMPO: 30 SEGUNDOS';
                this.timerElement.style.color = '#00ccff';
                this.sectionIndicator.classList.add('hidden');
            }
        }

        // Clase para gestionar la retroalimentación
        class FeedbackManager {
            constructor() {
                this.correctCountElement = document.getElementById('correct-count');
                this.incorrectCountElement = document.getElementById('incorrect-count');
            }

            updateScore(correct, incorrect) {
                this.correctCountElement.textContent = correct;
                this.incorrectCountElement.textContent = incorrect;
            }

            showFinalResults(correct, total) {
                const finalCorrectElement = document.getElementById('final-correct');
                const totalQuestionsElement = document.getElementById('total-questions');
                const resultsMessageElement = document.getElementById('results-message');
                
                finalCorrectElement.textContent = correct;
                totalQuestionsElement.textContent = total;
                
                const percentage = (correct / total) * 100;
                
                if (percentage >= 90) {
                    resultsMessageElement.textContent = "¡EXCELENTE! TIENES UNA MEMORIA EXCEPCIONAL.";
                } else if (percentage >= 70) {
                    resultsMessageElement.textContent = "¡MUY BIEN! TU MEMORIA ESTÁ POR ENCIMA DEL PROMEDIO.";
                } else if (percentage >= 50) {
                    resultsMessageElement.textContent = "BUEN TRABAJO. SIGUE PRACTICANDO PARA MEJORAR.";
                } else {
                    resultsMessageElement.textContent = "SIGUE PRACTICANDO. LA MEMORIA MEJORA CON EL ENTRENAMIENTO.";
                }
            }
        }

        // Clase para el fondo estelar
        class Starfield {
            constructor() {
                this.container = document.getElementById('stars-container');
                this.stars = [];
                this.createStars();
            }

            createStars() {
                // Crear estrellas de diferentes tamaños y brillos
                for (let i = 0; i < 200; i++) {
                    const star = document.createElement('div');
                    star.classList.add('star');
                    
                    // Tamaño aleatorio entre 1 y 3 píxeles
                    const size = Math.random() * 2 + 1;
                    star.style.width = `${size}px`;
                    star.style.height = `${size}px`;
                    
                    // Posición aleatoria
                    star.style.left = `${Math.random() * 100}%`;
                    star.style.top = `${Math.random() * 100}%`;
                    
                    // Opacidad aleatoria para efecto de brillo
                    star.style.opacity = Math.random() * 0.7 + 0.3;
                    
                    this.container.appendChild(star);
                    this.stars.push(star);
                }
                
                // Animar algunas estrellas para que parpadeen
                this.animateStars();
            }

            animateStars() {
                // Hacer que algunas estrellas parpadeen
                setInterval(() => {
                    const randomStars = this.stars.filter(() => Math.random() > 0.7);
                    
                    randomStars.forEach(star => {
                        const originalOpacity = parseFloat(star.style.opacity);
                        const targetOpacity = Math.random() * 0.7 + 0.3;
                        
                        // Animación suave del parpadeo
                        let currentOpacity = originalOpacity;
                        const step = (targetOpacity - originalOpacity) / 10;
                        
                        const blinkInterval = setInterval(() => {
                            currentOpacity += step;
                            star.style.opacity = currentOpacity;
                            
                            if ((step > 0 && currentOpacity >= targetOpacity) || 
                                (step < 0 && currentOpacity <= targetOpacity)) {
                                clearInterval(blinkInterval);
                            }
                        }, 50);
                    });
                }, 1000);
            }
        }

        // Clase principal del juego
        class MemoryGame {
            constructor() {
                this.user = new User();
                this.questionBlock = new QuestionBlock();
                this.feedbackManager = new FeedbackManager();
                this.starfield = new Starfield();
                this.audio = document.getElementById('background-music');
                this.soundControl = document.getElementById('sound-control');
                
                this.isPlaying = false;
                this.setupEventListeners();
            }

            setupEventListeners() {
                document.getElementById('start-btn').addEventListener('click', () => {
                    this.startGame();
                });
                
                document.getElementById('submit-btn').addEventListener('click', () => {
                    this.submitAnswer();
                });
                
                document.getElementById('answer-input').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.submitAnswer();
                    }
                });
                
                document.getElementById('restart-btn').addEventListener('click', () => {
                    this.restartGame();
                });
                
                document.getElementById('save-btn').addEventListener('click', () => {
                    this.saveResults();
                });
                
                this.soundControl.addEventListener('click', () => {
                    this.toggleSound();
                });
            }

            startGame() {
                this.showScreen('question-screen');
                this.user.reset();
                this.feedbackManager.updateScore(0, 0);
                this.nextQuestion(true);
                
                // Reproducir música de fondo
                this.audio.play().catch(e => {
                    console.log("La reproducción automática de audio está bloqueada:", e);
                });
            }

            nextQuestion(isFirstQuestion = false) {
                if (!isFirstQuestion && this.user.currentQuestionIndex >= this.user.questions.length) {
                    this.endGame();
                    return;
                }
                
                this.questionBlock.reset();
                
                const question = this.user.getCurrentQuestion();
                const progress = this.user.getProgress();
                this.questionBlock.showQuestion(question.sequence, question.section, progress);
            }

            submitAnswer() {
                const userAnswer = document.getElementById('answer-input').value;
                const isCorrect = this.user.checkAnswer(userAnswer);
                const correctAnswer = this.user.getCurrentQuestion().answer;
                
                this.questionBlock.showFeedback(isCorrect, userAnswer, correctAnswer);
                this.feedbackManager.updateScore(this.user.correctAnswers, this.user.incorrectAnswers);
            }

            endGame() {
                this.showScreen('results-screen');
                this.feedbackManager.showFinalResults(
                    this.user.correctAnswers, 
                    this.user.questions.length
                );
            }

            restartGame() {
                this.user.reset();
                this.feedbackManager.updateScore(0, 0);
                this.startGame();
            }

            saveResults() {
                const results = this.user.saveResults();
                alert(`RESULTADOS GUARDADOS:\nAciertos: ${results.correct}\nErrores: ${results.incorrect}\nFecha: ${results.date}`);
            }

            toggleSound() {
                if (this.audio.paused) {
                    this.audio.play();
                    this.soundControl.innerHTML = '<span>🔊</span> SONIDO';
                } else {
                    this.audio.pause();
                    this.soundControl.innerHTML = '<span>🔇</span> SONIDO';
                }
            }

            showScreen(screenId) {
                // Ocultar todas las pantallas
                document.getElementById('welcome-screen').classList.add('hidden');
                document.getElementById('question-screen').classList.add('hidden');
                document.getElementById('results-screen').classList.add('hidden');
                
                // Mostrar la pantalla solicitada
                document.getElementById(screenId).classList.remove('hidden');
            }
        }

        // Inicializar el juego cuando se carga la página
        let game;
        window.addEventListener('DOMContentLoaded', () => {
            game = new MemoryGame();
        });
   