# Tasarım sözleşmesi — 08:00 — Kritik Karar

**Aşama 1 / ön tasarım, 24 Ekim 2026.** Bu belge tasarım hedeflerini tanımlar; gerçek Stitch ekranları henüz üretilmedi. Ekran üretiminden sonra gerçek tasarım bağlantıları, dışa aktarımlar ve farklar bu belgeye eklenmelidir. Stitch'e verilecek tam metin: [docs/STITCH_BRIEF.md](docs/STITCH_BRIEF.md).

## Deneyim ilkesi

Oyuncu, pazartesi saat 08:00'de başlayan tek bir yazılım krizini bir kitabın sayfalarını çevirir gibi yaşar. Görsel hiyerarşi zaman → bölüm → kısa anlatı → iki eşit seçenek → düşünme desteği → karar eylemi şeklindedir. Hastane atmosferi soyut ve dekoratiftir; gerçek hasta listesi, tıbbi fotoğraf veya yönetim ekranı yoktur. A/B seçenekleri karar verilmeden eşit ağırlıktadır.

## Renk tokenları ve kullanım

| Token | Değer | İşlev |
|---|---|---|
| color.background | #101D35 | Ana zemin, koyu düğme yazısı |
| color.surface | #172846 | Seçenek kartı, Tutor paneli, log örneği |
| color.text | #F7F1E7 | Gövde ve başlık |
| color.action | #F5A34A | Ana CTA, seçili kart sınırı, odak halkası |
| color.support | #5CA6A0 | Yardımcı vurgu, ikon; metin etiketiyle birlikte |

Tam opak renklerin hesaplanan kontrastları:

| Ön plan / zemin | Oran | Kullanım kararı |
|---|---:|---|
| Fildişi / derin lacivert | 14.96:1 | Ana metin |
| Fildişi / gece mavisi | 13.09:1 | Panel metni |
| Amber / derin lacivert | 8.18:1 | Küçük vurgu veya ters çiftle düğme |
| Turkuaz / derin lacivert | 5.94:1 | İkincil metin veya ters çiftle etiket |
| Amber / gece mavisi | 7.16:1 | Seçili sınır ve vurgu |
| Turkuaz / gece mavisi | 5.19:1 | Yardımcı metin/ikon |
| Amber / fildişi | 1.83:1 | Küçük metin ve anlamlı UI sınırı olarak kullanma |
| Turkuaz / fildişi | 2.52:1 | Küçük metin ve anlamlı UI sınırı olarak kullanma |
| Gece mavisi / derin lacivert | 1.14:1 | Yüzey farkı tek başına kontrol sınırı olamaz |

Kontrastlar WCAG sRGB bağıl parlaklık formülüyle hesaplandı; gerçek ekran erişilebilirlik denetimi değildir. Etkileşimli seçenekleri belirgin fildişi veya turkuaz sınır, radio işareti ve etiketle ayır. Yarı saydam/dekoratif katmanları metin arkasına bindirirsen gerçek birleşik renk tekrar ölçülür. Pasif düğmenin nedenini yakın metin açıklar. Hata renk dışında ikon ve açık cümleyle bildirilir.

## Tipografi, boşluk ve hareket

- Başlık: Georgia, serif; mobil 28–36 px, masaüstü en çok 48 px. Saat damgası tipografik vurgu olabilir.
- Gövde: Segoe UI, system-ui, sans-serif; 16–18 px, yaklaşık 1.6 satır aralığı. Türkçe karakterler ve %200 büyütme kontrol edilir.
- 8 px aralık sistemi; ana mobil kenarlar 24 px, dar görünümde 20 px; kart içi 16–24 px; ana bloklar arası 24–32 px.
- Hikâye sütunu yaklaşık 65ch; kararlar ve onboarding mobilde tek sütun. 1280 px görünümde ortalanır; Tutor isteğe bağlı ikinci sütun olabilir.
- Dokunma hedefi en az 44×44 px, ana düğme yüksekliği hedefi 48 px. Odak 2 px amber halka ve en az 2 px boşlukla görünür.
- Geçişler hafif ve en çok yaklaşık 150–200 ms; hareket azaltma tercihinde kapalı. Yanıp sönen alarm veya gerçek sayaç yoktur.

## Ekran envanteri

| Ekran / bileşen | İçerik | Zorunlu durumlar |
|---|---|---|
| Onboarding | Başlık ve tam üç radio grubu | Boş, kısmi, tamam; pasif/etkin “Bölüme başla” |
| Açılış | Pazartesi 08:00, gece sürümü, yaklaşık 300 kurgusal kişi | “Kararlara geç”; ek soru yok |
| Mimari | “1 / 3”, sabit olay, iki seçenek | İşaretsiz, A/B taslak, kesinleştirme |
| Test | “2 / 3”, doğrulama ve baskı | İşaretsiz, A/B taslak, kesinleştirme |
| Gizlilik | “3 / 3”, yalnızca kurgusal log örneği | İşaretsiz, A/B taslak, kesinleştirme |
| Karar sonrası | Seçilen metin, etki, neden, kapsam notu | Altı varyant; ilk ikisinde devam, son kararda sonucu gör |
| Tutor | Opsiyonel yönlendirme paneli | Hazır, bekliyor, gerçek AI yanıtı, hata, “Yerel ipucu”, yeniden deneme |
| Son | Dört başlık varyantı ve üç teknik iz | AAA güvenli; BAA kırılgan; ABA/BBA kesinti; gizlilik B olanlar gizlilik olayı |
| Yeniden başlatma | Karar, geri bildirim, son üzerinde eylem | Profil, seçimler, sohbet temizlenmiş onboarding |

## Bileşen davranışı ve erişilebilirlik

Radio grupları semantik `fieldset`/`legend` ile etiketlenir; kartın tamamı tıklanabilir. Taslak seçim ile kesinleşmiş seçim ayrı durumlardır. Enter/Space doğal kontrol davranışıyla çalışır; seçim kesinleştirme düğmesine basmadan kayıt yazılmaz. Klavye odağı yeni sahnede başlığa, geri bildirimde etki başlığına taşınır. İlerleme göstergesi yalnızca dekoratif çubuk değildir; “Karar 2 / 3” gibi erişilebilir adı vardır.

Tutor mobilde akış içinde açılır; ana eylemi örtmez, odak tuzağı oluşturmaz. Hata/sonuç değişiklikleri uygun canlı bölgeyle duyurulur. Sticky eylem alanında güvenli alt boşluk ve içeriğin altına ulaşma imkânı vardır. Renk körlüğünde seçili/son durumlar metin ve simgeyle anlaşılır. Ekranlar 360×800, 390×844, 1280×800; yeniden akış ayrıca 320 CSS px genişlikte incelenir.

## Türkçe metin kaynağı ve kişiselleştirme

Temel karar ve etki metinlerinin kaynağı [decision-tree.json](story/decision-tree.json); ekran bazlı tam aktarım metni [STITCH_BRIEF.md](docs/STITCH_BRIEF.md). Şunlar sabit UI eylemleridir: “Bölüme başla”, “Kararlara geç”, “Kararı kesinleştir”, “Devam et”, “Sonucu gör”, “Kavram ipucu”, “AI eğitmene danış”, “Yeniden dene”, “Yeniden başlat”.

Deneyim sözcük düzeyini ve ipucunu, rol perspektifi, hedef ise kesinleşmiş teknik sonuçtaki ek paragrafı değiştirir. Kişiselleştirme olayları, iki seçeneği veya sonuçları değiştirmez. Başlangıçta yeni başlayan/geliştirici/mimari örneği ve deneyimli baskı metni tasarlanır; 27 dal üretilmez. İleri kullanıcı için de gerçek zaman sınırlaması bulunmaz.

## Sonraki aşama tasarım kontrolü

Gerçek Stitch çıktıları eklendiğinde ekran bağlantıları ve tarih, mobil/masaüstü görüntüleri, radio/odak/hata durumları ve görünür kopya karşılaştırması kaydedilir. Kontrast ve metin taşması gerçek ekranlarda tekrar kontrol edilir. Hikâye ekranında gelecek sonu ele veren rozet, puan veya öneri bulunmamalıdır. BBB finalinde gizlilik sonu gösterilirken hotfix'in izleme ihtiyacı ve tekrarlayan kesinti de okunabilir olmalıdır. Bu kontrollerin hiçbiri şu anda uygulama üzerinde tamamlanmış değildir.
