import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SlMenu } from "react-icons/sl";
import { IoIosSearch } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import Loader from "../shared/Loader";
import { Context } from "../contexts/contextApi";

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState(null);

    const { loading, mobileMenu, setMobileMenu } = useContext(Context);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const pageName = pathname?.split("/")?.filter(Boolean)?.[0];

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        console.log("user data", storedUser);
       
        // Check if the user data is a string that needs parsing
        if (storedUser && typeof storedUser === "string") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Error parsing user data:", err);
            }
        } else {
            setUser(storedUser);  // In case it's already an object
        }
    }, []);
    
    const searchQueryHandler = (event) => {
        if ((event?.key === "Enter" || event === "searchButton") && searchQuery?.length > 0) {
            navigate(`/searchResult/${searchQuery}`);
        }
    };

    const mobileMenuToggle = () => {
        setMobileMenu(!mobileMenu);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token"); 
        window.location.href = "/Loggin";
    };

    return (
        <div className="sticky top-0 z-10 flex flex-row items-center justify-between h-[65px] px-4 md:px-5 bg-black">
            {loading && <Loader />}
            
            {/* Mobile Menu Button */}
            {pageName !== "video" && (
                <div className="flex md:hidden cursor-pointer items-center h-10 w-10 rounded-full hover:bg-[#303030]/[0.6]" onClick={mobileMenuToggle}>
                    {mobileMenu ? <CgClose className="text-orange-400 text-2xl" /> : <SlMenu className="text-orange-400 text-2xl" />}
                </div>
            )}

            {/* Logo */}
            <Link to="/" className="flex h-5 items-center">
                <img className="h-full md:hidden" src="https://cdn4.vectorstock.com/i/1000x1000/68/18/with-laptop-pen-shape-that-on-a-cartoon-vector-23216818.jpg" alt="Logo"/>
            </Link>

            {/* Search Bar */}
            <div className="group flex items-center">
                <div className="flex h-8 md:h-10 border border-[#303030] rounded-l-3xl">
                    <input
                        type="text"
                        className="bg-transparent outline-none text-white px-5 w-44 md:w-64 lg:w-[500px]"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyUp={searchQueryHandler}
                        placeholder="Search.. by name or link"
                        value={searchQuery}
                    />
                </div>
                <button className="w-[40px] md:w-[60px] h-8 md:h-10 bg-white/[0.1]" onClick={() => searchQueryHandler("searchButton")}>
                    <IoIosSearch className="text-orange-400 text-2xl" />
                </button>
            </div>

            {/* User Section */}
            <div>
    <h4 
        className="ml-4 text-white text-xl font-semibold uppercase cursor-pointer transition-all duration-300 ease-in-out hover:text-orange-500 hover:scale-105 hover:shadow-lg hover:bg-orange-200 hover:rounded-lg p-2"
        onClick={() => { navigate('/collection') }}
    >
        My Collections
    </h4>
</div>
            <div className="flex items-center">
                <button className="w-[50px] md:w-[100px] h-6 bg-orange-400 hover:bg-orange-500 text-white rounded-md" onClick={handleLogout}>
                    Log-Out
                </button>

                <div className="ml-4 text-white">
                    <h3>{user?.name || "Guest"}</h3> 
                    
                </div>

                <div className="flex h-8 w-8 overflow-hidden rounded-full ml-4">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1ytQ8j3d-ZZpQRd4BAQmR9JOAd4KhqYtXbtaXj1-bMKM_qyPC50oTbqY&s" alt="User Avatar" />
                </div>
            </div>
        </div>
    );
};

export default Header;
