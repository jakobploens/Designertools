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