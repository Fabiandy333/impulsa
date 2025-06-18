import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import axios from "axios";
import { create } from "zustand";
import { auth } from "../../firebase.config";

const useAuth = create((set) => {
  const observeAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario Firebase
        localStorage.removeItem("user_pg");
        set({ userLooged: { ...user} });
      } else {
        // Verificar si hay usuario guardado desde base de datos
        const userPG = localStorage.getItem("user_pg");
        if (userPG) {
          set({ userLooged: { ...JSON.parse(userPG)} });
        } else {
          set({ userLooged: null });
        }
      }
    });
  };

  observeAuthState();

  return {
    userLooged: null,

    setUserLooged: (usuario) => set({ userLooged: usuario }),

    loginGoogleWithPopup: async () => {
      try {
        return await signInWithPopup(auth, new GoogleAuthProvider());
      } catch (error) {
        console.error(error);
      }
    },

    loginWithEmail: async (email, password) => {
      try {
        return await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error al iniciar sesión con correo:", error);
        throw error;
      }
    },

    registerWithEmail: async (email, password) => {
      try {
        return await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error al registrar:", error);
        throw error;
      }
    },

    loginFromDatabase: async (email, password) => {
      try {
        const response = await axios.post("http://localhost:43674/api/login", {
          email,
          contraseña: password,
        });
        const usuario = response.data.user;
        set({ userLooged: usuario });
        console.log("Usuario recibido desde backend:", response.data.user);
        localStorage.setItem("user_pg", JSON.stringify(usuario));
        set({ userLooged: usuario });
        return usuario;
      } catch (error) {
        console.error("Error login desde BD:", error);
        throw error.response?.data?.error || "Error desconocido en BD";
      }
    },


    loginWithEmail: async (email, password) => {
      try {
        return await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        throw error.message || "Error en Firebase";
      }
    },

    registerUserIfNotExists: async (email, nombre) => {
    try {
      if (!email || !nombre) {
        console.warn("Datos incompletos para registrar usuario:", { email, nombre });
        return;
      }

      const response = await axios.post("http://localhost:43674/api/usuario", {
        nombre,
        email,
        contraseña: "google-login",
        idRol: 1, // rol por defecto
      });

      console.log("Usuario registrado en BD:", response.data);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("El usuario ya existe en la base de datos.");
      } else {
        console.log("Registro en BD omitido o fallido:", error.message);
      }
    }
  },


    logout: async () => {
      localStorage.removeItem("user_pg"); // limpiar usuario BD

      try {
        await signOut(auth); // cerrar sesión en Firebase si estaba activo
      } catch (_) {}

      set({ userLooged: null });
    },

  };
});

export default useAuth;
