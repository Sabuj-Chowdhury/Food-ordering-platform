import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { FaTrash, FaEdit } from "react-icons/fa";

const ManageMenu = () => {
  const axiosSecure = useAxiosSecure();
  const [deletingId, setDeletingId] = useState(null);

  const {
    data: menu = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await axiosSecure.get("/menu");
      return res.data;
    },
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
      <h2 className="text-3xl playfair-display font-bold text-center text-[#FF4B2B] mb-8">
        Manage Menu Items
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow inter">
          <thead className="bg-[#FF4B2B] text-white poppins">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item) => (
              <tr key={item.id} className="border-b hover:bg-[#FFF7F2]">
                <td className="p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </td>
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4 capitalize">{item.category}</td>
                <td className="p-4">৳ {item.price}</td>
                <td className="p-4 flex gap-2">
                  <button className="bg-[#FF6F3C] hover:bg-[#e95b2e] text-white px-4 py-2 rounded-md flex items-center gap-2">
                    <FaEdit /> Edit
                  </button>
                  <button
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
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
    </div>
  );
};

export default ManageMenu;
