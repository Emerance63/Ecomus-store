import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="mt-4 text-gray-600">
        Page not found.
      </p>

      <Link
        to="/"
        className="mt-6 bg-black text-white px-5 py-3 rounded"
      >
        Back Home
      </Link>
    </div>
  );
}

export default NotFound;