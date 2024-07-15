import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const categories = [
  "Select a category",
  "Culture",
  "Food",
  "Shopping",
  "Activity",
  "Hotel",
];

const CreatePost = () => {
  return (
    <div className="h-screen px-3 py-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-5">Create a post</h2>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
          <TextInput
            type="text"
            placeholder="Title"
            className="flex-1"
            required
          />
          <Select>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-between border-teal-600 p-3 border-dotted border-2 gap-4">
          <FileInput />
          <Button type="button" gradientDuoTone="greenToBlue" outline size="sm">
            Upload image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-16"
        />
        <Button type="submit" gradientDuoTone="pinkToOrange">
          Create
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
