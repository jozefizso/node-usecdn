/*global describe, beforeEach, it*/
'use strict';

var assert = require('chai').assert;

describe('usecdn module tests', function () {

  it('should require usecdn without throwing', function () {
    var app = require('../index.js');

    assert.isDefined(app, 'usecdn module was not created');
  });

});
