import { Request, Response } from "express";
import Article, { IArticle } from "../models/articaleModel";

export const fetchArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const articles: IArticle[] = await Article.find({});
    res.status(200).json({ data: articles });
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};
