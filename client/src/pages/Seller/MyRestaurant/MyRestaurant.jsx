import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const MyRestaurant = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: myRestaurants = [], // <- default fallback here
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myRestaurant", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/restaurants/owner/${user?.email}`);
      return res.data?.restaurants || [];
    },
    enabled: !!user?.email,
  });

  const handleDelete = async (id) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "flex justify-center gap-4 mt-4", // 👈 clean spacing between buttons
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
      try {
        const res = await axiosSecure.delete(`/restaurants/${id}`);
        if (res.data.success) {
          await swalWithTailwindButtons.fire({
            title: "Deleted!",
            text: "Restaurant has been deleted.",
            icon: "success",
          });
          refetch();
        } else {
          toast.error("Failed to delete restaurant.");
        }
      } catch (err) {
        toast.error("Something went wrong.");
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithTailwindButtons.fire({
        title: "Cancelled",
        text: "Your restaurant is safe 😊",
        icon: "error",
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FAF3E0] p-4 sm:p-6">
      <h2 className="text-3xl sm:text-4xl text-center font-bold text-[#FF4B2B] playfair-display mb-8">
        🍽️ My Restaurants
      </h2>

      {myRestaurants.length === 0 ? (
        <p className="text-center text-lg sm:text-xl text-gray-600 inter">
          No restaurant found for your account.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md bg-white">
          <table className="min-w-[600px] w-full text-sm sm:text-base">
            <thead className="bg-[#FF4B2B] text-white text-left">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Address</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myRestaurants.map((restaurant) => (
                <tr
                  key={restaurant.id}
                  className="border-b border-gray-200 hover:bg-[#FFF7EC]"
                >
                  <td className="p-4">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-16 h-14 sm:w-20 sm:h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 font-semibold text-[#FF6F3C]">
                    {restaurant.name}
                  </td>
                  <td className="p-4 text-gray-800">{restaurant.address}</td>
                  <td className="p-4 text-center space-y-2 sm:space-y-0 sm:space-x-2 flex sm:justify-center flex-col sm:flex-row items-center">
                    <Link
                      to={`/dashboard/add-menu/${restaurant.id}`}
                      className="bg-[#B6FF69] text-[#2E2E2E] font-semibold px-3 py-1 rounded hover:brightness-110 transition w-full sm:w-auto text-center"
                    >
                      ➕ Add Menu
                    </Link>
                    <button
                      onClick={() => handleDelete(restaurant.id)}
                      className="bg-red-500 text-white font-semibold px-3 py-1 rounded hover:bg-red-600 transition w-full sm:w-auto"
                    >
                      🗑️ Delete
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

export default MyRestaurant;
