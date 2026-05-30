import { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth, db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  // 🔐 Login con email y password
  const login = async () => {
    if (!form.correo || !form.password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        form.correo,
        form.password
      );

      navigate("/home");

    } catch (error) {
      const errores = {
        "auth/user-not-found": "Usuario no encontrado",
        "auth/wrong-password": "Contraseña incorrecta",
        "auth/invalid-email": "Correo inválido",
        "auth/invalid-credential": "Credenciales incorrectas"
      };

      setError(errores[error.code] || "Error al iniciar sesión");

    } finally {
      setLoading(false);
    }
  };

  // 🔵 Login con Google
  const loginGoogle = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔥 Guardar usuario en Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          nombre: user.displayName || "Sin nombre",
          correo: user.email,
          photo: user.photoURL || "",
          uid: user.uid
        },
        { merge: true }
      );

      navigate("/home");

    } catch (error) {
      console.error(error);
      setError("Error con Google");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">

        <img src={logo} alt="Logo" className="logo" />

        <h1 className="title">ProdAI</h1>
        <p className="subtitle">Bienvenido</p>

        <div className="tabs">
          <button className="tab active">
            Iniciar sesión
          </button>

          <button
            className="tab"
            onClick={() => navigate("/register")}
          >
            Crear cuenta
          </button>
        </div>

        {/* Email */}
        <label>Correo</label>
        <input
          className="input"
          name="correo"
          value={form.correo}
          onChange={handleChange}
          placeholder="ejemplo@gmail.com"
        />

        {/* Password */}
        <label>Contraseña</label>
        <input
          type="password"
          className="input"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
        />

        {/* Error */}
        {error && <p className="error">{error}</p>}

        {/* Login button */}
        <button
          className="button"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>

        {/* Google login */}
        <button
          className="google-btn"
          onClick={loginGoogle}
          disabled={loading}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="google"
          />
          Continuar con Google
        </button>

      </div>
    </div>
  );
}