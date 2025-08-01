import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: number;
}

const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="p-6 border-b border-gray-200 w-full max-w-screen-md mx-auto hover:bg-gray-50 transition rounded-lg cursor-pointer">
        <div className="flex items-center mb-2">
          <Avatar name={authorName} />
          <div className="ml-3 text-sm text-gray-700 flex items-center space-x-2">
            <span>{authorName}</span>
            <Circle />
            <span className="text-gray-500">{publishedDate}</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-1">{title}</h2>

        <p className="text-gray-600 text-sm line-clamp-2">
          {content.slice(0, 150) + (content.length > 150 ? "..." : "")}
        </p>

        <div className="text-gray-400 text-xs mt-3">
          {`${Math.ceil(content.length / 100)} minute(s) read`}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;

export function Circle() {
  return <div className="h-1 w-1 bg-gray-400 rounded-full"></div>;
}

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-blue-4 00 text-white font-medium ${
        size === "small" ? "w-6 h-6 text-xs" : "w-10 h-10 text-lg"
      }`}>
      {name[0]?.toUpperCase()}
    </div>
  );
}
