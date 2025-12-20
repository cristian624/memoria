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
		    // if (testNumber == 1){
			//         window.open("HisIndex.html", "_blank");
		    //        // alert(`Iniciando prueba ${testNumber} de memoria. En una implementación completa, aquí se cargaría la prueba específica.`);
			//}		
			
			switch (testNumber) {
                 case 1:
                   // Code to execute if expression === value1
				   window.open("HisIndex.html", "_blank");
                   break;
                 case 2:
                   // Code to execute if expression === value2
				   window.open("ObjIndex.html", "_blank");
                   break;
                 case 3:
                   // Code to execute if expression === value3
				    window.open("RecIndex.html", "_blank");
                   break;
				 case 4:
                   // Code to execute if expression === value3
				    window.open("ImgIndex.html", "_blank");
                   break;
                 case 5:
                   // Code to execute if expression === value3
				    window.open("SecIndex.html", "_blank");
                 break;
				 case 6:
                   // Code to execute if expression === value3
				    window.open("NumLetIndex.html", "_blank");
                 break;
                 default:
                   // Code to execute if no case matches
               }

		
        
		}
        
        // Inicialización cuando se carga la página
        window.addEventListener('DOMContentLoaded', () => {
            createStars();
            setupSoundControl();
            setupMenuNavigation();
            fadeInOnScroll(); // Aplicar efecto inicial
            
            // Aplicar efecto al hacer scroll
            window.addEventListener('scroll', fadeInOnScroll);
        });
