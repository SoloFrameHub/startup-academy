import React, { useState } from "react";
import { Link } from "react-router-dom";

import PayBg from "../../images/pay-bg.jpg";
import User from "../../images/user-64-13.jpg";

function Pay() {
  const [card, setCard] = useState(true);

  return (
    <>
      <header className="bg-white dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:border-b border-gray-200 dark:border-gray-700/60">
            {/* Logo */}
            <Link className="block" to="/">
              <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
                <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
              </svg>
            </Link>

            <Link
              className="block rounded-fullbg-gray-400/20 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              to="/ecommerce/cart"
            >
              <span className="sr-only">Back</span>
              <svg width="32" height="32" viewBox="0 0 32 32">
                <path
                  className="fill-current"
                  d="M15.95 14.536l4.242-4.243a1 1 0 111.415 1.414l-4.243 4.243 4.243 4.242a1 1 0 11-1.415 1.415l-4.242-4.243-4.243 4.243a1 1 0 01-1.414-1.415l4.243-4.242-4.243-4.243a1 1 0 011.414-1.414l4.243 4.243z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="grow">
        <div className="relative pt-8">
          <div className="absolute inset-0 bg-gray-800 overflow-hidden" aria-hidden="true">
            <img className="object-cover h-full w-full filter blur-sm opacity-10" src={PayBg} width="460" height="180" alt="Pay background" />
          </div>
          <div className="relative px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
            <img className="rounded-t-xl shadow-lg" src={PayBg} width="460" height="180" alt="Pay background" />
          </div>
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8 pb-8 max-w-lg mx-auto">
          <div className="bg-white dark:bg-gray-800 px-8 pb-6 rounded-b-xl shadow-xs">
            {/* Card header */}
            <div className="text-center mb-6">
              <div className="mb-2">
                <img className="-mt-8 inline-flex rounded-full" src={User} width="64" height="64" alt="User" />
              </div>
              <h1 className="text-xl leading-snug text-gray-800 dark:text-gray-100 font-semibold mb-2">Front-End Learning</h1>
              <div className="text-sm">Learn how to create real web apps using HTML & CSS. Code templates included.</div>
            </div>

            {/* Toggle */}
            <div className="flex justify-center mb-6">
              <div className="relative flex w-full p-1 bg-gray-100 dark:bg-gray-700/30 rounded-sm">
                <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
                  <span
                    className={`absolute inset-0 w-1/2 bg-white dark:bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition ${
                      card ? "translate-x-0" : "translate-x-full"
                    }`}
                  ></span>
                </span>
                <button
                  className={`relative flex-1 text-sm font-medium text-gray-600 p-1 transition ${card ? "dark:text-gray-800" : "dark:text-gray-500"}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCard(true);
                  }}
                >
                  Pay With Card
                </button>
                <button
                  className={`relative flex-1 text-sm font-medium text-gray-600 p-1 transition ${!card ? "dark:text-gray-800" : "dark:text-gray-500"}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCard(false);
                  }}
                >
                  Pay With PayPal
                </button>
              </div>
            </div>

            {/* Card form */}
            {card && (
              <div>
                <div className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="card-nr">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <input id="card-nr" className="form-input w-full" type="text" placeholder="1234 1234 1234 1234" />
                  </div>
                  {/* Expiry and CVC */}
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1" htmlFor="card-expiry">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <input id="card-expiry" className="form-input w-full" type="text" placeholder="MM/YY" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1" htmlFor="card-cvc">
                        CVC <span className="text-red-500">*</span>
                      </label>
                      <input id="card-cvc" className="form-input w-full" type="text" placeholder="CVC" />
                    </div>
                  </div>
                  {/* Name on Card */}
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="card-name">
                      Name on Card <span className="text-red-500">*</span>
                    </label>
                    <input id="card-name" className="form-input w-full" type="text" placeholder="John Doe" />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="card-email">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input id="card-email" className="form-input w-full" type="email" placeholder="john@company.com" />
                  </div>
                </div>
                {/* htmlForm footer */}
                <div className="mt-6">
                  <div className="mb-4">
                    <button className="btn w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">Pay $253.00</button>
                  </div>
                  <div className="text-xs text-gray-500 italic text-center">You'll be charged $253, including $48 for VAT in Italy</div>
                </div>
              </div>
            )}

            {/* PayPal htmlForm */}
            {!card && (
              <div>
                <div>
                  <div className="mb-4">
                    <button className="btn w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">Pay with PayPal - $253.00</button>
                  </div>
                  <div className="text-xs text-gray-500 italic text-center">You'll be charged $253, including $48 for VAT in Italy</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Pay;
