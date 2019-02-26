/*getColorSection
* getColorSection.js
*===================================================================
*	Copyright (c) 2015-2019 Yuji SODE <yuji.sode@gmail.com>
*
*	This software is released under the MIT License.
*	See LICENSE or http://opensource.org/licenses/mit-license.php
*===================================================================
* Tool that draws a columnar color section by given RGB values of the canvas
*=== Synopsis ===
* `var scan=getColorSection(srcCanvas,[r,g,b]);`
* it returns function to scan target canvas element
*
*	--- Parameters ---
*	- `srcCanvas`: target canvas element to scan
*	- `rgb`: coefficient array (`[r,g,b]`) for a value `rgb(R,G,B)=r*R+g*G+b*B`
*
*--- Returned function ---
* `scan(canvas,x,w,left);`
* it scans `srcCanvas` element and draws a columnar color section on target canvas element
*
*	--- Parameters for Returned function ---
*	- `canvas`: target canvas element to draw color section
*	- `x`: x-coordinate
*	- `w`: width to scan
*	- `left`: an optional boolean value to fix left side coordinates of section when it is true
*
*	--- Property of returned function ---
*	`scan.LOG;`
*	`scan.LOG` is LOG object as follows:
*
*	- `X`: x-coordinate
*	- `width`: width to scan
*	- `rgbC`: coefficient array (`[r,g,b]`) for a value `rgb(R,G,B)=r*R+g*G+b*B`
*	- `log`: scanned values for the columnar color section
*--------------------------------------------------------------------
* This software is modified version of `getColorSection.js` version 1.0 by Yuji SODE
* [Reference]
* - Sode, Y. 2015. getColorSection.js (see `getColorSection_2015.js`)
*/
//===================================================================
//Tool that draws a columnar color section by given rgb values of the canvas tag
function getColorSection(srcCanvas,rgb){
	// - srcCanvas: target canvas element to scan
	// - rgb: coefficient array ([r,g,b]) for a value V=r*R+g*G+b*B
	rgb=rgb.map(e=>Math.abs(e));
	rgb=(rgb[0]+rgb[1]+rgb[2])<1?[+1,+1,+1]:rgb;
	var slf=window;
	//=== function that draws a columnar section on target canvas tag. ===
	var getColumnarSection=function(canvas,x0,y0,w0,DATA,left) {
		// - canvas: target canvas element
		// - x0 and y0: top left coordinates on target canvas
		// - w0: the minimum width
		// - DATA: array of [width, ..., width]
		//   width is relative value to max value
		// - left: an optional boolean value to fix left side coordinates of section when it is true
		var X=x0,Y=y0,ctx=canvas.getContext('2d'),W=0,H=0,R=0,G=0,B=0;
		X=!left?0:X;
		for(var i=0;i<DATA.length;i+=1){
			DATA[i]=!DATA[i]?0:DATA[i];
			R=Math.floor(DATA[i]*255);
			B=Math.floor((1-DATA[i])*255);
			G=255-Math.abs(R-B);
			ctx.fillStyle='rgba('+R+','+G+','+B+',255)';
			W=w0*(1+DATA[i]);
			H=1;
			ctx.fillRect(X,Y,W,H);
			Y+=H;
		}
		return [X,Y];
	};
	//<script for worker>
	var scpt=[
		/*== head part of eventlistener ==*/
		'this.addEventListener(\'message\',',
		/*== dealing with pixel data ==*/
		'function(e){var d=e.data,tgt=d.data,tgtW=d.width,tgtH=d.height,R=[],k=0,subR=0,',
		/*-- total value of max --*/
		'rgbMax=255*('+rgb.join('+')+');',
		'for(var i=0;i<tgtH;i+=1){R[i]=0;subR=0;',
		/*total value of red, green and blue*/
		'for(var j=0;j<tgtW*4;j+=4){subR+='+rgb[0]+'*tgt[k]+'+rgb[1]+'*tgt[k+1]+'+rgb[2]+'*tgt[k+2];k+=4;}',
		/*average values (relative value to max)*/
		'R[i]=subR/(tgtW*rgbMax);}',
		/*== return result ==*/
		'this.postMessage(R);tgt=null;tgtW=null;tgtH=null;R=null;subR=null;k=null;d=null;rgbMax=null;},',
		/*== tail part of eventlistener ==*/
		'true);'
	].join('');
	//</script for worker>
	//returned function to scan
	var scan=function(canvas,x,w,left){
		// - canvas: target canvas element to draw color section
		// - x: x-coordinate
		// - w: width to scan
		// - left: an optional boolean value to fix left side coordinates of section when it is true
		w=w<1?+1:+w;
		x=x<0?0:+x;
		scan.LOG={};
		//<generation of worker>
		var blob=new Blob([scpt],{type:'text/javascript'});
		var objUrl=slf.URL.createObjectURL(blob);
		var wk=new Worker(objUrl);
		slf.URL.revokeObjectURL(objUrl);
		blob=null;
		//</generation of worker>
		wk.addEventListener('message',function(e){
			var d=e.data;
			wk.terminate();
			scan.LOG.X=x;
			scan.LOG.width=w;
			scan.LOG.rgbC=rgb;
			scan.LOG.log=d.join();
			getColumnarSection(canvas,x,0,100,d,left);
		},true);
		//if error in worker
		wk.addEventListener('error', function (e) {
			console.log(e.message);
			wk.terminate();
		}, true);
		wk.postMessage(srcCanvas.getContext('2d').getImageData(x,0,w,srcCanvas.height));
	};
	return scan;
}
