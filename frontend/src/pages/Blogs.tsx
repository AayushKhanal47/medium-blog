import BlogCard from "./../components/BlogCard";

const Blogs = () => {
  return (
    <div className="flex flex-col items-center w-full px-4">
      {[1, 2, 3, 4].map((id) => (
        <div key={id} className="max-w-xl w-full mb-4">
          <BlogCard
            id={id}
            authorName="Aayush Khanal"
            publishedDate="31/07/2025"
            title="Title of Blog here I am going to write a title"
            content="Here is the content of the blog I am going to write the content for this blog"
          />
        </div>
      ))}
    </div>
  );
};

export default Blogs;
