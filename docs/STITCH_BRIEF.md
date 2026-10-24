# Google Stitch aktarım metni

Durum: Tasarım isteği hazır; Stitch'te henüz ekran üretilmedi. Aşağıdaki **tek kod bloğunun tamamını** Google Stitch'e yapıştırın. Blok kendi başına yeterlidir; dosya başlığını ve bu açıklamayı aktarmak gerekmez. İstekteki son ekranları tasarım varyantlarıdır; oynama sırasında yalnızca uygulamanın hesapladığı bir tanesi görünür.

```text
08:00 — Kritik Karar
SE Primer: Yazılım Mühendisliği, Oynanan Bir Kitap

Bir üniversite ödevi için Türkçe, mobil öncelikli bir interaktif kitap web uygulamasının ekranlarını tasarla. Bu birinci aşamada tasarım üret; gerçek uygulama mantığı veya Gemini entegrasyonu tamamlandı iddiasında bulunma. Hikâye, aşağıdaki içerik ve seçenekler sabittir. Yeni ürün fikri, bölüm veya kullanıcı sorusu ekleme.

HİS VE GÖRSEL DİL
Sinematik, editoryal, sakin ama gerilimli bir interaktif kitap. Hastane teknolojisi atmosferini çok hafif soyut sinyal çizgileri ve gece ışığıyla hissettir. Hasta fotoğrafı, teşhis, gerçek kişi bilgisi, gerçek log veya tıbbi görüntü kullanma. Ekranlar yönetim paneli gibi görünmesin: tablo yığını, yan menü, KPI kartları, yoğun grafik, hasta listesi veya admin navigasyonu ekleme.

Palet:
- Derin lacivert #101D35: ana arka plan.
- Gece mavisi #172846: seçenek ve Tutor yüzeyleri.
- Sıcak fildişi #F7F1E7: ana metin, kitap hissi.
- Amber #F5A34A: ana eylem, odak halkası ve küçük bölüm işaretleri.
- Soluk turkuaz #5CA6A0: ikincil vurgu ve sonuç ikonları.
Amber ve turkuaz dolgu üzerinde koyu lacivert yazı kullan. Fildişi üzerinde küçük amber/turkuaz metin kullanma. Normal yazıda en az 4.5:1, büyük yazı ve anlamlı UI sınırında en az 3:1 kontrast sağla. Sadece renkle durum anlatma. A/B seçeneklerini aynı görsel ağırlıkta göster; daha iyi seçeneği seçim öncesi renkle veya rozetle belli etme.

TIPOGRAFİ VE YERLEŞİM
Başlıklarda Georgia veya Türkçe karakterleri destekleyen zarif bir serif; gövdede Segoe UI / system sans-serif. İ, ı, Ş, ş, Ğ, ğ, Ü, ü, Ö, ö, Ç, ç karakterlerini doğru göster. Gövde 16–18 px, satır yüksekliği yaklaşık 1.6; başlık mobilde 28–36 px. 8 px aralık sistemi, 24 px ana ekran kenar boşluğu, tek sütun ve geniş nefes alanı. 360 px genişlikte kenar boşluğunu 20 px'e indirebilirsin. Hikâye metni en fazla yaklaşık 65 karakterlik satırlar kullansın.

Önce 390×844 mobil görünüm; ayrıca 360×800 ve 1280×800 uyarlamalarını göster. Masaüstünde ortalanmış dar okuma alanı, Tutor açıkken ikincil dar sütun kullanılabilir. Mobilde Tutor akordeon/panel olarak metnin altında açılsın ve ana eylemi örtmesin. Alt eylem alanı sticky olabilir fakat içerik, klavye ve güvenli ekran boşluğu için yeterli alt boşluk bırak. Eylemler en az 48 px yüksekliğinde, dokunma alanları en az 44×44 px olsun. Klavye odağı görünür olsun. %200 metin büyütmede içerik ve düğmeler kırpılmasın. Hareket azaltma tercihi için animasyonsuz varyant göster. Gerçek süre sayacı, süre dolunca seçim, titreşen alarm kullanma.

EKRAN 1 — ONBOARDING
Üstte küçük “SE PRIMER · BÖLÜM 01”, büyük “08:00 — Kritik Karar”, alt başlık “Yazılım Mühendisliği, Oynanan Bir Kitap”. Açıklama: “Üç karar. Tek kriz. Seçimlerinin teknik sonuçlarını keşfet.”
Tam üç soru; her biri etiketli radio grubu. Hepsi başlangıçta boş olsun:
1. “Deneyim düzeyin nedir?”
   “Yeni başlayan” / “Orta seviye” / “Deneyimli”
2. “Hangi rolden bakmak istersin?”
   “Yazılım geliştirici” / “Test mühendisi” / “Teknik ekip lideri”
3. “Bu bölümde ne öğrenmek istersin?”
   “Mimari kararları öğrenmek” / “Test ve doğrulamayı öğrenmek” / “Güvenlik ve KVKK'yı öğrenmek”
Ana eylem: “Bölüme başla”. Üç seçim tamamlanana kadar pasif; açıklama “Başlamak için üç alandan da bir seçim yap.”
Dipnot: “Tüm kişiler ve kayıtlar kurgusaldır. Hesap açman gerekmez.”
İsim, e-posta, giriş, şifre, profil fotoğrafı veya dördüncü soru ekleme.

EKRAN 2 — AÇILIŞ
Büyük editoryal zaman damgası “Pazartesi · 08:00”.
Başlık: “Geceki sürüm, sabahın krizine dönüştü.”
Metin: “Hastanenin randevu sistemi gece yayımlanan sürümün ardından durdu. Yaklaşık 300 kurgusal kişi hizmetin açılmasını bekliyor. Nöbetçi yazılım mühendisi olarak kurtarmayı sen koordine edeceksin.”
Alt açıklama: “Mimari, test ve veri koruma üzerine üç karar vereceksin. Her kararın ardından teknik etkisini göreceksin.”
Ana eylem: “Kararlara geç”. Bu ekran ek soru içermez.

EKRAN 3 — KARAR 1 / MİMARİ
Üst satır: “BÖLÜM 01 · MİMARİ” ve görünür “1 / 3”.
Başlık: “Önce sistemi nasıl toparlarsın?”
Metin: “Yeni sürümün ardından randevu istekleri hata veriyor. Uygulama sürümü ile veritabanı şeması arasındaki ilişkiyi ve değişikliğin etki alanını düşünmelisin.”
A: “Veritabanı uyumluluğunu kontrol et ve son kararlı sürüme geri dön.”
B: “Doğrudan üretim ortamına acil bir hotfix uygula.”
İki eşit seçenek kartı, radio seçimi ve ayrı “Kararı kesinleştir” düğmesi. Seçim olmadan düğme pasif. Kart seçilince amber kenarlık ve seçili simgesi; bunun yalnızca seçim durumu olduğunu göster. Kesinleştirmeden sonuç gösterme.
İkincil eylemler: “Kavram ipucu”, “AI eğitmene danış”, “Yeniden başlat”.

EKRAN 4 — KARAR 2 / TEST
Üst satır: “BÖLÜM 01 · TEST” ve “2 / 3”.
Başlık: “Trafiği açmadan önce neyi doğrularsın?”
Metin: “Sistem toparlanıyor gibi görünüyor. Operasyon ekibi hizmetin açılmasını bekliyor; birkaç başarılı istek tüm randevu akışının çalıştığını kanıtlamıyor.”
A: “Tam trafiği açmadan önce hedefli smoke ve entegrasyon testlerini çalıştır.”
B: “Hizmeti hemen açmak için testleri atla.”
Aynı seçim/kesinleştirme bileşenini kullan.

EKRAN 5 — KARAR 3 / GİZLİLİK
Üst satır: “BÖLÜM 01 · GİZLİLİK” ve “3 / 3”.
Başlık: “Tanılama loglarını nasıl paylaşırsın?”
Metin: “Tanılama kayıtlarında kurgusal adlar ve tanımlayıcılar var. Takım sohbetinin erişimi olay incelemesinde gerekli kişilerle sınırlı değil. Teknik inceleme için kayıtları paylaşman gerekiyor.”
Küçük, açıkça “Kurgusal log örneği” etiketli blok: “Kurgu Kişi 01 · KURGU-001 · appointment_request_failed”. Teşhis, T.C. kimlik numarası, telefon veya gerçekçi kişi profili ekleme.
A: “Paylaşmadan önce kişisel tanımlayıcıları maskele ve erişimi sınırla.”
B: “Ham, maskelenmemiş logları takım sohbetine gönder.”
Aynı seçim/kesinleştirme bileşenini kullan.

ORTAK KARAR SONRASI GERİ BİLDİRİM BİLEŞENİ
Yalnızca kesinleştirmeden sonra açılır. Üstte “Kararın kesinleşti”, seçilen A/B ve tam seçenek metni. Ardından “Teknik etki” ve “Neden böyle oldu?” alanları. Doğru/yanlış rozeti veya puan verme. Mimari ve testten sonra düğme “Devam et”; gizlilikten sonra “Sonucu gör”. Kesinleşmiş seçenek değiştirilemez. Altında “Yeniden başlat” kalır.
Şu altı içerik varyantını göster:
- Mimari A: “Uyumluluğu doğrulanmış geri dönüş” — “İnceleme, mevcut veritabanı şemasının önceki sürümle uyumlu olduğunu gösterdi. Son kararlı sürüme veri kaybı olmadan dönüldü; hata oranı azaldı.” Neden: “Kod ve şema uyumluluğunu doğrulamak yeni bir geri dönüş hatasını önledi.” Not: “Bu kurguda uyumluluk sağlandı; gerçek olaylarda geri dönüş her zaman güvenli değildir.”
- Mimari B: “Hızlı ama henüz kararlı olmayan toparlanma” — “Hotfix görünen hatayı azalttı; normal yayına alma doğrulamasının dışındaki değişikliğin etkileri henüz tam bilinmiyor.” Neden: “Bekleme azaldı, fakat değişikliğin etki alanına ilişkin kanıt da azaldı.” Not: “İzleme ve kalıcı stabilizasyon gerekiyor.”
- Test A: “Kritik akış için doğrulama kanıtı” — “Randevu arama, kurgusal randevu oluşturma ve uygulama-veritabanı bağlantısı hedefli kontrollerden geçti.” Neden: “Temel akış ve bileşen iletişimi tam trafik öncesinde doğrulandı.” Not: “Hedefli testler tüm hataları dışlamaz.”
- Test B: “Görünmeyen regresyon yeniden ortaya çıktı” — “Doğrulanmayan kritik randevu akışındaki regresyon tam trafik altında tekrar kesinti yarattı.” Neden: “İlk toparlanma sinyali bütün akışın çalıştığına kanıt sayıldı.” Ek: “Log paylaşımı kararını vermek için devam et.”
- Gizlilik A: “Gerekli veri, gerekli erişim” — “Ad ve tanımlayıcılar maskelendi; teknik olay alanları yalnızca olay incelemesinde görevli kişilerle paylaşıldı.” Neden: “Veri miktarı ve erişebilen kişi sayısı birlikte sınırlandı.” Not: “Maskeleme tek başına tam anonimleştirme garantisi değildir.”
- Gizlilik B: “Ham kayıtlar gereğinden geniş paylaşıldı” — “Kurgusal ad ve tanımlayıcılar geniş erişimli takım sohbetine gönderildi.” Neden: “Gerekli olmayan tanımlayıcıların paylaşılması veri yayılımını artırdı.” Not: “Bu kurgu bir gizlilik olayı gösterir; kesin hukuki ihlal veya ceza hükmü vermez.”

KİŞİSELLEŞTİRME VARYANTLARI
27 ayrı hikâye dalı tasarlama; aynı ekranlarda metin katmanı kullan.
- Yeni başlayan: “Geri alma, çalışan önceki sürüme dönmektir.” gibi kısa tanım ve isteğe bağlı “Kavram ipucu”. Terimi ilk kullanımda açıkla.
- Orta seviye: Standart teknik açıklama ve kanıt odaklı soru.
- Deneyimli: Daha derin ödünleşim sorusu; yalnızca metinsel “Operasyon ekibi bir sonraki durum güncellemesini bekliyor.” baskısı. Geri sayım yok.
- Yazılım geliştirici: Sürüm/şema bağımlılığı ve değişiklik kapsamı.
- Test mühendisi: Kritik akış, regresyon ve doğrulama kanıtı.
- Teknik ekip lideri: Koordinasyon, sorumluluk ve erişim sınırı.
- Seçilen hedef: İlgili karar kesinleştikten sonra ve finalde “Mimari odağın”, “Test odağın” veya “Veri koruma odağın” ek paragrafı. Diğer iki kararın etkilerini de göster.
Yeni başlayan + geliştirici + mimari hedefi birleşik örneğini ve deneyimli varyantı ayrıca göster. Seçenekler, ziyaret sırası ve sonuç kuralları hiçbir profilde değişmez.

AI TUTOR PANELİ
Başlık: “AI eğitmen”. Alt açıklama: “Cevabı seçmek yerine düşünmene yardımcı olur.”
Giriş uyarısı: “Gerçek kişi bilgisi yazma; yalnızca kurgu üzerinden düşün.”
Mesaj alanı etiketi: “Düşünceni veya sorunu yaz”. Yer tutucu: “Karar vermeden önce neyi sorgulamak istersin?” Eylem: “Sor”. Sayaç/üst sınır: 1.000 karakter. Mesaj yazmak veya Tutor kullanmak zorunlu değildir.
Seçim öncesi örnek: “Doğrudan bir seçenek söylemeyeyim. Kararını desteklemek için hangi kanıta ihtiyaç duyarsın?”
Tutor A/B tavsiyesi, dolaylı doğru cevap, gelecek son veya puan vermez. Gemini yalnızca öğretmen; karar ve son uygulamanın sabit mantığındadır. Seçim sonrası yalnızca kesinleşmiş mevcut sonucun nedenini açıklayabilir.
Bekleme: “AI eğitmen düşünüyor…”; seçim düğmeleri açık kalır.
Hata: “AI eğitmene ulaşılamadı. Bölüme devam edebilir veya yeniden deneyebilirsin.” Düğme: “Yeniden dene”.
Hata altında “Yerel ipucu” etiketi ve mevcut karara uygun soru:
  Mimari: “Bir değişikliğin sistemin diğer parçalarına etkisini hangi kanıtlarla değerlendirebilirsin?”
  Test: “Sistemin toparlandığını söylemek için birkaç başarılı isteğin dışında hangi kanıta ihtiyaç duyarsın?”
  Gizlilik: “İnceleme için hangi alanlar gerçekten gerekli ve bu bilgilere kimlerin erişmesi gerekiyor?”
Yerel ipucunu gerçek AI yanıtı gibi gösterme. Hazır, bekliyor, başarılı, hata ve yeniden deneme durumlarını tasarla. Yeniden başlatma sohbeti temizler.

SONUÇ EKRANI — DÖRT VARYANT
Kitabın kapanış sayfası gibi; büyük sonuç başlığı, kısa neden-sonuç metni, “Kararlarının izi” altında Mimari/Test/Gizlilik için seçilen seçenek ve teknik etkisi, sonra seçilen öğrenme hedefine ait ek paragraf. Seçilen son kodu küçük ama okunur “Sonuç kodu: ENDING_…” satırında yer alır. Not defteri hissi; puan, liderlik tablosu ve başarı yüzdesi yok.
1. ENDING_SAFE — “Güvenli kurtarma”
   “Uyumlu sürüme dönüş ve hedefli doğrulama sayesinde randevu hizmeti güvenle yeniden açıldı. Log paylaşımında tanımlayıcılar maskelendi ve erişim sınırlandı.”
   Soru: “Hangi kanıtlar kurtarma kararına güvenmeni sağladı?”
2. ENDING_FRAGILE — “Kırılgan kurtarma”
   “Acil hotfix ile hizmet açıldı ve hedefli testler geçti. Üretimdeki acil değişikliğin uzun vadeli etkileri için izleme ve kalıcı stabilizasyon hâlâ gerekiyor.”
   Soru: “Kısa vadeli toparlanmayı sürdürülebilir bir düzeltmeye nasıl dönüştürürdün?”
3. ENDING_RECURRING_OUTAGE — “Kesinti geri döndü”
   “Testler atlandığından kritik akıştaki regresyon tam trafikte yeniden ortaya çıktı. Logların korunması hizmeti doğrulama ihtiyacını ortadan kaldırmadı.”
   Soru: “Trafiği açmadan önce hangi kritik akışı kanıtlamak isterdin?”
4. ENDING_PRIVACY_INCIDENT — “Gizlilik olayı”
   “Hizmetin teknik durumundan bağımsız olarak ham loglar gereğinden geniş paylaşıldı. Veri yayılımını inceleme ve erişimi sınırlandırma gereği doğdu.”
   Soru: “İncelemeyi sürdürebilmek için hangi veri alanları ve erişim sınırı yeterli olurdu?”
   Not: “Gerçek bir olayın hukuki niteliği koşulları incelenerek değerlendirilir; burada otomatik yaptırım hükmü verilmez.”
Hepsinde ana eylem: “Yeniden başlat”. Alt metin: “Profilin, kararların ve sohbetin temizlenir; üç soruya yeniden dönersin.” Yeniden başlatma tüm alanları boşaltır. İkinci bölüm veya hesap oluşturma CTA'sı ekleme.

SONUÇ MANTIĞI — TASARIM TUTARLILIĞI İÇİN
Her oyuncu üç kararı da ziyaret eder. A/B harf sırası Mimari, Test, Gizlilik:
AAA → ENDING_SAFE
AAB → ENDING_PRIVACY_INCIDENT
ABA → ENDING_RECURRING_OUTAGE
ABB → ENDING_PRIVACY_INCIDENT
BAA → ENDING_FRAGILE
BAB → ENDING_PRIVACY_INCIDENT
BBA → ENDING_RECURRING_OUTAGE
BBB → ENDING_PRIVACY_INCIDENT
Öncelik: gizlilik olayı > yinelenen kesinti > kırılgan kurtarma > güvenli kurtarma. Son uygulama tarafından hesaplanır; Gemini veya Stitch seçimler dışında bir sonuç icat etmez. Özellikle BBB final örneğinde hotfix'in izleme ihtiyacı, tekrar kesinti ve ham log paylaşımı üçü de görünür olsun. Seçim öncesi bu tabloyu veya gelecekteki sonuç başlıklarını oyuncuya gösterme.

TESLİM
Onboarding, açılış, üç karar ekranı, altı karar sonrası geri bildirim varyantı, dört son ekranı ve Tutor durumlarını düzenlenebilir tasarım olarak üret. Mobil ana çerçeveler ve masaüstü uyarlamasıyla birlikte boş/seçili/pasif/odak durumlarını göster. Tasarım notlarında renk, tipografi, aralık, bileşen, erişilebilirlik ve kişiselleştirme kurallarını belirt. Bu çıktılar uygulamanın daha sonra Google AI Studio'da geliştirilmesi için kullanılacak.
```
