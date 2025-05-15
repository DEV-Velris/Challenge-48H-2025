'use client'

import React from 'react';
import {signIn} from "next-auth/react";

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col pt-16">
      <button onClick={() => signIn("google")}>Login</button>
    </div>
  );
};

export default Home;
