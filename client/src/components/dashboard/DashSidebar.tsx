import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmLeft, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

const DashSidebar = () => {
  const location = useLocation();

  const [tab, setTab] = useState<string | undefined>();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paramValue = query.get("tab");
    if (paramValue) {
      setTab(paramValue);
    }
  }, [location]);

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
          <Sidebar.Item icon={HiArrowSmLeft}>Sign Out</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
