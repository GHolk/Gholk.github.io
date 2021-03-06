// Generated by CoffeeScript 1.12.1
(function() {
  var HTMLLoader, IndexLoader, TagsDataBase, htmlPath, index, indexPath, newPost, tagsDB, tagsPath;

  HTMLLoader = require('./FileLoaderCheerio');

  IndexLoader = require('./IndexLoader');

  TagsDataBase = require('./calculateTags');

  htmlPath = process.argv.slice(-1)[0];

  indexPath = '../index.html';

  index = new IndexLoader(indexPath);

  newPost = new HTMLLoader(htmlPath);

  index.add(newPost);

  index.write();

  tagsPath = 'tags.json';

  tagsDB = new TagsDataBase(tagsPath);

  tagsDB.updateFromLoader(newPost);

  tagsDB.write();

}).call(this);
