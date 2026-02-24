import express from "express";
import { processChatMessage } from "../services/geminiService.js";
import doctorModel from "../models/doctorModel.js";

const chatRouter = express.Router();

chatRouter.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const aiResponse = await processChatMessage(message);

        if (!aiResponse.isHealthQuestion) {
            return res.json({
                success: true,
                isHealthQuestion: false,
                reply: "I am a health assistant chatbot and can only answer medical or health-related questions."
            });
        }

        const { detectedCategory, advice, disclaimer } = aiResponse;

        // Find doctors by speciality
        const doctors = await doctorModel.find({ speciality: detectedCategory });

        res.json({
            success: true,
            isHealthQuestion: true,
            reply: advice,
            category: detectedCategory,
            doctors: doctors.length > 0 ? doctors : [],
            message: doctors.length === 0 ? "Currently no specialists available in this category." : null,
            disclaimer
        });

    } catch (error) {
        console.error("Chat Route Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

export default chatRouter;
