/*
 *  jquery-boilerplate - v3.5.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

	"use strict";

		// --------------------------------------------------
		// DEFAULTS
		// --------------------------------------------------
		var pluginName = "progresso",
			defaults = {
				propertyName: "value"
			};

		// --------------------------------------------------
		// CONSTRUCTOR
		// --------------------------------------------------
		function Progresso ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// --------------------------------------------------
		// EXTEND PROTOTYPE
		// --------------------------------------------------	
		$.extend(Progresso.prototype, {
			init: function () {
				this.yourOtherFunction(this.element, this.settings);
			},
			yourOtherFunction: function () {
				// some logic
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
