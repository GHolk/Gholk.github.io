// Generated by CoffeeScript 1.12.1
(function() {
  var FileLoaderByCheerio, cheerio, fs;

  cheerio = require('cheerio');

  fs = require('fs');

  FileLoaderByCheerio = (function() {
    function FileLoaderByCheerio(path) {
      this.path = path;
      this.selector = cheerio.load(fs.readFileSync(path, 'utf8'));
      this.parse();
    }

    FileLoaderByCheerio.prototype.parse = function() {
      this.date = this.selector('meta[name=date]').attr('content');
      this.tags = this.selector('meta[name=keywords]').attr('content');
      this.title = this.selector('title').text();
      this.prev = this.selector('link[rel=prev]').attr('href');
      this.next = this.selector('link[rel=next]').attr('href');
      return this.main = this.selector('main').html();
    };

    FileLoaderByCheerio.prototype.sync = function() {
      this.selector('meta[name=date]').attr('content', this.date);
      this.selector('meta[name=keywords]').attr('content', this.tags);
      this.selector('title').text(this.title);
      this.selector('link[rel=prev]').attr('href', this.prev);
      this.selector('link[rel=next]').attr('href', this.next);
      return this.main = this.selector('main').html(this.main);
    };

    FileLoaderByCheerio.prototype.update = function(newLoader) {
      var i, key, len, ref, results;
      ref = ['date', 'tags', 'prev', 'next', 'title', 'main'];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        results.push(this[key] = newLoader[key]);
      }
      return results;
    };

    FileLoaderByCheerio.prototype.write = function(path) {
      if (path) {
        this.path = path;
      }
      return fs.writeFileSync(this.path, this.selector.html(), 'utf8');
    };

    return FileLoaderByCheerio;

  })();

  module.exports = FileLoaderByCheerio;

}).call(this);
