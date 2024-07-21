import { useEffect, useState } from "react";
import { Comment, User } from "../../types";
import Loader from "../Loader";
import { Avatar, Button, Modal, Textarea } from "flowbite-react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onEdit: (editedComment: Comment) => void;
  onDelete: (deletedCommentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onLike,
  onEdit,
  onDelete,
}) => {
  const [user, setUser] = useState<User>();
  const [editable, setEditable] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [openModal, setOpenModal] = useState(false);

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

  const handleDelete = async () => {
    setOpenModal(false);
    try {
      const response = await fetch(
        `/api/comment/deleteComment/${comment._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        onDelete(comment._id);
      }
    } catch (error) {
      //@ts-expect-error error type is any
      console.log(error.message);
    }
  };

  return (
    <>
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
                  <>
                    <button
                      className="text-gray-500 hover:text-blue-500 hover:underline"
                      onClick={() => setEditable(true)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-gray-500 hover:text-blue-500 hover:underline"
                      onClick={() => setOpenModal(true)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CommentItem;
