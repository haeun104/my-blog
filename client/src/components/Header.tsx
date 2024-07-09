import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";

export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 text-white rounded-md pinkToOrange-gradient">
          MY
        </span>{" "}
        BLOG
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch size={18} />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" rounded />}
          >
            <Dropdown.Header>
              <span className="text-sm">{currentUser.username}</span>
            </Dropdown.Header>
            <Link to={`/dashboard?tab=profile`}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Item>Sign out</Dropdown.Item>
            <Dropdown.Divider />
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button outline gradientDuoTone="pinkToOrange">
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={"div"} active={path === "/"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"} active={path === "/about"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"} active={path === "/blog-posts"}>
          <Link to="/blog-posts">Blog Posts</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
