   YUI().use('autocomplete', 'autocomplete-highlighters', function (Y) {
                    Y.on('mycustomevent', function (data) {
                             alert("Looky there!");
                         });

                    Y.one('#ac-input').plug(Y.Plugin.AutoComplete, {
                                                resultHighlighter: 'phraseMatch',
                                                source: ['foo', 'bar', 'baz']
                                            });
                });

// Create a custom class that mixes in the AutoCompleteBase extension.
var MyAutoComplete = Y.Base.create('myAC', Y.Base, [Y.AutoCompleteBase], {
  initializer: function () {
    // The following two function calls allow AutoComplete to attach
    // events to the inputNode and manage the inputNode's browser
    // autocomplete functionality.
    this._bindUIACBase();
    this._syncUIACBase();
  }

  // Custom prototype methods and properties here (optional).

}, {

  // Custom static methods and properties here (optional).

});

// Create a new instance of the custom MyAutoComplete class, with
// an array result source.
var ac = new MyAutoComplete({
  inputNode: '#ac-input',
  source: ['foo', 'bar', 'baz']
});