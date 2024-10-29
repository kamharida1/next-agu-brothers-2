import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {type:String,required:true},
  parent: {type:mongoose.Types.ObjectId, ref:'Category'},
  properties: [{type:Object}]
});

const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default CategoryModel;

export type Category = {
  _id: string;
  name: string;
  parent: Category;
  properties: [{name:string, values:any}];
}