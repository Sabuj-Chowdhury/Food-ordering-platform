import { useEffect, useState } from "react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import MenuItems from "../../../components/shared/MenuItems/MenuItems";

const PopularItems = () => {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    fetch("menu.json")
      .then((res) => res.json())
      .then((data) => {
        const popularItems = data.filter((item) => item.category === "popular");
        setMenu(popularItems);
      });
  }, []);
  return (
    <div className="py-16 bg-[#FAF3E0] text-[#2E2E2E] text-center">
      <SectionTitle
        heading="From Our Menu"
        subHeading="Popular Items"
      ></SectionTitle>

      <div className="space-y-4 w-full max-w-5xl mx-auto">
        {menu.map((item, idx) => (
          <MenuItems key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default PopularItems;
