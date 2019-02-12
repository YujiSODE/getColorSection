/*getColorSection
* colorScale.js
*===================================================================
*	Copyright (c) 2019 Yuji SODE <yuji.sode@gmail.com>
*
*	This software is released under the MIT License.
*	See LICENSE or http://opensource.org/licenses/mit-license.php
*===================================================================
* Tool that draws RGB color scale on given canvas
*=== Synopsis ===
*	`ColorScale(Canvas?,Width?);`
*
* - `Canvas`: target canvas element to draw color scale
* - `Width`: new width value for given canvas element wiith default value of 330
*/
//===================================================================
//Tool that draws RGB color scale on given canvas
function colorScale(Canvas,Width){
	// - Canvas: target canvas element to draw color scale
	// - Width: new width value for given canvas element wiith default value of 330
	var slf=window,
		/*W and H: width and Height for canvas*/
		W=!Width?+330:Math.floor(Math.abs(Width)),H=Math.floor(W/3),
		/*rgbScl: result in `rgbScaleGen.tcl`; `rgbScaleGen {1 0.9 0.8 0.7 0.6 0.5 0.4 0.3 0.2 0.1 0};`*/
		/*rgbScl: 11 elements*/
		rgbScl=["#ff0000","#e53319","#cc6532","#b2994c","#99cc66","#7fff7f","#66cc99","#4c99b2","#3366cc","#1933e5","#0000ff"],
		N=rgbScl.length,dX=Math.floor(W/N),dH=Math.floor(H/4),
		sW=W,i=0,
		ctx=Canvas.getContext('2d');
		//resizing canvas
		Canvas.width=W,Canvas.height=H;
		while(i<N){
			ctx.fillStyle=rgbScl[i];
			ctx.fillRect(0,dH,sW,dH*2);
			i+=1;
			sW+=-dX;
		}
	slf=W=N=dX=dH=sW=i=ctx=null;
	return rgbScl;
}
