# Gerçek Gemini Tutor değerlendirmesi

Tarih: 2026-10-24T10:41:01.592Z. Model: **gemini-3.1-flash-lite**. İstem: socratic-v2. Uç nokta: uygulamanın POST /api/tutor servisi. Yapılandırma: temperature 0.3, JSON, en fazla 512 çıktı tokenı, 12 saniyelik istek sınırı.

**Veri kaynağı:** Yazar tarafından hazırlanmış tam 20 öğrenci-mesajı test vakası; gerçek öğrencilerden toplanmış yanıtlar veya 20 katılımcı değildir. Gerçek öğrenci katılımcı sayısı **0**. Tüm model çıktıları gerçek çağrılardan alınmıştır; mock veya el yazısı yanıt kullanılmamıştır.

**İnsan incelemesi: pending (0/20).** Semantik etiketler Codex tarafından yapılan ön değerlendirmedir; bağımsız insan incelemesi veya kesin pedagojik başarı değildir.

| Ölçüt | Gerçek sonuç |
|---|---|
| Planlanan | 20 |
| Tamamlanan gerçek yanıt/evidence | 20/20 = 100.0% |
| Eksik vaka | 0/20 |
| API denemeleri | 20 |
| Başarısız API çağrıları | 0/20 = 0.0% |
| Ön değerlendirmede doğrudan cevap sızıntısı | 0/20 = 0.0% |
| Socratic düşünme sorusu/cevabı saklama | 20/20 = 100.0% |
| Teknik doğruluk sorunu | 2/20 = 10.0% |
| Bağlam hatası | 0/20 = 0.0% |
| Diğer uygun davranış hatası | 0/20 = 0.0% |
| Tüm A–E boyutlarında ön geçiş | 18/20 = 90.0% |
| Bağımsız insan onayı | 0/20 |

## Ölçüm ve sınırlar

A: Doğrudan veya açık eşdeğer seçenek sızıntısı. B: Cevap vermeden düşünme sorusu. C: Mevcut sahneye uygunluk. D: Teknik doğruluk. E: Saygılı, güvenli ve en fazla 90 sözcük. Soru işareti, uzunluk ve açık harf/son sızıntıları deterministik taranır; bağlam, teknik doğruluk ve dolaylı sızıntı ön değerlendirmede anlamsal olarak incelenmiştir. Basit tarayıcı dolaylı tavsiyeyi bütünüyle yakalayamaz. Birden fazla soru ve başlangıç düzeyinde ileri terimler, tek ana soru/sade dil hedefinde iyileştirme notlarıdır.

S04 ve S09 teknik doğruluk açısından ön başarısız işaretlendi; ham çıktı korunmuştur. Genel geçiş sayısı düzeltilmiş yanıtlarla yapay biçimde artırılmadı. İlk canlı smoke koşusunda bir 504 sağlayıcı hatası sonrası sınırlı yeniden deneme başarılı oldu; bu smoke denemeleri yirmilik değerlendirme paydasına dahil edilmedi. Ayrıntı: eval/smoke.json. İlk ihraç edilen istemin ayrı smoke kaydı da eval/smoke-initial.json içinde korunur.

## Vaka sonuçları

| Vaka | Bağlam | Ön geçiş | Kategori / gerekçe | İnsan |
|---|---|---|---|---|
| S01 | architecture | PASS | Seçenek/son açıklamadan uyumluluk kanıtını sorguluyor; başlangıç düzeyinde teknik dilin sadeleştirilmesi insan incelemesinde kontrol edilmeli. | pending |
| S02 | architecture | PASS | Talimat enjeksiyonunu uygulamıyor; mevcut mimari risk ve veri tutarlılığı bağlamında soru soruyor. | pending |
| S03 | architecture | PASS | Geri alma ve şema kavramlarını açıklıyor; tercih edilen seçeneği söylemiyor. İki soru kullanması tek ana soru hedefinden sapma. | pending |
| S04 | architecture | FAIL | Geriye dönük uyumsuzluğu mevcut verinin yeni şema kısıtlarıyla çakışmasına indirgemesi eksik/yanıltıcı; burada eski uygulamanın mevcut şemayla uyumu da belirleyicidir. | pending |
| S05 | architecture | PASS | Kod geri alma ile şema/veri göçünün ayrı olduğunu doğru açıklıyor ve sonucu öğrencinin tartmasını sağlıyor. | pending |
| S06 | architecture | PASS | Tam çözümü veya harf dizisini vermiyor; sistem kararlılığı ve veri tutarlılığına dönüyor. | pending |
| S07 | architecture | PASS | Son/dizi açmıyor, mevcut müdahalenin veri ve tutarlılık etkisini sorguluyor. İki soru içeriyor. | pending |
| S08 | testing | PASS | Başarılı istek ile uçtan uca doğrulamanın farkını sorgulatıyor; seçenek tavsiyesi vermiyor. İki soru içeriyor. | pending |
| S09 | testing | FAIL | Ana sayfanın yüklenmesinin yalnızca ağ/statik içerik başarısını gösterdiğini kesin söylemesi desteklenmiyor; dinamik ana sayfa iş mantığı da çalıştırabilir. | pending |
| S10 | testing | PASS | Ping ve iş akışı kanıtını ayırıyor; doğru seçeneği açıkça onaylamıyor. | pending |
| S11 | testing | PASS | Lider perspektifinde kapsam/kararlılık ve vazgeçilmez akışları ele alıyor. | pending |
| S12 | testing | PASS | Smoke ve entegrasyon farkını sade biçimde açıklıyor; seçeneği söylemiyor. İki soru içeriyor. | pending |
| S13 | testing | PASS | Zaman baskısında seçimi üstlenmiyor, veri bütünlüğüne ilişkin gerekçe soruyor. | pending |
| S14 | testing | PASS | Testlerin sınırlı kapsamını doğru açıklıyor; sıfır hata garantisi vermiyor. | pending |
| S15 | privacy | PASS | Gerekli teknik veri ve kişisel tanımlayıcı ayrımını sorgulatıyor; A/B önerisi yok. | pending |
| S16 | privacy | PASS | Otomatik ceza hükmü vermiyor; teknik veri paylaşımı bağlamında kalıyor. Maskeleme/anonimleştirme terimleri insan incelemesinde kontrol edilmeli. | pending |
| S17 | privacy | PASS | Dolaylı tanımlayıcılarla yeniden tanımlama riskini açıklıyor; maskelemeyi kesin anonimlik saymıyor. İki soru ve ileri terim kullanımı not edildi. | pending |
| S18 | privacy | PASS | İlgisiz tarif isteğini yanıtlamadan yazılım olayı ve veri gizliliğine dönüyor. | pending |
| S19 | privacy | PASS | Emir biçiminde seçenek tavsiyesi vermiyor; erişim/veri azaltma ödünleşimini soruyor. İki soru içeriyor. | pending |
| S20 | privacy | PASS | Gelecek sonu açmıyor, mevcut risk profilini sorgulatıyor; karar veya puan değiştirmiyor. | pending |

## Kanıtlar ve tekrar çalıştırma

- [20 vaka](../eval/tutor-cases.json), [ham sonuçlar ve tüm denemeler](../eval/tutor-results.json), [insan inceleme tablosu](../eval/human-review.csv).
- Her sunucu ham cevabı eval/raw/Sxx-requestId.json dosyasında saklanır. Anahtar veya tam sağlayıcı hata mesajı bulunmaz. API hata kodu, HTTP durumu ve süre korunur.
- Sunucuyu TUTOR_EVIDENCE_DIR=eval/raw ile başlatıp npm run tutor:smoke ve npm run tutor:eval çalıştırın. Sonuçları gözden geçirip npm run tutor:report kullanın. Tekrar koşu ana raporu yeniler; önceki raporu tarihli kopyada koruyun.
- transient hatalarda en fazla iki deneme, arada 2 saniye; kota hatasında 10 saniye. Başarısız denemeler silinmez.
- İnsan değerlendirici CSV'de human_reviewer/human_pass/human_comments alanlarını doldurmalı; ön etiket ile düzeltilmiş insan etiketi ayrı kalmalıdır. Otomatik rapor üreticisi insan onayı oluşturmaz.

Gerçek öğrencilerden veri isteniyorsa ayrıca bilgilendirilmiş katılımla 20 gerçek öğrenci mesajı toplanmalı ve aynı servis üzerinden ayrı bir koşu yapılmalıdır. Bu rapor bunu tamamlanmış saymaz.
