// main.js

document.addEventListener('DOMContentLoaded', function () {
    // Función para mostrar el formulario
    function mostrarFormulario(tipo) {
        // Crear el elemento de formulario
        const formulario = document.createElement('form');
        formulario.id = 'formulario';

        // Crear un elemento de entrada para el nombre
        const inputNombre = document.createElement('input');
        inputNombre.type = 'text';
        inputNombre.placeholder = 'Nombre';
        inputNombre.id = 'nombre';
        formulario.appendChild(inputNombre);

         // Crear un elemento de entrada para el nombre
         const inputApellido = document.createElement('input');
         inputNombre.type = 'text';
         inputNombre.placeholder = 'Apellido';
         inputNombre.id = 'apellido';
         formulario.appendChild(inputApellido);
          // Crear un elemento de entrada para el nombre
        const inputEdad = document.createElement('input');
        inputNombre.type = 'num';
        inputNombre.placeholder = 'edad';
        inputNombre.id = 'edad';
        formulario.appendChild(inputEdad);
         // Crear un elemento de entrada para el nombre
         const inputCelu = document.createElement('input');
         inputNombre.type = 'num';
         inputNombre.placeholder = 'Celular';
         inputNombre.id = 'ceel';
         formulario.appendChild(inputCelu);

        // Crear un botón para enviar el formulario
        const btnEnviar = document.createElement('button');
        btnEnviar.type = 'button';
        btnEnviar.innerText = 'Enviar';
        btnEnviar.addEventListener('click', function () {
            // Obtener el valor del nombre
            const nombre = document.getElementById('nombre').value;

            // Hacer algo con el nombre (puedes agregar más lógica aquí)
            alert(`Hola, ${nombre}! Gracias por registrarte como ${tipo}.`);

            // Ocultar el formulario después de procesar los datos
            document.getElementById('formulario').style.display = 'none';
        });
        formulario.appendChild(btnEnviar);

        // Agregar el formulario al cuerpo del documento
        document.body.appendChild(formulario);
    }

    // Agregar eventos de clic a los botones
    document.getElementById('bocli').addEventListener('click', function () {
        mostrarFormulario('paciente');
    });

    document.getElementById('bocar').addEventListener('click', function () {
        mostrarFormulario('cardiólogo');
    });

    document.getElementById('bora').addEventListener('click', function () {
        mostrarFormulario('radiólogo');
    });
});
