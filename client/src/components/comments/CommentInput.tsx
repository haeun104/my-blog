import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Avatar, Button, Textarea } from "flowbite-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const CommentInput = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState<string>("");

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
        <form className="mt-5 border-2 p-3 rounded-md border-neutral-300">
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
        </form>
      )}
    </div>
  );
};

export default CommentInput;
