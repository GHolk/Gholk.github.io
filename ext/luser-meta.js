// Generated by CoffeeScript 1.12.1
(function() {
  var HyperLink, defineItem, footer, i, j, k, key, len, len1, len2, link, links, meta, metaMap, metas, ref;

  metaMap = {};

  metas = document.getElementsByTagName('meta');

  links = document.getElementsByTagName('link');

  HyperLink = (function() {
    var createNode;

    createNode = function(text, url, title) {
      var node;
      node = document.createElement('a');
      node.textContent = text;
      node.href = url;
      if (title) {
        node.title = title;
      }
      return node;
    };

    function HyperLink(text, url, title) {
      this.text = text;
      this.url = url;
      this.title = title;
      this.node = createNode(text, url, title);
    }

    return HyperLink;

  })();

  HyperLink.fromLink = function(link) {
    return new HyperLink(link.title, link.href, link.rel);
  };

  HyperLink.fromTag = function(tag) {
    return new HyperLink(tag, "index.html?tags=" + tag);
  };

  for (i = 0, len = metas.length; i < len; i++) {
    meta = metas[i];
    switch (meta.name) {
      case 'date':
        metaMap.date = new Date(meta.content);
        break;
      case 'copyright':
        metaMap.copyright = meta.content;
        break;
      case 'keywords':
        metaMap.tags = meta.content.split(/,/g).map(HyperLink.fromTag);
        break;
      case 'author':
        metaMap.author = meta.content;
    }
  }

  for (j = 0, len1 = links.length; j < len1; j++) {
    link = links[j];
    switch (link.rel) {
      case 'prev':
        metaMap.prev = HyperLink.fromLink(link);
        break;
      case 'next':
        metaMap.next = HyperLink.fromLink(link);
        break;
      case 'index':
        metaMap.index = HyperLink.fromLink(link);
    }
  }

  window.metaMap = metaMap;

  defineItem = function(name, value, className) {
    var dd, dl, dt;
    dl = document.createElement('dl');
    if (className) {
      dl.className = className;
    }
    dt = document.createElement('dt');
    dt.textContent = name;
    dl.appendChild(dt);
    dd = document.createElement('dd');
    if (value.node) {
      dd.appendChild(value.node);
    } else if (value instanceof Element) {
      dd.appendChild(value);
    } else {
      dd.textContent = value;
    }
    dl.appendChild(dd);
    return dl;
  };

  footer = document.createElement('footer');

  ref = ['date', 'author', 'copyright', 'tags', 'prev', 'index', 'next'];
  for (k = 0, len2 = ref.length; k < len2; k++) {
    key = ref[k];
    footer.appendChild(defineItem(key, metaMap[key]));
  }

  document.body.appendChild(footer);

}).call(this);
