/* xây dựng tuyến đường cho xe ô tô với độ rộng là 200px và chiều cao là toàn bộ cửa sổ code ở dòng 58
 */
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

// lấy bối cảnh vẽ trên canvas
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// khởi tạo tuyến đường với tâm x và chiều rộng băng 0.9 canvas
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 1;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

const traffic = [
  // tạo đối tượng car ở làn xe số xxx, tọa độ y, độ rộng, chiều dài, tên,....
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -400, 30, 50, "DUMMY", 2, getRandomColor()),
];

animate();

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  // tạo hiệu ứng chuyển động của môi trường ô tô chạy
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  // thiết lập camera cho xe khi xe chuyển động, giữ nguyên tọa độ x, thay đổi vị trí tọa độ y theo canvas
  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  // triển khai vẽ đường và ô tô
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  // khôi phục lại ngữ cảnh
  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  // phương thức lặp đi lặp lại khung hình nhiều lần trong một giây min 24/s
  requestAnimationFrame(animate);
}

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
  var textToWrite = localStorage.getItem("bestBrain");
  console.log(textToWrite);
  var textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });
  var fileNameToSaveAs = "FileSave";

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }
  downloadLink.click();
}

function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}

function loadFileAsText() {
  var fileToLoad = document.getElementById("fileToLoad").files[0];

  var fileReader = new FileReader();
  fileReader.onload = function (fileLoadedEvent) {
    var textFromFileLoaded = fileLoadedEvent.target.result;
    document.getElementById("inputTextToSave").value = textFromFileLoaded;
  };
  fileReader.readAsText(fileToLoad, "UTF-8");
}
