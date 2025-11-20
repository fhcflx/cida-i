import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

// --- DEFINIR O NOME DO MODELO COMO UMA CONSTANTE ---
const MODEL_NAME = "gemini-2.5-pro"; // Use o nome do modelo que funcionou para você

// Configuração do CORS
const corsOptions = {
    origin: 'https://fhcflx.github.io',
    optionsSuccessStatus: 200
};

// MIDDLEWARE
app.use(cors()); // Permite requisições
app.use(express.json()); // Permite ler o corpo JSON das requisições

// Inicializa o cliente do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Endpoint da API
app.post('/sugerir-cid', async (req, res) => {
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
        const suggestions = JSON.parse(jsonText);

        // --- Envia um objeto com as sugestões E o nome do modelo ---
        res.json({
            suggestions: suggestions,
            modelName: MODEL_NAME
        });

    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        res.status(500).json({ error: 'Não foi possível processar a sugestão.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});