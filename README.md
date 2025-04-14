# 🐟 Fish Game

Game cá đơn giản được phát triển bằng PixiJS, nơi người chơi điều khiển một chú cá nhỏ để ăn các con cá khác và phát triển lớn hơn.

## 🎮 Cách Chơi

1. **Di Chuyển**: 
   - Sử dụng chuột để điều khiển cá
   - Click vào vị trí bất kỳ trên màn hình để cá di chuyển đến đó

2. **Mục Tiêu**:
   - Ăn các con cá nhỏ hơn để tăng điểm và phát triển
   - Tránh các con cá lớn hơn
   - Cố gắng đạt điểm cao nhất có thể

3. **Cơ Chế Game**:
   - Cá player bắt đầu ở level 2
   - Có thể phát triển lên đến level 4
   - Bạn có 3 mạng (hearts)
   - Game kết thúc khi hết mạng

## 🛠️ Công Nghệ Sử Dụng

- **Engine**: PixiJS v7
- **Ngôn ngữ**: JavaScript
- **Asset Format**: Sprite sheets và JSON

## 🎯 Tính Năng

- Animation mượt mà cho cá
- Hệ thống level và tăng kích thước
- Hiệu ứng đổ bóng cho menu
- Âm thanh game
- Hệ thống điểm số
- Collision detection thông minh

## 🚀 Cách Chạy Game

1. Clone repository về máy
2. Mở file `index.html` bằng một web server (có thể dùng Live Server trong VS Code)
3. Chơi và tận hưởng!

## 🎨 Assets

Game sử dụng các assets sau:
- Sprite sheets cho cá player (`user_fish 1.png` đến `user_fish 5.png`)
- Background cho menu và gameplay
- Các sprite cho cá AI
- UI elements (buttons, hearts, score display)

## 🔧 Cấu Trúc Code

```
source/
├── entities/
│   ├── PlayerFish.js    # Logic cho cá của người chơi
│   └── ...             # Các entity khác
├── scenes/
│   ├── GameScene.js    # Scene chính của game
│   └── MenuScene.js    # Menu scene
├── utils/
│   └── ...            # Các utility functions
└── constants.js       # Game constants
```

## 📝 Ghi Chú

- Game được tối ưu cho trình duyệt hiện đại
- Khuyến nghị sử dụng Chrome hoặc Edge để có trải nghiệm tốt nhất
- Đảm bảo bật âm thanh để có trải nghiệm game đầy đủ

## 🤝 Đóng Góp

Mọi đóng góp để cải thiện game đều được chào đón. Vui lòng tạo issue hoặc pull request nếu bạn muốn đóng góp.
