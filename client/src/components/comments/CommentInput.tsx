import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Alert, Avatar, Button, Textarea } from "flowbite-react";
import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";

interface CommentInputProps {
  postId: string;
}

const CommentInput: React.FC<CommentInputProps> = ({ postId }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState<string>("");
  const [commentError, setCommentError] = useState<string | null>(null);

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
    </div>
  );
};

export default CommentInput;
