import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./mapprivate.css";
import dataService from "../../services/data.service";
import { UploadImgFormDataType } from "../../defination/types/data.type";
import { useRecoilValue } from "recoil";
import { accountState } from "../../atoms/authState";
import { checkObjectAtLeastOneField } from "../../utils/check.util";
import { generateImageDomain } from "../../utils/genrate.util";
import { message } from "antd";

import { Upload, Button } from "antd";
import {
  UploadOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
const MapPrivate: React.FC = () => {
  const userRecoilStateValue = useRecoilValue(accountState);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const [imageData, setImageData] = useState<any>({
    src: null,
    address: null,
    location: null,
    time: null,
    status: null,
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUploadWithLocationModal, setShowUploadWithLocationModal] =
    useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [, setRoadsData] = useState<any[]>([]);
  const markersRef = useRef<L.Marker[]>([]);
  // const [currentMarkerdClick, setCurrentMarkerdClick] = useState<LatLng>();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCameraUpload = () => {
    setShowUploadModal(false);
    setIsCameraActive(true);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
        });
    } else {
      message.error("Camera is not supported on this device.");
    }
  };

  const handleAddMarker = (lat: number, lng: number, road: any) => {
    // Determine marker color based on road condition
    let markerColor;
    switch (road.level) {
      case "Good":
        markerColor = "green";
        break;
      case "Poor":
        markerColor = "yellow";
        break;
      case "Very poor":
        markerColor = "red";
        break;
      case "Satisfactory":
        markerColor = "blue";
        break;
      default:
        markerColor = "gray";
    }

    const customIcon = L.divIcon({
      className: "",
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="${markerColor}">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 4.25 7 13 7 13s7-8.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
        </svg>
      `,
      iconSize: [40, 40],
      iconAnchor: [15, 30],
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(
      leafletMap.current!
    );
    markersRef.current.push(marker);

    const image_url = generateImageDomain(road.filepath);
    marker.bindPopup(`
      <div>
        <p><b>Road status:</b> ${road.level}</p>
        <p><b>Lat:</b> ${road.latitude}</p>
        <p><b>Long:</b> ${road.longitude}</p>
        <img src=${image_url} alt="Road image" style="width: 100px; height: auto;" />
      </div>
    `);

    marker.on("click", (event) => {
      setImageData(road);
      const { lat, lng } = event.latlng;

      setLatitude(lat);
      setLongitude(lng);

      leafletMap.current?.setView([lat, lng], leafletMap.current.getZoom());
      marker.openPopup();
    });
  };

  const handleTakePhoto = async () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageDataUrl = canvasRef.current.toDataURL("image/png");

        // Convert base64 to Blob
        const base64Data = imageDataUrl.split(",")[1];
        const blob = atob(base64Data);
        const arrayBuffer = new Uint8Array(blob.length);
        for (let i = 0; i < blob.length; i++) {
          arrayBuffer[i] = blob.charCodeAt(i);
        }
        const file = new Blob([arrayBuffer], { type: "image/png" });

        // Get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const currentLatitude = position.coords.latitude;
              const currentLongitude = position.coords.longitude;

              setLatitude(currentLatitude);
              setLongitude(currentLongitude);

              const formData = new FormData();
              formData.append("file", file);
              formData.append("latitude", currentLatitude.toString());
              formData.append("longitude", currentLongitude.toString());
              try {
                // Call api upload road image
                await dataService.uploadRoad(
                  formData as unknown as UploadImgFormDataType
                );
                closeUploadModal();
                handleAddMarker(currentLatitude, currentLongitude, {});
                handleCloseCamera();
                window.location.reload();
              } catch (error) {
                console.error("Error uploading image:", error);
                message.error("An error occurred during the upload. Please try again.");
              }
            },
            (error) => {
              console.error("Error getting location:", error);
              message.error(
                "Could not get current location. Please enable location services."
              );
            }
          );
        } else {
          message.error("Geolocation is not supported by this browser.");
        }
        setIsCameraActive(false);
        handleCloseCamera();
      }
    }
  };

  const handleLibraryUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
        // Get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const currentLatitude = position.coords.latitude;
              const currentLongitude = position.coords.longitude;

              setLatitude(currentLatitude);
              setLongitude(currentLongitude);

              const formData = new FormData();
              formData.append("file", file);
              formData.append("latitude", currentLatitude.toString());
              formData.append("longitude", currentLongitude.toString());

              try {
                // Call api upload road image
                await dataService.uploadRoad(
                  formData as unknown as UploadImgFormDataType
                );
                closeUploadModal();

                handleAddMarker(currentLatitude, currentLongitude, {
                  filepath:
                    "https://images4.alphacoders.com/115/thumb-1920-115716.jpg",
                });
                window.location.reload();
              } catch (error) {
                console.error("Error uploading image:", error);
                alert("An error occurred during the upload. Please try again.");
              }
            },
            (error) => {
              console.error("Error getting location:", error);
              alert(
                "Could not get current location. Please enable location services."
              );
            }
          );
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }
    };

    fileInput.click();
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      setSelectedFile(file);
      alert("Image selected successfully!");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please choose an image first.");
      return;
    }

    if (!latitude || !longitude) {
      alert("Please enter valid latitude and longitude.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("latitude", latitude.toString());
    formData.append("longitude", longitude.toString());

    try {
      await dataService.uploadRoad(
        formData as unknown as UploadImgFormDataType
      );
      alert("Image uploaded successfully!");
      closeUploadWithLocationModal();
      handleAddMarker(latitude, longitude, {
        filepath:
          "https://images4.alphacoders.com/115/thumb-1920-115716.jpg",
      });
      window.location.reload();
    } catch (error: any) {
      console.error(
        "Error uploading image:",
        error.response?.data || error.message
      );
      alert(
        `An error occurred during the upload. Please try again.\nDetails: ${
          error.response?.data?.message || "Unknown Error"
        }`
      );
    }
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const openUploadWithLocationModal = () => {
    setShowUploadWithLocationModal(true);
  };

  const closeUploadWithLocationModal = () => {
    setShowUploadWithLocationModal(false);
    setLatitude(0);
    setLongitude(0);
  };

  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;

      stream.getTracks().forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      handleCloseCamera();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [10.762622, 106.660172],
      zoom: 14,
    });

    leafletMap.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    const fetchRoadsUserData = async () => {
      if (!userRecoilStateValue.id) return;

      try {
        const data = await dataService.getInfoRoads({
          user_id: userRecoilStateValue.id,
          all: true,
        });

        if (Array.isArray(data)) {
          if (data.length > 0) {
            const roads = data.map((item: string) => JSON.parse(item));
            console.log("Dữ liệu đường:", roads);

            setRoadsData(roads);

            roads.forEach(async (road: any) => {
              const { latitude, longitude } = road;

              handleAddMarker(latitude, longitude, road);
            });
          } else {
            console.error("Dữ liệu không hợp lệ, mảng rỗng:", data);
          }
        } else {
          console.error("Dữ liệu không phải mảng:", data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đường:", error);
      }
    };

    fetchRoadsUserData();
  }, [userRecoilStateValue.id]);

  const handleDeleteImage = async () => {
    if (!imageData.id) {
      alert("Road ID is not available for deletion.");
      return;
    }

    try {
      await dataService.deleteRoad({
        id_road: imageData.id,
        all: false,
      });
      setRoadsData((prevRoads) =>
        prevRoads.filter((road) => road.id !== imageData.id)
      );
      // Xóa marker liên quan đến đường đã xóa
      markersRef.current = markersRef.current.filter((marker) => {
        const { lat, lng } = marker.getLatLng();
        if (lat === imageData.latitude && lng === imageData.longitude) {
          leafletMap.current?.removeLayer(marker);
          return false;
        }
        return true;
      });

      // Reset dữ liệu hình ảnh
      setImageData({
        src: null,
        address: null,
        location: null,
        time: null,
        status: null,
      });

      alert("Road deleted successfully.");
    } catch (error) {
      console.error("Error deleting road:", error);
      alert("An error occurred while deleting the road. Please try again.");
    } finally {
      setShowDeleteModal(false);
    }
  };
  const handleSave = async () => {
    try {
      // Gọi API để cập nhật tọa độ
      const response = await dataService.updateLocationRoad(
        imageData.id,
        latitude,
        longitude
      );
      console.log("Update successful:", response);
      alert("Coordinates updated successfully!");

      setImageData((prevData: typeof imageData) => ({
        ...prevData,
        latitude,
        longitude,
      }));

      closeEditModal();
      window.location.reload();
    } catch (error) {
      console.error("Failed to update coordinates:", error);
      alert("Failed to update coordinates. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2 className="header">View Image</h2>
        {checkObjectAtLeastOneField(imageData) && (
          <div className="imageDetails">
            <div className="imageContainer">
              <img
                src={generateImageDomain(imageData.filepath)}
                alt="Uploaded"
                className="image"
              />
              <div className="iconContainer">
                <button className="iconButtonEdit" onClick={openEditModal}>
                  <EditOutlined /> Edit Coordinates
                </button>
                <button className="iconButtonTrash" onClick={openDeleteModal}>
                  <DeleteOutlined />
                </button>
              </div>
            </div>
            <div className="imageInfo">
              <p>
                <strong>Status: </strong> {imageData.level}
              </p>
              <p>
                <strong>Address: </strong>
                {imageData.location}
              </p>
              <p>
                <strong>Location: </strong>
                <br />
                <li>
                  Lat: {imageData.latitude}
                  <br />
                </li>
                <li>Long: {imageData.longitude}</li>
              </p>
              <p>
                <strong>Time: </strong>
                {new Date(imageData.created_at).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
          </div>
        )}

        <span>
          _______________________________________________________________
        </span>

        <div className="buttonContainer flex flex-col">
          <button className="uploadButton" onClick={openUploadModal}>
            Upload current image
          </button>
          <span
            style={{
              alignSelf: "center",
              fontSize: "16px",
              padding: "25px",
              fontWeight: "bold",
            }}
          >
            Or
          </span>{" "}
          <button
            className="modalButtonLibrary"
            onClick={openUploadWithLocationModal}
          >
            Upload with location
          </button>
        </div>
      </div>

      <div ref={mapRef} className="map" />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal">
          <div className="modalContent">
            <h3 className="modalTitle">Choose Image Source</h3>
            <div className="modalActions">
              <button
                className="modalButtonCamera"
                onClick={handleCameraUpload}
              >
                Use Camera
              </button>
              <button
                className="modalButtonLibrary"
                onClick={handleLibraryUpload}
              >
                Upload from Library
              </button>
              <button className="modalButtonCancel" onClick={closeUploadModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Coordinates Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modalContent">
            <h3>Edit Coordinates</h3>
            <div className="inputGroup">
              <label>Latitude:</label>
              <input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
              />
            </div>
            <div className="inputGroup">
              <label>Longitude:</label>
              <input
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
              />
            </div>
            <div className="buttonGroup">
              <button className="cancelButton" onClick={closeEditModal}>
                Cancel
              </button>
              <button className="saveButton" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modalContent">
            <h3 className="modalTitle">Confirm Deletion</h3>
            <p>Are you sure you want to delete this road?</p>
            <div className="modalActions">
              <button className="modalButtonDelete" onClick={handleDeleteImage}>
                Yes, Delete
              </button>
              <button className="modalButtonCancel" onClick={closeDeleteModal}>
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

      {/* Upload with location Modal */}
      {showUploadWithLocationModal && (
        <div className="modalUpload">
          <div className="modal-content">
            {/* Nút đóng modal */}
            <button
              className="close-button"
              onClick={closeUploadWithLocationModal}
            >
              <CloseOutlined />
            </button>
            <h2>Upload Image with Location</h2>
            <div className="modal-body">
              <label>
                Latitude:
                <input
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                />
              </label>
              <label>
                Longitude:
                <input
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                />
              </label>
              <Upload beforeUpload={() => false} onChange={handleFileChange}>
                <Button icon={<UploadOutlined />}>Choose image</Button>
              </Upload>
              <button onClick={handleUpload}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPrivate;
