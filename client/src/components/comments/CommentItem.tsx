import { useEffect, useState } from "react";
import { Comment, User } from "../../types";
import Loader from "../Loader";
import { Avatar, Button, Textarea } from "flowbite-react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onEdit: (editedComment: Comment) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onLike,
  onEdit,
}) => {
  const [user, setUser] = useState<User>();
  const [editable, setEditable] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${comment.userId}`);
        const data = await response.json();

        if (!response.ok) {
          console.log(data.message);
          return;
        } else {
          setUser(data);
        }
      } catch (error) {
        //@ts-expect-error error type is any
        console.log(error.message);
      }
    };
    fetchUser();
  }, [comment]);

  if (!user) {
    return <Loader />;
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      const data = await response.json();
      if (response.ok) {
        setEditedContent(data.content);
        onEdit(data);
        setEditable(false);
      }
    } catch (error) {
      //@ts-expect-error error type is any
      console.log(error.message);
    }
  };

  return (
    <div className="flex gap-4 border-b py-4 items-start">
      <Avatar img={user.profilePicture} rounded size="sm" />
      <div className="flex-1">
        <div className="text-xs font-bold">
          @{user.username}{" "}
          <span className="font-medium text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {editable ? (
          <>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="mt-2"
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button
                size="xs"
                gradientDuoTone="greenToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                size="xs"
                gradientDuoTone="greenToBlue"
                outline
                onClick={() => {
                  setEditable(false);
                  setEditedContent(comment.content);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm">{comment.content}</p>
            <div className="mt-2 flex gap-4 items-center border-t border-gray-200 pt-2 text-xs">
              <button
                className={`${
                  currentUser && comment.likes?.includes(currentUser._id)
                    ? "text-blue-500"
                    : "text-gray-400"
                } hover:text-blue-500`}
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp />
              </button>
              {comment.numOfLikes > 0 && (
                <p>{`${comment.numOfLikes} ${
                  comment.numOfLikes === 1 ? "like" : "likes"
                }`}</p>
              )}
              {(currentUser?._id === comment.userId ||
                currentUser?.isAdmin) && (
                <button
                  className="text-gray-500 hover:text-blue-500 hover:underline"
                  onClick={() => setEditable(true)}
                >
                  Edit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
