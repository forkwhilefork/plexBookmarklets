  # Deprecation notice
  I've deprecated these bookmarklets in favor of a [Chrome extension](https://github.com/forkwhilefork/plexChromeExt) which doesn't have issues with CORS restrictions.

# plexBookmarklets

The latest version of this script is hosted at [https://static-files.s3.wasabisys.com/bookmarklet_dl.js](https://static-files.s3.wasabisys.com/bookmarklet_dl.js).

You can use it by making a bookmark with the following destination:

```javascript:(function(){if (typeof plxDwnld == 'undefined') {var jsCode = document.createElement('script');jsCode.setAttribute('src', 'https://static-files.s3.wasabisys.com/bookmarklet_dl.js');document.body.appendChild(jsCode);} else {plxDwnld.init();}})()```

This is based on the script made by Pip Longrun available [here](https://piplong.run/plxdwnld/).
