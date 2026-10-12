import { useState, useEffect } from "react";
import "./App.css";

// Misma API que la versión anterior
const API_URL = "http://localhost:3001/personas";

const FORM_INICIAL = {
  tipo_documento: "cedula",
  documento: "",
  nombre: "",
  apellido: "",
  correo: "",
  celular: "",
  fecha_nacimiento: "",
};

function RegistroPersonas() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [personas, setPersonas] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    cargarPersonas();
  }, []);

  async function cargarPersonas() {
    const res = await fetch(API_URL);
    const data = await res.json();
    setPersonas(data);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function buscarPorDocumento(tipo, numero) {
    if (numero === "") {
      setEditingId(null);
      return;
    }

    const encontrada = personas.find(
      (p) => p.tipo_documento === tipo && p.documento === numero
    );

    if (encontrada) {
      setForm({ ...encontrada });
      setEditingId(encontrada.id);
    } else {
      setEditingId(null);
    }
  }

  function handleTipoChange(e) {
    handleChange(e);
    buscarPorDocumento(e.target.value, form.documento);
  }

  function handleDocumentoChange(e) {
    handleChange(e);
    buscarPorDocumento(form.tipo_documento, e.target.value);
  }

  async function handleGuardar(e) {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    await cargarPersonas();
    limpiarFormulario();
  }

  function cargarEnFormulario(persona) {
    setForm({ ...persona });
    setEditingId(persona.id);
  }

  async function handleActualizar() {
    if (editingId === null) return;

    await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    await cargarPersonas();
    limpiarFormulario();
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm(
      "¿Realmente deseas eliminar esta persona?"
    );

    if (!confirmar) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    await cargarPersonas();

    if (editingId === id) {
      limpiarFormulario();
    }
  }

  function limpiarFormulario() {
    setForm(FORM_INICIAL);
    setEditingId(null);
  }

  return (
    <div className="ficha">
      <div className="ficha-header">
        <span className="ficha-sello">ID</span>
        <h1>Registro de personas</h1>
      </div>

      <form className="ficha-form" onSubmit={handleGuardar}>
        <div className="campo">
          <label htmlFor="tipo_documento">Tipo de documento</label>
          <select
            id="tipo_documento"
            name="tipo_documento"
            value={form.tipo_documento}
            onChange={handleTipoChange}
          >
            <option value="cedula">Cédula</option>
            <option value="tarjeta_identidad">Tarjeta de identidad</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="documento">Número de documento</label>
          <input
            type="number"
            id="documento"
            name="documento"
            value={form.documento}
            onChange={handleDocumentoChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
          />
        </div>

        <div className="campo campo-ancho">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={form.correo}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="celular">Celular</label>
          <input
            type="number"
            id="celular"
            name="celular"
            value={form.celular}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
          />
        </div>

        <div className="ficha-acciones">
          <button type="submit" disabled={editingId !== null}>
            Guardar
          </button>
          <button
            type="button"
            disabled={editingId === null}
            onClick={handleActualizar}
          >
            Actualizar
          </button>
          <button
            type="button"
            className="boton-eliminar"
            disabled={editingId === null}
            onClick={() => handleEliminar(editingId)}
          >
            Eliminar
          </button>
        </div>
      </form>

      <h2 className="ficha-subtitulo">Libro de registro</h2>

      <table className="ficha-tabla">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Documento</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Celular</th>
            <th>Nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {personas.map((persona) => (
            <tr key={persona.id}>
              <td>{persona.tipo_documento}</td>
              <td>{persona.documento}</td>
              <td>{persona.nombre}</td>
              <td>{persona.apellido}</td>
              <td>{persona.correo}</td>
              <td>{persona.celular}</td>
              <td>{persona.fecha_nacimiento}</td>
              <td>
                <button
                  type="button"
                  onClick={() => cargarEnFormulario(persona)}
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  className="boton-eliminar"
                  onClick={() => handleEliminar(persona.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegistroPersonas;
