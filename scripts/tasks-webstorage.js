storageEngine = function() {
  var initialized = false;
  var initializedObjectStores = {};

  return {
    init: function(successCallback, errorCallback) {
      if (window.localStorage) {
        initialized = true;
        successCallback(null)
      } else {
        errorCallback('storage_api_not_supported', 'The web storage api is not supported');
      }
    },

    initObjectStore: function(type, successCallback, errorCallback) {
      if (!initialized) {
        errorCallback('storage_api_not_supported', 'The web storage api has not been intialized');
      } else if (!localStorage.getItem(type)) {
        localStorage.setItem(type, JSON.stringify({}));
      }

      initializedObjectStores[type] = true;
      successCallback(null)
    },

    save: function(type, obj, successCallback, errorCallback) {
      if (!initialized) {
        errorCallback('storage_api_not_supported', 'The web storage api has not been intialized');
      } else if (!initializedObjectStores[type]) {
        errorCallback('store_is_not_intialized', 'The object store ' +type+ ' has not been intialized');
      }

      if (!obj.id) {
        obj.id = $.now();
      }

      var savedTypeString = localStorage.getItem(type);
      var storageItem = JSON.parse(savedTypeString);
      storageItem[obj.id] = obj;
      localStorage.setItem(type, JSON.stringify(storageItem));
      successCallback(obj);
    },

    findAll: function(type, successCallback, errorCallback) {
    },

    delete: function(type, id, successCallback, errorCallback) {
    },

    findById: function(type, id, successCallback, errorCallback) {
    },

    findByProperty: function(type, propertyName, successCallback, errorCallback) {
    }
  }
}();
