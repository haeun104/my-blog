import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { Post } from "../types";
import { Button } from "flowbite-react";

const PostDetail = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState<Post>();

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
      <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto gap-4 mt-5 max-w-4xl">
        {post.images && (
          <>
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${post.slug} - photo${index + 1}`}
                className="max-h-[600px]"
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
    </div>
  );
};

export default PostDetail;
