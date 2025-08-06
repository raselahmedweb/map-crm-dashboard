import { Link } from "react-router";

function NotFound() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-20">404 - Not Found</h1>
      <p className="text-center mt-4 text-gray-600">
        The page you are looking for does not exist.
      </p>
      <div className="flex justify-center mt-8">
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
