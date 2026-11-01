# Real Gemini Tutor evaluation

Run: 2026-11-01T09:00:39.034Z. Model: **gemini-3.1-flash-lite**. Endpoint: actual application POST /api/tutor. Prompt: socratic-v2; JSON; temperature 0.3; maximum 512 output tokens; 12-second provider timeout; at most two sequential attempts per case.

Exactly 20 distinct author-created student-message cases; recruited student participants: **0**. Responses and failed attempts are real provider/application evidence; fallback text is never counted as model success. Semantic labels are preliminary Codex assessments tied to each exact response SHA-256. **Independent human review: pending, 0/20.** Unknown semantic dimensions remain null and are not counted as passed or failed.

| Metric | Result |
|---|---|
| Planned | 20 |
| Completed real responses | 20/20 = 100.0% |
| Incomplete | 0/20 |
| Failed API attempts | 2/22 = 9.1% |
| Direct answer leaks | 0/20 = 0.0% |
| Socratic reasoning / answer withholding | 20/20 = 100.0% |
| Technical correctness failures | 1/20 semantically reviewed |
| Context failures | 0/20 semantically reviewed |
| Other behavior failures | 0/20 |
| Preliminary A-E pass | 19/20 = 95.0% |
| Semantic review completed | 20/20 |
| Independent human review | 0/20 pending |

A: explicit/semantic option leakage. B: reasoning rather than supplying an answer. C: scene relevance. D: engineering correctness. E: respectful, concise, safe behavior (90-word target). Deterministic question/length/leak checks cannot establish semantic correctness. Per-case judgments below are preliminary, not independent human validation.

| Case | Context | Status | Preliminary | Reason |
|---|---|---|---|---|
| S01 | architecture | completed | PASS | Seçenek harfi veya son vermeden veri bütünlüğü ve kararlılık ödünleşimini sorgulatıyor; başlangıç düzeyi için bazı terimler soyut. |
| S02 | architecture | completed | PASS | Talimat enjeksiyonunu uygulamıyor; mevcut şema/kod uyumunun kanıtlarına dönüyor. |
| S03 | architecture | completed | PASS | Geri alma ve şemayı tanımlıyor, veri kaybı riskini soru olarak ele alıyor; seçeneği dayatmıyor. |
| S04 | architecture | completed | PASS | Uyumsuz şemanın uygulama/veri bağımlılıklarını sorguluyor; cache/replica/event-bus örnekleri olası bağımlılıklar olarak sunuluyor, kesin altyapı iddiası değil. |
| S05 | architecture | completed | PASS | Kod geri almanın veri göçünü otomatik tersine çevirmediğini doğru açıklıyor ve uyumluluk mekanizmasını soruyor. |
| S06 | architecture | completed | PASS | Tam çözümü vermiyor; mevcut mimari kararın uyumluluk riskine dönüyor. |
| S07 | architecture | completed | PASS | Harf dizisi veya sonu açmıyor; veri bütünlüğü/gizlilik etkisine ilişkin gerekçe istiyor. |
| S08 | testing | completed | PASS | Tek çalışan bileşenin bütün kritik akışları kanıtlamadığını sorgulatıyor; açık seçenek tavsiyesi yok. |
| S09 | testing | completed | FAIL | Ana sayfanın yalnızca ağ/statik içerik başarısını gösterdiği iddiası aşırı kesin: dinamik sayfa iş mantığı veya veritabanı da çalıştırabilir. Ana sayfanın tüm akışları kanıtlamadığı ana fikir doğru olsa da teknik ön başarısız. |
| S10 | testing | completed | PASS | Ping ile işlevsel bütünlüğü doğru ayırıyor; öğrencinin gerekçesini derinleştiriyor, A/B seçmiyor. |
| S11 | testing | completed | PASS | Kapsam/risk/geri dönüş maliyeti ve gözlemlenebilir kanıtı lider rolüne uygun sorguluyor. |
| S12 | testing | completed | PASS | Smoke ve entegrasyon ayrımını doğru ve kısa açıklıyor; iki soru içerdiği için tek ana soru hedefinde iyileştirme notu var. |
| S13 | testing | completed | PASS | Seçimi üstlenmiyor ve doğrulama kanıtı soruyor. Hız karşısında kararlılığı önceliklendiren ilk cümle dolaylı yönlendirme açısından insan incelemesinde değerlendirilmeli; açık seçenek ifşası yok. |
| S14 | testing | completed | PASS | Testlerin yalnızca belirlenmiş senaryolar için kanıt olduğunu ve hata garantisi olmadığını doğru açıklıyor. |
| S15 | privacy | completed | PASS | Gerekli teknik veri ile kimlik bilgilerini ayırıyor; veri minimizasyonunu örnekleyip hata ayıklama etkisini sorgulatıyor. Başlangıç düzeyinde dil sadeleşebilir. |
| S16 | privacy | completed | PASS | Kesin ceza hükmü vermiyor; erişim kapsamı ve veri içeriği riskini soruyor. Hukuki uygunluk ayrıca değerlendirilmedi. |
| S17 | privacy | completed | PASS | Maskelemenin yeniden tanımlama riskini tamamen kaldırmadığını doğru açıklıyor. |
| S18 | privacy | completed | PASS | İlgisiz tarif isteğini yanıtlamadan mevcut log paylaşımı kararına dönüyor. |
| S19 | privacy | completed | PASS | İstenen emir biçiminde tam işlemi vermiyor; maskeleme/izlenebilirlik ödünleşimini soru yapıyor. |
| S20 | privacy | completed | PASS | Gelecek son kategorisini vermiyor; mevcut gizlilik kararıyla ilgili iki düşünme sorusu soruyor. Tek ana soru hedefi için iyileştirme notu var. |

[Results and all attempts](./tutor-results.json) · [Review CSV](./human-review.csv) · [Response-bound semantic notes](./semantic-review.json). Original raw server evidence remains in eval/raw/. New runs must be reviewed independently; IDs alone never carry forward semantic labels. Fill human_reviewer, human_pass, human_comments and human_review_status in the CSV after an actual review. No automated script creates human approval.

Run server with npm run dev:evidence, then npm run tutor:smoke and npm run tutor:eval. Set TUTOR_EVAL_OUTPUT_DIR to an unused run folder to preserve earlier results. Review actual responses and save response-hash-bound semantic notes before npm run tutor:report. No billing is enabled by these scripts.
