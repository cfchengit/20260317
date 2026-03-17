let input;
let slider;
let btn;
let isJumping = false; // 紀錄文字是否跳動的狀態
let iframeDiv;
let selectMenu;

function setup() {
  // 建立全螢幕滿版的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 產生一個文字方框，並設定初始預設文字
  input = createInput('💖❤️🎶淡江大學🎶❤️💖');
  input.position(20, 20); // 設定文字方框在視窗上的位置
  input.size(200, 30); // 設定 input 元件的寬為 200，高為 25
  input.style('font-size', '20px'); // 設定 input 元件輸入的文字大小為 20px
  input.style('background-color', '#f5ebe0'); // 設定 input 元件背景顏色
  input.style('color', '#e36414'); // 設定 input 元件文字顏色
  
  // 產生一個滑桿，範圍為 15 到 80，預設值為 30
  slider = createSlider(15, 80, 30);
  slider.position(270, 25); // 位置計算：文字框 X 座標(20) + 文字框寬度(200) + 間距(50) = 270
  
  // 產生一個按鈕在滑桿右側
  btn = createButton('文字跳動');
  btn.position(450, 20); // 位置計算：滑桿 X 座標(270) + 滑桿預設寬度(約130) + 間距(50) = 450
  btn.size(150, 50); // 按鈕寬度為 150，高度為 50
  btn.style('font-size', '20px'); // 按鈕內的文字大小為 20px
  btn.style("border-color",'green')
	btn.style("border-width",'10px')
	btn.style("color",'green')
	btn.style("font-size",'20px')
  btn.mousePressed(() => {
    isJumping = !isJumping; // 按下按鈕時，切換跳動狀態
  });

  // 設定滑鼠移入時的游標改為 pointer
  btn.style('cursor', 'pointer');
  
  // 注入一段 CSS 動畫，讓套用的元件在 hover（滑鼠移入）時產生左右抖動效果
  createElement('style', `
    .shake-hover:hover {
      animation: shake-anim 0.3s ease-in-out;
    }
    @keyframes shake-anim {
      0%, 100% { transform: translateX(0); }
      25%, 75% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
    }
  `);
  btn.addClass('shake-hover'); // 把這個抖動的 CSS 類別加上去
  
  // 產生一個下拉式選單在按鈕右側
  selectMenu = createSelect();
  selectMenu.position(650, 20); // 位置計算：按鈕 X 座標(450) + 按鈕寬度(150) + 間隔(50) = 650
  selectMenu.size(150, 50); // 設定選單大小，與按鈕一致
  selectMenu.style('font-size', '20px'); // 設定選單內文字大小
  
  // 新增選項
  selectMenu.option('淡江大學');
  selectMenu.option('教科系');
  
  // 當選單選項改變時觸發事件
  selectMenu.changed(() => {
    let selectedItem = selectMenu.value(); // 取得當前選擇的文字
    input.value(`💖❤️🎶${selectedItem}🎶❤️💖`); // 將輸入框的文字更改為選擇的項目，並加上 emoji
    
    // 根據選擇的項目改變 iframeDiv 內的網址
    if (selectedItem === '淡江大學') {
      iframeDiv.html('<iframe src="https://www.tku.edu.tw" width="100%" height="100%" style="border:none;"></iframe>');
    } else if (selectedItem === '教科系') {
      iframeDiv.html('<iframe src="https://www.et.tku.edu.tw" width="100%" height="100%" style="border:none;"></iframe>');
    }
  });
  
  // 設定文字垂直對齊至上方，以利後續由上而下繪製
  textAlign(LEFT, TOP);
  
  // 產生一個 DIV 位於畫面中間，與四周距離 200px，並在內部放入 iframe 顯示網頁
  iframeDiv = createDiv('<iframe src="https://www.tku.edu.tw" width="100%" height="100%" style="border:none;"></iframe>');
  iframeDiv.style('position', 'absolute');
  iframeDiv.style('top', '150px'); // 將上方距離改為 150px
  iframeDiv.style('bottom', '150px'); // 將下方距離改為 150px
  iframeDiv.style('left', '200px');
  iframeDiv.style('right', '200px');
  iframeDiv.style('z-index', '99'); // 確保網頁區塊蓋在 p5 畫布與背景文字之上
  iframeDiv.style('background-color', '#ffffff'); // 加上白色背景，避免網頁載入前或透明區域與背景文字重疊
  iframeDiv.style('box-shadow', '0 10px 20px rgba(0,0,0,0.5)'); // 加上陰影增加視窗的立體層次感
  iframeDiv.style('opacity', '0.95'); // 設定透明度為 0.5
}

function draw() {
  background(220); // 設定背景顏色
  
  // 動態取得滑桿的值，並設定為文字大小
  textSize(slider.value());
  
  // 動態取得文字方框的輸入內容
  let txt = input.value();
  if (txt.length > 0) {
    let tw = textWidth(txt); // 計算使用者輸入的字串寬度
    if (tw > 0) {
      // 建立指定的色票陣列
      let colors = ['#3d348b', '#7678ed', '#f7b801', '#f18701', '#f35b04'];
      
      // 利用雙重迴圈及字體寬度，將文字重複填滿整個視窗
      for (let y = 100; y < height; y += slider.value() * 1.5) { // 從 y=100 開始，設定行距為 1.5 倍文字高度
        let wordIndex = 0; // 記錄同一行中文字的順序
        for (let x = 0; x < width; x += tw + 30) {
          // 根據文字順序，利用取餘數 (%) 輪流套用色票陣列中的顏色
          fill(colors[wordIndex % colors.length]);
          
          // 如果處於跳動狀態，則產生緩和的波浪位移
          let offsetX = 0;
          let offsetY = 0;
          if (isJumping) {
            // 利用 sin() 與 cos() 搭配 frameCount 及座標，產生平滑的環狀/波浪位移
            offsetX = sin(frameCount * 0.05 + x * 0.01 + y * 0.01) * 20;
            offsetY = cos(frameCount * 0.05 + x * 0.01 + y * 0.01) * 20;
          }
          
          text(txt, x + offsetX, y + offsetY);
          wordIndex++; // 換下一個顏色
        }
      }
    }
  }
}

// 加入視窗大小變更時的事件處理，確保維持全螢幕畫布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
