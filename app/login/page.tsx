"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/send");
  };

  return (
    <div className="absolute mt-[-44] w-full h-screen overflow-hidden">
      <div className="relative z-10 flex items-center justify-center h-full p-3">
        <div className="join border rounded-full w-full max-w-xl">
          <input className="input-md md:input-lg input rounded-l-full w-full join-item" placeholder="Email" />
          <button onClick={handleClick} className="btn btn-md md:btn-lg join-item w-28 rounded-r-full">Login</button>
        </div>
      </div>
    </div>
  );
}
