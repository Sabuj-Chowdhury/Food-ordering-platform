import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../utils/imagebbAPI";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { TbFidgetSpinner } from "react-icons/tb";

const AddRestaurant = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosSecure = useAxiosSecure();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const imageFile = data.image[0];
      const imageURL = await imageUpload(imageFile);

      const restaurantData = {
        name: data.name,
        owner: user.displayName,
        phone: data.phone,
        address: data.address,
        cuisine: data.cuisine,
        image: imageURL,
        email: user.email,
        createdAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/restaurants", restaurantData);
      if (res.data.success) {
        toast.success("Restaurant added successfully!");
        reset();
        setSelectedImage(null);
      } else {
        toast.error(res.data.message || "Failed to add restaurant.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while adding the restaurant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-12 px-6 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <h2 className="text-3xl playfair-display font-bold text-[#FF4B2B] text-center mb-6">
          Add Your Restaurant
        </h2>
        <p className="text-center text-gray-600 inter mb-8">
          List your restaurant on FoodZone and reach thousands of hungry
          customers!
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 inter"
        >
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-2 poppins font-medium">
              Restaurant Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Restaurant name is required" })}
              placeholder="e.g., Dhaka Biryani House"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 poppins font-medium">Owner Name</label>
            <input
              type="text"
              value={user?.displayName || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg focus:outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-2 poppins font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone", { required: "Phone number is required" })}
              placeholder="e.g., 017XXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block mb-2 poppins font-medium">
              Full Address
            </label>
            <textarea
              rows="3"
              {...register("address", { required: "Address is required" })}
              placeholder="e.g., House 12, Road 5, Dhanmondi, Dhaka"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 poppins font-medium">
              Cuisine Type
            </label>
            <input
              type="text"
              {...register("cuisine", { required: "Cuisine type is required" })}
              placeholder="e.g., Bangladeshi, Chinese, Fast Food"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
            />
            {errors.cuisine && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cuisine.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 poppins font-medium">
              Upload Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Image is required" })}
              onChange={handleImageChange}
              className="cursor-pointer w-full px-4 py-2 file:bg-[#FF6F3C] file:text-white file:border-0 file:rounded-md file:mr-4 border border-gray-300 rounded-lg focus:outline-none"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
            {selectedImage && (
              <div className="mt-3">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-20 h-20 object-contain rounded-md border"
                />
              </div>
            )}
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="cursor-pointer bg-[#B6FF69] text-[#121212] font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition poppins flex items-center gap-2"
            >
              {loading ? (
                <>
                  <TbFidgetSpinner className="animate-spin text-xl" />{" "}
                  Submitting...
                </>
              ) : (
                <>Add Restaurant</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;
