import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      navigate("/sign-in", { replace: true });
    } catch (error) {
      //@ts-expect-error error type is any
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-full py-20 bg-[#CDE8E5] dark:bg-teal-600">
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
            <span className="text-2xl">Welcome!</span>
            <p>Create your account with your email and password.</p>
          </div>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Username" className="font-semibold" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleOnChange}
              />
            </div>
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
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="flex gap-2 my-5 text-sm">
            <span>Have an account?</span>
            <Link
              to="/sign-in"
              className="text-blue-700 hover:underline dark:text-rose-500"
            >
              Sign in
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
