import { time } from "console";
import mongoose, { Schema } from "mongoose";

const ContactSchema = new Schema({
  name: {type:String,required:true},
  email: {type:String,required:true},
  phone: {type:String},
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
},
  { timestamps: true }
);

const ContactModel = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

export default ContactModel;

export type Contact = {
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
}