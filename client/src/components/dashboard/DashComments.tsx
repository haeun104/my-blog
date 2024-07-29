import { useEffect, useState } from "react";
import { Comment } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Loader from "../Loader";

const DashComments = () => {
  const [comments, setComments] = useState<Comment[]>();
  const [showMore, setShowMore] = useState<boolean>();
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comment/getComments");
        const data = await response.json();

        if (!response.ok) {
          console.error(data.message);
          return;
        }
        if (response.ok) {
          if (data.comments.length < 9 || data.commentsTotal === 10) {
            setShowMore(false);
          } else {
            setShowMore(true);
          }

          setComments(data.comments);
        }
      } catch (error) {
        //@ts-expect-error error type is any
        console.error(error.message);
      }
    };
    fetchComments();
  }, []);

  const handleShowMore = async () => {
    try {
      const response = await fetch(
        `/api/comment/getComments?startIndex=${comments?.length}`
      );
      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }
      if (response.ok) {
        if (data.comments.length < 9) {
          setShowMore(false);
        }
        if (comments) {
          setComments([...comments, ...data.comments]);
        } else {
          setComments(data.comments);
        }
      }
    } catch (error) {
      //@ts-expect-error error type is any
      console.error(error.message);
    }
  };

  const handleCommentDelete = async () => {
    setOpenModal(false);
    try {
      const response = await fetch(
        `/api/comment/deleteComment/${commentToDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }
      if (response.ok) {
        setComments((prev) =>
          prev?.filter((comment) => comment._id !== commentToDelete)
        );
      }
    } catch (error) {
      //@ts-expect-error error type is any
      console.error(error.message);
    }
  };

  if (!comments) {
    return <Loader />;
  }

  return (
    <>
      <div className="my-5 overflow-x-auto md:mx-auto px-3 table-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser?.isAdmin && comments && comments.length > 0 ? (
          <>
            <Table className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Update date</Table.HeadCell>
                <Table.HeadCell>Comment content</Table.HeadCell>
                <Table.HeadCell>Number of likes</Table.HeadCell>
                <Table.HeadCell>Post Id</Table.HeadCell>
                <Table.HeadCell>User Id</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {comments.map((comment) => (
                  <Table.Row>
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.numOfLikes}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{currentUser._id}</Table.Cell>
                    <Table.Cell>
                      <span
                        className="text-rose-500 text-sm hover:underline cursor-pointer"
                        onClick={() => {
                          setCommentToDelete(comment._id);
                          setOpenModal(true);
                        }}
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {showMore && (
              <button
                className="text-teal-500 w-full py-2 border-teal-400 border-[1px] rounded-md text-sm mt-5 shadow-md hover:bg-teal-500 hover:text-white"
                onClick={handleShowMore}
              >
                Show more
              </button>
            )}
          </>
        ) : (
          <p>There are no comments yet</p>
        )}
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
              <Button color="failure" onClick={handleCommentDelete}>
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

export default DashComments;
