import { Request, Response } from "express"
import prisma from "../db/db";
import openai from "../config/openai";


//controller function to make revision
export const makeRevision = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const { projectId } = req.params;
        const { message } = req.body;


        if (!projectId) {
            return res.status(400).json({ message: "projectId is required" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },

        })
        if (!userId || !user) {
            return res.status(401).json({ message: "unauthorized" })
        }

        if (user.credits < 5) {
            return res.status(403).json({ message: "add more credits to make changes" })
        }

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: "please enter a valid prompt" })
        }

        const currentProject = await prisma.websiteProject.findUnique({
            where: { id: projectId, userId },
            include: { versions: true }
        })

        if (!currentProject) {
            return res.status(404).json({ message: 'project not found' })
        }

        await prisma.conversation.create({
            data: {
                role: 'user',
                content: message,
                projectId
            },
        })

        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: 5 } },
        })

        const promptEnhanceResponse = await openai.chat.completions.create({
            model: 'z-ai/glm-4.5-air:free',
            messages: [
                {
                    role: 'system',
                    content:
                        ` You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

    Enhance this prompt by:
    1. Adding specific design details (layout, color scheme, typography)
    2. Specifying key sections and features
    3. Describing the user experience and interactions
    4. Including modern web design best practices
    5. Mentioning responsive design requirements
    6. Adding any missing but important elements

Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (2-3 paragraphs max).
`
                },
                {
                    role: 'user',
                    content: `User request : ${message}`,

                }
            ]
        })


        const enhancePrompt = promptEnhanceResponse.choices[0]?.message.content;
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: `I have enhanced your prompt to :${enhancePrompt}`,
                projectId
            }
        })

        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: "now making changes to your website...",
                projectId
            }
        })

        //generate website code
        const codeGenerationResponse = await openai.chat.completions.create({
            model: 'z-ai/glm-4.5-air:free',
            messages: [
                {
                    role: 'system',
                    content:
                        `You are an expert web developer. 

    CRITICAL REQUIREMENTS:,
    - Return ONLY the complete updated HTML code with the requested changes.
    - Use Tailwind CSS for ALL styling (NO custom CSS).
    - Use Tailwind utility classes for all styling changes.
    - Include all JavaScript in <script> tags before closing </body>
    - Make sure it's a complete, standalone HTML document with Tailwind CSS
    - Return the HTML Code Only, nothing else

    Apply the requested changes while maintaining the Tailwind CSS styling approach.`
                },
                {
                    role:"user",
                    content: `Here is the current website code:${currentProject.current_code} "the user wants this :"${enhancePrompt} `
                }
            ]
        })

        const code = codeGenerationResponse.choices[0]?.message.content || '';
        const version = await prisma.version.create({
            data:{
                code:code.replace(/'''[a-z]*\n?/gi,'').replace(/'''$/gi,'').trim(),
                description:"changes made",
                projectId
            }
        })

        await prisma.conversation.create({
            data:{
                role:"assistant",
                content:"i have made the changes to your website! you can now preview it",
                projectId
            }
        })

        await prisma.websiteProject.update({
            where:{id:projectId},
            data:{
                current_code: code.replace(/'''[a-z]*\n?/gi,'').replace(/'''$/gi,'').trim(),
                current_version_index:version.id,
                
            }
        })

        res.json({message:'changes made successfully'})
    } catch (error: any) {
       await prisma.user.update({
        where:{id:userId},
        data:{credits : {decrement:5}}
       })
        console.log(error.message);
        return res.status(500).json({ message: error.message })
    }
}


//controller  function to rollback to a specific version 
export const rollbackToVersion = async(req:Request,res:Response)=>{
    try{
        const userId = req.userId;

        if(!userId){
            return res.status(401).json({message:"unauthorized"})
        }
        const {projectId,versionId} = req.params

        if(!projectId){
            return res.status(404).json({message:"project not found"})
        }
        const project = await prisma.websiteProject.findUnique({
            where:{id:projectId},
            include:{versions:true},
        })

        if(!project){
            return res.status(401).json({message:"project not found"})
        }
        const version = project.versions.find((version)=>version.id===versionId)
        if(!version){
            return res.status(404).json({message:"version not found"})
        }

        await prisma.websiteProject.update({
            where:{id:projectId,userId},
            data:{
                current_code:version.code,
                current_version_index:version.id
            }
        })

        await prisma.conversation.create({
            data:{
                role:"assistant",
                content:"i have rolled back your website to selected version.You can now preview it",
                projectId
            }
        })
        res.json({message:'version rolled back'})
    }catch(error:any){
        console.log(error.code || error.message)
        res.status(500).json({message:error.message})

    }
}

//controller to delete a project 

export const deleteProject= async (req: Request, res: Response)=>{
    try{
        const userId = req.userId
        const {projectId} = req.params;

        await prisma.websiteProject.delete({
            where:{id:projectId,userId},

        })

        res.json({message:"project deleted sucessfully"})

    }catch(error:any){
        console.log(error.code || error.message);
        res.status(500).json({message:error.message})
    }
}



export const getProjectPreview= async (req: Request, res: Response)=>{
    try{
       const userId = req.userId;
       const {projectId} = req.params


       if(!userId){
        return res.status(401).json({message:"Unauthorized"})
       }


       const project = await prisma.websiteProject.findFirst({
        where:{id:projectId,userId},
        include:{
            versions:true
        }
       })

       if(!project){
        return res.status(404).json({message:"project not found"})
       }

       res.json({project});
    }catch(error:any){
            console.log(error.code || error.message);
            res.status(500).json({message:error.message})
    }
}

//get published projects
export const getPublishedProjects = async(req:Request,res:Response)=>{
    try{
        const projects = await prisma.websiteProject.findMany({
            where:{isPublished:true},
            include:{user:true}
        })

        res.json({projects})
    }catch(error:any){
        console.log(error.code || error.message)
        res.status(500).json({message:error.message})
    }
}


export const getProjectById = async(req:Request,res:Response)=>{
    try{   
        const {projectId} = req.params;
        const project = await prisma.websiteProject.findFirst({
            where:{id : projectId},

        })
        if(!project || project.isPublished === false || !project.current_code){
            
            return res.status(404).json({message:"project not found"})
        }

        res.json({code:project.current_code})
    }catch(error:any){
        console.log(error.code || error.message)
        return res.status(500).json({message:error.message})
    }

    
}


//controller to save project
export const saveProjectCode = async(req:Request,res:Response)=>{
    try{
        const userId = req.userId
        const {projectId} = req.params
        const {code} =req.body
        if(!userId){
            return res.status(401).json({message:'unauthorized'})

        }

        if(!code){
            return res.status(400).json({message:"code is required"})

        }

        const project = await prisma.websiteProject.findUnique({
            where:{id:projectId,userId},

        })
        if(!project){
            return res.status(404).json({message:"project not found"})
        }
        await prisma.websiteProject.update({
            where:{id:projectId},
            data:{current_code:code,current_version_index:''}
        })

        res.json({message:"project saved sucessfully"})

    }catch(error:any){
        console.log(error.code || error.message)
        res.status(500).json({message:error.message})
    }
}



// import { Request, Response } from "express";
// import prisma from "../db/db";
// import openai from "../config/openai";

// /* -------------------------------- MAKE REVISION -------------------------------- */

// export const makeRevision = async (req: Request, res: Response) => {
//   const userId = req.userId;
//   const { projectId } = req.params;
//   const { message } = req.body;

//   if (!userId) {
//     return res.status(401).json({ message: "unauthorized" });
//   }

//   if (!projectId) {
//     return res.status(400).json({ message: "projectId is required" });
//   }

//   if (!message || message.trim() === "") {
//     return res.status(400).json({ message: "please enter a valid prompt" });
//   }

//   try {
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user || user.credits < 5) {
//       return res
//         .status(403)
//         .json({ message: "add more credits to make changes" });
//     }

//     const project = await prisma.websiteProject.findUnique({
//       where: { id: projectId },
//       include: { versions: true },
//     });

//     if (!project || project.userId !== userId) {
//       return res.status(404).json({ message: "project not found" });
//     }

//     /* ---------------------------- AI: enhance prompt ---------------------------- */

//     const enhanceResponse = await openai.chat.completions.create({
//       model: "z-ai/glm-4.5-air:free",
//       messages: [
//         {
//           role: "system",
//           content: `You are a prompt enhancement specialist. Expand the user request with layout, design, UX, responsiveness and best practices. Return ONLY the enhanced prompt.`,
//         },
//         {
//           role: "user",
//           content: `User request: ${message}`,
//         },
//       ],
//     });

//     const enhancedPrompt =
//       enhanceResponse.choices[0]?.message?.content;

//     if (!enhancedPrompt) {
//       throw new Error("Failed to enhance prompt");
//     }

//     /* ---------------------------- AI: generate code ----------------------------- */

//     const codeResponse = await openai.chat.completions.create({
//       model: "z-ai/glm-4.5-air:free",
//       messages: [
//         {
//           role: "system",
//           content: `You are an expert web developer.
// - Return ONLY full HTML
// - Use Tailwind CSS only
// - Include JS in <script>
// - No markdown`,
//         },
//         {
//           role: "user",
//           content: `Current code:\n${project.current_code}\n\nRequested changes:\n${enhancedPrompt}`,
//         },
//       ],
//     });

//     const rawCode = codeResponse.choices[0]?.message?.content || "";

//     const cleanCode = rawCode
//       .replace(/```[a-z]*\n?/gi, "")
//       .replace(/```$/gi, "")
//       .trim();

//     /* ---------------------------- TRANSACTION START ----------------------------- */

//     await prisma.$transaction(async (tx) => {
//       const version = await tx.version.create({
//         data: {
//           code: cleanCode,
//           description: "revision update",
//           projectId,
//         },
//       });

//       await tx.conversation.createMany({
//         data: [
//           { role: "user", content: message, projectId },
//           {
//             role: "assistant",
//             content: `I have enhanced your prompt:\n${enhancedPrompt}`,
//             projectId,
//           },
//           {
//             role: "assistant",
//             content: "I have updated your website. You can preview it now.",
//             projectId,
//           },
//         ],
//       });

//       await tx.websiteProject.update({
//         where: { id: projectId },
//         data: {
//           current_code: cleanCode,
//           current_version_index: version.id,
//         },
//       });

//       await tx.user.update({
//         where: { id: userId },
//         data: { credits: { decrement: 5 } },
//       });
//     });

//     res.json({ message: "changes made successfully" });
//   } catch (error: any) {
//     console.error(error.message);
//     res.status(500).json({ message: "internal server error" });
//   }
// };

// /* ----------------------------- ROLLBACK VERSION ----------------------------- */

// export const rollbackToVersion = async (req: Request, res: Response) => {
//   const userId = req.userId;
//   const { projectId, versionId } = req.params;

//   if (!userId) return res.status(401).json({ message: "unauthorized" });
//   if (!projectId || !versionId)
//     return res.status(400).json({ message: "invalid params" });

//   try {
//     const project = await prisma.websiteProject.findUnique({
//       where: { id: projectId },
//       include: { versions: true },
//     });

//     if (!project || project.userId !== userId) {
//       return res.status(404).json({ message: "project not found" });
//     }

//     const version = project.versions.find(v => v.id === versionId);
//     if (!version) {
//       return res.status(404).json({ message: "version not found" });
//     }

//     await prisma.$transaction([
//       prisma.websiteProject.update({
//         where: { id: projectId },
//         data: {
//           current_code: version.code,
//           current_version_index: version.id,
//         },
//       }),
//       prisma.conversation.create({
//         data: {
//           role: "assistant",
//           content: "Website rolled back to selected version.",
//           projectId,
//         },
//       }),
//     ]);

//     res.json({ message: "version rolled back" });
//   } catch (error: any) {
//     console.error(error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

/* ----------------------------- DELETE PROJECT ----------------------------- */

// export const deleteProject = async (req: Request, res: Response) => {
//   const userId = req.userId;
//   const { projectId } = req.params;

//   if (!userId) return res.status(401).json({ message: "unauthorized" });

//   try {
//     const project = await prisma.websiteProject.findUnique({
//       where: { id: projectId },
//     });

//     if (!project || project.userId !== userId) {
//       return res.status(404).json({ message: "project not found" });
//     }

//     await prisma.websiteProject.delete({ where: { id: projectId } });

//     res.json({ message: "project deleted successfully" });
//   } catch (error: any) {
//     console.error(error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

// /* ----------------------------- PREVIEW PROJECT ----------------------------- */

// export const getProjectPreview = async (req: Request, res: Response) => {
//   const userId = req.userId;
//   const { projectId } = req.params;

//   if (!userId) return res.status(401).json({ message: "unauthorized" });

//   try {
//     const project = await prisma.websiteProject.findUnique({
//       where: { id: projectId },
//       include: { versions: true },
//     });

//     if (!project || project.userId !== userId) {
//       return res.status(404).json({ message: "project not found" });
//     }

//     res.json({ project });
//   } catch (error: any) {
//     console.error(error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

// /* ----------------------------- SAVE PROJECT CODE ----------------------------- */

// export const saveProjectCode = async (req: Request, res: Response) => {
//   const userId = req.userId;
//   const { projectId } = req.params;
//   const { code } = req.body;

//   if (!userId) return res.status(401).json({ message: "unauthorized" });
//   if (!code) return res.status(400).json({ message: "code is required" });

//   try {
//     const project = await prisma.websiteProject.findUnique({
//       where: { id: projectId },
//     });

//     if (!project || project.userId !== userId) {
//       return res.status(404).json({ message: "project not found" });
//     }

//     await prisma.websiteProject.update({
//       where: { id: projectId },
//       data: { current_code: code, current_version_index: "" },
//     });

//     res.json({ message: "project saved successfully" });
//   } catch (error: any) {
//     console.error(error.message);
//     res.status(500).json({ message: error.message });
//   }
// };






