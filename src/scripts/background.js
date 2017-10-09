import ext from "./utils/ext";
import storage from "./utils/storage";

ext.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
        storage.get('tabId', function(s) {
            if (s.tabId === tabId) {
                ext.tabs.sendMessage(tabId, { action: "start" })
            }
        });
    }
});