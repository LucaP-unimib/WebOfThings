var WebSocketServer = require('ws').Server,
  url = require('url'),
  resources = require('./../resources/model'),
  utils = require('./../utils/utils');

exports.listen = function (server) {
  var wss = new WebSocketServer({server: server}); //Create a WebSocket server by passing it the Express server
  console.info('WebSocket server started...');
  wss.on('connection', function (ws) { //Triggered after a protocol upgrade when the client connected
    var reqUrl = url.parse(ws.upgradeReq.url, true);
    if (!utils.isTokenValid(reqUrl.query.token)) {
      ws.send(JSON.stringify({'error': 'Invalid access token.'}));
    }
	else {
		try{
			observeResource();	//Start observing the resource		
		} catch(e) {
			console.log('Unable to observe %s resource!', url);
		}
	}
  });
};

function selectResouce(url) { //This function takes a request URL and returns the corresponding resource
  var parts = url.split('/');
  parts.shift();
  var result;
  if (parts[0] === 'actions') {
    result = resources.links.actions.resources[parts[1]].data;
  } else {
    result = resources.links.properties.resources[parts[1]].data;
  }
  return result;
}

function observeResource(url) {	//This function checks for updates relevant to the url's resource via polling, if something has changed the socket sends the updated resource
	var res = selectResouce(reqUrl.pathname);
	setInterval(function(){
		if(selectResouce(reqUrl.pathname) != res) {
			res = selectResouce(reqUrl.pathname);
			ws.send(selectResouce(reqUrl.pathname));
		}
	}, 1000);
}
