/**
 * Ripple Client Configuration
 *
 * Copy this file to config.js and edit to suit your preferences.
 */
var Options = {
  // Local domain
  //
  // Which domain should ripple-client consider native?
  domain: "broteas.ripple.com",

  // Rippled to connect
  server: {
    "trusted" : true,
    "trace" : true,
    "websocket_ip" : "s1.ripple.com",
    "websocket_port" : 443,
    "websocket_ssl" : true /**/
/*    "websocket_ip" : "127.0.0.1",
    "websocket_port" : 5006,
    "websocket_ssl" : false /**/
  },
  blobvault : "https://blobvault.payward.com",

  // If set, login will persist across sessions (page reload). This is mostly
  // intended for developers, be careful about using this in a real setting.
  persistent_auth : false,

  // Number of transactions each page has in balance tab notifications
  transactions_per_page: 50,

  // Configure bridges
  bridge: {
    // Outbound bridges
    out: {
      // Bitcoin outbound bridge
//    "bitcoin": "localhost:3000"
//    "bitcoin": "https://www.bitstamp.net/ripple/bridge/out/bitcoin/"
    }
  }
};

// Load client-side overrides
if (store.enabled) {
  $.extend(true, Options, JSON.parse(store.get('ripple_settings') || "{}"));
}

