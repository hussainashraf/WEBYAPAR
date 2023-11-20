import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="mt-6 text-3xl font-bold leading-7 text-gray-900">
          In Order to Access Website, Please Login
        </p>
      </div>

      <div className="mt-16">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => loginWithRedirect()}
        >
          Login In
        </button>
      </div>
    </div>
  );
};

export default Login;
