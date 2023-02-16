const badgeColor = [255, 0, 0, 255];
const ruleIds = ['zoom-redirect'];

chrome.action.onClicked.addListener(async () => {
  const disabled = !(await chrome.storage.local.get(['disabled'])).disabled;
  const badgeText = disabled ? 'X' : '';
  const ruleSetOptions = disabled ? {
    disableRulesetIds: ruleIds
  } : {
    enableRulesetIds: ruleIds
  };
  chrome.action.setBadgeText({text: badgeText});
  chrome.action.setBadgeBackgroundColor({color: badgeColor});
  chrome.declarativeNetRequest.updateEnabledRulesets(ruleSetOptions);
  chrome.storage.local.set({disabled: disabled});
});
