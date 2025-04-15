import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ManageMenu = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState(null);

  // Filters & Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");

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
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "flex justify-center gap-4 mt-4",
        confirmButton:
          "bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded",
        cancelButton:
          "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded",
      },
      buttonsStyling: false,
    });

    const result = await swalWithTailwindButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setDeletingId(id);
      try {
        const res = await axiosSecure.delete(`/menu/${id}`);
        if (res.data.success) {
          await swalWithTailwindButtons.fire({
            title: "Deleted!",
            text: "Menu item has been deleted.",
            icon: "success",
          });
          refetch();
        } else {
          toast.error("Failed to delete");
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setDeletingId(null);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithTailwindButtons.fire({
        title: "Cancelled",
        text: "Your menu item is safe 😊",
        icon: "error",
      });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption("");
  };

  const filteredMenu = useMemo(() => {
    let result = [...menu];

    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (sortOption === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [menu, searchTerm, selectedCategory, sortOption]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FAF3E0] p-6">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#FF4B2B] playfair-display mb-8">
        🍽️ Manage Menu Items
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or restaurant"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-1/3"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-1/4"
        >
          <option value="">All Categories</option>
          <option value="main">Main</option>
          <option value="starter">Starter</option>
          <option value="dessert">Dessert</option>
          <option value="beverage">Beverage</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-1/4"
        >
          <option value="">Sort by</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price Low-High</option>
          <option value="price-desc">Price High-Low</option>
        </select>

        <button
          onClick={handleResetFilters}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md whitespace-nowrap"
        >
          Reset Filters
        </button>
      </div>

      {filteredMenu.length === 0 ? (
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
              {filteredMenu.map((item) => (
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
                    <Link
                      to={`/dashboard/update-menu/${item.id}`}
                      className="bg-[#FF6F3C] hover:bg-[#e95b2e] text-white px-3 py-2 rounded-md font-semibold flex items-center gap-2"
                    >
                      <FaEdit /> Edit
                    </Link>
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
