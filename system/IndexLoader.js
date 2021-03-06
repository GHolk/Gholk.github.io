// Generated by CoffeeScript 1.12.1
(function() {
  var IndexLoader, cheerio, fs;

  fs = require('fs');

  cheerio = require('cheerio');

  IndexLoader = (function() {
    function IndexLoader(path) {
      this.path = path;
      this.selector = cheerio.load(fs.readFileSync(path, 'utf8'), {
        decodeEntities: false,
        xmlMode: false,
        withDomLvl1: true,
        normalizeWhitespace: false
      });
    }

    IndexLoader.prototype.add = function(loader) {
      var tagsArray, wrapTag;
      tagsArray = loader.tags.split(/,/g);
      wrapTag = function(tag) {
        return "<li><a href=\"?tags=" + tag + "\">" + tag + "</a></li>";
      };
        return this.selector("main").prepend("<hr>").prepend("<article>\n    <h2><a href=\"" + loader.file + "\">" + loader.title + "</a></h2>\n    <small class=\"date\">" + loader.date + "</small>\n    <p>\n    " + loader.description + "\n    </p>\n    <ul class=\"tag-list\">\n    " + (tagsArray.map(wrapTag).join('\n')) + "\n    </ul>\n</atricle>");
    };

    IndexLoader.prototype.write = function(path) {
      if (path == null) {
        path = this.path;
      }
      return fs.writeFileSync(path, this.selector.html(), 'utf8');
    };

    return IndexLoader;

  })();

  module.exports = IndexLoader;

}).call(this);
