'use strict';

const webpack = require('webpack');
const expect = require('chai').expect;
const rm = require('rimraf');
const Path = require('path');
const fs = require('fs');

const Plugin = require('../lib');

const OUTPUT_PATH = 'public';

describe('Plugin', function() {

  beforeEach(function(done) {
    rm(Path.join(__dirname, OUTPUT_PATH), done);
  });

  it('generates a default robots.txt', function(done) {

    const expected = `User-agent: *
Allow: /`;

    const webpackConfig = {
      entry: Path.join(__dirname, 'fixtures/index.js'),
      output: {
        path: Path.join(__dirname, OUTPUT_PATH),
        filename: 'index.js'
      },
      plugins: [new Plugin()]
    };

    webpack(webpackConfig, function(error, stats) {
      expect(error).to.be.null;
      expect(stats.hasErrors()).to.be.false;

      fs.readFile(Path.join(__dirname, OUTPUT_PATH, 'robots.txt'), {encoding: 'utf8'}, function(fsError, data) {
        expect(fsError).to.be.null;
        expect(data).to.equal(expected);
        done();
      });
    });
  });

  it('generates a robots.txt with multiple allows', function(done) {

    const expected = `User-agent: *
Allow: /
Allow: /cgi-bin`;

    const webpackConfig = {
      entry: Path.join(__dirname, 'fixtures/index.js'),
      output: {
        path: Path.join(__dirname, OUTPUT_PATH),
        filename: 'index.js'
      },
      plugins: [new Plugin({
        userAgents: [{
          name: '*',
          allow: ['/', '/cgi-bin']
        }]
      })]
    };

    webpack(webpackConfig, function(error, stats) {
      expect(error).to.be.null;
      expect(stats.hasErrors()).to.be.false;

      fs.readFile(Path.join(__dirname, OUTPUT_PATH, 'robots.txt'), {encoding: 'utf8'}, function(fsError, data) {
        expect(fsError).to.be.null;
        expect(data).to.equal(expected);
        done();
      });
    });
  });

  it('generates a disallow robots.txt', function(done) {

    const expected = `User-agent: *
Disallow: /`;

    const webpackConfig = {
      entry: Path.join(__dirname, 'fixtures/index.js'),
      output: {
        path: Path.join(__dirname, OUTPUT_PATH),
        filename: 'index.js'
      },
      plugins: [new Plugin({
        userAgents: [{
          name: '*',
          disallow: ['/']
        }]
      })]
    };

    webpack(webpackConfig, function(error, stats) {
      expect(error).to.be.null;
      expect(stats.hasErrors()).to.be.false;

      fs.readFile(Path.join(__dirname, OUTPUT_PATH, 'robots.txt'), {encoding: 'utf8'}, function(fsError, data) {
        expect(fsError).to.be.null;
        expect(data).to.equal(expected);
        done();
      });
    });
  });

  it('generates a robots.txt with multiple disallows', function(done) {

    const expected = `User-agent: *
Disallow: /
Disallow: /cgi-bin`;

    const webpackConfig = {
      entry: Path.join(__dirname, 'fixtures/index.js'),
      output: {
        path: Path.join(__dirname, OUTPUT_PATH),
        filename: 'index.js'
      },
      plugins: [new Plugin({
        userAgents: [{
          name: '*',
          disallow: ['/', '/cgi-bin']
        }]
      })]
    };

    webpack(webpackConfig, function(error, stats) {
      expect(error).to.be.null;
      expect(stats.hasErrors()).to.be.false;

      fs.readFile(Path.join(__dirname, OUTPUT_PATH, 'robots.txt'), {encoding: 'utf8'}, function(fsError, data) {
        expect(fsError).to.be.null;
        expect(data).to.equal(expected);
        done();
      });
    });
  });

  it('generates a robots.txt with multiple agents', function(done) {

    const expected = `User-agent: *
Disallow: /

User-agent: Googlebot
Allow: /`;

    const webpackConfig = {
      entry: Path.join(__dirname, 'fixtures/index.js'),
      output: {
        path: Path.join(__dirname, OUTPUT_PATH),
        filename: 'index.js'
      },
      plugins: [new Plugin({
        userAgents: [{
          name: '*',
          disallow: ['/']
        }, {
          name: 'Googlebot',
          allow: ['/']
        }]
      })]
    };

    webpack(webpackConfig, function(error, stats) {
      expect(error).to.be.null;
      expect(stats.hasErrors()).to.be.false;

      fs.readFile(Path.join(__dirname, OUTPUT_PATH, 'robots.txt'), {encoding: 'utf8'}, function(fsError, data) {
        expect(fsError).to.be.null;
        expect(data).to.equal(expected);
        done();
      });
    });
  });

  it('generates a robots.txt with a sitemap', function(done) {
    const expected = `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`;

    const webpackConfig = {
      entry: Path.join(__dirname, 'fixtures/index.js'),
      output: {
        path: Path.join(__dirname, OUTPUT_PATH),
        filename: 'index.js'
      },
      plugins: [new Plugin({
        sitemap: 'https://example.com/sitemap.xml',
      })]
    };

    webpack(webpackConfig, function(error, stats) {
      expect(error).to.be.null;
      expect(stats.hasErrors()).to.be.false;

      fs.readFile(Path.join(__dirname, OUTPUT_PATH, 'robots.txt'), {encoding: 'utf8'}, function(fsError, data) {
        expect(fsError).to.be.null;
        expect(data).to.equal(expected);
        done();
      });
    });

  });

});
