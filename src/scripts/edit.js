import ext from './utils/ext'
import storage from './utils/storage'

function getRoute(href) {
    href = href || location.href
    var m = /^([^:]+):\/\/([^?#/]*)(\/[^?#/]+)*(\?[^#]*)?(#[^?]*)?(\?[^#]*)?/.exec(location.href)
    if (!m) return null
    return {
        protocal: m[1],
        host: m[2],
        uri: m[3],
        query: m[4],
        path: m[5],
        state: m[6]
    }
}

window.ext = ext
const edit = document.getElementById("edit")
let route = getRoute()
// let storage.get("")
edit.addEventListener("keypress", function(e) {
    document.title = "已编辑"
})
document.addEventListener("keydown", function(e) {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
        console.log(edit.value)
        document.title = "已保存"
        e.preventDefault()
    }
})