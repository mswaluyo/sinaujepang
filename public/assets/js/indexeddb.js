// ==========================
// INDEXEDDB UTILITY MODULE
// ==========================
// Ganti localStorage -> IndexedDB untuk penyimpanan skor & attempt.
// Mendukung: setItem, getItem, removeItem, getAll, clear.

(function () {
  'use strict';

  var DB_NAME = 'sinau-jepang-db';
  var DB_VERSION = 1;
  var STORE_NAME = 'jft_data';

  // Open database
  function openDB() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (e) {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = function () {
        resolve(req.result);
      };
      req.onerror = function () {
        reject(req.error);
      };
    });
  }

  // Add or update item — hapus lama dulu, lalu insert baru (1 key = 1 record)
  function setItem(key, value) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        // Hapus record lama dengan key sama
        var getAllReq = store.getAll();
        getAllReq.onsuccess = function () {
          var items = getAllReq.result || [];
          items.forEach(function (it) {
            if (it.key === key) store.delete(it.id);
          });
          // Insert baru
          store.put({ key: key, value: value, updatedAt: Date.now() });
        };
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }
  function getItem(key) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req = store.getAll();
        tx.oncomplete = function () {
          var items = req.result || [];
          var found = items.filter(function (it) { return it.key === key; });
          resolve(found.length ? found[found.length - 1].value : null);
        };
        tx.onerror = function () { reject(req.error); };
      });
    });
  }

  // Remove item by key
  function removeItem(key) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var req = store.getAll();
        req.onsuccess = function () {
          var items = req.result || [];
          items.forEach(function (it) {
            if (it.key === key) store.delete(it.id);
          });
        };
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  // Get all items
  function getAll() {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req = store.getAll();
        tx.oncomplete = function () { resolve(req.result || []); };
        tx.onerror = function () { reject(req.error); };
      });
    });
  }

  // Get all items where item.key starts with prefix (simple filter, tanpa index)
  function getAllBySlug(key) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req = store.getAll();
        tx.oncomplete = function () {
          var items = req.result || [];
          var matched = items.filter(function (item) { return String(item.key || "").indexOf(key) === 0; });
          resolve(matched);
        };
        tx.onerror = function () { reject(req.error); };
      });
    });
  }

  // Delete all items for a key
  function removeBySlug(key) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var req = store.getAll();
        var count = 0;
        req.onsuccess = function (e) {
          var items = req.result || [];
          items.forEach(function (item) {
            if (item.key === key) { store.delete(item.id); count++; }
          });
        };
        tx.oncomplete = function () { resolve(count); };
        tx.onerror = function () { reject(req.error); };
      });
    });
  }

  // Clear all data
  function clearAll() {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var req = store.clear();
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(req.error); };
      });
    });
  }

  // Initialize module
  window.IndexedDB = {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem,
    getAll: getAll,
    getAllBySlug: getAllBySlug,
    removeBySlug: removeBySlug,
    clearAll: clearAll
  };
})();