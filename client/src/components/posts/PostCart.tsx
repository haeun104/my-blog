import { Link } from "react-router-dom";
import { Post } from "../../types";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="w-full h-[400px] sm:w-[350px] border border-teal-500 rounded-lg overflow-hidden group relative">
      {post.images ? (
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.images[0]}
            alt="post image"
            className="h-[250px] w-full group-hover:h-[200px] transition-all duration-300 z-20"
          />
        </Link>
      ) : (
        <Link to={`/post/${post.slug}`}>
          <div className="h-[250px] w-full group-hover:h-[200px] transition-all duration-300 z-20 bg-gray-300">
            No Image
          </div>
        </Link>
      )}
      <div className="p-4 flex flex-col gap-2">
        <h4 className="font-semibold text-lg line-clamp-2">{post.title}</h4>
        <span className="text-sm italic">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="m-2 text-center absolute -bottom-80 group-hover:bottom-0 group-hover:left-0 group-hover:right-0 py-2 text-teal-500 border border-teal-500 rounded-md rounded-t-none hover:bg-teal-500 hover:text-white transition-all duration-300 z-10"
        >
          Read more
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
