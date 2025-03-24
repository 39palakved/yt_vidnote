import axios from "axios"; 

export const BASE_URL = "https://youtube138.p.rapidapi.com";

export const fetchDataFromAPI = async (url, query) => {
  const options = {
    params: {
      q: query, // Dynamically passing query
      maxResults: 50,
    },
    headers: {
      'X-RapidAPI-Key': process.env.React_App_YOUTUBE_KEY,
      'X-RapidAPI-Host': 'youtube138.p.rapidapi.com',
    },
  };

  try {
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { contents: [] }; // Return empty array in case of error
  }
};
