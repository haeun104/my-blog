import { Link } from "react-router-dom";
import RecentPosts from "../components/posts/RecentPosts";

export default function Home() {
  return (
    <div className="mb-10">
      <div className="bg-[#CDE8E5] dark:bg-teal-600">
        <div className="flex flex-col gap-6 p-32 px-3 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold lg:text-6xl">Discover MY BLOG</h1>
          <p className="text-gray-700 text-sm lg:text-lg dark:text-white">
            Your Portal to Inspiring Travel Stories and Guides
          </p>
          <p className="text-gray-500 text-sm lg:text-lg dark:text-white">
            <Link
              to="/sign-up"
              className="underline text-rose-400 font-semibold"
            >
              Sign up
            </Link>{" "}
            today and enjoy tons of travel tips, stunning photos, and insider
            secrets!
          </p>
          <div>
            <Link
              to="/blog-posts"
              className="text-sm text-teal-500 font-bold hover:underline dark:text-black"
            >
              View all posts
            </Link>
          </div>
        </div>
      </div>
      <RecentPosts />
      <div className="text-center text-teal-500 font-bold text-sm">
        <Link to="/blog-posts" className="hover:underline">
          View all posts
        </Link>
      </div>
    </div>
  );
}
