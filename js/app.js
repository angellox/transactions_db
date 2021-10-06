(function () {

    let DB;
    const tbody = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
    });

    // Crea la base de datos de IndexDB
    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);
        crearDB.onerror = function () {
            console.log('Hubo un error');
        };

        crearDB.onsuccess = function () {
            DB = crearDB.result;
            const objectStore = DB.transaction('crm').objectStore('crm');
            objectStore.openCursor().onsuccess = (e) => {
                const cursor = e.target.result;

                if(cursor) {
                    imprimirHTML(cursor);
                }
                
            };
        }

        crearDB.onupgradeneeded = function (e) {
            const db = e.target.result;
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });
        }
    }

    function imprimirHTML(cursor) {
        const { nombre, email, telefono, empresa, id  } = cursor.value;

        // Creando renglones para las tablas
        const tr = document.createElement('TR');

        const td_nombre = document.createElement('TD')
        const td_telefono = document.createElement('TD');
        const td_empresa = document.createElement('TD');
        const td_acciones = document.createElement('TD');

        // Creación de párrafos
        const p_nombre = document.createElement('P');
        const p_email = document.createElement('P');
        const p_telefono = document.createElement('P');
        const p_empresa = document.createElement('P');
        const a_editar = document.createElement('A'); 
        const a_eliminar = document.createElement('A'); 

        p_nombre.classList.add('text-sm', 'leading-5', 'font-medium', 'text-gray-700', 'text-lg', 'font-bold');
        p_email.classList.add('text-sm', 'leading-10', 'text-gray-700');
        p_telefono.classList.add('text-gray-700');
        p_empresa.classList.add('text-gray-600');
        a_editar.classList.add('text-teal-600', 'hover:text-teal-900', 'mr-5');
        a_eliminar.classList.add('text-red-600', 'hover:text-red-900');

        td_nombre.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200');
        td_telefono.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200');
        td_empresa.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200', 'leading-5', 'text-gray-700');
        td_acciones.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200', 'text-sm', 'leading-5');

        p_nombre.textContent = nombre;
        p_email.textContent = email;
        p_telefono.textContent = telefono;
        p_empresa.textContent = empresa;
        a_editar.textContent = "Editar";
        a_eliminar.textContent = "Eliminar";
        a_eliminar.dataset.cliente = id;

        a_editar.href = `editar-cliente.html?id=${id}`;
        a_eliminar.href = "#";

        a_eliminar.onclick = (e) => {
            const idCliente = Number(e.target.dataset.cliente);
            const confirmar = confirm(`¿Desea eliminar al cliente ${nombre}?`);
            
            if(confirmar) {
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idCliente);

                transaction.oncomplete = function() {
                    e.target.parentElement.parentElement.remove();
                    imprimirAlerta('Borrado correctamente');
                };

                transaction.onerror = function() {
                    imprimirAlerta('Hubo un error al borrar', 'error');
                };
            }
        };

        td_nombre.appendChild(p_nombre);
        td_nombre.appendChild(p_email);
        td_telefono.appendChild(p_telefono);
        td_empresa.appendChild(p_empresa);
        td_acciones.appendChild(a_editar);
        td_acciones.appendChild(a_eliminar);
        
        tr.appendChild(td_nombre);
        tr.appendChild(td_telefono);
        tr.appendChild(td_empresa);
        tr.appendChild(td_acciones);

        tbody.appendChild(tr);

        // Iterando por cada elemento
        cursor.continue();
    }

})();