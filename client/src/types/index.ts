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
