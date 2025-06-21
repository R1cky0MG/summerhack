
// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;
const root = path.resolve();

app.use(cors());
app.use(express.json());

// Статика
app.use('/',     express.static(path.join(root, 'pages')));
app.use('/js',   express.static(path.join(root, 'js')));
app.use('/style',express.static(path.join(root, 'style')));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question?.trim()) {
    return res.status(400).json({ error: 'Пустой вопрос' });
  }
  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Ești un asistent juridic AI specializat în legislația Republicii Moldova pentru afaceri mici.' },
        { role: 'user',   content: question },
      ],
    });
    res.json({ answer: chat.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при запросе к OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`✅ Сервер запущен: http://localhost:${port}`);
});
