        // Crear estrellas para el fondo espacial
        function createStars() {
            const spaceBg = document.getElementById('spaceBg');
            const starCount = 100;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                // Tamaño aleatorio
                const size = Math.random() * 3 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                
                // Posición aleatoria
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                
                // Animación con retraso aleatorio
                star.style.animationDelay = `${Math.random() * 4}s`;
                
                spaceBg.appendChild(star);
            }
        }
        
        // Efecto de aparición gradual al hacer scroll
        function fadeInOnScroll() {
            const fadeElements = document.querySelectorAll('.fade-in');
            
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');
                }
            });
        }
        
        // Control de sonido
        function setupSoundControl() {
            const soundControl = document.getElementById('soundControl');
            const soundIcon = document.getElementById('soundIcon');
            const backgroundMusic = document.getElementById('backgroundMusic');
            let isPlaying = false;
            
            soundControl.addEventListener('click', () => {
                if (isPlaying) {
                    backgroundMusic.pause();
                    soundIcon.textContent = '♪';
                } else {
                    backgroundMusic.play().catch(e => {
                        console.log("La reproducción automática fue bloqueada. Haz clic de nuevo.");
                    });
                    soundIcon.textContent = '♫';
                }
                isPlaying = !isPlaying;
            });
        }
         // Juego de memoria
        const memoryGame = document.getElementById('memory-game');
        const startButton = document.getElementById('start-game');
        const resetButton = document.getElementById('reset-game');
        const scoreDisplay = document.getElementById('score');

        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let score = 0;
        let gameStarted = false;

        const symbols = ['🧠', '⚡', '⏱️', '🗣️', '👁️', '💊', '🔬', '🧪'];
        
        function initializeGame() {
            memoryGame.innerHTML = '';
            cards = [];
            flippedCards = [];
            matchedPairs = 0;
            score = 0;
            scoreDisplay.textContent = score;
            gameStarted = true;
           
            // Duplicar símbolos para crear parejas
            const gameSymbols = [...symbols, ...symbols];
            
            // Barajar símbolos
            for (let i = gameSymbols.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [gameSymbols[i], gameSymbols[j]] = [gameSymbols[j], gameSymbols[i]];
            }
            
            // Crear cartas
            gameSymbols.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.className = 'memory-gm';
                card.dataset.symbol = symbol;
                card.dataset.index = index;
                card.innerHTML = '?';
                
                card.addEventListener('click', flipCard);
                memoryGame.appendChild(card);
                cards.push(card);
            });
        }
		
		
		
        // Navegación del menú
        function setupMenuNavigation() {
            const menuItems = document.querySelectorAll('.menu-item');
            const sections = document.querySelectorAll('section');
            const menuToggle = document.getElementById('menuToggle');
            const sideMenu = document.getElementById('sideMenu');
            
            // Alternar menú en dispositivos móviles
            menuToggle.addEventListener('click', () => {
                sideMenu.classList.toggle('active');
            });
            
            // Navegación por clic en elementos del menú
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    const targetId = item.getAttribute('data-target');
                    
                    // Remover clase active de todos los elementos
                    menuItems.forEach(i => i.classList.remove('active'));
                    // Agregar clase active al elemento clickeado
                    item.classList.add('active');
                    
                    // Desplazarse a la sección correspondiente
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    
                    // Cerrar menú en móviles después de la selección
                    if (window.innerWidth <= 1024) {
                        sideMenu.classList.remove('active');
                    }
                });
            });
            
            // Resaltar elemento del menú según la sección visible
            window.addEventListener('scroll', () => {
                let current = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    
                    if (scrollY >= (sectionTop - 200)) {
                        current = section.getAttribute('id');
                    }
                });
                
                menuItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-target') === current) {
                        item.classList.add('active');
                    }
                });
            });
        }
        
        // Iniciar pruebas (simulación)
        function startTest(testNumber) {
            alert(`Iniciando prueba ${testNumber} de memoria. En una implementación completa, aquí se cargaría la prueba específica.`);
        }
        
		function flipCard() {
            if (!gameStarted || flippedCards.length >= 2 || this.classList.contains('flipped')) {
                return;
            }
            
            this.classList.add('flipped');
            this.innerHTML = this.dataset.symbol;
            flippedCards.push(this);
            
            if (flippedCards.length === 2) {
                checkForMatch();
            }
        }
		
		  function checkForMatch() {
            const [card1, card2] = flippedCards;
            
            if (card1.dataset.symbol === card2.dataset.symbol) {
                // Es una pareja
                matchedPairs++;
                score += 10;
                scoreDisplay.textContent = score;
                
                // Deshabilitar las cartas
                card1.removeEventListener('click', flipCard);
                card2.removeEventListener('click', flipCard);
                
                flippedCards = [];
                
                // Verificar si el juego ha terminado
                if (matchedPairs === symbols.length) {
                    setTimeout(() => {
                        alert(`¡Felicidades! Has completado el juego. Puntuación: ${score}`);
                    }, 500);
                }
            } else {
                // No es una pareja, voltear de nuevo después de un breve retraso
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    card1.innerHTML = '?';
                    card2.innerHTML = '?';
                    flippedCards = [];
                    
                    // Penalización por error
                    if (score > 0) {
                        score -= 2;
                        scoreDisplay.textContent = score;
                    }
                }, 1000);
            }
        }
		
        // Inicialización cuando se carga la página
        window.addEventListener('DOMContentLoaded', () => {
           startButton.addEventListener('click', initializeGame);
           resetButton.addEventListener('click', initializeGame);    
    		createStars();
            setupSoundControl();
            setupMenuNavigation();
            fadeInOnScroll(); // Aplicar efecto inicial
            
            // Aplicar efecto al hacer scroll
            window.addEventListener('scroll', fadeInOnScroll);
        });