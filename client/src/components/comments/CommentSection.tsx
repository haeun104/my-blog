import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Alert, Avatar, Button, Textarea } from "flowbite-react";
import { Link } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { Comment } from "../../types";
import Loader from "../Loader";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState<string>("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>();
  const [commentLoading, setCommentLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setCommentLoading(true);
      try {
        const response = await fetch(`/api/comment/getComments/${postId}`);
        const data = await response.json();
        if (!response.ok) {
          console.log(data.message);
          setCommentLoading(false);
          return;
        } else {
          setComments(data);
          setCommentLoading(false);
        }
      } catch (error) {
        //@ts-expect-error error type is any
        console.log(error.message);
        setCommentLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCommentError(null);

    if (!comment || comment.length < 3) {
      setCommentError("Comment must contain at least 3 characters");
      return;
    }

    try {
      const response = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: comment,
          userId: currentUser?._id,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setCommentError(data.message);
        return;
      }

      if (response.ok) {
        console.log("Successfully created a comment");
      }
    } catch (error) {
      //@ts-expect-error error type is any
      setCommentError(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {currentUser ? (
        <div className="flex items-center text-sm text-gray-500 gap-2 font-semibold">
          <span>Signed in as:</span>
          <Avatar img={currentUser.profilePicture} rounded size="xs" />
          <Link
            to="/dashboard?tab=profile"
            className="text-blue-500 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-gray-500 font-semibold">
          Sign in first to add a comment !{" "}
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="mt-5 border-2 p-3 rounded-md border-neutral-300"
          onSubmit={handleSubmit}
        >
          <Textarea
            rows={3}
            maxLength={200}
            placeholder="Add a comment..."
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm">
              {200 - comment.length} characters remaining
            </span>
            <Button
              type="submit"
              size="sm"
              gradientDuoTone="greenToBlue"
              outline
            >
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {commentLoading ? (
        <Loader />
      ) : (
        <div className="my-5">
          {comments && comments.length > 0 ? (
            <>
              <div className="flex gap-2 items-center mb-5">
                <p className="text-sm">Comments</p>
                <span className="border-2 py-1 px-2 text-xs rounded-md font-semibold border-gray-300">
                  {comments.length}
                </span>
              </div>
              {comments.map((comment) => (
                <CommentItem comment={comment} key={comment._id} />
              ))}
            </>
          ) : (
            <p className="text-center text-sm">There are no comments yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
