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
app.use(express.static(root));                 // отдаём index.html
app.use('/pages', express.static(path.join(root, 'pages')));
app.use('/js', express.static(path.join(root, 'js')));
app.use('/style',  express.static(path.join(root, 'style')));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/askLegal', async (req, res) => {
  const { question } = req.body;
  // в точности как было для "/ask", только путь изменён:
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Ești un asistent juridic AI specializat în legislația Republicii Moldova pentru afaceri mici.Daca userul intreaba o intrebare care nu coreaza cu domeniul legislativ, trebuie sa raspunzi ca poti raspunde doar la intrebari legate de domeniul tau.',
      },
      { role: 'user', content: question },
    ],
  });
  res.json({ answer: chat.choices[0].message.content });
});

// Финансовый/бухгалтерский чат
app.post('/askAccounting', async (req, res) => {
  const { question } = req.body;
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Ești un asistent financiar AI specializat în toate intrebarile financiare din Republicii Moldova pentru afaceri mici.Daca userul intreaba o intrebare care nu coreaza cu domeniul financiar, trebuie sa raspunzi ca poti raspunde doar la intrebari legate de domeniul tau .',
      },
      { role: 'user', content: question },
    ],
  });
  res.json({ answer: chat.choices[0].message.content });
});
app.listen(port, () => {
  console.log(`✅ Сервер запущен: http://localhost:${port}`);
});
