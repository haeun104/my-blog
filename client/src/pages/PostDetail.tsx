import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { Post } from "../types";
import { Button } from "flowbite-react";
import CommentSection from "../components/comments/CommentSection";
import PostCard from "../components/posts/PostCart";

const PostDetail = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState<Post>();
  const [recentPosts, setRecentPosts] = useState<Post[]>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post/getPosts?slug=${postSlug}`);
        const data = await response.json();
        if (!response.ok) {
          console.log(data.message);
        } else {
          setPost(data.posts[0]);
        }
      } catch (error) {
        //@ts-expect-error error type is any
        console.log(error.message);
      }
    };
    fetchPost();
  }, [postSlug]);

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

  if (!post) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-3 flex flex-col">
      <h1 className="text-2xl md:text-3xl lg:text-4xl text-center font-semibold">
        {post.title}
      </h1>
      <Link
        to={`/search?category=${post.category}`}
        className="self-center mt-5"
      >
        <Button pill color="gray" size="sm">
          {post.category}
        </Button>
      </Link>
      <div
        className={`grid grid-cols-1 ${
          post.images && post.images.length > 1 && "lg:grid-cols-2"
        } mx-auto gap-4 mt-5 max-w-4xl} ${
          post.images &&
          post.images.length % 2 === 1 &&
          "lg:[&>:last-child]:col-span-2"
        }`}
      >
        {post.images && (
          <>
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${post.slug} - photo${index + 1}`}
                className="max-h-[600px] mx-auto"
              />
            ))}
          </>
        )}
      </div>
      <div className="text-sm flex justify-between py-3 border-b max-w-4xl mx-auto w-full">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{(post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div
        className="max-w-4xl mx-auto my-5 post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      <CommentSection postId={post._id} />
      <div className="my-5">
        <h3 className="text-center font-semibold text-2xl mb-5">
          Recent Posts
        </h3>
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
    </div>
  );
};

export default PostDetail;
