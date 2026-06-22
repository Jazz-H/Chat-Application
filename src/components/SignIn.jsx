import React from "react";
import { auth } from "../firebase";

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
  getAuth,
  signInAnonymously,
} from "firebase/auth";

const style = {
  chatbg: ` justify-center mt-40 items-center md:mt-40 h-screen font-bold rounded-md drop-shadow-2xl p-2 `,
  wrapper: `flex flex-col  sm:justify-center mt-5   gap-5 xs:mx-20 sm:items-center sm:flex sm:flex-row sm:justify-center sm:px-50 mt-2 `,
  heading: `text-white drop-shadow-sm shadow-black text-6xl md:mb-10 md:text-67xl lg:text-9xl uppercase `,
  logins: `sm:mt-8 mt-4 m-2 my-4 mb-2`,
  sbutton: ``,
  // guestbtn: `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full`
};

const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
};

const gitHubSignIn = () => {
  const provider = new GithubAuthProvider();
  signInWithRedirect(auth, provider);
};

const guestSignin = () => {
  const auth = getAuth();
  signInAnonymously(auth);
};

const SignIn = () => {
  return (
    <>
      <div className={style.chatbg}>
        <div class="container">
          <div>
            <h1 className={style.heading}>Chat App</h1>
            <hr className="md:mt-6  md:m-15 mt-4 w-45 md:w-25 mx-24 rounded-sm border-2  border-gray-600" />
            <h2 className="text-align:center pt-5 md:mb-10 text-white text-1xl md:text-2xl lg:text-3xl">
              Login with Social Media or as a Guest
            </h2>
          </div>
          <div class="mx-40 m-auto mt-5">
            <button onClick={gitHubSignIn} className=" gh btn rounded-md">
              <img
                class="pr-5"
                src="https://img.icons8.com/nolan/40/github.png"
                alt="GitHub logo"
              />{" "}
              Login with GitHub
            </button>
            <button onClick={googleSignIn} className="google btn rounded-md">
              <img
                class="pr-5"
                src="https://img.icons8.com/color/40/null/google-logo.png"
                alt="Google logo"
              />
              Login with Google
            </button>
            <button onClick={guestSignin} class="guest  btn rounded-md">
              <img
                class="pr-5"
                src="https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/40/null/external-user-interface-kiranshastry-lineal-kiranshastry.png"
                alt="Guest user"
              />
              Login as a Guest
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
