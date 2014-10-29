/**
 * $.czTextboxtip
 * @extends jquery.1.4.2
 * @fileOverview Make input textbox inner tip
 * @author Lancer He
 * @email lancer.he@gmail.com
 * @site crackedzone.com
 * @version 1.0.1
 * @date 2011-09-11
 * @update 2014-10-29
 * Copyright (c) 2011-2014 Lancer He
 * @example
 *    $("#username").czTextboxtip();
 */

(function($) {

    var czUI = czUI || {}
  
    $.fn.czTextboxtip = function( options ){
      
        var PNAME = 'czTextboxtip';
        var objData = $(this).data(PNAME);
        
        //get instance object
        if (typeof options == 'string' && options == 'instance') {
            return objData;
        }
    
    
        var options = $.extend( {}, czUI.czTextboxtip.defaults, options || {} );
        
        return $(this).each(function (){
        
            var czTextboxtip = new czUI.czTextboxtip( options );
            czTextboxtip.$element = $(this);
            czTextboxtip.init();
            $(this).data( PNAME, czTextboxtip );
        
        });
    }
      
    czUI.czTextboxtip = function( options ) {
        this.NAME    = 'czTextboxtip';
        this.VERSION = '1.0';
        this.options = options;
        this.$element= null;
        this.$wrap   = null;
        this.$tip    = null;
    }
  
    czUI.czTextboxtip.defaults = {
        tipValue     : null,
        tipFontSize  : '12px',
        tipColor     : '#CCC',
        tipFontFamily: 'Arial',
        initCallback : null,
        blurCallback : null,
        focusCallback: null,
        enterCallback: null
    }
  
    czUI.czTextboxtip.prototype = {
      
        init: function() {
            if ( this._isPlaceholderSupport() ) {
                return null;
            }

            var _that = this;
            this._create();
            this.initTip();

            //bind Event;
            this.$tip.bind('click', function() {
                if ( _that.getInputVal() == '' ) {
                    _that.$tip.hide();
                    _that.$element.focus();
                }
                return;
            });

            this.$element.bind('focus', function() {
                _that.focusEvent();
            });

            this.$element.bind('blur', function() {
                _that.blurEvent();
            });

            this.$element.bind('keydown', function(e) {
                if ( e.which == 13 )
                    _that.enterEvent();
            });
            this._callback('init');
        },

        debug : function( $message ) {

            if ( typeof $message == 'undefined') $message = this;

            if (!window.console && window.console.log)
                window.console.log($message);
            else
                alert($message);
            
        },

        _isPlaceholderSupport: function() {  
            return 'placeholder' in document.createElement('input');  
        },

        _create: function() {
            this.$wrap = this.$element.wrap("<div></div>").parent();
            this.$wrap.css('position', 'relative')
                    .css('display', 'inline-block');

            if ( typeof this.$element.attr('placeholder') != 'undefined' )
                this.options.tipValue = this.$element.attr('placeholder');

            this.$tip = this.$element.after("<div></div>").next();
            this.$tip.html( this.options.tipValue ).css({
                'font-size'     : this.options.tipFontSize,
                'font-family'   : this.options.tipFontFamily,
                'color'         : this.options.tipColor,
                'position'      : 'absolute',
                'left'          : this._setAuto('marginLeft') + 'px',
                'top'           : this._setAuto('marginTop') + 'px',
                'padding-left'  : this._setAuto('paddingLeft') + this._setAuto('borderLeftWidth') + 'px',
                'padding-top'   : this._setAuto('paddingTop') + this._setAuto('borderTopWidth') + 'px',
                'padding-right' : this._setAuto('paddingRight') + this._setAuto('borderRightWidth') + 'px',
                'padding-bottom': this._setAuto('paddingBottom') + this._setAuto('borderBottomWidth') + 'px',
                'line-height'   : this.$element.height() + 'px'
            }).width( this.$element.width() )
            .height( this.$element.height() );
        },


        getInputVal : function() {
            return this.$element.val();
        },

        initTip : function() {
            if ( this.getInputVal() == '' ) {
                this.$tip.show();
            } else {
                this.$tip.hide();
            }
        },

        enterEvent: function() {
            this._callback('enter');
        },

        focusEvent: function () {
            this.$tip.hide();
            this._callback('focus');
        },

        blurEvent: function() {
            this.initTip();
            this._callback('blur');
        },

        _setAuto : function( cssOption ) {
            var str = this.$element.css( cssOption );
            return ( str == 'auto' || str == 'medium' ) ? 0 : parseInt( str );
        },

        _callback: function(evt) {
            if( typeof this.options[evt + 'Callback'] != 'function')
                return;

            this.options[evt + 'Callback'].call(this);
        }
    }
})(jQuery);