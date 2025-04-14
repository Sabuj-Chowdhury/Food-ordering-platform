import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Restaurants = () => {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [filterCuisine, setFilterCuisine] = useState("");

  const { data: publicRestaurants = [], isLoading } = useQuery({
    queryKey: ["publicRestaurants"],
    queryFn: async () => {
      const res = await axiosPublic.get(`api/public/restaurants`);
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const filteredAndSorted = useMemo(() => {
    let result = [...publicRestaurants];

    if (searchTerm) {
      result = result.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCuisine) {
      result = result.filter((r) =>
        r.cuisine.toLowerCase().includes(filterCuisine.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "location") {
        return a.address.localeCompare(b.address);
      }
      return 0;
    });

    return result;
  }, [publicRestaurants, searchTerm, sortOption, filterCuisine]);

  return (
    <div className="bg-[#FAF3E0] min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#FF4B2B] playfair-display mb-10">
          🍴 Explore Restaurants on FoodZone
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:w-1/3"
          />

          <select
            value={filterCuisine}
            onChange={(e) => setFilterCuisine(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:w-1/4"
          >
            <option value="">All Cuisines</option>
            <option value="bangladeshi">Bangladeshi</option>
            <option value="seafood">Seafood</option>
            <option value="biryani">Biryani</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:w-1/4"
          >
            <option value="name">Sort by Name</option>
            <option value="location">Sort by Location</option>
          </select>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading restaurants...</p>
        ) : filteredAndSorted.length === 0 ? (
          <p className="text-center text-xl text-gray-500 mt-10">
            😔 No restaurants found with the current filters.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSorted.map((r) => (
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
