import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";

const FooterComp = () => {
  return (
    <Footer container className="border border-t-8 border-gray-200">
      <div className="w-full">
        <div className="w-full lg:flex justify-between mx-auto max-w-7xl">
          <div className="py-2">
            <Link
              to="/"
              className="whitespace-nowrap font-semibold dark:text-white text-lg sm:text-xl"
            >
              <span className="px-2 py-1 text-white rounded-md pinkToOrange-gradient">
                MY
              </span>{" "}
              BLOG
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:gap-8 mt-2 pb-2">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Introduction</Footer.Link>
                <Footer.Link href="#">Contact</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Blog posts" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/blog-posts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Culture
                </Footer.Link>
                <Footer.Link
                  href="/blog-posts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Food
                </Footer.Link>
                <Footer.Link
                  href="/blog-posts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shopping
                </Footer.Link>
                <Footer.Link
                  href="/blog-posts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Event
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms & Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="My blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-4 mt-1 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsTwitterX} />
            <Footer.Icon href="#" icon={BsInstagram} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComp;
