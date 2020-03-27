'use strict';

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  if (details.type !== 'main_frame' || details.method !== 'GET') {
    return;
  }

  const url = new URL(details.url);
  url.protocol = 'https:';

  // Rewrite zoom.us/j/<id> -> zoom.us/wc/<id>/join
  // Rewrite zoom.us/s/<id> -> zoom.us/wc/<id>/start
  let match = /^\/[js]\/(\d+)\/?$/.exec(url.pathname);
  if (match !== null && match[1] !== undefined) {
    const ending = match[0][1];
    const mapping = {'j': '/join', 's': '/start'};
    url.pathname = '/wc/' + encodeURIComponent(match[1]) + mapping[ending];
    return {
      redirectUrl: url.href
    };
  }

  // Rewrite zoom.us/wc/join/<id> -> zoom.us/wc/<id>/join
  match = /^\/wc\/join\/(\d+)\/?$/.exec(url.pathname);
  if (match !== null && match[1] !== undefined) {
    url.pathname = '/wc/' + encodeURIComponent(match[1]) + '/join';
    return {
      redirectUrl: url.href
    };
  }
}, { urls: ['*://*.zoom.us/j/*', '*://*.zoom.us/s/*', '*://*.zoom.us/wc/join/*'] }, ['blocking']);
