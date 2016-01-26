/**
 * Designertools is a pretty basic tool palette which can be inserted in every
 * web page to quickly try out different basic styles like font-size, color etc.
 * It is not limited, of course you can just go ahead and extend the toolset…
 * Also hidden by default, triggered by your key-to-go.
 *
 * @copyright Jakob Ploens 2016
 * @author    Jakob Ploens <jakob@2helden.com>
 * @license   The MIT license
 */

var Designertools = function(settings){

    var self = this;

    /**
     * Define default settings we go for.
     *
     * @param integer Keycode which toggles the tools. Defaults to 18, alt-key
     * @param string  Selector which should be changed. Defaults to 'body'
     * @param object  Toolset. Keys refer to this.tools[key];
     * @param object  Toolset to use. Have a look at default toolset to
     *                customize or extend things. Only change if you want to
     *                change the default behaviour; for extensions, use
     *                Designertools.prototype.toolset[key] = function(){}
     * @param string  Title to display in the designertools' box
     */
    this.defaults = {
        key:      18,
        selector: 'body',
        tools: {
            fontSize: {
                type: 'size',
                label: 'Change font size'
            },
            color: {
                type: 'color',
                label: 'Change text color'
            },
            backgroundColor: {
                type: 'color',
                label: 'Change background color'
            },
        },
        toolset: this.toolset,
        title: 'Designertools'
    };

    /**
     * Get options.
     */
    this.options = merge(this.defaults, settings);

    /**
     * Get elements.
     */
    this.element = null;
    this.selector = document.querySelector(this.defaults.selector);

    /**
     * Base tool. Everything which happens here will be called by the other elements.
     *
     * @param string Label
     * @param string Key to be changed
     * @param boolean If set to true, will not attach event handler. Defaults to false.
     */
    this.basefield = function(label, key, customBinding){
        this.element = document.createElement('div');
        this.key     = key;
        this.value   = getStyle(self.selector, key);

        this.title = document.createElement('b');
        this.title.style.display = 'block';
        this.title.innerHTML = label;
        this.element.appendChild(this.title);

        this.input = document.createElement('div');
        this.input.style.display = 'inline-block';
        this.input.setAttribute('contenteditable', 'true');
        this.input.textContent = this.value;

        /**
         * Create event listener for input
         */
        if(!customBinding){
            this.input.addEventListener('input', function(){
                var value = this.textContent;
                self.selector.style[key] = value;
            }, false);
        }

        this.element.appendChild(this.input);
    };

    /**
     * Default toolset.
     */
    this.toolset = {
        /**
         * size
         * Used for all sizes.
         */
        size: function(settings){
            var defaults = {
                unit: 'em',
                min:  0.5,
                max:  5,
                step: 0.1,
            };

            var element = new self.basefield(settings.label, settings.key, true);
            element.options = merge(defaults, settings);

            if(element.options.unit !== 'px'){
                if(element.options.unit === 'em' || element.options.unit === 'rem'){
                    element.value = 1;
                } else if(element.options.unit === '%'){
                    element.value = parseInt(element.value);
                }
            } else {
                element.value = parseInt(element.value);
            }
            element.input.textContent = element.value;

            /**
             * Add suffix
             */
            element.element.appendChild(document.createTextNode(element.options.unit));

            /**
             * Add additional range slider to size fields.
             */
            var rangeWrap = document.createElement('div');
            element.range = document.createElement('input');
            element.range.style.width = '100%';
            element.range.setAttribute('type', 'range');
            element.range.setAttribute('min',  element.options.min);
            element.range.setAttribute('max',  element.options.max);
            element.range.setAttribute('step', element.options.step);
            element.range.value = element.value;

            rangeWrap.appendChild(element.range);
            element.element.appendChild(rangeWrap);

            /**
             * Append custom event listener.
             */
            element.input.addEventListener('input', function(){
                var value = this.textContent;
                self.selector.style[settings.key] = value + element.options.unit;
                element.range.value = value;
            }, false);

            element.range.addEventListener('input', function(){
                var value = this.value;
                self.selector.style[settings.key] = value + element.options.unit;
                element.input.textContent = value;
            }, false);

            return element;
        },
        color: function(settings){
            var element = new self.basefield(settings.label, settings.key);
            return element;
        }
    };


    /**
     * Initializes Designertools.
     * @return Designertools obj
     */
    this.init = function(){

        /**
         * Create element and append styles
         */
        self.element = document.createElement('div');
        self.element.style.position        = 'fixed';
        self.element.style.right           = 0;
        self.element.style.bottom          = 0;
        self.element.style.zIndex          = 10000000;
        self.element.style.backgroundColor = 'rgba(255,255,255,0.95)';
        self.element.style.color           = '#111';
        self.element.style.padding         = '1.5rem 2rem';
        self.element.style.fontSize        = '1rem';
        self.element.style.display         = 'none';

        var title = document.createElement('h1');
        title.style.fontSize     = '1.25em';
        title.style.fontWeight   = 'bold';
        title.style.marginBottom = '2em';
        title.style.borderBottom = '2px solid #ccc';
        title.innerHTML = self.options.title;
        self.element.appendChild(title);

        /**
         * Loop through defined tools and append them.
         */
        var toolElement, toolObj, toolField, toolOptions, customOptions;
        for(var tool in self.options.tools){
            /**
             * Get tool object from options and create wrapping element.
             */
            toolObj     = self.options.tools[tool];
            toolElement = document.createElement('div');
            toolElement.style.marginTop = '2em';

            /**
             * Create field options object by options and defined label.
             */
            customOptions = toolObj.options || {};
            defaultOptions = {
                label: toolObj.label,
                key:   tool
            }
            toolOptions = merge(customOptions, defaultOptions);

            /**
             * Get tool's field.
             */
            toolField = self.toolset[toolObj.type](toolOptions);

            toolElement.appendChild(toolField.element);
            self.element.appendChild(toolElement);
        }

        /**
         * Trigger toggle by keydown.
         */
        document.addEventListener('keydown', function(e){
            if(e.keyCode === self.options.key){
                if(self.element.style.display === 'none'){
                    self.element.style.display = 'block';
                } else {
                    self.element.style.display = 'none';
                }
            }
        });

        /**
         * Append to body
         */
        document.body.appendChild(self.element);

        /**
         * Return self.
         */
        return self;
    };


    /**
     * Initialize Designertools.
     */
    return this.init();
};

/**
 * Short function to merge two objects.
 *
 * @param  object (gets overwritten)
 * @param  object (overwrites)
 * @return object (merged)
 */
function merge(objectA, objectB){
    var result = {};
    for(var attr in objectA){
        result[attr] = objectA[attr];
    }
    for(var attr in objectB){
        result[attr] = objectB[attr];
    }
    return result;
}


/**
 * Get Style styleProp of el
 *
 * @see http://stackoverflow.com/questions/6338217/get-a-css-value-with-javascript
 */
function getStyle(el, styleProp) {
  var value, defaultView = (el.ownerDocument || document).defaultView;
  // W3C standard way:
  if (defaultView && defaultView.getComputedStyle) {
    // sanitize property name to css notation
    // (hypen separated words eg. font-Size)
    styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
  } else if (el.currentStyle) { // IE
    // sanitize property name to camelCase
    styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
      return letter.toUpperCase();
    });
    value = el.currentStyle[styleProp];
    // convert other units to pixels on IE
    if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
      return (function(value) {
        var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
        el.runtimeStyle.left = el.currentStyle.left;
        el.style.left = value || 0;
        value = el.style.pixelLeft + "px";
        el.style.left = oldLeft;
        el.runtimeStyle.left = oldRsLeft;
        return value;
      })(value);
    }
    return value;
  }
}




/**
 * Directly run designertools.
 */
new Designertools();