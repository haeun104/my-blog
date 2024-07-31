import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../../redux/store";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { signoutSuccess } from "../../redux/user/userSlice";
import SearchBar from "./SearchBar";

export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { theme } = useSelector((state: RootState) => state.theme);

  const dispatch = useDispatch();

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
      <SearchBar />
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" rounded img={currentUser.profilePicture} />
            }
          >
            <Dropdown.Header>
              <span className="text-sm">{currentUser.username}</span>
            </Dropdown.Header>
            <Link to={`/dashboard?tab=profile`}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
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
        <Navbar.Link as={"div"} active={path === "/blog-posts"}>
          <Link to="/blog-posts">Blog Posts</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
