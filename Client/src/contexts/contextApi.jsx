import React, { createContext, useState, useEffect } from "react";
import { fetchDataFromAPI } from "../utils/api";

export const Context = createContext();

export const AppContext = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Maths or Physics or Chemistry or Coding");
    const [mobileMenu, setMobileMenu] = useState(false);

    useEffect(() => {
        if (selectedCategory) {
            fetchSelectedCategoryData(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchSelectedCategoryData = async (query) => {
        setLoading(true);
        try {
            const response = await fetchDataFromAPI("search/", query); // 👈 Pass query dynamically
            if (response && response.contents) {
                setSearchResults(response.contents);
            } else {
                setSearchResults([]); // Fallback for empty response
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setSearchResults([]);
        }
        setLoading(false);
    };

    return (
        <Context.Provider
            value={{
                loading,
                setLoading,
                searchResults,
                selectedCategory,
                setSelectedCategory,
                mobileMenu,
                setMobileMenu,
            }}
        >
            {children}
        </Context.Provider>
    );
};
