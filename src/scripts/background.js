import ext from "./utils/ext";
import storage from "./utils/storage";

window.ext = ext

class Queue {
    constructor(id) {
        this.tabId = id;
        this.q = []
        this.len = 0
    }
    push(cmd) {
        this.q.push(cmd)
        this.len++
    }
    next() {
        let queue = this.q
        if (queue.length <= this.len) return
        let cmd = queue[0]
        console.log("出队", this.tabId, cmd);
        ext.tabs.sendMessage(this.tabId, { cmd }, (ret) => {
            console.log(cmd, "返回值", ret)
            if (ret && ret.cmd == cmd) {
                // 执行成功
                queue.shift()
                this.next(this.tabId)
            }
        });
    }
    commit() {
        this.len = 0
        this.next()
    }
}

class CmdQueue {
    constructor() {
        this.q = {}
        this.tab = {}
    }
    /**
     * @param {Number} id 
     * @returns {Queue}
     */
    get(id) {
        return this.q[id] = this.q[id] || new Queue(id)
    }
    listen() {
        if (this.listening) return this
        this.listening = true
        ext.runtime.onMessage.addListener((data, sender, sendResponse) => {
            let op = this[data.op]
            let tab = sender.tab
            if (typeof op === "function") {
                console.log(`${data.op} tab(${tab.id})`, data)
                op.apply(this, [tab, data])
            } else {
                console.log("未知消息", data, sender)
            }
        });
        ext.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === "complete") {
                this.get(tabId).next()
            }
        });
        return this
    }
    push({ id }, { cmd }) {
        this.get(id).push(cmd)
    }
    commit({ id }) { // 0 
        this.get(id).commit(cmd)
    }
}

window.cmd = new CmdQueue().listen()