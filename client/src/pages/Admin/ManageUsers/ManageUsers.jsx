import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Modal, Box, Button, Typography } from "@mui/material";

const statusColors = {
  requested: "text-yellow-400 bg-yellow-800",
  approved: "text-green-400 bg-green-800",
  denied: "text-red-400 bg-red-800",
  pending: "text-gray-300 bg-gray-700",
};

const roleColors = {
  admin: "text-red-400 bg-red-800",
  seller: "text-blue-400 bg-blue-800",
  user: "text-gray-300 bg-gray-700",
};

const ManageUsers = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/admin/${user?.email}`);
      return data;
    },
  });

  const handleRoleChange = async (email, role) => {
    await axiosSecure.patch(`/users/update-role/${email}`, { role });
    refetch();
    setShowModal(false);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen inter">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-400 playfair-display">
        Manage Users
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700 text-green-400 poppins">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {usersData?.users?.map((user) => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                      statusColors[user.status?.toLowerCase()] ||
                      statusColors.pending
                    }`}
                  >
                    {user.status || "Pending"}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                      roleColors[user.role?.toLowerCase()] || roleColors.user
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td className="p-4 relative">
                  <button
                    className="flex items-center bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowModal(true);
                    }}
                  >
                    Change Role <ChevronDown className="ml-2 w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 300,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            className="text-center mb-4 poppins"
          >
            Change Role for {selectedUser?.name}
          </Typography>
          <div className="flex flex-col gap-2">
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRoleChange(selectedUser.email, "admin")}
            >
              Make Admin
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRoleChange(selectedUser.email, "seller")}
            >
              Make Seller
            </Button>
            <Button variant="outlined" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

      <div className="text-center mt-4 text-gray-400">
        Total Users: {usersData?.totalUsers || 0}
      </div>
    </div>
  );
};

export default ManageUsers;
