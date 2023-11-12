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

// main.js

document.addEventListener("DOMContentLoaded", function () {
    const inicioSesionBtn = document.getElementById("inicioSesion");
    const registroBtn = document.getElementById("registro");

    inicioSesionBtn.addEventListener("click", function () {
        const usuarioLogueado = /* Lógica para comprobar si el usuario está logueado */ false;

        if (usuarioLogueado) {
            // El usuario ya está logueado, puedes redirigir a otra página o mostrar un mensaje
            Swal.fire('Ya has iniciado sesión', '', 'info');
        } else {
            // El usuario no está logueado, muestra el formulario de inicio de sesión
            mostrarFormularioInicioSesion();
        }
    });

    registroBtn.addEventListener("click", function () {
        // Muestra el formulario de registro
        mostrarFormularioRegistro();
    });

    // Nueva función para mostrar los especialistas
    function mostrarEspecialistas() {
        const especialistas = [
            { nombre: "Clínico", turno: 0 },
            { nombre: "Cardiólogo", turno: 0 },
            { nombre: "Radiólogo", turno: 0 }
        ];

        // Crear y agregar cartas para cada especialista
        especialistas.forEach((especialista, index) => {
            const carta = document.createElement("div");
            carta.classList.add("especialista-card");

            const contenidoCarta = `
                <h3>${especialista.nombre}</h3>
                <p id="turno${index}">Turno: ${especialista.turno}</p>
                <button id="seleccionarTurno${index}">Seleccionar Turno</button>
            `;

            carta.innerHTML = contenidoCarta;

            // Agregar la carta al documento
            document.getElementById("main").appendChild(carta);

            // Agregar un evento al botón de cada especialista
            document.getElementById(`seleccionarTurno${index}`).addEventListener("click", function () {
                const nombrePaciente = obtenerNombrePaciente(); // Reemplaza esto con la lógica real para obtener el nombre del paciente
                if (nombrePaciente) {
                    asignarTurnoPaciente(especialista, nombrePaciente);
                } else {
                    Swal.fire('Error', 'Debes ingresar un nombre para asignar un turno', 'error');
                }
            });
        });
    }

    function asignarTurnoPaciente(especialista, nombrePaciente) {
        // Incrementar el turno automáticamente
        especialista.turno++;
        
        // Actualizar el texto del turno en la interfaz
        const turnoElement = document.getElementById(`turno${especialista.turno}`);
        turnoElement.innerText = `Turno para ${nombrePaciente}: ${especialista.turno}`;

        // Mostrar mensaje de éxito
        Swal.fire(`Turno asignado para ${nombrePaciente} con ${especialista.nombre}: ${especialista.turno}`, '', 'success');
    }

    function mostrarFormularioInicioSesion() {
        Swal.fire({
            title: 'Inicio de Sesión',
            html:
                '<input type="text" id="nombre" class="swal2-input" placeholder="Nombre">' +
                '<input type="text" id="apellido" class="swal2-input" placeholder="Apellido">',
            showCancelButton: true,
            confirmButtonText: 'Iniciar Sesión',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#nombre').value;
                const apellido = Swal.getPopup().querySelector('#apellido').value;

                // Lógica para autenticar al usuario y asignar un turno
                const usuarioAutenticado = autenticarUsuario(nombre, apellido);

                if (usuarioAutenticado) {
                    // Asignar turno al usuario
                    asignarTurnoPaciente(usuarioAutenticado.especialista, nombre);
                    Swal.fire('Inicio de sesión exitoso', `Turno asignado: ${usuarioAutenticado.turno}`, 'success');
                } else {
                    Swal.fire('Nombre o Apellido incorrectos', '', 'error');
                }
            }
        });
    }

    function obtenerNombrePaciente() {
        // Esta función debe ser remplazada con la lógica real para obtener el nombre del paciente al iniciar sesión.
        // Puedes utilizar un campo de texto en el formulario o cualquier otro método de entrada.
        return 'John Doe'; // Ejemplo, reemplaza esto con la lógica real
    }

    // Resto del código...

    // Mostrar los especialistas al cargar la página
    mostrarEspecialistas();
});




















/* 
document.addEventListener("DOMContentLoaded", function () {
    // Función para mostrar el formulario de inicio de sesión
    function mostrarFormularioInicioSesion() {
        return Swal.fire({
            title: 'Inicio de Sesión',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Apellido">',
            focusConfirm: false,
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#swal-input1').value;
                const apellido = Swal.getPopup().querySelector('#swal-input2').value;
                return { nombre, apellido };
            }
        });
    }

    // Función para mostrar el formulario de registro
    function mostrarFormularioRegistro() {
        return Swal.fire({
            title: 'Registro',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Apellido">' +
                '<input id="swal-input3" class="swal2-input" placeholder="Celular">' +
                '<input id="swal-input4" class="swal2-input" placeholder="Dirección">',
            focusConfirm: false,
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#swal-input1').value;
                const apellido = Swal.getPopup().querySelector('#swal-input2').value;
                const celular = Swal.getPopup().querySelector('#swal-input3').value;
                const direccion = Swal.getPopup().querySelector('#swal-input4').value;

                // Guardar en el almacenamiento local
                const pacientes = JSON.parse(localStorage.getItem('pacientes')) || {};
                pacientes[nombre + apellido] = { nombre, apellido, celular, direccion };
                localStorage.setItem('pacientes', JSON.stringify(pacientes));

                return { nombre, apellido, celular, direccion };
            }
        });
    }

    // Función para mostrar botones después de autenticar
    function mostrarBotonesDespuesDeAutenticar() {
        // Aquí puedes mostrar o habilitar los botones adicionales después de autenticar
        console.log('Usuario autenticado');
    }

    // Event listener para el botón de inicio de sesión
    document.getElementById("inicioSesion").addEventListener("click", function () {
        mostrarFormularioInicioSesion().then((result) => {
            if (result.value) {
                // ... (código existente)
                mostrarBotonesDespuesDeAutenticar();
            }
        });
    });

    // Event listener para el botón de registro
    document.getElementById("registro").addEventListener("click", function () {
        mostrarFormularioRegistro().then((result) => {
            if (result.value) {
                // ... (código existente)
                mostrarBotonesDespuesDeAutenticar();
            }
        });
    });

    // Otras funciones y lógica de tu aplicación pueden ir aquí
});

 */