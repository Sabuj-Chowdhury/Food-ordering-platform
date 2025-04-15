import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-hot-toast";
import { useState } from "react";

const statusOptions = [
  "pending",
  "preparing",
  "out for delivery",
  "delivered",
  "canceled",
];
const sortOptions = ["date-desc", "date-asc", "total-desc", "total-asc"];

const ManageOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["sellerOrders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/orders/seller/${user?.email}`);
      return res.data.orders;
    },
    enabled: !!user?.email,
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosSecure.patch(`/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success(`Order marked as "${newStatus}"`);
      refetch();
    } catch (err) {
      toast.error("Failed to update order status.");
    }
  };

  const handleResetFilters = () => {
    setSearchText("");
    setFilterStatus("all");
    setSortBy("date-desc");
  };

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.user_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.user_email?.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || order.order_status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "date-asc")
        return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "total-desc") return b.total - a.total;
      if (sortBy === "total-asc") return a.total - b.total;
      return 0;
    });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FAF3E0] p-6">
      <h2 className="text-3xl playfair-display font-bold text-center text-[#FF4B2B] mb-6">
        Manage Orders
      </h2>

      {/* 🔍 Controls */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by customer..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full sm:w-1/4"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-1/4"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-1/4"
        >
          <option value="date-desc">Sort by Date (Newest)</option>
          <option value="date-asc">Sort by Date (Oldest)</option>
          <option value="total-desc">Sort by Total (High to Low)</option>
          <option value="total-asc">Sort by Total (Low to High)</option>
        </select>

        <button
          onClick={handleResetFilters}
          className="bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 font-semibold px-4 py-2 rounded-md"
        >
          Reset
        </button>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left bg-white rounded-xl shadow">
          <thead className="bg-[#FF6F3C] text-white text-base">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-[#FFF7F2] transition-all"
              >
                <td className="px-4 py-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {order.user_name} <br />
                  <span className="text-xs text-gray-500">
                    {order.user_email}
                  </span>
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
                <td className="px-4 py-3 font-bold text-[#1A3D25] whitespace-nowrap">
                  ৳ {order.total?.toFixed(2)}
                </td>
                <td className="px-4 py-3 capitalize text-sm">
                  {order.payment_status}
                </td>
                <td className="px-4 py-3 capitalize text-sm">
                  {order.payment_method}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                      order.order_status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : order.order_status === "delivered"
                        ? "bg-green-200 text-green-800"
                        : order.order_status === "canceled"
                        ? "bg-red-200 text-red-800"
                        : order.order_status === "preparing"
                        ? "bg-blue-100 text-blue-700"
                        : order.order_status === "out for delivery"
                        ? "bg-purple-200 text-purple-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.order_status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
