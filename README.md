# Vo Tran Hoang Chau — Data Analyst Portfolio

Portfolio website cá nhân của **Võ Trần Hoàng Châu** — Data Analyst chuyên Finance, Banking & Compensation Analytics.

## Công nghệ

- HTML / CSS / JavaScript thuần (static site)
- Chart.js (compensation dashboard tương tác)
- Python + Pandas (sinh dữ liệu mô phỏng)

## Cấu trúc thư mục

```
.
├── .gitignore
├── README.md
├── portfolio/                    # Website chính (root deploy)
│   ├── assets/                   # Hình ảnh, logo, CV PDF
│   ├── compensation-dashboard/   # Dashboard tương tác (Chart.js)
│   ├── projects/                 # Case study chi tiết (3 projects)
│   ├── case-studies-data.js
│   ├── case-studies-renderer.js
│   ├── project-detail-renderer.js
│   ├── index.html
│   ├── main.js
│   └── style.css
└── portfolio-case-studies/       # Standalone case study modules
```

## Chạy local

```bash
python3 -m http.server 8000 -d portfolio
```

Mở http://localhost:8000

## Deploy (Vercel)

1. Import repo tại [vercel.com/new](https://vercel.com/new)
2. **Root Directory**: `portfolio`
3. **Framework**: Other
4. Deploy

## Liên hệ

- **Email**: hoangchauvotran@gmail.com
- **Phone**: (+84) 90 976 4296
- **Location**: Phu Nhuan, Ho Chi Minh City
