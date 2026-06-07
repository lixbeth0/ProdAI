import { useState } from "react";
import "./Register.css";

import logo from "../../assets/logo.png";

import { useNavigate } from "react-router-dom";

import {
  auth,
  db
} from "../../firebase/firebase";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // HANDLE INPUTS
  // =========================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });

    setError("");
  };

  // =========================
  // VALIDATION
  // =========================

  const validar = () => {

    if (
      !form.nombre ||
      !form.correo ||
      !form.password ||
      !form.confirmPassword
    ) {

      return "Completa todos los campos";
    }

    if (
      !form.correo.includes("@")
    ) {

      return "Correo inválido";
    }

    if (
      form.password.length < 6
    ) {

      return "La contraseña debe tener al menos 6 caracteres";
    }

    if (
      form.password !==
      form.confirmPassword
    ) {

      return "Las contraseñas no coinciden";
    }

    return "";
  };

  // =========================
  // REGISTER
  // =========================

  const registrar = async (e) => {

    e.preventDefault();

    const errorMsg =
      validar();

    if (errorMsg) {

      setError(errorMsg);
      return;
    }

    try {

      setLoading(true);
      setError("");

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          form.correo,
          form.password
        );

      const user =
        userCredential.user;

      // 🔥 SAVE USER FIRESTORE

      await setDoc(
        doc(db, "users", user.uid),
        {
          nombre: form.nombre,
          correo: form.correo,
          uid: user.uid,
          photo: "",

          carrera: "",
          semestre: "",
          universidad: "",

          tema: "light",

          notificaciones: {
            tareas: true,
            recordatorios: true,
            resumenDiario: false
          },

          academico: {
            metaPromedio: "",
            horasEstudio: "",
            materiaFavorita: ""
          },

          creado: new Date()
        }
      );

      console.log(
        "Usuario creado:",
        user.uid
      );

      navigate("/home");

    } catch (error) {

      console.error(error);

      const errores = {

        "auth/email-already-in-use":
          "Este correo ya está registrado",

        "auth/invalid-email":
          "Correo inválido",

        "auth/weak-password":
          "La contraseña es muy débil",

        "auth/network-request-failed":
          "Error de conexión",

        "auth/operation-not-allowed":
          "Debes activar Email/Password en Firebase"
      };

      setError(
        errores[error.code] ||
        "Error al crear cuenta"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (

    <div className="container">

      <div className="card">

        {/* LOGO */}
        <img
          src={logo}
          alt="ProdAI"
          className="logo"
        />

        <h1 className="title">
          ProdAI
        </h1>

        <p className="subtitle">
          Crear cuenta
        </p>

        {/* TABS */}
        <div className="tabs">

          <button
            className="tab"
            onClick={() =>
              navigate("/")
            }
          >
            Iniciar sesión
          </button>

          <button
            className="tab active"
          >
            Crear cuenta
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={registrar}
        >

          {/* NAME */}
          <label>
            Nombre
          </label>

          <input
            className="input"
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />

          {/* EMAIL */}
          <label>
            Correo
          </label>

          <input
            className="input"
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <label>
            Contraseña
          </label>

          <input
            type="password"
            className="input"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          {/* CONFIRM PASSWORD */}
          <label>
            Confirmar contraseña
          </label>

          <input
            type="password"
            className="input"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {/* ERROR */}
          {error && (
            <p className="error">
              {error}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="button"
            disabled={loading}
          >

            {loading
              ? "Creando..."
              : "Crear cuenta"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;