import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import BlogPosts from "./pages/BlogPosts";
import SignIn from "./pages/SignIn";
import Header from "./components/navbar/Header";
import Footer from "./components/Footer";
import DashboardPrivateRoute from "./components/dashboard/DashboardPrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostDetail from "./pages/PostDetail";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<DashboardPrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<AdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          <Route path="/blog-posts" element={<BlogPosts />} />
          <Route path="/post/:postSlug" element={<PostDetail />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
