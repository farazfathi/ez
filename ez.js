// version 1.0.6
const ezError = (string) => {
    console.log("EZ ERROR: " + string)
    return false
}
const jsonEncode = (data) => { return JSON.parse(data) }
const jsonDecode = (data) => { return JSON.stringify(data) }

const isElement = (el) => { return (typeof el == "object" && el.outerHTML != undefined) ? true : false }
const isStr = (data) => { return (typeof data == "string") ? true : false }
const isBool = (data) => { return (typeof data == "boolean") ? true : false }
const isInt = (data) => { return (typeof data == "number") ? true : false }
const isArray = (value) => {
    let response = false
    if (typeof value == "object")
        if (value.length != undefined) response = true
    return response;
}
const isObj = (value) => {
    let response = false
    if (typeof value == "object")
        if (value.length == undefined) response = true
    return response;
}
const inArray = (item, arr) => {
    let err = false
    let response = false
    if (!isArray(arr)) err = "array cant be " + typeof arr
    if (!err) {
        each(arr, (a) => { if (a == item) response = true })
        return response
    } else console.log("EZ ERROR: " + err)
}
const inObject = (value, data, target = false) => {
    let response = false;
    if (!isObj(data)) ezError("data most be an object")
    else {
        if (!target) {
            each(data, (k, v) => {
                if (k == value) response = true
                if (v == value) response = true
                if (isArray(v))
                    if (inArray(v, value)) response = true
                if (!response)
                    if (isObj(v)) response = inObject(value, v)
            })
        } else {
            if (!inArray(target, ['keys', 'values'])) ezError("target only can be 'keys' or 'values'")
            else {
                if (target == "keys") each(data, (k, v) => { if (k == value) response = true })
                else {
                    each(data, (k, v) => {
                        if (v == value) response = true
                        if (isArray(v))
                            if (inArray(v, value)) response = true
                        if (!response)
                            if (isObj(v)) response = inObject(value, v, target)
                    })
                }
            }
        }
    }
    console.log(response);
}
const split = (value, by) => { return value.split(by) }
const strReplace = (target, value, into, count = 1) => {
    rep(count, () => into = into.replace(target, value))
    return into
}
const strReplaceAll = (target, value, into) => { return into.replaceAll(target, value) }
const el = (target, debug = true) => {
    if (isStr(target)) {
        let targets = document.querySelectorAll(target);
        if (debug && targets.length == 0) console.log("EZ ERROR: undefined " + target)
        if (targets.length != 0) return targets
    }
    if (typeof target == "object") {
        if (target == document || target == window) return [target]
        if (isArray(target)) return target
        if (isElement(target)) return [target]
    }
}
const rep = (start, to = false, change = false, _function = false) => {
    if (!_function && !change && to != false)
        for (let i = 0; i < start; i++) to(i)
    if (to != false && change != false && !_function) {
        if (start > to)
            for (let i = start; i > to; i--) change(i)
        else
            for (let i = start; i < to; i++) change(i)
    }
    if (to != false && change != false && _function != false) {
        if (start > to)
            for (let i = start; i > to; i -= change) _function(i)
        else
            for (let i = start; i < to; i += change) _function(i)
    }
}
const appendAfter = (target, value) => {
    target = el(target);
    if (target == undefined) return false
    if (isElement(value)) value = outHTML(value)
    each(target, (t) => outHTML(t, outHTML(t) + value))
}
const appendBefore = (target, value) => {
    target = el(target);
    if (target == undefined) return false
    if (isElement(value)) value = outHTML(value)
    each(target, (t) => outHTML(t, value + outHTML(t)))
}
const queryDetails = (query) => {
    let data = { tag: "", class: [], id: "", attributes: {}, html: "" },
        on_get = false,
        class_number = -1,
        attr_key = "",
        attr_val = ""
    each(query.split(""), (q) => {
        if (q == "@" && on_get != "attr_val") on_get = "html"
        if (on_get != "html") {
            if (q == "." && on_get != "attr_val") {
                class_number++
                on_get = "class"
            }
            if (q == "#") on_get = "id"
            if (q == "[") on_get = "attr_key"
            if (q == "=") on_get = "attr_val"
            if (q == "]") on_get = "attr_finish"
        }
        if (!on_get) data.tag += q
        else {
            if (on_get == "class" && q != ".") {
                if (data.class[class_number] == undefined) data.class[class_number] = q
                else data.class[class_number] += q
            }
            if (on_get == "id" && q != '#') data.id += q
            if (on_get == "attr_key" && q != "[") attr_key += q
            if (on_get == "attr_val" && q != "=") attr_val += q
            if (on_get == "attr_finish") {
                data.attributes[attr_key] = attr_val
                attr_key = ""
                attr_val = ""
            }
            if (on_get == "html" && q != "@") data.html += q
        }
    })
    if (data.tag == "") data.tag = "div"
    if (data.attributes == {}) delete data.attributes
    if (data.id == "") delete data.id
    if (data.html == "") delete data.html
    if (data.class == []) delete data.class
    return data
}
const loop = (_function, s, times = false) => {
    let _times = 0
    return inter = setInterval(() => {
        _times++
        _function(_times)
        if (times != false)
            if (_times == times) clearInterval(inter)
    }, s * 1000)
}
const hide = (target) => {
    target = el(target)
    if (target == undefined) return false
    each(target, (t) => css(t, "display", "none"))
}
const show = (target) => {
    target = el(target)
    if (target == undefined) return false
    each(target, (t) => css(t, "display", "block"))
}
const loopEnd = (data) => clearInterval(data)
const timeOut = (_function, s) => { return setTimeout(() => _function(), s * 1000) }
const objectKeys = (obj) => {
    let data = [];
    each(obj, (k, v) => data.push(k))
    return data
}
const objectValues = (obj) => {
    let data = [];
    each(obj, (k, v) => data.push(v))
    return data
}
const webApp = (data) => {
    webApp_data = data
    urlChanged(window.location.pathname, false)
    click("a", (a) => {
        urlChanged(attr(a, "href"))
        return false
    })
    window.addEventListener("popstate", () => urlChanged(window.location.pathname, false))
    return false
}
const each = (target, _function) => {
    let _el = el(target, false)
    if (_el == undefined) {
        if (typeof target == "string") target.split("").forEach((e) => _function(e))
        if (typeof target == "number") {
            if (target >= 0)
                for (var _i = 0; _i < target; _i++) _function(_i)
            else
                for (let _i = 0; _i > target; _i--) _function(_i)
        }
        if (typeof target == "boolean") console.log("EZ ERROR: target cant be boolean")
        if (typeof target == "function") console.log("EZ ERROR: target cant be function")
        if (typeof target == "object") {
            if (isObj(target))
                for (let [k, v] of Object.entries(target)) _function(k, v)
            else target.forEach((e) => _function(e))
        }
    } else _el.forEach((e) => _function(e))
}
const attr = (target, attribute, new_value = false) => {
    let err = false
    let _target = el(target);
    if (_target == undefined) return false
    if (typeof attribute == "function") err = "attribute cant be a function"
    if (typeof attribute == "boolean") err = "attribute cant be a function"
    if (typeof attribute == "number") attribute = String(attribute);
    if (!new_value) {
        if (typeof attribute == "string") {
            if (_target[0].attributes[attribute] == undefined) console.log("EZ ERROR: " + attribute + " undefined");
            else return _target[0].attributes[attribute].value
        }
        if (typeof attribute == "object") {
            if (attribute[0] == undefined) each(attribute, (k, v) => attr(target, k, v))
            else {
                let all_attributes = {};
                each(attribute, (a) => { if (a != undefined) all_attributes[a] = attr(target, a) })
                return all_attributes
            }
        }
    } else each(_target, (t) => t.setAttribute(attribute, new_value))
}
const tag = (target, value = false) => {
    target = el(target)
    if (target == undefined) return false
    if (!value) return target[0].localName
    else {
        let outer = target[0].outerHTML
        let first_removal = 1 + target[0].localName.length
        let true_length = (outer.length - first_removal) - (1) - (target[0].localName.length);
        outer = "<" + value + " " + outer.substr(first_removal, true_length) + value + ">";
        target[0].outerHTML = outer
    }
}
const addClass = (target, value, rewrite = false) => {
    let err = false
    target = el(target);
    if (target == undefined) return false;
    if (isObj(value)) err = "value cant be object"
    if (inArray(typeof value, ["function", "boolean"])) err = "value cant be " + typeof value
    if (err != false) {
        console.log("EZ ERROR: " + err)
        return false
    }
    if (rewrite) each(target, (e) => e.className = "")
    each(target, (e) => {
        if (inArray(typeof value, ["string", "number"])) e.classList.add(value)
        if (isArray(value)) each(value, (v) => e.classList.add(v))
    })
}
const hasClass = (target, value) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    if (inArray(typeof value, ['function', 'boolean'])) err = "value cant be " + typeof value
    if (isObj(value)) err = "value cant be object"
    if (err != false) {
        console.log("EZ ERROR: " + err);
        return false
    }
    let matchs = 0
    let wants = []
    if (typeof value == "string") wants.push(value)
    if (isArray(value)) wants = value;
    each(wants, (w) => {
        if (target[0].classList.contains(w)) matchs++
    })
    if (matchs == wants.length) return true;
    else return false
}
const delClass = (target, value = true) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    if (isObj(value)) err = "value cant be object"
    if (typeof value == 'function') err = "value cant be function"
    if (err != false) {
        console.log("EZ ERROR: " + err)
        return false
    }
    each(target, (t) => {
        if (value == true) t.className = "";
        else {
            if (inArray(typeof value, ['number', 'string'])) t.classList.remove(value)
            if (isArray(value)) each(value, (v) => t.classList.remove(v))
        }
    })
}
const toggClass = (target, value) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    if (isObj(value)) err = "value cant be object"
    if (typeof value == 'function') err = "value cant be function"
    if (err != false) {
        console.log("EZ ERROR: " + err)
        return false
    }
    each(target, (t) => {
        if (inArray(typeof value, ['number', 'string'])) t.classList.toggle(value)
        if (isArray(value)) each(value, (v) => t.classList.toggle(v))
    })
}
const getClass = (target) => {
    target = el(target)
    if (target == undefined) return false
    return target[0].classList
}
const id = (target, value = false) => {
    target = el(target)
    if (target == undefined) return false
    if (!value) return target[0].id
    if (inArray(typeof value, ['function', "boolean", "object"])) console.log("EZ ERROR: value cant be " + typeof value)
    else each(target, (t) => t.id = value)
}
const src = (target, value = false) => { if (inArray(typeof value, ['string', 'number', 'boolean'])) return attr(target, "src", value) }
const del = (target) => {
    target = el(target)
    if (target == undefined) return false
    each(target, (t) => t.remove())
}
const outHTML = (target, value = false) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    if (!value) {
        if (isElement(target[0])) return target[0].outerHTML;
    } else each(target, (t) => t.outerHTML = value)

}
const html = (target, value = false) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    if (!inArray(typeof value, ['string', 'number', 'boolean'])) err = "value cant be " + typeof value
    if (err != false) {
        console.log("EZ ERROR: " + err);
        return false
    }
    if (!value) return target[0].innerHTML
    each(target, (t) => t.innerHTML = value)
}

const append = (target, value, position = false) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    if (typeof value == 'object')
        if (isElement(value)) value = outHTML(value)
    if (!inArray(typeof value, ['number', 'string', 'object'])) err = "value cant be " + typeof value
    if (err != false) {
        console.log("EZ ERROR: " + err);
        return false
    }
    each(target, (t) => {
        if (isElement(value)) value = outHTML(value)
        if (!position) t.innerHTML += value
        else t.innerHTML = value + t.innerHTML
    })
}

const outHtml = (target) => {
    target = el(target)
    if (target == undefined) return false
    return target[0].outerHTML
}
const check = (target, value = null) => {
    target = el(target)
    if (target == undefined) return false
    if (value == null) return target[0].checked
    if (typeof value != 'boolean') return ezError("value cant be " + typeof value)
    each(target, (t) => { t.checked = value })
}
const placeHolder = (target, value = false) => { if (inArray(typeof value, ['string', 'number', 'boolean'])) return attr(target, "placeholder", value) }
const val = (target, value = false) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    if (!value) return target[0].value
    if (!inArray(typeof value, ['string', 'number'])) {
        console.log("value cant be " + typeof value);
        return false
    }
    each(target, (t) => t.value = value)
}
const child = (target, children) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    if (children != false) {
        let childs = []
        each(target, (t) => each(t.querySelectorAll(children), (c) => childs.push(c)))
        return childs;
    }
}
const parent = (target, all = true) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    let parents = [];
    each(target, (t) => parents.push(t.parentElement))
    return (all) ? parents : parents[0]
}
const removeDuplicates = (data) => {
    let a = [];
    each(data, (d) => {
        if (!inArray(d, a)) a.push(d)
    })
    return a
}
const click = (target, _function = false) => {
    let _target = el(target, false)
    if (_target == undefined || typeof target == "string") {
        bodyListener(target, "click", _function)
        return false
    }
    if (_function != false) each(_target, (t) => t.addEventListener("click", () => _function(t)))
    else each(_target, (t) => t.click())
}
const bodyListener = (_target, event, _function) => {
    if (typeof _target != 'string') {
        console.log("EZ ERROR: cant find target ! use query string to find your element when created")
        return false
    } else {
        el("body")[0].addEventListener(event, (e) => {
            each(e.path, (ep) => { if (ep == document) document = ep })
            let targets = document.querySelectorAll(_target)
            targets = removeDuplicates(targets)
            if (inArray(e.target, targets)) e.target.onclick = (a) => {
                a.preventDefault()
                _function(e.target)
            }
        }, true)
        return false
    }
}
const keyup = (target, _function = false) => {
    let _target = el(target, false)
    if (_target == undefined) {
        bodyListener(target, "keyup", _function)
        return false
    }
    if (_function != false) each(_target, (t) => t.addEventListener("keyup", () => _function(t)))
    else each(_target, (t) => t.keyup())
}
const change = (target, _function = false) => {
    let _target = el(target, false)
    if (_target == undefined) {
        bodyListener(target, "change", _function)
        return false
    }
    if (_function != false) each(_target, (t) => t.addEventListener("change", () => _function(t)))
    else each(_target, (t) => t.change())
}
const onScroll = (target, _function = false) => {
    let _target = el(target, false)
    if (_target == undefined) {
        bodyListener(target, "scroll", _function)
        return false
    }
    if (_function != false) each(_target, (t) => t.addEventListener("scroll", () => _function(t)))
    else each(_target, (t) => t.scroll())
}
const css = (target, key = false, value = false) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    if (typeof value == 'number') value = value.toString()
    if (value != false && typeof value != "string") return ezError("value only can be string")
    if (!value) {
        if (!key) return target[0].style
        if (typeof key == "string") return target[0].style[key]
        if (isObj(key)) each(target, (t) => each(key, (k, v) => css(t, k, v)))
    } else each(target, (t) => t.style[key] = value.toString())
}
const width = (target, new_size = false) => {
    target = el(target)
    if (target == undefined) return false
    if (!new_size) return target[0].offsetWidth
    else each(target, (t) => css(t, "width", new_size))
}
const height = (target, new_size = false) => {
    target = el(target)
    if (target == undefined) return false
    if (!new_size) return target[0].offsetHeight
    else each(target, (t) => css(t, "height", new_size))
}
const paramsToString = (data) => {
    let formBody = [];
    for (let property in data) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
}
const create = (data = { tag: "div" }) => {
    if (isStr(data)) {
        let convert = {}
        each(queryDetails(data), (dk, dv) => convert[dk] = dv)
        data = convert
    }
    if (data.$ != undefined) each(queryDetails(data.$), (dk, dv) => data[dk] = dv)
    let line_element = document.createElement(data.tag);
    if (data.class != undefined) addClass(line_element, data.class)
    if (data.attributes != undefined) attr(line_element, data.attributes)
    if (data.html != undefined) html(line_element, data.html)
    if (data.value != undefined) val(line_element, data.value)
    if (data.src != undefined) src(line_element, data.src)
    if (data.id != undefined) id(line_element, data.id)
    if (data.placeholder != undefined) placeHolder(line_element, data.placeholder)
    if (data.alt != undefined) attr(line_element, "alt", data.alt)
    if (data.name != undefined) attr(line_element, "name", data.name)
    if (data.type != undefined) attr(line_element, "type", data.type)
    if (data.href != undefined) attr(line_element, "href", data.href)
    if (data.css != undefined) css(line_element, data.css)
    if (data.events != undefined) each(data.events, (k, f) => {
        if (k == "click") click(line_element, () => f(line_element))
        if (k == "keyup") keyup(line_element, () => f(line_element))
        if (k == "change") change(line_element, () => f(line_element))
        if (k == "onScroll") onScroll(line_element, () => f(line_element))
    })
    if (data._ != undefined) data.childrens = data._
    if (isObj(data.childrens)) data.childrens = [data.childrens]
    if (isStr(data.childrens)) data.childrens = [queryDetails(data.childrens)]
    if (data.childrens != undefined) each(data.childrens, (c) => append(line_element, create(c)))
    return line_element
}

async function fax(url, data = {}) {
    let successFunction = (s) => {},
        errorFunction = (s) => {}
    if (data.success != undefined) {
        successFunction = data.success
        delete data.success
    }
    if (data.error != undefined) {
        errorFunction = data.error
        delete data.error
    }
    let x = {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    }
    let responseType = "text"
    if (data.headers != undefined) {
        each(data.headers, (k, v) => x.headers[k] = v)
        delete data.headers
    }
    if (data.responseType != undefined) {
        responseType = data.responseType
        delete data.responseType
    }
    if (data.method != undefined) x.method = data.method
    if (data.params != undefined) {
        if (inArray(x.method, ['GET', 'DELETE'])) url += "?" + paramsToString(data.params)
        if (x.method == "POST") {
            if (x.headers['Content-Type'] == 'application/x-www-form-urlencoded') x.body = paramsToString(data.params)
            if (x.headers['Content-Type'] == 'application/json') x.body = jsonDecode(data.params)
        }
    }
    each(data, (k, v) => x[k] = v)
    await fetch(url, x).then(response => {
        if (responseType == "text") return response.text()
        if (responseType == "json") return response.json()
    }).then(resp => successFunction(resp)).catch(err => errorFunction(err));
}
const getURL = (url, params, _function = false) => {
    let _fun = (!_function) ? params : _function
    let send_params = (!_function) ? {} : params
    fax(url, { responseType: "text", params: send_params, success: (l) => _fun(l) })
}
const postURL = (url, params, _function = false) => {
    let _fun = (!_function) ? params : _function
    let send_params = (!_function) ? {} : params
    fax(url, { method: "POST", responseType: "text", params: send_params, success: (l) => _fun(l) })
}
const deleteURL = (url, params, _function = false) => {
    let _fun = (!_function) ? params : _function
    let send_params = (!_function) ? {} : params
    fax(url, { method: "DELETE", responseType: "text", params: send_params, success: (l) => _fun(l) })
}
const postJSON = (url, params, _function = false) => {
    let _fun = (!_function) ? params : _function
    let send_params = (!_function) ? {} : params
    fax(url, { method: "POST", responseType: "json", params: send_params, success: (l) => _fun(l) })
}
const getJSON = (url, params, _function = false) => {
    let _fun = (!_function) ? params : _function
    let send_params = (!_function) ? {} : params
    fax(url, { responseType: "json", params: send_params, success: (l) => _fun(l) })
}
const deleteJSON = (url, params, _function = false) => {
    let _fun = (!_function) ? params : _function
    let send_params = (!_function) ? {} : params
    fax(url, { method: "DELETE", responseType: "json", params: send_params, success: (l) => _fun(l) })
}
const createMeta = (http, content) => {
    let meta = document.createElement('meta');
    meta.httpEquiv = http;
    meta.content = content;
    append("head", meta);
}
const setCSS = (link) => append("head", create("link[rel=stylesheet][type=text/css][href=" + link + "]"));
var webApp_data = {}
var webApp_exist_layers = []
const urlChanged = (url, history_change = true) => {
    let target, now_added = [],
        target_name = null,
        maybe_urls = [],
        url_parts = url.split("/");
    if (history_change) window.history.pushState("", "", url)
    if (webApp_data[url] == undefined) {
        if (url.substr(url.length - 1, 1) == "/") url = url.substr(0, url.length - 1)
        each(url_parts, (p) => { if (p != '') maybe_urls.push(url.replace(p, "?")) })
        for (let up = 1; up < url_parts.length; up++) {
            each(maybe_urls, (mb) => {
                each(mb.split("/"), (s) => { if (s != "" && s != "?") maybe_urls.push(mb.replace(s, "?")) })
            })
        }
        each(maybe_urls, (m) => {
            if (webApp_data[m] != undefined) {
                target = webApp_data[m]
                target_name = m
            }
        })
    } else {
        target_name = url
        target = webApp_data[url];
    }
    let target_name_parts = target_name.split("/")
    each(target.childrens, (c) => {
        now_added.push(c.id)
        let after_item
        if (now_added[0] == c.id) {
            after_item = create({ tag: "div", attributes: { article: "starter-item" } });
            append("body", after_item, true)
            after_item = el("div[article=starter-item]")[0].parentNode;
        } else {
            after_item = el("*[article=" + now_added[now_added.length - 2] + "]");
        }
        if (el("*[article=" + c.id + "]") == undefined) {
            if (c.type == "element") {
                if (isObj(c.data)) {
                    if (c.data.$ != undefined) {
                        each(queryDetails(c.data.$), (x, y) => c.data[x] = y)
                        c.data = create(c.data)
                    }
                }
                if (isStr(c.data)) {
                    each(queryDetails(c.data), (x, y) => c.data[x] = y)
                    c.data = create(c.data)
                }
                attr(c.data, "article", c.id)
                appendAfter(after_item, c.data)
            }
            if (c.type == "page") {
                let page = create({ tag: "div", class: "ez-article", attributes: { "article": c.id } });
                let _final_append = (l) => {
                    append(page, l)
                    appendAfter(after_item, page)
                }
                let used_params = 0;
                let most_send = {}
                if (url != target_name) {
                    for (let i = 1; i < target_name_parts.length; i++) {
                        if (target_name_parts[i] == "?") {
                            most_send[c.params[used_params]] = url_parts[i]
                            used_params++
                        }
                    }
                }
                if (c.method == "GET") getURL(c.data, most_send, (l) => _final_append(l))
                if (c.method == "POST") postURL(c.data, most_send, (l) => _final_append(l))
            }
            // if (el("div[article=starter-item]")[0] != undefined) del("div[article=starter-item]")
        }
    })
    each(webApp_exist_layers, (e) => {
        if (!inArray(e, now_added)) del("*[article=" + e + "]")
    })
    webApp_exist_layers = now_added
    return false
}
