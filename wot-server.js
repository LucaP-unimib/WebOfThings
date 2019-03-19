var restApp = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model'),
  fs = require('fs');


var createServer = function (port, secure) {
  if (process.env.PORT) port = process.env.PORT;
  else if (port === undefined) port = resources.customFields.port;
  if (secure === undefined) secure = resources.customFields.secure;

  initPlugins(); //Start the internal hardware plugins

  if(secure) { //We're not ging to run it in secure mmode in this version
    var https = require('https'); //If in secure mode, import the HTTPS module
    var certFile = './resources/caCert.pem'; //The actual certificate file of the server
    var keyFile = './resources/privateKey.pem'; //The private key of the server generated earlier
    var passphrase = 'webofthings'; //The password of the private key

    var config = {
      cert: fs.readFileSync(certFile),
      key: fs.readFileSync(keyFile),
      passphrase: passphrase
    };

    return server = https.createServer(config, restApp) //Create an HTTPS server using the config object
      .listen(port, function () {
        wsServer.listen(server); //By passing it the server you create, the WebSocket library will automatically detect and enable TLS support
        console.log('Secure WoT server started on port %s', port);
    })
  } else {
    var http = require('http');
    return server = http.createServer(restApp)
      .listen(process.env.PORT || port, function () {
        wsServer.listen(server);
        console.log('Insecure WoT server started on port %s', port);
    })
  }
};

function initPlugins() {
  var LockPlugin = require('./plugins/internal/lockPlugin').LockPlugin;
  var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
  var Dht22Plugin = require('./plugins/internal/dht22Plugin').Dht22Plugin;

  pirPlugin = new PirPlugin({'simulate': true, 'frequency': 5000});
  pirPlugin.start();
  
  lockPlugin = new LockPlugin({'simulate': true, 'frequency': 5000});
  lockPlugin.start();

  dht22Plugin = new Dht22Plugin({'simulate': true, 'frequency': 10000});
  dht22Plugin.start();
}

module.exports = createServer;

process.on('SIGINT', function () {
  lockPlugin.stop();
  pirPlugin.stop();
  dht22Plugin.stop();
  console.log('------TERMINATED------');
  process.exit();
});
