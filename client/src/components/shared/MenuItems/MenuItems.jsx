const MenuItems = ({ item }) => {
  const { image, name, recipe, price } = item;

  return (
    <div className="flex items-center bg-[#FFF6EE] text-[#2E2E2E] rounded-xl shadow-md p-5 mb-6 hover:shadow-lg transition duration-300 w-full">
      {/* Food Image */}
      <img
        src={image}
        alt={name}
        className="w-24 h-24 object-cover rounded-lg shadow-sm border-2 border-[#FF4B2B]"
      />

      {/* Text Content */}
      <div className="flex-1 px-6">
        <h4 className="text-[22px] font-bold text-[#FF4B2B] tracking-wide">
          {name}
        </h4>
        <p className="text-[16px] text-[#2E2E2E]/80 font-medium">{recipe}</p>
      </div>

      {/* Price & Button */}
      <div className="flex items-center gap-6">
        <span className="text-[#1A3D25] font-extrabold text-[20px]">
          ${price.toFixed(2)}
        </span>
        <button className="px-5 py-2 rounded-md text-white bg-[#FF4B2B] hover:bg-[#D63B1D] transition font-bold text-[14px] tracking-wide shadow-md uppercase">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuItems;
