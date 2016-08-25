var Lerc2Decoder = require('./lib/src/lercdecoder2.js');

module.exports = function drawImage() {
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  var xmlhttp = new XMLHttpRequest();
  var url = "http://127.0.0.1:8080/data/test_bytes.lerc";

  xmlhttp.open("GET", url, true);
  xmlhttp.responseType = "arraybuffer";
  xmlhttp.send();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var lercBuffer = xmlhttp.response;
      var arrayBuffer = new Uint8Array(lercBuffer).buffer;
      var lerc2Decoder = new Lerc2Decoder(arrayBuffer);
      var result = lerc2Decoder.parse();
      var dv = new DataView(result.pixelData);

      var imgd = new Uint8Array(result.pixelData.length);
      for (var iByte = 0; iByte < result.pixelData.length; iByte++) {
        imgd[iByte] = dv.getUint8(iByte);
      }

      var imgData = ctx.createImageData(256, 256); // width x height
      var data = imgData.data;

      var len = 256 * 256 * 4;

      // copy img byte-per-byte into our ImageData
      for (var i = 0; i < len; i++) {
        data[i * 4] = imgd[i];
        data[i * 4 + 1] = imgd[i];
        data[i * 4 + 2] = imgd[i];
        data[i * 4 + 3] = 255;
      }

      // now we can draw our imagedata onto the canvas
      ctx.putImageData(imgData, 0, 0);
    }
  };
}
