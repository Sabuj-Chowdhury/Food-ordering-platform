import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const MyRestaurant = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["myRestaurant", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/restaurants/owner/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <LoadingSpinner />;

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] p-6 flex justify-center items-center">
        <p className="text-xl text-gray-600 inter">
          No restaurant found for your account.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E0] p-6">
      <h2 className="text-3xl playfair-display font-bold text-center text-[#FF4B2B] mb-8">
        My Restaurant
      </h2>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full md:w-60 h-40 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-[#FF6F3C] poppins mb-2">
              {restaurant.name}
            </h3>
            <p className="text-gray-700 inter mb-2">
              <span className="font-medium">Owner:</span> {restaurant.owner}
            </p>
            <p className="text-gray-700 inter mb-2">
              <span className="font-medium">Phone:</span> {restaurant.phone}
            </p>
            <p className="text-gray-700 inter mb-2">
              <span className="font-medium">Cuisine:</span> {restaurant.cuisine}
            </p>
            <p className="text-gray-700 inter">
              <span className="font-medium">Address:</span> {restaurant.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRestaurant;
