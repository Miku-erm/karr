# Google AI Studio uyumluluk değerlendirmesi

Uygulama Google Stitch ve Google AI Studio Build ile üretilmiş dışa aktarımdan devam ettirilmiştir. React/TypeScript/Vite arayüzü, `server.ts` Express sunucusu, `@google/genai` SDK'sı, `/api/tutor` yolu ve HMR kapalı önizleme düzeni korunmuştur. Mimari yeniden yazılmamıştır.

| Ortam | Başlatma / değişkenler | Değerlendirme |
|---|---|---|
| Yerel geliştirme | `npm ci`, `npm run dev`; `.env.local` ardından `.env`, mevcut process değişkenleri öncelikli | Canlı Tutor ve tarayıcı testleri bu ortamda çalıştırıldı |
| AI Studio Build | Önceki `tsx server.ts` başlatması; enjekte edilen GEMINI_API_KEY ve PORT korunur | Kaynak mimarisi uyumlu tutuldu; bu oturumda buluta senkronizasyon yapılmadı |
| Üretim sunucusu | `npm run build`, NODE_ENV=production ile `npm start`; `dist` aynı sunucudan sunulur | Yalnızca `vite preview` API sunmadığından canlı uygulama için Express kullanılmalı |

`.env.local` yükleme eklenmesi bulut secret'ını ezmez. Anahtar hiçbir VITE_ değişkenine, istemci paketine, rapora veya ağ yanıtına aktarılmaz. Model değişkeni isteğe bağlı `GEMINI_MODEL`; varsayılan mevcut `gemini-3.1-flash-lite` modelidir. API hatalarında yalnızca sınıflandırılmış kod ve yerel ipucu döner. Sunucunun yerel değerlendirme ham çıktı kaydı yalnızca açıkça `TUTOR_EVIDENCE_DIR` verilirse ve production dışında yazılır.

Kaynak güncellemeleri GitHub'a pushlanabilir; AI Studio tarafındaki mevcut projenin dosyalarına uygulanabilir. Bu oturumda AI Studio arayüzünden yeniden içe aktarma, GitHub senkronizasyonu veya public deploy doğrulanmadı. Bunların gerçekleştiği iddia edilmez; ücretli servis veya billing açılmadı.

Dışa aktarım README'sinde bulunan mevcut uygulama bağlantısı: [Google AI Studio uygulaması](https://ai.studio/apps/075bc6dc-af43-479d-9c55-a4e8382a2d60). Bağlantı bu oturumda açılarak erişim veya yayımlanan sürüm açısından doğrulanmadı. Stitch proje bağlantısı bulunmadı; özgün dışa aktarımlar [DESIGN.md](../DESIGN.md) içinde listelidir.

Sınırlı teknik düzeltmeler: Vite 8'in esbuild peer bağımlılığıyla sürüm uyumu; TypeScript 7'ye uyumlu esbuild Cypress ön işleyicisi; Codex'in ELECTRON_RUN_AS_NODE değişkenini yalnızca test alt sürecinden kaldıran başlatıcı; yerel ikon fontları. Bunlar kullanıcıya veya sistem geneline kurulum/ayar değişikliği yapmaz.

Başvuru: [Google sunucu tarafı API anahtar güvenliği](https://ai.google.dev/gemini-api/docs/api-key), [mevcut model](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite), [Cypress browser launch ayarları](https://docs.cypress.io/api/node-events/browser-launch-api). Gerçek çalışma kanıtı bu deponun test/eval dosyalarıdır; bu kaynak bağlantıları deployment kanıtı değildir.
