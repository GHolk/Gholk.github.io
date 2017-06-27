// Generated by CoffeeScript 1.12.1
(function() {
  var HrArticle, article, articleList, evalFilterFunction, filterByFunction, filterByNumberList, list, outputMatchNumber, parseQueryString, queryForm, queryObject, theTag;

  HrArticle = (function() {
    var getTagsFromUl;

    getTagsFromUl = function(ul) {
      var j, len, li, ref, results;
      ref = ul.children;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        li = ref[j];
        results.push(li.textContent.trim());
      }
      return results;
    };

    function HrArticle(articleNode) {
      this.title = articleNode.getElementsByTagName('h2')[0].textContent.trim();
      this.url = articleNode.getElementsByTagName('h2')[0].children[0].href;
      this.date = new Date(articleNode.getElementsByTagName('small')[0].textContent);
      this.description = articleNode.getElementsByTagName('p')[0].textContent;
      this.tags = getTagsFromUl(articleNode.getElementsByTagName('ul')[0]);
      this.raw = articleNode.textContent;
      this.node = articleNode;
    }

    HrArticle.prototype.hasTag = function(tag) {
      return this.tags.some(function(articleTag) {
        return articleTag === tag;
      });
    };

    HrArticle.prototype.show = function(toShow) {
      if (toShow === true) {
        return this.node.className = 'show-article';
      } else if (toShow === false) {
        return this.node.className = 'hide-article';
      } else {
        return this.node.className;
      }
    };

    return HrArticle;

  })();

  articleList = (function() {
    var j, len, ref, results;
    ref = document.getElementsByTagName('article');
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      article = ref[j];
      results.push(new HrArticle(article));
    }
    return results;
  })();

  queryForm = document.getElementById('query-article');

  outputMatchNumber = queryForm.elements['match-number'];

  filterByNumberList = function(numberList) {
    document.body.className = '.hide-article';
    articleList.forEach(function(article) {
      return article.show(false);
    });
    numberList.map(function(index) {
      return articleList[index];
    }).forEach(function(article) {
      return article.show(true);
    });
    outputMatchNumber.value = numberList.length;
    return document.body.className = '.show-article';
  };

  filterByFunction = function(callback) {
    var numberList;
    numberList = [];
    articleList.map(callback).forEach(function(isTrue, index) {
      if (isTrue) {
        return numberList.push(index);
      }
    });
    filterByNumberList(numberList);
    return numberList;
  };

  evalFilterFunction = function(conditionStatement) {
    return function(article) {
      var date, description, hasTag, node, raw, tags, title, url;
      title = article.title, url = article.url, description = article.description, tags = article.tags, date = article.date, raw = article.raw, node = article.node;
      hasTag = article.hasTag.bind(article);
      return eval(conditionStatement);
    };
  };

  queryForm.onsubmit = function(evt) {
    var conditionStatement, list, queryString;
    evt.preventDefault();
    conditionStatement = this.elements['query-statement'].value;
    list = filterByFunction(evalFilterFunction(conditionStatement));
    queryString = '?' + 'eval=' + encodeURIComponent(conditionStatement);
    return history.pushState({
      list: list
    }, "eval " + conditionStatement, queryString);
  };

  window.onpopstate = function(evt) {
    if (evt.state) {
      if (Array.isArray(evt.state.list)) {
        return filterByNumberList(evt.state.list);
      }
    } else {
      return filterByNumberList(articleList.map(function(x, i) {
        return i;
      }));
    }
  };

  queryForm.elements['show-all'].onclick = function(evt) {
    evt.preventDefault();
    filterByNumberList(articleList.map(function(x, i) {
      return i;
    }));
    return history.pushState(null, null, 'index.html');
  };

  parseQueryString = function(queryString) {
    var j, key, keyValue, len, pair, queryObject, ref, value;
    keyValue = queryString.split(/&/g);
    queryObject = {};
    for (j = 0, len = keyValue.length; j < len; j++) {
      pair = keyValue[j];
      ref = pair.split(/=/).map(decodeURIComponent), key = ref[0], value = ref[1];
      queryObject[key] = value;
    }
    return queryObject;
  };

  if (location.search) {
    queryObject = parseQueryString(location.search.slice(1));
    if (queryObject["eval"]) {
      filterByFunction(evalFilterFunction(queryObject["eval"]));
    } else if (queryObject.tags) {
      theTag = queryObject.tags;
      list = filterByFunction(function(article) {
        return article.hasTag(theTag);
      });
      history.pushState({
        list: list
      }, "tag: " + theTag, '');
    }
  }

}).call(this);
