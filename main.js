// main.js

// Obtener pacientes del localStorage o inicializar un array vacío
const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

// Contadores de turnos por especialista
let contadorTurnosEspecialista1 = 1;
let contadorTurnosEspecialista2 = 1;
// Añade más contadores según la cantidad de especialistas que tengas



fetch('datos.json')
  .then(response => response.json())
  .then(data => {
    // Manejar los datos cargados, por ejemplo, inicializar el array de pacientes
    // con los datos del JSON
    pacientes.push(...data.pacientes);

    // Actualizar localStorage con los nuevos datos
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
  })
  .catch(error => console.error(error));

function solicitarTurno() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const especialista = document.getElementById('especialista').value;

    // Verificar si el paciente ya está registrado
    const pacienteExistente = pacientes.find(
        paciente => paciente.nombre === nombre && paciente.apellido === apellido
    );

    if (pacienteExistente) {
        mostrarNumeroTurno(pacienteExistente.numeroTurno);
    } else {
        // Si el paciente no está registrado, mostrar formulario adicional
        mostrarFormularioRegistro(nombre, apellido, especialista);
    }
}

function mostrarFormularioRegistro(nombre, apellido, especialista) {
    // Obtener el contador correspondiente al especialista
    let contadorTurnos;
    switch (especialista) {
        case 'especialista1':
            contadorTurnos = contadorTurnosEspecialista1;
            break;
        case 'especialista2':
            contadorTurnos = contadorTurnosEspecialista2;
            break;
        // Agrega más casos según la cantidad de especialistas que tengas
        default:
            // Default en caso de que el especialista no esté definido
            contadorTurnos = 1;
    }

    if (contadorTurnos <= 10) {
        Swal.fire({
            title: 'Registro de Paciente',
            html: `<p>Por favor, complete la siguiente información para registrarse:</p>
                  <label for="edad">Edad:</label>
                  <input type="number" id="edad" required>
                  <label for="celular">Número de Celular:</label>
                  <input type="tel" id="celular" required>`,
            showCancelButton: true,
            confirmButtonText: 'Registrarse',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const edad = document.getElementById('edad').value;
                const celular = document.getElementById('celular').value;

                // Asignar número de turno secuencial
                const numeroTurno = contadorTurnos;

                // Incrementar el contador para el siguiente turno
                switch (especialista) {
                    case 'especialista1':
                        contadorTurnosEspecialista1++;
                        break;
                    case 'especialista2':
                        contadorTurnosEspecialista2++;
                        break;
                    // Agrega más casos según la cantidad de especialistas que tengas
                    default:
                        // Default en caso de que el especialista no esté definido
                        contadorTurnos++;
                }

                // Guardar la información del nuevo paciente
                const nuevoPaciente = { nombre, apellido, especialista, edad, celular, numeroTurno };
                pacientes.push(nuevoPaciente);

                // Guardar en localStorage
                localStorage.setItem('pacientes', JSON.stringify(pacientes));

                // Mostrar mensaje de éxito con el número de turno
                mostrarNumeroTurno(numeroTurno);
            }
        });
    } else {
        Swal.fire({
            title: 'Turnos Agotados',
            text: `Lo sentimos, no hay turnos disponibles para el especialista seleccionado.`,
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
    }
}

function mostrarNumeroTurno(numeroTurno) {
    Swal.fire({
        title: '¡Turno Solicitado!',
        text: `Su número de turno es: ${numeroTurno}`,
        icon: 'success',
        confirmButtonText: 'Entendido'
    });
}
