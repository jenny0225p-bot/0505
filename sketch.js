let capture;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  
  // 隱藏預設產生的 HTML5 video 元件，只在畫布內顯示
  capture.hide();
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 計算影像顯示的寬高（畫布寬高的 50%）
  let imgW = width * 0.5;
  let imgH = height * 0.5;
  
  // 計算置中位置
  let x = (width - imgW) / 2;
  let y = (height - imgH) / 2;
  
  // 在畫布中間繪製攝影機影像
  image(capture, x, y, imgW, imgH);
}

// 當視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
