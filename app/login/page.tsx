import React from "react";

export default function Login() {
  return (
    <div className="absolute w-full h-screen overflow-hidden">
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="join">
          <input className="input-xl input join-item" placeholder="Email" />
          <button className="btn btn-xl join-item rounded-r-full">Login</button>
        </div>
      </div>
    </div>
  );
}
