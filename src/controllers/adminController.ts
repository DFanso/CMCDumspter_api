import { Request, Response } from "express";
import Article, { IArticle } from "../models/articaleModel";
import User, { IUser } from "../models/User";

export const addArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, body, currentUser } = req.body;
    const authorId = req.currentUser?.id;

    if (!authorId) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    const author: IUser | null = await User.findById(authorId);
    if (!author) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    const newArticle: IArticle = new Article({
      title,
      body,
      author: author?.name ?? "",
    });

    await newArticle.save();
    res
      .status(201)
      .json({ message: "Article added successfully", data: newArticle });
  } catch (error) {
    res.status(500).json({ message: "Error adding article", error });
  }
};

