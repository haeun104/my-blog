import { useEffect, useState } from "react";
import { Comment, User } from "../../types";
import Loader from "../Loader";
import { Avatar } from "flowbite-react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onLike }) => {
  const [user, setUser] = useState<User>();

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

  return (
    <div className="flex gap-4 border-b pb-4 items-start">
      <Avatar img={user.profilePicture} rounded size="sm" />
      <div>
        <div className="text-xs font-bold">
          @{user.username}{" "}
          <span className="font-medium text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-sm">{comment.content}</p>
        <div className="mt-2 flex gap-4 items-center border-t border-gray-200 pt-2">
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
            <p className="text-sm">{`${comment.numOfLikes} ${
              comment.numOfLikes === 1 ? "like" : "likes"
            }`}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
