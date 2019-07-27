/**
 * Download original files from the Plex web interface
 * 
 * This project is based on Pip Longrun's work, available here:
 * https://piplong.run/plxdwnld
 *
 * This project is licensed under the terms of the MIT license
 * see https://github.com/forkwhilefork/plexBookmarklets/blob/master/LICENSE.txt
 *
 * @author      Ross Tajvar <ross@tajvar.io>
 * @version     1.0.0
 * @see         https://github.com/forkwhilefork/plexBookmarklets
 *
 */
 var plxDwnld = (function() {
    var self = {};
    var clientIdRegex = new RegExp("server\/([a-f0-9]{40})\/");
    var metadataIdRegex = new RegExp("key=%2Flibrary%2Fmetadata%2F(\\d+)");
    
    var apiResourceUrl = "https://plex.tv/api/resources?includeHttps=1&X-Plex-Token={token}";
    var apiLibraryUrl = "{baseuri}/library/metadata/{id}?X-Plex-Token={token}";
    var downloadUrl = "{baseuri}{partkey}?download=1&X-Plex-Token={token}";
    
    var accessTokenXpath = "//Device[@clientIdentifier='{clientid}']/@accessToken";
    var baseUriXpath = "//Device[@clientIdentifier='{clientid}']/Connection[@local=0][@protocol='https']/@uri";
    var directoryTypeXpath = "//Directory/@type";
    var partKeyXpath = "//Media/Part[1]/@key";
    var baseUri = null;
    var accessToken = null;
    
    function displayTextInNewTab(text){
      var win = window.open();
      win.document.write('<iframe src="data:text/plain;charset=utf-8,' + encodeURIComponent(text)  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    }
    
    var getXml = function(url, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseXML);
            }
        };
        request.open("GET", url);
        request.send();
    };

    var getMetadata = function(xml) {
        var clientId = clientIdRegex.exec(window.location.href);

        if (clientId && clientId.length == 2) {
            var accessTokenNode = xml.evaluate(accessTokenXpath.replace('{clientid}', clientId[1]), xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            var baseUriNode = xml.evaluate(baseUriXpath.replace('{clientid}', clientId[1]), xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

            if (accessTokenNode.singleNodeValue && baseUriNode.singleNodeValue) {
                accessToken = accessTokenNode.singleNodeValue.textContent;
                baseUri = baseUriNode.singleNodeValue.textContent;
                var metadataId = metadataIdRegex.exec(window.location.href);

                if (metadataId && metadataId.length == 2) {
                    getXml(apiLibraryUrl.replace('{baseuri}', baseUri).replace('{id}', metadataId[1]).replace('{token}', accessToken), getDownloadUrl);
                } else {
                    alert("You are currently not viewing a media item.");
                }
            } else {
                alert("Cannot find a valid accessToken.");
            }
        } else {
            alert("You are currently not viewing a media item.");
        }
    };

    var getDownloadUrl = function(xml) {
        var partKeyNode = xml.evaluate(partKeyXpath, xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        if (partKeyNode.singleNodeValue) {
            window.location.href = downloadUrl.replace('{baseuri}', baseUri).replace('{partkey}', partKeyNode.singleNodeValue.textContent).replace('{token}', accessToken);
        } else {
            console.log("we're not on the page for a single media item. checking if it's a season or show.");
            
            directoryType = xml.evaluate(directoryTypeXpath, xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            
            if (directoryType.singleNodeValue.textContent == "season") {
                console.log("we're on the page for a season.")
                var metadataId = metadataIdRegex.exec(window.location.href);
                getXml(apiLibraryUrl.replace('{baseuri}', baseUri).replace('{id}', metadataId[1] + "/children").replace('{token}', accessToken), processSeasonChildrenCallback);
            } else if (directoryType.singleNodeValue.textContent == "show") {
                console.log("we're on the page for a show.")
                var metadataId = metadataIdRegex.exec(window.location.href);
                getXml(apiLibraryUrl.replace('{baseuri}', baseUri).replace('{id}', metadataId[1] + "/allLeaves").replace('{token}', accessToken), processSeasonChildrenCallback);
            } else {
                alert("I don't know how to handle this page.");
            }
        }
    };
    
    var processSeasonChildren = function(xml) {
        var partKeyNodeSet = xml.evaluate(partKeyXpath, xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        var thisNode = partKeyNodeSet.iterateNext();
        var urls = "";
        
        while (thisNode) {
          urls += downloadUrl.replace('{baseuri}', baseUri).replace('{partkey}', thisNode.textContent).replace('{token}', accessToken) + '\n';
          thisNode = partKeyNodeSet.iterateNext();
        }
        
        return urls;
    };
    
    var processSeasonChildrenCallback = function(xml) {
        displayTextInNewTab(processSeasonChildren(xml));
    };

    self.init = function() {
        if (typeof localStorage.myPlexAccessToken != "undefined") {
            getXml(apiResourceUrl.replace('{token}', localStorage.myPlexAccessToken), getMetadata);
        } else {
            alert("You are currently not browsing or logged into a Plex web environment.");
        }
    };

    return self;
}());

plxDwnld.init();