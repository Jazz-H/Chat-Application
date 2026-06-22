import React, { useState } from "react";
import { auth } from "../firebase";

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
  signInAnonymously,
} from "firebase/auth";

const style = {
  chatbg: `justify-center mt-40 items-center md:mt-40 h-screen font-bold rounded-md drop-shadow-2xl p-2`,
  heading: `text-white drop-shadow-sm shadow-black text-6xl md:mb-10 md:text-7xl lg:text-9xl uppercase`,
  logins: `sm:mt-8 mt-4 m-2 my-4 mb-2`,
  error: `mx-auto mt-4 max-w-sm rounded-md bg-red-500/80 px-4 py-2 text-white`,
};

const SignIn = () => {
  const [error, setError] = useState("");

  const runSignIn = async (fn) => {
    setError("");
    try {
      await fn();
    } catch (err) {
      console.error("Sign-in failed:", err);
      setError("Sign-in failed. Please try again.");
    }
  };

  const googleSignIn = () =>
    runSignIn(() => signInWithRedirect(auth, new GoogleAuthProvider()));

  const gitHubSignIn = () =>
    runSignIn(() => signInWithRedirect(auth, new GithubAuthProvider()));

  const guestSignIn = () => runSignIn(() => signInAnonymously(auth));

  return (
    <div className={style.chatbg}>
      <div className="container">
        <div>
          <h1 className={style.heading}>Chat App</h1>
          <hr className="md:mt-6 md:m-15 mt-4 w-45 md:w-25 mx-24 rounded-sm border-2 border-gray-600" />
          <h2 className="text-center pt-5 md:mb-10 text-white text-1xl md:text-2xl lg:text-3xl">
            Login with Social Media or as a Guest
          </h2>
        </div>

        {error && <p className={style.error}>{error}</p>}

        <div className="mx-40 m-auto mt-5">
          <button onClick={gitHubSignIn} className="gh btn rounded-md">
            <img
              className="pr-5"
              src="https://img.icons8.com/nolan/40/github.png"
              alt="GitHub logo"
            />{" "}
            Login with GitHub
          </button>
          <button onClick={googleSignIn} className="google btn rounded-md">
            <img
              className="pr-5"
              src="https://img.icons8.com/color/40/null/google-logo.png"
              alt="Google logo"
            />
            Login with Google
          </button>
          <button onClick={guestSignIn} className="guest btn rounded-md">
            <img
              className="pr-5"
              src="https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/40/null/external-user-interface-kiranshastry-lineal-kiranshastry.png"
              alt="Guest user"
            />
            Login as a Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
