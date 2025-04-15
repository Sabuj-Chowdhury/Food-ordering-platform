import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

const Checkout = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } =
    useContext(CartContext);

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center text-xl text-gray-700">
        🛒 Your cart is empty. Go add something delicious!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl playfair-display font-bold text-[#FF4B2B] mb-10 text-center">
          Checkout
        </h1>

        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold text-[#2E2E2E]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ৳ {item.price} x {item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  className="p-2 rounded border border-gray-400 text-sm hover:text-[#FF6F3C]"
                >
                  <FiMinus />
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 rounded border border-gray-400 text-sm hover:text-[#FF6F3C]"
                >
                  <FiPlus />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 rounded text-red-500 hover:text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Grand Total */}
        <div className="mt-10 bg-white rounded-xl shadow-md p-6 text-right">
          <h2 className="text-2xl font-bold text-[#1A3D25]">
            Total: ৳ {cartTotal.toFixed(2)}
          </h2>
          <button
            onClick={() => {
              // fake order placing
              alert("Order placed!");
              clearCart();
            }}
            className="mt-4 bg-[#FF4B2B] hover:bg-[#e04723] text-white px-6 py-2 rounded-lg text-lg font-semibold transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
