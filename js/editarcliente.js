(function() {

    // Variables globales
    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        // Actualiza el registro
        formulario.addEventListener('submit', actualizarCliente);

        // Verificar el ID de la URL
        idCliente = new URLSearchParams(window.location.search).get('id');

        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);    
            }, 100);
        }
    });

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);
    
        abrirConexion.onerror = function() {
            console.log('Hubo un error al cargar la DB');
        }
    
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }
    };

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }

    function actualizarCliente(e) {
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput === ''){
            imprimirAlerta('Todos los cambios son obligatorios', 'error');
            return;
        }
        
        // Actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
        };

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);
        
        transaction.oncomplete = () => {
            imprimirAlerta('Editado correctamente');

            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        };

        transaction.onerror = () => {
            imprimirAlerta('Hubo un error', 'error');
        }    
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

})();