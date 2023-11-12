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

        const horariosOrdenados = especialista.horario.slice().sort();

        Swal.fire({
            title: 'Ingrese su nombre y apellido',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Apellido">',
            focusConfirm: false,
            preConfirm: () => {
                const nombre = document.getElementById('swal-input1').value;
                const apellido = document.getElementById('swal-input2').value;

                return { nombre, apellido, horarios: horariosOrdenados };
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
                const { nombre, apellido, horarioSeleccionado } = result.value;

                if (nombre && apellido && horarioSeleccionado) {
                    reservarCita(especialista, nombre, apellido, horarioSeleccionado);
                } else {
                    Swal.fire('Error', 'Debe ingresar nombre y apellido.', 'error');
                }
            }
        });
    }

    function generarOpcionesHorarios(horarios) {
        const opciones = {};

        horarios.forEach((horario, index) => {
            opciones[horario] = `${index + 1}. ${horario}`;
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
