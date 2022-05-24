const el = (target, debug = true) => {
    if (debug && inArray(typeof target, ["number", "boolean", "function"])) console.log("EZ ERROR: target cant be " + typeof target)
    if (typeof target == "string") {
        let targets = document.querySelectorAll(target);
        if (debug && targets.length == 0) console.log("EZ ERROR: undefined " + target)
        if (targets.length != 0) return targets
    }
    if (typeof target == "object") {
        if (target == document || target == window) return [target]
        if (!isElement(target)) {
            if (debug) console.log("EZ ERROR: target cant be array")
        } else return [target]
    }
}
const isArray = (value) => {
    let response = false
    if (typeof value == "object")
        if (value.length != undefined) response = true
    return response;
}
const isObject = (value) => {
    let response = false
    if (typeof value == "object")
        if (value.length == undefined) response = true
    return response;
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
            if (isObject(target))
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
const inArray = (item, arr) => {
    let err = false
    let response = false
    if (!isArray(arr)) err = "array cant be " + typeof arr
    if (!err) {
        each(arr, (a) => { if (a == item) response = true })
        return response
    } else console.log("EZ ERROR: " + err)
}
const addClass = (target, value, rewrite = false) => {
    let err = false
    target = el(target);
    if (target == undefined) return false;
    if (isObject(value)) err = "value cant be object"
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
    if (isObject(value)) err = "value cant be object"
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
    if (isObject(value)) err = "value cant be object"
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
    if (isObject(value)) err = "value cant be object"
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
const isElement = (el) => { return (typeof el == "object" && el.outerHTML != undefined) ? true : false }
const outHTML = (target) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    if (isElement(target[0])) return target[0].outerHTML;
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
    if (!inArray(typeof value, ['number', 'string'])) err = "value cant be " + typeof value
    if (err != false) {
        console.log("EZ ERROR: " + err);
        return false
    }
    each(target, (t) => {
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
    let err = false
    target = el(target)
    if (target == undefined) return false
    if (value == null) return target[0].checked
    if (typeof value != 'boolean') err = "value cant be " + typeof value
    if (err != false) {
        console.log("EZ ERROR: " + err);
        return false
    }
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
const parent = (target) => {
    let err = false
    target = el(target)
    if (target == undefined) return false
    let parents = [];
    each(target, (t) => parents.push(t.parentElement))
    return parents
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
    if (_target == undefined) {
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
            if (inArray(e.target, targets)) _function(e.target)
        })
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
const ezError = (string) => {
    console.log("EZ ERROR: " + string)
    return false
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
        if (isObject(key)) each(target, (t) => each(key, (k, v) => css(t, k, v)))
    } else each(target, (t) => t.style[key] = value.toString())
}
const width = (target, new_size = false) => {}
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
    let line_element = document.createElement(data.tag);
    if (data.class != undefined) addClass(line_element, data.class)
    if (data.attributes != undefined) attr(line_element, data.attr)
    if (data.html != undefined) html(line_element, data.html)
    if (data.value != undefined) val(line_element, data.value)
    if (data.src != undefined) val(line_element, data.src)
    if (data.id != undefined) id(line_element, data.id)
    if (data.placeholder != undefined) placeHolder(line_element, data.placeholder)
    if (data.alt != undefined) attr(line_element, "alt", data.alt)
    if (data.name != undefined) attr(line_element, "name", data.name)
    if (data.type != undefined) attr(line_element, "type", data.type)
    if (data.css != undefined) css(line_element, data.css)
    if (data.events != undefined) each(data.events, (k, f) => {
        if (k == "click") click(line_element, () => f(line_element))
        if (k == "keyup") keyup(line_element, () => f(line_element))
        if (k == "change") change(line_element, () => f(line_element))
        if (k == "onScroll") onScroll(line_element, () => f(line_element))
    })
    if (data.childrens != undefined) each(data.childrens, (c) => append(line_element, create(c)))
    return line_element
}
const jsonEncode = (data) => { return JSON.parse(data) }
const jsonDecode = (data) => { return JSON.stringify(data) }
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
getContent("/ez/test.php", { faraz: 23 }, (v) => {
    console.log(v);
})