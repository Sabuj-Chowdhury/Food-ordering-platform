import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { CartContext } from "../../context/CartContext";

const Menu = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const { addToCart } = useContext(CartContext);

  const [quantities, setQuantities] = useState({});

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

  const handleQtyChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    addToCart({ ...item, quantity, ownerEmail: data.email });
    toast.success(`${item.name} added to cart`);
  };

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
                {category}
              </h2>
              <ul className="space-y-6">
                {grouped[category].map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700 pb-4 gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border border-gray-600"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                      <span className="text-lg font-bold text-[#B6FF69] min-w-[80px] text-right">
                        ৳ {item.price}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border border-gray-600 rounded px-2 py-1">
                        <button
                          onClick={() => handleQtyChange(item.id, -1)}
                          className="text-white px-2 text-xl hover:text-[#B6FF69]"
                        >
                          −
                        </button>
                        <span className="min-w-[24px] text-white text-center">
                          {quantities[item.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item.id, 1)}
                          className="text-white px-2 text-xl hover:text-[#B6FF69]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-[#FF6F3C] text-white px-4 py-1 rounded hover:bg-[#e95b2e] transition font-semibold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-gray-400">
          <p>📞 {data.phone} • </p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
