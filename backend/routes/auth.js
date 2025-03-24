const express = require('express');
const User = require('../models/User');
const Note = require('../models/Notes');
const Comment = require('../models/Comment');
const axios = require("axios");
//const { Transcript } = require("youtube-transcript-fetcher");
require('dotenv').config();
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
 
const JWT_SECRET ='Palakisagood$girl';
// Route 1:create a user using : POST "/api/auth/createuser" . Doesn't require Auth

router.post('/createuser',[
    body('name','Enter A valid name').isLength({ min: 3 }),
    body('email','Enter a valid Email').isEmail(),
    body('password','password must be atlest 5 character').isLength({ min: 5 }),
],async(req,res)=>{
  let success=false;
    console.log(req.body);
   /* const user = User(req.body);
    user.save()*/
    //if there are error and bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
//check whether the user with this email exist already
try{




let user = await User.findOne({email:req.body.email});

if(user){
  return res.status(400).json({success,error:"sorry a user with this email already exist"})
}
//create a new user
const salt = await bcrypt.genSalt(10);
const secPass = await bcrypt.hash(req.body.password,salt) ;
    user = await User.create({
      name :req.body.name,
      password: secPass,
      email : req.body.email,
   
    });
    const data ={
      user:{
        id:user.id
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
   success=true; 
 res.json({success,authtoken});
  }
  catch(error){
    console.error(error.message);
    res.status(500).send("some error occured");
  }
}
  

    //res.send(res.body);
)
//Route 2: Authenticate a user . No login required
router.post('/login',[
  
  body('email','Enter a valid Email').isEmail(),
  body('password','password cannot be blank')
  
],async(req,res)=>{
 let success=false;
  const errors = validationResult(req);
  //if there are error return bad request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email , password} = req.body;
  try{
    let user = await User.findOne({email});
    if(!user){
      success=false;
      return res.status(400).json({error:"please try to login with correct credentials"});
    }
    const passwordCompare = await bcrypt.compare(password,user.password);
    if(!passwordCompare){
      success=false;
      return res.status(400).json({success,error:"please try to login with correct credentials"});
      
    }
    const data = {
      user:{
        id:user.id
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
  success=true;  
 res.json({success,authtoken,user:{ name: user.name, email: user.email} });
  }
  catch(error){
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});
//Route 3 : Get loggin user details using :post  here login required
router.post('/getuser',fetchuser,async(req,res)=>{
try{
const userid=req.user.id;
const user = await User.findById(userid).select("-password")
res.send(user);
}
catch(error){
 console.error(error.message);
 res.status(500).send("insternal Server Error");

}
})
// Route 4: Add a new note (Login Required)
router.post("/addnote", fetchuser, [
  body("videoId", "Video ID is required").notEmpty(),
  body("description", "Description must be at least 5 characters").isLength({ min: 5 })
], async (req, res) => {
  try {
      console.log("📩 Received Request Body:", req.body);
      console.log("🔑 User ID from Token:", req.user.id);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          console.log("❌ Validation Errors:", errors.array());
          return res.status(400).json({ errors: errors.array() });
      }

      const { videoId, description, tags } = req.body;

      const note = new Note({
          user: req.user.id,
          videoId,
          description,
          tags
      });

      const savedNote = await note.save();
      console.log("✅ Saved Note:", savedNote);

      res.json(savedNote);
  } catch (error) {
      console.error("❌ Error saving note:", error.message);
      res.status(500).send("Internal Server Error");
  }
});

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
      const notes = await Note.find({ user: req.user.id });
      
      if (!notes || notes.length === 0) {
          // If no notes are found, return early
          return res.status(404).json({ msg: "No notes found" });
      }

      // Return notes only once
      return res.json(notes);

  } catch (error) {
      console.error(error.message);

     
      if (!res.headersSent) {
          return res.status(500).send("Internal Server Error");
      }
  }
});
router.get("/fetchnote/:noteId", async (req, res) => {
  try {
    const noteId = req.params.noteId;

    // Find the note by noteId
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put('/updatenote/:noteId', async (req, res) => {
  const { noteId } = req.params;  
  const { description } = req.body;  
  try {
  
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    
    note.description = description;
    await note.save();

    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete('/deletenote/:noteId', async (req, res) => {
  const { noteId } = req.params;  
  try {
   
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post('/favorite', fetchuser, async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.favorites.includes(noteId)) {
      
      user.favorites = user.favorites.filter(id => id.toString() !== noteId);
    } else {
      // ⭐ Add to Favorites
      user.favorites.push(noteId);
    }

    await user.save();
    res.json(user.favorites);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
router.get('/favorite-notes', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching favorite notes for user:", userId);  // Debug log

    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      console.error("User not found in database");
      return res.status(404).json({ error: "User not found" });
    }

    
    res.json(user.favorites);
  } catch (error) {
    console.error("Error fetching favorite notes:", error.message);
    res.status(500).json({ error: "Server Error", message: error.message });
  }
});
router.put("/notes/:id/highlight", async (req, res) => {
  try {
    const { text, color } = req.body; // Text and color from frontend
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Add highlight to the array
    note.highlights.push({ text, color });
    await note.save();

    res.json({ message: "Highlight added successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/addcomment/:noteId", fetchuser, async (req, res) => {
  try {
      const { commentText } = req.body;
      const noteId = req.params.noteId;
      const userId = req.user.id; // ✅ Current logged-in user
     
      // 🛑 Check if note exists
      const note = await Note.findById(noteId);
      if (!note) {
          return res.status(404).json({ error: "Note not found" });
      }

      const ownerId = note.user; // ✅ Note owner (jisne note create kiya)

      // ✅ Create & Save Comment
      const newComment = new Comment({
          noteId,
          ownerId,
          userId,
          commentText
      });

      await newComment.save();
      res.json({ success: true, comment: newComment });

  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});
router.get("/getcomments/:noteId", fetchuser, async (req, res) => {
  try {
    const noteId = req.params.noteId;


    const comments = await Comment.find({ noteId }).populate("userId", "name");

    res.json({ comments }); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.delete("/deletecomment/:commentId", fetchuser, async (req, res) => {
  try {
      const commentId = req.params.commentId;
      const userId = req.user.id; 

     
      const comment = await Comment.findById(commentId);
      if (!comment) {
          return res.status(404).json({ error: "Comment not found" });
      }

      
      if (comment.userId.toString() !== userId && comment.ownerId.toString() !== userId) {
          return res.status(403).json({ error: "Unauthorized" });
      }

      await Comment.findByIdAndDelete(commentId);
      res.json({ success: true, message: "Comment deleted successfully" });

  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});
module.exports = router