import mongoose from "mongoose";

export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isPasswordUpdated: boolean;
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    facebookId: {
      type: String,
      unique: true, // Ensure only one record per Facebook user
    },
    isAuthorized: {
      type: Boolean,
      default: true, // Default to true; set to false when deauthorized
    },
    password: {
      type: String,
    },
    isPasswordUpdated: { 
      type: Boolean, 
      default: false 
    }, 
    image: {
      type: String,
    },
    isAdmin: { type: Boolean, required: true, default: false },
    cart: {
      type: Array,
      default: [],
    },
    addresses: {
      type: Array,
      default: [],
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.models?.User || mongoose.model("User", UserSchema);

export default UserModel;
