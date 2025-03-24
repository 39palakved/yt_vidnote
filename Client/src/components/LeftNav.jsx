import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LeftNavMenuItem from "./LeftNavMenuItem";
import { Context } from "../contexts/contextApi";

import { AiFillHome } from "react-icons/ai";
import { RiLightbulbLine } from "react-icons/ri";

export const categories = [
    { name: "Home", icon: <AiFillHome />, type: "home" },
    { name: "Coding", icon: <RiLightbulbLine />, type: "category" },
    { name: "Java", icon: <RiLightbulbLine />, type: "category" },
    { name: "ReactJS", icon: <RiLightbulbLine />, type: "category" },
    { name: "DSA", icon: <RiLightbulbLine />, type: "category" },
    { name: "Python", icon: <RiLightbulbLine />, type: "category" },
    { name: "Machine Learning", icon: <RiLightbulbLine />, type: "category" },
    { name: "System Design", icon: <RiLightbulbLine />, type: "category" },
];

const LeftNav = () => {
    const { selectedCategory, setSelectedCategory } = useContext(Context);
    const navigate = useNavigate();

    const clickHandler = (name) => {
        setSelectedCategory(name); // Update the selected category
    };

    return (
        <div className="md:block w-[240px] overflow-y-auto h-full py-4 bg-black absolute md:relative z-10 transition-all">
            <div className="flex px-5 flex-col">
                {categories.map((item) => (
                    <React.Fragment key={item.name}>
                        <LeftNavMenuItem
                            text={item.name}
                            icon={item.icon}
                            action={() => clickHandler(item.name)}
                            className={selectedCategory === item.name ? "bg-orange-400" : ""}
                        />
                    </React.Fragment>
                ))}
                <hr className="my-5 border-white/[0.2]" />
            </div>
        </div>
    );
};

export default LeftNav;
