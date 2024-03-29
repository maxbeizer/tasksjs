storageEngine = function() {
  var initialized = false;
  var initializedObjectStores = {};
  function getStorageObject(type) {
    var item = localStorage.getItem(type);
    var parsedItem = JSON.parse(item);
    return parsedItem;
  }

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

      var storageItem = getStorageObject(type);
      storageItem[obj.id] = obj;
      localStorage.setItem(type, JSON.stringify(storageItem));
      successCallback(obj);
    },

    findAll: function(type, successCallback, errorCallback) {
      if(!initialized) {
        errorCallback('storage_api_not_supported', 'The web storage api has not been intialized');
      } else if (!initializedObjectStores[type]) {
        errorCallback('store_is_not_intialized', 'The object store ' +type+ ' has not been intialized');
      }

      var result = [];
      var storageItem = getStorageObject(type);
      $.each(storageItem, function(i, v) {
        result.push(v);
      });

      successCallback(result);
    },

    delete: function(type, id, successCallback, errorCallback) {
      if(!initialized) {
        errorCallback('storage_api_not_supported', 'The web storage api has not been intialized');
      } else if (!initializedObjectStores[type]) {
        errorCallback('store_is_not_intialized', 'The object store ' +type+ ' has not been intialized');
      }

      var storageItem = getStorageObject(type);
      if (storageItem[id]) {
        delete storageItem[id];
        localStorage.setItem(type, JSON.stringify(storageItem));
        successCallback(id);
      } else {
        errorCallback("object_not_found", "The object requested could not be found");
      }
    },

    findById: function(type, id, successCallback, errorCallback) {
      if(!initialized) {
        errorCallback('storage_api_not_supported', 'The web storage api has not been intialized');
      } else if (!initializedObjectStores[type]) {
        errorCallback('store_is_not_intialized', 'The object store ' +type+ ' has not been intialized');
      }

      var storageItem = getStorageObject(type);
      var result = storageItem[id];
      successCallback(result);
    },

    findByProperty: function(type, propertyName, propertyValue, successCallback, errorCallback) {
      if(!initialized) {
        errorCallback('storage_api_not_supported', 'The web storage api has not been intialized');
      } else if (!initializedObjectStores[type]) {
        errorCallback('store_is_not_intialized', 'The object store ' +type+ ' has not been intialized');
      }

      var result = [];
      var storageItem = getStorageObject(type);
      $.each(storageItem, function(i, v) {
        if (v[propertyName] === propertyValue) {
          result.push(v);
        }
      });

      successCallback(result);
    }
  }
}();
