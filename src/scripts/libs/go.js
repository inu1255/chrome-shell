function go(where, n) {
    if (where == "back") {
        history.back()
    } else if (where == "forward") {
        history.forward()
    } else {
        location.href = where
    }
}
go.provideCompletionItems = function(k, data, add) {
    if (data.index == 0)
        return [k]
    if (data.index == 1) {
        return ["back", "forward"]
    }
}

export default go