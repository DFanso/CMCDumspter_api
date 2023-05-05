import mongoose, { Schema, Document } from "mongoose";

export interface IArticle extends Document {
  title: string;
  body: string;
  author: string;
}

const ArticleSchema: Schema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: true },
});

export default mongoose.model<IArticle>("Article", ArticleSchema);
