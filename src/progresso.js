;(function ( $, window, document, undefined ) {

	"use strict";

		// --------------------------------------------------
		// DEFAULTS
		// --------------------------------------------------
		var pluginName = "progresso",
			defaults = {
				output: "integer"
			};

		// --------------------------------------------------
		// CONSTRUCTOR
		// --------------------------------------------------
		function Progresso ( options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this.progress = 0;
			this.assets = [];
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// --------------------------------------------------
		// EXTEND PROTOTYPE
		// --------------------------------------------------	
		$.extend(Progresso.prototype, {
			init: function () {
				getAssets();
			},
			getAssets: function() {
				$element.find('*:not(script)').each(function() {
					var url = "";
					if ($(this).css('background-image').indexOf('none') == -1 && $(this).css('background-image').indexOf('linear-gradient') == -1) {

						url = $(this).css('background-image');
						if(url.indexOf('url') != -1) {
							var temp = url.match(/url\((.*?)\)/);
							url = temp[1].replace(/\"/g, '');
						}
					
					} else 
					if($(this).get(0).nodeName.toLowerCase() == 'img' && typeof($(this).attr('src')) != 'undefined') {
						url = $(this).attr('src');
					}
					
					if (url.length > 0) {
						items.push(url);
					}

				});

				return items;
			}
		});

		// --------------------------------------------------
		// PLUGIN WRAPPER
		// --------------------------------------------------
		$.fn[ pluginName ] = function ( options ) {
			return this.each(function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" + pluginName, new Progresso( this, options ) );
				}
			});
		};

})( jQuery, window, document );
