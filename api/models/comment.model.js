import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timeStamp: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
