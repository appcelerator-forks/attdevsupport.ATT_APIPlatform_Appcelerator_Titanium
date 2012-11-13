var attHelper=null;
if( !attHelper)
{
	attHelper = exports;
}
	
else{
	attHelper = {};
}

/***
 * Helper function for executors
 * */
attHelper.prepareExecutor = function(thisRef) {
	"use strict";
	if(thisRef.preparer && !thisRef.prepared) {
		thisRef.preparer();
		thisRef.prepared = true;
	}
};

