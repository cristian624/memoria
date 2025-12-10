            
		// Elementos de entrada
        const part1Input = document.getElementById('part1');
        const part2Input = document.getElementById('part2');
        const part3Input = document.getElementById('part3');
        const part4Input = document.getElementById('part4');
        const part5Input = document.getElementById('part5');
        const part6Input = document.getElementById('part6');
        
        // Elementos de totales
        const total1Element = document.getElementById('total1');
        const total2Element = document.getElementById('total2');
        const total3Element = document.getElementById('total3');
        const total4Element = document.getElementById('total4');
        
		const inter1Element = document.getElementById('inter1');
        const inter2Element = document.getElementById('inter2');
        const inter3Element = document.getElementById('inter3');
        const inter4Element = document.getElementById('inter4');
        
		
		
		
		
        // Control de audio
        const audioControl = document.getElementById('audioControl');
        let audioPlaying = false;
        
        // Crear elemento de audio
        const audio = new Audio();
        // Nota: En un entorno real, necesitarías el archivo background.mp3
        // audio.src = 'background.mp3';
        // Por ahora, usaremos un sonido placeholder
        audio.loop = true;
       
        //valores
		
		function resul() {
             const username = document.getElementById('username').value.trim();
                if (!username) {
                    alert('Por favor, ingresa tu nombre para comenzar.');
                    return;
                }

             let stats = contador.cargarEstadisticas();
             part1Input.value = stats.hisA;
			 part2Input.value = stats.objA
			 part3Input.value = stats.recA
			 part4Input.value = stats.imgA
			 part5Input.value = stats.numA
			 part6Input.value = stats.letA
			 
			 
		     //stats.hisA = results.correct;
		     //stats.hisE = results.incorrect;
        
        }
		
	   
        // Función para calcular los totales
        function calculateTotals() {
            // Obtener valores de entrada
            const part1 = parseInt(part1Input.value) || 0;
            const part2 = parseInt(part2Input.value) || 0;
            const part3 = parseInt(part3Input.value) || 0;
            const part4 = parseInt(part4Input.value) || 0;
            const part5 = parseInt(part5Input.value) || 0;
            const part6 = parseInt(part6Input.value) || 0;
            
			
			
            // Calcular totales según las fórmulas
            // Total1: Sume las puntuaciones brutas de las Parte 5 y Parte 6, multiplíquelas por 2
            const total1 = (part5 + part6) * 2;
            
            // Total2: Sume las puntuaciones brutas de las Parte 1 a Parte 4, divida por 2
            const total2 = Math.round((part1 + part2 + part3 + part4) / 2);
            
            // Total3: Sume las puntuaciones brutas de las Parte 1 y Parte 3
            const total3 = part1 + part3;
            
            // Total4: Sume las puntuaciones brutas de las Parte 2 y Parte 4
            const total4 = part2 + part4;
            
            // Actualizar elementos en el DOM
            total1Element.textContent = total1;
            total2Element.textContent = total2;
            total3Element.textContent = total3;
            total4Element.textContent = total4;
            
            // Aplicar colores según los rangos
            applyRangeColors(total1Element, total1);
            applyRangeColors(total2Element, total2);
            applyRangeColors(total3Element, total3);
            applyRangeColors(total4Element, total4);
			
			// Aplicar interpretacion según los rangos
            applyinter(inter1Element, total1);
            applyinter(inter2Element, total2);
            applyinter(inter3Element, total3);
            applyinter(inter4Element, total4);
        }
        
        // Función para aplicar colores según los rangos
        function applyRangeColors(element, value) {
            // Remover clases anteriores
            element.classList.remove('range-90', 'range-75', 'range-60', 'range-35', 'range-0');
            
            // Aplicar nueva clase según el rango
            if (value >= 90) {
                element.classList.add('range-90');
		    } else if (value >= 75) {
                element.classList.add('range-75');
            } else if (value >= 60) {
                element.classList.add('range-60');
            } else if (value >= 35) {
                element.classList.add('range-35');
            } else {
                element.classList.add('range-0');
            }
        }
        
		// Función para aplicar colores según los rangos
        function applyinter(element, value) {
            // Remover clases anteriores
            element.classList.remove('range-90', 'range-75', 'range-60', 'range-35', 'range-0');
            
            // Aplicar nueva clase según el rango
            if (value >= 90) {
                element.classList.add('range-90');
			    element.textContent = 'memoria excepcionales';
            } else if (value >= 75) {
                element.classList.add('range-75');
				element.textContent = 'memoria superiores a la media';
            } else if (value >= 60) {
                element.classList.add('range-60');
				element.textContent = 'memoria promedio:posibilidad de una deficiencia temprana';
            } else if (value >= 35) {
                element.classList.add('range-35');
				element.textContent = 'indicio de una deficiencia de memoria';
            } else {
                element.classList.add('range-0');
				element.textContent = 'indicio de una deficiencia de memoria';
				
            }
        }
        
		
		
		
        // Control de audio
        audioControl.addEventListener('click', function() {
            if (audioPlaying) {
                audio.pause();
                audioPlaying = false;
                audioControl.style.backgroundColor = '#5A5A5A';
            } else {
                audio.play().catch(e => {
                    console.log("Error al reproducir audio: ", e);
                    // En un entorno real, aquí manejaríamos el error de reproducción
                });
                audioPlaying = true;
                audioControl.style.backgroundColor = '#FF6B35';
            }
        });
        
        // Añadir event listeners a los inputs
        part1Input.addEventListener('input', calculateTotals);
        part2Input.addEventListener('input', calculateTotals);
        part3Input.addEventListener('input', calculateTotals);
        part4Input.addEventListener('input', calculateTotals);
        part5Input.addEventListener('input', calculateTotals);
        part6Input.addEventListener('input', calculateTotals);
        
        console.log("resultados")
        resul();
		// Calcular totales iniciales
		calculateTotals();
		
        // Efecto de partículas en el fondo (simulado con CSS, pero podríamos añadir más con JS)
        document.addEventListener('DOMContentLoaded', function() {
            // Añadir algunas partículas móviles adicionales
            
			const body = document.body;
			
            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.width = Math.random() * 5 + 2 + 'px';
                particle.style.height = particle.style.width;
                particle.style.backgroundColor = 'rgba(255, 107, 53, 0.3)';
                particle.style.borderRadius = '50%';
                particle.style.top = Math.random() * 100 + 'vh';
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.zIndex = '-1';
                particle.style.animation = `float ${Math.random() * 20 + 10}s linear infinite`;
                body.appendChild(particle);
            }
            
            // Añadir la animación de flotación
            const style = document.createElement('style');
            style.textContent = `
                @keyframes float {
                    0% { transform: translate(0, 0); }
                    25% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
                    50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
                    75% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
                    100% { transform: translate(0, 0); }
                }
            `;
            document.head.appendChild(style);
			 
        });
