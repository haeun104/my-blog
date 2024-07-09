import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";

const OAuth = () => {
  const handleClickGoogle = () => {};
  return (
    <Button
      type="button"
      gradientDuoTone="greenToBlue"
      outline
      onClick={handleClickGoogle}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
};

export default OAuth;
