import ext from "./utils/ext";
import storage from "./utils/storage";
import "./utils/jquery"
import Shell from './libs/ShellEx'
import Record from './libs/Record'
import go from './libs/go'
import sleep from './libs/sleep'

$(document).ready(function() {
    var shell = new Shell()
    var record = new Record()
    shell.use("go", go)
    shell.use("sleep", sleep)
    shell.use("record", record)
    storage.get("shell.show", false).then(function(show) {
        show && shell.show()
    })

    storage.get("cmds", []).then(function(cmds) {
        for (let cmd of cmds) {
            let m = { exports: {} }
            try {
                new Function("module", "exports", "$", "shell", cmd)(m, m.exports, shell, $)
                if (typeof m.exports === "function" || Object.keys(m.exports).length) {
                    shell.use(cmd.key, m.exports)
                }
            } catch (err) {
                console.log(`载入脚本[${cmd.name}]失败`, err)
            }
        }
    })
})