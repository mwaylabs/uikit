/**
 * Created by zarges on 16/02/16.
 */
describe('mwBackbone nested models', function () {

  var NestedModel = window.mwUI.Backbone.NestedModel;

  describe('nested model as attribute', function () {
    var NestedModelAttr, ModelWithNestedModel;
    beforeEach(function () {
      NestedModelAttr = window.Backbone.Model.extend({
        defaults: {
          name: 'Nested Model Attr'
        }
      });
      ModelWithNestedModel = NestedModel.extend({
        url: 'withNestedModel',
        nested: function () {
          return {
            nestedModelAttr: NestedModelAttr
          };
        }
      });
    });

    it('initializes a model with a nested model as attribute', function () {
      var modelWithNestedModel = new ModelWithNestedModel();

      expect(modelWithNestedModel.get('nestedModelAttr') instanceof NestedModelAttr).toBeTruthy();
    });

    it('initializes a model with a nested model as attribute and default options', function () {
      var modelWithNestedModel = new (ModelWithNestedModel.extend({
        defaults: function () {
          return {
            name: 'Test'
          };
        }
      }))();

      expect(modelWithNestedModel.get('nestedModelAttr') instanceof NestedModelAttr).toBeTruthy();
    });

    it('initializes a model with a nested model when attributes are passed into constructor', function () {
      var modelWithNestedModel = new ModelWithNestedModel({
        name: 'Test',
        nestedModelAttr: {
          name: 'Test'
        }
      });

      expect(modelWithNestedModel.get('nestedModelAttr') instanceof NestedModelAttr).toBeTruthy();
    });

  });

  describe('nested collection as attribute', function () {
    var NestedCollectionAttr, ModelWithNestedCollection;
    beforeEach(function () {
      NestedCollectionAttr = window.Backbone.Collection.extend({});
      ModelWithNestedCollection = NestedModel.extend({
        url: 'withNestedCollection',
        nested: function () {
          return {
            nestedCollectionAttr: NestedCollectionAttr
          };
        }
      });
    });

    it('initializes be possible to define a model with a nested collection as attribute', function () {
      var modelWithNestedCollectionModel = new ModelWithNestedCollection();

      expect(modelWithNestedCollectionModel.get('nestedCollectionAttr') instanceof NestedCollectionAttr).toBeTruthy();
    });

    it('initializes a nested collection as attribute and default options', function () {
      var modelWithNestedCollectionModel = new (ModelWithNestedCollection.extend({
        defaults: function () {
          return {
            name: 'Test'
          };
        }
      }))();

      expect(modelWithNestedCollectionModel.get('nestedCollectionAttr') instanceof NestedCollectionAttr).toBeTruthy();
      expect(modelWithNestedCollectionModel.get('name')).toEqual('Test');
    });

    it('initializes a model with a nested collection when attributes are passed into constructor', function () {
      var modelWithNestedModel = new ModelWithNestedCollection({
        name: 'Test',
        nestedCollectionAttr: [
          {
            id: 1,
            name: 'Test'
          },
          {
            id: 2,
            name: 'Test 2'
          }
        ]
      });

      expect(modelWithNestedModel.get('nestedCollectionAttr') instanceof NestedCollectionAttr).toBeTruthy();
      expect(modelWithNestedModel.get('nestedCollectionAttr').first().get('id')).toBe(1);
      expect(modelWithNestedModel.get('nestedCollectionAttr').last().get('name')).toEqual('Test 2');
    });

  });

  describe('nested model that is created by a collection', function () {
    var NestedModelAttr, ModelWithNestedModel, CollectionWithNestedModels;
    beforeEach(function () {
      NestedModelAttr = window.Backbone.Model.extend({
        defaults: {
          name: 'Nested Model Attr'
        }
      });

      ModelWithNestedModel = NestedModel.extend({
        defaults: function () {
          return {
            name: 'Test'
          };
        },
        nested: function () {
          return {
            nestedModelAttr: NestedModelAttr
          };
        }
      });

      CollectionWithNestedModels = window.Backbone.Collection.extend({
        model: ModelWithNestedModel
      });
    });

    it('transforms object into nested models when collection is initialized with obj', function () {
      var collectionWithNestedModels = new CollectionWithNestedModels({
          name: 'xyz',
          nestedModelAttr: {
            name: 'Nested Name'
          }
        }),
        collectionWithNestedModels2 = new CollectionWithNestedModels([
          {
            name: 'abc',
            nestedModelAttr: {
              name: 'Nested Name'
            }
          },
          {
            name: 'xyz',
            nestedModelAttr: {
              name: 'Nested Name 2'
            }
          }
        ]);

      expect(collectionWithNestedModels.first().get('name')).toEqual('xyz');
      expect(collectionWithNestedModels.first().get('nestedModelAttr').get('name')).toEqual('Nested Name');

      expect(collectionWithNestedModels2.first().get('name')).toEqual('abc');
      expect(collectionWithNestedModels2.first().get('nestedModelAttr').get('name')).toEqual('Nested Name');
      expect(collectionWithNestedModels2.last().get('nestedModelAttr').get('name')).toEqual('Nested Name 2');
    });

    it('transforms object into nested models when object is added to ' +
      '' +
      'collection', function () {
      var collectionWithNestedModels = new CollectionWithNestedModels(),
        collectionWithNestedModels2 = new CollectionWithNestedModels();

      collectionWithNestedModels.add({
        name: 'xyz',
        nestedModelAttr: {
          name: 'Nested Name'
        }
      });

      collectionWithNestedModels2.add([
        {
          name: 'abc',
          nestedModelAttr: {
            name: 'Nested Name'
          }
        },
        {
          name: 'xyz',
          nestedModelAttr: {
            name: 'Nested Name 2'
          }
        }
      ]);

      expect(collectionWithNestedModels.first().get('name')).toEqual('xyz');
      expect(collectionWithNestedModels.first().get('nestedModelAttr').get('name')).toEqual('Nested Name');

      expect(collectionWithNestedModels2.first().get('name')).toEqual('abc');
      expect(collectionWithNestedModels2.first().get('nestedModelAttr').get('name')).toEqual('Nested Name');
      expect(collectionWithNestedModels2.last().get('nestedModelAttr').get('name')).toEqual('Nested Name 2');
    });

  });

  describe('parsing of server response', function () {
    beforeEach(function () {
      this.server = sinon.fakeServer.create();
      this.processReqBody = jasmine.createSpy('serverReqSpy');
      this.responseObj = {};
      this.server.respondWith(
        'GET',
        '/test/',
        function (xhr) {
          xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(this.responseObj));
        }.bind(this)
      );
    });

    describe('response is transformed into nested model', function () {
      var NestedModelAttr, ModelWithNestedModel, modelWithNestedModel;

      beforeEach(function () {
        NestedModelAttr = window.Backbone.Model.extend({
          defaults: {
            name: 'Nested Model Attr'
          }
        });
        ModelWithNestedModel = NestedModel.extend({
          url: '/test/',
          nested: function () {
            return {
              nestedModelAttr: NestedModelAttr
            };
          }
        });
        modelWithNestedModel = new ModelWithNestedModel();
      });

      it('parses the model and transforms object into nested model', function () {
        this.responseObj = {
          name: 'abc',
          nestedModelAttr: {
            name: 'Test',
            id: 1
          }
        };

        modelWithNestedModel.fetch();
        this.server.respond();

        expect(modelWithNestedModel.get('nestedModelAttr') instanceof NestedModelAttr).toBeTruthy();
        expect(modelWithNestedModel.get('nestedModelAttr').get('id')).toBe(1);
        expect(modelWithNestedModel.get('name')).toEqual('abc');
      });

      it('parses the model and transforms string into nested model', function () {
        this.responseObj = {
          name: 'abc',
          nestedModelAttrId: 1
        };
        var ModelWithCustomParse = ModelWithNestedModel.extend({
            parse: function (rsp) {
              if (rsp.nestedModelAttrId) {
                rsp.nestedModelAttr = {id: rsp.nestedModelAttrId};
                delete rsp.nestedModelAttrId;
              }
              return rsp;
            }
          }),
          modelWithCustomParse = new ModelWithCustomParse();

        modelWithCustomParse.fetch();
        this.server.respond();

        expect(modelWithCustomParse.get('nestedModelAttr') instanceof NestedModelAttr).toBeTruthy();
        expect(modelWithCustomParse.get('nestedModelAttr').get('id')).toBe(1);
        expect(modelWithCustomParse.get('name')).toEqual('abc');

      });

      it('parses the model and transforms string into nested model when custom parse method is provided', function () {
        this.responseObj = {
          name: 'abc',
          nestedModelAttr: 1
        };

        modelWithNestedModel.fetch();
        this.server.respond();

        expect(modelWithNestedModel.get('nestedModelAttr') instanceof NestedModelAttr).toBeTruthy();
        expect(modelWithNestedModel.get('nestedModelAttr').get('id')).toBe(1);
        expect(modelWithNestedModel.get('name')).toEqual('abc');

      });

    });

    describe('response is transformed into nested collection', function () {
      var NestedCollectionAttr, ModelWithNestedCollection, modelWithNestedCollection;
      beforeEach(function () {
        NestedCollectionAttr = window.Backbone.Collection.extend({});
        ModelWithNestedCollection = NestedModel.extend({
          url: '/test/',
          nested: function () {
            return {
              nestedCollectionAttr: NestedCollectionAttr
            };
          }
        });
        modelWithNestedCollection = new ModelWithNestedCollection();
        spyOn(modelWithNestedCollection, 'fetch').and.callThrough();
      });

      it('parses the model and transforms string into nested model', function () {
        this.responseObj = {
          name: 'abc',
          nestedCollectionAttr: 1
        };

        modelWithNestedCollection.fetch();
        this.server.respond();

        expect(modelWithNestedCollection.get('nestedCollectionAttr') instanceof NestedCollectionAttr).toBeTruthy();
        expect(modelWithNestedCollection.get('nestedCollectionAttr').length).toBe(1);
        expect(modelWithNestedCollection.get('nestedCollectionAttr').first().get('id')).toBe(1);
      });

      it('parses the model and transforms object into nested model', function () {
        this.responseObj = {
          name: 'abc',
          nestedCollectionAttr: [
            {
              id: 1,
              name: 'Test'
            },
            {
              id: 2,
              name: 'Test2'
            }
          ]
        };

        modelWithNestedCollection.fetch();
        this.server.respond();

        expect(modelWithNestedCollection.get('nestedCollectionAttr') instanceof NestedCollectionAttr).toBeTruthy();
        expect(modelWithNestedCollection.get('nestedCollectionAttr').length).toBe(2);
        expect(modelWithNestedCollection.get('nestedCollectionAttr').first().get('id')).toBe(1);
      });

      it('parses the model and transforms string into nested model', function () {
        this.responseObj = {
          name: 'abc',
          nestedCollectionAttr: [1, 2]
        };

        modelWithNestedCollection.fetch();
        this.server.respond();

        expect(modelWithNestedCollection.get('nestedCollectionAttr') instanceof NestedCollectionAttr).toBeTruthy();
        expect(modelWithNestedCollection.get('nestedCollectionAttr').length).toBe(2);
        expect(modelWithNestedCollection.get('nestedCollectionAttr').first().get('id')).toBe(1);
      });

    });

    describe('response of collection creates its models', function () {
      var Members, Description, ModelWithNestedAttrs, CollectionWithNestedModels, collectionWithNestedModels;
      beforeEach(function () {
        Members = window.Backbone.Collection.extend({});
        Description = window.Backbone.Model.extend({});
        ModelWithNestedAttrs = NestedModel.extend({
          nested: function () {
            return {
              members: Members,
              description: Description
            };
          }
        });
        CollectionWithNestedModels = window.Backbone.Collection.extend({
          url: '/test/',
          model: ModelWithNestedAttrs,
          parse: function (attrs) {
            return attrs.data;
          }
        });
        collectionWithNestedModels = new CollectionWithNestedModels();
      });

      it('parses nested models of each model', function () {
        this.responseObj = {
          data: [
            {
              name: 'abc',
              id: 1,
              description: {
                metaInfoA: 1,
                metaInfoB: 'xyz'
              },
              members: [
                {
                  id: 1,
                  name: 'Test'
                },
                {
                  id: 2,
                  name: 'Test2'
                }
              ]
            },
            {
              name: 'cde',
              id: 2,
              description: {
                metaInfoA: 1,
                metaInfoB: 'lll'
              },
              members: [
                {
                  id: 1,
                  name: 'Test'
                },
                {
                  id: 2,
                  name: 'Test2'
                }
              ]
            }
          ]
        };

        collectionWithNestedModels.fetch();
        this.server.respond();

        expect(collectionWithNestedModels.length).toBe(2);
        expect(collectionWithNestedModels.first().get('description') instanceof Description).toBeTruthy();
        expect(collectionWithNestedModels.first().get('members') instanceof Members).toBeTruthy();
      });

      it('parses nested models of each model when custom parse method of model is provided', function () {
        this.responseObj = {
          data: [
            {
              name: 'abc',
              id: 1,
              descriptionId: 1,
              members: [1, 2]
            },
            {
              name: 'cde',
              id: 2,
              description: 2,
              members: [1, 2]
            }
          ]
        };
        var ModelWithCustomParse = ModelWithNestedAttrs.extend({
            parse: function (attrs) {
              if (attrs.members) {
                var memberObjs = [];
                attrs.members.forEach(function (member) {
                  memberObjs.push({
                    id: member,
                    description: attrs.descriptionId
                  });
                });
                attrs.members = memberObjs;
              }
              if (attrs.descriptionId) {
                attrs.description = {id: attrs.descriptionId};
                delete attrs.descriptionId;
              }
              return attrs;
            }
          }),
          CollectionWithCustomParse = CollectionWithNestedModels.extend({
            model: ModelWithCustomParse
          }),
          collectionWithCustomParse = new CollectionWithCustomParse();

        collectionWithCustomParse.fetch();
        this.server.respond();

        expect(collectionWithCustomParse.length).toBe(2);
        expect(collectionWithCustomParse.first().get('description') instanceof Description).toBeTruthy();
        expect(collectionWithCustomParse.first().get('members') instanceof Members).toBeTruthy();
        expect(collectionWithCustomParse.first().get('members').first().get('id')).toBe(1);
        expect(collectionWithCustomParse.first().get('members').first().get('description')).toBe(1);
      });
    });

  });

  describe('nested model to json', function () {

    var NestedModelAttr, ModelWithNestedModel, NestedCollectionAttr, ModelWithNestedCollection;
    beforeEach(function () {
      NestedModelAttr = window.Backbone.Model.extend({
        defaults: {
          name: 'Nested Model Attr'
        }
      });
      ModelWithNestedModel = NestedModel.extend({
        url: 'withNestedModel',
        nested: function () {
          return {
            nestedModelAttr: NestedModelAttr
          };
        }
      });

      NestedCollectionAttr = window.Backbone.Collection.extend({});
      ModelWithNestedCollection = NestedModel.extend({
        url: 'withNestedCollection',
        nested: function () {
          return {
            nestedCollectionAttr: NestedCollectionAttr
          };
        }
      });

      this.server = sinon.fakeServer.create();
      this.processReqBody = jasmine.createSpy('serverReqSpy');
      this.server.respondWith(
        'POST',
        '/test/',
        function (xhr) {
          this.processReqBody(JSON.parse(xhr.requestBody));
          xhr.respond(200);
        }.bind(this)
      );
    });

    it('composes nested model', function () {
      var modelWithNestedModel = new ( ModelWithNestedModel.extend({
          url: '/test/'
        }) )(),
        modelData = {
          description: 'Abc Def',
          createdAt: +new Date(),
          nestedModelAttr: {
            id: 1,
            name: 'XYZ',
            description: 'Lorem ipsum',
            updatedAt: 'NEVER'
          }
        };
      modelWithNestedModel.set(_.clone(modelData));

      modelWithNestedModel.save();
      this.server.respond();

      expect(this.processReqBody).toHaveBeenCalledWith(modelData);
    });

    it('composes nested collection', function () {
      var modelWithNestedCollection = new ( ModelWithNestedCollection.extend({
          url: '/test/'
        }) )(),
        modelData = {
          description: 'Abc Def',
          createdAt: +new Date(),
          nestedCollectionAttr: [
            {
              id: 1,
              name: 'XYZ',
              description: 'Lorem ipsum',
              updatedAt: 'NEVER'
            },
            {
              id: 2,
              name: '123',
              description: 'Lorem ipsum 2',
              updatedAt: 'YESTERDAY'
            }
          ]
        };
      modelWithNestedCollection.set(_.clone(modelData));

      modelWithNestedCollection.save();
      this.server.respond();

      expect(this.processReqBody).toHaveBeenCalledWith(modelData);
    });

    it('composes deep nested collection', function () {
      var NestedModel2 = Backbone.Model,
        NestedModel1 = Backbone.NestedModel.extend({
          nested: function () {
            return {
              nestedModel2: NestedModel2
            };
          }
        }),
        NestedModel = Backbone.NestedModel.extend({
          url: '/test/',
          nested: function () {
            return {
              nestedModel1: NestedModel1
            };
          }
        }),
        nestedModel = new NestedModel({
          name: 'ABC',
          nestedModel1: {
            name: 'DEF',
            nestedModel2: {
              name: 'GHI'
            }
          }
        });

      nestedModel.save();
      this.server.respond();

      expect(this.processReqBody.calls.mostRecent().args[0].name).toEqual('ABC');
      expect(this.processReqBody.calls.mostRecent().args[0].nestedModel1.name).toEqual('DEF');
      expect(this.processReqBody.calls.mostRecent().args[0].nestedModel1.nestedModel2.name).toEqual('GHI');
    });

    it('provides custom compose function to modify nested attributes', function () {
      var modelWithNestedCollection = new ( ModelWithNestedCollection.extend({
          url: '/test/',
          compose: function (attrs) {
            attrs.nestedCollectionAttr = _.pluck(attrs.nestedCollectionAttr, 'id');
            return attrs;
          }
        }) )(),
        modelData = {
          description: 'Abc Def',
          createdAt: +new Date(),
          nestedCollectionAttr: [
            {
              id: 1,
              name: 'XYZ',
              description: 'Lorem ipsum',
              updatedAt: 'NEVER'
            },
            {
              id: 2,
              name: '123',
              description: 'Lorem ipsum 2',
              updatedAt: 'YESTERDAY'
            }
          ]
        };
      modelWithNestedCollection.set(_.clone(modelData));

      modelWithNestedCollection.save();
      this.server.respond();

      expect(this.processReqBody.calls.mostRecent().args[0].nestedCollectionAttr).toEqual([1, 2]);
      expect(this.processReqBody.calls.mostRecent().args[0].description).toMatch('Abc Def');
    });

    it('provides custom compose function to modify deep nested attributes', function () {
      var NestedModel2 = Backbone.Model,
        NestedModel1 = Backbone.NestedModel.extend({
          defaults: function () {
            return {
              createdAt: 'NOW',
              updatedAt: 'NOW'
            };
          },
          nested: function () {
            return {
              nestedModel2: NestedModel2
            };
          },
          compose: function (attrs) {
            attrs.nestedModel2 = attrs.nestedModel2.id;
            return attrs;
          }
        }),
        NestedModel = Backbone.NestedModel.extend({
          url: '/test/',
          nested: function () {
            return {
              nestedModel1: NestedModel1
            };
          },
          compose: function (attrs) {
            return {
              name: attrs.name,
              refId: attrs.nestedModel1.id,
              deepRefId: attrs.nestedModel1.nestedModel2
            };
          }
        }),
        nestedModel = new NestedModel({
          name: 'ABC',
          nestedModel1: {
            id: 1,
            name: 'DEF',
            nestedModel2: {
              name: 'GHI',
              id: 2
            }
          }
        });

      nestedModel.save();
      this.server.respond();

      expect(this.processReqBody.calls.mostRecent().args[0].name).toEqual('ABC');
      expect(this.processReqBody.calls.mostRecent().args[0].refId).toBe(1);
      expect(this.processReqBody.calls.mostRecent().args[0].deepRefId).toBe(2);
    });

    it('provides custom compose function to modify deep nested attributes with collections', function () {
      var NestedCollection2 = Backbone.Collection,
        NestedModel1 = Backbone.NestedModel.extend({
          defaults: function () {
            return {
              createdAt: 'NOW',
              updatedAt: 'NOW'
            };
          },
          nested: function () {
            return {
              nestedCollection2: NestedCollection2
            };
          },
          compose: function (attrs) {
            attrs.nestedCollection2 = _.pluck(attrs.nestedCollection2, 'id');
            return attrs;
          }
        }),
        NestedModel = Backbone.NestedModel.extend({
          url: '/test/',
          nested: function () {
            return {
              nestedModel1: NestedModel1
            };
          },
          compose: function (attrs) {
            return {
              name: attrs.name,
              refId: attrs.nestedModel1.id,
              deepRefId: attrs.nestedModel1.nestedCollection2
            };
          }
        }),
        nestedModel = new NestedModel({
          name: 'ABC',
          nestedModel1: {
            id: 1,
            name: 'DEF',
            nestedCollection2: [
              {
                name: 'OOO',
                id: 1
              },
              {
                name: 'GHI',
                id: 2
              }
            ]
          }
        });

      nestedModel.save();
      this.server.respond();

      expect(this.processReqBody.calls.mostRecent().args[0].name).toEqual('ABC');
      expect(this.processReqBody.calls.mostRecent().args[0].refId).toBe(1);
      expect(this.processReqBody.calls.mostRecent().args[0].deepRefId).toEqual([1, 2]);
    });

  });

  describe('real world example', function () {
    beforeEach(function () {
      var Organization = this.Organization = window.Backbone.Model.extend({
        urlRoot: '/organizations',
        defaults: function () {
          return {
            name: '',
            uniqueName: ''
          };
        }
      });
      var User = this.User = window.Backbone.Model.extend({
        urlRoot: '/users',
        defaults: function () {
          return {
            uniqueName: '',
            firstName: '',
            lastName: ''
          };
        },
        getFullName: function () {
          return this.get('firstName') + ' ' + this.get('lastName');
        }
      });
      var Users = this.Users = window.Backbone.Collection.extend({
        url: '/users',
        model: User
      });
      var Group = this.Group = NestedModel.extend({
        urlRoot: '/groups',
        defaults: function () {
          return {
            uniqueName: '',
            name: ''
          };
        },
        nested: function () {
          return {
            users: Users,
            organization: Organization
          };
        }
      });
      this.Groups = window.Backbone.Collection.extend({
        url: '/groups',
        model: Group,
        parse: function (resp) {
          return resp.data;
        }
      });

      this.server = sinon.fakeServer.create();
      this.processReqBody = jasmine.createSpy('serverReqSpy');
    });

    it('fetches groups and sets nested users when backend return groups with referenced users objects', function () {
      var groups = new this.Groups();
      this.server.respondWith(
        'GET',
        '/groups',
        function (xhr) {
          xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
            data: [
              {
                id: 1,
                name: 'International Group',
                uniqueName: 'IntGroup',
                users: [
                  {
                    id: 1,
                    firstName: 'Max',
                    lastName: 'Mustermann'
                  },
                  {
                    id: 2,
                    firstName: 'Peter',
                    lastName: 'Kirchner'
                  }
                ],
                organization: {
                  id: 1,
                  uniqueName: 'TComp',
                  name: 'Test Company'
                }
              },
              {
                id: 2,
                name: 'Stuttgart Group',
                uniqueName: 'StgGroup',
                users: [
                  {
                    id: 1,
                    firstName: 'Angelika',
                    lastName: 'Bauer'
                  }
                ],
                organization: {
                  id: 1,
                  uniqueName: 'TComp',
                  name: 'Test Company'
                }
              }
            ]
          }));
        }
      );

      groups.fetch();
      this.server.respond();

      expect(groups.length).toBe(2);
      expect(groups.at(0).get('name')).toMatch('International Group');
      expect(groups.at(0).get('organization').get('uniqueName')).toMatch('TComp');
      expect(groups.at(0).get('users').length).toBe(2);
      expect(groups.at(0).get('users').at(0).getFullName()).toMatch('Max Mustermann');
      expect(groups.at(0).get('users').at(1).getFullName()).toMatch('Peter Kirchner');
      expect(groups.at(1).get('name')).toMatch('Stuttgart Group');
      expect(groups.at(1).get('organization').get('uniqueName')).toMatch('TComp');
      expect(groups.at(1).get('users').length).toBe(1);
      expect(groups.at(1).get('users').at(0).getFullName()).toMatch('Angelika Bauer');

    });

    it('fetches groups and sets nested users when backend return groups with referenced user ids', function () {
      var groups = new this.Groups();
      this.server.respondWith(
        'GET',
        '/groups',
        function (xhr) {
          xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
            data: [
              {
                id: 1,
                name: 'International Group',
                uniqueName: 'IntGroup',
                users: [1, 2]
              }
            ]
          }));
        }
      );

      groups.fetch();
      this.server.respond();

      expect(groups.length).toBe(1);
      expect(groups.at(0).get('name')).toMatch('International Group');
      expect(groups.at(0).get('users').length).toBe(2);
      expect(groups.at(0).get('users').at(0).get('id')).toBe(1);
      expect(groups.at(0).get('users').at(1).get('id')).toBe(2);


    });

    it('fetches groups and sets nested users when backend return groups with referenced user ids ' +
      'and meta infos of the referenced users can be fetched', function () {
      var groups = new this.Groups();
      this.server.respondWith(
        'GET',
        '/groups',
        function (xhr) {
          xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
            data: [
              {
                id: 1,
                name: 'International Group',
                uniqueName: 'IntGroup',
                users: [1, 2],
                organization: 1
              }
            ]
          }));
        }
      );
      this.server.respondWith(
        'GET',
        '/users/1',
        function (xhr) {
          xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
            id: 1,
            uniqueName: 'm.mustermann',
            firstName: 'Max',
            lastName: 'Mustermann'
          }));
        }
      );
      this.server.respondWith(
        'GET',
        '/organizations/1',
        function (xhr) {
          xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
            id: 1,
            uniqueName: 'TComp',
            name: 'Test Company'
          }));
        }
      );

      groups.fetch();
      this.server.respond();
      groups.at(0).get('users').at(0).fetch();
      groups.at(0).get('organization').fetch();
      this.server.respond();

      expect(groups.at(0).get('users').at(0).getFullName()).toMatch('Max Mustermann');
      expect(groups.at(0).get('organization').get('name')).toMatch('Test Company');
    });

    it('composes nested users to object when saving the group model', function () {
      var group = new this.Group({id: 1});
      this.server.respondWith(
        'GET',
        '/groups/1',
        function (xhr) {
          xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
            id: 1,
            name: 'International Group',
            uniqueName: 'IntGroup',
            users: [1, 2],
            organization: 1
          }));
        }
      );
      this.server.respondWith(
        'PUT',
        '/groups/1',
        function (xhr) {
          this.processReqBody(JSON.parse(xhr.requestBody));
          xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
            id: 1,
            name: 'International Group',
            uniqueName: 'IntGroup',
            users: [3, 4],
            organization: 5
          }));
        }.bind(this)
      );

      group.fetch();
      this.server.respond();
      group.get('users').reset([{id: 3, uniqueName: 'Ulf'}, {id: 4, uniqueName: 'Erika'}]);
      group.get('organization').set('id', 5);
      group.save();
      this.server.respond();
      var processReqBodyCallArgs = this.processReqBody.calls.mostRecent().args[0];

      expect(processReqBodyCallArgs.users[0].id).toBe(3);
      expect(processReqBodyCallArgs.users[1].id).toBe(4);
      expect(processReqBodyCallArgs.organization.id).toBe(5);
      expect(group.get('users').at(0).get('id')).toBe(3);
      expect(group.get('users').at(0).get('uniqueName')).toMatch('Ulf');
      expect(group.get('users').at(1).get('id')).toBe(4);
      expect(group.get('users').at(1).get('uniqueName')).toMatch('Erika');
    });

    it('composes nested users to ids when saving the group model', function () {
      var Group = this.Group.extend({
        parse: function (attrs) {
          attrs.organization = attrs.organizationId;
          delete attrs.organizationId;
          return attrs;
        },
        compose: function (attrs) {
          attrs.users = _.pluck(attrs.users, 'id');
          return attrs;
        }
      });
      var group = new Group({
        name: 'International Group',
        uniqueName: 'IntGroup'
      });
      this.server.respondWith(
        'POST',
        '/groups',
        function (xhr) {
          this.processReqBody(JSON.parse(xhr.requestBody));
          xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
            id: 1,
            name: 'International Group',
            uniqueName: 'IntGroup',
            users: [3, 4],
            organizationId: 5
          }));
        }.bind(this)
      );

      group.fetch();
      this.server.respond();
      group.get('users').add([{id: 3, uniqueName: 'Ulf'}, {id: 4, uniqueName: 'Erika'}]);
      group.get('organization').set('id', 5);
      group.save();
      this.server.respond();
      var processReqBodyCallArgs = this.processReqBody.calls.mostRecent().args[0];

      expect(processReqBodyCallArgs.users[0]).toBe(3);
      expect(processReqBodyCallArgs.users[1]).toBe(4);
      expect(group.get('organization').get('id')).toBe(5);
      expect(group.get('users').at(0).get('id')).toBe(3);
      expect(group.get('users').at(0).get('uniqueName')).toMatch('Ulf');
      expect(group.get('users').at(1).get('id')).toBe(4);
      expect(group.get('users').at(1).get('uniqueName')).toMatch('Erika');
    });
  });
})
;