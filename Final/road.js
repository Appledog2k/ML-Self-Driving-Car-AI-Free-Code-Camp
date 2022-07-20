class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    // thiết lập con đường lên xuống vô hạn
    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    // xác định biên giới của đường
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  // chọn vị trí đặt trên land
  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 1; i <= this.laneCount - 1; i++) {
      // sử dụng hàm nội suy tuyến từ trái qua phải theo tỉ lệ phần trăm
      const x = lerp(this.left, this.right, i / this.laneCount);
      // tạo đường kẻ ngang 20px và 20px
      ctx.setLineDash([20, 20]);
      // bắt đầu con đường với kẻ vạch ở 2 bên
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // ô tô di chuyển mà ko thay đổi bất kì điều j
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      // sau khi xong ko thay đổi bất kì điều j
      ctx.stroke();
    });
  }
}
