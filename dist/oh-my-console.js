'use strict';

/*
 * Logger constructor
 * @param {String} id trace ID of the logger instance, typically use module ID
 */

(function () {
    /*
     * Get Current Env
     * @return {Object} env
     *  env.DEBUG: debug switch
     *  env.ENV: runtime info
     */
    function getEnv() {
        var ret = {
            DEBUG: '',
            ENV: ''
        };
        if (typeof process !== 'undefined') {
            ret.DEBUG = process.env.DEBUG;
            ret.ENV = 'shell';
        } else if (typeof window !== 'undefined') {
            ret.DEBUG = window.DEBUG;
            ret.ENV = 'browser';
        }
        return ret;
    }

    /*
     * Browser colors
     */
    var browserColors = {
        reset: 'color: black',
        gray: 'color: gray',
        green: 'color: green',
        red: 'color: red',
        cyan: 'color: cyan',
        yellow: 'color: #8a8a14'
    };

    /*
     * ANSI colors
     */
    var ansiColors = {
        reset: '\u001b[0m',
        gray: '\u001b[37m',
        green: '\u001b[32m',
        red: '\u001b[31m',
        cyan: '\u001b[36m',
        yellow: '\u001b[33m'
    };

    /*
     * Constructor
     */
    function Logger(id) {
        if (!isString(id)) {
            throw new Error('invalid logger id: ' + id);
        }
        var debugEnabled = match(getEnv().DEBUG, id);
        return {
            debug: debugEnabled ? createInstance('debug', 'red', id, 'log') : function (x) {
                return false;
            },
            log: createInstance('log', 'reset', id),
            warn: createInstance('warn', 'yellow', id),
            error: createInstance('error', 'red', id),
            info: createInstance('info', 'cyan', id)
        };
    }

    function isString(obj) {
        return typeof obj === 'string' || obj instanceof String;
    }

    /*
     * match id with DEBUG switch
     * @param {string} root DEBUG switch
     * @param {String} path trace ID
     */
    function match(root, path) {
        if (!root) return false;
        root = String(root).split(':').filter(function (x) {
            return x.length;
        });
        path = (path || '').split(':').filter(function (x) {
            return x.length;
        });
        for (var i = 0; i < root.length; i++) {
            if (path[i] != root[i]) return false;
        }
        return true;
    }

    /*
     * create logger method with STDOUT instance and trace ID 
     * @param {Function} output STDOUT instance
     * @param {String} id trace ID
     * legacy:
     *      createInstance(console.log.bind(console), 'mip:cache:getCache')
     */
    function createInstance(level, color, id, origin) {
        origin = origin || level;
        var output = console[origin].bind(console);
        if (getEnv().ENV === 'browser') {
            return function () {
                var str = format.apply(null, arguments);
                output('%c[' + timestamp() + ']%c[' + id + ']%c[' + level + '] ' + str, browserColors.gray, browserColors.green, browserColors[color]);
                return '[' + timestamp() + '][' + id + '][' + level + '] ' + str;
            };
        } else if (getEnv().ENV === 'shell') {
            return function () {
                var str = format.apply(null, arguments);
                output('%s[' + timestamp() + ']%s[' + id + ']%s[' + level + '] ' + str + '%s', ansiColors.gray, ansiColors.green, ansiColors[color], ansiColors.reset);
                return '[' + timestamp() + '][' + id + '][' + level + '] ' + str;
            };
        } else {
            return function () {
                var str = format.apply(null, arguments);
                output('[' + timestamp() + '][' + id + '][' + level + '] ' + str);
                return '[' + timestamp() + '][' + id + '][' + level + '] ' + str;
            };
        }
    }

    /*
     * Pad number to 2-digit.
     * @param {Number} n The number
     * @return {String} 2-digit number string
     * legacy:
     *      pad(2)      // 02
     *      pad(22)     // 22
     */
    function pad(n) {
        return n < 10 ? '0' + n.toString(10) : n.toString(10);
    }

    /*
     * Generate a timestamp from current time 
     * @return {String} the timestamp string
     * legacy:
     *      timestamp()    // "2016/09/27-17:31:22"
     */
    function timestamp() {
        var d = new Date();
        var date = [pad(d.getFullYear()), pad(d.getMonth() + 1), pad(d.getDate())].join('/');
        var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
        return date + '-' + time;
    }

    var formatRegExp = /%[sdjJ%]/g;

    /*
     * format arguments to a single string
     * @param {String} f Optional, the format string
     * @return {String} the formated string
     * legacy:
     *      format('%s', 'foo', 'bar')  // foo bar
     *      format('%d', '200', 'bar')  // 200 bar
     *      format('%j', {foo: 'bar'}, 'bar')
     *                                  // {"foo":"bar"}bar
     *      format('%j', {foo: 'bar'}, 'bar')
     *                                  // \n{\n    "foo": "bar"\n}\nbar
     *      format('foo', 'bar')        // foo bar
     */
    function format(f) {
        var i = 0;
        var args = arguments;
        var len = args.length;
        var str = '';
        if (isString(f)) {
            i++;
            str += String(f).replace(formatRegExp, function (x) {
                if (i >= len) return x;
                switch (x) {
                    case '%%':
                        return '%';
                    case '%s':
                        return String(args[i++]);
                    case '%d':
                        return Number(args[i++]);
                    case '%j':
                        try {
                            return JSON.stringify(args[i++]);
                        } catch (_) {
                            return '[Circular]';
                        }
                        break;
                    case '%J':
                        try {
                            return '\n' + JSON.stringify(args[i++], null, 4) + '\n';
                        } catch (_) {
                            return '\n[Circular]\n';
                        }
                        break;
                    default:
                        return x;
                }
            });
        }
        for (var x = args[i]; i < len; x = args[++i]) {
            str += ' ' + x;
        }
        return str;
    }

    // CommonJS
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Logger;
    }
    // Browser
    else if (typeof define === 'function' && define.amd) {
            define('OhMyConsole', [], function () {
                return Logger;
            });
        } else {
            window.OhMyConsole = Logger;
        }
})();

