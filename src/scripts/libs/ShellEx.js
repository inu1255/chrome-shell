import Shell from 'dom-shell'
import ext from "../utils/ext";

class ShellEx extends Shell {
    constructor(config) {
        super(config)
        ext.runtime.onMessage.addListener((data, sender, sendResponse) => {
            console.log(data, sender)
            if (!sender.tab && data.cmd) {
                this.run(data.cmd, function(ret) {
                    sendResponse({ cmd: data.cmd })
                })
                return true
            }
        });
        console.log(this)
        this.use("cmd", {
            push: this.push.bind(this),
            commit: this.commit.bind(this),
        })
    }
    show(){
        super.show()
        storage.set("shell.show", true)
    }
    hide(){
        super.hide()
        storage.set("shell.show", false)
    }
    commit() {
        ext.runtime.sendMessage({ op: "commit" })
    }
    push(cmd) {
        if (cmd) {
            ext.runtime.sendMessage({ op: "push", cmd })
        }
    }
}

export default ShellEx