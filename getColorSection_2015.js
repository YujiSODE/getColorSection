//getColorSection.js
//!!!=== it must be run with 'FigPlotter.html' of version: 3.2 or more. ===!!!
//this draws a columnar section by given averages of rgba values of the canvas tag.
//this creates an additional canvas layer on the original canvas tag. 
(function () {
  var slf = this;
  var _prm = getParamAccess().data;
  var rand10 = slf.Math.random().toFixed(10).replace(/\./g, '');
  //target canvas
  var tgtCvs = slf.document.getElementsByTagName('canvas') [0];
  var ctx = tgtCvs.getContext('2d');
  //this is an element generator. 
  var f = function (elemName, elemId, targetId) {
    var tgt = slf.document.getElementById(targetId);
    var Elm = slf.document.createElement(elemName);
    Elm.setAttribute('id', elemId);
    return tgt.appendChild(Elm);
  };
  //============================================================================
  //<div tag in head tag>
  //CSS
  var Hd = slf.document.getElementsByTagName('head') [0];
  var cssDiv = slf.document.getElementById('divCss');
  var cssStyle = slf.document.getElementById('tagStyle');
  if (!cssDiv) {
    var fileDiv_css = slf.document.createElement('div');
    fileDiv_css.setAttribute('id', 'divCss');
    Hd.appendChild(fileDiv_css);
  }
  if (!cssStyle) {
    var TagCss = f('style', 'tagStyle', 'divCss');
    TagCss.setAttribute('type', 'text/css');
  }
  cssDiv = null;
  cssStyle = null;
  var TgCss = slf.document.getElementById('tagStyle');
  //position of original canvas tag. 
  var dX_cvs = tgtCvs.offsetLeft;
  var dY_cvs = tgtCvs.offsetTop;
  //Reference: "offsetLeft" in MDN derived at "Sat Nov 07 2015 13:37:15 GMT+0900 (JST)";
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetLeft
  //Reference: "offsetTop" in MDN derived at "Sat Nov 07 2015 13:42:23 GMT+0900 (JST)";
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop
  TgCss.innerHTML += [
    '#supCanVas{position:absolute;left:',
    0 + dX_cvs,
    'px;top:',
    0 + dY_cvs,
    'px;background:rgba(255,0,0,0.1);z-index:1000;}'
  ].join('');
  //</div tag in head tag>
  //============================================================================
  //<div tag>
  var BD = slf.document.getElementsByTagName('body') [0];
  var fileDiv = slf.document.createElement('div');
  fileDiv.setAttribute('id', 'tgtCvsAreaDiv');
  BD.appendChild(fileDiv);
  //</div tag>
  //<form in div tag>
  var fm = f('form', 'fm_spCvsArea', 'tgtCvsAreaDiv');
  var label_w = f('label', 'cvsArea_fmLabel_w', 'fm_spCvsArea');
  label_w.innerHTML = 'Target width; 1 to (canvas width)/2: ';
  var inputW = f('input', 'input_w', 'cvsArea_fmLabel_w');
  inputW.setAttribute('type', 'number');
  inputW.setAttribute('value', 10);
  inputW.setAttribute('min', 1);
  inputW.setAttribute('max', tgtCvs.width / 2);
  inputW.setAttribute('step', 1);
  var label_h = f('label', 'cvsArea_fmLabel_h', 'fm_spCvsArea');
  label_h.innerHTML = 'Target width; 1 to canvas height: ';
  var inputH = f('input', 'input_h', 'cvsArea_fmLabel_h');
  inputH.setAttribute('type', 'number');
  inputH.setAttribute('value', 10);
  inputH.setAttribute('min', 1);
  inputH.setAttribute('max', tgtCvs.height);
  inputH.setAttribute('step', 1);
  //</form in div tag>
  //<supercanvas tag>
  var supCvs = f('canvas', 'supCanVas', tgtCvs.parentNode.id);
  supCvs.setAttribute('width', tgtCvs.width);
  supCvs.setAttribute('height', tgtCvs.height);
  supCvs.setAttribute('style', 'z-index:1');
  //=== click event: supercanvas ===
  var supW = 10;
  var supH = 10;
  fm.addEventListener('change', function () {
    supW = + slf.document.getElementById('input_w').value;
    supH = + slf.document.getElementById('input_h').value;
  }, true);
  var xywh = [
  ];
  supCvs.addEventListener('click', function (e) {
    var supX = e.clientX + slf.window.scrollX + __mClickX;
    var supY = e.clientY + slf.window.scrollY + __mClickY;
    //Reference: "scrollX" in MDN derived at "Wed May 20 2015 18:35:13 GMT+0900 (JST)"; 
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX
    //Reference: "scrollY" in MDN derived at "Wed May 20 2015 18:43:16 GMT+0900 (JST)"; 
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
    var supCtx = this.getContext('2d');
    supCtx.lineWidth = 1;
    supCtx.strokeStyle = 'rgba(0,0,0,1)';
    if (!!xywh[2]) {
      supCtx.clearRect(xywh[0] - 1, xywh[1] - 1, xywh[2] + 2, xywh[3] + 2);
    }
    supCtx.strokeRect(supX, supY, supW, supH);
    xywh = [
      supX,
      supY,
      supW,
      supH
    ];
  }, true);
  //</supercanvas tag>
  //=== it creates a color section by a target area of canvas. ===
  var cvsSectionB = f('button', 'sectionCanvas_B', 'tgtCvsAreaDiv');
  cvsSectionB.innerHTML = 'Get color section';
  cvsSectionB.addEventListener('click', function () {
    if (!!xywh[2]) {
      var crrntTgt = slf.document.getElementById(tgtCvs.id);
      var crrntCtx = crrntTgt.getContext('2d');
      var crrntImg = crrntCtx.getImageData(xywh[0], xywh[1], xywh[2], xywh[3]);
      var flgPrompt = function (A) {
        if (A.length < 4) {
          return true;
        } else {
          var totalA = 0;
          for (var i = 0; i < A.length; i += 1) {
            if (isNaN(A[i])) {
              return true;
            }
            totalA += + A[i];
          }
          if (totalA != 0) {
            return false;
          } else {
            return true;
          }
        }
      };
      var txtPrompt = [
        'RGBa = [R,G,B,a]; P=[p0, p1, p2, p3];\n',
        'value = p0*R + p1*G + p2*B + p3*a;\n',
        'Total(P)>0; P=?'
      ].join('');
      var rgbaP_sub = prompt(txtPrompt, '1,1,1,0');
      var rgbaP = '';
      if (!(rgbaP_sub != null)) {
        return;
      } else {
        rgbaP = rgbaP_sub.replace(/[\{\}\[\]\(\)\&\#\$\@\+\-\*\/\%\`\'\"\:\;\.]/g, /\s/).split(',');
      }
      while (flgPrompt(rgbaP)) {
        rgbaP_sub = prompt(txtPrompt, '1,1,1,0');
        if (!(rgbaP_sub != null)) {
          return;
        } else {
          rgbaP = rgbaP_sub.replace(/[\{\}\[\]\(\)\&\#\$\@\+\-\*\/\%\`\'\"\:\;\.]/g, /\s/).split(',');
        }
      }
      //to save used parameters to the global parameter as a simple path Object. 

      _prm.sectionLabel = [
        'colorSectionArea',
        rand10,
        ':',
        slf.Date().replace(/[' ':]/g, '')
      ].join('');
      _prm.X = [
        xywh[0],
        xywh[0],
        xywh[0] + xywh[2],
        xywh[0] + xywh[2]
      ];
      _prm.Y = [
        xywh[1],
        xywh[1] + xywh[3],
        xywh[1] + xywh[3],
        xywh[1]
      ];
      _prm.XTrue = [
        [xywh[0],
        xywh[0],
        xywh[0] + xywh[2],
        xywh[0] + xywh[2]]
      ];
      _prm.YTrue = [
        [xywh[1],
        xywh[1] + xywh[3],
        xywh[1] + xywh[3],
        xywh[1]]
      ];
      _prm.limit = 4;
      _prm.sectionResult = {
        sectionHeight: xywh[3],
        targetValue: [
          rgbaP[0],
          'r+',
          rgbaP[1],
          'g+',
          rgbaP[2],
          'b+',
          rgbaP[3],
          'a'
        ].join(''),
        info: 'unit is pixel.'
      };
      //===<worker>===
      //<script for worker>                     
      var scpt = [
        /*== head part of eventlistener ==*/
        'this.addEventListener(\'message\',',
        /*== dealing with pixel data ==*/
        'function(e){var d=e.data;',
        'var tgt=d.data;var tgtW=d.width;var tgtH=d.height;var R=[];var k=0;var subR=0;',
        [
          'rgbaMax=255*(',
          + rgbaP[0],
          '+',
          + rgbaP[1],
          '+',
          + rgbaP[2],
          '+',
          + rgbaP[3],
          ');'
        ].join(''), /*-- total of max. value --*/
        'for(var i=0;i<tgtH;i+=1){R[i]=[];R[i][1]=1;subR=0;',
        [
          'for(var j=0;j<tgtW*4;j+=4){subR+=',
          + rgbaP[0],
          '*tgt[k]+',
          + rgbaP[1],
          '*tgt[k+1]+',
          + rgbaP[2],
          '*tgt[k+2]+',
          + rgbaP[3],
          '*tgt[k+3];k+=4;}'
        ].join(''), /*total value of red, green, blue and alpha*/
        'R[i][0]=subR/(tgtW*rgbaMax);}', /*total of average values (relative value to max.)*/
        /*redAvg+greenAvg+blueAvg+alphaAvg=(redTotal+greenTotal+blueTotal+alphaTotal)/n while xAvg=xTotal/n*/
        /*== return result ==*/
        'this.postMessage(R);tgt=null;tgtW=null;tgtH=null;R=null;subR=null;k=null;d=null;rgbaMax=null;this.close();},',
        /*== tail part of eventlistener ==*/
        'true);'
      ].join('');
      //</script for worker>
      //<generation of worker>
      var blob = new Blob([scpt], {
        type: 'text/javascript'
      });
      var objUrl = slf.window.URL.createObjectURL(blob);
      var wk = new Worker(objUrl);
      slf.window.URL.revokeObjectURL(objUrl);
      blob = null;
      //</generation of worker>
      wk.addEventListener('message', function (e) {
        var d = e.data;
        var w0 = 20;
        var outputId = [
          'output:',
          rand10
        ].join('');
        var outputCvsFlg = slf.document.getElementById([outputId,
        'Cvs'].join(''));
        if (!outputCvsFlg) {
          var outputDiv = f('div', outputId, 'tgtCvsAreaDiv');
          var outputCvs = f('canvas', [
            outputId,
            'Cvs'
          ].join(''), outputId);
          var outputCvs_B1 = f('button', 'outputCvsB', outputId);
          outputCvs_B1.innerHTML = 'Save the color section as png';
          outputCvs_B1.addEventListener('click', function () {
            saveCanvas_png(outputCvs.id);
          }, true);
          var outputCvs_B2 = f('button', 'scaleB', outputId);
          outputCvs_B2.innerHTML = 'Add 1/10 scale onto the color section';
          outputCvs_B2.addEventListener('click', function () {
            var outputCtx = outputCvs.getContext('2d');
            outputCtx.fillStyle = 'rgba(0,0,0,1)';
            var scaleH = xywh[3]/10;
            var scaleW = w0 * 0.2;
            outputCtx.fillRect(w0 * 2.6, xywh[3] - scaleH, scaleW, scaleH);
            //to save used parameters to the global parameter.
            _prm.scaleBar = {
              width: scaleW,
              height: scaleH,
              info: 'unit is pixel.'
            };
          }, true);
        }
        var cvsOutput = slf.document.getElementById([outputId,
        'Cvs'].join(''));
        var outputCtx = cvsOutput.getContext('2d');
        outputCtx.clearRect(0, 0, cvsOutput.width, cvsOutput.height);
        cvsOutput.setAttribute('width', w0 * 3);
        cvsOutput.setAttribute('height', xywh[3]);
        //it creates a columnar section.
        getColumnarSection([outputId,
        'Cvs'].join(''), 0, 0, w0, d);
        //to save used parameters to the global parameter.
        //d=[[width,height], ..., [width,height]];
        _prm.sectionData = d;
      }, true);
      //if error in worker
      wk.addEventListener('error', function (e) {
        console.log(e.message);
      }, true);
      wk.postMessage(crrntImg);
      crrntImg = null;
      //===</worker>===
    } else {
      slf.window.alert('Target area is undefined.');
    }
  }, true);
  //=== removal of additional canvas tag. ===
  var rmSupCvsB = f('button', 'rmSupCanvas_B', 'tgtCvsAreaDiv');
  rmSupCvsB.innerHTML = 'Remove an additional layer';
  rmSupCvsB.addEventListener('click', function () {
    var supCvsFlg = slf.document.getElementById('supCanVas');
    if (!!supCvsFlg) {
      var tgtDiv = slf.document.getElementById('Cvs');
      var tagRemoved = tgtDiv.removeChild(supCvs);
      tagRemoved = null;
    }
  }, true);
  //============================================================================
  //=== function that draws a columnar section on target canvas tag. ===
  function getColumnarSection(CanvasId, x0, y0, w0, DATA) {
    //DATA=[[width,height], ..., [width,height]];
    //width is relative value to max. value.
    var X = x0;
    var Y = y0;
    var targetCanvas = document.getElementById(CanvasId);
    var ctx = targetCanvas.getContext('2d');
    for (var i = 0; i < DATA.length; i += 1) {
      ctx.fillStyle = [
        'rgba(',
        Math.floor(DATA[i][0] * 255),
        ',0,',
        255 - Math.floor(DATA[i][0] * 255),
        ',1)'
      ].join('');
      var W = w0 * (1 + DATA[i][0]);
      var H = + DATA[i][1];
      ctx.fillRect(X, Y, W, H);
      Y += H;
    }
    return [X,
    Y];
  };
//============================================================================
}());
//============================================================================
//Copyright (C) 2015 Yuji SODE
//Version: 1.0
//This is free. You can redistribute and/or modify it. 
