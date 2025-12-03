# Lumina AI E-Commerce Platform - Loyiha Hisoboti

## Umumiy Ma'lumot

**Loyiha nomi:** Lumina AI E-Commerce Platform  
**Maqsad:** Google Gemini AI yordamida mahsulot rasmlarini tahlil qiluvchi va aqlli mahsulot ro'yxatlarini yaratuvchi zamonaviy elektron tijorat platformasi.

Bu platforma foydalanuvchilarga mahsulotlarni ko'rish, savatchani boshqarish va buyurtmalarni qayta ishlash imkonini beradi. Shuningdek, admin panel orqali AI yordamida mahsulotlarni boshqarish mumkin.

---

## Texnik Arxitektura

### Frontend (Foydalanuvchi interfeysi)

| Texnologiya | Vazifasi |
|-------------|----------|
| **React 19** | Asosiy UI kutubxonasi |
| **TypeScript** | Xavfsiz kod yozish uchun |
| **Wouter** | Sahifalar orasida navigatsiya |
| **TanStack React Query** | Server ma'lumotlarini boshqarish |
| **Radix UI + shadcn/ui** | UI komponentlar kutubxonasi |
| **Tailwind CSS** | Stillar va dizayn |
| **Framer Motion** | Animatsiyalar |
| **Vite** | Tezkor dastur yig'ish vositasi |

### Backend (Server tomoni)

| Texnologiya | Vazifasi |
|-------------|----------|
| **Express.js** | HTTP server |
| **TypeScript** | Xavfsiz kod |
| **Multer** | Fayl yuklash (5MB limit) |
| **Drizzle ORM** | Ma'lumotlar bazasi bilan ishlash |
| **PostgreSQL (Neon)** | Ma'lumotlar bazasi |
| **Google Gemini AI** | Mahsulot rasmlarini tahlil qilish |

---

## Ma'lumotlar Bazasi Tuzilishi

### Jadvallar

#### 1. `users` - Foydalanuvchilar
| Maydon | Turi | Tavsif |
|--------|------|--------|
| id | UUID | Unikal identifikator |
| username | Text | Foydalanuvchi nomi |
| password | Text | Shifrlangan parol |
| isAdmin | Boolean | Admin huquqi |
| createdAt | Timestamp | Yaratilgan vaqt |

#### 2. `products` - Mahsulotlar
| Maydon | Turi | Tavsif |
|--------|------|--------|
| id | Serial | Unikal raqam |
| title | Text | Mahsulot nomi |
| price | Integer | Narxi |
| description | Text | Tavsifi |
| imageUrl | Text | Rasm manzili |
| category | Text | Kategoriyasi |
| tags | JSON | Teglar ro'yxati |
| aiAnalysis | JSON | AI tahlili natijalari |
| createdAt | Timestamp | Yaratilgan vaqt |

#### 3. `orders` - Buyurtmalar
| Maydon | Turi | Tavsif |
|--------|------|--------|
| id | Serial | Unikal raqam |
| customerName | Text | Mijoz ismi |
| customerPhone | Text | Telefon raqami |
| customerAddress | Text | Manzil |
| totalAmount | Integer | Umumiy summa |
| status | Text | Holati (yangi/jarayonda/bajarildi) |
| createdAt | Timestamp | Yaratilgan vaqt |

#### 4. `order_items` - Buyurtma tarkibi
| Maydon | Turi | Tavsif |
|--------|------|--------|
| id | Serial | Unikal raqam |
| orderId | Integer | Buyurtma ID |
| productId | Integer | Mahsulot ID |
| quantity | Integer | Miqdori |
| priceAtPurchase | Integer | Sotib olish narxi |

---

## API Endpointlar

### Autentifikatsiya
| Metod | Endpoint | Vazifa |
|-------|----------|--------|
| POST | `/api/auth/register` | Ro'yxatdan o'tish |
| POST | `/api/auth/login` | Tizimga kirish |

### Mahsulotlar
| Metod | Endpoint | Vazifa |
|-------|----------|--------|
| GET | `/api/products` | Barcha mahsulotlar |
| GET | `/api/products/:id` | Bitta mahsulot |
| POST | `/api/products` | Yangi mahsulot qo'shish (AI tahlili bilan) |
| PATCH | `/api/products/:id` | Mahsulotni yangilash |
| DELETE | `/api/products/:id` | Mahsulotni o'chirish |

### Buyurtmalar
| Metod | Endpoint | Vazifa |
|-------|----------|--------|
| GET | `/api/orders` | Barcha buyurtmalar |
| POST | `/api/orders` | Yangi buyurtma |
| PATCH | `/api/orders/:id/status` | Buyurtma holatini yangilash |

---

## AI Integratsiyasi (Google Gemini)

Platforma Google Gemini 2.5 Flash modelidan foydalanadi:

**Imkoniyatlar:**
- Rasm tahlili orqali mahsulot ma'lumotlarini chiqarish
- Avtomatik nom, kategoriya va narx bashorati
- Sentiment tahlili
- Kalit so'zlarni ajratib olish
- Bozor bashorati

**Til:** O'zbek tili uchun optimallashtirilgan

---

## Loyiha Fayllari Tuzilishi

```
lumina-ai-ecommerce/
├── client/                    # Frontend
│   ├── public/               # Statik fayllar
│   │   └── favicon.png
│   ├── src/
│   │   ├── components/       # UI komponentlar
│   │   │   ├── ui/          # shadcn/ui komponentlar
│   │   │   └── layout.tsx   # Asosiy layout
│   │   ├── hooks/           # Custom React hooklar
│   │   │   ├── use-cart.tsx # Savatcha hook
│   │   │   └── use-toast.ts # Bildirishnoma hook
│   │   ├── lib/             # Yordamchi funksiyalar
│   │   │   ├── api.ts       # API so'rovlari
│   │   │   ├── mock-data.ts # Test ma'lumotlar
│   │   │   └── utils.ts     # Utilita funksiyalar
│   │   ├── pages/           # Sahifalar
│   │   │   ├── home.tsx     # Bosh sahifa
│   │   │   ├── checkout.tsx # To'lov sahifasi
│   │   │   ├── admin.tsx    # Admin panel
│   │   │   └── not-found.tsx
│   │   ├── App.tsx          # Asosiy komponent
│   │   ├── main.tsx         # Kirish nuqtasi
│   │   └── index.css        # Global stillar
│   └── index.html
├── server/                    # Backend
│   ├── db.ts                 # Ma'lumotlar bazasi ulanishi
│   ├── gemini.ts             # AI integratsiyasi
│   ├── index.ts              # Server kirish nuqtasi
│   ├── routes.ts             # API endpointlar
│   ├── static.ts             # Statik fayllar
│   ├── storage.ts            # Ma'lumotlar qatlami
│   └── vite.ts               # Vite integratsiyasi
├── shared/                    # Umumiy kod
│   └── schema.ts             # Ma'lumotlar bazasi sxemasi
├── script/
│   └── build.ts              # Build skripti
├── uploads/                   # Yuklangan rasmlar
├── attached_assets/           # Generatsiya qilingan rasmlar
├── package.json              # Loyiha sozlamalari
├── vite.config.ts            # Vite konfiguratsiyasi
├── drizzle.config.ts         # Drizzle ORM sozlamalari
├── tsconfig.json             # TypeScript sozlamalari
└── replit.md                 # Loyiha hujjatlari
```

---

## Xususiyatlar

### Foydalanuvchilar uchun:
- Mahsulotlarni ko'rish va qidirish
- Savatchaga mahsulot qo'shish
- Buyurtma berish
- Qorong'u/yorug' rejim

### Adminlar uchun:
- Rasm yuklash orqali mahsulot qo'shish
- AI yordamida avtomatik ma'lumotlar to'ldirish
- Mahsulotlarni tahrirlash/o'chirish
- Buyurtmalarni boshqarish

---

## Xavfsizlik Choralari

1. **Parol shifrlash:** scrypt algoritmi bilan xavfsiz saqlash
2. **Ma'lumotlar validatsiyasi:** Zod kutubxonasi bilan tekshirish
3. **Fayl yuklash cheklovlari:** 5MB maksimal hajm
4. **CORS sozlamalari:** Xavfsiz API so'rovlari

---

## Ishga Tushirish

**Development rejim:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm run start
```

**Ma'lumotlar bazasini yangilash:**
```bash
npm run db:push
```

---

## Muhit O'zgaruvchilari

| O'zgaruvchi | Vazifasi |
|-------------|----------|
| `DATABASE_URL` | PostgreSQL ulanish manzili |
| `GEMINI_API_KEY` | Google Gemini AI kaliti |

---

## Xulosa

Lumina AI - bu zamonaviy, AI-powered elektron tijorat platformasi bo'lib, O'zbekiston bozori uchun moslashtirilgan. Platforma Google Gemini AI dan foydalanib, mahsulot rasmlarini avtomatik tahlil qiladi va sotuvchilarga vaqtni tejash imkonini beradi.

**Asosiy afzalliklar:**
- Zamonaviy texnologiyalar (React 19, TypeScript, Tailwind CSS)
- AI-powered mahsulot tahlili
- O'zbek tilida interfeys
- Xavfsiz va ishonchli arxitektura
- Replit platformasiga to'liq moslashgan

---

*Hisobot yaratilgan: 2024*  
*Platforma: Replit*
