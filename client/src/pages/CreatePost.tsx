import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { ChangeEvent, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase/firebase-config";
import { CircularProgressbar } from "react-circular-progressbar";

const categories = [
  "Select a category",
  "Culture",
  "Food",
  "Shopping",
  "Activity",
  "Hotel",
];

const CreatePost = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [fileUploadProgress, setFileUploadProgress] = useState<number | null>(
    null
  );
  const [fileOnUpload, setFileOnUpload] = useState<string | null>(null);
  const [filesUrl, setFilesUrl] = useState<string[] | null>(null);
  const [fileLoading, setFileLoading] = useState(false);

  const handleChangeImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFiles = Array.from(e.target.files);
      const imageList: File[] = [];
      imageFiles.forEach((file) => imageList.push(file));
      setFiles(imageList);
    }
  };

  // Store the changed image on firebase storage
  const uploadImages = async () => {
    if (files && files.length > 0) {
      setFileLoading(true);
      const storage = getStorage(app);
      const uploadPromises = [];

      for (let i = 0; i < files.length; i++) {
        const fileName = new Date().getTime() + files[i].name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, files[i]);

        const uploadPromise = new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            // when image is being uploaded
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (progress > 0) {
                setFileUploadProgress(parseInt(progress.toFixed(0)));
                setFileOnUpload(`${i + 1}/${files.length}`);
              }
            },
            // if image upload is failed
            (error) => {
              setFiles(null);
              setFileUploadProgress(null);
              setFileOnUpload(null);
              setFileLoading(false);
              reject(error);
            },
            // if image upload is completed
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  resolve(downloadURL);
                })
                .catch((error) => reject(error));
              setFileUploadProgress(null);
              setFileOnUpload(null);
            }
          );
        });

        uploadPromises.push(uploadPromise);
      }

      try {
        const downloadUrls = await Promise.all(uploadPromises);
        setFilesUrl(downloadUrls as string[]);
      } catch (error) {
        console.error("Error uploading files:", error);
      } finally {
        setFileLoading(false);
      }
    }
  };

  return (
    <div className="h-screen px-3 py-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-5">Create a post</h2>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
          <TextInput
            type="text"
            placeholder="Title"
            className="flex-1"
            required
          />
          <Select>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-between border-teal-600 p-3 border-dotted border-2 gap-4">
          <FileInput multiple onChange={handleChangeImages} />
          <Button
            type="button"
            gradientDuoTone="greenToBlue"
            outline
            size="sm"
            onClick={uploadImages}
            className="relative"
          >
            {fileUploadProgress && fileOnUpload ? (
              <div className="w-12 h-12">
                <CircularProgressbar
                  value={fileUploadProgress}
                  text={`${fileUploadProgress} %`}
                />
                <span className="text-sm absolute top-0 right-0">
                  {fileOnUpload}
                </span>
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {!fileLoading && filesUrl && (
          <div className="flex flex-wrap gap-2">
            {filesUrl.map((url, index) => (
              <div key={index} className="w-40 h-40 sm:w-52 sm:h-52">
                <img src={url} alt="post photo" className="w-full h-full" />
              </div>
            ))}
          </div>
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-16"
        />
        <Button type="submit" gradientDuoTone="pinkToOrange">
          Create
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
