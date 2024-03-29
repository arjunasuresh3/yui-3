// Create a new YUI instance and populate it with the required modules.
YUI().use('node', 'model', 'model-list', 'view', 'handlebars', 'datatable', function (Y) {

              var listing_source   = Y.one('#list-pies').getHTML(),
              listingtemplate = Y.Handlebars.compile(listing_source);
              
              // Create a new Y.PieModel class that extends Y.Model.
              Y.PieModel = Y.Base.create('pieModel', Y.Model, [], {
                                             // Add prototype methods for your Model here if desired. These methods will be
                                             // available to all instances of your Model.

                                             // Returns true if all the slices of the pie have been eaten.
                                             allGone: function () {
                                                 return this.get('slices') === 0;
                                             },

                                             // Consumes a slice of pie, or fires an `error` event if there are no slices
                                             // left.
                                             eatSlice: function () {
                                                 if (this.allGone()) {
                                                     this.fire('error', {
                                                                   type : 'eat',
                                                                   error: "Oh snap! There isn't any pie left."
                                                               });
                                                 } else {
                                                     this.set('slices', this.get('slices') - 1);
                                                     Y.log('You just ate a slice of delicious ' + this.get('type') + ' pie!');
                                                 }
                                             },
                                             _sliceSetter: function (value) {
                                                 return parseInt(value,10);
                                             }
                                         }, {
                                             ATTRS: {
                                                 // Add custom model attributes here. These attributes will contain your
                                                 // model's data. See the docs for Y.Attribute to learn more about defining
                                                 // attributes.

                                                 slices: {
                                                     value: 6, // default value
                                                     // setter: "_sliceSetter"
                                                     validator: function (value) {
                                                         var ret_val = typeof value === 'number' && value >= 0 && value <= 10;
                                                         if (!ret_val) {
                                                             this.fire('error', {
                                                                           type : 'eat',
                                                                           error: "Oh snap! Enter no ranging from 1 to 10."
                                                                       });
                                                         }
                                                         return ret_val;
                                                     }
                                                 },

                                                 type: {
                                                     value: 'apple'
                                                 }
                                             }
                                         });

              Y.PieList = Y.Base.create('pieList', Y.ModelList, [], {
                                            // Add prototype properties and methods for your List here if desired. These
                                            // will be available to all instances of your List.

                                            // Specifies that this list is meant to contain instances of Y.PieModel.
                                            model: Y.PieModel,

                                            // Returns an array of PieModel instances that have been eaten.
                                            eaten: function () {
                                                return Y.Array.filter(this.toArray(), function (model) {
                                                                          return model.get('slices') === 0;
                                                                      });
                                            },

                                            // Returns the total number of pie slices remaining among all the pies in
                                            // the list.
                                            totalSlices: function () {
                                                var slices = 0;

                                                this.each(function (model) {
                                                              slices += model.get('slices');
                                                          });

                                                return slices;
                                            }
                                        });

              // Create a new Y.PieView class that extends Y.View and renders the current
              // state of a Y.PieModel instance.
              Y.PieListView = Y.Base.create('pieViewList', Y.View, [], {
                                                // Add prototype methods and properties for your View here if desired. These
                                                // will be available to all instances of your View. You may also override
                                                // existing default methods and properties of Y.View.

                                                // Specify delegated DOM events to attach to the container.
                                                events: {
                                                    '.eat': {click: 'eatSlice'},
                                                    '.addpies': {click: 'addSlice'}
                                                },
                                                
                                                // Provide a template that will be used to render the view. The template can
                                                // be anything we want, but in this case we'll use a string that will be
                                                // processed with Y.Lang.sub().
                                                template: listingtemplate,

                                                // The initializer function will run when a view is instantiated. This is a
                                                // good time to subscribe to change events on a model instance.
                                                initializer: function () {
                                                    
                                                    var modelList = this.get('model');

                                                    // Re-render this view when a model is added to or removed from the model
                                                    // list.
                                                    // modelList.after(['add', 'remove', 'reset'], this.render, this);
                                                    
                                                    modelList.after('*:change', this.render, this);
                                                    modelList.after('*:destroy', this.render, this);
                                                    modelList.after('*:error', function(args){
                                                                        Y.log(args);
                                                                    }, this);
                                                },

                                                // The render function is responsible for rendering the view to the page. It
                                                // will be called whenever the model changes.
                                                render: function () {
                                                    var container = this.get('container'),
                                                    html = this.template({items:this.get('model').toJSON()});
                                                    // Render this view's HTML into the container element.
                                                    container.setHTML(html);

                                                    return this;
                                                },

                                                // The eatSlice function will handle click events on this view's "Eat a Slice"
                                                // button.
                                                eatSlice: function (e) {
                                                    // Call the pie model's eatSlice() function. This will consume a slice of
                                                    // pie (if there are any left) and update the model, thus causing the view
                                                    // to re-render to reflect the new model data.
                                                    var pietype = e.target.getAttribute('pietype'), model;
                                                    this.get('model').some(function(m){
                                                                               model = m;
                                                                               return m.get('type') === pietype;
                                                                           });
                                                    model.eatSlice();
                                                },

                                                // The eatSlice function will handle click events on this view's "Eat a Slice"
                                                // button.
                                                addSlice: function (e) {
                                                    // Call the pie model's eatSlice() function. This will consume a slice of
                                                    // pie (if there are any left) and update the model, thus causing the view
                                                    // to re-render to reflect the new model data.
                                                    var pietype = e.target.getAttribute('pietype'), model;
                                                    this.get('model').some(function(m){
                                                                               model = m;
                                                                               return m.get('type') === pietype;
                                                                           });
                                                    model.set('slices', parseInt(model.get('slices')) + parseInt(e.target.previous().get('value')));
                                                }

                                            });

              var mypies = new Y.PieList(),
              myView = new Y.PieListView({model: mypies, container:'#pieslisting'});

              // Add a single model to the list.
              mypies.add({type: 'pecan'});
              
              // Add multiple models to the list.
              mypies.add([
                             {type: 'apple'},
                             {type: 'maple custard'}
                         ]);
              
              // Save a model, then add it to the list.
              mypies.create({type: 'pumpkin'});
              myView.render();

              var table = new Y.DataTable({
                                              columns: ['type','slices'],
                                              data: mypies
                                          });
              
              table.render('#pies');
              
              Y.later(1000,this,function(pies){
                          pies.remove(1);                          
                      },mypies,false);

              Y.later(3000,this,function(pies){
                          pies.add({type: 'cranberries'});
                      },mypies,false);

          });
