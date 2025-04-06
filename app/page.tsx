import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center my-10 p-4 place-items-center relative h-auto">
      <div className="flex-1 flex flex-col justify-center items-center space-y-10">
        <div className="md:space-y-10 space-y-5">
          <h1 className="md:text-6xl text-4xl font-extrabold text-center leading-snug">
            The Simplest Way to <br /> Send Bulk Emails to Your Audience
          </h1>
          <p className="text-center">
            Reach thousands of customers in just one click — fast, reliable, and
            secure.
          </p>
        </div>

        <div className="mx-auto justify-center items-center mb-10">
          <label className=" gap-x-4 flex md:items-center ">
            <input
              type="checkbox"
              defaultChecked
              disabled
              className="checkbox bg-blue-800 align-top pointer-events-none"
            />
            <span className="">
              Send to unlimited contacts with one submission
            </span>
          </label>
          <label className="my-5 gap-x-4 flex md:items-center align-top ">
            <input
              type="checkbox"
              defaultChecked
              disabled
              className="checkbox align-top pointer-events-none"
            />
            <span className="">
              Powerful email tracking with delivery and open status
            </span>
          </label>
          <label className="my-5 gap-x-4 flex md:items-center">
            <input
              type="checkbox"
              defaultChecked
              disabled
              className="checkbox align-top pointer-events-none"
            />
            <span className="">
              End-to-end encryption and verified sender identity
            </span>
          </label>
        </div>

        <Link
          href="/login"
          className="btn bg-white text-black border-[#e5e5e5]">
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
    </main>
  );
}
