import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { imageUpload } from "../../../utils/imagebbAPI";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { TbFidgetSpinner } from "react-icons/tb";

const AddMenu = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosSecure = useAxiosSecure();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const imageFile = data.image[0];
      const imageURL = await imageUpload(imageFile);

      const menuItem = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        image: imageURL,
        createdAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/menu", menuItem);
      if (res.data.success) {
        toast.success("Menu item added successfully!");
        reset();
        setPreview(null);
      } else {
        toast.error(res.data.message || "Failed to add item.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-12 px-6 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <h2 className="text-3xl playfair-display font-bold text-[#FF4B2B] text-center mb-6">
          Add Menu Item
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 inter"
        >
          <div>
            <label className="block mb-2 poppins font-medium">Food Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="e.g., Chicken Biryani"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 poppins font-medium">
              Description
            </label>
            <textarea
              rows="3"
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Delicious biryani made with premium rice and spices."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 poppins font-medium">
                Price (BDT)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required" })}
                placeholder="e.g., 250"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 poppins font-medium">Category</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Category</option>
                <option value="main">Main Course</option>
                <option value="starter">Starter</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 poppins font-medium">
              Upload Food Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Image is required" })}
              onChange={handleImagePreview}
              className="cursor-pointer w-full px-4 py-2 file:bg-[#FF6F3C] file:text-white file:border-0 file:rounded-md border border-gray-300 rounded-lg"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 mt-3 rounded-lg border object-cover"
              />
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#B6FF69] text-[#121212] poppins font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition flex items-center gap-2"
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin text-xl" />
              ) : null}
              {loading ? "Adding..." : "Add Menu Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenu;
