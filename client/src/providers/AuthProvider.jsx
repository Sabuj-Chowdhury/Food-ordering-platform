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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const response = await axiosPublic.post("/jwt", {
            email: currentUser.email,
            uid: currentUser.uid,
          });

          if (response.data.token) {
            localStorage.setItem("token", response.data.token);

            // Save user info if displayName/photoURL is available
            if (currentUser.displayName || currentUser.photoURL) {
              const userInfo = {
                email: currentUser.email,
                displayName: currentUser.displayName || "Unnamed User",
                photoURL: currentUser.photoURL || "",
              };

              try {
                await axiosPublic.post("/users", userInfo);
              } catch (userError) {
                console.error("User info save error:", userError.message);
              }
            }
          } else {
            console.error("No token from server");
            localStorage.removeItem("token");
          }
        } catch (err) {
          console.error("JWT error:", err.message);
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
