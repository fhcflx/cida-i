// server.js
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

// MIDDLEWARE
app.use(cors()); // Permite requisições
app.use(express.json()); // Permite ler o corpo JSON das requisições

// --- NOVA LINHA MÁGICA AQUI ---
// Serve os arquivos estáticos (HTML, CSS, JS) da pasta 'public'
app.use(express.static('public'));

// Inicializa o cliente do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

// Define o endpoint da API para sugestão de CID
app.post('/sugerir-cid', async (req, res) => {
    // ... (o resto desta função continua exatamente igual)
    const { texto, especialidade } = req.body;

    if (!texto || !especialidade) {
        return res.status(400).json({ error: 'Texto da HDA e especialidade são obrigatórios.' });
    }

    const prompt = `
        Você é um assistente especialista em codificação médica da CID-10.
        Analise o seguinte histórico clínico (HDA) dentro da especialidade de "${especialidade}".
        Com base no texto, sugira de 1 a 4 códigos da CID-10 que sejam os mais relevantes.

        HDA: "${texto}"

        Para cada sugestão, forneça o código do CID, sua descrição oficial e uma breve justificativa de por que ele se aplica ao caso.
        Responda APENAS com um objeto JSON válido, que seja um array de objetos, seguindo este formato e nada mais:
        [
          {
            "cid": "CÓDIGO_SUGERIDO",
            "descricao": "DESCRIÇÃO_OFICIAL_DO_CID",
            "justificativa": "SUA_JUSTIFICATIVA_AQUI"
          }
        ]
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = response.text().replace(/```json/g, '').replace(/```/g, '');

        const jsonData = JSON.parse(jsonText);
        res.json(jsonData);

    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        res.status(500).json({ error: 'Não foi possível processar a sugestão.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando! Acesse seu app em http://localhost:${port}`);
});