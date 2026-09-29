import { nanoid } from "nanoid";
import { shortenPostRequestBodySchema } from "../validations/req.validations.js"
import { db } from "../db/index.js";
import { URLsTable } from "../models/URLs.model.js";
import { eq,and } from "drizzle-orm";


export const shorternURL = async (req,res)=>{
   try { 
    const result = await shortenPostRequestBodySchema.safeParseAsync(req.body);

    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues[0].message,
      });
    }

    console.log(result.data);
    const {url,shortCode}= result.data;


    const finalShortCode = shortCode || nanoid(8);


    const [urlData]= await db.insert(URLsTable).values({
        shortCode:finalShortCode,
        targetUrl: url,
        userId:req.user.id

    }).returning({
        id: URLsTable.id,
        shortCode: URLsTable.shortCode,
        targetUrl: URLsTable.targetUrl
    });

    return res.status(201).json({message:"url shortened",urlData});

}catch(e){
    console.log(e);
        return res.status(500).json({message : "internal server issue"})
    }
}

export const getAllShortenedURLsByUser = async(req,res)=>{
    
    try{
        const urls= await db.select({id:URLsTable.id, targetUrl: URLsTable.targetUrl,shortCode: URLsTable.shortCode})
        .from(URLsTable)
        .where(eq(req.user.id,URLsTable.userId));

        if(urls.length==0)
            return res.status(404).json({message: "No shortened Urls were found"});

        return res.status(200).json({message:"URLs are fetched successfully",urls});
    }catch(e){
        console.log(e);
        return res.status(500).json({message: "internal server issue"})
    }

}

export const redirectURL = async(req,res)=>{

    try{
    const {shortCode} = req.params;

    const [redirectURL]= await db.select({  targetUrl: URLsTable.targetUrl })
    .from(URLsTable)
    .where(eq(URLsTable.shortCode,shortCode));

    if(!redirectURL){
         return res.status(404).json({message: "No shortened Urls were found"});
    }

    return res.redirect(redirectURL.targetUrl);
    }catch(e){
        console.log(e);
        return res.status(500).json({message: "internal server issue"});

    }
}

export const deleteUrl= async(req,res)=>{
   try{ const {id}= req.params;
    if(!id){
        return res.status(400).json({message: "need a valid url id"});
    }

    const [deletedurl] = await db.delete(URLsTable)
    .where(
        and(
            eq(URLsTable.id, id),
            eq(URLsTable.userId,req.user.id)
        ))
    .returning();

    if (!deletedurl) {
    return res.status(404).json({
        message: "URL not found"
    });
    }
    return res.status(200).json({message: "successfully deleted url", deletedurl})
}catch(e){
    console.log(e);
        return res.status(500).json({message : "internal server issue"})
    }
 
}