// ...imports stay same
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["paymentHistory", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/orders/user/${user?.email}`);
      return res.data.orders || [];
    },
    enabled: !!user?.email,
  });

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("date-desc");
  };

  const filteredPayments = useMemo(() => {
    let data = [...payments];

    if (searchTerm) {
      data = data.filter((order) =>
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((order) => order.payment_status === statusFilter);
    }

    if (sortBy === "date-asc") {
      data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "date-desc") {
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "amount-asc") {
      data.sort((a, b) => a.total - b.total);
    } else if (sortBy === "amount-desc") {
      data.sort((a, b) => b.total - a.total);
    }

    return data;
  }, [payments, searchTerm, statusFilter, sortBy]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FAF3E0] p-6">
      <h2 className="text-3xl playfair-display font-bold text-center text-[#FF4B2B] mb-6">
        💳 Payment History
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/3"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/4"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/4"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Amount: High to Low</option>
          <option value="amount-asc">Amount: Low to High</option>
        </select>
        <button
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-full sm:w-auto text-sm font-medium"
        >
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#FF6F3C] text-white text-base">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Delivery</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-[#FFF7F2] transition-all"
              >
                <td className="px-4 py-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <ul className="list-disc list-inside text-xs text-gray-700">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 font-semibold text-[#1A3D25]">
                  ৳ {order.total?.toFixed(2)}
                </td>
                <td className="px-4 py-3 capitalize">{order.payment_method}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                      order.payment_status === "paid"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                      order.order_status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.order_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.order_status === "preparing"
                        ? "bg-blue-100 text-blue-800"
                        : order.order_status === "out for delivery"
                        ? "bg-purple-100 text-purple-800"
                        : order.order_status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <p className="text-center mt-6 text-gray-600">
          No payment history found.
        </p>
      )}
    </div>
  );
};

export default PaymentHistory;
