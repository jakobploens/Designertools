# Designertools

A pretty basic tool palette which can be inserted in every web page to quickly try out different basic styles like font-size, color etc.
Highly extensible.

### Moral License / Support me

You can buy a moral license and support me with buying me a cup of coffee via [PayPal](https://www.paypal.me/jakobploens/3,50).

### Demo

View Demo on CodePen: [https://codepen.io/jakobploens/full/VeXQKa](https://codepen.io/jakobploens/full/VeXQKa)

### Installation

Just copy the designertools.js file and add it to your page – press alt key and you are ready to go!

### Customize

You can customize the tool palette by appending your own settings to the plugin. Make sure to either delete the last command `new Designertools()` in the source file and call the function in your own javascript files, or just add your desired options to the source file.

Options have to be assigned as an object to the function directly: `new Designertools({ optionKey: optionValue })`

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `key` | integer | 18 | The trigger key to call the tool palette. Default is the alt-key. |
| `selector` | string | 'body' | Selector where the styles will be appended. |
| `tools` | object | {…} | The available tools. Have a look further down for default and customization. |
| `toolset` | object | {…} | As tools, see below. |
| `title` | string | 'Designertools' | Title of the palette. |

### Define available tools

You can define which tools should be available (read: which styles can be changed) by passing the `tools`-object when constructing a new class. Tools are basically defined in the toolset (see below for further information), and you can just short-call them the following way (default tools):

```javascript
new Designertools({
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
        }
    }
});
```

Let's have a deeper look at the single elements.

```javascript
fontSize: {
    type: 'size',
    label: 'Change font size',
    options: {
    }
},
```

`fontSize` describes the attribute which will be styled. Styling is applied by `element.style.fontSize = value;`, so be careful here. (For those unfamiliar with this: basically, it's camelcase instead dividing the css attribute by hyphen, `backgroundColor` instead of `background-color` etc.).

`type` defines the type of the field/tool. Have a look at the detailed view on this topic further down. Required!

`label` describes the label above the field. Required!

`options` holds separate options for the tool, if available and necessary. Take a look at the certain tool which options are available. Optional.

For example, the `size` field can have a unit, minimum and maximum values as option.


### Available tools

By default, the following tools (called with `type: 'toolname'`, see avobe) are available. All tools come with the label and a contenteditable div input.

`size`
Default options:
```
unit: 'em'
min:  0.5
max:  5
step: 0.1
```

The size field has additionally a range input slider below the input. Therefore the min/max/step values are used.

`color`
*No options available.*

The color field comes with a color picker.

### Extend toolset

If you want to extend the toolset, have a look at the base definitions of `size` and `color`. The toolset has to follow this syntax:

```javascript
var toolset = {

    // Your field name which will be called later
    field: function(settings){
        // Default values. Optional (if not neccessary, remove also the merging part right after extending the base field)
        var defaults = {
            unit: 'em',
            min:  0.5,
            max:  5,
            step: 0.1,
        };

        // This line is required – make sure to always extend the base field!
        var field = new Designertools.basefield(settings.label, settings.key, true);
        field.options = merge(defaults, settings);

        // Return field.
        return field;
    }
};
```

If you want to add more elements, do this after extending the base field. Elements should be appending like this:

```javascript
var field = new Designertools.basefield(settings.label, settings.key, true);

// Create element
var range = document.createElement('input');

// Add styles and attributes
field.range.style.width = '100%';
field.range.setAttribute('type', 'range');

// Set value – value is readout by the basefield
field.range.value = element.value;

// Append to element
field.element.appendChild(field.range);

return field;
```

Your toolset can be used by passing the object through the settings:

```javascript
var myToolset = {
    field: function(settings){
        // your field
    }
};
new Designertools({
    toolset: myToolset
});
```