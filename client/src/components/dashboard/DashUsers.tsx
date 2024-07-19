import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Loader from "../Loader";
import { Avatar, Table } from "flowbite-react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profilePicture: string;
  isAdmin: boolean;
}

const DashUsers = () => {
  const [users, setUsers] = useState<User[]>();
  const [showMore, setShowMore] = useState(true);

  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/user/getUsers`);
        const data = await response.json();

        if (!response.ok) {
          console.log(data.message);
          return;
        }

        if (response.ok) {
          if (data.users.length <= 9) {
            setShowMore(false);
          }
          setUsers(data.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const handleShowMore = async () => {
    try {
      const response = await fetch(
        `/api/user/getUsers?startIndex=${users?.length}`
      );
      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      if (response.ok) {
        if (data.users.length < 9) {
          setShowMore(false);
        }
        if (users) {
          setUsers([...users, ...data.users]);
        } else {
          setUsers(data.users);
        }
      }
    } catch (error) {
      //@ts-expect-error error type is any
      console.log(error.message);
    }
  };

  if (!users) {
    return <Loader />;
  }

  return (
    <div className="my-5 overflow-x-auto md:mx-auto px-3 table-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && users.length > 0 ? (
        <>
          <Table className="shadow-md">
            <Table.Head className="border-b">
              <Table.HeadCell>Creation date</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="user photo"
                        className="h-10 w-10 rounded-full mx-auto"
                      />
                    ) : (
                      <Avatar rounded className="h-10 w-10 mx-auto" />
                    )}
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-teal-500 mx-auto" />
                    ) : (
                      <FaTimes className="text-rose-500 mx-auto" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-rose-500 hover:underline cursor-pointer">
                      Delete
                    </span>
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
        <p className="text-center mt-5">There are no users yet</p>
      )}
    </div>
  );
};

export default DashUsers;
