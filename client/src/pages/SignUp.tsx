import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="h-full mt-20">
      <div className="flex flex-col sm:flex-row gap-6 max-w-3xl mx-4 md:mx-auto">
        {/* left */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <Link
              to="/"
              className="whitespace-nowrap font-semibold dark:text-white text-3xl sm:text-4xl"
            >
              <span className="px-2 text-white rounded-md pinkToOrange-gradient">
                MY
              </span>{" "}
              BLOG
            </Link>
          </div>
          <div className="flex flex-col gap-2 mt-6">
            <span className="text-xl">Welcome to My Blog.</span>
            <p>You can sign up with your email and password or with Google.</p>
          </div>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Username" className="font-semibold" />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div>
              <Label value="Email" className="font-semibold" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
              />
            </div>
            <div>
              <Label value="Password" className="font-semibold" />
              <TextInput type="password" placeholder="Password" id="password" />
            </div>
            <Button type="submit" gradientDuoTone="pinkToOrange">
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 my-5 text-sm">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-700 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
