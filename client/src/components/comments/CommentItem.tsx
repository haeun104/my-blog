import { useEffect, useState } from "react";
import { Comment, User } from "../../types";
import Loader from "../Loader";
import { Avatar } from "flowbite-react";
import moment from "moment";

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const [user, setUser] = useState<User>();

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
    <div className="flex gap-4 border-b pb-4">
      <Avatar img={user.profilePicture} rounded size="sm" />
      <div>
        <div className="text-xs font-bold">
          @{user.username}{" "}
          <span className="font-medium text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentItem;
