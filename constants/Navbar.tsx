import Link from "next/link";
import React from "react";
import Image from "next/image";

function Navbar() {
  return (
    <div className="navbar bg-base-300 rounded-b-2xl opacity-95 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="items-center sm:text-2xl flex gap-x-1 font-bold">
          {" "}
          <Image
            width="50"
            height="50"
            src="/icon.png"
            alt="Coinbase Logo"
            className="sm:w-15 w-7 h-7 sm:h-15 rotate-180"
          />
          JetSender
        </Link>
      </div>
      <div className="flex-none">
        
        <Link href="/login" className="btn bg-white text-black border-[#e5e5e5]">
          <svg
            aria-label="Email icon"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="black">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </g>
          </svg>
          Login with Email
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
