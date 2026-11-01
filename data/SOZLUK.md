# Primer Adapt — veri sözlüğü, sürüm 1

Hedef dosya: `data/oturumlar.csv`. UTF-8 (isteğe bağlı BOM), virgül ayırıcı, ondalık nokta; LF/CRLF ve standart CSV tırnakları desteklenir. Sabit **10 sütun**, aynı sırayla; ek alanlar gizlilik ve sözleşme kontrolünde reddedilir. Başlangıç dosyası yalnız başlık içerir: **0 gerçek oturum, 0 satır**.

| Sütun | Tür / aralık / anlam | Model girdisi? |
|---|---|---|
| session_id | Her yeni oyun için kriptografik rastgele UUID v4; kalıcı kişi/cihaz kimliği değildir | Hayır |
| participant_group | Boş veya P01–P99; aynı gönüllünün tekrarlarını gruplamak için isteğe bağlı, kimlikle eşleme tutulmaz | Hayır |
| scene_number | Tamsayı 1, 2, 3; mimari, test, gizlilik sırası | Evet, **5.** |
| decision_elapsed_seconds | Sonlu 0–120 saniye, en çok üç ondalık; kararın tarayıcıda sunulması ile kesinleştirme arasındaki `performance.now()` farkı, 120'de kırpılır | Evet, **1.** |
| option_switch_count | Negatif olmayan güvenli tamsayı; ilk seçim sayılmaz, A→B/B→A değişimleri sayılır; aynı seçeneğe yeniden tıklamak sayılmaz | Evet, **2.** |
| hint_request_count | Negatif olmayan güvenli tamsayı; kesinleştirmeden önce açılan kavram ipucu ve gönderilen açık Tutor isteği (panel hızlı sorusu dahil); ipucunu kapatmak sayılmaz | Evet, **3.** |
| prior_high_risk_choice_count | 0–(scene_number−1) tamsayı; yalnız önceki kesinleşmiş B seçimlerinin sayısı; bağımsız zorluk etiketi değildir | Evet, **4.** |
| experience_code | beginner=0, intermediate=1, experienced=2; aynı oturumda sabit | Evet, **6.** |
| difficulty_label | Tam `0` veya `1`; insanın kesinleştirmeden SONRA ve sonuç açıklamasından ÖNCE verdiği öz bildirim | **Hedef, girdi değil** |
| kaynak | Yalnız `gercek` veya `sentetik`; oturumun bütün satırlarında aynı | Hayır |

**Kesin predictor sırası:** `decision_elapsed_seconds`, `option_switch_count`, `hint_request_count`, `prior_high_risk_choice_count`, `scene_number`, `experience_code`. CSV sütun sırası bundan farklıdır; eğitim/ONNX tarafı isimle seçip bu sıraya koymalıdır. UUID/grup/kaynak/etiket veya daha sonraki bilgiler girdi yapılamaz.

Altı özellik karar onayı sırasında dondurulur. “Bu kararı verirken belirgin biçimde zorlandın mı?” sorusuna “Evet, zorlandım”=1, “Hayır, zorlanmadım”=0. Etiket yanıtlama süresi ölçüme eklenmez; hedef süre, seçim, ipucu, sonuç veya bir kuraldan türetilmez. Öz bildirim nesnel psikolojik tanı, bilgi düzeyi veya başarı ölçütü değildir. Sekme değiştirme/düşünme süresi geçen süreye dahildir; bu değişken tek başına gerçek bilişsel yükü ölçmez.

## Kayıt ve kaynak

Yalnız açık onaydan sonra oyun başlatıldığında oturum oluşturulur. Tarayıcıdaki `primer-adapt.collection.v1` anahtarında `{version:1,sessions:[...]}` tutulur. Her oturumun `status` değeri `incomplete` veya `completed`, `rows` alanı etiketlenmiş sayısal satırlardır. Bu iki yapısal alan CSV predictor'ı değildir. Tam üç sıralı/benzersiz sahne varsa `completed`; boş/1/2 satırlı oturum `incomplete` kalır. Etiketi verilmemiş karar satırı üretilmez. Yenilemede eksik oturum sürdürülmez, yeni oyun yeni UUID alır. Restart hiçbir eski kaydı silmez. Üçüncü kararın etiketi kaydedildiğinde üç karar tamamlanmıştır; final ekranını izleme zamanı toplanmaz.

UI, WebDriver/Cypress veya güvenilir olmayan olay tespit ederse oturumu `sentetik` yapar; bir oturumda bu sonradan görülürse önceki satırları da `sentetik` olarak düşürür, tekrar `gercek` yapmaz. Onay/start ve kayda konu etkileşimler güvenilir kullanıcı olaylarıysa ve otomasyon tespit edilmezse `gercek` kaydedilebilir. Bu işaretler kriptografik insan/katılım kanıtı değildir: tespit edilmemiş işletim sistemi otomasyonunu dışlamaz ve CSV elle değiştirilebilir. Bu yüzden `gercek` yalnız gerçekten gönüllü insanlarla uygulanan toplama protokolünde kullanılmalıdır; test/simülasyon CSV'lerinin kaynağı asla elle `gercek` yapılmaz. Birim testi şema fixture'ları gerçek insan verisi olarak export edilmez veya sayılmaz.

CSV export'u bu origin/tarayıcıdaki **tüm tamamlanan oturumları** içerir, sentetik kaynak etiketi korunur. Eksik oturumlar dışarıda kalır; UI'da ayrı sayılır. Aynı veri farklı port, tarayıcı, profil veya cihazda otomatik paylaşılmaz. localStorage tarayıcı temizlenirse/gizli pencere kapanırsa kaybolabilir; düzenli dışa aktarım gerekir. Depolama/bozuk veri hataları gösterilir, başarısız kayıt başarılı sayılmaz ve mevcut bozuk veri üzerine yazılmaz.

## Gizlilik ve doğrulama

Ad, soyad, e-posta, telefon, IP, kesin konum, cihaz kimliği, tıbbi veri, serbest metin soru/geri bildirim, tam olay zaman damgası, rol/hedef, mevcut seçimin harfi veya final sonucu saklanmaz. Başka yerel anahtarlara veya harici sunucuya davranış kaydı yazılmaz. İsteğe bağlı Tutor'a kullanıcının kendi gönderdiği soru mevcut Gemini servisine gider; davranış özellikleri ve toplama UUID'si bu isteğe eklenmez. Soruların model tarafından yanıtlanması ayrı v1 işlevidir, eğitim veri kümesinde saklanmaz.

Kaynak kodu başlıklı boş veri dosyasını içerir; gerçek satırlar kullanıcı export edip açıkça eklemedikçe Git'e veya sunucuya otomatik gitmez. Açık GitHub kullanım olasılığı onay metninde anlatılır. Tarayıcıdan silme indirilen/yayımlanan kopyaları otomatik silmez; paylaşım sorumlusu anonim UUID ile geri çekme isteklerini ayrıca uygular. Kimlik eşleme listesi tutulmaz.

`npm run data:validate` şemayı, sonlu sayıları, aralıkları, binary etiketi, kaynakları, benzersiz (session_id,scene_number), tutarlı oturum metadata'sını ve her oturumda tam 1/2/3 sahnelerini denetler. Geçersiz hücre içeriklerini hata loguna basmaz. Boş veri şema bakımından geçerli, eğitim bakımından hazır değildir. `--require-ready`, en az 15 gerçek tamamlanmış oturum ve her etikette en az 5 gerçek satır/3 gerçek oturum ister; sentetikler sayılmaz. Bu komut modelin metrik/parite kapısını doğrulamaz. CSV doğrulama gönüllünün gerçekten insan olduğunu veya onayın gerçekliğini doğrulayamaz.

`npm run data:merge -- --output data/oturumlar.csv cihaz1.csv cihaz2.csv` her girdiyi denetler, aynı UUID'li özdeş tam oturumları tekilleştirir; çelişki/eksik varsa çıktı yazmadan hata verir. Kaynak veya etiket değiştirilmez; iki cihazdaki aynı P01 aynı gönüllü için kullanılmalı, rastgele UUID çakışmalarında veri uydurulmaz.
