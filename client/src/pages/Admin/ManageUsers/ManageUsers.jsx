import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ManageUsers = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedStatus, setSelectedStatus] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", user?.email, currentPage],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/users?page=${currentPage}&limit=${itemsPerPage}`
      );
      return data;
    },
  });

  const handleStatusChange = async (id, status) => {
    setSelectedStatus((prev) => ({ ...prev, [id]: status }));
    await axiosSecure.patch(`/users/${id}`, { status });
    refetch();
    setDropdownOpen((prev) => ({ ...prev, [id]: false })); // Close dropdown after selection
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen inter">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-400 playfair-display">
        Manage Users
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700 text-green-400 poppins">
            <tr>
              <th className="p-4 text-left">Photo</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {usersData?.users?.map((user) => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="p-4">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">{selectedStatus[user.id] || "Pending"}</td>
                <td className="p-4 relative">
                  <button
                    className="flex items-center bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600"
                    onClick={() => toggleDropdown(user.id)}
                  >
                    Change Status <ChevronDown className="ml-2 w-4 h-4" />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen[user.id] && (
                    <div className="absolute bg-gray-700 text-white mt-2 py-2 w-32 rounded-md shadow-lg z-10">
                      <button
                        className="block px-4 py-2 hover:bg-gray-600 w-full text-left"
                        onClick={() => handleStatusChange(user.id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="block px-4 py-2 hover:bg-gray-600 w-full text-left"
                        onClick={() => handleStatusChange(user.id, "Denied")}
                      >
                        Deny
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-green-500 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="px-4 py-2 bg-gray-700 rounded-md">
          Page {currentPage} of {usersData?.totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= (usersData?.totalPages || 1)}
          className="px-4 py-2 bg-green-500 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <div className="text-center mt-4 text-gray-400">
        Total Users: {usersData?.totalUsers || 0}
      </div>
    </div>
  );
};

export default ManageUsers;
