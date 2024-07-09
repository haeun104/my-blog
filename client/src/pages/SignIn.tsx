import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loading, error: errorMessage } = useSelector(
    (state: RootState) => state.user
  );
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields."));
    }
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (response.ok) {
        dispatch(signInSuccess(data));
        navigate("/", { replace: true });
      }
    } catch (error) {
      //@ts-expect-error error type is any
      dispatch(signInFailure(error.message));
    }
  };
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
            <span className="text-xl">Welcome Back to My Blog.</span>
            <p>You can sign in with your email and password or with Google.</p>
          </div>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" className="font-semibold" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleOnChange}
              />
            </div>
            <div>
              <Label value="Password" className="font-semibold" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleOnChange}
              />
            </div>
            <Button
              type="submit"
              gradientDuoTone="pinkToOrange"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 my-5 text-sm">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-700 hover:underline">
              Sign up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
