# Primer Adapt — Phase 1 raporu

**1 Kasım 2026 · Europe/Istanbul.** Gerçek gönüllü oturumlarını toplamaya hazır altyapı tamamlandı. **Model eğitilmedi veya yayımlanmadı; insan verisi uydurulmadı.** Çalışma dizini: `C:/Users/Emre/Desktop/nurettin/0800-kritik-karar/githuba at`.

## Kullanım

- Çalışan yerel toplama modu: **http://127.0.0.1:3000/?mode=collection**. Sunucu kapalıysa proje dizininde `npm run dev`. Bu bir localhost adresidir; başka cihazlar için aynı bilgisayarın adresi değildir. Kamuya açık yeni dağıtım yapılmadı.
- Gerçek oturum: normal tarayıcıda Türkçe bilgilendirmeyi oku, isteğe bağlı P01/P02/P03 kodunu gir, açık onay ver, üç profil alanını seç ve hikâyeyi başlat. Her kesinleştirmeden sonra/teknik sonuçtan önce bağımsız zorluk yanıtını ver. Üç karar etiketlenince oturum tamamlanır.
- CSV: yeniden başlatınca toplama panelindeki **Tüm tamamlanan oturumları CSV indir** düğmesi. Bütün tamamlanan gerçek/sentetik oturumlar kaynak etiketiyle export edilir; eksikler hariçtir. Restart veri silmez. Vazgeçme, tek oturum silme ve onaylı tümünü silme araçları vardır.
- Doğrulama: `npm run data:validate`; veri hazır olma kapısı: `npm run data:validate -- --require-ready`. Birleştirme: `npm run data:merge -- --output data/oturumlar.csv cihaz1.csv cihaz2.csv`; aynı UUID'li özdeş oturum tekilleştirilir, çelişkide çıktı yazılmaz. [Türkçe rehber](HUMAN_COLLECTION_GUIDE.md), [veri sözlüğü](../data/SOZLUK.md).

## Ön kayıt ve kapsam

v1 etiketi `primer-v1`, commit `5ce833e04d0c3ef5ba09e961a0d6e0cf8b91bc99`; çalışma dalı **feature/primer-v2**. Eğitim öncesi [kabul kapısı](ML_ACCEPTANCE_GATE.md), **3a171896c020ba5465acc655f118b26f2e4bab16** commit'inde kaydedildi. Sabit birincil metrik: **gruplu dış örneklem balanced accuracy >=0.60**. Aynı oturumun kararları, biliniyorsa aynı Pxx katılımcının bütün tekrarları aynı değerlendirme grubunda tutulur; satır düzeyinde rastgele ayırma yasaktır. En az 15 gerçek tam oturum; her sınıfta en az 5 gerçek satır/3 gerçek oturum gerekir. Python sklearn–ONNX ve beş örnekte Oracle–tarayıcı farkı <1e-4 olmalıdır. Model metrik/parite kapıları bu aşamada **ölçülmedi, bekliyor**; model yayını yapılmadı.

Spec'e tam üç yeni v2 kabul örneği eklendi. Gelecek düşük/yüksek model davranışı ve ONNX örnekleri sonraki aşamayı bağlar; Phase 1 bu işlevler varmış gibi sahte tahmin göstermez. [Koruma/ön kayıt kanıtı](../evidence/phase1/preservation.json): v1 spec'in tamamı korunmuş, hikâye/son motoru, Tutor sunucusu, tasarım ve eski Cypress dosyaları değişmemiştir.

## Çalıştırılmış testler

| Komut | Gerçek sonuç |
|---|---|
| npm ls --depth=0 | PASS, bağımlılıklar mevcut |
| npm run typecheck | PASS |
| npm run build | PASS |
| npm test | **11/11 PASS** v1 birim testi |
| npm run test:data | **25/25 PASS**; sayısal aralık, etiket, kişisel sütun, duplicate/eksik oturum, kaynak, kalıcılık, silme, CLI negatifleri ve çelişkili merge |
| npm run cy:run | **19/19 PASS**: 8 yol + 11 mevcut özellik |
| npm run cy:collection | **13/13 PASS**: onay/ret, ölçüm/dondurma/120sn, bağımsız etiket, kaynak, restart/refresh/UUID, bütün CSV, eksik dışlama, vazgeçme/silme, depolama hataları, klavye/360px |
| npm run data:validate | Başlık geçerli; **0 gerçek oturum / 0 gerçek satır**, dataReady=false |
| npm run security:scan | PASS; kaynak/dist/Git geçmişi, anahtar değeri yazdırılmadı |

Toplu tekrar: çalışan sunucuyla `npm run verify:phase1`. [Exact komut/exit kodları](../evidence/phase1/verification.json), [v1 Cypress](../evidence/phase1/cypress-v1.json), [toplama Cypress](../evidence/phase1/cypress-collection.json). Otomatik etkileşimler yalnız testtir; oturumları `sentetik` olarak tutuldu ve gerçek insan sayılmadı. Veri dosyasına eklenmedi. [Gerçek veri sayımı](../evidence/phase1/data-summary.json).

Önceki başarısız koşular da korunur: [10/12](../evidence/phase1/cypress-collection-initial.json), [11/12](../evidence/phase1/cypress-collection-retry1.json), [12/13](../evidence/phase1/cypress-collection-retry2.json). Depolama-hatası testindeki yanlış başlangıç helper'ı düzeltildi; klavye onayı işlendi; CSV dosyasının yenilenmesi retry edilebilir assertion ile beklendi. Son 12/13 koşusunda işlev hatası değil, isteğe bağlı ekran görüntüsü alma zaman aşımı vardı; tarayıcı zamanlayıcılarını durdurmadan çekimle tekrar **13/13** geçti. Assertion kaldırılmadı. Başarısız testlerin video/ekran görüntüleri `artifacts/cypress/` altında kalır.

## Güncel veri ve açık iş

**Depodaki gerçek insan oturumu: 0; gerçek karar satırı: 0.** `data/oturumlar.csv` yalnız başlıktır. Bu çalışmada gönüllü katılımcı oturumu toplanmadı; diğer tarayıcıların yerel depoları merkezi olarak okunmaz. Varsayılan sonraki adım üç gerçek gönüllünün beşer doğal tam oyunu: 15 oturum/45 satır. Kişiler etiket dengesi veya model başarısı için yönlendirilmez. İnsan verisi ve iki sınıf temsili henüz olmadığı için **eğitim veri kapısı hazır değildir**; bu, toplama altyapısının çalışmasını engellemez.

Yerel depolama, farklı cihazlara/portlara otomatik taşınmaz ve tarayıcı temizlenirse kaybolabilir; düzenli CSV export'u gerekir. WebDriver/Cypress/güvenilir olmayan olaylar sentetik ayrılır; bu teknik kontrol tek başına gerçek insan/onay kanıtı değildir. Gönüllü protokolü, kimlikle eşleme tutmama ve geri çekme işlemleri uygulanmalıdır. Yayımlanmış/indirilmiş kopyalar tarayıcıdan silmeyle geri alınmaz. Gemini'nin mevcut sunucu/istem davranışı korunmuştur; Phase 1 testleri ağ interception'ı kullanır, yeni canlı Gemini kalitesi testi veya model başarısı iddiası değildir.

**Phase 1 burada biter. Eğitim, ONNX üretimi, tahminle uyarlama ve model yayını yapılmaz.**
