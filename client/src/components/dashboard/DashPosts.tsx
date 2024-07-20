import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Post } from "../../types";

const DashPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string>();

  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `api/post/getPosts?userId=${currentUser?._id}`
        );
        const data = await response.json();

        if (response.ok) {
          setPosts(data.posts);
          if (data.total <= 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        // @ts-expect-error error type is any
        console.log(error.message);
      }
    };
    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    try {
      const response = await fetch(
        `api/post/getPosts?userId=${currentUser?._id}&startIndex=${posts.length}`
      );
      const data = await response.json();
      if (response.ok) {
        setPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      // @ts-expect-error error type is any
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setOpenModal(false);
    try {
      const response = await fetch(
        `/api/post/deletePost/${postIdToDelete}/${currentUser?._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      } else {
        setPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      // @ts-expect-error error type is any
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="my-5 overflow-x-auto md:mx-auto px-3 table-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser?.isAdmin && posts.length > 0 ? (
          <>
            <Table className="shadow-md">
              <Table.Head className="border-b-[1px]">
                <Table.HeadCell>Update date</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {posts.map((post) => (
                  <Table.Row
                    key={post._id}
                    className="border-b-[1px]  bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      {post.images ? (
                        <img
                          src={post.images[0]}
                          className="w-16 h-12 object-cover"
                        />
                      ) : (
                        <span>No image</span>
                      )}
                    </Table.Cell>

                    <Table.Cell className="font-semibold hover:underline">
                      <Link to={`/post/${post.slug}`}>{post.title}</Link>
                    </Table.Cell>

                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span
                        className="cursor-pointer text-rose-500 hover:underline"
                        onClick={() => {
                          setOpenModal(true);
                          setPostIdToDelete(post._id);
                        }}
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/update-post/${post._id}`}
                        className="text-teal-500 hover:underline"
                      >
                        Edit
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {showMore && (
              <button
                className="text-teal-500 w-full py-2 border-teal-400 border-[1px] rounded-sm shadow-md text-sm mt-5 hover:bg-teal-500 hover:text-white"
                onClick={handleShowMore}
              >
                Show more
              </button>
            )}
          </>
        ) : (
          <p>There are no posts yet</p>
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
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts;
