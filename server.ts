import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '1mb' }));

const rawApiKey = (process.env.GEMINI_API_KEY || '').trim();
const hasValidApiKey = rawApiKey !== '' && rawApiKey !== 'MY_GEMINI_API_KEY';

// Initialize GoogleGenAI client (Server-Side only)
const ai = new GoogleGenAI({
  apiKey: hasValidApiKey ? rawApiKey : '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface TutorRequestBody {
  sessionId?: string;
  decisionId?: 'architecture' | 'testing' | 'privacy';
  phase?: 'before_choice' | 'after_choice';
  experience?: 'beginner' | 'intermediate' | 'experienced';
  role?: 'developer' | 'tester' | 'lead';
  goal?: 'architecture' | 'testing' | 'privacy';
  message?: string;
  hintLevel?: number;
  finalizedChoices?: Record<string, 'A' | 'B'>;
}

const DECISION_CONTEXT: Record<string, { title: string; scene: string; options: string; localQuestion: string }> = {
  architecture: {
    title: '1 / 3: Mimari Karar — Sistemi Nasıl Toparlarsın?',
    scene: 'Pazartesi 08:00. Gece yayına alınan v2.4.0 sonrası randevu sistemi kilitlendi. Bekleme salonunda 300 hasta var. DB bağlantı havuzu tükendi ve appointments_v2 tablosunda deadlock var.',
    options: 'A: Veritabanı uyumluluğunu kontrol et ve son kararlı v2.3.9 sürümüne geri dön (Rollback). B: Doğrudan üretim ortamına acil bir hotfix uygula (Drop transaction indexes, double pool size).',
    localQuestion: 'Geri dönüş (rollback) yapmadan önce veritabanı şemasında ve transaction kuyruğunda ilk neyi kontrol ederdin?',
  },
  testing: {
    title: '2 / 3: Test ve Doğrulama Kararı — Trafiği Açmadan Önce?',
    scene: 'Sistem toparlanıyor gibi görünüyor. Operasyon ekibi ve poliklinikler kapıda bekliyor. Birkaç başarılı istek tüm randevu akışının çalıştığını kanıtlamaz.',
    options: 'A: Tam trafiği açmadan önce hedefli smoke ve entegrasyon testlerini çalıştır. B: Bekleyen hastaları bekletmemek için testleri atlayıp trafiği derhal aç.',
    localQuestion: 'Sistemin toparlandığını söylemek için birkaç başarılı isteğin dışında hangi kanıta ihtiyaç duyarsın?',
  },
  privacy: {
    title: '3 / 3: Gizlilik ve KVKK Kararı — Tanılama Loglarını Nasıl Paylaşırsın?',
    scene: 'Hata izleme kayıtlarında kurgusal hasta kimlikleri ve tanı kodları var. Takım sohbeti tüm departmana açık ve yetkisiz kişileri de barındırıyor.',
    options: 'A: Paylaşmadan önce kişisel tanımlayıcıları (TC Kimlik, hasta adı) maskele ve erişimi sınırla. B: Hız kazanmak için ham, maskelenmemiş logları genel takım sohbetine gönder.',
    localQuestion: 'İnceleme için hangi alanlar gerçekten gerekli ve bu bilgilere kimlerin erişmesi gerekiyor?',
  },
};

// API Endpoint for Socratic AI Tutor
app.post('/api/tutor', async (req: Request<{}, {}, TutorRequestBody>, res: Response) => {
  const {
    decisionId = 'architecture',
    phase = 'before_choice',
    experience = 'intermediate',
    role = 'developer',
    goal = 'architecture',
    message = '',
    hintLevel = 1,
  } = req.body;

  const currentDecision = DECISION_CONTEXT[decisionId] || DECISION_CONTEXT.architecture;

  // If no API key is present in environment, fall back cleanly
  if (!hasValidApiKey) {
    return res.status(200).json({
      fallback: true,
      messageTr: currentDecision.localQuestion,
      hintLevel,
      decisionId,
    });
  }

  const systemInstruction = `Sen Türkçe konuşan, saygılı ve deneyimli bir Sokratik Yazılım Mühendisliği Danışmanısın.
Öğrencinin profili:
- Deneyim: ${experience === 'beginner' ? 'Yeni başlayan (kısa, cesaret verici, basit metaforlar)' : experience === 'experienced' ? 'Deneyimli (sistemik ödünleşimler, operasyonel baskı ve kanıt odaklı)' : 'Orta seviye (standart yazılım mühendisliği terminolojisi)'}
- Rol: ${role === 'developer' ? 'Yazılım Geliştirici (kod, şema, bağımlılıklar)' : role === 'tester' ? 'Test Mühendisi (regresyon, kritik akış, kanıt)' : 'Teknik Ekip Lideri (ekip koordinasyonu, risk, sorumluluk)'}
- Öğrenme Hedefi: ${goal === 'architecture' ? 'Mimari Kararlar' : goal === 'testing' ? 'Test & Kalite' : 'Güvenlik & KVKK'}

MEVCUT BAĞLAM:
- Karar: ${currentDecision.title}
- Durum: ${currentDecision.scene}
- Seçenekler: ${currentDecision.options}
- Evre: ${phase === 'before_choice' ? 'Öğrenci henüz karar vermedi.' : 'Öğrenci kararını verdi, teknik sonucu inceliyor.'}

TEMEL VE İHLAL EDİLEMEZ KURALLAR:
1. ASLA hangi seçeneğin doğru olduğunu veya hangisini seçmesi gerektiğini söyleme!
   "A'yı seç", "Doğru cevap B", "En mantıklısı A", "Rollback yap", "İlk seçeneği seç", "İkinci seçenek tavsiye edilir" gibi doğrudan veya dolaylı hiçbir tavsiye verme.
2. Öğrenci "Hangisini seçmeliyim?", "Doğru cevap ne?" veya "A mı B mi?" diye sorsa bile ASLA taraf tutma. Kısa, saygılı bir sınır koy ve düşünmesi için Sokratik bir soru yönelt.
3. Gelecekteki sonları ASLA önceden açıklama veya spoiler verme.
4. Yanıtın kısa ve öz olsun: TAM OLARAK 1 ile 3 Türkçe cümle arasında tut.
5. Asla gerçek tıbbi veya hasta bilgisi isteme.
6. Yanıtını geçerli bir JSON nesnesi olarak döndür:
{
  "messageTr": "Kısa sokratik soru veya rehber ipucu",
  "hintLevel": ${hintLevel},
  "decisionId": "${decisionId}"
}`;

  const promptContent = `Öğrencinin mesajı: "${message || 'Bu aşamada nasıl düşünmeliyim?'}"
Lütfen yukarıdaki kurallara kesinlikle uyarak JSON formatında yanıt ver.`;

  try {
    // Use gemini-3.1-flash-lite for instant, high-speed Socratic tutor dialogue
    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: promptContent,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    let timerId: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timerId = setTimeout(() => reject(new Error('TUTOR_TIMEOUT')), 12000);
    });

    const result = (await Promise.race([
      geminiPromise.finally(() => clearTimeout(timerId)),
      timeoutPromise,
    ])) as any;

    const textOutput = result?.text?.trim() || '';

    let parsed: any = null;
    try {
      parsed = JSON.parse(textOutput);
    } catch {
      const match = textOutput.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    }

    if (parsed && typeof parsed.messageTr === 'string') {
      const lower = parsed.messageTr.toLowerCase();
      const leakedOption =
        lower.includes('a seçeneğini seç') ||
        lower.includes('b seçeneğini seç') ||
        lower.includes('doğru cevap a') ||
        lower.includes('doğru cevap b') ||
        lower.includes('a şıkkı') ||
        lower.includes('b şıkkı');

      if (leakedOption) {
        return res.status(200).json({
          messageTr: currentDecision.localQuestion,
          hintLevel,
          decisionId,
        });
      }

      return res.status(200).json({
        messageTr: parsed.messageTr,
        hintLevel: parsed.hintLevel || hintLevel,
        decisionId: parsed.decisionId || decisionId,
        liveAi: true,
      });
    }

    return res.status(200).json({
      messageTr: currentDecision.localQuestion,
      hintLevel,
      decisionId,
    });
  } catch (err: any) {
    // Graceful fallback: return local Socratic prompt without breaking user flow
    return res.status(200).json({
      fallback: true,
      messageTr: currentDecision.localQuestion,
      hintLevel,
      decisionId,
      errorNotice: 'Yerel rehberlik devrede.',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`08:00 — Kritik Karar Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
