'use strict';

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  if (details.type !== 'main_frame' || details.method !== 'GET') {
    return;
  }

  const url = new URL(details.url);
  const match = /^\/j\/(\d+)\/?$/.exec(url.pathname);
  if (match === undefined || match[1] === undefined) {
    return;
  }

  // Save a round trip if the user requested a non-https url
  // At time of writing, Zoom has non-preloaded HSTS deployed
  url.protocol = 'https:';
  url.pathname = '/wc/join/' + encodeURIComponent(match[1]);
  return {
    redirectUrl: url.href
  }
}, { urls: ['*://*.zoom.us/j/*'] }, ['blocking']);
