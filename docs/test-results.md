# Güncel doğrulama — 1 Kasım 2026

Europe/Istanbul. Bu bölüm güncel koşudur; aşağıdaki 24 Ekim kayıtları tarihsel kanıttır.

| Çalıştırılan komut | Gerçek sonuç | Kanıt |
|---|---|---|
| npm ls --depth=0 | PASS, exit 0 | [toplu kayıt](../evidence/final-verification.json) |
| npm run typecheck / npm run build | PASS, exit 0 | [loglar](../evidence/final-verification.json) |
| npm test | 11/11 PASS | [çıktı](../evidence/verification/unit-tests.txt) |
| npm run test:eval-report | 1/1 PASS; eski semantik/insan etiketleri yeni yanıta taşınmıyor | [çıktı](../evidence/verification/eval-report-test.txt) |
| npm run tutor:audit | 2/2 koşu: 40/40 yanıt ham dosyayla eşleşiyor | [bütünlük kaydı](../evidence/evaluation-integrity.json) |
| npm run test:server | 5/5 PASS | [sunucu kanıtı](../evidence/server-smoke.json) |
| npm run cy:run | 19/19 PASS: 8/8 yol + 11/11 özellik | [Cypress](../evidence/cypress-e2e.json) |
| npm run test:live | 1/1 PASS, gerçek Gemini arayüzde | [canlı test](../evidence/cypress-live.json) |
| npm run tutor:smoke | 1/1 gerçek yanıt, 2 deneme; önce 503 sonra başarı | [smoke](../eval/smoke.json) |
| npm run tutor:eval (tarihli çıktı klasörü) | 20/20 gerçek yanıt, 22 deneme; iki 504 retry ile tamam | [yeni koşu](../eval/runs/2026-11-01/report.md) |
| npm run tutor:report (aynı çıktı klasörü) | 19/20 ön geçiş; insan incelemesi 0/20 pending; S09 teknik hata | [sonuç](../eval/runs/2026-11-01/tutor-results.json) |
| npm run demo:record | 1/1 PASS, gerçek Gemini cevabı ve AAA yolu | [demo testi](../evidence/cypress-demo.json) |
| npm run demo:edit / npm run demo:verify | 65.40 sn ham → 58.000 sn MP4, H.264 1280×1100; 1.13x; tam decode PASS | [video](../demo/video-verification.json) |
| Görsel video kontrolü | 11 kare incelendi; Türkçe, canlı cevap, üç etki, son/restart görünür | [görsel kontrol](../demo/visual-inspection.json) |
| npm run security:scan | Kaynak, dist ve Git geçmişi; gizli değer yazdırılmadı | [son tarama](security-scan.json) |

PowerShell'de ayrı değerlendirme klasörü: $env:TUTOR_EVAL_OUTPUT_DIR='eval/runs/2026-11-01'. Güncel insan incelemesi eski onaydan ayrıdır. Sağlayıcı 503/504 hataları kayıtlardan silinmedi. Anahtar sunucuda; deterministik Cypress mock yanıtları canlı model kanıtı sayılmadı.

Önceki toplu loglar [arşivde](../evidence/archive/2026-10-24/final-verification.json) korundu. Mermaid 2/2 ayrıştırması 24 Ekim kanıtıdır; değişmeyen diyagramlar bu koşuda yeniden ayrıştırılmadı/render edilmedi.

---

# Çalıştırılmış testler ve gerçek sonuçlar

Tarih: 24 Ekim 2026, Europe/Istanbul. Kaynak: bu deponun Google AI Studio dışa aktarımı. Node 22.16.0, npm 10.9.2, TypeScript 7.0.2, Vite 8.3.5, Cypress 15.7.0 / Electron 138. Son toplu doğrulama UTC 10:57:21–10:57:58 aralığında (İstanbul 13:57) çalıştı.

| Komut | Gerçek sonuç | Kanıt |
|---|---|---|
| `npm install --no-audit --no-fund` | PASS; ilk esbuild peer çakışması düzeltildikten sonra kuruldu | package-lock.json; bağımlılık sürümleri |
| `npm ls --depth=0` | PASS / exit 0 | evidence/verification/dependencies.txt |
| `npm run typecheck` | PASS / exit 0 | evidence/verification/typecheck.txt |
| `npm run build` | PASS / exit 0; dist üretildi | evidence/verification/build.txt |
| `npm test` | **11/11** PASS, 0 fail | evidence/verification/unit-tests.txt |
| `npm run test:server` | **5/5** PASS | evidence/server-smoke.json |
| `npm run cy:run` | **19/19** PASS: 8 yol + 11 özellik, 0 fail | evidence/cypress-e2e.json |
| `npm run test:live` | **1/1** PASS; gerçek Gemini yanıtı arayüzde gösterildi | evidence/cypress-live.json |
| `npm run tutor:smoke` | **1/1** tamam; 2 deneme, ilkinde sağlayıcı 504 hatası | eval/smoke.json |
| `npm run tutor:eval` | **20/20** gerçek yanıt; 20 API denemesi, 0 başarısız çağrı | eval/tutor-results.json |
| `npm run tutor:report` | Ön geçiş **18/20**; doğrudan sızıntı **0/20**; insan onayı **0/20 pending** | docs/tutor-evaluation.md |
| `npm run demo:record` | **1/1** gerçek demo koşusu PASS; gerçek Tutor yanıtı kayıtta | evidence/cypress-demo.json; demo/timeline.jsonl |
| `npm run demo:edit` | Ham 60.32 sn → 58 sn, gerçek katsayı yaklaşık 1.04x | demo/edit-manifest.json |
| `npm run demo:verify` | MP4 / H.264, **58.000 sn**, **1280×1100**, tam decode PASS | demo/video-verification.json |
| `npm run security:scan` | PASS; kaynak, dist, Git geçmişi; .env.local ignored | docs/security-scan.json |
| Mermaid parse | **2/2** PASS, Mermaid 12.2.0 flowchart-v2 | evidence/document-validation.json |

Toplu komut: `npm run verify` (uygulama sunucusu 3000 portunda çalışırken). Her komutun exit kodu ve zaman damgası [final-verification.json](../evidence/final-verification.json) içinde saklanır. Harici Gemini ve demo çağrıları ayrı çalıştırılmıştır; toplu komut aynı 20 API çağrısını yeniden yapmaz.

## Hikâye yolları

Sekiz satırın tamamı onboarding → üç seçim/kesinleştirme → üç neden-sonuç → beklenen son → temiz yeniden başlatma akışını gerçek uygulamada çalıştırdı. Tarayıcı runtime hataları bastırılmadı.

| Yol | Beklenen / gözlenen | Sonuç |
|---|---|---|
| AAA | ENDING_SAFE | PASS |
| AAB | ENDING_PRIVACY_INCIDENT | PASS |
| ABA | ENDING_RECURRING_OUTAGE | PASS |
| ABB | ENDING_PRIVACY_INCIDENT | PASS |
| BAA | ENDING_FRAGILE | PASS |
| BAB | ENDING_PRIVACY_INCIDENT | PASS |
| BBA | ENDING_RECURRING_OUTAGE | PASS |
| BBB | ENDING_PRIVACY_INCIDENT | PASS |

BBB ayrıca hotfix izleme ihtiyacı, tekrarlayan kesinti ve ham log paylaşımının üç ayrı özet satırında korunmasını doğrular. Unit testler geçersiz/eksik seçimlerin son hesaplamasına giremediğini ve 27 profil × 8 son hesabının profil bağımsızlığını kontrol eder. İlk dışa aktarımda birim testi bulunmuyordu.

## On bir ek özellik testi

Tam üç açık onboarding seçimi; yeni başlayan açıklaması ve rol/hedef geri bildirimi; deneyimli ödünleşimi ve süre sınırı yokluğu; karar kilidi ve erken Debrief engeli; Tutor paneli/bekleme durumu; HTTP 500 fallback; API timeout etiketi; restart sonrası geç yanıtın atılması; yenilemede temiz oturum; klavye seçimi/onayı; 360/390 px yatay taşma. Oturum restorasyonu ürün kapsamında uygulanmadığından yenilemede sıfırlanma doğrulanır.

Bu deterministik testlerde Tutor yanıtı kontrollü ağ interception'ıdır; gerçek model davranışı kanıtı değildir. Ayrı `test:live` ve 20-vaka değerlendirmesi gerçek servisi kullanır. Production smoke, çalışan Express sunucusunda anahtar eksikliğini gerçekten oluşturur; bu senaryo mock değildir.

## Önceki başarısızlıklar ve giderilen nedenler

[Koşu geçmişi](../evidence/cypress-run-history.json) başarısız koşuları da içerir: derleme öncesi 0 test/2 hazırlama hatası; ardından 16/19, 17/19, 18/19 ve son iki koşuda 19/19. İlk hatalar saklanmış ve final başarı yüzdesine karıştırılmamıştır.

- Vite 8 ile export'taki esbuild 0.25 peer çakışması: desteklenen 0.28 sürüm aralığına geçildi; legacy-peer-deps/force kullanılmadı.
- Electron'un Node modunda açılması: yalnızca Cypress alt sürecinden ELECTRON_RUN_AS_NODE kaldırıldı.
- Cypress'in eski ts-loader API'si ile TypeScript 7 uyuşmazlığı: mevcut esbuild ile test ön işleyicisi eklendi.
- Vite `watch:null` yüzünden eski kod önbelleği: HMR kapalı kalırken dosya invalidation geri getirildi.
- Eksik başlangıç tanımı ve klavye onayı: kısa kavram açıklaması ve açık Enter/Space işleyicisi eklendi.
- Ayrılmış `timeout` test alias'ı: anlamı değiştirilmeden `tutorTimeout` olarak adlandırıldı.
- Harici Material Symbols yüklenemediğinde ikon adları taşması: lisansıyla küçük yerel font alt kümeleri eklendi; 360 px assertion korunarak geçti.

Başarısız testler sırasında Cypress ekran görüntüsü/video üretmiştir. İlk koşulardaki varsayılan temizleme bazı eski görüntüleri yenilemiştir; sonraki kayıtların korunması için `trashAssetsBeforeRuns:false` ayarı eklendi. Ham demo, seçilmiş raporlar ve çalışma kareleri teslimde ayrıca korunur. Gelecek başarısız koşular `artifacts/cypress/` altında kalır.

## Sınırlar

Tam WCAG, tüm tarayıcılar veya gerçek hastane entegrasyonu test edilmedi. Tutor etiketleri bağımsız insan incelemesi değildir; S04 ve S09 teknik doğruluk açısından ön başarısızdır. Gerçek öğrenci katılımcı yoktur. AI Studio senkronizasyonu/deploy doğrulanmadı. Mermaid grafik olarak render edilmedi; yalnızca ayrıştırıldı. Video yedi temsilî kareyle görsel incelendi ve tamamı FFmpeg ile çözüldü; baştan sona bağımsız insan izleme onayı yoktur.
