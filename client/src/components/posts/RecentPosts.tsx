import { useEffect, useState } from "react";
import { Post } from "../../types";
import PostCard from "./PostCard";

const RecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>();

  //Fetch 3 recent posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch(`/api/post/getPosts?limit=3`);
        const data = await response.json();
        if (response.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        //@ts-expect-error error type is any
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  return (
    <div className="p-5">
      <h3 className="text-center font-semibold text-xl mb-5">Recent Posts</h3>
      {!recentPosts || recentPosts.length === 0 ? (
        <p className="text-center">There are no posts yet</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPosts;
