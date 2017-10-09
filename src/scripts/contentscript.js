import ext from "./utils/ext";
import storage from "./utils/storage";
import "./utils/jquery"

// co-act,自动登录
if (location.href == "http://112.74.23.97/#@login") {
    window.addEventListener("load", function() {
        setTimeout(function() {
            console.log("co-act,自动登录")
            $(".it").eq(0).val("tangzy")
            $(".it").eq(1).val("tzy123")
            $(".b").click()
        }, 1000)
    })
}