/*
 *  ProgressoJS - v0.0.1
 *  A lightweight, accurate jQuery plugin for preloading assets and displaying progress.
 *  http://seanmichael.me
 *
 *  Made by Sean Michael
 *  Under MIT License
 */
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
		function Progresso ( element, options ) {
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

			// ---------------------- Initialize plugin
			init: function () {
				this.getAssets();
			},


			// ---------------------- AJAX request file size
			getFileSize: function(url) {
				var xhr = new XMLHttpRequest();
		    xhr.open("HEAD", url, true);
		    xhr.onreadystatechange = function() {
	        if (this.readyState == this.DONE) {
	          return parseInt(xhr.getResponseHeader("Content-Length"));
	        }
		    };
		    xhr.send();
			},

			// ---------------------- Return all assets
			getAssets: function() {
				var _this = this,
						bgImages = [],
						inlineImages = [],
						videos = [],
						audio = [];

				// CSS IMAGES
				$(this.element).find('*:not(script)').each(function() {
					var bgImage = $(this).css('background-image');

					// Make sure it's not a linear-gradient or any other non-image
					if (bgImage.indexOf('none') === -1 && bgImage.indexOf('url') > -1) {
						var tempUrl = bgImage.match(/url\((.*?)\)/);
						var imgObj = {
							type: 'image', 
							url: tempUrl[1].replace(/\"/g, '')
						};
						// var test = _this.getFileSize(imgObj.url);
						// console.log(test);
						bgImages.push(imgObj);
					}
				});

				// INLINE IMAGES
				var inlineImages = document.images;
				for(var i = 0; inlineImages.length > 0; i++) {
					var imgObj = {
						type: 'image',
						url: tempUrl[1].replace(/\"/g, '')
					};
				}

				// VIDEOS

				// AUDIO

				// SET PROGRESSO ASSETS
				this.assets = this.assets.concat(bgImages, inlineImages, videos, audio);
				console.log(this.assets);
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
