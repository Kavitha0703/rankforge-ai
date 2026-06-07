import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  // Endpoint to call Gemini API
  app.post('/api/ai', async (req, res) => {
    try {
      const { prompt, systemInstruction, temperature } = req.body;
      if (!ai) {
        return res.status(200).json({ 
          text: `[Offline Demo Mode] Aris here! I am currently working without a configured Gemini API key, but here is a simulated mentor answer to keep your preparation going: "Focus on understanding probability and database normalizations to raise your score by 15%. Practice at least 15 mock questions today."` 
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are Aris, the personal AI level exam mentor for entrance preparation.",
          temperature: temperature !== undefined ? temperature : 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Error generating content from Gemini:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Specialized endpoint for Knowledge Vault File Analysis
  app.post('/api/analyze-vault-file', async (req, res) => {
    try {
      const { fileName, fileType, fileData } = req.body;
      
      if (!ai) {
        return res.json({
          summary: "Simulation: This document covers advanced concepts in probability and statistics.",
          formulas: ["P(A|B) = P(B|A)P(A)/P(B)", "E[X] = Σ xP(x)"],
          flashcards: [
            { question: "What is Bayes Theorem?", answer: "A formula that describes how to update the probabilities of hypotheses when given evidence." },
            { question: "What is the Law of Total Probability?", answer: "A fundamental rule relating marginal probabilities to conditional probabilities." }
          ],
          ocrText: "Example content extracted from the simulation document..."
        });
      }

      // Map MIME types if needed (simplistic logic)
      let mimeType = 'application/pdf';
      if (fileType?.toLowerCase().includes('png')) mimeType = 'image/png';
      if (fileType?.toLowerCase().includes('jpg') || fileType?.toLowerCase().includes('jpeg')) mimeType = 'image/jpeg';

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            inlineData: {
              mimeType: mimeType,
              data: fileData, // Base64 string
            },
          },
          {
            text: `You are Aris, an AI exam mentor. Analyze this file (named ${fileName}) for a student's knowledge vault.
            
            Please provide:
            1. A concise, exam-focused summary.
            2. A list of key formulas or definitions found in the document.
            3. 5-7 high-quality flashcards (Question/Answer format).
            4. The full extracted text (OCR).
            
            Return the response in JSON format matching this schema:
            {
              "summary": "string",
              "formulas": ["string"],
              "flashcards": [{"question": "string", "answer": "string"}],
              "ocrText": "string"
            }`,
          }
        ],
        config: {
          responseMimeType: "application/json",
        }
      });

      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error('Error in analyze-vault-file:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development Mode with Vite server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
