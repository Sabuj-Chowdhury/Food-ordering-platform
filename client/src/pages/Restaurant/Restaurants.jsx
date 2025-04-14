import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import useAxiosPublic from "../../hooks/useAxiosPublic";

const Restaurants = () => {
  const axiosPublic = useAxiosPublic();
  const { data: publicRestaurants = [], isLoading } = useQuery({
    queryKey: ["publicRestaurants"],
    queryFn: async () => {
      const res = await axiosPublic.get(`api/public/restaurants`);
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  return (
    <div className="bg-[#FAF3E0] min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#FF4B2B] playfair-display mb-10">
          🍴 Explore Restaurants on FoodZone
        </h1>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading restaurants...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publicRestaurants.map((r) => (
              <div
                key={r.id}
                className="bg-white shadow rounded-2xl overflow-hidden transition hover:scale-[1.01]"
              >
                <img
                  src={r.image}
                  alt={r.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <h2 className="text-2xl font-semibold text-[#FF6F3C] poppins">
                    {r.name}
                  </h2>
                  <p className="text-gray-600 inter text-sm mb-2">
                    {r.cuisine}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">📍 {r.address}</p>
                  <Link
                    to={`/restaurant/${r.id}`}
                    className="inline-block bg-[#B6FF69] text-[#121212] px-4 py-2 rounded-md font-semibold hover:brightness-110"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
