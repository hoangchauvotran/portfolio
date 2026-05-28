# Vo Tran Hoang Chau — Data Analyst Portfolio

Portfolio website cá nhân của **Võ Trần Hoàng Châu** — Data Analyst chuyên về Finance, Banking & Compensation Analytics.

## Công nghệ sử dụng

- HTML / CSS / JavaScript thuần (static site)
- Chart.js (compensation dashboard tương tác)
- Python + Pandas (sinh dữ liệu dashboard mô phỏng)

## Cấu trúc thư mục

```
portfolio/                    # Website chính (deploy target)
├── assets/                   # Hình ảnh, logo, CV PDF, project files
├── compensation-dashboard/   # Interactive compensation dashboard (Chart.js)
├── projects/                 # 3 trang case study chi tiết
├── case-studies-data.js      # Dữ liệu case studies
├── case-studies-renderer.js  # Renderer cho case studies
├── project-detail-renderer.js# Renderer cho project detail
├── index.html                # Entry point
├── main.js                   # Logic chính
└── style.css                 # Stylesheet

portfolio-case-studies/       # Standalone case study modules (bản phụ)
compensation-dashboard/       # Python source cho dashboard generator
```

## Chạy local

Mở trực tiếp file `portfolio/index.html` trên trình duyệt, hoặc dùng:

```bash
python3 -m http.server 8000 -d portfolio
```

Truy cập: http://localhost:8000

## Deploy lên Vercel

1. Import repo từ GitHub tại [vercel.com/new](https://vercel.com/new)
2. Chọn **Root Directory**: `portfolio`
3. Framework Preset: **Other**
4. Deploy

## Liên hệ

- **Email**: hoangchauvotran@gmail.com
- **Phone**: (+84) 90 976 4296
- **Location**: Phu Nhuan, Ho Chi Minh City
