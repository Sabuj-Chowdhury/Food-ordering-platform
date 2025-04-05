const SectionTitle = ({ heading, subHeading }) => {
  return (
    <div className="mx-auto text-center md:w-5/12 my-12">
      <p className="text-[#FF6F3C] font-semibold tracking-wide mb-2 text-lg font-[poppins]">
        ✦ {subHeading} ✦
      </p>
      <h3 className="text-4xl font-[playfair-display] text-[#FF4B2B] uppercase border-y-4 border-[#FF9F68] py-4 tracking-wider shadow-sm">
        {heading}
      </h3>
    </div>
  );
};

export default SectionTitle;
