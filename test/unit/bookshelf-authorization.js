var expect                 = require('chai').expect;
var _                      = require('lodash');
var sinon                  = require('sinon');

var bookshelf              = require('../mocks/bookshelf');
var BookshelfAuthorization = require('../../lib/bookshelf-authorization');

describe('Bookshelf Authorization', function () {
  'use strict';

  beforeEach(function () {
    this.bookshelf = _.clone(bookshelf);
  });

  it('loads the registry plugin', function () {
    this.bookshelf.plugin(BookshelfAuthorization);
    expect(this.bookshelf).to.itself.respondTo('model');
  });

  it('does not overwrite the registry plugin if already loaded', function () {
    var registry = require('bookshelf/plugins/registry');
    this.bookshelf.plugin(registry);
    sinon.spy(this.bookshelf, 'plugin');
    this.bookshelf.plugin(BookshelfAuthorization);
    sinon.assert.neverCalledWith(this.bookshelf.plugin, registry);
  });

  describe('Bookshelf plugin', function () {

    beforeEach(function () {
      this.bookshelf.plugin(BookshelfAuthorization);
    });

    it('sets the UserBase on the Bookshelf instance', function () {
      expect(this.bookshelf)
        .to.have.property('User')
        .and.itself.respondTo('can');
    });

    it('overwrites Bookshelf.Model', function () {
      expect(this.bookshelf)
        .to.have.property('Model')
        .and.have.property('authorize');
    });

  });

  describe('Custom configuration', function () {

    var Bases;
    beforeEach(function () {
      Bases = BookshelfAuthorization(this.bookshelf, this.bookshelf.Model);
    });

    it('returns the ModelBase', function () {
      expect(Bases)
        .to.have.property('Model')
        .and.have.property('authorize');
    });

    it('returns the UserBase', function () {
      expect(Bases)
        .to.have.property('User')
        .and.itself.respondTo('can');
    });

  });

});