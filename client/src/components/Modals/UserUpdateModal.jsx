import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { imageUpload } from "../../utils/imagebbAPI";
import toast from "react-hot-toast";

export default function UserUpdateModal({
  open,
  handleClose,
  currentUser,
  refetch,
}) {
  const { email, name: currentName, photo: currentPhoto } = currentUser || {};
  const { updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();

  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
      });
      setImagePreview(currentUser.photo || null);
      setImageUrl(currentUser.photo || null);
    }
  }, [currentUser]);

  const [imagePreview, setImagePreview] = useState(currentPhoto || null);
  const [imageUrl, setImageUrl] = useState(currentPhoto);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentName || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      try {
        const imageUrl = await imageUpload(file);
        setImageUrl(imageUrl);
      } catch (error) {
        toast.error("Image upload failed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      toast.error("User email is required");
      setLoading(false);
      return;
    }
    try {
      await updateUserProfile(formData.name, imageUrl);
      await axiosSecure.patch(`/users/${email}`, {
        name: formData.name,
        photo: imageUrl,
        phone: formData.phone,
        address: formData.address,
      });
      toast.success("Profile updated successfully!");
      refetch();
      handleClose();
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          textAlign: "center",
          color: "#FF4B2B",
          fontFamily: "Playfair Display",
          fontSize: "24px",
        }}
      >
        Update Profile
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <div className="flex flex-col items-center mb-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-28 h-28 rounded-full object-cover shadow-md border-4 border-[#FF4B2B] transition-all hover:shadow-[#FF6F3C] hover:shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
                No Image
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="mt-3 bg-[#FF4B2B] text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-[#FF6F3C] transition-all"
            >
              Choose File
            </label>
          </div>

          <TextField
            margin="dense"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2, fontFamily: "Poppins" }}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone Number"
            type="tel"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
            sx={{ mb: 2, fontFamily: "Poppins" }}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            value={formData.address}
            onChange={handleChange}
            multiline
            rows={2}
            sx={{ fontFamily: "Poppins" }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button
            onClick={handleClose}
            sx={{ color: "#222831", fontFamily: "Inter" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "#FF4B2B",
              fontFamily: "Poppins",
              "&:hover": { bgcolor: "#FF6F3C" },
            }}
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

UserUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  refetch: PropTypes.func.isRequired,
};
