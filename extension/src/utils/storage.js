import ext from "./ext";

const storage = ext.storage.sync ? ext.storage.sync : ext.storage.local;

export const getStorage = keys => {
  return new Promise(resolve => {
    storage.get(keys, data => {
      resolve(data);
    });
  });
};

export const saveStorage = data => {
  return new Promise(resolve => {
    storage.set(data, () => {
      resolve();
    });
  });
};

export default storage;
