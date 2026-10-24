import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK according to gemini-api skill instructions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Goal Architect (Breaks down natural language goals into milestones & tasks)
app.post('/api/ai/plan-goal', async (req: Request, res: Response) => {
  const { title = 'Strategic Objective', description = '', category = 'Strategic', targetDate = 'Within 60 days', currentLevel = 'Initial stage' } = req.body || {};

  if (!title) {
    return res.status(400).json({ error: 'Goal title is required' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const prompt = `You are LifeOS AI Architect. An executive operator has defined this high-impact goal:
Goal: "${title}"
Category: "${category}"
Description: "${description || 'Execute aggressively and systematically'}"
Target Date: "${targetDate}"
Current Baseline: "${currentLevel}"

Break this ambitious goal down into:
1. An executive summary describing high-leverage execution.
2. 3-4 sequential milestones with realistic target weeks.
3. 4-6 prioritized, concrete tasks with accurate estimated minutes (e.g., 30, 45, 60, 90) and category tags. Priority must be one of: 'urgent', 'critical', 'normal', 'restorative'. Priority labels should look like 'URGENT & STRATEGIC', 'CRITICAL REVIEW', 'CORE ARCHITECTURE', 'DEEP EXECUTION'.
4. A high-clarity weekly execution strategy protecting deep focus windows.
5. 2-3 potential bottlenecks and how to bypass them.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  targetWeek: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['title', 'targetWeek', 'description'],
              },
            },
            suggestedTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  priorityLabel: { type: Type.STRING },
                  estimatedMinutes: { type: Type.NUMBER },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['title', 'category', 'priority', 'priorityLabel', 'estimatedMinutes', 'tags'],
              },
            },
            weeklyStrategy: { type: Type.STRING },
            potentialBottlenecks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['executiveSummary', 'milestones', 'suggestedTasks', 'weeklyStrategy', 'potentialBottlenecks'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('AI plan fallback triggered:', error.message);
    return res.json({
      executiveSummary: `Strategic execution architecture for "${title}". High-leverage roadmap prioritizing deep work blocks and milestone momentum.`,
      milestones: [
        { title: `Phase 1: Architecture, Core Benchmarks & Blueprint`, targetWeek: 'Week 1-2', description: 'Lay foundational technical and strategic baseline.' },
        { title: `Phase 2: Alpha Execution & Core Validation`, targetWeek: 'Week 3-4', description: 'Deploy prototype and measure performance criteria.' },
        { title: `Phase 3: Production Hardening & Full Launch`, targetWeek: 'Week 5-6', description: 'Audit telemetry, mitigate bottlenecks, and scale.' },
      ],
      suggestedTasks: [
        {
          title: `Finalize Technical Blueprint & Milestone Specifications for ${title}`,
          category: category,
          priority: 'urgent',
          priorityLabel: 'URGENT & STRATEGIC',
          estimatedMinutes: 90,
          tags: ['Deep Focus', 'High Leverage', category],
        },
        {
          title: `Review Core Architecture PR & System Dependencies`,
          category: category,
          priority: 'critical',
          priorityLabel: 'CRITICAL REVIEW',
          estimatedMinutes: 45,
          tags: ['Code Review', 'Platform v2.4'],
        },
        {
          title: `Setup Automated Telemetry & Performance Tracking`,
          category: category,
          priority: 'normal',
          priorityLabel: 'OPTIMIZATION',
          estimatedMinutes: 30,
          tags: ['Performance', 'Observability'],
        },
        {
          title: `Daily Micro-Habit: 20m Post-Work Cardiovascular Reset`,
          category: 'Health & Longevity',
          priority: 'restorative',
          priorityLabel: 'RESTORATIVE HABIT',
          estimatedMinutes: 20,
          tags: ['Health & Longevity', 'Recovery'],
        },
      ],
      weeklyStrategy: 'Dedicate your 09:30–12:00 biological peak window to uninterrupted core deliverables. Triage secondary reviews in late afternoon.',
      potentialBottlenecks: [
        'Context switching between meetings and core architecture (Defend mornings with calendar shielding)',
        'Unclear milestone metrics (Define binary acceptance criteria upfront)'
      ]
    });
  }
});

// Endpoint: AI Autonomous Daily Briefing Generator
app.post('/api/ai/daily-briefing', async (req: Request, res: Response) => {
  const { userName = 'Elena', tasks = [], goals = [], streak = 18, focusScore = 94 } = req.body || {};

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const prompt = `Synthesize a daily autonomous briefing for ${userName} in the exact style of LifeOS AI.
Current metrics: Streak: ${streak} days, Focus Score: ${focusScore}%.
Active tasks count: ${tasks.length}.
Goals count: ${goals.length}.
Top tasks: ${JSON.stringify(tasks.slice(0, 3).map((t: any) => t.title))}.

Output structured JSON:
- greeting: e.g. "Good morning, Elena."
- peakWindow: e.g. "09:30 – 12:00"
- highImpactSummary: 1-2 sentence assessment of biological peak window and high-impact deliverables.
- neuralState: e.g. "Hyper-Focused", "Strategic Synthesis", or "Flow State"
- focusRecommendation: A single clear directive for maximum cognitive leverage today.
- audioScript: A concise, spoken 45-60 second audio briefing script written in a professional, motivating tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING },
            peakWindow: { type: Type.STRING },
            highImpactSummary: { type: Type.STRING },
            neuralState: { type: Type.STRING },
            focusRecommendation: { type: Type.STRING },
            audioScript: { type: Type.STRING },
          },
          required: ['greeting', 'peakWindow', 'highImpactSummary', 'neuralState', 'focusRecommendation', 'audioScript'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Daily briefing fallback triggered:', error.message);
    return res.json({
      greeting: `Good morning, ${userName}.`,
      peakWindow: '09:30 – 12:00',
      highImpactSummary: 'Your cognitive peak window is mapped for 09:30 – 12:00. You have 3 high-impact deliverables queued with nominal distractions.',
      neuralState: 'Hyper-Focused',
      focusRecommendation: 'Lock deep work block for Series A Technical Architecture before checking external communications.',
      audioScript: `Good morning, ${userName}. Your biological peak window begins at nine thirty AM. Three priority directives are mapped. Protect the next two hours for uninterrupted core architecture.`,
    });
  }
});

// Endpoint: AI Coach & Cognitive Strategist Chat
app.post('/api/ai/coach-chat', async (req: Request, res: Response) => {
  const { message = '', history = [], context = {} } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const systemInstruction = `You are LifeOS AI — an autonomous cognitive strategist, executive chief of staff, and high-performance operating system.
You speak with crisp precision, zero fluff, and high agency.
User Context:
- User Name: ${context.name || 'Elena'}
- Focus Score: ${context.focusScore || 94}%
- Deep Work Streak: ${context.streakDays || 18} days
- Active Goals: ${JSON.stringify(context.goals?.map((g: any) => ({ title: g.title, progress: g.progress })) || [])}
- Active Priority Tasks: ${JSON.stringify(context.tasks?.map((t: any) => ({ title: t.title, priority: t.priority, est: t.estimatedMinutes })) || [])}

Instructions:
- Provide high-leverage cognitive advice, task triage, timeblock optimization, and milestone strategy.
- Keep responses concise (2-4 punchy paragraphs or bullet points).
- If the user asks to create or schedule a task, suggest it clearly.`;

    const chatContents: any[] = [];
    for (const h of history.slice(-6)) {
      chatContents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      });
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Directive acknowledged. Focus on the single highest-leverage task currently in progress.';
    return res.json({ reply });
  } catch (error: any) {
    console.warn('Coach chat fallback triggered:', error.message);
    return res.json({
      reply: `Directive acknowledged, ${context.name || 'Elena'}. Regarding "${message}": Protect your ${context.cognitivePeakStart || '09:30'}–${context.cognitivePeakEnd || '12:00'} cognitive window today. Keep inbound notifications muted, focus on your single highest-leverage directive, and preserve your ${context.streakDays || 18}-day deep work streak.`,
    });
  }
});

// Endpoint: Text to Speech Briefing Audio (Gemini 3.8 Flash Lite TTS)
app.post('/api/ai/tts-briefing', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore' } = req.body || {};
    const script = text || 'Good morning. Your cognitive peak window is mapped. 3 high-impact deliverables queued.';

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ fallback: true, text: script });
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: script,
              speechMetadata: {
                style: 'Clear, crisp, calm executive intelligence briefing',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return res.json({ audio: base64Audio, format: 'audio/wav' });
    } else {
      return res.json({ fallback: true, text: script });
    }
  } catch (error: any) {
    console.warn('TTS API error, falling back to client-side speech synthesis:', error.message);
    return res.json({ fallback: true, text: req.body?.text || '' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LifeOS AI server running at http://0.0.0.0:${PORT}`);
  });
}

// Only launch standalone server if not running inside Vercel serverless environment
if (process.env.VERCEL !== '1') {
  startServer();
}

export default app;
export { app };
