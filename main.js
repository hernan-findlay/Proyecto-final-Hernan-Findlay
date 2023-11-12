document.addEventListener('DOMContentLoaded', function () {
    
    fetch('./especialistas.json')
        .then(response => response.json())
        .then(data => {
            const especialistas = data;
            generarEspecialistas(especialistas);
        })
        .catch(error => console.error('Error al cargar datos:', error));

    const horariosPorEspecialista = {
        "Clinico": ["10", "10:30", "11", "11:30", "12", "12:30", "13", "13:30", "14", "14:30", "15", "15:30", "16"],
        "Cardiologo": ["16", "16:30", "17", "17:30", "18", "18:30", "19", "19:30", "20", "20:30", "21", "21:30", "22"],
        "Rayos": ["20", "20:30", "21", "21:30", "22", "22:30", "23", "23:30", "24"]
    };

    function generarEspecialistas(especialistas) {
        const main = document.getElementById('main');
        const section = document.createElement('section');

        especialistas.forEach(especialista => {
            const div = document.createElement('div');
            const img = document.createElement('img');
            const divInfo = document.createElement('div');
            const h2 = document.createElement('h2');
            const button = document.createElement('button');

            img.src = `./assets.img/img/${especialista.nombre.toLowerCase()}.jpg`;
            img.alt = especialista.nombre;
            h2.textContent = especialista.nombre;
            button.id = `bot${especialista.nombre.toLowerCase()}`;
            button.textContent = 'Reservar';

            button.addEventListener('click', () => mostrarFormulario(especialista));

            div.appendChild(img);
            div.appendChild(divInfo);
            divInfo.appendChild(h2);
            divInfo.appendChild(button);

            section.appendChild(div);
        });

        main.appendChild(section);
    }

    function mostrarFormulario(especialista) {
        if (especialista.reservado) {
            Swal.fire('Error', 'Ya ha realizado una reserva para este especialista.', 'error');
            return;
        }

        const horariosOrdenados = horariosPorEspecialista[especialista.nombre].slice().sort();

        const form = document.createElement('form');
        form.innerHTML = `
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required>
            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" required>
            <label for="horario">Seleccionar horario:</label>
            <select id="horario" name="horario" required>
                ${generarOpcionesHorariosSelect(horariosOrdenados)}
            </select>
        `;

        Swal.fire({
            title: 'Ingrese su nombre y apellido',
            html: form,
            showCancelButton: true,
            confirmButtonText: 'Reservar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombre = document.getElementById('nombre').value;
                const apellido = document.getElementById('apellido').value;
                const horarioSeleccionado = document.getElementById('horario').value;

                return { nombre, apellido, horarioSeleccionado };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { nombre, apellido, horarioSeleccionado } = result.value;

                if (nombre && apellido && horarioSeleccionado) {
                    reservarCita(especialista, nombre, apellido, horarioSeleccionado);
                } else {
                    Swal.fire('Error', 'Debe completar todos los campos.', 'error');
                }
            }
        });
    }

    function generarOpcionesHorariosSelect(horarios) {
        return horarios.map(horario => `<option value="${horario}">${horario}</option>`).join('');
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
