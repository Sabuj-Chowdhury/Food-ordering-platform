import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { FaTrash, FaEdit } from "react-icons/fa";

const ManageMenu = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState(null);

  const {
    data: menu = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["menu", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/menu/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await axiosSecure.delete(`/menu/${id}`);
      if (res.data.success) {
        toast.success("Menu item deleted");
        refetch();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FAF3E0] p-6">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#FF4B2B] playfair-display mb-8">
        🍽️ Manage Menu Items
      </h2>

      {menu.length === 0 ? (
        <p className="text-center text-xl text-gray-600 mt-10">
          No menu items found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow bg-white">
          <table className="min-w-[900px] w-full text-sm sm:text-base">
            <thead className="bg-[#FF4B2B] text-white text-left poppins">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Food Name</th>
                <th className="p-4">Restaurant</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-[#FFF6ED]"
                >
                  <td className="p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-4 font-semibold text-[#FF6F3C]">
                    {item.name}
                  </td>
                  <td className="p-4 text-gray-800">{item.restaurant_name}</td>
                  <td className="p-4 capitalize">{item.category}</td>
                  <td className="p-4 font-medium">৳ {item.price}</td>
                  <td className="p-4 text-center flex flex-col sm:flex-row justify-center gap-2">
                    <button className="bg-[#FF6F3C] hover:bg-[#e95b2e] text-white px-3 py-2 rounded-md font-semibold flex items-center gap-2">
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md font-semibold flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaTrash />
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
