import React from "react";
import type { NextPage } from 'next';
import Head from 'next/head';

const Stealth: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <Head>
        <title>ZSecretEscrow Dashboard</title>
        <meta name="description" content="Stealth dashboard for ZSecretEscrow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-teal-500">
          ZSecretEscrow
        </h1>
        <h2 className="mt-6 text-2xl">
          Stealth Dashboard
        </h2>
      </main>
    </div>
  );
};

export default Stealth;
