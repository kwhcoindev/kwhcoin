(function(funcName, baseObj) {
    "use strict";
    // The public function name defaults to window.docReady
    // but you can modify the last line of this function to pass in a different object or method name
    // if you want to put them in a different namespace and those will be used instead of 
    // window.docReady(...)
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;
    
    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }
    
    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }
    
    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        // IE only safe when readyState is "complete", others safe when readyState is "interactive"
        if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);
// modify this previous line to pass in your own method name 
// and object for the method to be attached to

(function(){
    "use strict";

	// add event cross browser
	function addEvent(elem, event, fn) {
	    // avoid memory overhead of new anonymous functions for every event handler that's installed
	    // by using local functions
	    function listenHandler(e) {
	        var ret = fn.apply(this, arguments);
	        if (ret === false) {
	            e.stopPropagation();
	            e.preventDefault();
	        }
	        return(ret);
	    }

	    function attachHandler() {
	        // set the this pointer same as addEventListener when fn is called
	        // and make sure the event is passed to the fn also so that works the same too
	        var ret = fn.call(elem, window.event);   
	        if (ret === false) {
	            window.event.returnValue = false;
	            window.event.cancelBubble = true;
	        }
	        return(ret);
	    }

	    if (elem.addEventListener) {
	        elem.addEventListener(event, listenHandler, false);
	        return {elem: elem, handler: listenHandler, event: event};
	    } else {
	        elem.attachEvent("on" + event, attachHandler);
	        return {elem: elem, handler: attachHandler, event: event};
	    }
	}

	function removeEvent(token) {
	    if (token.elem.removeEventListener) {
	        token.elem.removeEventListener(token.event, token.handler);
	    } else {
	        token.elem.detachEvent("on" + token.event, token.handler);
	    }
	}

	function ajax(url, callback, data, x) {
		try {
			x = new(window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
			x.open(data ? 'POST' : 'GET', url, 1);
			x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			x.setRequestHeader('Content-type', 'application/json');
			x.onreadystatechange = function () {
				x.readyState > 3 && callback && callback(x.responseText, x);
			};
			x.send(data)
		} catch (e) {
			window.console && console.log(e);
		}
	};


	function ICOCoinWidget(options){
		var self = this;
		if(options.element.getAttribute('data-initialized')){
			self = null;
			options = null;
			return;
		}
		options.element.setAttribute('data-initialized','true');

		this._options = options;

		this._options.attrs = {};
		this._options.attrs["ticker"] = this._options.element.getAttribute('data-ticker');
		this._options.attrs["devenv"] = this._options.element.getAttribute('data-env');
		
		if( this._options.attrs["ticker"] ){

			addEvent(this._options.element, 'destroy', function(){
				removeEvent({elem: self._options.element});
				self._options = null;
			});
			var server = "https://api.kwhcoin.com/";

			ajax(server + 'service/ico-data.php?ticker='+ this._options.attrs["ticker"], function(respText){

				var resp = JSON.parse(respText);
				if(resp.data && resp.data.length > 0){
					var coin = resp.data[0]||{};
					var container = '<div class="cmw-widget-container" style="background-color: #f6f6e8;color: #518D4B; -webkit-box-shadow: 0 1px 4px #999; box-shadow: 0 1px 4px #999; border-radius: 10px; font-size:1em; line-height:1.7em; overflow: hidden;">';

					var header = '<div class="" style="font-size: 1.3em; line-height:1.5em; padding: 10px 20px; font-weight: 600; border-bottom: 1px solid #d5d5d5; color: #fff; text-align:center;background-color: #518d4b;"><img style="height:30px;margin-right:7px;" src="/assets/images/icons/cropped-favicon-32x32.png" />KWHCoin (KWH)</div>';

					var platform = '<div class="cmw-coin-platform" style="float:left;width:60%; text-align:center; padding: 15px; border-right: 1px solid #d5d5d5; margin-right:-1px; line-height:18px;">Ethereum Raised <br /><small class="">(In Pre-sale)</small></div>';

					var count = '<div class="cmw-coin-platform" style="font-size:1.8em;float:left;width:40%; text-align:center; padding: 15px;">1162</div>';

					//var footer = '<div class="" style="text-align:center; border-top: 1px solid #d5d5d5; font-family:verdana; font-style: italic; font-size: 11px; padding: 1px 15px;"><a href="'+ server +'">Powered by www.coinmarketwatch.com</a></div>';

					var html = container + header + platform + count + '<div style="clear: both"></div>'+'</div>';

					self._options.element.innerHTML = html;
				}
			}, {});
		}
	}

	docReady(function(){
		var elements = document.getElementsByClassName("cmw-widget-icocoin");

		for(var i=0; i < elements.length; i++){
			new ICOCoinWidget({element: elements[i]});
		}		
	});


})();