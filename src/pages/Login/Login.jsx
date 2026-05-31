import { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth, db, getGoogleProvider } from "../../firebase/firebase";
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

  // 🔐 LOGIN EMAIL
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

  // 🔵 LOGIN GOOGLE + CLASSROOM
  const loginGoogle = async () => {
    try {
      setLoading(true);

      // 🔥 IMPORTANTE: provider con scopes limpios
      const provider = getGoogleProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // 🔑 TOKEN REAL DE GOOGLE
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      console.log("🔥 TOKEN CLASSROOM:", token);

      // 💾 Guardar usuario en Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          nombre: user.displayName || "Sin nombre",
          correo: user.email,
          photo: user.photoURL || "",
          uid: user.uid,
          provider: "google",
          classroomToken: token
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

        <label>Correo</label>
        <input
          className="input"
          name="correo"
          value={form.correo}
          onChange={handleChange}
        />

        <label>Contraseña</label>
        <input
          type="password"
          className="input"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="error">{error}</p>}

        <button
          className="button"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>

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