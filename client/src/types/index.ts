export interface Post {
  _id: string;
  userId: string;
  title: string;
  content: string;
  images: string[] | null | undefined;
  category: string;
  slug: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface Comment {
  _id: string;
  userId: string;
  postId: string;
  content: string;
  likes: string[] | undefined;
  numOfLikes: number;
  createdAt: Date;
  updatedAt: Date;
}


export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profilePicture: string;
  isAdmin: boolean;
}