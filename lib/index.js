'use strict';

function RobotsPlugin(options) {
  this.options = Object.assign({}, {
    userAgents: [{
      name: '*',
      allow: ['/'],
      disallow: []
    }],
    filename: 'robots.txt',
  }, options);
}

RobotsPlugin.prototype = {

  constructor: RobotsPlugin,

  apply: function (compiler) {

    compiler.plugin('emit', (compilation, callback) => {

      const output = this.options.userAgents.map(userAgent => {
        let text = '';
        text += `User-agent: ${userAgent.name}\n`;

        if (userAgent.disallow && userAgent.disallow.length > 0) {
          userAgent.disallow.map(disallow => {
            text += `Disallow: ${disallow}\n`;
          });
        }

        if (userAgent.allow && userAgent.allow.length > 0) {
          userAgent.allow.map(allow => {
            text += `Allow: ${allow}\n`;
          });
        }
        return text + '\n';
      });
      if (this.options.sitemap) {
        output.push('Sitemap: ' + this.options.sitemap + '\n');
      }
      const stringifiedOutput = output.join('').trim();

      compilation.assets[this.options.filename] = {
        source: function() {
          return stringifiedOutput
        },
        size: function() {
          return stringifiedOutput.length
        }
      };

      callback();
    });
  }
};

module.exports = RobotsPlugin;
