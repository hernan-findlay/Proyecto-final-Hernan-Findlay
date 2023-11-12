/* document.addEventListener("DOMContentLoaded", function () {
    const formularioContainer = document.getElementById("formulario-container");

    function mostrarFormulario(tipo) {
        const formHTML = `
            <form id="${tipo}-form">
                <label for="${tipo}-nombre">Nombre:</label>
                <input type="text" id="${tipo}-nombre" required>

                <label for="${tipo}-apellido">Apellido:</label>
                <input type="text" id="${tipo}-apellido" required>

                ${tipo === 'registro' ? `
                    <label for="${tipo}-celular">Celular:</label>
                    <input type="text" id="${tipo}-celular" required>

                    <label for="${tipo}-direccion">Dirección:</label>
                    <input type="text" id="${tipo}-direccion" required>
                ` : ''}
                
                <button type="submit">Enviar</button>
            </form>
        `;

        formularioContainer.innerHTML = formHTML;

        const formElement = document.getElementById(`${tipo}-form`);
        formElement.addEventListener('submit', function (event) {
            event.preventDefault();
            const nombre = document.getElementById(`${tipo}-nombre`).value;
            const apellido = document.getElementById(`${tipo}-apellido`).value;

            if (tipo === 'registro') {
                const celular = document.getElementById(`${tipo}-celular`).value;
                const direccion = document.getElementById(`${tipo}-direccion`).value;

                // Verificar si el paciente ya existe antes de registrar
                if (!existePaciente(nombre, apellido)) {
                    // Registrar en el localStorage
                    registrarPaciente(nombre, apellido, celular, direccion);

                    Swal.fire({
                        icon: 'success',
                        title: 'Registro Exitoso',
                        text: `¡Bienvenido, ${nombre} ${apellido}!`,
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Registro',
                        text: `El paciente ${nombre} ${apellido} ya está registrado.`,
                    });
                }
            } else {
                // Aquí puedes realizar acciones con la información de inicio de sesión
                // Por ejemplo, verificar en el localStorage, base de datos, etc.

                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de Sesión Exitoso',
                    text: `¡Hola, ${nombre} ${apellido}!`,
                });
            }

            // Limpiar el formulario después de procesar los datos
            formElement.reset();
        });
    }

    // Función para verificar si un paciente ya existe
    function existePaciente(nombre, apellido) {
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || {};
        return pacientes.hasOwnProperty(nombre + ' ' + apellido);
    }

    // Función para registrar un paciente en el localStorage
    function registrarPaciente(nombre, apellido, celular, direccion) {
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || {};
        pacientes[nombre + ' ' + apellido] = { nombre, apellido, celular, direccion };
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
    }

    document.getElementById("inicioSesion").addEventListener("click", function () {
        mostrarFormulario('inicioSesion');
    });

    document.getElementById("registro").addEventListener("click", function () {
        mostrarFormulario('registro');
    });

    document.getElementById("bocli").addEventListener("click", function () {
        solicitarTurno('Clínico');
    });

    document.getElementById("bocar").addEventListener("click", function () {
        solicitarTurno('Cardiologo');
    });

    document.getElementById("bora").addEventListener("click", function () {
        solicitarTurno('Rayos');
    });

    function solicitarTurno(especialidad) {
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || {};
        const turnos = pacientes[especialidad] || [];

        if (turnos.length < 10) {
            const numeroTurno = turnos.length + 1;

            // Puedes asociar el turno con el paciente aquí si es necesario
            // Por ejemplo, podrías guardar el turno en el registro del paciente

            Swal.fire({
                icon: 'success',
                title: 'Turno Solicitado',
                text: `Se ha asignado el turno número ${numeroTurno} para ${especialidad}.`
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'No hay más turnos disponibles',
                text: 'Lo sentimos, no hay más turnos disponibles para esta especialidad.'
            });
        }
    }
});
 */
document.addEventListener('DOMContentLoaded', function () {
    // Cargar datos desde el archivo JSON local
    fetch('./especialistas.json')
        .then(response => response.json())
        .then(data => {
            const especialistas = data;
            generarEspecialistas(especialistas);
        })
        .catch(error => console.error('Error al cargar datos:', error));

    function generarEspecialistas(especialistas) {
        const main = document.getElementById('main');
        const section = document.createElement('section');

        especialistas.forEach(especialista => {
            const div = document.createElement('div');
            const img = document.createElement('img');
            const divInfo = document.createElement('div');
            const h2 = document.createElement('h2');
            const button = document.createElement('button');

            img.src = `./assets/img/${especialista.nombre.toLowerCase()}.jpg`;
            img.alt = especialista.nombre;
            h2.textContent = especialista.nombre;
            button.id = `bot${especialista.nombre.toLowerCase()}`;
            button.textContent = 'Reservar';

            button.addEventListener('click', () => mostrarHorarios(especialista));

            div.appendChild(img);
            div.appendChild(divInfo);
            divInfo.appendChild(h2);
            divInfo.appendChild(button);

            section.appendChild(div);
        });

        main.appendChild(section);
    }

    function mostrarHorarios(especialista) {
        if (especialista.reservado) {
            Swal.fire('Error', 'Ya ha realizado una reserva para este especialista.', 'error');
            return;
        }

        const horariosOrdenados = especialista.horario.slice().sort((a, b) => parseInt(a) - parseInt(b));

        Swal.fire({
            title: 'Ingrese su nombre y apellido',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Apellido">',
            focusConfirm: false,
            preConfirm: () => {
                const nombre = document.getElementById('swal-input1').value;
                const apellido = document.getElementById('swal-input2').value;

                return { nombre, apellido };
            },
            showCancelButton: true,
            confirmButtonText: 'Reservar',
            cancelButtonText: 'Cancelar',
            input: 'select',
            inputOptions: generarOpcionesHorarios(horariosOrdenados),
            inputPlaceholder: 'Seleccionar horario',
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value !== '') {
                        resolve();
                    } else {
                        resolve('Debe seleccionar un horario');
                    }
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { nombre, apellido } = result.value;

                if (nombre && apellido) {
                    const horarioSeleccionado = result.value;
                    reservarCita(especialista, nombre, apellido, horarioSeleccionado);
                } else {
                    Swal.fire('Error', 'Debe ingresar nombre y apellido.', 'error');
                }
            }
        });
    }

    function generarOpcionesHorarios(horarios) {
        const opciones = {};

        horarios.forEach(horario => {
            opciones[horario] = horario;
        });

        return opciones;
    }

    function reservarCita(especialista, nombre, apellido, horarioSeleccionado) {
        especialista.reservado = true;

        const cita = {
            nombre: `${nombre} ${apellido}`,
            especialista: especialista.nombre,
            horario: horarioSeleccionado
        };

        const citasGuardadas = JSON.parse(localStorage.getItem('citas')) || [];
        citasGuardadas.push(cita);
        localStorage.setItem('citas', JSON.stringify(citasGuardadas));

        Swal.fire({
            title: '¡Cita reservada!',
            html: `Su cita con ${especialista.nombre} está programada para las ${horarioSeleccionado}.<br>Nombre: ${nombre} ${apellido}`,
            icon: 'success'
        });
    }
});
