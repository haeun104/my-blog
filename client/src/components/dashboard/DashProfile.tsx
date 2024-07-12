import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Avatar from "../../assets/avatar.jpg";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { app } from "../../firebase/firebase-config";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  deleteFailure,
  deleteStart,
  deleteSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashProfile = () => {
  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<
    number | null
  >(null);
  const [imageFileUploadError, setImageFileUploadError] = useState<
    string | null
  >(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateErrorMsg, setUpdateErrorMsg] = useState<string | null>(null);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const filePickerRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file)); // save url of a changed image stored locally
    }
  };

  // Execute uploadImage whenever image file is changed
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

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
            setFormData({ ...formData, profilePicture: downloadURL });
          });
        }
      );
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUpdateErrorMsg(null);
    setUpdateSuccessMsg(null);

    if (Object.keys(formData).length === 0) {
      setUpdateErrorMsg("Nothing to be updated");
      return;
    }

    try {
      dispatch(updateStart());
      const response = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setUpdateErrorMsg(data.message);
      } else {
        setUpdateSuccessMsg("Updated user's profile successfully");
        dispatch(updateSuccess(data));
      }
    } catch (error) {
      //@ts-expect-error error type is any
      setUpdateError(error.message);
      //@ts-expect-error error type is any
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setOpenModal(false);
    try {
      dispatch(deleteStart());
      const response = await fetch(`/api/user/delete/${currentUser?._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess(data));
      }
    } catch (error) {
      //@ts-expect-error error type is any
      dispatch(deleteFailure(data.message));
    }
  };

  return (
    <>
      <div className="w-full max-w-lg mx-auto p-3">
        <h2 className="my-4 font-semibold text-lg text-center">Profile</h2>
        <form
          className="flex flex-col gap-4 items-center"
          onSubmit={handleSubmit}
        >
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
            onChange={handleChange}
          />
          <TextInput
            type="email"
            defaultValue={currentUser?.email}
            id="email"
            className="w-full"
            onChange={handleChange}
          />
          <TextInput
            type="password"
            defaultValue="********"
            id="password"
            className="w-full"
            onChange={handleChange}
          />
          <Button
            type="submit"
            gradientDuoTone="greenToBlue"
            outline
            className="w-full"
            disabled={loading}
          >
            Update
          </Button>
        </form>
        <div className="flex justify-between text-rose-400 text-sm font-semibold my-2">
          <span className="cursor-pointer" onClick={() => setOpenModal(true)}>
            Delete Account
          </span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
        {updateErrorMsg && <Alert color="failure">{updateErrorMsg}</Alert>}
        {updateSuccessMsg && <Alert color="success">{updateSuccessMsg}</Alert>}
        {error && <Alert color="success">{error}</Alert>}
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DashProfile;
