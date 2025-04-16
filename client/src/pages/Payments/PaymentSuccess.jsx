import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const PaymentSuccess = () => {
  const { clearCart } = useContext(CartContext);

  // ✅ Clear cart once on mount, avoid infinite render loop
  useEffect(() => {
    clearCart();
  }, []); // 👈 empty dependency array ensures it runs only once

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        ✅ Payment Successful!
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        Thank you for your order. Your payment has been confirmed.
      </p>
      <Link
        to="/dashboard/my-orders"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
      >
        View My Orders
      </Link>
    </div>
  );
};

export default PaymentSuccess;
