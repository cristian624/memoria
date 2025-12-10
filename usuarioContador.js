// Clase para gestionar el contador de usuarios
class ContadorUsuarios {
    constructor() {
        this.usuarioActual = localStorage.getItem('usuarioActual') || '';
        this.cargarUsuarioActual();
    }

    // Guardar estadísticas en localStorage
    guardarEstadisticas(aciertos, errores , parte) {
        if (!this.usuarioActual) {
            alert('Por favor, ingresa un nombre de usuario primero');
            return;
        }
       
	   const carga = this.cargarEstadisticas();
        
		switch (true) {
		 case (parte == 1):{
           //console.log("1 aciertos guardar: "+aciertos);
           const estadisticas = {
               hisA: aciertos,
               hisE: errores,		
               objA: carga.objA,
               objE: carga.objE,
               recA: carga.recA,
               recE: carga.recE,
               imgA: carga.imgA,
               imgE: carga.imgE,	
               numA: carga.numA,
               numE: carga.numE,	
               letA: carga.letA,
               letE: carga.letE,	   
               ultimaActualizacion: new Date().toISOString()
		    };
		    localStorage.setItem(`usuario_${this.usuarioActual}`, JSON.stringify(estadisticas));
		   
		   break;	
          }		   
		 case (parte == 2):{
		   //console.log("2 aciertos guardar ",aciertos);
           const estadisticas = {
               hisA: carga.hisA,
               hisE: carga.hisE,		
               objA: aciertos,
               objE: errores,
               recA: carga.recA,
               recE: carga.recE,
               imgA: carga.imgA,
               imgE: carga.imgE,	
               numA: carga.numA,
               numE: carga.numE,	
               letA: carga.letA,
               letE: carga.letE,	   
               ultimaActualizacion: new Date().toISOString()
		   };
		   localStorage.setItem(`usuario_${this.usuarioActual}`, JSON.stringify(estadisticas));
		   break;
		 }
		 case (parte == 3):	{
			//console.log("3 aciertos guardar ",aciertos);
           const estadisticas = {
               hisA: carga.hisA,
               hisE: carga.hisE,		
               objA: carga.objA,
               objE: carga.objE,
               recA: aciertos,
               recE: errores,
               imgA: carga.imgA,
               imgE: carga.imgE,	
               numA: carga.numA,
               numE: carga.numE,	
               letA: carga.letA,
               letE: carga.letE,			   
               ultimaActualizacion: new Date().toISOString()
		   };
		   localStorage.setItem(`usuario_${this.usuarioActual}`, JSON.stringify(estadisticas));
	       break;	
		 }
        case (parte == 4):{
           console.log("4 aciertos guardar ",aciertos);
           const estadisticas = {
               hisA: carga.hisA,
               hisE: carga.hisE,		
               objA: carga.objA,
               objE: carga.objE,
               recA: carga.recA,
               recE: carga.recE,
               imgA: aciertos,
               imgE: errores,	
               numA: carga.numA,
               numE: carga.numE,	
               letA: carga.letA,
               letE: carga.letE,			   
               ultimaActualizacion: new Date().toISOString()
		   };
		   localStorage.setItem(`usuario_${this.usuarioActual}`, JSON.stringify(estadisticas));
           break;  
		}
		case (parte == 5):{
           console.log("5 numeros ",aciertos);
           const estadisticas = {
               hisA: carga.hisA,
               hisE: carga.hisE,		
               objA: carga.objA,
               objE: carga.objE,
               recA: carga.recA,
               recE: carga.recE,
               imgA: carga.imgA,
               imgE: carga.imgE,	
               numA: aciertos,
               numE: errores,	
               letA: carga.letA,
               letE: carga.letE,			   
               ultimaActualizacion: new Date().toISOString()
		   };
		   localStorage.setItem(`usuario_${this.usuarioActual}`, JSON.stringify(estadisticas));
           break;  
		}
		case (parte == 6):{
           console.log("6 numeros ",aciertos);
           const estadisticas = {
               hisA: carga.hisA,
               hisE: carga.hisE,		
               objA: carga.objA,
               objE: carga.objE,
               recA: carga.recA,
               recE: carga.recE,
               imgA: carga.imgA,
               imgE: carga.imgE,	
               numA: carga.numA,
               numE: carga.numE,	
               letA: aciertos,
               letE: errores,			   
               ultimaActualizacion: new Date().toISOString()
		   };
		   localStorage.setItem(`usuario_${this.usuarioActual}`, JSON.stringify(estadisticas));
           break;  
		}
        // ... more case clauses
       default:
         // Code to execute if no case matches
         break;
       }
	  
	  
       
		
        this.actualizarInterfaz();
    }

    // Cargar estadísticas del usuario actual
    cargarEstadisticas() {
        if (!this.usuarioActual) {
            return { aciertos: 0, errores: 0 };
        }

        const datos = localStorage.getItem(`usuario_${this.usuarioActual}`);
        if (datos) {
			console.log("recuperar " ,datos);
            return JSON.parse(datos);
        }
        
        return { aciertos: 0, errores: 0 };
    }

    // Cambiar de usuario
    cambiarUsuario(nuevoUsuario) {
        if (nuevoUsuario && nuevoUsuario.trim() !== '') {
            this.usuarioActual = nuevoUsuario.trim().toUpperCase();
            localStorage.setItem('usuarioActual', this.usuarioActual);
            this.cargarUsuarioActual();
        } else {
            alert('Por favor, ingresa un nombre de usuario válido');
        }
    }

    // Cargar datos del usuario actual
    cargarUsuarioActual() {
        const estadisticas = this.cargarEstadisticas();
        this.actualizarInterfaz();
        console.log("user actual",this.usuarioActual.toUpperCase())
        // Actualizar display del usuario actual
        const userDisplay = document.getElementById('username');
	    userDisplay.value = this.usuarioActual.toUpperCase() || 'No seleccionado';
		//userDisplay.style.color = "blue";
		//userDisplay.style.fontSize = '20px';
    }

    // Actualizar la interfaz con las estadísticas
    actualizarInterfaz() {
        const estadisticas = this.cargarEstadisticas();
        
        //document.getElementById('aciertos-count').textContent = estadisticas.hisA;
        //document.getElementById('errores-count').textContent = estadisticas.hisE;
        
        // Calcular porcentaje
        const total1 = estadisticas.hisA + estadisticas.hisE;
        const porcentaje = total1 > 0 ? ((estadisticas.hisA / total1) * 100).toFixed(1) : 0;
		const total2 = estadisticas.objA + estadisticas.objE;
        const porcentaje2 = total2 > 0 ? ((estadisticas.objA / total2) * 100).toFixed(1) : 0;
        //document.getElementById('porcentaje').textContent = `Porcentaje de aciertos: ${porcentaje}%`;
    }

    // Obtener lista de todos los usuarios
    obtenerTodosLosUsuarios() {
        const usuarios = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('usuario_') && key !== 'usuarioActual') {
                const nombreUsuario = key.replace('usuario_', '');
                const datos = JSON.parse(localStorage.getItem(key));
                usuarios.push({
                    nombre: nombreUsuario,
                    ...datos
                });
            }
        }
        
        return usuarios;
    }

    // Mostrar lista de usuarios en la interfaz
    mostrarListaUsuarios() {
        const usuarios = this.obtenerTodosLosUsuarios();
        const listaContainer = document.getElementById('lista-usuarios');
        
        if (usuarios.length === 0) {
            listaContainer.innerHTML = '<p>No hay usuarios registrados</p>';
            return;
        }

        let html = '<div style="margin-top: 10px;">';
        usuarios.forEach(usuario => {
            const totalhis = usuario.hisA + usuario.hisE;
            const porcentajehis = totalhis > 0 ? ((usuario.hisA / total) * 100).toFixed(1) : 0;
			const totalobj = usuario.objA + usuario.objE;
            const porcentajeobj = totalhis > 0 ? ((usuario.objA / total) * 100).toFixed(1) : 0;
            
            html += `
                <div style="border: 1px solid #ccc; padding: 10px; margin: 5px 0; border-radius: 5px;">
                    <strong>${usuario.nombre}</strong>
                    <div>Historias <hr><br>  Aciertos: ${usuario.hisA} | Errores: ${usuario.hisE}</div>
                    <div>Porcentaje: ${porcentajehis}%</div>
                    <small>Última actualización: ${new Date(usuario.ultimaActualizacion).toLocaleString()}</small>
					<br>
					<div>Objetos <hr><br> Aciertos: ${usuario.objA} | Errores: ${usuario.objE}</div>
                    <div>Porcentaje: ${porcentajeobj}%</div>
                    <small>Última actualización: ${new Date(usuario.ultimaActualizacion).toLocaleString()}</small>
                </div>
            `;
        });
        html += '</div>';
        
        listaContainer.innerHTML = html;
    }
}

// Crear instancia global del contador
const contador = new ContadorUsuarios();

// Funciones globales para los botones
function cambiarUsuario() {
    const usernameInput = document.getElementById('username');
    const nuevoUsuario = usernameInput.value;
    contador.cambiarUsuario(nuevoUsuario);
    usernameInput.value = ''; // Limpiar input
}

function registrarAcierto() {
    const stats = contador.cargarEstadisticas();
	console.log("registro",stats);
    stats.hisA++;
    contador.guardarEstadisticas(stats.hisA, stats.hisE, 1);
}

function registrarError() {
    const stats = contador.cargarEstadisticas();
    stats.hisE++;
    contador.guardarEstadisticas(stats.hisA, stats.hisE, 1);
}

function reiniciarContador() {
    if (confirm('¿Estás seguro de que quieres reiniciar el contador?')) {
        contador.guardarEstadisticas(0, 0,1);
    }
}

function mostrarUsuarios() {
    contador.mostrarListaUsuarios();
}

// Cargar estadísticas al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    contador.cargarUsuarioActual();
});

// También puedes cargar un usuario por defecto al iniciar (opcional)
// contador.cambiarUsuario('Jugador1');