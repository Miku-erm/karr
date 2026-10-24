import { DecisionDefinition, EndingDefinition, EndingId, UserProfile } from './types';

export const STORY_OPENING = {
  day: 'Pazartesi',
  time: '08:00',
  waitingPeopleApproximate: 300,
  playerRole: 'Nöbetçi Yazılım Mühendisi',
  title: '08:00 — Kritik Karar',
  subtitle: 'SE Primer: Yazılım Mühendisliği, Oynanan Bir Kitap',
  leadText:
    'Saat tam 08.00. Hastanenin merkezi randevu sistemi gece yarısı yapılan sürüm dağıtımı sonrası tamamen çöktü. Bekleme salonunda 300 hasta ve poliklinik doktorları sisteme erişemiyor. Nöbetçi mühendis sensin. Alacağın her karar sistem mimarisini, veri güvenliğini ve hastaların hayatını doğrudan etkileyecek.',
  disclaimer:
    'Bu simülasyondaki tüm kişiler, kurumlar ve kayıtlar tamamen kurgusaldır. Gerçek hasta veya tıbbi teşhis verisi kullanılmaz.',
};

export const DECISIONS: Record<'architecture' | 'testing' | 'privacy', DecisionDefinition> = {
  architecture: {
    id: 'architecture',
    order: 1,
    progress: 'Karar 1 / 3',
    timeLabel: '08:00',
    nextTimeLabel: '08:15',
    title: 'Yeni sürümden sonra sistem kilitlendi. İlk hamlen ne?',
    headline: 'Nöbet Odası Acil Hattı',
    subheadline: 'Pazartesi sabahı nöbet odasındaki acil çağrı telefonu çalıyor.',
    scene:
      "Başhekimlik ve poliklinik bankoları ayakta: Randevu servisi yanıt vermiyor. Gece 03:00'te yeni hasta kimlik doğrulama mikroservisi yayına alınmış, ancak sabah hasta yükü biner binmez bağlantı havuzu tükenmiş.",
    technicalErrorBadge: 'ERROR: Deadlock detected on appointments_v2 table (processes waiting: 184)',
    learningObjectives: ['Geri alma uyumluluğu', 'Yayına alma riski', 'Mimari ödünleşimler'],
    localTutorQuestion: 'Geri dönüş (rollback) yapmadan önce veritabanı şemasında ve transaction kuyruğunda ilk neyi kontrol ederdin?',
    beginnerHint: 'Geri alma, çalışan önceki kararlı sürüme dönmektir. Uygulama kodu ile veritabanı şeması birlikte çalışmalıdır; şemada yeni eklenen zorunlu bir alan varsa eski kod hata verebilir.',
    choices: {
      A: {
        id: 'A',
        label: 'Eski sürüme dön (Rollback)',
        shortDesc:
          'Gece yayına alınan v2.4.0 paketini geri alıp kararlı v2.3.9 sürümüne dön. Şema migrasyon uyumluluğunu acil teyit etmelisin.',
        tradeoffs: {
          positive: 'Düşük Kesinti',
          risk: 'Veri Tutarsızlığı Riski',
        },
        impactAnalysis:
          "v2.4.0'da eklenen tc_kimlik_hash kolonu NOT NULL tanımlandığı için eski sürüme anında dönüş, yeni kayıt açan 14 poliklinik randevusunda veri yazma hatasına yol açabilir.",
        consequence: {
          id: 'ARCH_ROLLBACK_COMPATIBLE',
          title: 'Uyumluluğu Doğrulanmış Geri Dönüş',
          immediate:
            'İnceleme sonrası mevcut veritabanı şemasının önceki sürümle uyumlu olduğu teyit edildi. Son kararlı sürüme veri kaybı olmadan dönüldü; hata oranı hızla düştü.',
          cause:
            'Geri dönüşten önce kodun mevcut şemayla çalışabileceğini doğrulaman, kurtarma işleminin yeni bir veri tabanı uyumsuzluğu üretmesini önledi.',
          caveat:
            'Gerçek bir krizde geriye dönük uyumsuz (breaking) şema migrasyonları rollback adımını kilitleyebilir; Expand/Contract deseni hayati öneme sahiptir.',
          technicalEffect: 'verified_rollback',
          summary: 'Şema uyumluluğu doğrulandı ve son kararlı uygulama sürümüne güvenle dönüldü.',
        },
      },
      B: {
        id: 'B',
        label: 'Canlıda acil yama uygula (Hotfix)',
        shortDesc:
          'Veritabanındaki kilitlenen transaction indekslerini canlı ortamda drop edip connection pool boyutunu iki katına çıkararak sistemi ayakta tutmaya çalış.',
        tradeoffs: {
          positive: 'Yüksek Sistem Riski',
          risk: 'KVKK & Tutarlılık Tehlikesi',
        },
        impactAnalysis:
          'Canlı tabloda indeks silmek anlık global tablo kilitlenmesine (exclusive table lock) neden olabilir. Tüm randevu kayıtları tamamen donabilir.',
        consequence: {
          id: 'ARCH_UNVERIFIED_HOTFIX',
          title: 'Hızlı ama Henüz Kararlı Olmayan Toparlanma',
          immediate:
            'Acil düzeltme kilitlenen kuyruğu geçici olarak boşalttı. Ancak normal CI/CD ve QA doğrulamasının dışındaki bu ani değişikliğin yan etkileri henüz belirsiz.',
          cause:
            'Üretimde doğrudan indeks silmek ve havuzu şişirmek beklemeyi azalttı, ancak sistemin kırılganlığını ve bellek baskısını katladı.',
          caveat:
            'Canlı ortamda plansız hotfix uygulamak, kriz sonrası derin izleme ve kapsamlı bir post-mortem gerektirir.',
          technicalEffect: 'hotfix_monitoring_required',
          summary: 'Üretime sıcak yama uygulandı; sistem ayakta ancak etki alanı için sürekli izleme gerekiyor.',
        },
      },
    },
  },
  testing: {
    id: 'testing',
    order: 2,
    progress: 'Karar 2 / 3',
    timeLabel: '08:15',
    nextTimeLabel: '08:30',
    title: 'Trafiği açmadan önce neyi doğrularsın?',
    headline: 'Doğrulama Eşiği & Poliklinik Baskısı',
    subheadline: 'İlk müdahale sonrası bağlantı havuzu kısmen nefes aldı.',
    scene:
      'Randevu mikroservisi yeniden ayağa kalktı ancak poliklinik doktorları kapıda bekliyor. Birkaç başarılı test sorgusu, randevu yazma ve onaylama zincirinin tam trafik altında çökmeden çalışacağını kanıtlamıyor.',
    technicalErrorBadge: 'WARNING: Latency spike detected on appointment booking RPC (avg: 1,840ms)',
    learningObjectives: ['Smoke testi', 'Entegrasyon doğrulaması', 'Regresyon riski', 'Test kapsamının sınırları'],
    localTutorQuestion: 'Sistemin toparlandığını söylemek için birkaç başarılı isteğin dışında hangi kanıta ihtiyaç duyarsın?',
    beginnerHint: 'Smoke testi temel bileşenlerin ayağa kalkıp kalkmadığını; entegrasyon testi ise veritabanı, kimlik servisi ve randevu motorunun birlikte uyumla çalıştığını denetler.',
    choices: {
      A: {
        id: 'A',
        label: 'Hedefli smoke ve entegrasyon testlerini çalıştır',
        shortDesc:
          'Tam trafiği açmadan önce randevu arama, kurgusal rezervasyon oluşturma ve DB entegrasyon kontrollerini hedefli sentetik testlerle doğrula.',
        tradeoffs: {
          positive: 'Doğrulama Güvencesi',
          risk: 'Kısa Süreli Ek Bekleme',
        },
        impactAnalysis:
          'Kritik hasta randevu kaydı akışı ve ödeme entegrasyonu smoke testlerle teyit edilir; kuyruktaki isteklerin sessizce kaybolması engellenir.',
        consequence: {
          id: 'TEST_TARGETED_VERIFICATION',
          title: 'Kritik Akış İçin Doğrulama Kanıtı',
          immediate:
            'Randevu sorgulama, slot rezervasyonu ve veritabanı ACID işlemleri hedefli smoke kontrollerinden geçti. Tam trafik kontrollü ve kademeli açıldı.',
          cause:
            'Yalnızca "ping" sinyaline güvenmeyip kritik iş akışını test etmen, kullanıcıların yeniden hata ekranıyla karşılaşmasını önledi.',
          caveat:
            'Hedefli testler ana akışları korur ancak aşırı yük altındaki nadir edge-case senaryoları tamamen kapsamayabilir.',
          technicalEffect: 'targeted_flow_verified',
          summary: 'Kritik randevu akışı tam trafik öncesinde smoke ve entegrasyon testleriyle başarıyla doğrulandı.',
        },
      },
      B: {
        id: 'B',
        label: 'Hizmeti hemen açmak için testleri atla',
        shortDesc:
          'Bekleyen yüzlerce hastanın ve poliklinik hekimlerinin şikayetlerini durdurmak amacıyla testleri pas geçip trafiği derhal tüm kapasiteyle aç.',
        tradeoffs: {
          positive: 'Anında Trafik',
          risk: 'Kaskad Çöküş ve Regresyon Riski',
        },
        impactAnalysis:
          'Test edilmemiş kütüphane bağlantısı, 300 eşzamanlı istek bindiğinde yeniden kilitlenebilir ve hastane giriş turnikeleri tekrar durabilir.',
        consequence: {
          id: 'TEST_REGRESSION_RETURNS',
          title: 'Görünmeyen Regresyon Yeniden Ortaya Çıktı',
          immediate:
            'Trafik hemen açıldı. Ancak doğrulanmayan randevu onaylama akışındaki regresyon yüksek yük altında yeniden patladı ve servis tekrar kesintiye uğradı!',
          cause:
            'Sadece yüzeysel toparlanma işaretine güvenildi; entegrasyon kontrolü yapılmadığı için latent hata gerçek hasta istekleriyle birleşip sistemi kilitledi.',
          caveat:
            'Zaman baskısı altında test atlamak cazip görünse de, canlı ortamı test alanı olarak kullanmak kesintiyi katlar.',
          technicalEffect: 'recurring_outage',
          summary: 'Testler atlandı; kritik akıştaki regresyon tam trafikte sistemi yeniden çökertti.',
        },
      },
    },
  },
  privacy: {
    id: 'privacy',
    order: 3,
    progress: 'Karar 3 / 3',
    timeLabel: '08:30',
    nextTimeLabel: '08:42',
    title: 'Tanılama loglarını nasıl paylaşırsın?',
    headline: 'Tanılama Logları ve KVKK Güvenliği',
    subheadline: 'Kök neden analizi için sistem hata günlükleri inceleniyor.',
    scene:
      'Hata izleme (APM) kayıtlarında kurgusal hasta adları, TC Kimlik numaraları ve poliklinik tanı kodları yer alıyor. Departman Slack kanalında 120 kişi bulunuyor ve kanal dış danışmanlara da açık.',
    technicalErrorBadge: 'SECURITY ALERT: Unmasked PII (TCKN, Diagnosis codes) detected in exception payload',
    learningObjectives: ['Veri azaltma', 'Erişim kontrolü', 'Olay yönetimi', 'KVKK farkındalığı'],
    localTutorQuestion: 'İnceleme için hangi alanlar gerçekten gerekli ve bu bilgilere kimlerin erişmesi gerekiyor?',
    beginnerHint: 'Loglar teknik hata kodlarının yanı sıra hastayı doğrudan tanımlayabilecek hassas bilgiler de barındırabilir. Yalnızca hata ayıklamaya yetecek teknik veriyi ayıkla.',
    choices: {
      A: {
        id: 'A',
        label: 'Kişisel tanımlayıcıları maskele ve erişimi sınırla',
        shortDesc:
          'Paylaşmadan önce kişisel kimlikleri (TCKN, hasta adı) maskele; kayıtları yalnızca yetkili kriz triyaj kanalında paylaş.',
        tradeoffs: {
          positive: 'KVKK & Gizlilik Korunması',
          risk: 'Kısa Süreli Maskeleme Eforu',
        },
        impactAnalysis:
          'Hata stack trace içindeki kimlikler [REDACTED] haline getirilir. Hem teknik soruşturma aksamaz hem de kurumsal veri ihlali engellenir.',
        consequence: {
          id: 'PRIVACY_MINIMIZED_RESTRICTED',
          title: 'Gerekli Veri, Yetkili Erişim',
          immediate:
            'Kişisel kimlikler maskelendi. Teknik hata izleri ve SQL query parametreleri korundu; log yalnızca yetkili olay müdahale ekibiyle paylaşıldı.',
          cause:
            'Veri minimizasyonu ve yetki sınırlandırmasını birlikte uygulaman, teknik sorunu çözerken hasta gizliliğini güvenceye aldı.',
          caveat:
            'Maskeleme harika bir tedbirdir; ancak dolaylı korelasyon verilerinin de gözden geçirilmesi gerekir.',
          technicalEffect: 'minimized_and_restricted',
          summary: 'Kişisel tanımlayıcılar maskelendi ve log erişimi yetkili olay ekibiyle sınırlandı.',
        },
      },
      B: {
        id: 'B',
        label: 'Ham, maskelenmemiş logları genel takım sohbetine gönder',
        shortDesc:
          'Zaman kaybetmemek ve herkesin hızlıca bakabilmesi için tüm log dökümünü doğrudan 120 kişilik genel mühendislik kanalına yapıştır.',
        tradeoffs: {
          positive: 'Hızlı Dağıtım',
          risk: 'Ağır Veri İhlali (KVKK Cezası Tehlikesi)',
        },
        impactAnalysis:
          'Dış paydaşların da bulunduğu kanala poliklinik tanı kodları ve kimlikler saçılır; sistem ayağa kalksa bile ayrı bir yasal kriz patlar.',
        consequence: {
          id: 'PRIVACY_UNMASKED_SHARED',
          title: 'Ham Kayıtlar Gereğinden Geniş Paylaşıldı',
          immediate:
            'Kurgusal hasta kimlikleri ve tanı kodları genel sohbete saçıldı. Bu kontrolsüz paylaşım erişim sınırlarını aştı ve resmi bir KVKK veri ihlali soruşturmasını tetikledi!',
          cause:
            'Hata çözümü için teknik veri yeterliyken gereksiz kişisel verinin geniş bir kitleye açılması gizlilik olayına yol açtı.',
          caveat:
            'Kriz anında bile veri koruma ilkeleri askıya alınamaz; güvenlik refleksleri mühendisliğin ayrılmaz bir parçasıdır.',
          technicalEffect: 'privacy_incident',
          summary: 'Ham loglar genel takıma gönderildi; veri ihlali nedeniyle acil soruşturma ve adli log izolasyonu gerekti.',
        },
      },
    },
  },
};

export const ENDINGS: Record<EndingId, EndingDefinition> = {
  ENDING_SAFE: {
    id: 'ENDING_SAFE',
    badgeTitle: 'GÜVENLİ KURTARMA (Safe Recovery)',
    title: 'Sistem Yeniden Ayakta ve Güvenli',
    epilogue: 'Epilog • 08:42: "Sistem Yeniden Ayakta"',
    summary:
      'Saat 08.42. Geriye uyumlu çift yönlü migrasyon scripti devreye alındı ve kontrollü rollback tamamlandı. Hedefli smoke testler başarıyla geçti ve 300 hastanın poliklinik randevuları kayıpsız işlendi. Loglar maskelenerek KVKK tam güvenceye alındı. Acil servis ve merkezi triyaj üniteleri normal işleyişine döndü.',
    reflection: 'Hangi kanıtlar kurtarma kararına güvenmeni sağladı ve olası krizleri nasıl önledi?',
    followUp: 'Kontrollü izlemeyi sürdür, Expand/Contract migrasyon kalıbını ekibe standart hale getir ve post-mortem dokümanını yayınla.',
    doesNotImply: 'Sistemin gelecekte hiç hata vermeyeceği iddia edilmez; mimari disiplin süreklilik ister.',
    metrics: {
      dbLock: '0 Aktif',
      dbLockSub: '%100 Tutarlı',
      queue: 'Düzlendi',
      queueSub: '0 ms gecikme',
      patientLoss: '%0.0',
      patientLossSub: '300/300 İşlendi',
    },
    rankTitle: 'Staff Site Reliability Engineer (SRE)',
    rankDesc: 'Kriz süresince soğukkanlı mimari kararlılık, disiplinli doğrulama ve veri etiği sergilendi.',
  },
  ENDING_FRAGILE: {
    id: 'ENDING_FRAGILE',
    badgeTitle: 'KIRILGAN KURTARMA (Fragile Recovery)',
    title: 'Sistem Ayakta Ancak Kırılgan',
    epilogue: 'Epilog • 08:42: "Geçici Nefes Alış"',
    summary:
      'Saat 08.42. Canlıda uygulanan acil yama (hotfix) randevu akışını şimdilik ayakta tutuyor. Smoke testler kritik akışın çalıştığını gösterdi ve loglar güvenle maskelendi. Ancak plansız indeks silinmesi ve şişen bağlantı havuzu veritabanında gizli bellek baskısı yaratıyor. Kalıcı stabilizasyon yapılmazsa sonraki saatlerde tekrar kilitlenme riski yüksek.',
    reflection: 'Kısa vadeli acil toparlanmayı nasıl sürdürülebilir, test edilmiş bir mimari düzeltmeye dönüştürürsün?',
    followUp: 'Hotfix kodunu derhal CI/CD hattına çek, veritabanı indekslerini temizle ve veritabanı profilini 24 saat boyunca izle.',
    metrics: {
      dbLock: 'Geçici 0',
      dbLockSub: 'Yüksek Bellek',
      queue: 'Düşüyor',
      queueSub: '420 ms dalgalı',
      patientLoss: '%2.1',
      patientLossSub: '294/300 İşlendi',
    },
    rankTitle: 'Pragmatic Incident Responder',
    rankDesc: 'Sistemi hızla ayağa kaldırdın ancak arkada teknik borç ve mimari risk bıraktın.',
  },
  ENDING_RECURRING_OUTAGE: {
    id: 'ENDING_RECURRING_OUTAGE',
    badgeTitle: 'TEKRARLAYAN KESİNTİ (Recurring Outage)',
    title: 'Kesinti Geri Döndü: Kaskad Çöküş',
    epilogue: 'Epilog • 08:42: "İkinci Dalga"',
    summary:
      'Saat 08.42. Testler atlanıp kapılar alelacele açıldığında, polikliniklerden gelen 300 eşzamanlı istek doğrulanmamış kod yoluna çarptı. Birkaç başarılı sorgunun arkasındaki gizli regresyon tüm bağlantı havuzunu yeniden kilitledi. Hastane sistemleri ikinci kez çöktü ve poliklinik girişlerinde büyük kuyruklar oluştu.',
    reflection: 'Trafiği açmadan önce hangi hedefli doğrulama adımları bu ikinci çöküşü önleyebilirdi?',
    followUp: 'Trafiği derhal devre kesici (circuit breaker) ile sınırla, regresyonu lokal ortamda yeniden üret ve smoke testleri geçmeden trafiği açma.',
    metrics: {
      dbLock: '184 Kuyrukta',
      dbLockSub: 'Kilitlendi',
      queue: '6.420 Msg',
      queueSub: 'Taşma Riski',
      patientLoss: '%38.0',
      patientLossSub: '186/300 Bekliyor',
    },
    rankTitle: 'High-Velocity, High-Risk Operator',
    rankDesc: 'Hız baskısı doğrulamayı ezip geçtiğinde sistem iki kat daha ağır bir kesinti yaşar.',
  },
  ENDING_PRIVACY_INCIDENT: {
    id: 'ENDING_PRIVACY_INCIDENT',
    badgeTitle: 'KVKK İHLALİ (Privacy Incident)',
    title: 'Veri İhlali: Kriz Büyüdü',
    epilogue: 'Epilog • 08:42: "Hukuki Kriz"',
    summary:
      'Saat 08.42. Sistemin teknik durumu ne olursa olsun, ham logların 120 kişilik genel sohbete atılmasıyla hastaların TC Kimlik numaraları ve özel tanı kodları sızdı. Sistem kısmen çalışsa dahi başhekimlik ve hukuk departmanı acil veri ihlali toplantısı başlattı. Adli log incelemesi ve KVKK bildirimi süreci devrede.',
    reflection: 'Kriz anında bile teknik hata ayıklamayı hasta mahremiyetini feda etmeden nasıl yürütürsün?',
    followUp: 'Sohbet kanalındaki log dökümünü derhal sil ve adli kopyasını al; kurumun Bilgi Güvenliği ve KVKK Olay Yönetim Prosedürünü derhal devreye sok.',
    metrics: {
      dbLock: 'Belirsiz',
      dbLockSub: 'Loglar İzole',
      queue: 'İkincil Konu',
      queueSub: 'Veri Sızıntısı',
      patientLoss: 'Kritik İhlal',
      patientLossSub: '300 Kişi Etkilendi',
    },
    rankTitle: 'Compromised Compliance Engineer',
    rankDesc: 'Sistemi kurtarma telaşıyla en temel veri koruma ilkeleri ihlal edildi ve yasal kriz doğdu.',
  },
};

export function getPersonalizedFeedback(
  profile: UserProfile,
  decisionId: 'architecture' | 'testing' | 'privacy'
): { rolePerspective: string; goalEmphasis?: string; experienceNote: string } {
  const roleNotes = {
    developer: {
      architecture: 'Geliştirici Gözü: Sürüm geri alma sırasında veri şeması geriye uyumluluğu (schema backwards compatibility) en kritik bağımlılıktır.',
      testing: 'Geliştirici Gözü: Smoke testler özellikle DB connection timeout ve transaction commit noktalarındaki sessiz hataları ortaya çıkarır.',
      privacy: 'Geliştirici Gözü: Log sanitization ve PII filtering kütüphaneleri loglama katmanında otomatik interceptor olarak çalışmalıdır.',
    },
    tester: {
      architecture: 'Test Mühendisi Gözü: Mimari geri alma kararında test ortamı ile canlı veritabanı şeması arasındaki parity mutlaka teyit edilmelidir.',
      testing: 'Test Mühendisi Gözü: 300 eşzamanlı kullanıcıyı temsil eden sentetik entegrasyon testleri, sahadaki kriz anında en güvenilir güvencedir.',
      privacy: 'Test Mühendisi Gözü: Test ve staging ortamlarında da gerçek hasta verisi kullanılmamalı, maskelenmiş sentetik test verisi tercih edilmelidir.',
    },
    lead: {
      architecture: 'Teknik Lider Gözü: Kriz yönetiminde ilk hedef hasarı izole etmek ve ekip koordinasyonunda net bir geri dönüş patikası belirlemektir.',
      testing: 'Teknik Lider Gözü: Operasyon ve yönetimin "hemen aç" baskısına karşı teknik disiplini korumak bir liderlik sorumluluğudur.',
      privacy: 'Teknik Lider Gözü: Şirket itibarını ve kullanıcı güvenini korumak için hata analizi kanalları strictly need-to-know prensibiyle yönetilmelidir.',
    },
  };

  const goalEmphases = {
    architecture: {
      architecture: 'Mimari Odağın: İki adımlı migrasyon (Expand & Contract deseni) sayesinde kod ve şema birbirinden bağımsız olarak canlıya alınabilir.',
      testing: 'Mimari Odağın: Testler, mikroservisler arasındaki circuit breaker ve retry pattern yapısının doğru çalıştığını teyit eder.',
      privacy: 'Mimari Odağın: Veri koruma sadece kodda değil, log ingestion boru hatlarında (Logstash/Fluentd) mimari seviyede ele alınmalıdır.',
    },
    testing: {
      architecture: 'Test Odağın: Geriye dönük uyumluluk testleri otomatik CI boru hattına entegre edildiğinde bu tür krizler yaşanmaz.',
      testing: 'Test Odağın: Kritik yol (Critical User Journey) kapsamındaki randevu akışı başarıyla test edildi.',
      privacy: 'Test Odağın: Güvenlik testleri ve log audit kontrolleri QA sürecinin ayrılmaz parçası olmalıdır.',
    },
    privacy: {
      architecture: 'Güvenlik & KVKK Odağın: Veritabanı şemasındaki tc_kimlik_hash alanı gibi PII alanlar hash ve salt ile saklanmalıdır.',
      testing: 'Güvenlik & KVKK Odağın: Test ortamlarında asla canlı veritabanı dump’ı kullanılmamalı, veri maskeleme test hattında uygulanmalıdır.',
      privacy: 'Güvenlik & KVKK Odağın: KVKK Madde 12 uyarınca veri güvenliği teknik tedbirleri kriz anında dahi gevşetilemez.',
    },
  };

  const experienceNotes = {
    beginner: 'Yeni Başlayan Notu: Her mühendislik kararı bir ödünleşim (trade-off) barındırır. Hız ile güvenlik dengesini gözetmek gerekir.',
    intermediate: 'Orta Seviye Notu: Standart mühendislik pratikleri kriz anında karar felcini önleyen en güvenilir rehberdir.',
    experienced: 'Deneyimli Notu: Operasyonel baskı ve SLA süreleri karşısında sistemik kararlılık post-mortem kalitesini belirler.',
  };

  return {
    rolePerspective: roleNotes[profile.role][decisionId],
    goalEmphasis: goalEmphases[profile.goal][decisionId],
    experienceNote: experienceNotes[profile.experience],
  };
}
