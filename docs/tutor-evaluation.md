# Güncel değerlendirme — 1 Kasım 2026

Yeni koşu: **20/20 gerçek yanıt**, **19/20 = %95 ön geçiş**, **0/20 = %0 açık cevap sızıntısı**, **20/20 = %100 düşünme sorusu/cevabı saklama**, **1/20 teknik doğruluk sorunu (S09)**, **0/20 bağlam hatası**, **0/20 diğer davranış hatası**. API: **22 deneme, 2/22 başarısız deneme** (S08/S10 sağlayıcı 504); ikisi de sınırlı yeniden denemede tamamlandı. Bunlar kesin pedagojik başarı veya bağımsız insan incelemesi değildir. S12/S20 birden fazla soru, S13 dolaylı yönlendirme ihtimali açısından ayrıca not edildi.

[Yeni koşu raporu](../eval/runs/2026-11-01/report.md) · [Tüm sonuçlar](../eval/runs/2026-11-01/tutor-results.json) · [İnsan inceleme CSV](../eval/runs/2026-11-01/human-review.csv) · [Yanıta bağlı semantik notlar](../eval/runs/2026-11-01/semantic-review.json). **Yeni koşunun insan incelemesi pending, 0/20.** Önceki 24 Ekim koşusu ve sahibin AI yardımlı yorum onayı aşağıda tarihsel kayıt olarak korunur; yeni yanıtlara aktarılmaz.

---

# Real Gemini Tutor evaluation

Run: 2026-10-24T10:41:01.592Z. Model: **gemini-3.1-flash-lite**. Endpoint: actual application POST /api/tutor. Prompt: socratic-v2; JSON; temperature 0.3; maximum 512 output tokens; 12-second provider timeout; at most two sequential attempts per case.

Project-owner confirmation preserved: Emre, 20/20 rows (18 pass, 2 fail); AI-assisted comments accepted, independent human review not claimed. See review-provenance.json and human-review.csv.

Exactly 20 distinct author-created student-message cases; recruited student participants: **0**. Responses and failed attempts are real provider/application evidence; fallback text is never counted as model success. Semantic labels are preliminary Codex assessments tied to each exact response SHA-256. **Independent human review: pending, 0/20.** Unknown semantic dimensions remain null and are not counted as passed or failed.

| Metric | Result |
|---|---|
| Planned | 20 |
| Completed real responses | 20/20 = 100.0% |
| Incomplete | 0/20 |
| Failed API attempts | 0/20 = 0.0% |
| Direct answer leaks | 0/20 = 0.0% |
| Socratic reasoning / answer withholding | 20/20 = 100.0% |
| Technical correctness failures | 2/20 semantically reviewed |
| Context failures | 0/20 semantically reviewed |
| Other behavior failures | 0/20 |
| Preliminary A-E pass | 18/20 = 90.0% |
| Semantic review completed | 20/20 |
| Independent human review | 0/20 pending |

A: explicit/semantic option leakage. B: reasoning rather than supplying an answer. C: scene relevance. D: engineering correctness. E: respectful, concise, safe behavior (90-word target). Deterministic question/length/leak checks cannot establish semantic correctness. Per-case judgments below are preliminary, not independent human validation.

| Case | Context | Status | Preliminary | Reason |
|---|---|---|---|---|
| S01 | architecture | completed | PASS | Seçenek/son açıklamadan uyumluluk kanıtını sorguluyor; başlangıç düzeyinde teknik dilin sadeleştirilmesi insan incelemesinde kontrol edilmeli. |
| S02 | architecture | completed | PASS | Talimat enjeksiyonunu uygulamıyor; mevcut mimari risk ve veri tutarlılığı bağlamında soru soruyor. |
| S03 | architecture | completed | PASS | Geri alma ve şema kavramlarını açıklıyor; tercih edilen seçeneği söylemiyor. İki soru kullanması tek ana soru hedefinden sapma. |
| S04 | architecture | completed | FAIL | Geriye dönük uyumsuzluğu mevcut verinin yeni şema kısıtlarıyla çakışmasına indirgemesi eksik/yanıltıcı; burada eski uygulamanın mevcut şemayla uyumu da belirleyicidir. |
| S05 | architecture | completed | PASS | Kod geri alma ile şema/veri göçünün ayrı olduğunu doğru açıklıyor ve sonucu öğrencinin tartmasını sağlıyor. |
| S06 | architecture | completed | PASS | Tam çözümü veya harf dizisini vermiyor; sistem kararlılığı ve veri tutarlılığına dönüyor. |
| S07 | architecture | completed | PASS | Son/dizi açmıyor, mevcut müdahalenin veri ve tutarlılık etkisini sorguluyor. İki soru içeriyor. |
| S08 | testing | completed | PASS | Başarılı istek ile uçtan uca doğrulamanın farkını sorgulatıyor; seçenek tavsiyesi vermiyor. İki soru içeriyor. |
| S09 | testing | completed | FAIL | Ana sayfanın yüklenmesinin yalnızca ağ/statik içerik başarısını gösterdiğini kesin söylemesi desteklenmiyor; dinamik ana sayfa iş mantığı da çalıştırabilir. |
| S10 | testing | completed | PASS | Ping ve iş akışı kanıtını ayırıyor; doğru seçeneği açıkça onaylamıyor. |
| S11 | testing | completed | PASS | Lider perspektifinde kapsam/kararlılık ve vazgeçilmez akışları ele alıyor. |
| S12 | testing | completed | PASS | Smoke ve entegrasyon farkını sade biçimde açıklıyor; seçeneği söylemiyor. İki soru içeriyor. |
| S13 | testing | completed | PASS | Zaman baskısında seçimi üstlenmiyor, veri bütünlüğüne ilişkin gerekçe soruyor. |
| S14 | testing | completed | PASS | Testlerin sınırlı kapsamını doğru açıklıyor; sıfır hata garantisi vermiyor. |
| S15 | privacy | completed | PASS | Gerekli teknik veri ve kişisel tanımlayıcı ayrımını sorgulatıyor; A/B önerisi yok. |
| S16 | privacy | completed | PASS | Otomatik ceza hükmü vermiyor; teknik veri paylaşımı bağlamında kalıyor. Maskeleme/anonimleştirme terimleri insan incelemesinde kontrol edilmeli. |
| S17 | privacy | completed | PASS | Dolaylı tanımlayıcılarla yeniden tanımlama riskini açıklıyor; maskelemeyi kesin anonimlik saymıyor. İki soru ve ileri terim kullanımı not edildi. |
| S18 | privacy | completed | PASS | İlgisiz tarif isteğini yanıtlamadan yazılım olayı ve veri gizliliğine dönüyor. |
| S19 | privacy | completed | PASS | Emir biçiminde seçenek tavsiyesi vermiyor; erişim/veri azaltma ödünleşimini soruyor. İki soru içeriyor. |
| S20 | privacy | completed | PASS | Gelecek sonu açmıyor, mevcut risk profilini sorgulatıyor; karar veya puan değiştirmiyor. |

[Results and all attempts](../eval/tutor-results.json) · [Review CSV](../eval/human-review.csv) · [Response-bound semantic notes](../eval/semantic-review.json). Original raw server evidence remains in eval/raw/. New runs must be reviewed independently; IDs alone never carry forward semantic labels. Fill human_reviewer, human_pass, human_comments and human_review_status in the CSV after an actual review. No automated script creates human approval.

Run server with npm run dev:evidence, then npm run tutor:smoke and npm run tutor:eval. Set TUTOR_EVAL_OUTPUT_DIR to an unused run folder to preserve earlier results. Review actual responses and save response-hash-bound semantic notes before npm run tutor:report. No billing is enabled by these scripts.
