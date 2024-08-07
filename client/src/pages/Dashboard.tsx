import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/dashboard/DashSidebar";
import DashProfile from "../components/dashboard/DashProfile";
import DashPosts from "../components/dashboard/DashPosts";
import DashUsers from "../components/dashboard/DashUsers";
import DashComments from "../components/dashboard/DashComments";
import DashboardOverview from "../components/dashboard/DashboardOverview";

export default function Dashboard() {
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
    <div className="flex-1 flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComments />}
      {tab === "dash" && <DashboardOverview />}
    </div>
  );
}
