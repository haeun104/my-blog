import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Avatar from "../../assets/avatar.jpg";
import { Button, TextInput } from "flowbite-react";

const DashProfile = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <h2 className="my-4 font-semibold text-lg text-center">Profile</h2>
      <form className="flex flex-col gap-4 items-center">
        <div className="w-32 h-32">
          <img
            src={currentUser?.profilePicture || Avatar}
            alt="user photo"
            className="rounded-full w-full h-full border-8 border-gray-300"
          />
        </div>
        <TextInput
          type="text"
          defaultValue={currentUser?.username}
          id="username"
          className="w-full"
        />
        <TextInput
          type="email"
          defaultValue={currentUser?.email}
          id="email"
          className="w-full"
        />
        <TextInput
          type="password"
          defaultValue="********"
          id="password"
          className="w-full"
        />
        <Button
          type="submit"
          gradientDuoTone="greenToBlue"
          outline
          className="w-full"
        >
          Update
        </Button>
      </form>
      <div className="flex justify-between text-rose-400 text-sm font-semibold mt-2">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
