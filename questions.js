const quizDatabase = [
    {
        month: 1,
        title: "Aprel Ayı Sınağı - Giriş",
        startDate: "2026-04-01",
        questions: [
            // Az dili
            { q: "Hansı sözdə ahəng qanunu gözlənilmişdir?", o: ["Kitab", "Qələm", "Təyyarə", "Dünya"], c: "Qələm" },
            { q: "'Çiçək' sözü hansı suala cavab verir?", o: ["Kim?", "Hara?", "Nə?", "Necə?"], c: "Nə?" },
            { q: "Hansı samit cingiltilidir?", o: ["P", "T", "B", "K"], c: "B" },
            { q: "'Acı' sözünün əksi hansıdır?", o: ["Turş", "Şirin", "Dadlı", "Soyuq"], c: "Şirin" },
            { q: "Leksik mənası olmayan sözü seçin:", o: ["Və", "Ev", "Qaçmaq", "Qırmızı"], c: "Və" },
            // Riyaziyyat
            { q: "45 + 38 cəmini tapın:", o: ["73", "83", "82", "72"], c: "83" },
            { q: "100 - 64 fərqini tapın:", o: ["36", "46", "34", "44"], c: "36" },
            { q: "8 × 9 neçə edir?", o: ["64", "72", "81", "56"], c: "72" },
            { q: "42 ÷ 6 qisməti neçədir?", o: ["6", "7", "8", "9"], c: "7" },
            { q: "Kvadratın neçə tərəfi var?", o: ["3", "4", "5", "6"], c: "4" },
            // English
            { q: "What is the color of an orange?", o: ["Green", "Orange", "Blue", "Pink"], c: "Orange" },
            { q: "How many fingers do you have on one hand?", o: ["Five", "Ten", "Four", "One"], c: "Five" },
            { q: "Which one is an animal?", o: ["Chair", "Lion", "Pen", "Table"], c: "Lion" },
            { q: "Hello, how ___ you?", o: ["am", "is", "are", "be"], c: "are" },
            { q: "The opposite of 'Hot' is...", o: ["Big", "Cold", "Small", "Fast"], c: "Cold" },
            // Rus dili
            { q: "Как будет 'Мама' по-азербайджански?", o: ["Ata", "Ana", "Bacı", "Qardaş"], c: "Ana" },
            { q: "Как переводится 'Книга'?", o: ["Qələm", "Dəftər", "Kitab", "Çanta"], c: "Kitab" },
            { q: "Какого цвета небо? (Mavi)", o: ["Красное", "Синее", "Зеленое", "Желтое"], c: "Синее" },
            { q: "Как будет 'Школа'?", o: ["Магазин", "Школа", "Сад", "Улица"], c: "Школа" },
            { q: "Один, два, три, ... - что дальше?", o: ["Пять", "Четыре", "Шесть", "Семь"], c: "Четыре" }
        ]
    },
    {
        month: 2,
        title: "May Ayı Sınağı - Təkmilləşmə",
        startDate: "2026-05-01",
        questions: [
            // Az dili
            { q: "Hansı söz hecalara düzgün bölünməyib?", o: ["Mə-ktəb", "Ana", "Ki-tab", "Ü-rək"], c: "Mə-ktəb" },
            { q: "Xüsusi isim hansıdır?", o: ["Dağ", "Şəhər", "Gəncə", "Çay"], c: "Gəncə" },
            { q: "'Böyük' sözünün yaxınmənalı qarşılığı hansıdır?", o: ["Balaca", "İri", "Hündür", "Geniş"], c: "İri" },
            { q: "Mürəkkəb sözü seçin:", o: ["Kitabxana", "Ayaqqabı", "Yazıçı", "Dənizçi"], c: "Ayaqqabı" },
            { q: "Hansı cümlə sual cümləsidir?", o: ["Hava istidir", "Dərslərini oxu", "Sən hara gedirsən", "Gəl bura"], c: "Sən hara gedirsən" },
            // Riyaziyyat
            { q: "Ən kiçik iki rəqəmli ədəd hansıdır?", o: ["1", "10", "11", "9"], c: "10" },
            { q: "1 metr neçə santimetrdir?", o: ["10 sm", "50 sm", "100 sm", "1000 sm"], c: "100 sm" },
            { q: "250 + 150 cəmi nəyə bərabərdir?", o: ["300", "400", "350", "500"], c: "400" },
            { q: "Üçbucağın tərəfləri 3 sm, 4 sm və 5 sm-dir. Perimetri tapın:", o: ["10 sm", "12 sm", "15 sm", "9 sm"], c: "12 sm" },
            { q: "Hansı ədəd təkdir?", o: ["12", "24", "35", "40"], c: "35" },
            // English
            { q: "Which day comes after Monday?", o: ["Wednesday", "Friday", "Tuesday", "Sunday"], c: "Tuesday" },
            { q: "I ___ a book every day.", o: ["read", "reads", "reading", "red"], c: "read" },
            { q: "Where does a fish live?", o: ["Tree", "Forest", "Water", "Sky"], c: "Water" },
            { q: "Choose the correct plural: 'Box'", o: ["Boxs", "Boxes", "Boxies", "Boxen"], c: "Boxes" },
            { q: "Which one is a fruit?", o: ["Onion", "Banana", "Potato", "Milk"], c: "Banana" },
            // Rus dili
            { q: "Как сказать 'Привет'?", o: ["Пока", "Привет", "Спасибо", "Пожалуйста"], c: "Привет" },
            { q: "Как будет 'Собака'?", o: ["Pişik", "İt", "Dovşan", "Quş"], c: "İt" },
            { q: "Я, ты, он, ... - выбери пропущенное:", o: ["Мы", "Она", "Они", "Вы"], c: "Она" },
            { q: "Переведи слово 'Яблоко':", o: ["Armud", "Alma", "Nar", "Heyva"], c: "Alma" },
            { q: "Какое слово мужского рода?", o: ["Мама", "Папа", "Окно", "Ручка"], c: "Папа" }
        ]
    },
    {
        month: 3,
        title: "İyun Ayı Sınağı - İnkişaf",
        startDate: "2026-06-01",
        questions: [
            // Az dili
            { q: "'Dəniz' sözünün kökü nədir?", o: ["Dən", "Dəniz", "Dəni", "İz"], c: "Dəniz" },
            { q: "Əlamət bildərən sözü seçin:", o: ["Qaçır", "Stol", "Sarı", "Beş"], c: "Sarı" },
            { q: "Hansı sözdə samitlərin sayı daha çoxdur?", o: ["Elmi", "Yarpaq", "Ana", "Ütü"], c: "Yarpaq" },
            { q: "'Uşaqlar futbol oynayırlar' cümləsində hərəkət bildirən söz hansıdır?", o: ["Uşaqlar", "Futbol", "Oynayırlar", "Yoxdur"], c: "Oynayırlar" },
            { q: "Həqiqi mənada işlənmiş ifadəni tapın:", o: ["Şirin söz", "Qızıl saat", "Daş ürək", "İsti baxış"], c: "Qızıl saat" },
            // Riyaziyyat
            { q: "5 × 0 ifadəsinin qiyməti nədir?", o: ["5", "0", "50", "1"], c: "0" },
            { q: "1 saat 20 dəqiqə cəmi neçə dəqiqədir?", o: ["60 dəq", "70 dəq", "80 dəq", "90 dəq"], c: "80 dəq" },
            { q: "900 - 450 nəticəsini tapın:", o: ["450", "550", "400", "500"], c: "450" },
            { q: "Hansı fiqurun bucağı yoxdur?", o: ["Kvadrat", "Üçbucaq", "Çevrə", "Düzbucaqlı"], c: "Çevrə" },
            { q: "12 × 3 neçə edir?", o: ["30", "36", "42", "24"], c: "36" },
            // English
            { q: "My mother's brother is my ___.", o: ["Father", "Uncle", "Grandfather", "Brother"], c: "Uncle" },
            { q: "What is 'Məktəb' in English?", o: ["Hospital", "Library", "School", "Park"], c: "School" },
            { q: "Choose the number: 'Thirteen'", o: ["3", "13", "30", "33"], c: "13" },
            { q: "___ is your name?", o: ["Who", "Where", "What", "How"], c: "What" },
            { q: "Which one is a body part?", o: ["Shoe", "Eye", "Shirt", "Cap"], c: "Eye" },
            // Rus dili
            { q: "Как будет 'Стол' во множественном числе?", o: ["Столы", "Стола", "Столу", "Столом"], c: "Столы" },
            { q: "Что мы говорим утром?", o: ["Добрый вечер", "Доброе утро", "Спокойной ночи", "Привет"], c: "Доброе утро" },
            { q: "Как переводится 'Учитель'?", o: ["Şagird", "Müəllim", "Həkim", "Sürücü"], c: "Müəllim" },
            { q: "Какое число больше: Пять или Десять?", o: ["Пять", "Десять", "Одинаково", "Ноль"], c: "Десять" },
            { q: "Как будет 'Хлеб'?", o: ["Su", "Çörək", "Süd", "Pendir"], c: "Çörək" }
        ]
    },
    {
        month: 4,
        title: "İyul Ayı Sınağı - Final",
        startDate: "2026-07-01",
        questions: [
            // Az dili
            { q: "Hansı şəkilçi ismin cəm şəkilçisidir?", o: ["-lar²", "-çı⁴", "-lıq⁴", "-da²"], c: "-lar²" },
            { q: "Hansı söz birləşməsidir?", o: ["Məktəbə getmək", "Oxudu", "Gözəl", "Kitab və qələm"], c: "Məktəbə getmək" },
            { q: "'Məktəbli' sözü necə sözdür?", o: ["Sadə", "Düzəltmə", "Mürəkkəb", "Qoşma"], c: "Düzəltmə" },
            { q: "Nida cümləsini seçin:", o: ["Bura gəl.", "Bu nə gözəl gündür!", "Sən kimsən?", "Kitabı aç."], c: "Bu nə gözəl gündür!" },
            { q: "Əlifbamızda neçə hərf var?", o: ["32", "34", "9", "23"], c: "32" },
            // Riyaziyyat
            { q: "5-in qatı olmayan ədədi seçin:", o: ["10", "15", "17", "25"], c: "17" },
            { q: "Ən böyük üçrəqəmli ədəd hansıdır?", o: ["100", "900", "999", "1000"], c: "999" },
            { q: "64 ÷ 8 neçədir?", o: ["7", "8", "9", "6"], c: "8" },
            { q: "Kvadratın bir tərəfi 6 sm-dir. Sahəsini tapın:", o: ["12 sm²", "24 sm²", "36 sm²", "30 sm²"], c: "36 sm²" },
            { q: "1000 - 1 neçədir?", o: ["900", "990", "999", "899"], c: "999" },
            // English
            { q: "A bird can ___.", o: ["swim", "fly", "drive", "run"], c: "fly" },
            { q: "What is the plural of 'Man'?", o: ["Mans", "Men", "Mens", "Manes"], c: "Men" },
            { q: "It is ___ elephant.", o: ["a", "an", "the", "-"], c: "an" },
            { q: "Which season is cold?", o: ["Summer", "Spring", "Winter", "Autumn"], c: "Winter" },
            { q: "What is 'Qırmızı' in English?", o: ["Yellow", "Red", "White", "Black"], c: "Red" },
            // Rus dili
            { q: "Переведи: 'Красный карандаш'", o: ["Yaşıl qələm", "Qırmızı karandaş", "Sarı dəftər", "Mavi kitab"], c: "Qırmızı karandaş" },
            { q: "Что такое 'Семья'?", o: ["Dost", "Ailə", "Qonşu", "Sinif"], c: "Ailə" },
            { q: "Как сказать 'До свидания'?", o: ["Привет", "Пока", "До свидания", "Спасибо"], c: "До свидания" },
            { q: "Как будет 'Машина'?", o: ["Velosiped", "Avtobus", "Maşın", "Qatar"], c: "Maşın" },
            { q: "Как переводится 'Молоко'?", o: ["Su", "Süd", "Şirə", "Çay"], c: "Süd" }
        ]
    }
];
