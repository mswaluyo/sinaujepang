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

  // Add or update item
  function setItem(key, value) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var req = store.put({ key: key, value: value, updatedAt: Date.now() });
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(req.error); };
      });
    });
  }

  // Get item by key
  function getItem(key) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req = store.get(key);
        tx.oncomplete = function () {
          resolve(req.result ? req.result.value : null);
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
        var req = store.delete(key);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(req.error); };
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

  // Get all by slug (for attempts)
  function getAllBySlug(slug) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var index = store.index('slug_index');
        var req = index.getAll(slug);
        tx.oncomplete = function () { resolve(req.result || []); };
        tx.onerror = function () { reject(req.error); };
      });
    });
  }

  // Delete all items for a slug
  function removeBySlug(slug) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var index = store.index('slug_index');
        var req = index.openCursor(slug);
        var count = 0;
        req.onsuccess = function (e) {
          var cursor = e.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
            count++;
          } else {
            resolve(count);
          }
        };
        req.onerror = function () { reject(req.error); };
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