import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { postId, content, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }

    const newComment = new Comment({
      postId,
      content,
      userId,
    });

    const createdComment = await newComment.save();
    res.status(201).json(createdComment);
  } catch (error) {
    next(error);
  }
};
