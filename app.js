// =========================
// VARIABLES
// =========================

const formulario = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const lista = document.getElementById("taskList");

const API = "http://10.5.226.74:3000/tareas";

// =========================
// READ - OBTENER TAREAS
// =========================

async function obtenerTareas() {
    try {
        const respuesta = await fetch(API);

        const tareas = await respuesta.json();

        console.log(tareas);

        lista.innerHTML = "";

        tareas.forEach((tarea) => {
            const li = document.createElement("li");

            // TEXTO
            const span = document.createElement("span");
            span.textContent = tarea.titulo;

            // CONTENEDOR BOTONES
            const acciones = document.createElement("div");
            acciones.classList.add("actions");

            // BOTÓN EDITAR
            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("btn-edit");

            btnEditar.addEventListener("click", () => {
                editarTarea(tarea);
            });

            // BOTÓN ELIMINAR
            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.classList.add("btn-delete");

            btnEliminar.addEventListener("click", () => {
                eliminarTarea(tarea.id);
            });

            acciones.appendChild(btnEditar);
            acciones.appendChild(btnEliminar);

            li.appendChild(span);
            li.appendChild(acciones);

            lista.appendChild(li);
        });
    } catch (error) {
        console.error("Error al obtener tareas:", error);
    }
}

obtenerTareas();

// =========================
// CREATE - CREAR
// =========================

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = input.value.trim();

    if (titulo === "") {
        alert("Escribe una tarea");

        return;
    }

    try {
        const respuesta = await fetch(API, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                titulo: titulo,
            }),
        });

        const data = await respuesta.json();

        console.log("Tarea creada:", data);

        input.value = "";

        obtenerTareas();
    } catch (error) {
        console.error("Error al crear:", error);
    }
});

// =========================
// UPDATE - EDITAR
// =========================

async function editarTarea(tarea) {
    const nuevoTitulo = prompt("Editar tarea:", tarea.titulo);

    if (nuevoTitulo === null || nuevoTitulo.trim() === "") {
        return;
    }

    try {
        const respuesta = await fetch(`${API}/${tarea.id}`, {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                titulo: nuevoTitulo,
            }),
        });

        const data = await respuesta.json();

        console.log("Tarea editada:", data);

        obtenerTareas();
    } catch (error) {
        console.error("Error al editar:", error);
    }
}

// =========================
// DELETE - ELIMINAR
// =========================

async function eliminarTarea(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar esta tarea?");

    if (!confirmar) {
        return;
    }

    try {
        await fetch(`${API}/${id}`, {
            method: "DELETE",
        });

        console.log("Tarea eliminada");

        obtenerTareas();
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}
