import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"


const registerUser = asyncHandler(async (req,res)  =>{
    const { fullName , userName, email, password,isLoggedIn } = req.body;
    // console.log({fullName,userName,email,password});

     if (
    [fullName, userName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new Error(400, "All fields are required");
  }
    
  const existingUser = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existingUser) {
    throw new Error("User with this email or username already exists", 409);
  }

  const user = await User.create({
    fullName,
    userName,
    email,
    password,
    isLoggedIn,
  })

   const createdUser = await User.findById(user._id);
  if (!createdUser) {
    throw new ApiError("User creation failed, please try again", 500);
  }
  return res.status(201).json({ message:"user created done" , user:user})
  
})

const loginUser = asyncHandler(async (req,res)=>{
    const {email, password, userName} = req.body;
    if (!userName && !email) {
    throw new ApiError(400, " on is required");
  }
  const user = await User.findOne({
    $or:[{ userName}, {email}]
  }) 
  if (!user) {
    throw new Error(404, "user not exis");
  }

  const passwordVaild = await user.comparePassword(password);
  if (!passwordVaild) {
    throw new ApiError(401, "password incorrect");
  }

  const loggedInUser = await User.findById(user._id);
  console.log(loggedInUser.isLoggedIn);
  


  return res
    .status(200).json(
       {message:"user login done ",user:loggedInUser}
    );




})

// logout controller
const logoutUser = asyncHandler(async (req, res) => {
  const { email } = req.body; 

  const user = await User.findOneAndUpdate(
    { email },
    { isLoggedIn: false },
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "User logged out successfully" });
});





export{
    registerUser,
    loginUser,
    logoutUser,
}