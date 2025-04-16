import { Link } from "react-router-dom";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-yellow-600 mb-4">
        ⚠️ Payment Cancelled
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        You have cancelled the payment. No charges were made.
      </p>
      <Link
        to="/checkout"
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
      >
        Return to Checkout
      </Link>
    </div>
  );
};

export default PaymentCancel;
