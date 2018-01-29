import ext from "./ext";
const storage = ext.storage.sync ? ext.storage.sync : ext.storage.local

export function get(key, def) {
    return new Promise((resolve, reject) => {
        storage.get(key, function(ret) {
            resolve(ret[key] || def)
        })
    })
}

export function set(key, value) {
    return new Promise((resolve, reject) => {
        storage.set({
            [key]: value
        }, resolve)
    })
}

export default {
    get,
    set
}