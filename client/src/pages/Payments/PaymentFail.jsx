import { Link } from "react-router-dom";

const PaymentFail = () => {
  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        ❌ Payment Failed
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        Something went wrong. Please try again.
      </p>
      <Link
        to="/checkout"
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
      >
        Go Back to Checkout
      </Link>
    </div>
  );
};

export default PaymentFail;
