import Link from "next/link";
import React from "react";
import Image from "next/image";
import { UserButton } from "@stackframe/stack";

function Navbar() {
  return (
    <div className="navbar bg-base-300 rounded-b-2xl opacity-95 shadow-sm">
      <div className="flex-1">
        <Link
          href="/"
          className="items-center sm:text-2xl flex gap-x-1 font-bold">
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
      <div className="gap-x-4">
        <div>
          <UserButton showUserInfo={true} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
