import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import useRole from "../../hooks/useRole";
import { useNavigate } from "react-router-dom";

import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Checkout = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } =
    useContext(CartContext);

  // console.log(cart);

  const { user } = useAuth();

  const [role] = useRole();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");
  const [method, setMethod] = useState("cod");

  const axiosPublic = useAxiosPublic();

  const handleCheckout = async () => {
    if (!name || !phone || !address || !method) {
      return toast.error("Please fill out all fields.");
    }

    const orderData = {
      user_name: name,
      user_phone: phone,
      user_email: user?.email,
      user_address: address,
      cart,
      total: cartTotal,
      paymentMethod: method,
    };

    try {
      if (method === "cod") {
        await axiosPublic.post("/api/order", orderData);
        clearCart();
        toast.success("Order placed successfully!");
        navigate("/dashboard/my-orders");
      } else if (method === "ssl") {
        const res = await axiosPublic.post("/api/ssl-payment", orderData);
        window.location.href = res.data.gateway_url;
      }
    } catch (err) {
      toast.error("Checkout failed.");
    }
  };

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center text-xl text-gray-700">
        🛒 Your cart is empty.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Delivery Info */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl font-bold text-[#FF4B2B] mb-4">
            Delivery Info
          </h2>

          {role === "admin" || role === "seller" ? (
            <p className="text-red-500 font-medium">
              🚫 Checkout is not available for admin or seller accounts.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-style border border-amber-400 p-2 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-style border border-amber-400 p-2 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={user?.email || ""}
                  readOnly
                  disabled
                  className="input-style border border-amber-400 p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                />

                <textarea
                  placeholder="Delivery Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="input-style resize-none col-span-full border border-amber-400 p-2 focus:outline-none"
                ></textarea>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-2 text-[#2E2E2E]">
                Payment Method
              </h3>
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Cash on Delivery */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={method === "cod"}
                    onChange={() => setMethod("cod")}
                  />
                  <FaMoneyBillWave className="text-green-600 text-xl" />
                  <span>Cash on Delivery</span>
                </label>

                {/* SSLCommerz */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="ssl"
                    checked={method === "ssl"}
                    onChange={() => setMethod("ssl")}
                  />
                  <FaCreditCard className="text-blue-500 text-xl" />
                  <span>Pay via SSLCommerz</span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-[#FF6F3C]">Your Order</h2>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-sm font-semibold">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      ৳ {item.price} x {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                  >
                    <FiMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                  <button onClick={() => removeFromCart(item.id)}>
                    <FiTrash2 className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}

            {/* Total & Conditional Payment Button */}
            <div className="text-right mt-6">
              <h3 className="text-xl font-bold text-[#1A3D25] mb-4">
                Total: ৳ {cartTotal.toFixed(2)}
              </h3>

              {role !== "admin" &&
                role !== "seller" &&
                (method === "cod" ? (
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#FF4B2B] hover:bg-[#e95b2e] text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
                  >
                    Place Order
                  </button>
                ) : (
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
                  >
                    Pay ৳ {cartTotal.toFixed(2)}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
