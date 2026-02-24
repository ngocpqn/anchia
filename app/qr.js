export function generateQR(bin,acc,name,amount,content,canvasId){
 const url =
 `https://img.vietqr.io/image/${bin}-${acc}-compact2.png?amount=${amount}&addInfo=${content}&accountName=${name}`

 QRCode.toCanvas(
  document.getElementById(canvasId),
  url,
  {width:180}
 )
}