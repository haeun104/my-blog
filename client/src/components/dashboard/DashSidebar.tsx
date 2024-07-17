import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmLeft, HiDocumentText, HiUser } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../../redux/user/userSlice";
import { RootState } from "../../redux/store";

const DashSidebar = () => {
  const location = useLocation();

  const [tab, setTab] = useState<string | undefined>();

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paramValue = query.get("tab");
    if (paramValue) {
      setTab(paramValue);
    }
  }, [location]);

  const handleSignout = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        //@ts-expect-error error type is any
        console.log(response.message);
      } else {
        dispatch(signoutSuccess(data));
      }
    } catch (error) {
      //@ts-expect-error error type is any
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              icon={HiUser}
              active={tab === "profile"}
              label={currentUser?.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                icon={HiDocumentText}
                active={tab === "posts"}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmLeft}
            onClick={handleSignout}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
