import { useEffect, useState } from "react";
import { Comment, Post, User } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Avatar, Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  const [usersTotal, setUsersTotal] = useState<number>();
  const [commentsTotal, setCommentsTotal] = useState<number>();
  const [postsTotal, setPostsTotal] = useState<number>();
  const [lastMonthUsers, setLastMonthUsers] = useState<number>();
  const [lastMonthComments, setLastMonthComments] = useState<number>();
  const [lastMonthPosts, setLastMonthPosts] = useState<number>();
  const [users, setUsers] = useState<User[]>();
  const [comments, setComments] = useState<Comment[]>();
  const [posts, setPosts] = useState<Post[]>();

  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await fetch("/api/user/getUsers");
        const data = await response.json();
        if (!response.ok) {
          console.error(data.message);
        }

        setUsersTotal(data.usersTotal);
        setLastMonthUsers(data.lastMonthUsers);
        setUsers(data.users);
      } catch (error) {
        //@ts-expect-error error type is any
        console.error(error.message);
      }
    };
    const fetchCommentsData = async () => {
      try {
        const response = await fetch("/api/comment/getComments");
        const data = await response.json();
        if (!response.ok) {
          console.error(data.message);
        }

        setCommentsTotal(data.commentsTotal);
        setLastMonthComments(data.lastMonthComments);
        setComments(data.comments);
      } catch (error) {
        //@ts-expect-error error type is any
        console.error(error.message);
      }
    };
    const fetchPostsData = async () => {
      try {
        const response = await fetch("/api/post/getPosts");
        const data = await response.json();
        if (!response.ok) {
          console.error(data.message);
        }

        setPostsTotal(data.postsTotal);
        setLastMonthPosts(data.lastMonthPosts);
        setPosts(data.posts);
      } catch (error) {
        //@ts-expect-error error type is any
        console.error(error.message);
      }
    };
    if (currentUser && currentUser.isAdmin) {
      fetchCommentsData();
      fetchPostsData();
      fetchUsersData();
    }
  }, [currentUser]);

  return (
    <div className="p-3 mx-auto">
      {/* Summary Section */}
      <div className="flex gap-4 flex-wrap justify-center">
        <div className="flex flex-col gap-4 shadow-md rounded-md p-3 w-full md:w-72 dark:bg-slate-800">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="uppercase">Total users</span>
              <span className="font-semibold text-xl">{usersTotal}</span>
            </div>
            <HiOutlineUserGroup className="text-5xl rounded-full bg-teal-500 text-white p-3 shadow-lg" />
          </div>
          <div className="flex items-center text-sm text-teal-500">
            <HiArrowNarrowUp />
            {lastMonthUsers}
            <span className="ml-2 text-gray-700 dark:text-white">
              Last month
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 shadow-md rounded-md p-3 w-full md:w-72 dark:bg-slate-800">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="uppercase">Total comments</span>
              <span className="font-semibold text-xl">{commentsTotal}</span>
            </div>
            <HiAnnotation className="text-5xl rounded-full bg-indigo-600 text-white p-3 shadow-lg" />
          </div>
          <div className="flex items-center text-sm text-teal-500">
            <HiArrowNarrowUp />
            {lastMonthComments}
            <span className="ml-2 text-gray-700 dark:text-white">
              Last month
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 shadow-md rounded-md p-3 w-full md:w-72 dark:bg-slate-800">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="uppercase">Total posts</span>
              <span className="font-semibold text-xl">{postsTotal}</span>
            </div>
            <HiDocumentText className="text-5xl rounded-full bg-lime-600 text-white p-3 shadow-lg" />
          </div>
          <div className="flex items-center text-sm text-teal-500">
            <HiArrowNarrowUp />
            {lastMonthPosts}
            <span className="ml-2 text-gray-700 dark:text-white">
              Last month
            </span>
          </div>
        </div>
      </div>
      {/* Table section */}
      <div className="mt-5 flex flex-wrap justify-center mx-auto gap-4">
        {/* Users */}
        <div className="flex flex-col gap-4 w-full md:w-auto shadow-md dark:bg-gray-800 rounded-md p-2">
          <div className="flex justify-between p-3">
            <h3 className="font-semibold p-2">Recent users</h3>
            <Button gradientDuoTone="greenToBlue" outline>
              <Link to="/dashboard?tab=users">See all</Link>
            </Button>
          </div>
          <Table>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users && users.length > 0 && (
              <Table.Body>
                {users.map((user) => (
                  <Table.Row
                    key={user._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 "
                  >
                    <Table.Cell>
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="user photo"
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <Avatar className="h-10 w-10" rounded />
                      )}
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            )}
          </Table>
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-4 w-full md:w-auto shadow-md dark:bg-gray-800 rounded-md p-2">
          <div className="flex justify-between p-3">
            <h3 className="font-semibold p-2">Recent comments</h3>
            <Button gradientDuoTone="greenToBlue" outline>
              <Link to="/dashboard?tab=comments">See all</Link>
            </Button>
          </div>
          <Table>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments && comments.length > 0 && (
              <Table.Body>
                {comments.map((comment) => (
                  <Table.Row
                    key={comment._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numOfLikes}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            )}
          </Table>
        </div>

        {/* Posts */}
        <div className="flex flex-col gap-4 w-full md:w-auto shadow-md dark:bg-gray-800 rounded-md p-2">
          <div className="flex justify-between p-3">
            <h3 className="font-semibold p-2">Recent posts</h3>
            <Button gradientDuoTone="greenToBlue" outline>
              <Link to="/dashboard?tab=posts">See all</Link>
            </Button>
          </div>
          <Table>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts && posts.length > 0 && (
              <Table.Body>
                {posts.map((post) => (
                  <Table.Row
                    key={post._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    {post.images && (
                      <Table.Cell>
                        <img
                          src={post.images[0]}
                          alt="post image"
                          className="w-14 h-10 rounded-md"
                        />
                      </Table.Cell>
                    )}

                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{post.title}</p>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
