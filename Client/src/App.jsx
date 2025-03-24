
//import './App.css';
import { useState } from 'react'
import {AppContext} from "./contexts/contextApi";
import { BrowserRouter,Routes,Route,useNavigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Feed from "./components/Feed"
import Header from './components/Header';
import LeftNav from './components/LeftNav'
import LeftNavMenuitem from './components/LeftNavMenuItem'
import SearchResult from './components/SearchResult'
import SearchResultVideoCard from './components/SearchResultVideoCard'
import Loggin from './components/Loggin'
import Siggnup from './components/Siggnup';
import VideoCard from './components/VideoCard'
import VideoDetails from './components/VideoDetails'
import Collections from './components/Collections';
import NoteDetails from './components/NoteDetails';
import MyFavNotes from './components/MyFavNotes';
;




function App() {
  

 
  return (
    <AppContext>
     <BrowserRouter>
     <div className="flex flex-col h-full"></div>
  
     
     <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Siggnup />} />
      <Route path="/Loggin" element={<Loggin />} />
      <Route path="/notevid/:noteId" element={<NoteDetails/>} /> 
      {/* NoteDetails is publicly accessible */}

      {/* Protected Routes */}
      <Route
        path="/Loggin/:feed"
        element={
          <PrivateRoute>
            <Feed />
          </PrivateRoute>
        }
      />
      <Route
        path="/searchResult/:searchQuery"
        element={
          <PrivateRoute>
            <SearchResult />
          </PrivateRoute>
        }
      />
      <Route
        path="/video/:id"
        element={
          <PrivateRoute>
            <VideoDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <PrivateRoute>
            <MyFavNotes />
          </PrivateRoute>
        }
      />
      <Route
        path="/collection"
        element={
          <PrivateRoute>
            <Collections />
          </PrivateRoute>
        }
      />
    </Routes>
     </BrowserRouter>
      
    </AppContext>
  )
}

export default App

