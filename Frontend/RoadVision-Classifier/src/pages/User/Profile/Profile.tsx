import { useRef, useState } from "react";
import AppLayout from "../../../components/Common/AppLayout";
import mask from "../../../assets/img/mask.png";
import Account from "../../../components/Profile/Account";
import EditProfile from "../../../components/Profile/EditProfile";
import ChangePassword from "../../../components/Profile/ChangePassword";
import { useRecoilValue } from "recoil";
import { accountState } from "../../../atoms/authState";
import userProfileService from "../../../services/userprofile.service";
import { UploadAvatarType } from "../../../defination/types/profile.type";
import { message } from "antd";
import { Camera } from "lucide-react";

export default function Profile() {
  const userRecoilStateValue = useRecoilValue(accountState);
  const [activeTab, setActiveTab] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tabs = [
    { label: "Account", component: <Account /> },
    { label: "Edit Profile", component: <EditProfile /> },
    { label: "Change Password", component: <ChangePassword /> },
  ];

  const handleCameraUpload = () => {
    setShowUploadModal(false);
    setIsCameraActive(true);
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
          message.error("Camera access failed.");
        });
    } else {
      message.error("Camera not supported on this device.");
    }
  };

  const handleCloseCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleTakePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
  
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
  
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          message.error("Failed to capture photo.");
          return;
        }
  
        const file = new File([blob], "avatar.png", { type: "image/png" });
        const formData = new FormData();
        formData.append("file", file);
  
        try {
          await userProfileService.uploadAvatar(formData as unknown as UploadAvatarType);
          message.success("Avatar updated successfully.");
          handleCloseCamera();
          window.location.reload();
        } catch (err) {
          console.error("Upload failed:", err);
          message.error("Upload failed.");
        }
      }, "image/png");
    }
  };
 

  const handleLibraryUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        await userProfileService.uploadAvatar(formData as unknown as UploadAvatarType);
        message.success("Avatar updated successfully.");
        setShowUploadModal(false);
        window.location.reload();
      } catch (err) {
        console.error("Upload failed:", err);
        message.error("Upload failed.");
      }
    };

    input.click();
  };

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col gap-5 justify-start items-center overflow-y-auto">
        {/* Header */}
        <div className="flex flex-row w-[95%] h-32 rounded-2xl bg-[#2D82C6] justify-center items-center relative">
          <img
            src={mask}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute bg-white rounded-full top-[40%] w-36 h-36 flex justify-center items-center relative">
            <img
              src={userRecoilStateValue.avatar}
              alt="Avatar"
              className="w-[95%] h-[95%] object-cover rounded-full"
            />
            <button
              onClick={() => setShowUploadModal(true)}
              className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow"
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col mt-12">
          <h1 className="text-center text-lg font-semibold">
            {userRecoilStateValue.username}
          </h1>
          <h2 className="text-center text-gray-600 text-sm font-semibold">
            {userRecoilStateValue.email}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-row items-center px-5 justify-between h-12 w-[95%] rounded-lg shadow bg-white">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`text-center font-medium w-[23%] cursor-pointer py-2 ${
                activeTab === index
                  ? "border-b-2 border-blue-500"
                  : "border-b-2 border-transparent"
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="w-[95%] bg-white rounded-lg p-5 shadow">
          {tabs[activeTab].component}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal">
            <div className="modalContent">
              <h3 className="modalTitle">Choose Image Source</h3>
              <div className="modalActions">
                <button className="modalButtonCamera" onClick={handleCameraUpload}>
                  Use Camera
                </button>
                <button className="modalButtonLibrary" onClick={handleLibraryUpload}>
                  Upload from Library
                </button>
                <button className="modalButtonCancel" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Camera Preview */}
        {isCameraActive && (
          <div className="cameraPreview">
            <div className="cameraWrapper">
              <video ref={videoRef} className="cameraVideo" autoPlay />
              <button className="cameraButton" onClick={handleTakePhoto}>
                Take Photo
              </button>
              <button className="closeCameraButton" onClick={handleCloseCamera}>
                ✖
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              style={{ display: "none" }}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}