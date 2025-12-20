 
        // Clases para el sistema de evaluación
        class User {
            constructor() {
                this.id = Date.now().toString();
                this.name = "Usuario";
                this.part1Completed = false;
                this.part2Completed = false;
                this.results = {
                    part1: {
                        dopamine: 0,
                        acetylcholine: 0,
                        gaba: 0,
                        serotonin: 0
                    },
                    part2: {
                        dopamine: 0,
                        acetylcholine: 0,
                        gaba: 0,
                        serotonin: 0
                    }
                };
                this.responses = [];
            }
            
            saveToLocalStorage() {
                const userData = {
                    id: this.id,
                    name: this.name,
                    part1Completed: this.part1Completed,
                    part2Completed: this.part2Completed,
                    results: this.results,
                    responses: this.responses,
                    timestamp: new Date().toISOString()
                };
                
                localStorage.setItem('bravermanUser', JSON.stringify(userData));
                return userData;
            }
            
            loadFromLocalStorage() {
                const savedData = localStorage.getItem('bravermanUser');
                if (savedData) {
                    const userData = JSON.parse(savedData);
                    this.id = userData.id;
                    this.name = userData.name || "Usuario";
                    this.part1Completed = userData.part1Completed || false;
                    this.part2Completed = userData.part2Completed || false;
                    this.results = userData.results || {
                        part1: { dopamine: 0, acetylcholine: 0, gaba: 0, serotonin: 0 },
                        part2: { dopamine: 0, acetylcholine: 0, gaba: 0, serotonin: 0 }
                    };
                    this.responses = userData.responses || [];
                    return true;
                }
                return false;
            }
        }

        class QuestionBlock {
            constructor(text, category,tipo, part, index) {
                this.text = text;
                this.category = category; // 1A, 2A, 3A, 4A, 1B, 2B, 3B, 4B
				this.tipo=tipo;
                this.part = part; // 1 o 2
                this.index = index;
                this.answered = false;
                this.answer = null;
            }
            
            answerQuestion(isTrue) {
                this.answered = true;
                this.answer = isTrue;
                return this.answer;
            }
            
            getCategoryName() {
                const categories = {
                    '1A': 'Dopamina',
                    '2A': 'Acetilcolina',
                    '3A': 'GABA',
                    '4A': 'Serotonina',
                    '1B': 'Deficiencia Dopamina',
                    '2B': 'Deficiencia Acetilcolina',
                    '3B': 'Deficiencia GABA',
                    '4B': 'Deficiencia Serotonina'
                };
                return categories[this.category] || this.category;
            }
            
            getNeurotransmitter() {
                if (this.category.includes('1')) return 'dopamine';
                if (this.category.includes('2')) return 'acetylcholine';
                if (this.category.includes('3')) return 'gaba';
                if (this.category.includes('4')) return 'serotonin';
                return 'unknown';
            }
        }

        class FeedbackManager {
            constructor() {
                this.correctSound = null;
                this.incorrectSound = null;
            }
            
            provideFeedback(isCorrect, element) {
                // Cambiar color temporalmente para dar feedback visual
                const originalColor = element.style.backgroundColor;
                const feedbackColor = isCorrect ? 'rgba(29, 209, 161, 0.3)' : 'rgba(255, 107, 107, 0.3)';
                
                element.style.backgroundColor = feedbackColor;
                element.style.transform = 'scale(1.05)';
                
                setTimeout(() => {
                    element.style.backgroundColor = originalColor;
                    element.style.transform = '';
                }, 300);
            }
            
            showCategoryTransition(categoryName) {
                // Crear un elemento para mostrar la transición de categoría
                const transitionEl = document.createElement('div');
                transitionEl.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(25, 30, 60, 0.95);
                    color: white;
                    padding: 30px 50px;
                    border-radius: var(--border-radius);
                    border: 2px solid var(--secondary-color);
                    font-size: 1.5rem;
                    font-weight: bold;
                    z-index: 1000;
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
                    text-align: center;
                    animation: fadeInOut 2s ease;
                `;
                
                // Agregar estilo para la animación
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fadeInOut {
                        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
                    }
                `;
                document.head.appendChild(style);
                
                transitionEl.innerHTML = `<p>Nueva categoría:</p><p style="color: var(--accent-color); margin-top: 10px;">${categoryName}</p>`;
                document.body.appendChild(transitionEl);
                
                setTimeout(() => {
                    document.body.removeChild(transitionEl);
                    document.head.removeChild(style);
                }, 2000);
            }
        }

        // Instancias globales
        const user = new User();
        const feedbackManager = new FeedbackManager();
        
        // Variables de estado de la aplicación
        let currentPart = 1;
        let currentQuestionIndex = 0;
		let progress=0;
        let questions = [];
        let trueCount = 0;
        let falseCount = 0;
        let categoryTrueCount = 0;
        let currentCategory = "1A";
		let colorIndex = 0;
        let colorThemes = [
                    { primary: '#2a0a1a' },
					{ primary: '#1a1a4a' },
                    { primary: '#2a1a4a' },
                    { primary: '#1a2a4a' },
                    { primary: '#1a4a2a' },
                    { primary: '#4a1a2a' }
                ];
		
		

        // Datos de preguntas (simplificados para el ejemplo)
        const questionData = {
            part1: [
                // Categoría 1A
                {text:"Me resulta fácil procesar mis pensamientos",category:"1A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Me concentro eficazmente",category:"1A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Soy un pensador profundo",category:"1A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Soy una persona que piensa rápido",category:"1A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Me distraigo porque hago muchas tareas a la vez",category:"1A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Disfruto del debate intenso",category:"1A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Tengo buena imaginación",category:"1A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Tiendo a criticar y analizar mis pensamientos",category:"1A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Tengo mucha energía la mayor parte del tiempo",category:"1A",tipo:"FÍSICO"},
                {text:"Mi presión arterial a menudo está elevada",category:"1A",tipo:"FÍSICO"},
                {text:"A veces en mi vida he tenido episodios de energía extrema",category:"1A",tipo:"FÍSICO"},
                {text:"Tengo insomnio",category:"1A",tipo:"FÍSICO"},
                {text:"Encuentro que hacer ejercicio es vigorizante",category:"1A",tipo:"FÍSICO"},
                {text:"Normalmente no necesito café para empezar el día con energía",category:"1A",tipo:"FÍSICO"},
                {text:"Mis venas son visibles y tienden a parecer como si fueran a salirse de mi piel",category:"1A",tipo:"FÍSICO"},
                {text:"Suelo tener una temperatura corporal alta",category:"1A",tipo:"FÍSICO"},
                {text:"Como mi almuerzo mientras trabajo",category:"1A",tipo:"FÍSICO"},
                {text:"Tengo relaciones sexuales cada vez que puedo",category:"1A",tipo:"FÍSICO"},
                {text:"Tengo mal carácter",category:"1A",tipo:"FÍSICO"},
                {text:"Sólo como para revitalizar mi cuerpo",category:"1A",tipo:"FÍSICO"},
                {text:"Me encantan las películas de acción",category:"1A",tipo:"FÍSICO"},
                {text:"Hacer ejercicio me hace sentir una persona poderosa",category:"1A",tipo:"FÍSICO"},
                {text:"Soy una persona muy dominante",category:"1A",tipo:"PERSONALIDAD"},
                {text:"A veces no me doy cuenta de mis sentimientos",category:"1A",tipo:"PERSONALIDAD"},
                {text:"A menudo tengo problemas para escuchar a los demás porque mis propias ideas dominan",category:"1A",tipo:"PERSONALIDAD"},
                {text:"He estado en muchos altercados físicos",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Tengo tendencia a estar orientada al futuro",category:"1A",tipo:"PERSONALIDAD"},
                {text:"A veces soy especulativo",category:"1A",tipo:"PERSONALIDAD"},
                {text:"La mayoría de la gente me ve como una persona orientada al pensamiento",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Sueño despierto y a menudo fantaseo",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Me gusta leer libros de historia y otros libros de no ficción",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Admiro el ingenio",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Puedo ser lento en identificar cómo las personas pueden causar problemas",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Normalmente no me dejo engañar por la gente que dice que necesita mi ayuda",category:"1A",tipo:"PERSONALIDAD"},
                {text:"La mayoría de la gente me considera innovador",category:"1A",tipo:"PERSONALIDAD"},
                {text:"La gente ha pensado que he tenido algunas ideas extrañas pero siempre puedo explicar la base de ellas racionalmente.",category:"1A",tipo:"PERSONALIDAD"},
                {text:"A menudo estoy agitado o irritado",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Las pequeñas cosas me ponen ansioso o molesto",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Tengo fantasías de poder ilimitado",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Me encanta gastar dinero",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Domino a los demás en mis relaciones",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Soy muy duro conmigo mismo",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Reacciono agresivamente a las críticas a menudo poniéndome a la defensiva frente a los demás",category:"1A",tipo:"PERSONALIDAD"},
                {text:"Algunas personas me consideran una persona de mente dura",category:"1A",tipo:"PERSONAJE"},
                {text:"La mayoría de la gente me ve como una persona orientada al logro",category:"1A",tipo:"PERSONAJE"},
                {text:"Algunas personas dicen que soy irracional",category:"1A",tipo:"PERSONAJE"},
                {text:"Haré cualquier cosa para alcanzar una meta",category:"1A",tipo:"PERSONAJE"},
                {text:"Valoro una filosofía religiosa",category:"1A",tipo:"PERSONAJE"},
                {text:"La incompetencia me enoja",category:"1A",tipo:"PERSONAJE"},
                {text:"Tengo altos estándares para mí y para los demás",category:"1A",tipo:"PERSONAJE"},

                // Categoría 2A
                {text:"Mi memoria es muy fuerte",category:"2A",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Soy un excelente oyente",category:"2A",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Soy bueno recordando historias",category:"2A",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Normalmente no me olvido de una cara",category:"2A",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Soy muy creativa",category:"2A",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Tengo una excelente capacidad de atención y rara vez me pierdo algo",category:"2A",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Tengo muchas buenas corazonadas",category:"2A",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Observo todo lo que sucede a mi alrededor",category:"2A",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Tengo buena imaginación",category:"2A",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Suelo tener el pulso lento,",category:"2A",tipo:"FÍSICO"},
                {text:"Mi cuerpo tiene un tono excelente,",category:"2A",tipo:"FÍSICO"},
                {text:"Tengo una gran figura/constitución,",category:"2A",tipo:"FÍSICO"},
                {text:"Tengo el colesterol bajo,",category:"2A",tipo:"FÍSICO"},
                {text:"Cuando como, me encanta experimentar los aromas y la belleza de la comida,",category:"2A",tipo:"FÍSICO"},
                {text:"Me encanta el yoga y estirar mis músculos,",category:"2A",tipo:"FÍSICO"},
                {text:"Durante el sexo soy muy sensual,",category:"2A",tipo:"FÍSICO"},
                {text:"He tenido un trastorno alimentario en algún momento de mi vida,",category:"2A",tipo:"FÍSICO"},
                {text:"He probado muchos remedios alternativos,",category:"2A",tipo:"FÍSICO"},
                {text:"Soy un romántico perpetuo,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Estoy en contacto con mis sentimientos,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Tengo tendencia a tomar decisiones basadas en corazonadas,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Me gusta especular,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Algunos dicen que tengo la cabeza en las nubes,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Me encanta leer ficción,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Tengo una vida de fantasía muy rica,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Soy creativo al resolver problemas de la gente,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Soy muy expresiva, me gusta hablar de lo que me preocupa,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Estoy boyante,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Creo que es posible tener una experiencia mística,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Creo en ser un alma gemela,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"A veces lo místico puede emocionarme,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Tengo tendencia a reaccionar exageradamente ante mi cuerpo,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Me resulta fácil cambiar; no estoy estancado en mis costumbres,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Estoy profundamente en contacto con mis emociones,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Tengo tendencia a amar a alguien un minuto y odiarlo al siguiente,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Soy una persona coqueta,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"No me importa gastar dinero si beneficia mis relaciones,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Tengo tendencia a fantasear cuando tengo sexo,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Mis relaciones tienden a estar llenas de romance,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Me encanta ver películas románticas,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Tomo riesgos en mi vida amorosa,",category:"2A",tipo:"PERSONALIDAD"},
                {text:"Preveo un futuro mejor,",category:"2A",tipo:"PERSONAJE"},
                {text:"Me inspira ayudar a otras personas,",category:"2A",tipo:"PERSONAJE"},
                {text:"Creo que todo es posible, particularmente para aquellos que son devotos,",category:"2A",tipo:"PERSONAJE"},
                {text:"Soy bueno creando armonía entre las personas,",category:"2A",tipo:"PERSONAJE"},
                {text:"La caridad y el altruismo vienen del corazón, y tengo mucho de ambos,",category:"2A",tipo:"PERSONAJE"},
                {text:"Otros piensan que tengo visión,",category:"2A",tipo:"PERSONAJE"},
                {text:"Mis pensamientos sobre la religión cambian a menudo,",category:"2A",tipo:"PERSONAJE"},
                {text:"Soy idealista, pero no perfeccionista,",category:"2A",tipo:"PERSONAJE"},
                {text:"Soy feliz con alguien que me trate bien,",category:"2A",tipo:"PERSONAJE"},

                
                // Categoría 3A
				{text:"Tengo una capacidad de atención estable y puedo seguir la lógica de otras personas",category:"3A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Disfruto más leyendo personas que libros",category:"3A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Retengo la mayor parte de lo que oigo",category:"3A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Puedo recordar hechos que la gente me cuenta",category:"3A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Aprendo de mis experiencias",category:"3A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Soy bueno recordando nombres",category:"3A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Puedo concentrarme muy bien en las tareas y en las historias de las personas",category:"3A",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Me resulta fácil relajarme",category:"3A",tipo:"FÍSICO"},
                {text:"Soy una persona tranquila",category:"3A",tipo:"FÍSICO"},
                {text:"Me resulta fácil conciliar el sueño por la noche",category:"3A",tipo:"FÍSICO"},
                {text:"Suelo tener una alta resistencia física",category:"3A",tipo:"FÍSICO"},
                {text:"Tengo la presión arterial baja",category:"3A",tipo:"FÍSICO"},
                {text:"No tengo antecedentes familiares de accidente cerebrovascular",category:"3A",tipo:"FÍSICO"},
                {text:"En lo que se refiere al sexo no soy muy experimental",category:"3A",tipo:"FÍSICO"},
                {text:"Tengo poca tensión muscular",category:"3A",tipo:"FÍSICO"},
                {text:"La cafeína me hace poco efecto",category:"3A",tipo:"FÍSICO"},
                {text:"Me tomo mi tiempo para comer",category:"3A",tipo:"FÍSICO"},
                {text:"Duermo bien",category:"3A",tipo:"FÍSICO"},
                {text:"No tengo muchos antojos de alimentos dañinos como el azúcar",category:"3A",tipo:"FÍSICO"},
                {text:"Para mí hacer ejercicio es un hábito reglamentado",category:"3A",tipo:"FÍSICO"},
                {text:"No soy muy aventurero",category:"3A",tipo:"PERSONALIDAD"},
                {text:"No tengo temperamento",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Tengo mucha paciencia",category:"3A",tipo:"PERSONALIDAD"},
                {text:"No disfruto de la filosofía",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Me encanta ver comedias sobre familias",category:"3A",tipo:"PERSONALIDAD"},
                {text:"No me gustan las películas sobre otros mundos o universos",category:"3A",tipo:"PERSONALIDAD"},
                {text:"No soy una persona que toma riesgos",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Tengo en cuenta las experiencias pasadas antes de tomar decisiones",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Soy una persona realista",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Creo en el cierre",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Me gustan los hechos y los detalles",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Cuando tomo una decisión es permanente",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Me gusta planificar mi día semana mes etc",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Colecciono cosas",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Estoy un poco triste",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Tengo miedo a los enfrentamientos y altercados",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Ahorro mucho dinero en caso de crisis",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Tengo tendencia a crear vínculos fuertes y duraderos con los demás",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Soy un pilar estable en la vida de las personas.",category:"3A",tipo:"PERSONALIDAD"},
                {text:"Creo en el dicho Acostarse temprano levantarse temprano",category:"3A",tipo:"PERSONAJE"},
                {text:"Creo en cumplir los plazos",category:"3A",tipo:"PERSONAJE"},
                {text:"Intento complacer a los demás lo mejor que puedo",category:"3A",tipo:"PERSONAJE"},
                {text:"Soy perfeccionista",category:"3A",tipo:"PERSONAJE"},
                {text:"Soy bueno manteniendo relaciones duraderas",category:"3A",tipo:"PERSONAJE"},
                {text:"Presto atención a dónde va mi dinero",category:"3A",tipo:"PERSONAJE"},
                {text:"Creo que el mundo sería más pacífico si la gente mejorara su moral",category:"3A",tipo:"PERSONAJE"},
                {text:"Soy muy leal y devota a mis seres queridos",category:"3A",tipo:"PERSONAJE"},
                {text:"Tengo altos estándares éticos por los que vivo",category:"3A",tipo:"PERSONAJE"},
                {text:"Presto mucha atención a las leyes principios y políticas",category:"3A",tipo:"PERSONAJE"},
                {text:"Creo en participar en el servicio a la comunidad",category:"3A",tipo:"PERSONAJE"},

                
                // Categoría 4A
               {text:"Puedo concentrarme fácilmente en tareas manuales",category:"4A",tipo:"MEMORIA Y ATENCIÓN"},
               {text:"Tengo buena memoria visual",category:"4A",tipo:"MEMORIA Y ATENCIÓN"},
               {text:"Soy muy perceptivo",category:"4A",tipo:"MEMORIA Y ATENCIÓN"},
               {text:"Soy un pensador impulsivo",category:"4A",tipo:"MEMORIA Y ATENCIÓN"},
               {text:"Vivo en el aquí y ahora",category:"4A",tipo:"MEMORIA Y ATENCIÓN"},
               {text:"Suelo decir:	Dime el resultado final",category:"4A",tipo:"MEMORIA Y ATENCIÓN"},
               {text:"Soy un aprendiz lento con los libros	pero aprendo fácilmente con la experiencia",category:"4A",tipo:"MEMORIA Y ATENCIÓN"},
               {text:"Necesito experimentar algo o trabajarlo directamente para poder entenderlo",category:"4A",tipo:"MEMORIA Y ATENCIÓN"},
               {text:"Duermo demasiado",category:"4A",tipo:"FÍSICO"},
               {text:"En lo que se refiere al sexo soy muy experimental",category:"4A",tipo:"FÍSICO"},
               {text:"Tengo la presión arterial baja",category:"4A",tipo:"FÍSICO"},
               {text:"Estoy muy orientado a la acción",category:"4A",tipo:"FÍSICO"},
               {text:"Soy muy hábil en la casa",category:"4A",tipo:"FÍSICO"},
               {text:"Soy muy activo al aire libre",category:"4A",tipo:"FÍSICO"},
               {text:"Participo en actividades atrevidas como el paracaidismo y andar en motocicleta",category:"4A",tipo:"FÍSICO"},
               {text:"Puedo resolver problemas espontáneamente",category:"4A",tipo:"FÍSICO"},
               {text:"Rara vez tengo antojos de carbohidratos",category:"4A",tipo:"FÍSICO"},
               {text:"Normalmente tomo una comida rápida mientras estoy corriendo",category:"4A",tipo:"FÍSICO"},
               {text:"No soy muy constante con mi rutina de ejercicios; puedo hacer ejercicio diariamente durante tres semanas y luego dejarlo de hacer durante un mes",category:"4A",tipo:"FÍSICO"},
               {text:"Vivo la vida en el momento inmediato",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Me gusta actuar/entretener en público",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Tengo tendencia a recopilar datos de forma desorganizada",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Soy muy flexible",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Soy un gran negociador",category:"4A",tipo:"PERSONALIDAD"},
               {text:"A menudo me gusta simplemente comer beber y divertirme",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Soy dramático",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Soy muy artístico",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Soy un buen artesano",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Soy una persona que toma riesgos cuando se trata de deportes",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Creo en los psíquicos",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Puedo aprovecharme fácilmente de los demás",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Soy cínico respecto a las filosofías de los demás",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Me gusta divertirme",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Mis tipos de películas favoritas son las de terror",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Me fascinan las armas",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Rara vez me apego a un plan o agenda",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Tengo problemas para permanecer fiel",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Soy capaz de separarme fácilmente y seguir adelante cuando las relaciones con mis seres queridos terminan",category:"4A",tipo:"PERSONALIDAD"},
               {text:"No presto mucha atención a cómo gasto mi dinero",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Tengo muchas relaciones frívolas",category:"4A",tipo:"PERSONALIDAD"},
               {text:"Siempre mantengo mis opciones abiertas en caso de que surja algo mejor",category:"4A",tipo:"PERSONAJE"},
               {text:"No me gusta trabajar duro durante largos periodos de tiempo",category:"4A",tipo:"PERSONAJE"},
               {text:"Creo que las cosas deben tener una función y un propósito",category:"4A",tipo:"PERSONAJE"},
               {text:"Soy optimista",category:"4A",tipo:"PERSONAJE"},
               {text:"Vivo el momento",category:"4A",tipo:"PERSONAJE"},
               {text:"Solo rezo cuando necesito apoyo espiritual",category:"4A",tipo:"PERSONAJE"},
               {text:"No tengo una moral ni unos valores éticos particularmente elevados",category:"4A",tipo:"PERSONAJE"},
               {text:"Hago lo que quiero cuando quiero",category:"4A",tipo:"PERSONAJE"},
               {text:"No me importa ser perfecta; simplemente vivo mi vida",category:"4A",tipo:"PERSONAJE"},
               {text:"Los ahorros son para los tontos",category:"4A",tipo:"PERSONAJE"}

            ],
            part2: [
                // Categoría 1B
                {text:"Tengo problemas para prestar atención constante y concentrarme",category:"1B",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Necesito cafeína para despertarme",category:"1B",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"No puedo pensar lo suficientemente rápido",category:"1B",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"No tengo buena capacidad de atención",category:"1B",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Tengo problemas para completar una tarea incluso cuando me resulta interesante.",category:"1B",tipo:"MEMORIA Y ATENCIÓN:"},
                {text:"Soy lento para aprender nuevas ideas",category:"1B",tipo:"MEMORIA Y ATENCIÓN:"},
				{text:"Tengo antojo de azúcar",category:"1B",tipo:"FÍSICO"},
                {text:"Tengo la libido disminuida",category:"1B",tipo:"FÍSICO"},
                {text:"Duermo demasiado",category:"1B",tipo:"FÍSICO"},
                {text:"Tengo antecedentes de alcohol o adicción",category:"1B",tipo:"FÍSICO"},
                {text:"Últimamente me he sentido agotado sin razón aparente",category:"1B",tipo:"FÍSICO"},
                {text:"A veces experimento un agotamiento total sin siquiera esforzarme",category:"1B",tipo:"FÍSICO"},
                {text:"Siempre he luchado con problemas de peso",category:"1B",tipo:"FÍSICO"},
                {text:"Tengo poca motivación para las experiencias sexuales",category:"1B",tipo:"FÍSICO"},
                {text:"Tengo problemas para levantarme de la cama por la mañana",category:"1B",tipo:"FÍSICO"},
                {text:"He tenido antojo de cocaína anfetaminas o éxtasis",category:"1B",tipo:"FÍSICO"},
                {text:"Me siento bien simplemente siguiendo a otros,",category:"1B",tipo:"PERSONALIDAD"},
                {text:"La gente parece aprovecharse de mí",category:"1B",tipo:"PERSONALIDAD"},
                {text:"Me siento muy deprimido o decaído",category:"1B",tipo:"PERSONALIDAD"},
                {text:"La gente me ha dicho que soy demasiado tranquila",category:"1B",tipo:"PERSONALIDAD"},
                {text:"Tengo poca urgencia",category:"1B",tipo:"PERSONALIDAD"},
                {text:"Dejo que la gente me critique",category:"1B",tipo:"PERSONALIDAD"},
                {text:"Siempre busco que otros me guíen",category:"1B",tipo:"PERSONALIDAD"},
				{text:"He perdido mi capacidad de razonamiento",category:"1B",tipo:"PERSONAJE"},
                {text:"No puedo tomar buenas decisiones",category:"1B",tipo:"PERSONAJE"},



                
                // Categoría 2B
               {text:"Me falta imaginación",category:"2B",tipo:"MEMORIA Y ATENCIÓN:"},
               {text:"Tengo dificultad para recordar nombres cuando conozco gente por primera vez",category:"2B",tipo:"MEMORIA Y ATENCIÓN:"},
               {text:"He notado que mi capacidad de memoria está disminuyendo",category:"2B",tipo:"MEMORIA Y ATENCIÓN:"},
               {text:"Mi pareja me dice que no tengo pensamientos románticos",category:"2B",tipo:"MEMORIA Y ATENCIÓN:"},
               {text:"No recuerdo los cumpleaños de mis amigos",category:"2B",tipo:"MEMORIA Y ATENCIÓN:"},
               {text:"He perdido algo de mi creatividad",category:"2B",tipo:"MEMORIA Y ATENCIÓN:"},
               {text:"Tengo insomnio",category:"2B",tipo:"FÍSICO"},
               {text:"He perdido tono muscular",category:"2B",tipo:"FÍSICO"},
               {text:"Ya no hago ejercicio",category:"2B",tipo:"FÍSICO"},
               {text:"Tengo antojo de alimentos grasosos",category:"2B",tipo:"FÍSICO"},
               {text:"He experimentado con alucinógenos u otras drogas ilícitas",category:"2B",tipo:"FÍSICO"},
               {text:"Siento que mi cuerpo se está desmoronando",category:"2B",tipo:"FÍSICO"},
               {text:"No puedo respirar fácilmente",category:"2B",tipo:"FÍSICO"},
			   {text:"No siento alegría muy a menudo",category:"2B",tipo:"PERSONALIDAD"},
               {text:"Siento desesperación",category:"2B",tipo:"PERSONALIDAD"},
               {text:"Me protejo de que otros me lastimen al no contar nunca mucho sobre mí",category:"2B",tipo:"PERSONALIDAD"},
               {text:"Me resulta más cómodo hacer las cosas solo que en un grupo grande",category:"2B",tipo:"PERSONALIDAD"},
               {text:"Otras personas se enojan más que yo por cosas molestas",category:"2B",tipo:"PERSONALIDAD"},
               {text:"Me entrego fácilmente y tiendo a ser sumisa",category:"2B",tipo:"PERSONALIDAD"},
               {text:"Rara vez me apasiona algo",category:"2B",tipo:"PERSONALIDAD"},
               {text:"Me gusta la rutina",category:"2B",tipo:"PERSONALIDAD"},
			   {text:"No me importan las historias de nadie más que las mías",category:"2B",tipo:"PERSONALIDAD"},
               {text:"No presto atención a los sentimientos de la gente",category:"2B",tipo:"PERSONAJE"},
               {text:"No me siento boyante",category:"2B",tipo:"PERSONAJE"},
               {text:"Estoy obsesionado con mis deficiencias",category:"2B",tipo:"PERSONAJE"},
                
                // Categoría 3B
                {text:"Me resulta difícil concentrarme porque estoy nervioso y nervioso.",category:"3B",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"No recuerdo los números de teléfono",category:"3B",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Tengo problemas para encontrar la palabra correcta",category:"3B",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Tengo problemas para recordar cosas cuando me ponen en aprietos",category:"3B",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Sé que soy inteligente pero me cuesta demostrárselo a los demás",category:"3B",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Mi capacidad de concentración va y viene",category:"3B",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Cuando leo me doy cuenta de que tengo que volver al mismo párrafo varias veces para absorber la información",category:"3B",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Pienso rápido pero no siempre puedo decir lo que quiero decir",category:"3B",tipo:"MEMORIA Y ATENCIÓN"},
				{text:"Me siento tembloroso",category:"3B",tipo:"FÍSICO"},
                {text:"A veces tiemblo",category:"3B",tipo:"FÍSICO"},
                {text:"Tengo dolores de espalda y/o de cabeza frecuentes",category:"3B",tipo:"FÍSICO"},
                {text:"Tengo tendencia a tener dificultad para respirar",category:"3B",tipo:"FÍSICO"},
                {text:"Tengo tendencia a tener palpitaciones del corazón",category:"3B",tipo:"FÍSICO"},
                {text:"Tengo tendencia a tener las manos frías",category:"3B",tipo:"FÍSICO"},
                {text:"A veces sudo demasiado",category:"3B",tipo:"FÍSICO"},
                {text:"A veces me mareo",category:"3B",tipo:"FÍSICO"},
                {text:"A menudo tengo tensión muscular",category:"3B",tipo:"FÍSICO"},
                {text:"Tengo tendencia a sentir mariposas en el estómago",category:"3B",tipo:"FÍSICO"},
                {text:"Tengo antojo de alimentos amargos",category:"3B",tipo:"FÍSICO"},
                {text:"A menudo estoy nervioso",category:"3B",tipo:"FÍSICO"},
                {text:"Me gusta el yoga porque me ayuda a relajarme",category:"3B",tipo:"FÍSICO"},
                {text:"A menudo me siento fatigado incluso después de haber dormido bien",category:"3B",tipo:"FÍSICO"},
                {text:"Como demasiado",category:"3B",tipo:"FÍSICO"},
				{text:"Tengo cambios de humor",category:"3B",tipo:"PERSONALIDAD"},
                {text:"Disfruto haciendo muchas cosas a la vez pero me resulta difícil decidir qué hacer primero",category:"3B",tipo:"PERSONALIDAD"},
                {text:"Tiendo a hacer cosas sólo porque pienso que serán divertidas",category:"3B",tipo:"PERSONALIDAD"},
                {text:"Cuando las cosas son aburridas siempre trato de introducir algo de emoción",category:"3B",tipo:"PERSONALIDAD"},
                {text:"Tengo tendencia a ser voluble cambiando mi humor y mis pensamientos con frecuencia",category:"3B",tipo:"PERSONALIDAD"},
                {text:"Tengo tendencia a emocionarme demasiado por las cosas",category:"3B",tipo:"PERSONALIDAD"},
                {text:"Mis impulsos tienden a meterme en muchos problemas",category:"3B",tipo:"PERSONALIDAD"},
                {text:"Tengo tendencia a ser teatral y llamar la atención",category:"3B",tipo:"PERSONALIDAD"},
                {text:"Digo lo que pienso sin importar cuál pueda ser la reacción de los demás",category:"3B",tipo:"PERSONALIDAD"},
                {text:"A veces tengo ataques de ira y luego me siento terriblemente culpable",category:"3B",tipo:"PERSONALIDAD"},
                {text:"A menudo digo mentiras para salir de problemas",category:"3B",tipo:"PERSONALIDAD"},
                {text:"Siempre he tenido menos interés que la persona promedio en el sexo",category:"3B",tipo:"PERSONALIDAD"},
				{text:"Ya no juego según las reglas",category:"3B",tipo:"PERSONAJE"},
                {text:"He perdido muchos amigos",category:"3B",tipo:"PERSONAJE"},
                {text:"No puedo mantener relaciones románticas",category:"3B",tipo:"PERSONAJE"},
                {text:"Considero que la ley es arbitraria y sin razón",category:"3B",tipo:"PERSONAJE"},
                {text:"Ahora considero ridículas las reglas que solía seguir",category:"3B",tipo:"PERSONAJE"},
                
                // Categoría 4B
                {text:"No soy muy perceptivo",category:"4B",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"No puedo recordar cosas que he visto en el pasado",category:"4B",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Tengo un tiempo de reacción lento",category:"4B",tipo:"MEMORIA Y ATENCIÓN"},
                {text:"Tengo poco sentido de la orientación",category:"4B",tipo:"MEMORIA Y ATENCIÓN"},
				{text:"Tengo sudores nocturnos",category:"4B",tipo:"FÍSICO"},
                {text:"Tengo insomnio",category:"4B",tipo:"FÍSICO"},
                {text:"Suelo dormir en muchas posiciones diferentes para sentirme cómodo",category:"4B",tipo:"FÍSICO"},
                {text:"Siempre me despierto temprano en la mañana",category:"4B",tipo:"FÍSICO"},
                {text:"No puedo relajarme",category:"4B",tipo:"FÍSICO"},
                {text:"Me despierto al menos dos veces por noche",category:"4B",tipo:"FÍSICO"},
                {text:"Me resulta difícil volver a dormirme cuando me despierto",category:"4B",tipo:"FÍSICO"},
                {text:"Tengo antojo de sal",category:"4B",tipo:"FÍSICO"},
                {text:"Tengo menos energía para hacer ejercicio",category:"4B",tipo:"FÍSICO"},
                {text:"Estoy triste",category:"4B",tipo:"FÍSICO"},
				{text:"Tengo ansiedad crónica",category:"4B",tipo:"PERSONALIDAD"},
                {text:"Me irrito fácilmente",category:"4B",tipo:"PERSONALIDAD"},
                {text:"Tengo pensamientos de autodestrucción",category:"4B",tipo:"PERSONALIDAD"},
                {text:"He tenido pensamientos suicidas en mi vida",category:"4B",tipo:"PERSONALIDAD"},
                {text:"Tengo tendencia a pensar demasiado en las ideas",category:"4B",tipo:"PERSONALIDAD"},
                {text:"A veces soy tan estructurado que me vuelvo inflexible",category:"4B",tipo:"PERSONALIDAD"},
                {text:"Mi imaginación toma el control",category:"4B",tipo:"PERSONALIDAD"},
                {text:"El miedo me invade",category:"4B",tipo:"PERSONALIDAD"},
				{text:"No puedo dejar de pensar en el significado de la vida",category:"4B",tipo:"PERSONAJE"},
                {text:"Ya no quiero correr riesgos",category:"4B",tipo:"PERSONAJE"},
                {text:"La falta de sentido en mi vida me duele",category:"4B",tipo:"PERSONAJE"}

              



            ]
        };

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            // Cargar datos del usuario si existen
            user.loadFromLocalStorage();
            
            // Inicializar el fondo estrellado
            createStarfield();
            
            // Cargar preguntas para la parte 1 por defecto
            loadQuestions(currentPart);
            
            // Actualizar la interfaz
            updateQuestionDisplay();
            updateStats();
            
            // Configurar event listeners
            setupEventListeners();
            
            
        });

        // Crear fondo estrellado
        function createStarfield() {
            const starfield = document.getElementById('starfield');
            const starCount = 150;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                // Tamaño aleatorio
                const size = Math.random() * 3;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                
                // Posición aleatoria
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                
                // Opacidad aleatoria
                star.style.opacity = Math.random() * 0.8 + 0.2;
                
                // Animación parpadeante
                const duration = Math.random() * 5 + 3;
                star.style.animation = `twinkle ${duration}s infinite alternate`;
                
                starfield.appendChild(star);
            }
			
			
			            
            // Agregar estilos de animación
            const style = document.createElement('style');
            style.textContent = `
                @keyframes twinkle {
                    0% { opacity: 0.2; }
                    100% { opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
        }
		
		
		
        
		

        // Cargar preguntas según la parte seleccionada
        function loadQuestions(part) {
			console.log("gestion " + part);
            questions = [];
            const data = part === 1 ? questionData.part1 : questionData.part2;
            
            data.forEach((q, index) => {
                questions.push(new QuestionBlock(q.text, q.category, q.tipo, part, index));
            });
			
            console.log("gestion length"+questions.length);
			
            // Reiniciar índices y contadores
            currentQuestionIndex = 0;
			progress=0;
            trueCount = 0;
            falseCount = 0;
            categoryTrueCount = 0;
            currentCategory = questions[0] ? questions[0].category : "1A";
            
            // Actualizar botones de parte
            document.querySelectorAll('.part-btn').forEach(btn => {
                if (parseInt(btn.dataset.part) === part) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Actualizar instrucciones
            //document.getElementById('part1-instructions').classList.toggle('hidden', part !== 1);
            
			//document.getElementById('part1-instructions').classList.add('hidden');
           // document.getElementById('part2-instructions').classList.add('hidden');
                                         
			
            // Actualizar botón de siguiente/finalizar
            updateNavigationButtons();
        }


        // Configurar event listeners
        function setupEventListeners() {
            // Botones de verdadero/falso
            document.getElementById('true-btn').addEventListener('click', () => answerQuestion(true));
            document.getElementById('false-btn').addEventListener('click', () => answerQuestion(false));
          						
            // Botones de navegación
            document.getElementById('prev-btn').addEventListener('click', goToPreviousQuestion);
            document.getElementById('next-btn').addEventListener('click', goToNextQuestion);
            document.getElementById('finish-btn').addEventListener('click', showResults);
                     
            
            // Botones de resultados
            document.getElementById('toggle-results-btn').addEventListener('click', toggleResultsView);
            document.getElementById('save-results-btn').addEventListener('click', saveResults);
            document.getElementById('restart-btn').addEventListener('click', restartAssessment);
			document.getElementById('preguntas-btn').addEventListener('click', preguntasAssessment);
			
        }

        // Responder a una pregunta
        function answerQuestion(isTrue) {
            if (currentQuestionIndex >= questions.length) return;
            
            const question = questions[currentQuestionIndex];
            const answer = question.answerQuestion(isTrue);
            console.log("question "+question);
			console.log("answer "+answer);
		
            // Registrar respuesta del usuario
            user.responses.push({
                questionIndex: currentQuestionIndex,
                questionText: question.text,
                category: question.category,
                answer: answer,
                part: currentPart
            });
            
            // Actualizar contadores
            if (answer) {
                trueCount++;
                categoryTrueCount++;
				console.log("categoryTrueCount : " + categoryTrueCount)
            } else {
                falseCount++;
            }
            
            // Proporcionar feedback visual
            const button = isTrue ? document.getElementById('true-btn') : document.getElementById('false-btn');
            feedbackManager.provideFeedback(true, button);
            
            // Actualizar estadísticas
            updateStats();
            
            // Verificar si cambiamos de categoría
            const nextQuestion = questions[currentQuestionIndex + 1];
            if (nextQuestion && nextQuestion.category !== currentCategory) {
                // Guardar resultados de la categoría actual
             
     			 saveCategoryResults();
                
                // Mostrar transición de categoría
                feedbackManager.showCategoryTransition(nextQuestion.getCategoryName());
                
                // Reiniciar contador de categoría
                categoryTrueCount = 0;
                currentCategory = nextQuestion.category;
            }
            
            // Pasar a la siguiente pregunta después de un breve retraso
            setTimeout(() => {
                goToNextQuestion();
            }, 500);
        }

        // Guardar resultados de la categoría actual
        function saveCategoryResults() {
            const neurotransmitter = questions[currentQuestionIndex].getNeurotransmitter();
            console.log("categoria contador " + categoryTrueCount);
			console.log("currentPart " + currentPart);
			
            if (currentPart === 1) {
                user.results.part1[neurotransmitter] = categoryTrueCount;
            } else {
                user.results.part2[neurotransmitter] = categoryTrueCount;
            }
        }

        // Ir a la siguiente pregunta
        function goToNextQuestion() {
			 console.log("cus: " +currentQuestionIndex);
			 console.log("ques: " +questions.length);
			currentQuestionIndex++; 
			  
            if (currentQuestionIndex <= questions.length -1) 
			{              
                updateQuestionDisplay();
                updateNavigationButtons();
            } 

			if (currentQuestionIndex === questions.length ) {
				 console.log("els cus: " +currentQuestionIndex);
			     console.log("else ques: " + questions.length );
				 currentQuestionIndex--;
				 progress++;
				 updateQuestionDisplay();
                // Última pregunta respondida, guardar resultados de categoría
                saveCategoryResults();
                
                // Mostrar botón de finalizar
                document.getElementById('next-btn').style.display = 'none';
                
                
                // Marcar parte como completada
                if (currentPart === 1) {
                    user.part1Completed = true;
                } else {
                    user.part2Completed = true;
                }
                
                // Guardar usuario
                user.saveToLocalStorage();
            }
			
        }

        // Ir a la pregunta anterior
        function goToPreviousQuestion() {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                updateQuestionDisplay();
                updateNavigationButtons();
            }
        }

        // Actualizar la visualización de la pregunta
        function updateQuestionDisplay() {
			
            if (questions.length === 0) return;
            
			
			
			// Cambiar a siguiente tema de color
                colorIndex = (colorIndex + 1) % colorThemes.length;
               let theme = colorThemes[colorIndex];
			
            const question = questions[currentQuestionIndex];
            console.log(question);
            // Actualizar texto de la pregunta
            document.getElementById('question-text').textContent = question.text;
			document.getElementById('question-text').style.backgroundColor = theme.primary;
            
            // Actualizar contador de preguntas
			
            document.getElementById('question-counter').textContent = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
            
            // Actualizar categoría actual
            document.getElementById('current-category').textContent = question.category;
			document.getElementById('category').textContent = question.tipo;
            
            // Actualizar barra de progreso
            if(progress > 0)
			{
			   const progressPercent = ((currentQuestionIndex + 2) / (questions.length+1)) * 100;
			   console.log("progre act "+progress);
			   console.log("progre porcent "+progressPercent);
               document.getElementById('progress-fill').style.width = `${progressPercent}%`;
			   document.getElementById('finish-btn').style.display = 'flex';
            } else{
				const progressPercent = ((currentQuestionIndex + 1) / (questions.length+1)) * 100;
                console.log("progre "+progressPercent)
				document.getElementById('progress-fill').style.width = `${progressPercent}%`;
            
			}
			
            // Actualizar contador de categoría si la pregunta ya fue respondida
            if (question.answered) {
                categoryTrueCount = countTrueInCurrentCategory();
            }
            
            // Actualizar botones de opción según si ya fue respondida
            if (question.answered) {
                document.getElementById('true-btn').style.opacity = question.answer ? '1' : '0.5';
                document.getElementById('false-btn').style.opacity = !question.answer ? '1' : '0.5';
            } else {
                document.getElementById('true-btn').style.opacity = '1';
                document.getElementById('false-btn').style.opacity = '1';
            }
        }

        // Contar verdaderos en la categoría actual
        function countTrueInCurrentCategory() {
            const currentCat = questions[currentQuestionIndex].category;
            let count = 0;
            
            for (let i = 0; i <= currentQuestionIndex; i++) {
                const q = questions[i];
                if (q.category === currentCat && q.answered && q.answer) {
                    count++;
                }
            }
            
            return count;
        }

        // Actualizar estadísticas
        function updateStats() {
            document.getElementById('true-count').textContent = trueCount;
            document.getElementById('false-count').textContent = falseCount;
            document.getElementById('category-true-count').textContent = categoryTrueCount;
        }

        // Actualizar botones de navegación
        function updateNavigationButtons() {
            // Mostrar/ocultar botón anterior
            document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'flex' : 'none';
            
            // Mostrar/ocultar botón siguiente
            const isLastQuestion = currentQuestionIndex === questions.length;
            document.getElementById('next-btn').style.display = isLastQuestion ? 'none' : 'flex';
            //document.getElementById('finish-btn').style.display = isLastQuestion ? 'flex' : 'none';
        }

        function part1(part){
		    
			this.currentPart = 1;

			document.getElementById('m1').style.display="none";
			document.getElementById('m2').style.display="none";
			document.getElementById('part1-instructions').classList.toggle('hidden', part !== 1);
            document.getElementById('part2-instructions').classList.toggle('hidden', part !== 2);
			document.getElementById('b1').style.display="block";
			document.getElementById('b2').style.display="none";
			 // Reiniciar usuario
                user.responses = [];
                user.results = {
                    part1: { dopamine: 0, acetylcholine: 0, gaba: 0, serotonin: 0 },
                    part2: { dopamine: 0, acetylcholine: 0, gaba: 0, serotonin: 0 }
                };
                user.part1Completed = false;
                user.part2Completed = false;
			console.log(part)
			
			loadQuestions(part);
			
			updateQuestionDisplay();
            updateStats();

			document.getElementById('qc').classList.remove('hidden');
			document.getElementById('pc').classList.remove('hidden');
			document.getElementById('nv').classList.remove('hidden');
			
		 
		 }
		 
		 function part2(part){
		    
			currentPart=2;
			document.getElementById('m1').style.display="none";
			document.getElementById('m2').style.display="none";
			document.getElementById('part1-instructions').classList.toggle('hidden', part !== 1);
            document.getElementById('part2-instructions').classList.toggle('hidden', part !== 2);
		  	document.getElementById('b1').style.display="none";
			document.getElementById('b2').style.display="block";
			 // Reiniciar usuario
                user.responses = [];
                user.results = {
                    part1: { dopamine: 0, acetylcholine: 0, gaba: 0, serotonin: 0 },
                    part2: { dopamine: 0, acetylcholine: 0, gaba: 0, serotonin: 0 }
                };
                user.part1Completed = false;
                user.part2Completed = false;
			loadQuestions(part);
			updateQuestionDisplay();
             updateStats();

			document.getElementById('qc').classList.remove('hidden');
			document.getElementById('pc').classList.remove('hidden');
			document.getElementById('nv').classList.remove('hidden');
		 }


        // Mostrar resultados
        function showResults() {
            // Guardar todos los resultados
            user.saveToLocalStorage();
            
            // Calcular resultados finales si no están calculados
            calculateFinalResults();
            
            // Mostrar sección de resultados
            document.querySelector('.section:not(#results-section)').classList.add('hidden');
            document.getElementById('results-section').classList.remove('hidden');
            
            // Actualizar resultados en pantalla
           // updateResultsDisplay();
        }

        // Calcular resultados finales
        function calculateFinalResults() {
			console.log("calculate cal finla :" + currentPart);
            // Para la parte 1, sumar todas las respuestas verdaderas por categoría
            if (currentPart === 1) {
				console.log("calculate1 :" + currentPart);
                // Los resultados ya se guardaron por categoría, no es necesario recalcular
				   // Resultados parte 1
                   document.getElementById('dopamine-score').textContent = user.results.part1.dopamine;
                   document.getElementById('acetylcholine-score').textContent = user.results.part1.acetylcholine;
                   document.getElementById('gaba-score').textContent = user.results.part1.gaba;
                   document.getElementById('serotonin-score').textContent = user.results.part1.serotonin;
				   // Determinar naturaleza dominante
                   const part1Results = user.results.part1;
                   const scores = [
                       { name: "Dopamina", value: part1Results.dopamine, key: "dopamine" },
                       { name: "Acetilcolina", value: part1Results.acetylcholine, key: "acetylcholine" },
                       { name: "GABA", value: part1Results.gaba, key: "gaba" },
                       { name: "Serotonina", value: part1Results.serotonin, key: "serotonin" }
                   ];
                   
                   scores.sort((a, b) => b.value - a.value);
                   const dominantNature = scores[0];
                   
                   // Mostrar interpretación de naturaleza dominante
                   let interpretationText = `Tu naturaleza dominante es <b style="font-size: 1.5rem;color:red">${dominantNature.name}</b> con un puntaje de ${dominantNature.value}. `;
                   
                   if (dominantNature.value >= 35) {
                       interpretationText += "Esta puntuación sugiere una naturaleza dominante clásica que puede indicar un desequilibrio en tu vida.";
                   } else {
                       interpretationText += "Esta puntuación indica una naturaleza dominante pero no necesariamente desequilibrada.";
                   }
                   
                   // Verificar deficiencias relativas
                   const secondScore = scores[1].value;
                   if (dominantNature.value - secondScore >= 10) {
                       interpretationText += ` Además, tienes una deficiencia relativa en ${scores[3].name} que podría necesitar equilibrio incluso en épocas de buena salud.`;
                   }
                   
                   document.getElementById('dominant-nature-text').innerHTML = interpretationText;
			       
            } else {
				console.log("calculate2 :" + currentPart);
                // Para la parte 2, hacer lo mismo
				   document.getElementById('dopamine-deficiency').textContent = user.results.part2.dopamine;
                   document.getElementById('acetylcholine-deficiency').textContent = user.results.part2.acetylcholine;
                   document.getElementById('gaba-deficiency').textContent = user.results.part2.gaba;
                   document.getElementById('serotonin-deficiency').textContent = user.results.part2.serotonin;
				   // Determinar nivel de deficiencia para parte 2
                    if (user.part2Completed) {
						   console.log("calculate2 comple :" + currentPart);
                           const part2Results = user.results.part2;
                           let deficiencyText = "<p><strong>Niveles de deficiencia:</strong></p><ul>";
						   for (const [key, value] of Object.entries(part2Results)) {
                    let level = "Leve";
                    let color = "#1dd1a1";
                    
                    if (value >= 6 && value <= 15) {
                        level = "Moderada";
                        color = "#feca57";
                    } else if (value > 15) {
                        level = "Grave";
                        color = "#ff6b6b";
                        deficiencyText += `<li><b style="font-size: 1.5rem;color:${color}">DEFICIENCIA GRAVE EN ${key.toUpperCase()}</b>: Deberías consultar a un médico lo antes posible.</li>`;
                        continue;
                    }
                    
                    const names = {
                        dopamine: "Dopamina",
                        acetylcholine: "Acetilcolina",
                        gaba: "GABA",
                        serotonin: "Serotonina"
                    };
                    
                    if (value > 0) {
                        deficiencyText += `<li><b style="font-size: 1.5rem; color:${color}">${names[key]}</b>: Deficiencia ${level} (${value} respuestas verdaderas)</li>`;
                    }
                }
                
                deficiencyText += "</ul>";
                document.getElementById('deficiency-text').innerHTML = deficiencyText;
  	    			   }
                }
			
			const part1Results = document.getElementById('part1-results');
            const part2Results = document.getElementById('part2-results');
            const toggleBtn = document.getElementById('toggle-results-btn');
            
            if (currentPart === 1) {
                // Mostrar parte 1
                part1Results.classList.remove('hidden');
                part2Results.classList.add('hidden');
                toggleBtn.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Cambiar a Parte 2</span>';
            } else {
				console.log("remover log");
                // Mostrar parte 2
                part1Results.classList.add('hidden');
                part2Results.classList.remove('hidden');
                toggleBtn.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Cambiar a Parte 1</span>';
            }
			
        }

        // Actualizar visualización de resultados
        function updateResultsDisplay() {
            // Resultados parte 1
            document.getElementById('dopamine-score').textContent = user.results.part1.dopamine;
            document.getElementById('acetylcholine-score').textContent = user.results.part1.acetylcholine;
            document.getElementById('gaba-score').textContent = user.results.part1.gaba;
            document.getElementById('serotonin-score').textContent = user.results.part1.serotonin;
            
            // Resultados parte 2
            document.getElementById('dopamine-deficiency').textContent = user.results.part2.dopamine;
            document.getElementById('acetylcholine-deficiency').textContent = user.results.part2.acetylcholine;
            document.getElementById('gaba-deficiency').textContent = user.results.part2.gaba;
            document.getElementById('serotonin-deficiency').textContent = user.results.part2.serotonin;
            
            // Determinar naturaleza dominante
            const part1Results = user.results.part1;
            const scores = [
                { name: "Dopamina", value: part1Results.dopamine, key: "dopamine" },
                { name: "Acetilcolina", value: part1Results.acetylcholine, key: "acetylcholine" },
                { name: "GABA", value: part1Results.gaba, key: "gaba" },
                { name: "Serotonina", value: part1Results.serotonin, key: "serotonin" }
            ];
            
            scores.sort((a, b) => b.value - a.value);
            const dominantNature = scores[0];
            
            // Mostrar interpretación de naturaleza dominante
            let interpretationText = `Tu naturaleza dominante es <strong>${dominantNature.name}</strong> con un puntaje de ${dominantNature.value}. `;
            
            if (dominantNature.value >= 35) {
                interpretationText += "Esta puntuación sugiere una naturaleza dominante clásica que puede indicar un desequilibrio en tu vida.";
            } else {
                interpretationText += "Esta puntuación indica una naturaleza dominante pero no necesariamente desequilibrada.";
            }
            
            // Verificar deficiencias relativas
            const secondScore = scores[1].value;
            if (dominantNature.value - secondScore >= 10) {
                interpretationText += ` Además, tienes una deficiencia relativa en ${scores[3].name} que podría necesitar equilibrio incluso en épocas de buena salud.`;
            }
            
            document.getElementById('dominant-nature-text').innerHTML = interpretationText;
            
            // Determinar nivel de deficiencia para parte 2
            if (user.part2Completed) {
                const part2Results = user.results.part2;
                let deficiencyText = "<p><strong>Niveles de deficiencia:</strong></p><ul>";
                
                for (const [key, value] of Object.entries(part2Results)) {
                    let level = "Leve";
                    let color = "#1dd1a1";
                    
                    if (value >= 6 && value <= 15) {
                        level = "Moderada";
                        color = "#feca57";
                    } else if (value > 15) {
                        level = "Grave";
                        color = "#ff6b6b";
                        deficiencyText += `<li><span style="color:${color}">DEFICIENCIA GRAVE EN ${key.toUpperCase()}</span>: Deberías consultar a un médico lo antes posible.</li>`;
                        continue;
                    }
                    
                    const names = {
                        dopamine: "Dopamina",
                        acetylcholine: "Acetilcolina",
                        gaba: "GABA",
                        serotonin: "Serotonina"
                    };
                    
                    if (value > 0) {
                        deficiencyText += `<li><span style="color:${color}">${names[key]}</span>: Deficiencia ${level} (${value} respuestas verdaderas)</li>`;
                    }
                }
                
                deficiencyText += "</ul>";
                document.getElementById('deficiency-text').innerHTML = deficiencyText;
            }
        }

        // Cambiar vista de resultados
        function toggleResultsView() {
            const part1Results = document.getElementById('part1-results');
            const part2Results = document.getElementById('part2-results');
			
            const toggleBtn = document.getElementById('toggle-results-btn');
            
            if (part1Results.classList.contains('hidden')) {
                // Mostrar parte 1
                part1Results.classList.remove('hidden');
                part2Results.classList.add('hidden');
                toggleBtn.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Cambiar a Parte 2</span>';
            } else {
                // Mostrar parte 2
                part1Results.classList.add('hidden');
                part2Results.classList.remove('hidden');
                toggleBtn.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Cambiar a Parte 1</span>';
            }
        }

        // Guardar resultados
        function saveResults() {
            user.saveToLocalStorage();
            
            // Mostrar mensaje de confirmación
            const saveMessage = document.getElementById('save-message');
            saveMessage.classList.remove('hidden');
            
            setTimeout(() => {
                saveMessage.classList.add('hidden');
            }, 3000);
        }

        // Reiniciar evaluación
        function restartAssessment() {
			document.getElementById('results-section').classList.add('hidden');
			document.getElementById('ps').style.display="flex";
			document.getElementById('m1').style.display="block";
			document.getElementById('m2').style.display="block";
			document.querySelector('.section:not(#results-section)').classList.remove('hidden');
			document.getElementById('part1-instructions').classList.add('hidden');
            document.getElementById('part2-instructions').classList.add('hidden');
			document.getElementById('b1').style.display="flex";
			document.getElementById('b2').style.display="flex";
			document.getElementById('qc').classList.add('hidden');
			document.getElementById('pc').classList.add('hidden');
			document.getElementById('nv').classList.add('hidden');
			    // Reiniciar usuario
                user.responses = [];
                user.results = {
                    part1: { dopamine: 0, acetylcholine: 0, gaba: 0, serotonin: 0 },
                    part2: { dopamine: 0, acetylcholine: 0, gaba: 0, serotonin: 0 }
                };
				progress=0;
                user.part1Completed = false;
                user.part2Completed = false;
				loadQuestions(1)
            
			
            
        }
		
		// preguntas evaluación
        function preguntasAssessment() {
           document.getElementById('preguntas-message').classList.toggle('hidden');
        }
 