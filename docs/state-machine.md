# Durum makinesi — 08:00 — Kritik Karar

Bu grafik uygulama planıdır. Profil yalnızca sunumu değiştirir; her oyuncu üç karar ve üç geri bildirim görür. A/B seçeneğini işaretlemek taslaktır, kesinleştirmek olaydır. Kesinleşmiş geçmiş değiştirilemez.

## Ana akış

```mermaid
flowchart TD
    START([Yeni oturum]) --> ONBOARDING[Onboarding ve acilis: tam uc soru, Pazartesi 08:00]
    ONBOARDING -->|Uc gecerli secim ve Hikayeye basla| D1{1 / 3 Mimari}
    D1 -->|A kesinlestir| C1A[Uyum dogrulandi ve geri donuldu]
    D1 -->|B kesinlestir| C1B[Hotfix: izleme ihtiyaci]
    C1A -->|Devam et| D2{2 / 3 Test}
    C1B -->|Devam et| D2
    D2 -->|A kesinlestir| C2A[Hedefli testler gecti]
    D2 -->|B kesinlestir| C2B[Regresyon tekrar kesinti yaratti]
    C2A -->|Devam et| D3{3 / 3 Gizlilik}
    C2B -->|Devam et| D3
    D3 -->|A kesinlestir| C3A[Maskeleme ve sinirli erisim]
    D3 -->|B kesinlestir| C3B[Ham log genis kanala gitti]
    C3A -->|Sonucu gor| VALID{Uc karar gecerli mi?}
    C3B -->|Sonucu gor| VALID
    VALID -->|Hayir| INVALID[Son uretme: durum hatasi]
    INVALID -->|Temiz yeniden baslat| RESET
    VALID -->|Evet| P1{Gizlilik B mi?}
    P1 -->|Evet: oncelik 1| ENDING_PRIVACY_INCIDENT[Gizlilik olayi]
    P1 -->|Hayir| P2{Test B mi?}
    P2 -->|Evet: oncelik 2| ENDING_RECURRING_OUTAGE[Kesinti geri dondu]
    P2 -->|Hayir| P3{Mimari B mi?}
    P3 -->|Evet: oncelik 3| ENDING_FRAGILE[Kirilgan kurtarma]
    P3 -->|Hayir: oncelik 4| ENDING_SAFE[Guvenli kurtarma]
    ENDING_PRIVACY_INCIDENT -->|Yeniden baslat| RESET[Oturumu temizle ve kimligi yenile]
    ENDING_RECURRING_OUTAGE -->|Yeniden baslat| RESET
    ENDING_FRAGILE -->|Yeniden baslat| RESET
    ENDING_SAFE -->|Yeniden baslat| RESET
    D1 -.->|Yeniden baslat| RESET
    D2 -.->|Yeniden baslat| RESET
    D3 -.->|Yeniden baslat| RESET
    C1A -.->|Yeniden baslat| RESET
    C1B -.->|Yeniden baslat| RESET
    C2A -.->|Yeniden baslat| RESET
    C2B -.->|Yeniden baslat| RESET
    C3A -.->|Yeniden baslat| RESET
    C3B -.->|Yeniden baslat| RESET
    RESET --> ONBOARDING
```

Grafik etiketleri ayrıştırıcı uyumluluğu için sade Latin harfleriyle yazıldı; gerçek UI metinleri `STITCH_BRIEF.md` içindeki Türkçe biçimlerdir. `ENDING_*` düğüm kimlikleri JSON son kimlikleriyle aynıdır.

## Geçiş ve koruma kuralları

| Durum / olay | Koruma | Yazılan veri ve hedef |
|---|---|---|
| ONBOARDING / seçim | Her gruptan tek izinli değer | Yalnızca profil taslağı; otomatik hikâye başlangıcı yok |
| ONBOARDING / başla | Üç alan da geçerli | Açılış aynı ekrandadır; profil sabitlenir → architecture, pendingChoice=null |
| D1, D2, D3 / A veya B işaretle | Mevcut karar kesinleşmemiş | pendingChoice güncellenir; AI veya sonuç çağrısı gerekmez |
| Karar / kesinleştir | pendingChoice A/B; önceki tüm kararlar kesinleşmiş | Seçim bir kez kaydedilir → o seçimin C durumu |
| C1A/C1B / devam | 1. sonuç gösterilmiş | testing ekranı, pendingChoice=null |
| C2A/C2B / devam | 2. sonuç gösterilmiş | privacy ekranı, pendingChoice=null |
| C3A/C3B / sonucu gör | Üç karar tamam | Seçimleri doğrula → öncelikli deterministik değerlendirme |
| Sonuç / görüntüle | Tek endingId hesaplanmış | Üç ayrı seçim/etki satırı + sonuç metni + hedef vurgusu |
| Aktif karar, geri bildirim, sonuç / yeniden başlat | Kullanıcı tıklaması | Tüm oturumu temizle → ONBOARDING |
| Her durum / sayfa yenile | Bellek oturumu | Aynı temiz başlangıç; kalıcı kayıt yüklenmez |

Eksik/geçersiz seçim, geliştirici veya veri hatasıdır; sessizce A ile doldurulmaz ve Gemini'den son istenmez. Görünür metin: “Oturum bilgisi doğrulanamadı. Yeniden başlatarak devam edebilirsin.” Tarayıcı geri düğmesi kesinleşmiş kararı yeniden düzenlenebilir yapmaz; ekran durumu oturumun geçerli durumundan türetilir. Geçmişi değiştirmek için temiz yeniden başlatma gerekir.

## Tutor bağımsız alt akışı

```mermaid
flowchart LR
    IDLE[Hazir] -->|Soru gonder| WAIT[Gemini bekleniyor]
    WAIT -->|Gecerli ve sizintisiz yanit| ANSWER[AI egitmen yaniti]
    WAIT -->|Hata veya 10 sn timeout| FALLBACK[Yerel ipucu ve yeniden dene]
    WAIT -->|Bos veya supheli yanit| FALLBACK
    WAIT -->|Oturum veya karar degisti| DROP[Yanit atilir]
    ANSWER -->|Yeni soru| WAIT
    FALLBACK -->|Kullanici yeniden dener| WAIT
    DROP --> IDLE
```

Ana akış Tutor durumunu beklemez. İstek sürerken seçim kesinleştirilirse `before_choice` isteği artık geçersizdir; yeni evre için bağlam yeniden oluşturulur. Sonuç ekranında açık cevap üretimi yerine deterministik özet kullanılır. Yeniden başlatma istekleri iptal eder ve oturum kimliğini değiştirir; önceki cevabın yeni öğrenci profiline sızması engellenir.

## Sekiz yolun izleri

| Yol | Karar sonrası durumlar | Son |
|---|---|---|
| AAA | C1A → C2A → C3A | ENDING_SAFE |
| AAB | C1A → C2A → C3B | ENDING_PRIVACY_INCIDENT |
| ABA | C1A → C2B → C3A | ENDING_RECURRING_OUTAGE |
| ABB | C1A → C2B → C3B | ENDING_PRIVACY_INCIDENT |
| BAA | C1B → C2A → C3A | ENDING_FRAGILE |
| BAB | C1B → C2A → C3B | ENDING_PRIVACY_INCIDENT |
| BBA | C1B → C2B → C3A | ENDING_RECURRING_OUTAGE |
| BBB | C1B → C2B → C3B | ENDING_PRIVACY_INCIDENT |

Tüm izler her sonuçtan `RESET → ONBOARDING` geçişiyle tekrar oynanabilir. Özette C1, C2 ve C3 etkilerinin tamamı korunur. Kişiselleştirme bu düğümlere yeni dal eklemez.
