import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";

const Appbar = () => {
  return (
    <header className="border-b shadow-sm bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/blogs"
          className="text-2xl font-bold text-gray-800 hover:text-black transition">
          Medium
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/publish">
            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-full text-sm px-5 py-2 transition-all shadow-sm">
              New
            </button>
          </Link>

          <Avatar size="big" name="aayush" />
        </div>
      </div>
    </header>
  );
};

export default Appbar;
