let capture;
let faceMesh;
let faces = [];
let isModelLoading = true; // 新增一個變數來追蹤模型是否正在載入
let isModelReady = false;
let pointsToConnect = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
let pointsToConnect2 = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 調低偵測解析度至 320x240，可以讓臉部追蹤「跑快一點」
  capture.size(320, 240); 
  
  // 隱藏預設產生的 HTML5 video 元件，只在畫布內顯示
  capture.hide();

  // 初始化 FaceMesh
  if (typeof ml5 === 'undefined') {
    console.error("ml5 尚未載入，請檢查網路連線或 CDN 連結");
    return;
  }
  // ml5 v1.x 改用 faceMesh (M 大寫)，並在模型載入完成後才開始偵測
  faceMesh = ml5.faceMesh(capture, { maxFaces: 1, refineLandmarks: true, flipHorizontal: false }, () => {
    console.log("臉部辨識模型已準備就緒");
    isModelReady = true;
    isModelLoading = false; // 模型載入完成
    // 模型準備好後才開始偵測
    // v1.x 使用 detectStart 進行持續偵測
    faceMesh.detectStart(capture, results => {
      faces = results;
    });
  });
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
  
  // 如果攝影機或模型還沒準備好，顯示載入文字
  if (!isModelReady || capture.width === 0 || isModelLoading) { // 增加 isModelLoading 判斷
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(isModelLoading ? "正在載入臉部辨識模型..." : "正在啟動攝影機...", width / 2, height / 2);
    return;
  }

  // 實作左右翻轉（鏡像效果）
  push();
  translate(width, 0);
  scale(-1, 1);
  // 由於座標系已翻轉，影像會維持在置中位置（因為 x 是對稱的）
  image(capture, x, y, imgW, imgH);

  // 繪製臉部辨識線條
  if (faces.length > 0) {
    let keypoints = faces[0].keypoints;
    stroke(255, 0, 0); // 線條採用紅色
    strokeWeight(1);   // 線條粗細為 1
    noFill();
    // 利用 line 指令串接第一組指定編號的點
    for (let i = 0; i < pointsToConnect.length - 1; i++) {
      let p1 = keypoints[pointsToConnect[i]];
      let p2 = keypoints[pointsToConnect[i + 1]];
      // 確保點位存在才繪製
      if (p1 && p2) {
        line(
          // 使用 capture.width/height 代替 320/240 以確保座標映射準確
          map(p1.x, 0, capture.width, x, x + imgW),
          map(p1.y, 0, capture.height, y, y + imgH),
          map(p2.x, 0, capture.width, x, x + imgW),
          map(p2.y, 0, capture.height, y, y + imgH)
        );
      }
    }

    // 利用 line 指令串接第二組指定編號的點
    for (let i = 0; i < pointsToConnect2.length - 1; i++) {
      let p1 = keypoints[pointsToConnect2[i]];
      let p2 = keypoints[pointsToConnect2[i + 1]];
      // 確保點位存在才繪製
      if (p1 && p2) {
        line(
          map(p1.x, 0, capture.width, x, x + imgW),
          map(p1.y, 0, capture.height, y, y + imgH),
          map(p2.x, 0, capture.width, x, x + imgW),
          map(p2.y, 0, capture.height, y, y + imgH)
        );
      }
    }
  }
  pop();

  // 顯示文字：教科414730159（放在最後確保顯示在最上層）
  push();
  fill(0); // 設定文字為黑色
  textSize(32); // 設定文字大小
  textAlign(CENTER, BOTTOM); // 水平置中，基準點在文字底部
  text("教科414730159", width / 2, y - 10); // 座標在畫布中央，影像上方 10 像素處
  pop();
}

// 當視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
