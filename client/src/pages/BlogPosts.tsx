import { Button, Label, Select, TextInput } from "flowbite-react";
import { categories } from "./CreatePost";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Post } from "../types";
import Loader from "../components/Loader";
import PostCard from "../components/posts/PostCard";

export default function BlogPosts() {
  const [filterValues, setFilterValues] = useState({
    searchTerm: "",
    sort: "desc",
    category: "Select a category",
  });
  const [posts, setPosts] = useState<Post[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchPosts = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/post/getPosts?${searchQuery}`);

      const data = await response.json();
      if (!response.ok) {
        console.error(data.message);
        setShowMore(false);
        return;
      }

      if (data.posts.length < 9) {
        setShowMore(false);
      } else {
        setShowMore(true);
      }

      setPosts(data.posts);
    } catch (error) {
      //@ts-expect-error error type is any
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch filtered posts based on search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm");
    const sort = urlParams.get("sort");
    const category = urlParams.get("category");

    const updatedFilterValues = { ...filterValues };

    if (searchTerm) {
      updatedFilterValues.searchTerm = searchTerm;
    }
    if (sort) {
      updatedFilterValues.sort = sort;
    }
    if (category) {
      updatedFilterValues.category = category;
    }
    setFilterValues(updatedFilterValues);

    fetchPosts(urlParams.toString());
  }, [location.search]);
  

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFilterValues({ ...filterValues, [id]: value });
  };

  // Update URL search parameters based on input filter values
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);

    if (filterValues.searchTerm) {
      urlParams.set("searchTerm", filterValues.searchTerm);
    }
    // Remove search term from URL if empty string is submitted
    if (!filterValues.searchTerm) {
      urlParams.delete("searchTerm");
    }

    urlParams.set("sort", filterValues.sort === "Latest" ? "desc" : "asc");

    if (filterValues.category !== "Select a category") {
      urlParams.set("category", filterValues.category);
    }
    // Remove category from URL if category is not selected
    if (filterValues.category === "Select a category") {
      urlParams.delete("category");
    }
    const searchParams = urlParams.toString();
    navigate(`/blog-posts?${searchParams}`);
  };

  const handleShowMore = async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const numOfPosts = posts?.length;
      if (numOfPosts) {
        urlParams.set("startIndex", numOfPosts.toString());
      }
      const searchQuery = urlParams.toString();
      const response = await fetch(`/api/post/getPosts?${searchQuery}`);
      const data = await response.json();
      if (!response.ok) {
        console.error(data.message);
        setShowMore(false);
        return;
      }

      if (data.posts.length < 9) {
        setShowMore(false);
      } else {
        setShowMore(true);
      }

      if (posts) {
        setPosts([...posts, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
    } catch (error) {
      //@ts-expect-error error type is any
      console.log(error.message);
    }
  };

  if (isLoading && !posts) {
    return <Loader />;
  }

  return (
    <div className="p-3 lg:p-0 lg:flex">
      <form
        className="text-md flex flex-col gap-4 max-w-80 w-full mx-auto lg:max-w-96 lg:p-5 lg:border-r lg:border-gray-300"
        onSubmit={handleSearchSubmit}
      >
        <div className="flex gap-2 items-center">
          <Label htmlFor="searchTerm" value="Search term" className="w-32" />
          <TextInput
            type="text"
            id="searchTerm"
            placeholder="Search..."
            className="w-full"
            value={filterValues.searchTerm}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Label htmlFor="sort" value="Sort" className="w-32" />
          <Select
            id="sort"
            className="w-full"
            value={filterValues.sort}
            onChange={handleChange}
          >
            <option>Latest</option>
            <option>Oldest</option>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <Label htmlFor="category" value="category" className="w-32" />
          <Select
            id="category"
            className="w-full"
            value={filterValues.category}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </Select>
        </div>
        <Button type="submit" gradientDuoTone="greenToBlue" outline>
          Search
        </Button>
      </form>
      <div className="mt-5 border-t border-gray-300 w-full lg:border-none lg:mt-2 pb-5">
        <h2 className="my-3 text-xl font-bold text-center lg:text-3xl">
          Posts
        </h2>
        <div className="p-7 flex gap-4 flex-wrap justify-center">
          {posts?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        {showMore && (
          <div className="w-full flex justify-center">
            <button
              className="text-teal-500 w-full max-w-[350px] py-2 border-teal-400 border-[1px] rounded-sm shadow-md text-sm hover:bg-teal-500 hover:text-white"
              onClick={handleShowMore}
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
