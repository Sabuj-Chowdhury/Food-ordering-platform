import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { useState } from "react";
import UserUpdateModal from "../Modals/UserUpdateModal";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Fetch user data
  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/${user.email}`);
      return data.user;
    },
  });
  // console.log(profile);

  const handleOpenModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
  };

  // Destructure additional fields from profile
  const { email, photo, name, phone, address, role, createdAt } = profile || {};

  // Format the date
  const memberSince = createdAt
    ? new Date(createdAt).getFullYear()
    : new Date().getFullYear();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8 md:p-12">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 playfair-display mb-2">
            Profile Details
          </h1>
          <p className="text-gray-600 inter">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture Section */}
          <div className="flex-shrink-0 text-center">
            <img
              src={photo}
              alt={name}
              className="w-40 h-40 rounded-full object-cover border-4 border-[#FF4B2B] mb-3"
            />
            <p className="text-sm text-gray-500 font-poppins">Profile Photo</p>
          </div>

          {/* User Details */}
          <div className="flex-grow">
            <h2 className="text-4xl font-bold text-[#FF4B2B] playfair-display mb-2">
              {name}
            </h2>
            <p className="text-gray-600 inter mb-4">
              Account Member since {memberSince}
            </p>

            <div className="mt-4 space-y-3 text-gray-700 text-lg">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="flex items-center gap-3 poppins">
                  <MdEmail className="text-xl text-[#FF6F3C]" />
                  <span className="inter">{email}</span>
                </p>
                {phone && (
                  <p className="flex items-center gap-3 mt-2 poppins">
                    <MdPhone className="text-xl text-[#FF6F3C]" />
                    <span className="inter">{phone}</span>
                  </p>
                )}
                {address && (
                  <p className="flex items-center gap-3 mt-2 poppins">
                    <MdLocationOn className="text-xl text-[#FF6F3C]" />
                    <span className="inter">{address}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-6 p-4 bg-teal-50 rounded-lg">
              <h3 className="text-lg font-semibold text-teal-700 poppins mb-2">
                Account Status
              </h3>
              <p className="text-teal-600 inter capitalize">{role || "user"}</p>
            </div>

            {/* Update Profile Button */}
            <button
              onClick={handleOpenModal}
              className="mt-6 flex items-center gap-2 bg-[#FF4B2B] text-white py-3 px-6 rounded-md text-lg poppins hover:bg-[#FF6F3C] transition-all"
            >
              <FaUserEdit /> Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      <UserUpdateModal
        open={isUpdateModalOpen}
        handleClose={handleCloseModal}
        currentUser={profile}
        refetch={refetch}
      />
    </div>
  );
};

export default Profile;
