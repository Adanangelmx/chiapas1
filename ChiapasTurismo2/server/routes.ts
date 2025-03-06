import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateItinerary } from "./api/openai";
import { handleTourGuideRequest } from "./api/tourGuide";
import { handleAITourGuide } from "./api/aiTourGuide";
import { handleOpenRouter } from "./api/openRouter";
import { handleSimpleChatbot } from "./api/simpleChatbot";

export async function registerRoutes(app: Express): Promise<Server> {
  // OpenAI API integration routes
  app.post('/api/openai/generate-itinerary', async (req, res) => {
    try {
      const { experienceType, duration, destinations, budget } = req.body;
      
      if (!experienceType || !duration || !budget) {
        return res.status(400).json({ 
          message: 'Missing required fields' 
        });
      }
      
      const itinerary = await generateItinerary(experienceType, duration, destinations, budget);
      res.json({ itinerary });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      res.status(500).json({ 
        message: 'Error generating itinerary', 
        error: (error as Error).message 
      });
    }
  });

  // API route for newsletter subscription
  app.post('/api/subscribe', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // Here you would typically save the email to a database
      // For now, just return success
      res.json({ success: true, message: 'Subscription successful' });
    } catch (error) {
      console.error('Error subscribing:', error);
      res.status(500).json({ 
        message: 'Error processing subscription', 
        error: (error as Error).message 
      });
    }
  });
  
  // API route for AI Tour Guide
  app.post('/api/tour-guide', handleTourGuideRequest);
  
  // API route for Advanced AI Tour Guide using DeepSeek Llama
  app.post('/api/ai-tour-guide', handleAITourGuide);
  
  // API route for OpenRouter using Claude
  app.post('/api/open-router', handleOpenRouter);
  
  // API route for Simple Chatbot using OpenAI
  app.post('/api/simple-chatbot', handleSimpleChatbot);

  const httpServer = createServer(app);

  return httpServer;
}
