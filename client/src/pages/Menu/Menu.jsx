import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Menu = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();

  const { data, isLoading } = useQuery({
    queryKey: ["restaurantMenu", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/public/restaurant/${id}/menu`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center text-xl">
        Loading menu...
      </div>
    );
  }

  if (!data || !data.menu?.length) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center text-xl">
        🍽️ No menu items found for this restaurant.
      </div>
    );
  }

  const grouped = data.menu.reduce((acc, item) => {
    const cat = item.category || "Others";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-[#1A1A1A] min-h-screen py-12 px-4 sm:px-8 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-white playfair-display mb-2">
          {data.name}
        </h1>
        <p className="text-center text-gray-400 mb-10">
          {data.cuisine} • 📍 {data.address}
        </p>

        <div className="space-y-14">
          {Object.keys(grouped).map((category) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-orange-400 border-l-4 border-orange-400 pl-3 mb-6 uppercase">
                {category.replace(/^\w/, (c) => c.toUpperCase())}
              </h2>
              <ul className="space-y-3">
                {grouped[category].map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center border-b border-gray-700 pb-2"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-[#B6FF69]">
                      ৳ {item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Optional: Contact + Footer */}
        <div className="mt-16 text-center text-sm text-gray-400">
          <p>📞 123-456-7890 • 📍 123 Anywhere St., Any City</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
