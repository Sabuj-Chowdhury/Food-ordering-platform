import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyOrders = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["myOrders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/orders/user/${user?.email}`);
      return res.data.orders;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#FF4B2B] playfair-display mb-8 text-center">
          📦 My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            You haven't placed any orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left bg-white rounded-xl shadow">
              <thead className="bg-[#FF6F3C] text-white text-base">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-[#faf7f2] transition-all"
                  >
                    <td className="px-4 py-3">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-4 py-3 font-bold text-[#1A3D25]">
                      ৳ {order.total?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{order.payment_status}</td>
                    <td className="px-4 py-3 capitalize">
                      {order.payment_method}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {order.order_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
