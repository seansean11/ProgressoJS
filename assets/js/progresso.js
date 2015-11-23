/*
 *  ProgressoJS - v0.1
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
					delay: 250,
					selector: ".js-progresso",
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
					var assetObj,
							assetType,
							asset = assetEls[i],
							url = asset.getAttribute("data-src");


					// check for background images
					if (asset.getAttribute("data-src-css")) {
						assetType = 'image-css';
						url = asset.getAttribute("data-src-css");
					} else

					// check for inline images
					if (asset.tagName === 'IMG') {
						assetType = 'image'
					} else

					// check for videos
					if (asset.tagName === 'VIDEO') {
						assetType = 'video'
					} else

					// check for audio
					if (asset.tagName === 'AUDIO') {
						assetType = 'audio'
					} else

					// check for source files
					if (asset.tagName === 'SOURCE') {
						var parent = asset.parentNode.tagName;
						if(parent === 'VIDEO') assetType = 'video';
						if(parent === 'AUDIO') assetType = 'audio';
						if(parent === 'PICTURE') assetType = 'image';
					}

					// start building asset object
					var assetObj = {
						el: asset,
						type: assetType,
						url: url
					}

					// get size and push to asset object to assets
					getFileSize(url, assetObj, function(obj, size) {
						obj.size = size;
						_this.totalSize += size;
						console.log(obj);
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
						var asset = assets[i];

						// preload image source
						if (asset.type === 'image' || asset.type === 'image-css') {
							var tag = $('<img>');
							tag.on('load', function() {
								_this.updateProgress(asset, function() {
									if(asset.type === 'image-css') {
										$(asset.el).removeAttr('data-src-css')
											.css('background-image', 'url(' + asset.url + ')');
									} else {
										$(asset.el).removeAttr('data-src')
											.attr('src', asset.url);
									}

									i++; ajaxCall();
								});
							}).attr('src', asset.url);

						// preload all other assets
						} else {
							var tag = (asset.type === 'video') ? $('<video>') : $('<audio>');
							tag.on('canplaythrough', function() {
								_this.updateProgress(asset, function() {
									$(asset.el).parent().load();
									$(asset.el).removeAttr('data-src').attr('src', asset.url);
									i++; ajaxCall();
								});
							}).attr('src', asset.url);
						}

					// recursive loop complete
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
