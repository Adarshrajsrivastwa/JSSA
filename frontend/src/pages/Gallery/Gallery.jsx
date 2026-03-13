import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { ImageIcon, Upload, X, Edit, Trash2, Save, XCircle } from "lucide-react";
import { galleryAPI } from "../../utils/api";
import { useAuth } from "../../auth/AuthProvider";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// Cloudinary images are served directly, no need for API_BASE_URL prefix

const Gallery = () => {
  const { role } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Crop state
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", width: 90, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", order: 0 });

  useEffect(() => {
    if (role !== "admin") {
      setError("Access denied. Only admins can manage gallery.");
      setLoading(false);
      return;
    }
    fetchImages();
  }, [role]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await galleryAPI.getAll();
      if (response.success && response.data) {
        setImages(response.data.images || []);
      }
    } catch (err) {
      console.error("Fetch gallery error:", err);
      setError(err.message || "Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setSelectedFile(file);
      setShowCropModal(true);
      setCrop({ unit: "%", width: 90, aspect: 1 });
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", 0.9);
    });
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop) {
      setError("Please crop the image first");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      const croppedFile = new File([croppedBlob], selectedFile.name, {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("image", croppedFile);
      formData.append("title", "");
      formData.append("description", "");

      const response = await galleryAPI.upload(formData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setShowCropModal(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setCompletedCrop(null);
        fetchImages();
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      await galleryAPI.delete(id);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchImages();
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete image");
    }
  };

  const handleEdit = (image) => {
    setEditingId(image._id);
    setEditForm({
      title: image.title || "",
      description: image.description || "",
      order: image.order || 0,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await galleryAPI.update(editingId, editForm);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setEditingId(null);
      fetchImages();
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update image");
    }
  };

  const handleToggleActive = async (image) => {
    try {
      await galleryAPI.update(image._id, { isActive: !image.isActive });
      fetchImages();
    } catch (err) {
      console.error("Toggle active error:", err);
      setError(err.message || "Failed to update image");
    }
  };

  if (role !== "admin") {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Access denied. Only admins can manage gallery.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading gallery...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePath="/gallery">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#3AB000] flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
                <p className="text-gray-600 text-sm">Upload and manage gallery images (1:1 ratio)</p>
              </div>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-[#3AB000] hover:bg-[#2d8a00] text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm font-medium">Operation successful!</p>
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Crop Modal */}
        {showCropModal && previewUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Crop Image (1:1 Ratio)</h2>
                  <button
                    onClick={() => {
                      setShowCropModal(false);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setCompletedCrop(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    minWidth={100}
                  >
                    <img
                      ref={imgRef}
                      src={previewUrl}
                      alt="Crop preview"
                      style={{ maxWidth: "100%", maxHeight: "70vh" }}
                      onLoad={() => {
                        if (imgRef.current) {
                          setCrop({ unit: "%", width: 90, aspect: 1 });
                        }
                      }}
                    />
                  </ReactCrop>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCropModal(false);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setCompletedCrop(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropComplete}
                    disabled={uploading || !completedCrop}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#3AB000] rounded-lg hover:bg-[#2d8a00] disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload Cropped Image"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No images in gallery. Upload your first image!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image._id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={image.imageUrl}
                    alt={image.title || "Gallery image"}
                    className="w-full h-full object-cover"
                  />
                  {!image.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">Inactive</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleToggleActive(image)}
                      className={`p-2 rounded-full ${
                        image.isActive
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                      title={image.isActive ? "Deactivate" : "Activate"}
                    >
                      {image.isActive ? "✓" : "✗"}
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  {editingId === image._id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        placeholder="Title"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({ ...editForm, description: e.target.value })
                        }
                        placeholder="Description"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        value={editForm.order}
                        onChange={(e) =>
                          setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })
                        }
                        placeholder="Order"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 px-2 py-1 text-xs bg-[#3AB000] text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {image.title && (
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {image.title}
                        </p>
                      )}
                      {image.description && (
                        <p className="text-xs text-gray-600 mb-2">{image.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">Order: {image.order}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(image)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(image._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Gallery;
