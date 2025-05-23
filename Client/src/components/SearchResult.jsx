import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { fetchDataFromAPI } from "../utils/api";
import { Context } from "../contexts/contextApi";
import LeftNav from "./LeftNav";
import SearchResultVideoCard from "./SearchResultVideoCard";
import Notes from "./Notes";
import Loggin from "./Loggin";

const SearchResult = () => {
    const [result, setResult] = useState();
    const { searchQuery } = useParams();
    const { setLoading } = useContext(Context);
    const {clickVideoId,setClickVideoId}=useState(null);

    useEffect(() => {
        document.getElementById("root").classList.remove("custom-h");
        fetchSearchResults();
    }, [searchQuery]);

    const fetchSearchResults = () => {
        setLoading(true);
        // fetchDataFromAPI(`search/?q=${searchQuery}`).then((res) => {
           
        //     setResult(res?.contents);
        //     setLoading(false);
        // });
        fetchDataFromAPI(`search/?q=${searchQuery}`).then((res) => {
           
            setResult(res?.contents);
            setLoading(false);
        });
    };
    const hndleVideoClick=(videoId)=>{
        setClickVideoId(videoId);
        
    };

    return (
        <div className="flex flex-row h-[calc(100%-56px)]">
            <LeftNav />
            <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black">
                <div className="grid grid-cols-1 gap-2 p-5">
                    {result?.map((item) => {
                        if (item?.type !== "video") return false;
                        let video = item.video;
                        return (
                            <SearchResultVideoCard
                                key={video.videoId}
                                video={video}
                                onClick={()=> hndleVideoClick(video.videoId)}
                            />
                        );
                    })}
                </div>
            </div>
       
        </div>
    );
};

export default SearchResult;