export default function SignIn() {
  return (
    <div className="background-signin">
      <div className="flex h-screen items-center justify-start text-white">
        <div className="ml-[5%] mb-[15%] p-8 bg-gray-800 rounded-lg shadow-lg w-[400px]">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="p-2 rounded text-black"
            />
            <input
              type="password"
              placeholder="Password"
              className="p-2 rounded text-black"
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
