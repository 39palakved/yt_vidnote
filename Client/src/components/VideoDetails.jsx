
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import { BsFillCheckCircleFill } from "react-icons/bs";
import {useNavigate} from 'react-router-dom'
import { fetchDataFromAPI } from "../utils/api";
import { Context } from "../contexts/contextApi";
import Header from "./Header";
import Notes from "./Notes";
import Loggin from "./Loggin";
const VideoDetails = () => {
    const [video, setVideo] = useState();
    const [relatedVideos, setRelatedVideos] = useState();
    const pass = "OjlaUkllTss";
    const [notes, setNotes] = useState("");
    const { id } = useParams();
    const { setLoading } = useContext(Context);
    const nevigate = useNavigate();
    
    useEffect(() => {
        document.getElementById("root").classList.add("custom-h");
        fetchVideoDetails();
        fetchRelatedVideos();
    }, [id]);

    const fetchVideoDetails = () => {
        setLoading(true);
        fetchDataFromAPI(`video/details/?id=${id}`).then((res) => {
            console.log(id);
            setVideo(res);
            setLoading(false);
        });
    };

    const fetchRelatedVideos = () => {
        setLoading(true);
        fetchDataFromAPI(`video/related-contents/?id=${id}`).then((res) => {
            
            setRelatedVideos(res);
            setLoading(false);
        });
    };

    const handleNoteChange = (event) => {
        setNotes(event.target.value);
    };
   
    return (
        <div>
           
        <div className="flex justify-center  flex-row h-[calc(100%-70px)] mt-32 bg-black">
            <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
                <div className="flex flex-col ml-52 mt-5 lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6 overflow-y-auto">
                    <div className="h-[200px] md:h-[400px] lg:h-[400px] xl:h-[550px] ml-[-16px] lg:ml-0  ">
                        <ReactPlayer
                            url={`https://www.youtube.com/watch?v=${id}`}
                            controls
                            width="100%"
                            height="100%"
                            style={{ backgroundColor: "#000000" }}
                            playing={true}
                        />
                    </div>
                    <div className="text-white font-bold text-sm md:text-xl mt-4 line-clamp-2">
                        {video?.title}
                    </div>
                    <div className="flex justify-between flex-col md:flex-row mt-4">
                        <div className="flex">
                            <div className="flex items-start">
                                <div className="flex h-11 w-11 rounded-full overflow-hidden">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={video?.author?.avatar[0]?.url}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col ml-3">
                                <div className="text-white text-md font-semibold flex items-center">
                                    {video?.author?.title}
                                    {video?.author?.badges[0]?.type ===
                                        "VERIFIED_CHANNEL" && (
                                            <BsFillCheckCircleFill className="text-white/[0.5] text-[12px] ml-1" />
                                        )}
                                </div>
                                <div className="text-white/[0.7] text-sm">
                                    {video?.author?.stats?.subscribersText}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
               
                    
 




               
            </div>
            <div className=" mt-5  h-600">
            <Notes id={id} />
        </div>
        </div>
        
        </div>
    );
};

export default VideoDetails;
   