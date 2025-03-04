"use client";

export default function AuthPage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="p-6 m-4 rounded-2xl bg-white shadow-lg w-96 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>
        <input
          type="text"
          placeholder="Enter email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          onClick={() => {}}
        >
          {isSignin ? "Sign In" : "Sign Up"}
        </button>
        <p className="text-gray-600 mt-4 text-sm">
          {isSignin ? "Don't have an account? " : "Already have an account? "}
          <a href="#" className="text-blue-600 hover:underline">
            {isSignin ? "Sign Up" : "Sign In"}
          </a>
        </p>
      </div>
    </div>
  );
}