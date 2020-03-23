'use strict';

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  if (details.type !== 'main_frame' || details.method !== 'GET') {
    return;
  }

  const url = new URL(details.url);
  const match = /^\/[j|s]\/(\d+)\/?$/.exec(url.pathname);
  if (match === undefined || match[1] === undefined) {
    return;
  }

  const ending = match[0][1];
  const mapping = {'j' : '/join', 's' : '/start'};

  // Save a round trip if the user requested a non-https url
  // At time of writing, Zoom has non-preloaded HSTS deployed
  url.protocol = 'https:';
  url.pathname = '/wc/' + encodeURIComponent(match[1]) + mapping[ending];
  return {
    redirectUrl: url.href
  }
}, { urls: ['*://*.zoom.us/j/*', '*://*.zoom.us/s/*'] }, ['blocking']);
