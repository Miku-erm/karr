# Gerçek gönüllülerle veri toplama — Phase 1

Bu aşamada model eğitmeyin. Başlangıçtaki gerçek insan oturumu sayısı **0**'dır. Cypress, otomasyon, deneme/simülasyon veya yazılmış örnek kayıtlar insan sayısına eklenmez.

## Başlatma

Proje dizininde `npm ci`, ardından `npm run dev` çalıştırın. Mevcut `.env.local` dosyasını ezmeyin. Veri toplama için Gemini anahtarı zorunlu değildir; mevcut Tutor anahtarı varsa aynı şekilde çalışır, hata halinde yerel ipucu korunur.

Bu bilgisayarda açın: **http://127.0.0.1:3000/?mode=collection**. Normal oyunun http://127.0.0.1:3000 adresindeki **Veri Toplama Modu — gönüllü katılım** düğmesi de aynı paneli açar. Bağlantıyı normal tarayıcıda açın; Cypress/WebDriver/otomasyonla insan verisi toplamaya çalışmayın.

Bu localhost adresi başka bir cihazda bu bilgisayara bağlanmaz. En kolay protokol, üç gönüllünün aynı bilgisayarın aynı tarayıcı profilinde sırayla oynamasıdır. Ayrı cihazlarda her biri yerel kopyayı kendi localhost adresinde çalıştırabilir; varsa ayrıca doğrulanmış HTTPS dağıtımı kullanılabilir. Bu Phase 1 çalışması herkese açık bir uygulama dağıtımı yaptığını iddia etmez. LAN üzerindeki düz HTTP, `crypto.randomUUID` gibi güvenli bağlam API'lerini desteklemeyebilir; yerel localhost veya HTTPS kullanın.

## Varsayılan protokol: 3 gönüllü × 5 oyun

1. Üç gerçek gönüllüye Türkçe paneli okumaları için zaman verin. Ad, e-posta veya kimlikle eşleme listesi tutmayın. Her gönüllüye yalnız P01/P02/P03 gibi kimlik içermeyen bir kod verin; aynı kişinin beş tekrarında aynı kod kullanılır. Gönüllüler bu kodu kendileri hatırlayabilir.
2. Bilgilendirme, sayısal kayıtları, isteğe bağlılığı, yerel saklamayı ve anonim satırların herkese açık GitHub ders deposuna eklenebilmesini açıklar. Kabul etmeyen **Katılmıyorum — normal oyuna dön** düğmesiyle kayıtsız oynar. Onay kutusunu gönüllü kendisi işaretler. Her yeni oyun için yeniden onay alınır.
3. Deneyim, rol ve öğrenme hedefini gönüllü doğal biçimde seçer. Onaydan sonra **HİKÂYEYE BAŞLA** ile yeni rastgele UUID'li oyun başlar. İnsan yerine tıklamayın, süreyi/ipucunu/etiketi yönlendirmeyin.
4. Üç sahnenin her birinde A/B seçimi kesinleşir. Teknik sonucu görmeden önce **“Bu kararı verirken belirgin biçimde zorlandın mı?”** sorusunu gönüllü kendi deneyimine göre yanıtlar. Evet=1, Hayır=0. Zorlanma cevapları başarı/başarısızlık değildir; psikolojik tanı değildir. Modeli başarılı göstermek veya sınıf sayısını eşitlemek için etiket seçtirmeyin.
5. Sonuç ekranından yeniden başlatın. Tamamlanan veriler aynı tarayıcıda korunur. Aynı gönüllü doğal seçimlerle beş tam oyun oynar; sonraki gönüllü farklı Pxx koduyla başlar. Hedef **15 tamamlanmış gerçek oturum ve 45 etiketli karar satırı**dır; 45 bağımsız katılımcı değildir. Katılım/tekrar sayısı zorlanmaz.
6. Panel sayacındaki **tamamlanmış gerçek oturum** ve **gerçek karar satırı** sayısını kontrol edin. Sentetik testler ve eksikler ayrı sayılır. Sayısal etiketler birbirinden bağımsız olarak insan tarafından verilmelidir. Bir sınıf az çıkarsa doğal ek gönüllü oturumlar gerekir; etiketler değiştirilmez.

## CSV dışa aktarımı ve yedekleme

Hikâyeyi yeniden başlatınca Veri Toplama Modu panelinde **Tüm tamamlanan oturumları CSV indir** düğmesini kullanın. Gerekirse normal girişten paneli tekrar açın. Onay vermeden önce de kendi mevcut kayıtlarınızı export/silme araçlarıyla yönetebilirsiniz. İnen dosyanın adı `oturumlar.csv`dir; aynı tarayıcıdaki **tüm tamamlanan gerçek ve sentetik** oturumları kaynak etiketiyle içerir. Eksik oturumlar eğitim export'una girmez. CSV'de kişisel/serbest metin sütunu bulunmamalıdır.

localStorage yalnız aynı origin (protokol/host/port), tarayıcı ve profilde kalıcıdır. Gizli pencere, tarayıcı verisi temizliği, port/host değişimi veya cihaz değişimi veriyi kaybettirebilir/başka depoya yönlendirebilir. Her beş oyun sonrası CSV yedeği alın. Depolama hatası gösterilirse devamı başarı saymayın; sorunu giderin veya kayıttan vazgeçip normal oynayın. Eksik oturumları tamamlanmış gibi doldurmayın; yeni tam oyun toplayın.

## Birden fazla cihazı güvenli birleştirme

İndirilen kopyaları cihaz adını/kişiyi açığa çıkarmayan `cihaz1.csv`, `cihaz2.csv` gibi yerel isimlerle saklayın. Aynı kişi farklı cihazda oynuyorsa aynı anonim Pxx, farklı gönüllüler aynı kodu kullanmayacak şekilde önceden koordine edilir. Gerçek ad eşleme listesi oluşturmayın. Bir kez alınmış tüm-oturum export'u daha sonra tekrar gelirse UUID ile tekilleştirilir:

```sh
npm run data:validate -- cihaz1.csv cihaz2.csv
npm run data:merge -- --output data/oturumlar.csv cihaz1.csv cihaz2.csv
npm run data:validate
npm run data:validate -- --require-ready
```

Her girdi tam ve geçerli olmalı. Birleştirici, birebir aynı `session_id` ve üç karar satırını tek oturum olarak tutar. Aynı UUID'de farklı etiket/kaynak/ölçüm varsa yazmayı durdurur; “son gelen kazanır” yapmaz. Kaynağı değiştirmez, eksikleri tamamlamaz. Çelişkide özgün export'ları kontrol edin; belirsiz veriyi kullanmayın. Başlık/range/etiket/üç sahne kontrolü yapılsa da doğrulayıcı onayın veya insan katılımının gerçekliğini kanıtlayamaz.

İlk üç komut şema/merge içindir. Son komut ek olarak **en az 15 gerçek tam oturum**, her etikette **en az 5 gerçek satır ve 3 farklı gerçek oturum** ister; şart yoksa exit 1 verir. Sentetik kayıtlar bu sayılara girmez. Bu veri kapısını geçmek, modelin balanced accuracy >=0.60 veya ONNX parite kapısını geçtiği anlamına gelmez. Eğitim bu aşamada yapılmaz.

## Vazgeçme ve silme

Aktif oyundaki **Veriden vazgeç — bu oturumu sil ve normal oyuna geç** düğmesi o oyunun kaydını siler; seçim ve hikâye oynanmaya devam eder. Başlangıç panelindeki oturum listesinde UUID/grup/kaynak/durum ve tek oturumu silme düğmesi bulunur. Beş tekrarın tamamını geri çekmek için ilgili Pxx kodlu beş UUID'yi silin. **Tüm toplanan verileri sil**, ayrı onaydan sonra bu tarayıcıdaki gerçek, sentetik ve eksik kayıtların hepsini siler; başka uygulama verilerine dokunmaz.

İndirilmiş veya GitHub'da paylaşılmış kopyalar tarayıcı silmesiyle otomatik geri alınmaz. Yayından önce veri sorumlusu geri çekilen UUID'leri birleştirilmiş CSV'den de çıkarmalı, yeniden doğrulamalı ve yeni export kullanmalıdır. Kamuya açık kopyaların başkalarınca kopyalanabileceği onaydan önce anlatılır. Gerçek insan satırlarını gözden geçirmeden otomatik commit/push etmeyin.

## Değerlendirme ve dürüst raporlama

Katılımcının beş oyunu öğrenme etkisi taşır. Pxx verilmişse aynı kişinin bütün oturumları aynı değerlendirme grubunda tutulmalıdır. Pxx yoksa en az oturum düzeyinde gruplayın ve katılımcı sızıntısı sınırını açıklayın. Rastgele karar-satırı train/test bölmesi yapmayın. Küçük veri genelleme iddiasına yetmez. Sabit hedef, sınıf temsili ve parite gerekleri [ML_ACCEPTANCE_GATE.md](ML_ACCEPTANCE_GATE.md) içinde eğitimden önce commit edilmiştir. Phase 1 sonunda gerçek insan sayısı toplanmadıkça **0** olarak raporlanır.
