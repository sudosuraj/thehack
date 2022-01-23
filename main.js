(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    1: [function(require, module, exports) {
        "use strict";
        var ES = require("es-abstract/es6");
        module.exports = function findIndex(predicate) {
            var list = ES.ToObject(this);
            var length = ES.ToLength(list.length);
            if (!ES.IsCallable(predicate)) {
                throw new TypeError("Array#findIndex: predicate must be a function")
            }
            if (length === 0) return -1;
            var thisArg = arguments[1];
            for (var i = 0, value; i < length; i++) {
                value = list[i];
                if (ES.Call(predicate, thisArg, [value, i, list])) return i
            }
            return -1
        }
    }, {
        "es-abstract/es6": 8
    }],
    2: [function(require, module, exports) {
        "use strict";
        var define = require("define-properties");
        var ES = require("es-abstract/es6");
        var implementation = require("./implementation");
        var getPolyfill = require("./polyfill");
        var shim = require("./shim");
        var slice = Array.prototype.slice;
        var polyfill = getPolyfill();
        var boundShim = function findIndex(array, predicate) {
            ES.RequireObjectCoercible(array);
            var args = slice.call(arguments, 1);
            return polyfill.apply(array, args)
        };
        define(boundShim, {
            implementation: implementation,
            getPolyfill: getPolyfill,
            shim: shim
        });
        module.exports = boundShim
    }, {
        "./implementation": 1,
        "./polyfill": 3,
        "./shim": 4,
        "define-properties": 5,
        "es-abstract/es6": 8
    }],
    3: [function(require, module, exports) {
        "use strict";
        module.exports = function getPolyfill() {
            var implemented = Array.prototype.findIndex && [, 1].findIndex(function(item, idx) {
                return idx === 0
            }) === 0;
            return implemented ? Array.prototype.findIndex : require("./implementation")
        }
    }, {
        "./implementation": 1
    }],
    4: [function(require, module, exports) {
        "use strict";
        var define = require("define-properties");
        var getPolyfill = require("./polyfill");
        module.exports = function shimArrayPrototypeFindIndex() {
            var polyfill = getPolyfill();
            define(Array.prototype, {
                findIndex: polyfill
            }, {
                findIndex: function() {
                    return Array.prototype.findIndex !== polyfill
                }
            });
            return polyfill
        }
    }, {
        "./polyfill": 3,
        "define-properties": 5
    }],
    5: [function(require, module, exports) {
        "use strict";
        var keys = require("object-keys");
        var foreach = require("foreach");
        var hasSymbols = typeof Symbol === "function" && typeof Symbol() === "symbol";
        var toStr = Object.prototype.toString;
        var isFunction = function(fn) {
            return typeof fn === "function" && toStr.call(fn) === "[object Function]"
        };
        var arePropertyDescriptorsSupported = function() {
            var obj = {};
            try {
                Object.defineProperty(obj, "x", {
                    enumerable: false,
                    value: obj
                });
                for (var _ in obj) {
                    return false
                }
                return obj.x === obj
            } catch (e) {
                return false
            }
        };
        var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();
        var defineProperty = function(object, name, value, predicate) {
            if (name in object && (!isFunction(predicate) || !predicate())) {
                return
            }
            if (supportsDescriptors) {
                Object.defineProperty(object, name, {
                    configurable: true,
                    enumerable: false,
                    value: value,
                    writable: true
                })
            } else {
                object[name] = value
            }
        };
        var defineProperties = function(object, map) {
            var predicates = arguments.length > 2 ? arguments[2] : {};
            var props = keys(map);
            if (hasSymbols) {
                props = props.concat(Object.getOwnPropertySymbols(map))
            }
            foreach(props, function(name) {
                defineProperty(object, name, map[name], predicates[name])
            })
        };
        defineProperties.supportsDescriptors = !!supportsDescriptors;
        module.exports = defineProperties
    }, {
        foreach: 18,
        "object-keys": 26
    }],
    6: [function(require, module, exports) {
            "use strict";
            var has = require("has");
            var toPrimitive = require("es-to-primitive/es6");
            var toStr = Object.prototype.toString;
            var hasSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "symbol";
            var $isNaN = require("./helpers/isNaN");
            var $isFinite = require("./helpers/isFinite");
            var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
            var assign = require("./helpers/assign");
            var sign = require("./helpers/sign");
            var mod = require("./helpers/mod");
            var isPrimitive = require("./helpers/isPrimitive");
            var parseInteger = parseInt;
            var bind = require("function-bind");
            var arraySlice = bind.call(Function.call, Array.prototype.slice);
            var strSlice = bind.call(Function.call, String.prototype.slice);
            var isBinary = bind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
            var isOctal = bind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
            var regexExec = bind.call(Function.call, RegExp.prototype.exec);
            var nonWS = ["Â…", "â€‹", "ï¿¾"].join("");
            var nonWSregex = new RegExp("[" + nonWS + "]", "g");
            var hasNonWS = bind.call(Function.call, RegExp.prototype.test, nonWSregex);
            var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;
            var isInvalidHexLiteral = bind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);
            var ws = ["\t\n\v\f\r  áš€á Žâ€€â€â€‚â€ƒ", "", ""].join("")
            var trimRegex = new RegExp("(^[" + ws + "]+)|([" + ws + "]+$)", "g");
            var replace = bind.call(Function.call, String.prototype.replace);
            var trim = function(value) {
                return replace(value, trimRegex, "")
            };
            var ES5 = require("./es5");
            var hasRegExpMatcher = require("is-regex");
            var ES6 = assign(assign({}, ES5), {
                Call: function Call(F, V) {
                    var args = arguments.length > 2 ? arguments[2] : [];
                    if (!this.IsCallable(F)) {
                        throw new TypeError(F + " is not a function")
                    }
                    return F.apply(V, args)
                },
                ToPrimitive: toPrimitive,
                ToNumber: function ToNumber(argument) {
                    var value = isPrimitive(argument) ? argument : toPrimitive(argument, Number);
                    if (typeof value === "symbol") {
                        throw new TypeError("Cannot convert a Symbol value to a number")
                    }
                    if (typeof value === "string") {
                        if (isBinary(value)) {
                            return this.ToNumber(parseInteger(strSlice(value, 2), 2))
                        } else if (isOctal(value)) {
                            return this.ToNumber(parseInteger(strSlice(value, 2), 8))
                        } else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
                            return NaN
                        } else {
                            var trimmed = trim(value);
                            if (trimmed !== value) {
                                return this.ToNumber(trimmed)
                            }
                        }
                    }
                    return Number(value)
                },
                ToInt16: function ToInt16(argument) {
                    var int16bit = this.ToUint16(argument);
                    return int16bit >= 32768 ? int16bit - 65536 : int16bit
                },
                ToInt8: function ToInt8(argument) {
                    var int8bit = this.ToUint8(argument);
                    return int8bit >= 128 ? int8bit - 256 : int8bit
                },
                ToUint8: function ToUint8(argument) {
                    var number = this.ToNumber(argument);
                    if ($isNaN(number) || number === 0 || !$isFinite(number)) {
                        return 0
                    }
                    var posInt = sign(number) * Math.floor(Math.abs(number));
                    return mod(posInt, 256)
                },
                ToUint8Clamp: function ToUint8Clamp(argument) {
                    var number = this.ToNumber(argument);
                    if ($isNaN(number) || number <= 0) {
                        return 0
                    }
                    if (number >= 255) {
                        return 255
                    }
                    var f = Math.floor(argument);
                    if (f + .5 < number) {
                        return f + 1
                    }
                    if (number < f + .5) {
                        return f
                    }
                    if (f % 2 !== 0) {
                        return f + 1
                    }
                    return f
                },
                ToString: function ToString(argument) {
                    if (typeof argument === "symbol") {
                        throw new TypeError("Cannot convert a Symbol value to a string")
                    }
                    return String(argument)
                },
                ToObject: function ToObject(value) {
                    this.RequireObjectCoercible(value);
                    return Object(value)
                },
                ToPropertyKey: function ToPropertyKey(argument) {
                    var key = this.ToPrimitive(argument, String);
                    return typeof key === "symbol" ? key : this.ToString(key)
                },
                ToLength: function ToLength(argument) {
                    var len = this.ToInteger(argument);
                    if (len <= 0) {
                        return 0
                    }
                    if (len > MAX_SAFE_INTEGER) {
                        return MAX_SAFE_INTEGER
                    }
                    return len
                },
                CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
                    if (toStr.call(argument) !== "[object String]") {
                        throw new TypeError("must be a string")
                    }
                    if (argument === "-0") {
                        return -0
                    }
                    var n = this.ToNumber(argument);
                    if (this.SameValue(this.ToString(n), argument)) {
                        return n
                    }
                    return void 0
                },
                RequireObjectCoercible: ES5.CheckObjectCoercible,
                IsArray: Array.isArray || function IsArray(argument) {
                    return toStr.call(argument) === "[object Array]"
                },
                IsConstructor: function IsConstructor(argument) {
                    return typeof argument === "function" && !!argument.prototype
                },
                IsExtensible: function IsExtensible(obj) {
                    if (!Object.preventExtensions) {
                        return true
                    }
                    if (isPrimitive(obj)) {
                        return false
                    }
                    return Object.isExtensible(obj)
                },
                IsInteger: function IsInteger(argument) {
                    if (typeof argument !== "number" || $isNaN(argument) || !$isFinite(argument)) {
                        return false
                    }
                    var abs = Math.abs(argument);
                    return Math.floor(abs) === abs
                },
                IsPropertyKey: function IsPropertyKey(argument) {
                    return typeof argument === "string" || typeof argument === "symbol"
                },
                IsRegExp: function IsRegExp(argument) {
                    if (!argument || typeof argument !== "object") {
                        return false
                    }
                    if (hasSymbols) {
                        var isRegExp = argument[Symbol.match];
                        if (typeof isRegExp !== "undefined") {
                            return ES5.ToBoolean(isRegExp)
                        }
                    }
                    return hasRegExpMatcher(argument)
                },
                SameValueZero: function SameValueZero(x, y) {
                    return x === y || $isNaN(x) && $isNaN(y)
                },
                GetV: function GetV(V, P) {
                    if (!this.IsPropertyKey(P)) {
                        throw new TypeError("Assertion failed: IsPropertyKey(P) is not true")
                    }
                    var O = this.ToObject(V);
                    return O[P]
                },
                GetMethod: function GetMethod(O, P) {
                    if (!this.IsPropertyKey(P)) {
                        throw new TypeError("Assertion failed: IsPropertyKey(P) is not true")
                    }
                    var func = this.GetV(O, P);
                    if (func == null) {
                        return void 0
                    }
                    if (!this.IsCallable(func)) {
                        throw new TypeError(P + "is not a function")
                    }
                    return func
                },
                Get: function Get(O, P) {
                    if (this.Type(O) !== "Object") {
                        throw new TypeError("Assertion failed: Type(O) is not Object")
                    }
                    if (!this.IsPropertyKey(P)) {
                        throw new TypeError("Assertion failed: IsPropertyKey(P) is not true")
                    }
                    return O[P]
                },
                Type: function Type(x) {
                    if (typeof x === "symbol") {
                        return "Symbol"
                    }
                    return ES5.Type(x)
                },
                SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
                    if (this.Type(O) !== "Object") {
                        throw new TypeError("Assertion failed: Type(O) is not Object")
                    }
                    var C = O.constructor;
                    if (typeof C === "undefined") {
                        return defaultConstructor
                    }
                    if (this.Type(C) !== "Object") {
                        throw new TypeError("O.constructor is not an Object")
                    }
                    var S = hasSymbols && Symbol.species ? C[Symbol.species] : void 0;
                    if (S == null) {
                        return defaultConstructor
                    }
                    if (this.IsConstructor(S)) {
                        return S
                    }
                    throw new TypeError("no constructor found")
                },
                CompletePropertyDescriptor: function CompletePropertyDescriptor(Desc) {
                    if (!this.IsPropertyDescriptor(Desc)) {
                        throw new TypeError("Desc must be a Property Descriptor")
                    }
                    if (this.IsGenericDescriptor(Desc) || this.IsDataDescriptor(Desc)) {
                        if (!has(Desc, "[[Value]]")) {
                            Desc["[[Value]]"] = void 0
                        }
                        if (!has(Desc, "[[Writable]]")) {
                            Desc["[[Writable]]"] = false
                        }
                    } else {
                        if (!has(Desc, "[[Get]]")) {
                            Desc["[[Get]]"] = void 0
                        }
                        if (!has(Desc, "[[Set]]")) {
                            Desc["[[Set]]"] = void 0
                        }
                    }
                    if (!has(Desc, "[[Enumerable]]")) {
                        Desc["[[Enumerable]]"] = false
                    }
                    if (!has(Desc, "[[Configurable]]")) {
                        Desc["[[Configurable]]"] = false
                    }
                    return Desc
                },
                Set: function Set(O, P, V, Throw) {
                    if (this.Type(O) !== "Object") {
                        throw new TypeError("O must be an Object")
                    }
                    if (!this.IsPropertyKey(P)) {
                        throw new TypeError("P must be a Property Key")
                    }
                    if (this.Type(Throw) !== "Boolean") {
                        throw new TypeError("Throw must be a Boolean")
                    }
                    if (Throw) {
                        O[P] = V;
                        return true
                    } else {
                        try {
                            O[P] = V
                        } catch (e) {
                            return false
                        }
                    }
                },
                HasOwnProperty: function HasOwnProperty(O, P) {
                    if (this.Type(O) !== "Object") {
                        throw new TypeError("O must be an Object")
                    }
                    if (!this.IsPropertyKey(P)) {
                        throw new TypeError("P must be a Property Key")
                    }
                    return has(O, P)
                },
                HasProperty: function HasProperty(O, P) {
                    if (this.Type(O) !== "Object") {
                        throw new TypeError("O must be an Object")
                    }
                    if (!this.IsPropertyKey(P)) {
                        throw new TypeError("P must be a Property Key")
                    }
                    return P in O
                },
                IsConcatSpreadable: function IsConcatSpreadable(O) {
                    if (this.Type(O) !== "Object") {
                        return false
                    }
                    if (hasSymbols && typeof Symbol.isConcatSpreadable === "symbol") {
                        var spreadable = this.Get(O, Symbol.isConcatSpreadable);
                        if (typeof spreadable !== "undefined") {
                            return this.ToBoolean(spreadable)
                        }
                    }
                    return this.IsArray(O)
                },
                Invoke: function Invoke(O, P) {
                    if (!this.IsPropertyKey(P)) {
                        throw new TypeError("P must be a Property Key")
                    }
                    var argumentsList = arraySlice(arguments, 2);
                    var func = this.GetV(O, P);
                    return this.Call(func, O, argumentsList)
                },
                CreateIterResultObject: function CreateIterResultObject(value, done) {
                    if (this.Type(done) !== "Boolean") {
                        throw new TypeError("Assertion failed: Type(done) is not Boolean")
                    }
                    return {
                        value: value,
                        done: done
                    }
                },
                RegExpExec: function RegExpExec(R, S) {
                    if (this.Type(R) !== "Object") {
                        throw new TypeError("R must be an Object")
                    }
                    if (this.Type(S) !== "String") {
                        throw new TypeError("S must be a String")
                    }
                    var exec = this.Get(R, "exec");
                    if (this.IsCallable(exec)) {
                        var result = this.Call(exec, R, [S]);
                        if (result === null || this.Type(result) === "Object") {
                            return result
                        }
                        throw new TypeError('"exec" method must return `null` or an Object')
                    }
                    return regexExec(R, S)
                },
                ArraySpeciesCreate: function ArraySpeciesCreate(originalArray, length) {
                    if (!this.IsInteger(length) || length < 0) {
                        throw new TypeError("Assertion failed: length must be an integer >= 0")
                    }
                    var len = length === 0 ? 0 : length;
                    var C;
                    var isArray = this.IsArray(originalArray);
                    if (isArray) {
                        C = this.Get(originalArray, "constructor");
                        if (this.Type(C) === "Object" && hasSymbols && Symbol.species) {
                            C = this.Get(C, Symbol.species);
                            if (C === null) {
                                C = void 0
                            }
                        }
                    }
                    if (typeof C === "undefined") {
                        return Array(len)
                    }
                    if (!this.IsConstructor(C)) {
                        throw new TypeError("C must be a constructor")
                    }
                    return new C(len)
                },
                CreateDataProperty: function CreateDataProperty(O, P, V) {
                    if (this.Type(O) !== "Object") {
                        throw new TypeError("Assertion failed: Type(O) is not Object")
                    }
                    if (!this.IsPropertyKey(P)) {
                        throw new TypeError("Assertion failed: IsPropertyKey(P) is not true")
                    }
                    var oldDesc = Object.getOwnPropertyDescriptor(O, P);
                    var extensible = oldDesc || (typeof Object.isExtensible !== "function" || Object.isExtensible(O));
                    var immutable = oldDesc && (!oldDesc.writable || !oldDesc.configurable);
                    if (immutable || !extensible) {
                        return false
                    }
                    var newDesc = {
                        configurable: true,
                        enumerable: true,
                        value: V,
                        writable: true
                    };
                    Object.defineProperty(O, P, newDesc);
                    return true
                },
                CreateDataPropertyOrThrow: function CreateDataPropertyOrThrow(O, P, V) {
                    if (this.Type(O) !== "Object") {
                        throw new TypeError("Assertion failed: Type(O) is not Object")
                    }
                    if (!this.IsPropertyKey(P)) {
                        throw new TypeError("Assertion failed: IsPropertyKey(P) is not true")
                    }
                    var success = this.CreateDataProperty(O, P, V);
                    if (!success) {
                        throw new TypeError("unable to create data property")
                    }
                    return success
                }
            });
            delete ES6.CheckObjectCoercible;
            module.exports = ES6
        },
        {
            "./es5": 7,
            "./helpers/assign": 9,
            "./helpers/isFinite": 10,
            "./helpers/isNaN": 11,
            "./helpers/isPrimitive": 12,
            "./helpers/mod": 13,
            "./helpers/sign": 14,
            "es-to-primitive/es6": 16,
            "function-bind": 20,
            has: 21,
            "is-regex": 24
        }
    ],
    7: [function(require, module, exports) {
        "use strict";
        var $isNaN = require("./helpers/isNaN");
        var $isFinite = require("./helpers/isFinite");
        var sign = require("./helpers/sign");
        var mod = require("./helpers/mod");
        var IsCallable = require("is-callable");
        var toPrimitive = require("es-to-primitive/es5");
        var has = require("has");
        var ES5 = {
            ToPrimitive: toPrimitive,
            ToBoolean: function ToBoolean(value) {
                return !!value
            },
            ToNumber: function ToNumber(value) {
                return Number(value)
            },
            ToInteger: function ToInteger(value) {
                var number = this.ToNumber(value);
                if ($isNaN(number)) {
                    return 0
                }
                if (number === 0 || !$isFinite(number)) {
                    return number
                }
                return sign(number) * Math.floor(Math.abs(number))
            },
            ToInt32: function ToInt32(x) {
                return this.ToNumber(x) >> 0
            },
            ToUint32: function ToUint32(x) {
                return this.ToNumber(x) >>> 0
            },
            ToUint16: function ToUint16(value) {
                var number = this.ToNumber(value);
                if ($isNaN(number) || number === 0 || !$isFinite(number)) {
                    return 0
                }
                var posInt = sign(number) * Math.floor(Math.abs(number));
                return mod(posInt, 65536)
            },
            ToString: function ToString(value) {
                return String(value)
            },
            ToObject: function ToObject(value) {
                this.CheckObjectCoercible(value);
                return Object(value)
            },
            CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
                if (value == null) {
                    throw new TypeError(optMessage || "Cannot call method on " + value)
                }
                return value
            },
            IsCallable: IsCallable,
            SameValue: function SameValue(x, y) {
                if (x === y) {
                    if (x === 0) {
                        return 1 / x === 1 / y
                    }
                    return true
                }
                return $isNaN(x) && $isNaN(y)
            },
            Type: function Type(x) {
                if (x === null) {
                    return "Null"
                }
                if (typeof x === "undefined") {
                    return "Undefined"
                }
                if (typeof x === "function" || typeof x === "object") {
                    return "Object"
                }
                if (typeof x === "number") {
                    return "Number"
                }
                if (typeof x === "boolean") {
                    return "Boolean"
                }
                if (typeof x === "string") {
                    return "String"
                }
            },
            IsPropertyDescriptor: function IsPropertyDescriptor(Desc) {
                if (this.Type(Desc) !== "Object") {
                    return false
                }
                var allowed = {
                    "[[Configurable]]": true,
                    "[[Enumerable]]": true,
                    "[[Get]]": true,
                    "[[Set]]": true,
                    "[[Value]]": true,
                    "[[Writable]]": true
                };
                for (var key in Desc) {
                    if (has(Desc, key) && !allowed[key]) {
                        return false
                    }
                }
                var isData = has(Desc, "[[Value]]");
                var IsAccessor = has(Desc, "[[Get]]") || has(Desc, "[[Set]]");
                if (isData && IsAccessor) {
                    throw new TypeError("Property Descriptors may not be both accessor and data descriptors")
                }
                return true
            },
            IsAccessorDescriptor: function IsAccessorDescriptor(Desc) {
                if (typeof Desc === "undefined") {
                    return false
                }
                if (!this.IsPropertyDescriptor(Desc)) {
                    throw new TypeError("Desc must be a Property Descriptor")
                }
                if (!has(Desc, "[[Get]]") && !has(Desc, "[[Set]]")) {
                    return false
                }
                return true
            },
            IsDataDescriptor: function IsDataDescriptor(Desc) {
                if (typeof Desc === "undefined") {
                    return false
                }
                if (!this.IsPropertyDescriptor(Desc)) {
                    throw new TypeError("Desc must be a Property Descriptor")
                }
                if (!has(Desc, "[[Value]]") && !has(Desc, "[[Writable]]")) {
                    return false
                }
                return true
            },
            IsGenericDescriptor: function IsGenericDescriptor(Desc) {
                if (typeof Desc === "undefined") {
                    return false
                }
                if (!this.IsPropertyDescriptor(Desc)) {
                    throw new TypeError("Desc must be a Property Descriptor")
                }
                if (!this.IsAccessorDescriptor(Desc) && !this.IsDataDescriptor(Desc)) {
                    return true
                }
                return false
            },
            FromPropertyDescriptor: function FromPropertyDescriptor(Desc) {
                if (typeof Desc === "undefined") {
                    return Desc
                }
                if (!this.IsPropertyDescriptor(Desc)) {
                    throw new TypeError("Desc must be a Property Descriptor")
                }
                if (this.IsDataDescriptor(Desc)) {
                    return {
                        value: Desc["[[Value]]"],
                        writable: !!Desc["[[Writable]]"],
                        enumerable: !!Desc["[[Enumerable]]"],
                        configurable: !!Desc["[[Configurable]]"]
                    }
                } else if (this.IsAccessorDescriptor(Desc)) {
                    return {
                        get: Desc["[[Get]]"],
                        set: Desc["[[Set]]"],
                        enumerable: !!Desc["[[Enumerable]]"],
                        configurable: !!Desc["[[Configurable]]"]
                    }
                } else {
                    throw new TypeError("FromPropertyDescriptor must be called with a fully populated Property Descriptor")
                }
            },
            ToPropertyDescriptor: function ToPropertyDescriptor(Obj) {
                if (this.Type(Obj) !== "Object") {
                    throw new TypeError("ToPropertyDescriptor requires an object")
                }
                var desc = {};
                if (has(Obj, "enumerable")) {
                    desc["[[Enumerable]]"] = this.ToBoolean(Obj.enumerable)
                }
                if (has(Obj, "configurable")) {
                    desc["[[Configurable]]"] = this.ToBoolean(Obj.configurable)
                }
                if (has(Obj, "value")) {
                    desc["[[Value]]"] = Obj.value
                }
                if (has(Obj, "writable")) {
                    desc["[[Writable]]"] = this.ToBoolean(Obj.writable)
                }
                if (has(Obj, "get")) {
                    var getter = Obj.get;
                    if (typeof getter !== "undefined" && !this.IsCallable(getter)) {
                        throw new TypeError("getter must be a function")
                    }
                    desc["[[Get]]"] = getter
                }
                if (has(Obj, "set")) {
                    var setter = Obj.set;
                    if (typeof setter !== "undefined" && !this.IsCallable(setter)) {
                        throw new TypeError("setter must be a function")
                    }
                    desc["[[Set]]"] = setter
                }
                if ((has(desc, "[[Get]]") || has(desc, "[[Set]]")) && (has(desc, "[[Value]]") || has(desc, "[[Writable]]"))) {
                    throw new TypeError("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute")
                }
                return desc
            }
        };
        module.exports = ES5
    }, {
        "./helpers/isFinite": 10,
        "./helpers/isNaN": 11,
        "./helpers/mod": 13,
        "./helpers/sign": 14,
        "es-to-primitive/es5": 15,
        has: 21,
        "is-callable": 22
    }],
    8: [function(require, module, exports) {
        "use strict";
        module.exports = require("./es2015")
    }, {
        "./es2015": 6
    }],
    9: [function(require, module, exports) {
        var has = Object.prototype.hasOwnProperty;
        module.exports = function assign(target, source) {
            if (Object.assign) {
                return Object.assign(target, source)
            }
            for (var key in source) {
                if (has.call(source, key)) {
                    target[key] = source[key]
                }
            }
            return target
        }
    }, {}],
    10: [function(require, module, exports) {
        var $isNaN = Number.isNaN || function(a) {
            return a !== a
        };
        module.exports = Number.isFinite || function(x) {
            return typeof x === "number" && !$isNaN(x) && x !== Infinity && x !== -Infinity
        }
    }, {}],
    11: [function(require, module, exports) {
        module.exports = Number.isNaN || function isNaN(a) {
            return a !== a
        }
    }, {}],
    12: [function(require, module, exports) {
        module.exports = function isPrimitive(value) {
            return value === null || typeof value !== "function" && typeof value !== "object"
        }
    }, {}],
    13: [function(require, module, exports) {
        module.exports = function mod(number, modulo) {
            var remain = number % modulo;
            return Math.floor(remain >= 0 ? remain : remain + modulo)
        }
    }, {}],
    14: [function(require, module, exports) {
        module.exports = function sign(number) {
            return number >= 0 ? 1 : -1
        }
    }, {}],
    15: [function(require, module, exports) {
        "use strict";
        var toStr = Object.prototype.toString;
        var isPrimitive = require("./helpers/isPrimitive");
        var isCallable = require("is-callable");
        var ES5internalSlots = {
            "[[DefaultValue]]": function(O, hint) {
                var actualHint = hint || (toStr.call(O) === "[object Date]" ? String : Number);
                if (actualHint === String || actualHint === Number) {
                    var methods = actualHint === String ? ["toString", "valueOf"] : ["valueOf", "toString"];
                    var value, i;
                    for (i = 0; i < methods.length; ++i) {
                        if (isCallable(O[methods[i]])) {
                            value = O[methods[i]]();
                            if (isPrimitive(value)) {
                                return value
                            }
                        }
                    }
                    throw new TypeError("No default value")
                }
                throw new TypeError("invalid [[DefaultValue]] hint supplied")
            }
        };
        module.exports = function ToPrimitive(input, PreferredType) {
            if (isPrimitive(input)) {
                return input
            }
            return ES5internalSlots["[[DefaultValue]]"](input, PreferredType)
        }
    }, {
        "./helpers/isPrimitive": 17,
        "is-callable": 22
    }],
    16: [function(require, module, exports) {
        "use strict";
        var hasSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "symbol";
        var isPrimitive = require("./helpers/isPrimitive");
        var isCallable = require("is-callable");
        var isDate = require("is-date-object");
        var isSymbol = require("is-symbol");
        var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
            if (typeof O === "undefined" || O === null) {
                throw new TypeError("Cannot call method on " + O)
            }
            if (typeof hint !== "string" || hint !== "number" && hint !== "string") {
                throw new TypeError('hint must be "string" or "number"')
            }
            var methodNames = hint === "string" ? ["toString", "valueOf"] : ["valueOf", "toString"];
            var method, result, i;
            for (i = 0; i < methodNames.length; ++i) {
                method = O[methodNames[i]];
                if (isCallable(method)) {
                    result = method.call(O);
                    if (isPrimitive(result)) {
                        return result
                    }
                }
            }
            throw new TypeError("No default value")
        };
        var GetMethod = function GetMethod(O, P) {
            var func = O[P];
            if (func !== null && typeof func !== "undefined") {
                if (!isCallable(func)) {
                    throw new TypeError(func + " returned for property " + P + " of object " + O + " is not a function")
                }
                return func
            }
        };
        module.exports = function ToPrimitive(input, PreferredType) {
            if (isPrimitive(input)) {
                return input
            }
            var hint = "default";
            if (arguments.length > 1) {
                if (PreferredType === String) {
                    hint = "string"
                } else if (PreferredType === Number) {
                    hint = "number"
                }
            }
            var exoticToPrim;
            if (hasSymbols) {
                if (Symbol.toPrimitive) {
                    exoticToPrim = GetMethod(input, Symbol.toPrimitive)
                } else if (isSymbol(input)) {
                    exoticToPrim = Symbol.prototype.valueOf
                }
            }
            if (typeof exoticToPrim !== "undefined") {
                var result = exoticToPrim.call(input, hint);
                if (isPrimitive(result)) {
                    return result
                }
                throw new TypeError("unable to convert exotic object to primitive")
            }
            if (hint === "default" && (isDate(input) || isSymbol(input))) {
                hint = "string"
            }
            return ordinaryToPrimitive(input, hint === "default" ? "number" : hint)
        }
    }, {
        "./helpers/isPrimitive": 17,
        "is-callable": 22,
        "is-date-object": 23,
        "is-symbol": 25
    }],
    17: [function(require, module, exports) {
        arguments[4][12][0].apply(exports, arguments)
    }, {
        dup: 12
    }],
    18: [function(require, module, exports) {
        var hasOwn = Object.prototype.hasOwnProperty;
        var toString = Object.prototype.toString;
        module.exports = function forEach(obj, fn, ctx) {
            if (toString.call(fn) !== "[object Function]") {
                throw new TypeError("iterator must be a function")
            }
            var l = obj.length;
            if (l === +l) {
                for (var i = 0; i < l; i++) {
                    fn.call(ctx, obj[i], i, obj)
                }
            } else {
                for (var k in obj) {
                    if (hasOwn.call(obj, k)) {
                        fn.call(ctx, obj[k], k, obj)
                    }
                }
            }
        }
    }, {}],
    19: [function(require, module, exports) {
        "use strict";
        var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
        var slice = Array.prototype.slice;
        var toStr = Object.prototype.toString;
        var funcType = "[object Function]";
        module.exports = function bind(that) {
            var target = this;
            if (typeof target !== "function" || toStr.call(target) !== funcType) {
                throw new TypeError(ERROR_MESSAGE + target)
            }
            var args = slice.call(arguments, 1);
            var bound;
            var binder = function() {
                if (this instanceof bound) {
                    var result = target.apply(this, args.concat(slice.call(arguments)));
                    if (Object(result) === result) {
                        return result
                    }
                    return this
                } else {
                    return target.apply(that, args.concat(slice.call(arguments)))
                }
            };
            var boundLength = Math.max(0, target.length - args.length);
            var boundArgs = [];
            for (var i = 0; i < boundLength; i++) {
                // pls remember this if error else no worry
                boundArgs.push("$" + i)
            }
            bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
            if (target.prototype) {
                var Empty = function Empty() {};
                Empty.prototype = target.prototype;
                bound.prototype = new Empty;
                Empty.prototype = null
            }
            return bound
        }
    }, {}],
    20: [function(require, module, exports) {
        "use strict";
        var implementation = require("./implementation");
        module.exports = Function.prototype.bind || implementation
    }, {
        "./implementation": 19
    }],
    21: [function(require, module, exports) {
        var bind = require("function-bind");
        module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty)
    }, {
        "function-bind": 20
    }],
    22: [function(require, module, exports) {
        "use strict";
        var fnToStr = Function.prototype.toString;
        var constructorRegex = /^\s*class /;
        var isES6ClassFn = function isES6ClassFn(value) {
            try {
                var fnStr = fnToStr.call(value);
                var singleStripped = fnStr.replace(/\/\/.*\n/g, "");
                var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, "");
                var spaceStripped = multiStripped.replace(/\n/gm, " ").replace(/ {2}/g, " ");
                return constructorRegex.test(spaceStripped)
            } catch (e) {
                return false
            }
        };
        var tryFunctionObject = function tryFunctionObject(value) {
            try {
                if (isES6ClassFn(value)) {
                    return false
                }
                fnToStr.call(value);
                return true
            } catch (e) {
                return false
            }
        };
        var toStr = Object.prototype.toString;
        var fnClass = "[object Function]";
        var genClass = "[object GeneratorFunction]";
        var hasToStringTag = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
        module.exports = function isCallable(value) {
            if (!value) {
                return false
            }
            if (typeof value !== "function" && typeof value !== "object") {
                return false
            }
            if (hasToStringTag) {
                return tryFunctionObject(value)
            }
            if (isES6ClassFn(value)) {
                return false
            }
            var strClass = toStr.call(value);
            return strClass === fnClass || strClass === genClass
        }
    }, {}],
    23: [function(require, module, exports) {
        "use strict";
        var getDay = Date.prototype.getDay;
        var tryDateObject = function tryDateObject(value) {
            try {
                getDay.call(value);
                return true
            } catch (e) {
                return false
            }
        };
        var toStr = Object.prototype.toString;
        var dateClass = "[object Date]";
        var hasToStringTag = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
        module.exports = function isDateObject(value) {
            if (typeof value !== "object" || value === null) {
                return false
            }
            return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass
        }
    }, {}],
    24: [function(require, module, exports) {
        "use strict";
        var has = require("has");
        var regexExec = RegExp.prototype.exec;
        var gOPD = Object.getOwnPropertyDescriptor;
        var tryRegexExecCall = function tryRegexExec(value) {
            try {
                var lastIndex = value.lastIndex;
                value.lastIndex = 0;
                regexExec.call(value);
                return true
            } catch (e) {
                return false
            } finally {
                value.lastIndex = lastIndex
            }
        };
        var toStr = Object.prototype.toString;
        var regexClass = "[object RegExp]";
        var hasToStringTag = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
        module.exports = function isRegex(value) {
            if (!value || typeof value !== "object") {
                return false
            }
            if (!hasToStringTag) {
                return toStr.call(value) === regexClass
            }
            var descriptor = gOPD(value, "lastIndex");
            var hasLastIndexDataProperty = descriptor && has(descriptor, "value");
            if (!hasLastIndexDataProperty) {
                return false
            }
            return tryRegexExecCall(value)
        }
    }, {
        has: 21
    }],
    25: [function(require, module, exports) {
        "use strict";
        var toStr = Object.prototype.toString;
        var hasSymbols = typeof Symbol === "function" && typeof Symbol() === "symbol";
        if (hasSymbols) {
            var symToStr = Symbol.prototype.toString;
            var symStringRegex = /^Symbol\(.*\)$/;
            var isSymbolObject = function isSymbolObject(value) {
                if (typeof value.valueOf() !== "symbol") {
                    return false
                }
                return symStringRegex.test(symToStr.call(value))
            };
            module.exports = function isSymbol(value) {
                if (typeof value === "symbol") {
                    return true
                }
                if (toStr.call(value) !== "[object Symbol]") {
                    return false
                }
                try {
                    return isSymbolObject(value)
                } catch (e) {
                    return false
                }
            }
        } else {
            module.exports = function isSymbol(value) {
                return false
            }
        }
    }, {}],
    26: [function(require, module, exports) {
        "use strict";
        var has = Object.prototype.hasOwnProperty;
        var toStr = Object.prototype.toString;
        var slice = Array.prototype.slice;
        var isArgs = require("./isArguments");
        var isEnumerable = Object.prototype.propertyIsEnumerable;
        var hasDontEnumBug = !isEnumerable.call({
            toString: null
        }, "toString");
        var hasProtoEnumBug = isEnumerable.call(function() {}, "prototype");
        var dontEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"];
        var equalsConstructorPrototype = function(o) {
            var ctor = o.constructor;
            return ctor && ctor.prototype === o
        };
        var excludedKeys = {
            $console: true,
            $external: true,
            $frame: true,
            $frameElement: true,
            $frames: true,
            $innerHeight: true,
            $innerWidth: true,
            $outerHeight: true,
            $outerWidth: true,
            $pageXOffset: true,
            $pageYOffset: true,
            $parent: true,
            $scrollLeft: true,
            $scrollTop: true,
            $scrollX: true,
            $scrollY: true,
            $self: true,
            $webkitIndexedDB: true,
            $webkitStorageInfo: true,
            $window: true
        };
        var hasAutomationEqualityBug = function() {
            if (typeof window === "undefined") {
                return false
            }
            for (var k in window) {
                try {
                    if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
                        try {
                            equalsConstructorPrototype(window[k])
                        } catch (e) {
                            return true
                        }
                    }
                } catch (e) {
                    return true
                }
            }
            return false
        }();
        var equalsConstructorPrototypeIfNotBuggy = function(o) {
            if (typeof window === "undefined" || !hasAutomationEqualityBug) {
                return equalsConstructorPrototype(o)
            }
            try {
                return equalsConstructorPrototype(o)
            } catch (e) {
                return false
            }
        };
        var keysShim = function keys(object) {
            var isObject = object !== null && typeof object === "object";
            var isFunction = toStr.call(object) === "[object Function]";
            var isArguments = isArgs(object);
            var isString = isObject && toStr.call(object) === "[object String]";
            var theKeys = [];
            if (!isObject && !isFunction && !isArguments) {
                throw new TypeError("Object.keys called on a non-object")
            }
            var skipProto = hasProtoEnumBug && isFunction;
            if (isString && object.length > 0 && !has.call(object, 0)) {
                for (var i = 0; i < object.length; ++i) {
                    theKeys.push(String(i))
                }
            }
            if (isArguments && object.length > 0) {
                for (var j = 0; j < object.length; ++j) {
                    theKeys.push(String(j))
                }
            } else {
                for (var name in object) {
                    if (!(skipProto && name === "prototype") && has.call(object, name)) {
                        theKeys.push(String(name))
                    }
                }
            }
            if (hasDontEnumBug) {
                var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
                for (var k = 0; k < dontEnums.length; ++k) {
                    if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
                        theKeys.push(dontEnums[k])
                    }
                }
            }
            return theKeys
        };
        keysShim.shim = function shimObjectKeys() {
            if (Object.keys) {
                var keysWorksWithArguments = function() {
                    return (Object.keys(arguments) || "").length === 2
                }(1, 2);
                if (!keysWorksWithArguments) {
                    var originalKeys = Object.keys;
                    Object.keys = function keys(object) {
                        if (isArgs(object)) {
                            return originalKeys(slice.call(object))
                        } else {
                            return originalKeys(object)
                        }
                    }
                }
            } else {
                Object.keys = keysShim
            }
            return Object.keys || keysShim
        };
        module.exports = keysShim
    }, {
        "./isArguments": 27
    }],
    27: [function(require, module, exports) {
        "use strict";
        var toStr = Object.prototype.toString;
        module.exports = function isArguments(value) {
            var str = toStr.call(value);
            var isArgs = str === "[object Arguments]";
            if (!isArgs) {
                isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]"
            }
            return isArgs
        }
    }, {}],
    28: [function(require, module, exports) {
        if (!String.prototype.includes) {
            (function() {
                "use strict";
                var toString = {}.toString;
                var defineProperty = function() {
                    try {
                        var object = {};
                        var $defineProperty = Object.defineProperty;
                        var result = $defineProperty(object, object, object) && $defineProperty
                    } catch (error) {}
                    return result
                }();
                var indexOf = "".indexOf;
                var includes = function(search) {
                    if (this == null) {
                        throw TypeError()
                    }
                    var string = String(this);
                    if (search && toString.call(search) == "[object RegExp]") {
                        throw TypeError()
                    }
                    var stringLength = string.length;
                    var searchString = String(search);
                    var searchLength = searchString.length;
                    var position = arguments.length > 1 ? arguments[1] : undefined;
                    var pos = position ? Number(position) : 0;
                    if (pos != pos) {
                        pos = 0
                    }
                    var start = Math.min(Math.max(pos, 0), stringLength);
                    if (searchLength + start > stringLength) {
                        return false
                    }
                    return indexOf.call(string, searchString, pos) != -1
                };
                if (defineProperty) {
                    defineProperty(String.prototype, "includes", {
                        value: includes,
                        configurable: true,
                        writable: true
                    })
                } else {
                    String.prototype.includes = includes
                }
            })()
        }
    }, {}],
    29: [function(require, module, exports) {
        if (!String.prototype.repeat) {
            (function() {
                "use strict";
                var defineProperty = function() {
                    try {
                        var object = {};
                        var $defineProperty = Object.defineProperty;
                        var result = $defineProperty(object, object, object) && $defineProperty
                    } catch (error) {}
                    return result
                }();
                var repeat = function(count) {
                    if (this == null) {
                        throw TypeError()
                    }
                    var string = String(this);
                    var n = count ? Number(count) : 0;
                    if (n != n) {
                        n = 0
                    }
                    if (n < 0 || n == Infinity) {
                        throw RangeError()
                    }
                    var result = "";
                    while (n) {
                        if (n % 2 == 1) {
                            result += string
                        }
                        if (n > 1) {
                            string += string
                        }
                        n >>= 1
                    }
                    return result
                };
                if (defineProperty) {
                    defineProperty(String.prototype, "repeat", {
                        value: repeat,
                        configurable: true,
                        writable: true
                    })
                } else {
                    String.prototype.repeat = repeat
                }
            })()
        }
    }, {}],
    30: [function(require, module, exports) {
        if (!String.prototype.startsWith) {
            (function() {
                "use strict";
                var defineProperty = function() {
                    try {
                        var object = {};
                        var $defineProperty = Object.defineProperty;
                        var result = $defineProperty(object, object, object) && $defineProperty
                    } catch (error) {}
                    return result
                }();
                var toString = {}.toString;
                var startsWith = function(search) {
                    if (this == null) {
                        throw TypeError()
                    }
                    var string = String(this);
                    if (search && toString.call(search) == "[object RegExp]") {
                        throw TypeError()
                    }
                    var stringLength = string.length;
                    var searchString = String(search);
                    var searchLength = searchString.length;
                    var position = arguments.length > 1 ? arguments[1] : undefined;
                    var pos = position ? Number(position) : 0;
                    if (pos != pos) {
                        pos = 0
                    }
                    var start = Math.min(Math.max(pos, 0), stringLength);
                    if (searchLength + start > stringLength) {
                        return false
                    }
                    var index = -1;
                    while (++index < searchLength) {
                        if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                            return false
                        }
                    }
                    return true
                };
                if (defineProperty) {
                    defineProperty(String.prototype, "startsWith", {
                        value: startsWith,
                        configurable: true,
                        writable: true
                    })
                } else {
                    String.prototype.startsWith = startsWith
                }
            })()
        }
    }, {}],
    31: [function(require, module, exports) {
        window.bashEmulator = require("./index")
    }, {
        "./index": 46
    }],
    32: [function(require, module, exports) {
        var lineNumber = require("../utils/lineNumber");
        var numColumnWidth = 6;
        var numberFlag = "-n";

        function cat(env, args) {
            args.shift();
            var exitCode = 0;
            var numberFlagIndex = args.findIndex(function(arg) {
                return arg === numberFlag
            });
            var showNumbers = numberFlagIndex !== -1;
            if (showNumbers) {
                args.splice(numberFlagIndex, 1)
            }
            if (!args.length) {
                var num = 1;
                return {
                    input: function(str) {
                        str.split("\n").forEach(function(l) {
                            if (!l) {
                                return
                            }
                            var line = showNumbers ? lineNumber.addLineNumber(numColumnWidth, num, l) : l;
                            num++;
                            env.output(line + "\n")
                        })
                    },
                    close: function() {
                        env.exit(exitCode)
                    }
                }
            }
            Promise.all(args.map(function(path) {
                return env.system.read(path).then(null, function(err) {
                    exitCode = 1;
                    return "cat: " + err
                })
            })).then(function(contents) {
                var lines = showNumbers ? lineNumber.addLineNumbers(numColumnWidth, contents) : contents;
                lines.forEach(function(line) {
                    env.output(line + "\n")
                });
                env.exit(exitCode)
            })
        }
        module.exports = cat
    }, {
        "../utils/lineNumber": 47
    }],
    33: [function(require, module, exports) {
        function cd(env, args) {
            args.shift();
            var path = args[0] || "/home/" + env.system.state.user;
            env.system.changeDir(path).then(env.exit, function(errorMessage) {
                env.error(errorMessage);
                env.exit(1)
            })
        }
        module.exports = cd
    }, {}],
    34: [function(require, module, exports) {
        var SINGLE_COPY = "SINGLE_COPY";

        function cp(env, args) {
            args.shift();
            var rFlagIndex = args.findIndex(function(arg) {
                return arg === "-r" || arg === "-R"
            });
            var isRecursive = rFlagIndex !== -1;
            if (isRecursive) {
                args.splice(rFlagIndex, 1)
            }
            if (!args.length) {
                env.error("cp: missing file operand");
                env.exit(1);
                return
            }
            if (args.length === 1) {
                env.error("cp: missing destination file operand after â€˜" + args[0] + "â€™");
                env.exit(1);
                return
            }
            var destination = args[args.length - 1];
            var files = args.slice(0, -1);

            function copy(file, dest) {
                return env.system.stat(file).then(function(stats) {
                    if (stats.type === "dir" && !isRecursive) {
                        return Promise.reject("cp: omitting directory â€˜" + file + "â€™")
                    }
                    return env.system.copy(file, dest)
                })
            }
            env.system.stat(destination).then(function(stats) {
                if (stats.type !== "dir") {
                    return Promise.reject()
                }
            }).catch(function() {
                if (files.length !== 1) {
                    return Promise.reject("cp: target â€˜" + destination + "â€™ is not a directory")
                }
                return SINGLE_COPY
            }).then(function(actionType) {
                if (actionType === SINGLE_COPY) {
                    return copy(files[0], destination)
                }
                return Promise.all(files.map(function(file) {
                    var filePathParts = file.split("/");
                    var fileName = filePathParts[filePathParts.length - 1];
                    var dest = destination + "/" + fileName;
                    return copy(file, dest)
                }))
            }).then(function() {
                env.exit(0)
            }).catch(function(err) {
                env.error(err);
                env.exit(1)
            })
        }
        module.exports = cp
    }, {}],
    35: [function(require, module, exports) {
        function env(env) {
            env.output("L3N1cGVyc2VjcmV0ZGlyaGVyZQ==");
            env.exit()
        }
        module.exports = env
    }, {}],
    36: [function(require, module, exports) {
        var lineNumber = require("../utils/lineNumber");
        var numColumnWidth = 5;

        function history(env) {
            env.system.getHistory().then(function(history) {
                env.output(lineNumber.addLineNumbers(numColumnWidth, history).join("\n"));
                env.exit()
            })
        }
        module.exports = history
    }, {
        "../utils/lineNumber": 47
    }],
    37: [function(require, module, exports) {
        function id(env) {
            env.output("uid=1337(sudosuraz) gid=1337(sudosuraz) groups=1337(sudosuraz)");
            env.exit()
        }
        module.exports = id
    }, {}],
    38: [function(require, module, exports) {
        var commands = {
            cat: require("./cat"),
            cd: require("./cd"),
            cp: require("./cp"),
            history: require("./history"),
            ls: require("./ls"),
            mkdir: require("./mkdir"),
            mv: require("./mv"),
            pwd: require("./pwd"),
            rm: require("./rm"),
            rmdir: require("./rmdir"),
            touch: require("./touch"),
            id: require("./id"),
            env: require("./env")
        };
        module.exports = commands
    }, {
        "./cat": 32,
        "./cd": 33,
        "./cp": 34,
        "./env": 35,
        "./history": 36,
        "./id": 37,
        "./ls": 39,
        "./mkdir": 40,
        "./mv": 41,
        "./pwd": 42,
        "./rm": 43,
        "./rmdir": 44,
        "./touch": 45,
        "./help": 48
    }],
    39: [function(require, module, exports) {
        var disclaimer = "\n\n\t" + "-This is obviously limited :)";

        function ls(env, args) {
            args.shift();
            var aFlagIndex = args.findIndex(function(arg) {
                return arg === "-a"
            });
            var showHidden = aFlagIndex !== -1;
            if (showHidden) {
                args.splice(aFlagIndex, 1)
            }
            var lFlagIndex = args.findIndex(function(arg) {
                return arg === "-l"
            });
            var longFormat = lFlagIndex !== -1;
            if (longFormat) {
                args.splice(lFlagIndex, 1)
            }
            var laFlagIndex = args.findIndex(function(arg) {
                return arg === "-la"
            });
            if (laFlagIndex !== -1) {
                showHidden = true;
                longFormat = true;
                args.splice(laFlagIndex, 1)
            }
            var alFlagIndex = args.findIndex(function(arg) {
                return arg === "-al"
            });
            if (alFlagIndex !== -1) {
                showHidden = true;
                longFormat = true;
                args.splice(alFlagIndex, 1)
            }
            if (!args.length) {
                args.push(".")
            }

            function excludeHidden(listing) {
                if (showHidden) {
                    return listing
                }
                return listing.filter(function(item) {
                    return item[0] !== "."
                })
            }

            function formatListing(base, listing) {

                if (!longFormat) {
                    return Promise.resolve(listing.join("   "))
                }
                return Promise.all(listing.map(function(filePath) {
                    return env.system.stat(base + "/" + filePath).then(function(stats) {
                        var date = new Date(stats.modified);
                        var timestamp = date.toDateString().slice(4, 10) + " " + date.toTimeString().slice(0, 5);
                        var type = stats.type;
                        if (type === "dir") {
                            type += " "
                        }
                        return type + "  " + timestamp + "  " + stats.name
                    })
                })).then(function(lines) {
                    return "total " + lines.length + "\n" + lines.join("\n") + disclaimer
                })
            }
            Promise.all(args.sort().map(function(path) {
                return env.system.readDir(path).then(excludeHidden).then(function(listing) {
                    return formatListing(path, listing)
                }).then(function(formattedListing) {
                    if (args.length === 1) {
                        return formattedListing
                    }
                    return path + ":\n" + formattedListing
                })
            })).then(function(listings) {
                return listings.join("\n\n")
            }).then(function(result) {
                env.output(result);
                env.exit()
            }, function(err) {
                env.output("ls: " + err);
                env.exit(2)
            })
        }
        module.exports = ls
    }, {}],
    40: [function(require, module, exports) {
        function mkdir(env, args) {
            args.shift();
            if (!args.length) {
                env.error("mkdir: missing operand");
                env.exit(1);
                return
            }
            Promise.all(args.map(function(path) {
                return env.system.createDir(path)
            })).then(function() {
                env.exit()
            }, function(err) {
                env.error(err);
                env.exit(1)
            })
        }
        module.exports = mkdir
    }, {}],
    41: [function(require, module, exports) {
        var SINGLE_COPY = "SINGLE_COPY";

        function mv(env, args) {
            args.shift();
            var nFlagIndex = args.findIndex(function(arg) {
                return arg === "-n"
            });
            var noClobber = nFlagIndex !== -1;
            if (noClobber) {
                args.splice(nFlagIndex, 1)
            }
            if (!args.length) {
                env.error("mv: missing file operand");
                env.exit(1);
                return
            }
            if (args.length === 1) {
                env.error("mv: missing destination file operand after â€˜" + args[0] + "â€™");
                env.exit(1);
                return
            }
            var destination = args[args.length - 1];
            var files = args.slice(0, -1);

            function rename(file, dest) {
                if (noClobber) {
                    return env.system.stat(dest).catch(function() {
                        return env.system.copy(file, dest).then(function() {
                            return env.system.remove(file)
                        })
                    })
                }
                return env.system.copy(file, dest).then(function() {
                    return env.system.remove(file)
                })
            }
            env.system.stat(destination).then(function(stats) {
                if (stats.type !== "dir") {
                    return Promise.reject()
                }
            }).catch(function() {
                if (files.length !== 1) {
                    return Promise.reject("mv: target â€˜" + destination + "â€™ is not a directory")
                }
                return SINGLE_COPY
            }).then(function(actionType) {
                if (actionType === SINGLE_COPY) {
                    return rename(files[0], destination)
                }
                return Promise.all(files.map(function(file) {
                    var filePathParts = file.split("/");
                    var fileName = filePathParts[filePathParts.length - 1];
                    var dest = destination + "/" + fileName;
                    return rename(file, dest)
                }))
            }).then(function() {
                env.exit(0)
            }).catch(function(err) {
                env.error(err);
                env.exit(1)
            })
        }
        module.exports = mv
    }, {}],
    42: [function(require, module, exports) {
        function pwd(env) {
            env.system.getDir().then(function(dir) {
                env.output(dir);
                env.exit()
            })
        }
        module.exports = pwd
    }, {}],
    43: [function(require, module, exports) {
        function rm(env, args) {
            args.shift();
            var rFlagIndex = args.findIndex(function(arg) {
                return arg.toLowerCase() === "-r"
            });
            var recursive = rFlagIndex !== -1;
            if (recursive) {
                args.splice(rFlagIndex, 1)
            }
            if (!args.length) {
                env.error("rm: missing operand");
                env.exit(1);
                return
            }
            Promise.all(args.map(function(path) {
                return env.system.stat(path).then(function(stats) {
                    var isDir = stats.type === "dir";
                    if (isDir && !recursive) {
                        return Promise.reject("rm: cannot remove â€˜" + path + "â€™: Is a directory")
                    }
                }, function() {}).then(function() {
                    return env.system.remove(path)
                })
            })).then(function() {
                env.exit()
            }, function(err) {
                env.error(err);
                env.exit(1)
            })
        }
        module.exports = rm
    }, {}],
    44: [function(require, module, exports) {
        function rmdir(env, args) {
            args.shift();
            if (!args.length) {
                env.error("rmdir: missing operand");
                env.exit(1);
                return
            }
            Promise.all(args.map(function(path) {
                return env.system.stat(path).then(function(stats) {
                    if (stats.type !== "dir") {
                        return Promise.reject("rmdir: cannot remove â€˜" + path + "â€™: Not a directory")
                    }
                }, function() {}).then(function() {
                    return env.system.readDir(path)
                }).then(function(files) {
                    if (files.length) {
                        return Promise.reject("rmdir: failed to remove â€˜" + path + "â€™: Directory not empty")
                    }
                }).then(function() {
                    return env.system.remove(path)
                })
            })).then(function() {
                env.exit()
            }, function(err) {
                env.error(err);
                env.exit(1)
            })
        }
        module.exports = rmdir
    }, {}],
    45: [function(require, module, exports) {
        function touch(env, args) {
            args.shift();
            if (!args.length) {
                env.error("touch: missing file operand");
                env.exit(1);
                return
            }
            Promise.all(args.map(function(file) {
                return env.system.write(file, "")
            })).then(function() {
                env.exit()
            }, function(err) {
                env.error(err);
                env.exit(1)
            })
        }
        module.exports = touch
    }, {}],
    46: [function(require, module, exports) {
        require("array.prototype.findindex");
        require("string.prototype.startswith");
        require("string.prototype.includes");
        require("string.prototype.repeat");
        var commands = require("./commands");

        function bashEmulator(initialState) {
            var state = createState(initialState);
            var completion = {};

            function getPath(path) {
                return joinPaths(state.workingDirectory, path)
            }

            function parentExists(path) {
                var parentPath = getPath(path).split("/").slice(0, -1).join("/");
                return emulator.stat(parentPath).then(function(stats) {
                    if (stats.type === "dir") {
                        return Promise.resolve()
                    }
                    return Promise.reject(parentPath + ": Is not a directory")
                })
            }
            var emulator = {
                commands: commands,
                state: state,
                run: function(input) {
                    state.history.push(input);
                    var argsList = input.split("|").map(function(pipe) {
                        var args = pipe.trim().split(" ").filter(function(s) {
                            return s
                        });
                        return args
                    });
                    if (argsList.length === 1 && !argsList[0].length) {
                        return Promise.resolve("\n")
                    }
                    if (!argsList[argsList.length - 1][0]) {
                        return Promise.reject("syntax error: unexpected end of file")
                    }
                    if (argsList.find(function(a) {
                            return !a.length
                        })) {
                        return Promise.reject("syntax error near unexpected token `|'")
                    }
                    var nonExistent = argsList.filter(function(args) {
                        var cmd = args[0];
                        return !commands[cmd]
                    });
                    if (nonExistent.length) {
                        return Promise.reject(nonExistent.map(function(args) {
                            return args[0] + ": command not found"
                        }).join("\n"))
                    }
                    var result = "";
                    return new Promise(function(resolve, reject) {
                        var pipes = argsList.map(function(args, idx) {
                            var isLast = idx === argsList.length - 1;
                            return commands[args[0]]({
                                output: function(str) {
                                    if (isLast) {
                                        result += str;
                                        return
                                    }
                                    var nextInput = pipes[idx + 1] && pipes[idx + 1].input;
                                    if (nextInput) {
                                        nextInput(str)
                                    }
                                },
                                error: function(str) {
                                    result += str
                                },
                                exit: function(code) {
                                    if (isLast) {
                                        if (code) {
                                            reject(result)
                                        } else {
                                            resolve(result)
                                        }
                                        return
                                    }
                                    var nextClose = pipes[idx + 1] && pipes[idx + 1].close;
                                    if (nextClose) {
                                        nextClose()
                                    }
                                },
                                system: emulator
                            }, args)
                        })
                    })
                },
                getDir: function() {
                    return Promise.resolve(state.workingDirectory)
                },
                changeDir: function(target) {
                    var normalizedPath = getPath(target);
                    if (!state.fileSystem[normalizedPath]) {
                        return Promise.reject(normalizedPath + ": No such file or directory")
                    }
                    if((state.fileSystem[normalizedPath].type) === 'file') {
                        return Promise.reject(normalizedPath + ": Is a file")
                    }
                    state.workingDirectory = normalizedPath;
                    return Promise.resolve()
                },
                read: function(arg) {
                    var filePath = getPath(arg);
                    if (!state.fileSystem[filePath]) {
                        return Promise.reject(arg + " No such file or directory")
                    }
                    if (state.fileSystem[filePath].type !== "file") {
                        return Promise.reject(arg + ": Is a directory")
                    }
                    return Promise.resolve(state.fileSystem[filePath].content)
                },
                readDir: function(path) {
                    var dir = getPath(path);
                    if (!state.fileSystem[dir]) {
                        return Promise.reject("cannot access â€˜" + path + "â€™: No such file or directory")
                    }
                    var listing = Object.keys(state.fileSystem).filter(function(path) {
                        return path.startsWith(dir) && path !== dir
                    }).map(function(path) {
                        return path.substr(dir === "/" ? dir.length : dir.length + 1)
                    }).filter(function(path) {
                        return !path.includes("/")
                    }).sort();
                    return Promise.resolve(listing)
                },
                stat: function(path) {
                    var filePath = getPath(path);
                    if (!state.fileSystem[filePath]) {
                        return Promise.reject(path + ": No such file or directory")
                    }
                    var pathParts = filePath.split("/");
                    return Promise.resolve({
                        modified: state.fileSystem[filePath].modified,
                        type: state.fileSystem[filePath].type,
                        name: pathParts[pathParts.length - 1]
                    })
                },
                createDir: function(path) {
                    return emulator.stat(path).then(function() {
                        return Promise.reject("cannot create directory '" + path + "': File exists")
                    }, function() {
                        return parentExists(path)
                    }).then(function() {
                        var dirPath = getPath(path);
                        state.fileSystem[dirPath] = {
                            type: "dir",
                            modified: Date.now()
                        }
                    })
                },
                write: function(path, content) {
                    if (typeof content !== "string") {
                        try {
                            content = JSON.stringify(content)
                        } catch (e) {
                            return Promise.reject(e)
                        }
                    }
                    return parentExists(path).then(function() {
                        var filePath = getPath(path);
                        return emulator.stat(path).then(function(stats) {
                            if (stats.type !== "file") {
                                return Promise.reject(filePath + ": Is a folder")
                            }
                            var oldContent = state.fileSystem[filePath].content;
                            state.fileSystem[filePath].content = oldContent + content;
                            state.fileSystem[filePath].modified = Date.now()
                        }, function() {
                            state.fileSystem[filePath] = {
                                type: "file",
                                modified: Date.now(),
                                content: content
                            }
                        })
                    })
                },
                remove: function(path) {
                    var filePath = getPath(path);
                    if (!state.fileSystem[filePath]) {
                        return Promise.reject("cannot remove â€˜" + path + "â€™: No such file or directory")
                    }
                    Object.keys(state.fileSystem).forEach(function(key) {
                        if (key.startsWith(filePath)) {
                            delete state.fileSystem[key]
                        }
                    });
                    return Promise.resolve()
                },
                copy: function(source, destination) {
                    var sourcePath = getPath(source);
                    var destinationPath = getPath(destination);
                    if (!state.fileSystem[sourcePath]) {
                        return Promise.reject(source + ": No such file or directory")
                    }

                    function renameAllSub(key) {
                        if (key.startsWith(sourcePath)) {
                            var destKey = key.replace(sourcePath, destinationPath);
                            state.fileSystem[destKey] = state.fileSystem[key]
                        }
                    }
                    return parentExists(destinationPath).then(function() {
                        Object.keys(state.fileSystem).forEach(renameAllSub)
                    })
                },
                getHistory: function() {
                    return Promise.resolve(state.history)
                },
                completeUp: function(input) {
                    var historyChanged = completion.historySize !== state.history.length;
                    var inputChanged = input !== completion.input;
                    if (inputChanged || historyChanged) {
                        completion.input = input;
                        completion.index = 0;
                        completion.historySize = state.history.length;
                        completion.list = state.history.filter(function(item) {
                            return item.startsWith(input)
                        }).reverse()
                    } else if (completion.index < completion.list.length - 1) {
                        completion.index++
                    } else {
                        return Promise.resolve(undefined)
                    }
                    return Promise.resolve(completion.list[completion.index])
                },
                completeDown: function(input) {
                    if (input !== completion.input || !completion.index) {
                        return Promise.resolve(undefined)
                    }
                    completion.index--;
                    return Promise.resolve(completion.list[completion.index])
                }
            };
            return emulator
        }

        function createState(initialState) {
            var state = defaultState();
            if (!initialState) {
                return state
            }
            Object.keys(state).forEach(function(key) {
                if (initialState[key]) {
                    state[key] = initialState[key]
                }
            });
            return state
        }

        function defaultState() {
            return {
                history: [],
                fileSystem: {
                    "/": {
                        type: "dir",
                        modified: Date.now()
                    },
                    "/home": {
                        type: "dir",
                        modified: Date.now()
                    },
                    "/home/sudosuraz": {
                        type: "dir",
                        modified: Date.now()
                    }
                },
                user: "sudosuraz",
                workingDirectory: "/home/sudosuraz"
            }
        }

        function joinPaths(a, b) {
            if (!b) {
                return a
            }
            var path = (b.charAt(0) === "/" ? "" : a + "/") + b;
            var parts = path.split("/").filter(function noEmpty(p) {
                return !!p
            });
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
                var part = parts[i];
                if (part === ".") {
                    parts.splice(i, 1)
                } else if (part === "..") {
                    parts.splice(i, 1);
                    up++
                } else if (up) {
                    parts.splice(i, 1);
                    up--
                }
            }
            return "/" + parts.join("/")
        }
        module.exports = bashEmulator
    }, {
        "./commands": 38,
        "array.prototype.findindex": 2,
        "string.prototype.includes": 28,
        "string.prototype.repeat": 29,
        "string.prototype.startswith": 30
    }],
    47: [function(require, module, exports) {
        function addLineNumber(width, num, line) {
            var numChars = num.toString().length;
            var space = " ".repeat(width - numChars);
            return space + num + "  " + line
        }
        module.exports.addLineNumber = addLineNumber;
        module.exports.addLineNumbers = function(width, lines) {
            return lines.map(function(line, i) {
                var num = i + 1;
                return addLineNumber(width, num, line)
            })
        }
    }, {}]
}, {}, [31]);
