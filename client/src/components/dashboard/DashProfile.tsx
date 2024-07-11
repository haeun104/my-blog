import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Avatar from "../../assets/avatar.jpg";
import { Alert, Button, TextInput } from "flowbite-react";
import { ChangeEvent, useRef, useState } from "react";
import { app } from "../../firebase/firebase-config";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<
    number | null
  >(null);
  const [imageFileUploadError, setImageFileUploadError] = useState<
    string | null
  >(null);
  const [imageLoading, setImageLoading] = useState(false);

  const filePickerRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file)); // save url of a changed image stored locally
    }
  };

  // Store the changed image on firebase storage
  const uploadImage = async () => {
    if (imageFile) {
      setImageLoading(true);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile?.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        // when image is being uploaded
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress > 0) {
            setImageFileUploadProgress(parseInt(progress.toFixed(0)));
          }
        },
        // if image upload is failed
        () => {
          setImageFileUploadError(
            "Could not upload image(File must be less than 2MB"
          );
          setImageFile(null);
          setImageFileUrl(null);
          setImageFileUploadProgress(null);
          setImageLoading(false);
        },
        // if image upload is completed
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL); // update url of a changed image stored on firebase storage
            setImageFileUploadProgress(null);
            setImageLoading(false);
          });
        }
      );
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <h2 className="my-4 font-semibold text-lg text-center">Profile</h2>
      <form className="flex flex-col gap-4 items-center">
        <input
          type="file"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className={`w-32 h-32 relative cursor-pointer`}
          onClick={() => filePickerRef.current?.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress}
              text={`${imageFileUploadProgress} %`}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser?.profilePicture || Avatar}
            alt="user photo"
            className={`rounded-full w-full h-full border-8 border-gray-300 ${
              imageLoading && "opacity-50"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          defaultValue={currentUser?.username}
          id="username"
          className="w-full"
        />
        <TextInput
          type="email"
          defaultValue={currentUser?.email}
          id="email"
          className="w-full"
        />
        <TextInput
          type="password"
          defaultValue="********"
          id="password"
          className="w-full"
        />
        <Button
          type="button"
          gradientDuoTone="greenToBlue"
          outline
          className="w-full"
          onClick={uploadImage}
        >
          Update
        </Button>
      </form>
      <div className="flex justify-between text-rose-400 text-sm font-semibold mt-2">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
