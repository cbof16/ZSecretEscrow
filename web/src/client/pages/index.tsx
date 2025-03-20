import React from "react";
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <Head>
        <title>ZSecretEscrow</title>
        <meta name="description" content="Private ZEC escrow with NEAR Intents automation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-teal-500">
          ZSecretEscrow
        </h1>
        <p className="mt-3 text-xl">
          Private ZEC escrow with NEAR Intents automation
        </p>
      </main>
    </div>
  );
};

export default Home;
