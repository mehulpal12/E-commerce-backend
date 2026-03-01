import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, userName, email, password, isLoggedIn } = req.body;
  console.log({ fullName, userName, email, password });

  if (
    [fullName, userName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const user = await User.create({
    fullName,
    userName,
    email,
    password,
    isLoggedIn,
  });

  const createdUser = await User.findById(user._id);
  if (!createdUser) {
    throw new ApiError("User creation failed, please try again", 500);
  }
  const loggedInUser = await User.findById(user._id);
  console.log(loggedInUser.isLoggedIn);
  const token = loggedInUser.generateAccessToken();
  return new ApiResponse(201, "user created done", { user: loggedInUser, token }).send(res);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, userName } = req.body;
  if (!userName && !email) {
    throw new ApiError(400, " on is required");
  }
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "user not exis");
  }

  const passwordVaild = await user.comparePassword(password);
  if (!passwordVaild) {
    throw new ApiError("password incorrect", 401);
  }
  const loggedInUser = await User.findById(user._id);
  console.log(loggedInUser.isLoggedIn);
  const token = loggedInUser.generateAccessToken();

  return new ApiResponse(200, "user logged in", { user: loggedInUser, token }).send(res);
});

// logout controller
const logoutUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOneAndUpdate({ email }, { isLoggedIn: false });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return new ApiResponse(200, "user logged out", { user }).send(res);
});

export { registerUser, loginUser, logoutUser };
