import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

interface Post {
  _id: string;
  userId: string;
  title: string;
  content: string;
  images: string[] | null | undefined;
  category: string;
  slug: string;
  updatedAt: Date;
  createdAt: Date;
}

const DashPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

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

  return (
    <div className="mt-5 overflow-x-auto md:mx-auto px-3 table-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && posts.length > 0 ? (
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
                <Table.Cell className="font-semibold">{post.title}</Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <span className="cursor-pointer text-rose-500 hover:underline">
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
      ) : (
        <p>There are no posts yet</p>
      )}
    </div>
  );
};

export default DashPosts;
