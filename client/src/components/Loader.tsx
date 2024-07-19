import { Spinner } from "flowbite-react";

const Loader = () => {
  return (
    <div className="mx-auto flex items-center pt-10 md:pt-0">
      <Spinner color="info" size="xl" />
    </div>
  );
};

export default Loader;
