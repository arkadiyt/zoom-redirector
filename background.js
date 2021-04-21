(function(){

	'use strict';

	const handleTabUpdate = function(tabId, changeInfo, tab){
		if(changeInfo.url){
			const url = new URL(changeInfo.url);
			const match = /^\/[js]\/(\d+)\/?$/.exec(url.pathname);
			if(match === undefined || match[1] === undefined){
				return;
			}
			const mapping = {
				'j': '/join',
				's': '/start'
			};
			const conferenceType = mapping[match[0].charAt(1)];
			const conferenceId = encodeURIComponent(match[1]);
			const conferencePassword = url.searchParams.get('pwd');
			url.protocol = 'https:';
			url.pathname = 'wc' + conferenceType + '/' + conferenceId;
			if(conferencePassword){
				url.search = '?pwd=' + conferencePassword;
			}
			chrome.tabs.update(
				tabId,
				{
					url: url.href
				}
			);
		}
	};
	chrome.tabs.onUpdated.addListener(
		handleTabUpdate,
		{
			urls: [
				'*://*.zoom.us/j/*',
				'*://*.zoom.us/s/*',
				'*://*.zoomgov.com/j/*',
				'*://*.zoomgov.com/s/*'
			]/*, //supported only from Firefox 88+
			properties: [
				'url'
			]*/
		}
	);

}());
