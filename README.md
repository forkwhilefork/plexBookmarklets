# plexBookmarklets

The latest version of this script is hosted at [https://static-files.s3.wasabisys.com/bookmarklet_dl.js](https://static-files.s3.wasabisys.com/bookmarklet_dl.js).

You can use it by making a bookmark with the following destination:

```javascript:(function(){if (typeof plxDwnld == 'undefined') {var jsCode = document.createElement('script');jsCode.setAttribute('src', 'https://static-files.s3.wasabisys.com/bookmarklet_dl.js');document.body.appendChild(jsCode);} else {plxDwnld.init();}})()```
