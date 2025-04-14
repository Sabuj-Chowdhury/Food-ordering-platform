import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const RequestPage = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    try {
      const res = await axiosSecure.patch(`users/status/${data.email}`);
      const { message, alreadyRequested } = res.data;

      if (alreadyRequested) {
        toast.error(
          "You have already requested. Please wait for admin approval."
        );
      } else {
        toast.success(message || "Request submitted successfully.");
        reset();
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] flex justify-center items-center px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">
        <h2 className="text-3xl playfair-display text-[#FF4B2B] text-center mb-6">
          Become a Seller
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 poppins">
              Restaurant Name
            </label>
            <input
              type="text"
              {...register("restaurantName", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] inter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 poppins">
              Your Full Name
            </label>
            <input
              type="text"
              {...register("ownerName", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] inter"
            />
          </div>

          {/* Email Display (disabled) */}
          <div>
            <label className="block text-sm font-medium mb-1 poppins">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg inter cursor-not-allowed"
            />
            {/* Hidden field to include email in submission */}
            <input type="hidden" {...register("email")} value={user?.email} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 poppins">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] inter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 poppins">
              Restaurant Address
            </label>
            <textarea
              rows="3"
              {...register("address", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6F3C] inter"
            ></textarea>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-[#B6FF69] text-[#121212] poppins font-semibold py-2 rounded-lg hover:brightness-110 transition-all"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestPage;
