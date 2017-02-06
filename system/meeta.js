
!function() {

var headArray = (function() {

    function mapHead (tagName, attrList) {
        var o = {},
            c = Array.prototype.slice
                .call( document.getElementsByTagName(tagName) );


        var m, j, i, li=c.length, lj=attrList.length, name;
        for(i=0; i<li; i++){
            m = c[i];

            for(j=1; j<lj; j++)
                if( m.getAttribute(attrList[j]) ) 
                    name = m.getAttribute(attrList[j]);

            if(name) o[name] = m.getAttribute(attrList[0]);
            name = null;
        }

        return o;
    }


    var links = mapHead('link', ['href', 'property', 'rev', 'rel']);
    var metas = mapHead('meta', ['content', 'http-equiv', 'property', 'name']);

    return [metas, links];
})();

var dl = (function(headArray) {

    var metas = headArray[0],
        links = headArray[1],
        dl = document.createElement('dl'),
        list = {
            'author': ['author', 'og:article:author', 'og:book:author'],
            'date': ['date', 'og:article:published_time'],
            'keywords': ['keywords', 'og:article:tag'],
            'description': ['description', 'og:description'],
            'copyright': ['copyright']
        };

    dl.defineItem = function (itemName, itemValue) {
        var dt = document.createElement('dt');
        dt.textContent = itemName;
        this.appendChild(dt);

        var dd = document.createElement('dd');
        dd.appendChild(itemValue);
        this.appendChild(dd);
    }

    function findItem (dict, list) {
        for (var i in list)
            if( dict.hasOwnProperty(list[i]) ) return list[i];
        return false;
    }


    var text, linkProperty, metaProperty;

    for (var name in list) {

        metaProperty = findItem(metas, list[name]);

        if(metaProperty){
            linkProperty = findItem(links, list[name]);

            if(linkProperty) {
                text = document.createElement('a');
                text.href = links[linkProperty];
                text.textContent = metas[metaProperty];

            } else
                text = document.createTextNode( metas[metaProperty] );

            dl.defineItem(name, text, dl);
        }
    }


    dl.className = 'inline';
    return dl;

})(headArray);


/*
    function getFooter() {
        var footers = Array.prototype.slice
            .call( document.getElementsByTagName('footer') );

        for (var i=0, l=footers.length; i<l; i++)
            if(footers[i].parentNode.tagName == "BODY") 
                return footers[i];
    }
*/

/** do comment board and links *************/
(function(links, dl) {

    function findCommentUrl(links) {

        var list = ['help', 'comment', 'comment board'];

        for (var i=0; i<list.length; i++)
            if( links.hasOwnProperty(list[i]) )
                return links[list[i]];
    }

    var comment = document.getElementById('comment'),
        commentUrl = findCommentUrl(links);

    if(commentUrl && !comment) {
        comment = document.createElement('iframe');
        comment.id = 'comment';
    }

    if(comment && comment.nodeName == 'IFRAME'){

        function showComment() {

            if(window.location.hash == '#comment') {
                comment.style.display = 'block';
                comment.src = commentUrl;
            }

            if(comment.parentNode == null)
                document.body.appendChild(comment);
        }

        showComment();

        window.addEventListener('hashchange', showComment);

        var a = document.createElement('a');
        a.href = '#comment';
        a.textContent = 'comment board';
        dl.defineItem('comment', a);
    }

})(headArray[1], dl);


/** markdown link and use. **/
(function(dl) {

    function findRaw () {
        var raw = document.getElementById('markdown') 
            || document.getElementById('raw');

        if (raw)
            return raw;
        else {
            var markdowns = Array.prototype.slice
                .call( document.getElementsByClassName('markdown') );

            for (var i=0, l=markdowns.length; i<l; i++)
                if(markdowns[i].textContent.length > 500)
                    return markdowns[i];
            
            return null;
        }
    }

    var raw = findRaw();

    if(raw){
        raw.id = 'markdown';

        function showRaw(){
            if(window.location.hash == '#markdown')
                raw.style.display = 'block';
        }

        window.addEventListener('hashchange', showRaw);

        var a = document.createElement('a');
        a.href = '#markdown';
        a.textContent = '#markdown';
        dl.defineItem('raw', a);
    }

})(dl);

var footer = document.createElement('footer');

footer.appendChild(dl);
footer.setAttribute('lang', 'en');
footer.id = "meeta-js";

(function(links, metas, dl) {

    var allDl = document.createElement('dl');
    allDl.defineItem = dl.defineItem;
    allDl.className = 'inline';

    var name;
    for (name in links)
        allDl.defineItem( name, document.createTextNode(links[name]) );

    for (name in metas)
        allDl.defineItem( name, document.createTextNode(metas[name]) );

    function showAllDl() {
        if(window.location.hash == '#metadata')
            footer.appendChild(allDl);
    }

    showAllDl();

    window.addEventListener('hashchange', showAllDl);

    var a = document.createElement('a');
    a.href = '#metadata';
    a.textContent = 'show all metadata';

    dl.defineItem('all metadata', a);

})(headArray[0], headArray[1], dl);



/** do prev, next, index page. **/
(function(links, dl) {

    function doLink (text, url, ul) {
        var a = document.createElement('a');
        a.href = url;
        a.textContent = text;
        a.setAttribute('name', text);

        var li = document.createElement('li');
        li.appendChild(a);
        ul.appendChild(li);
    }

    var list = ['prev', 'next', 'index'],
        ul = document.createElement('ul');

    ul.id = 'page';


    for(var i=0, l=list.length; i<l; i++)

        if(links.hasOwnProperty(list[i]))
            doLink(list[i], links[list[i]], ul);
        else if (i == 2)
            doLink('index', 'index.html', ul);


    footer.appendChild(ul);
})(headArray[1], dl);


document.body.appendChild(footer);

}();


