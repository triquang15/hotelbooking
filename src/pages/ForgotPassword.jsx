import React from 'react'
import { useState } from "react";
import OAuth from "../components/OAuth";
import { getAuth, sendPasswordResetEmail} from "firebase/auth";
import {toast} from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  function onChange(e) {
    setEmail(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("We have sent you a link to reset your password.");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  return (
    <section>
    <h1 className="text-3xl text-center mt-6 font-bold">Forgot Your Password?</h1>
    <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
      <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
        <img
          src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80"
          className="w-full rounded-2xl"
        />
      </div>
     
      <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
        <form onSubmit={onSubmit}>
        <p>Enter the username you use to sign into your Booking <br/> Account, which is usually your email address.</p>
        <br/>
          <input
            type="email"
            id="email"
            value={email}
            onChange={onChange}
            placeholder="Email address (*)"
            className="w-full mb-6 rounded-3xl px-4 py-2 text-xl text-gray-700 bg-white"
          />
          <button
            className="w-full bg-sky-800 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-sky-900 transition duration-150 ease-in-out hover:shadow-lg active:bg-sky-1000"
            type="submit"
          >
            SUBMIT
          </button>
          <div className="flex items-center  my-4 before:border-t before:flex-1 before:border-red-300 after:border-t after:flex-1 after:border-red-300">
            <p className="text-center font-semibold mx-4">OR</p>
          </div>
          <OAuth />       
        </form>
      </div>
    </div>
  </section>
);
}

