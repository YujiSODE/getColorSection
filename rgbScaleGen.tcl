#getColorSection
#rgbScaleGen.tcl
##===================================================================
#	Copyright (c) 2019 Yuji SODE <yuji.sode@gmail.com>
#
#	This software is released under the MIT License.
#	See LICENSE or http://opensource.org/licenses/mit-license.php
##===================================================================
#Hexadecimal RGB color scale generator
#=== Synopsis ===
#	`rgbScaleGen valuesList;`
#
#it returns RGB color scale in hexadecimals using given `$valuesList`.
#returned value has a form of JavaScript array literals.
#=== Parameter ===
# - `$valuesList`: a list of values between 0.0 and 1.0
##===================================================================
#Hexadecimal RGB color scale generator
#returned value has a form of JavaScript array literals.
proc rgbScaleGen {valuesList} {
	# - $valuesList: a list of values between 0.0 and 1.0
	set i 0;set v 0;
	#RGB color
	set R 0;set G 0;set B 0;set rgb {};
	set N [llength $valuesList];
	while {$i<$N} {
		set v [expr {abs([lindex $valuesList $i])}];
		set v [expr {$v>1?1:$v}];
		set R [expr {int(floor($v*255.0))}];
		set B [expr {int(floor((1.0-$v)*255.0))}];
		set G [expr {255-abs($R-$B)}];
		lappend rgb [format {"#%02x%02x%02x"} $R $G $B];
		incr i 1;
	};
	return "\[[join $rgb ,]\]";
};
