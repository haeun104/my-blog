import { Button, TextInput } from "flowbite-react";
import { FormEvent, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/blog-posts?searchTerm=${searchTerm}`);
    }
  };
  return (
    <>
      <form onSubmit={handleSearchSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button
        type="submit"
        className="w-12 h-10 lg:hidden cursor-pointer"
        color="gray"
        pill
      >
        <AiOutlineSearch size={18} />
      </Button>
    </>
  );
};

export default SearchBar;
