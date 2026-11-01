# Primer Adapt — eğitim öncesi kabul kapısı

Ön kayıt tarihi: **1 Kasım 2026, Europe/Istanbul**. Bu dosya ilk gerçek model eğitiminden ÖNCE ayrı commit ile kaydedilir. Phase 1'de model eğitilmez veya yayımlanmaz. v1 koruma etiketi: `primer-v1`; çalışma dalı: `feature/primer-v2`.

| Kapı | Önceden sabitlenen gereklilik |
|---|---|
| Hedef | İnsan tarafından sonuçtan önce bildirilen belirgin karar zorluğu, `difficulty_label` 0/1 |
| Birincil başarı | Gruplu dış örneklem tahminlerinde **balanced accuracy >= 0.60** |
| Metrik | (Sınıf 0 duyarlılığı + sınıf 1 duyarlılığı) / 2; 0.60 sonuçtan sonra ayarlanamaz |
| Gerçek örneklem | En az **15 tamamlanmış gerçek insan oturumu**, her biri tam üç etiketli karar |
| İki sınıf | Her sınıfta en az **5 gerçek satır**, en az **3 farklı gerçek oturum**; bu alt sınır güvenilir genelleme garantisi değildir |
| Ayırma | Satır düzeyinde rastgele ayırma YASAK; oturum aynı katta; Pxx varsa katılımcının bütün tekrarları aynı katta |
| Değerlendirme | Uygun sayıda GroupKFold/leave-one-group-out ile her değerlendirilen grup eğitim dışında; sınıf kapsamı yetersizse kapı BLOCKED; fold bazında sayılar ve toplu OOF metrik raporlanır |
| Ön işleme | Ölçekleme/dönüşüm/eksik değer işlemi yalnız eğitim katında öğrenilir; test verisiyle eşik/model ayarı yapılmaz |
| Sentetik veri | `kaynak=sentetik` insan oturumu sayısına ve birincil gerçek-veri metriğine KATILMAZ |
| sklearn–ONNX | Aynı referans girdilerinde mutlak olasılık farkı **< 1e-4** |
| Oracle–tarayıcı | **Beş** sabit referans örneğinde Python Oracle–tarayıcı ONNX mutlak farkı **< 1e-4** |
| v1 regresyon | Sekiz yol, dört son ve mevcut **19 Cypress** testi doğru |
| Ürün sınırı | Model A/B seçimlerini, sonları veya seçenek erişimini değiştiremez; Gemini Tutor korunur |
| Yayın | Birincil metrik başarısızsa model YAYIMLANMAZ; veri, sınıf, parite veya regresyon kapısı eksikse de yayın engellenir |

Gelecek davranış eşiği ön kaydı: `p_difficulty >= 0.5` HIGH_DIFFICULTY; altında LOW_DIFFICULTY. Bu eşik test sonucuna göre ayarlanmaz. Phase 1'in toplama arayüzünde tahmin veya eğitimli model varmış gibi gösterim yapılmaz.

Sabit predictor sırası: `decision_elapsed_seconds`, `option_switch_count`, `hint_request_count`, `prior_high_risk_choice_count`, `scene_number`, `experience_code`. Girdiler kesinleştirme anında dondurulur. UUID, grup, kaynak, etiket, sonradan geri bildirim ve gelecek seçimler predictor değildir.

Üç gönüllünün beşer oyunu 15 oturum/45 karar üretir; bağımsız 45 kişi üretmez. Aynı kişinin öğrenmesi ve tekrarları korelasyon taşır. Satır rastgele bölünürse aynı oturumun/kişinin örüntüleri hem eğitim hem testte bulunur ve metrik şişebilir. Grup kodu biliniyorsa oturum yerine katılımcı düzeyinde ayırmak daha güçlüdür; kod verilmezse yalnız oturum gruplaması yapılabilir ve katılımcı sızıntısı riski raporlanır. Küçük örneklemde 0.60'ı geçmek pedagojik etkiyi veya nüfusa genellemeyi kanıtlamaz; sınıf/grup dağılımı ve belirsizlik ayrıca raporlanmalıdır.

Şu anda model yok, gerçek oturum **0**, eğitim ve parite metrikleri **ölçülmedi**. A1 Phase 1 kapsamı; A2/A3 model davranışı/paritesi sonraki aşamada doğrulanacaktır. [Üç v2 kabul örneği](../spec.md#13-primer-v2--ön-kayıt-primer-adapt--karar-yüküne-duyarlı-öğrenme).
