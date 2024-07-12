import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmLeft, HiUser } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../../redux/user/userSlice";

const DashSidebar = () => {
  const location = useLocation();

  const [tab, setTab] = useState<string | undefined>();

  const dispatch = useDispatch();

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
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              icon={HiUser}
              active={tab === "profile"}
              label={"User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
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
