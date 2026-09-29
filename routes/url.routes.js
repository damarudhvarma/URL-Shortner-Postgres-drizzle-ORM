import { Router } from "express";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import { deleteUrl, getAllShortenedURLsByUser, redirectURL, shorternURL } from "../controller/url.controllers.js";


export const URLRouter= Router();

URLRouter.post("/shorten", verifyAuth, shorternURL);
URLRouter.get("/all-urls",verifyAuth,getAllShortenedURLsByUser);
URLRouter.get("/:shortCode",redirectURL);
URLRouter.delete("/:id",verifyAuth,deleteUrl);
