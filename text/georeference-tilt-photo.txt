# 影像改正
將影像用幾何方式改正。

這次程式包括

* 共用函數 transform.js reference-image.js
* 包裝共用函數的腳本 convert.js 
* 所有轉換程式 affine-angle.js
  affine-transform.js
  polynomial-d1.js
  polynomial-transform.js
  project-transform.js
* p339.js p340.js p341.js 各影像的轉換腳本與控制點

引用的函式庫包括 Jimp 提供影像處理，
與 mathjs 提供矩陣運算功能。

<link rel="canonical" href="http://gholk.github.io/georeference-tilt-photo.html">

<script src="ext/toc.js"></script>
<script src="ext/flickr.js"></script>

### 程式

### transform.js
我擴充了 mathjs 的功能，
然後定義了幾個基礎的類別與常數。

### reference-image.js
把 jimp 包裝成可以直接用的物件，
並定義了遍歷 pixel 的 method。
另外 jimp 本身提供了 pixel 的內插功能，
所以我沒有額外自己寫。

### 轉換的函式庫
把每種轉換寫成一個 js，方便引用。
每個函式庫需要輸入數個控制點物件 Gcp，
然後會回傳用最小二乘解得的轉換物件。
物件的 `.error` 屬性有最小二乘的誤差。

每個物件有 `.pixelToReal` 和 `.realToPixel` 二方法，
分別輸入 `[x, y]` 會回傳轉換後的結果。

#### affine-transform.js
四參數正形轉換，只有旋轉、平移、縮放。
需要至少二個點。

#### affine-angle.js
六參數正形轉換，X Y 方向的旋轉角不同。
需要至少三個點。

#### polynomial-d1.js
一階多項式轉換，多項式 X Y 分別有
1 x y xy 四項系數，共八項系數。
需要至少四個點。

#### polynomial-transform.js
二階多項式轉換，X Y 分別有 1 x y xy x² y² 六項系數，
共 12 個系數，需要至少六個點。

#### project-transform.js
平面投影轉換，最好控制點都要在同一平面上。
共八參數，需要至少四個點。


### 各影像的處理腳本
分別對應同一編號的圖片。
裡面有控制點和要轉換區域的 pixel。

除了投影轉換，都是用 7 個控制點。
一個在大學路的人行道，二個在東邊的球場，
四個在西邊的球場。

投影轉換只用西邊四個結果怪怪的，
只好把東邊球場二個也加進去。


#### p339.js
#### p340.js
#### p341.js

### convert.js
這個腳本就是輸入控制點、圖片檔名、
要使用的轉換 library 即會完成轉換。
上面那四個腳本就是呼叫 convert.js 轉換的。

<script>
const heads = document.querySelectorAll('h2, h3, h4')
Array.from(heads)
    .filter((head) => /^[\w-]+\.js$/.test(head.textContent))
    .forEach((head) => {
        const filename = head.textContent
        head.textContent = ''
        head.appendChild(findGithubFile(filename))
    })

function findGithubFile(filename) {
    const repo = 'https://github.com/GHolk/wstd/tree/master/photo-remote/geometry-reference'
    const a = document.createElement('a')
    a.href = `${repo}/${filename}`
    a.textContent = filename
    return a
}
</script>

## 轉換成果

<style>
img {
    max-width: 45%;
    margin: 2px;
}
:this + p,
:this + p + p,
:this + p + p + p {
    text-indent: 0;
    border: 1px solid black;
}
</style>


![photo](DJI_0339.jpg)
![photo](DJI_0339-affine-angle.png)
![photo](DJI_0339-affine-transform.png)
![photo](DJI_0339-polynomial-d1.png)
![photo](DJI_0339-polynomial-transform.png)
![photo](DJI_0339-project-transform.png)

![photo](DJI_0340.jpg)
![photo](DJI_0340-affine-angle.png)
![photo](DJI_0340-affine-transform.png)
![photo](DJI_0340-polynomial-d1.png)
![photo](DJI_0340-polynomial-transform.png)
![photo](DJI_0340-project-transform.png)

![photo](DJI_0341.jpg)
![photo](DJI_0341-affine-angle.png)
![photo](DJI_0341-affine-transform.png)
![photo](DJI_0341-polynomial-d1.png)
![photo](DJI_0341-polynomial-transform.png)
![photo](DJI_0341-project-transform.png)

<style>
    p > iframe {
        display: inline;
    }
</style>

<script>
const wrongImage = Array.from(document.querySelectorAll('img'))
flk.set(wrongImage.map((img) => img.src.match(/[^/]*$/)[0]), 
[{"farm":"farm5","server":"4463","photo":"37886284742","secret":"1daafb51c2","user":"135370742@N08"},{"farm":"farm5","server":"4469","photo":"37207730984","secret":"068c63fb03","user":"135370742@N08"},{"farm":"farm5","server":"4473","photo":"37917142821","secret":"f09a956810","user":"135370742@N08"},{"farm":"farm5","server":"4502","photo":"24065971218","secret":"7ab0fdacb5","user":"135370742@N08"},{"farm":"farm5","server":"4498","photo":"37207735814","secret":"4294958c3c","user":"135370742@N08"},{"farm":"farm5","server":"4497","photo":"24065973798","secret":"b6258d08e9","user":"135370742@N08"},{"farm":"farm5","server":"4504","photo":"26141347759","secret":"5e1930a212","user":"135370742@N08"},{"farm":"farm5","server":"4452","photo":"37917149961","secret":"44ea6919d2","user":"135370742@N08"},{"farm":"farm5","server":"4469","photo":"26141351369","secret":"6d49befbe6","user":"135370742@N08"},{"farm":"farm5","server":"4485","photo":"24065983648","secret":"66c318927d","user":"135370742@N08"},{"farm":"farm5","server":"4513","photo":"26141357279","secret":"f68bc51af5","user":"135370742@N08"},{"farm":"farm5","server":"4443","photo":"37886311612","secret":"3d0369e0c9","user":"135370742@N08"},{"farm":"farm5","server":"4506","photo":"37886315322","secret":"de5dc9c954","user":"135370742@N08"},{"farm":"farm5","server":"4451","photo":"37207745354","secret":"89df8455c2","user":"135370742@N08"},{"farm":"farm5","server":"4485","photo":"37207747554","secret":"eb58d24c45","user":"135370742@N08"},{"farm":"farm5","server":"4458","photo":"37207748444","secret":"13f9230e83","user":"135370742@N08"},{"farm":"farm5","server":"4475","photo":"37886328602","secret":"b9cd8523d4","user":"135370742@N08"},{"farm":"farm5","server":"4465","photo":"37207750834","secret":"1ac62045cd","user":"135370742@N08"}])

flk.set(["DJI_0341-affine-angle.png","DJI_0341-affine-transform.png","DJI_0341-polynomial-d1.png","DJI_0341-polynomial-transform.png","DJI_0341-project-transform.png"],
[{"farm":"farm5","server":"4506","photo":"37912982916","secret":"353a474025","user":"135370742@N08"},{"farm":"farm5","server":"4462","photo":"37935727972","secret":"94ce6d5ffb","user":"135370742@N08"},{"farm":"farm5","server":"4450","photo":"37912984516","secret":"10200fbd15","user":"135370742@N08"},{"farm":"farm5","server":"4476","photo":"24115368398","secret":"2fe7c09313","user":"135370742@N08"},{"farm":"farm5","server":"4477","photo":"37256574344","secret":"13e3822e79","user":"135370742@N08"}])

wrongImage.forEach((img) => img.replaceWith(flk.getNode(img.src.match(/[^/]*$/)[0])))
</script>

有點問題是我轉換的成果都會有偏移，
也就是球場會超過我選的轉換區域，跑到圖片外。
我選區域是在影像中選出 pixel 的 row 和 col，
分別是左上作為開始點座標，右下作為結束點座標。

然後在計算時將二點轉成物空間座標，
從最小的 EN 開始，間隔 5cm，遍歷到最大的 EN。
在每取樣點先把物座標轉成像座標，
再去取該像座標的色彩值，填入新的影像。

但不知道為什麼轉換後的球場，
會超出我在原影片像取的球場邊界座標。
可能是來回轉換的誤差吧？
但我平差的誤差都在一公尺內，
偏移卻會到近十公尺。

各影像偏移的方向也不同，
正形轉換會超出西方的邊界，
其它都是超出南方的邊界。
最後我是把轉換的區域調大，
讓偏移後還是在區域內。
但還是有些超過，懶得調。


## 印成 pdf
結果做好，用 firefox 印，超連結不能點；
用 chromium 印是可以了，但相對連結變成絕對連結。
最後再手動編輯 pdf，把絕對連結改回相對。

最後要上傳，moodle 說只能傳 200MB 以下的，
chromium 印出來就 165MB，圖檔再加一加就超過了。
就便 google 到一個 <http://smallpdf.com> ，
結果把我 165MB 壓成 667KB，根本黑科技！

應該是把裡面那幾張圖做壓縮吧，
反正在 pdf 裡的只要能看就好了，
畫質不用太好；要好直接看原始檔就好了。


#程式
#ncku
#測量
#作業
