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
					output: "integer",
					delay: 250,
					selector: ".progresso",
					onProgress: function(progress) { console.log(progress); },
					onComplete: function() {},
				};

		// --------------------------------------------------
		// CONSTRUCTOR
		// --------------------------------------------------
		function Progresso ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this.progress = 0;
			this.totalSize = 0;
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
				$(this.element).addClass(pluginName + '-loading');
				this.getAssets();
			},

			// ---------------------- Update load progress
			updateProgress: function(asset, callback) {
				var _this = this;

				setTimeout(function() {
					var relativeSize = asset.size / _this.totalSize;
					if(_this.settings.output === 'percent') {
						relativeSize = relativeSize * 100;
					}

					_this.progress += relativeSize;
					_this.settings.onProgress(_this.progress);

					typeof callback === 'function' && callback();
				}, _this.settings.delay);
			},

			// ---------------------- Return all assets
			getAssets: function() {
				var _this = this,
						xhrRequests = [],
						assetEls = document.querySelectorAll(_this.settings.selector);

				// AJAX REQUEST FILE SIZE
				function getFileSize(url, assetObj, callback) {
					var xhr = $.ajax({
					  type: "HEAD",
					  url: url,
					  success: function() {
					    callback(assetObj, parseInt(xhr.getResponseHeader("Content-Length")));
					  },
					  error: function() {
					  	console.log('ERROR: request failed to ' + url);
					  }
					});

					xhrRequests.push(xhr);
				}

				// BUILD ASSET ARRAY
				for(var i = 0; i < assetEls.length; i++) {
					var cssImg = false,
							url = assetEls[i].getAttribute("data-src");

					// check for background images
					if (assetEls[i].getAttribute("data-src-css")) {
						cssImg = true;
						url = assetEls[i].getAttribute("data-src-css");
					}

					// start building asset object
					var assetObj = {
						el: assetEls[i],
						cssImg: cssImg,
						url: url
					}

					// get size and push to asset object to assets
					getFileSize(url, assetObj, function(obj, size) {
						obj.size = size;
						_this.totalSize += size;
						_this.assets.push(obj);
					});
				}

				// PROMISES - LOAD ASSETS WHEN XHR COMPLETE
				$.when.apply($, xhrRequests).then(function() {
					_this.loadAssets();
				}, function() {
					_this.loadAssets();
				});
			},

			// ---------------------- Preload all assets
			loadAssets: function() {
				var _this = this,
						assets = _this.assets,
						i = 0;

				// AJAX LOAD ASSET
				function ajaxCall() {
					if (i < assets.length) {
						var asset = assets[i],
								elType = asset.el.tagName;

						// // preload image source
						// if (elType === 'IMG') {
						// 	var tag = new Image();
						// 	$(tag).load(function(e) {
						// 		_this.updateProgress(asset, ajaxCall);
						// 		$(asset).removeAttr('data-src').css('background-image', 'url(' + asset.url + ')');
						// 		i++;
						// 	}).attr('src', asset.url);
						// }
						//
						// // preload video source
						// if (elType === 'SOURCE') {
						// 	tag = new Image();
						// }
						//
						// // preload audio source
						// if (elType === 'AUDIO') {
						// }
						//
						// // preload css background-image
						// if (asset.cssImg) {
						// 	var tag = new Image();
						// 	$(tag).load(function(e) {
						// 		_this.updateProgress(asset, ajaxCall);
						// 		$(asset).removeAttr('data-src').css('background-image', 'url(' + asset.url + ')');
						// 		i++;
						// 	}).attr('src', asset.url);
						// }

						$.ajax(asset.url, {
							success: function(data) {
								console.log(data);
								console.log('hello');
								// _this.updateProgress(asset, ajaxCall);
								// i++;
							},
							error: function() {
								console.log('error');
							}
						})
					} else if (i === assets.length) {
						_this.loadComplete();
					}
				}

				// INIT ASYNC LOOP
				ajaxCall();
			},

			// ---------------------- Load complete
			loadComplete: function() {
				$(this.element).removeClass(pluginName + '-loading');
				this.settings.onComplete();
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
