import storage from "../utils/storage";

function getQuery(el, pquery) {
    if (!el) return ""
    var query = (pquery ? pquery + ">" : "") + el.tagName.toLowerCase()
    if (el == document.querySelector(query)) {
        return query
    }
    if (el.id) {
        query += "#" + el.id
        if (el == document.querySelector(query)) {
            return query
        }
    }
    query += "." + el.className.replace(/\s+/g, ".")
    if (el == document.querySelector(query)) {
        return query
    }
    var i = Array.from(el.parentNode.children).indexOf(el) + 1
    query += ":nth-child(" + i + ")"
    if (el == document.querySelector(query)) {
        return query
    }
    if (!pquery) {
        return getQuery(el, getQuery(el.parentNode))
    }
    return ""
}

const TYPES = {
    change: "输入",
    click: "点击"
}

function Action(el, type, value, time) {
    if (type) {
        this.time = time
        this.type = type
        this.el = el
        this.value = value
    } else {
        Object.assign(this, el)
    }
}

Action.prototype.toStirng = function() {
    var s = (this.time / 1000).toFixed(1)
    return `${s}s [${TYPES[this.type]}] $("${this.el}") ${this.value||""}`
}

class Record {
    constructor() {
        this.event = {
            click: (e) => {
                this.addAction("click", e.target)
            },
            change: (e) => {
                this.addAction("change", e.target)
            }
        }
        this.actions = []
        storage.get("scripts", []).then(scripts => this.scripts = scripts)
        this.functions = ["start", "stop", "run", "remove", "list"]
        $(window).bind('beforeunload', () => {
            if (this.recording) {
                this.save()
                return '您录制的脚本尚未保存，确定离开此页面吗？';
            }
        });
    }

    start() {
        if (this.recording) {
            this.shell.message.error("上次录制的脚本尚未保存")
            this.shell.output("上次录制的脚本尚未保存")
            return
        }
        this.recording = true
        this.begin_at = new Date().getTime()
        this.actions = []
        this.href = location.href
        var $body = $(document.body)
        $body.on("click", this.event.click)
        $body.on("change", "input", this.event.change)
        $body.on("change", "textarea", this.event.change)
        $body.on("change", "select", this.event.change)
        this.shell.message.success("开始录制脚本")
        return this
    }

    save(name) {
        if (!this.recording) {
            this.shell.message.error("尚未开始录制")
            this.shell.output("尚未开始录制")
            return
        }
        this.recording = false
        var $body = $(document.body)
        $body.off("click", this.event.click)
        $body.off("change", "input", this.event.change)
        $body.off("change", "textarea", this.event.change)
        $body.off("change", "select", this.event.change)
        if (this.actions.length > 0) {
            if (!name) {
                name = prompt("请输入脚本名", "脚本" + (this.scripts.length + 1))
            }
            if (!name) return
            this.scripts.push({
                name: name,
                href: this.href,
                actions: this.actions
            })
            storage.set("scripts", this.scripts).then(() => {
                this.shell.output("保存成功")
                this.shell.message.success("保存成功")
            })
        } else {
            this.shell.output("没有录制任何动作")
        }
    }

    addAction(type, el, ms) {
        if (!el) return
        let query = getQuery(el)
        if (!ms) ms = new Date().getTime() - this.begin_at
        let action = new Action(query, type, el.value, ms)
        this.actions.push(action)
        console.log(new Action(action).toStirng())
        return this
    }

    get(name) {
        let index = -1
        if (/^\d+$/.test(name)) {
            index = parseInt(name)
        } else {
            index = this.scripts.findIndex(item => name == item.name)
        }
        if (index < 0) {
            this.shell.output("未找到脚本: " + name)
        }
        return this.scripts[index]
    }

    run(name) {
        var script = this.get(name)
        if (script) {
            for (let action of script.actions) {
                this.doAction(action.type, action.el, action.value, action.time)
            }
        }
    }

    remove(name) {
        var script = this.get(name)
        if (script) {
            let index = this.scripts.indexOf(script)
            this.scripts.splice(index, 1)
            storage.set("scripts", this.scripts).then(() => {
                this.shell.output("删除成功")
            })
        }
    }

    doAction(type, el, value, ms) {
        this.shell.output(`${ms}ms $("${el}").${type}(${value})`)
        var el = $(el)
        switch (type) {
            case "change":
                el.val(value)
                break;
            case "click":
                el.click()
                el.focus()
                break;
        }
    }

    list(name) {
        if (name) {
            let script = this.get(name)
            this.shell.output(`脚本名 : ${script.name}`)
            this.shell.output(`href  : ${script.href}`)
            this.shell.output(`动作列表:`)
            for (let action of script.actions) {
                this.shell.output(new Action(action).toStirng())
            }
        } else {
            for (let script of this.scripts) {
                this.shell.output(`href:(${script.href}) 脚本名:(${script.name}) 动作:(${script.actions.length}条)`)
            }
        }
    }

    provideParams(key, data, add) {
        var items = []
        if (data.index == 2) {
            for (let i = 0; i < this.scripts.length; i++) {
                const script = this.scripts[i];
                var desc = []
                desc.push(`脚本名: ${script.name}`)
                desc.push(`href : ${script.href}`)
                desc.push(`动作列表:`)
                for (let action of script.actions) {
                    desc.push(new Action(action).toStirng())
                }
                items.push({ label: script.name || i, desc: desc.join("\n") })
            }
        }
        return items
    }
}

export default Record