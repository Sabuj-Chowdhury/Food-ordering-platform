import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import auth from "../firbase/firebase.config";
import AuthContext from "../context/AuthContext";
import useAxiosPublic from "../hooks/useAxiosPublic";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const axiosPublic = useAxiosPublic();

  // create user with email and password
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // sign in with email and password
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // sign in with google
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // update profile
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // log out
  const logOut = async () => {
    setLoading(true);
    return signOut(auth);
  };

  // observer from firebase
  // onAuthStateChange
  // Inside onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Get JWT token
        try {
          const response = await axiosPublic.post("/jwt", {
            email: currentUser.email
          });
          console.log("JWT Response:", response.data); // Debug log
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
          }
        } catch (error) {
          console.error("JWT Error:", error);
          localStorage.removeItem("token");
        }
      } else {
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  // props
  const authInfo = {
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node,
};
