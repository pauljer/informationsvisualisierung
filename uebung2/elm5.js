(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (Object.prototype.hasOwnProperty.call(value, key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	var unwrapped = _Json_unwrap(value);
	if (!(key === 'toJSON' && typeof unwrapped === 'function'))
	{
		object[key] = unwrapped;
	}
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (
		(typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		||
		(Array.isArray(_Json_unwrap(value)) && _VirtualDom_RE_js_html.test(String(_Json_unwrap(value))))
	)
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Uebung2aufgabe5$averageOf = F2(
	function (metric, carList) {
		var values = A2($elm$core$List$map, metric, carList);
		if (!values.b) {
			return 0;
		} else {
			return $elm$core$List$sum(values) / $elm$core$List$length(values);
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Uebung2aufgabe5$All_Wheel_Drive = {$: 'All_Wheel_Drive'};
var $author$project$Uebung2aufgabe5$Car = function (vehicleName) {
	return function (carType) {
		return function (wheelDrive) {
			return function (retailPrice) {
				return function (dealerCost) {
					return function (engineSize) {
						return function (cyl) {
							return function (hp) {
								return function (cityMPG) {
									return function (hwyMPG) {
										return function (weight) {
											return function (wheelBase) {
												return function (carLen) {
													return function (carWidth) {
														return {carLen: carLen, carType: carType, carWidth: carWidth, cityMPG: cityMPG, cyl: cyl, dealerCost: dealerCost, engineSize: engineSize, hp: hp, hwyMPG: hwyMPG, retailPrice: retailPrice, vehicleName: vehicleName, weight: weight, wheelBase: wheelBase, wheelDrive: wheelDrive};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Uebung2aufgabe5$Front_Wheel_Drive = {$: 'Front_Wheel_Drive'};
var $author$project$Uebung2aufgabe5$Minivan = {$: 'Minivan'};
var $author$project$Uebung2aufgabe5$Pickup = {$: 'Pickup'};
var $author$project$Uebung2aufgabe5$Rear_Wheel_Drive = {$: 'Rear_Wheel_Drive'};
var $author$project$Uebung2aufgabe5$SUV = {$: 'SUV'};
var $author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan = {$: 'Small_Sporty_Compact_Large_Sedan'};
var $author$project$Uebung2aufgabe5$Sports_Car = {$: 'Sports_Car'};
var $author$project$Uebung2aufgabe5$Wagon = {$: 'Wagon'};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Uebung2aufgabe5$cars = _List_fromArray(
	[
		$author$project$Uebung2aufgabe5$Car('Acura 3.5 RL 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(43755))(
		$elm$core$Maybe$Just(39014))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3880))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(197))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Acura 3.5 RL w/Navigation 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(46100))(
		$elm$core$Maybe$Just(41100))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3893))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(197))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Acura MDX')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(36945))(
		$elm$core$Maybe$Just(33337))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(265))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(4451))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(77)),
		$author$project$Uebung2aufgabe5$Car('Acura NSX coupe 2dr manual S')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(89765))(
		$elm$core$Maybe$Just(79978))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(290))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3153))(
		$elm$core$Maybe$Just(100))(
		$elm$core$Maybe$Just(174))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Acura RSX Type S 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23820))(
		$elm$core$Maybe$Just(21761))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(31))(
		$elm$core$Maybe$Just(2778))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(172))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Acura TL 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(33195))(
		$elm$core$Maybe$Just(30299))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(270))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3575))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(186))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Acura TSX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26990))(
		$elm$core$Maybe$Just(24647))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3230))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Audi A4 1.8T 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(25940))(
		$elm$core$Maybe$Just(23508))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(31))(
		$elm$core$Maybe$Just(3252))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Audi A4 3.0 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(31840))(
		$elm$core$Maybe$Just(28846))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3462))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Audi A4 3.0 convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(42490))(
		$elm$core$Maybe$Just(38325))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3814))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Audi A4 3.0 Quattro 4dr auto')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(34480))(
		$elm$core$Maybe$Just(31388))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3627))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Audi A4 3.0 Quattro 4dr manual')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(33430))(
		$elm$core$Maybe$Just(30366))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3583))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Audi A4 3.0 Quattro convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(44240))(
		$elm$core$Maybe$Just(40075))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4013))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Audi A41.8T convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(35940))(
		$elm$core$Maybe$Just(32506))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3638))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Audi A6 2.7 Turbo Quattro 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(42840))(
		$elm$core$Maybe$Just(38840))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(250))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3836))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Audi A6 3.0 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(36640))(
		$elm$core$Maybe$Just(33129))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3561))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Audi A6 3.0 Avant Quattro')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(40840))(
		$elm$core$Maybe$Just(37060))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4035))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Audi A6 3.0 Quattro 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(39640))(
		$elm$core$Maybe$Just(35992))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3880))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Audi A6 4.2 Quattro 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(49690))(
		$elm$core$Maybe$Just(44936))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(300))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(4024))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(193))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Audi A8 L Quattro 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(69190))(
		$elm$core$Maybe$Just(64740))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(330))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(4399))(
		$elm$core$Maybe$Just(121))(
		$elm$core$Maybe$Just(204))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Audi RS 6 4dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(84600))(
		$elm$core$Maybe$Just(76417))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(450))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(4024))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(191))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Audi S4 Avant Quattro')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(49090))(
		$elm$core$Maybe$Just(44446))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(340))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(3936))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Audi S4 Quattro 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(48040))(
		$elm$core$Maybe$Just(43556))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(340))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(3825))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Audi TT 1.8 convertible 2dr (coupe)')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(35940))(
		$elm$core$Maybe$Just(32512))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3131))(
		$elm$core$Maybe$Just(95))(
		$elm$core$Maybe$Just(159))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Audi TT 1.8 Quattro 2dr (convertible)')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(37390))(
		$elm$core$Maybe$Just(33891))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(2921))(
		$elm$core$Maybe$Just(96))(
		$elm$core$Maybe$Just(159))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Audi TT 3.2 coupe 2dr (convertible)')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(40590))(
		$elm$core$Maybe$Just(36739))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(250))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3351))(
		$elm$core$Maybe$Just(96))(
		$elm$core$Maybe$Just(159))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('BMW 325Ci 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(30795))(
		$elm$core$Maybe$Just(28245))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3197))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('BMW 325Ci convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(37995))(
		$elm$core$Maybe$Just(34800))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3560))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('BMW 325i 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(28495))(
		$elm$core$Maybe$Just(26155))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3219))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(176))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('BMW 325xi 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(30245))(
		$elm$core$Maybe$Just(27745))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3461))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(176))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('BMW 325xi Sport')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(32845))(
		$elm$core$Maybe$Just(30110))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3594))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(176))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('BMW 330Ci 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(36995))(
		$elm$core$Maybe$Just(33890))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3285))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(176))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('BMW 330Ci convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(44295))(
		$elm$core$Maybe$Just(40530))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3616))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('BMW 330i 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(35495))(
		$elm$core$Maybe$Just(32525))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3285))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(176))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('BMW 330xi 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(37245))(
		$elm$core$Maybe$Just(34115))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3483))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(176))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('BMW 525i 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(39995))(
		$elm$core$Maybe$Just(36620))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3428))(
		$elm$core$Maybe$Just(114))(
		$elm$core$Maybe$Just(191))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('BMW 530i 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(44995))(
		$elm$core$Maybe$Just(41170))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3472))(
		$elm$core$Maybe$Just(114))(
		$elm$core$Maybe$Just(191))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('BMW 545iA 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(54995))(
		$elm$core$Maybe$Just(50270))(
		$elm$core$Maybe$Just(4.4))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(325))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3814))(
		$elm$core$Maybe$Just(114))(
		$elm$core$Maybe$Just(191))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('BMW 745i 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(69195))(
		$elm$core$Maybe$Just(63190))(
		$elm$core$Maybe$Just(4.4))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(325))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(4376))(
		$elm$core$Maybe$Just(118))(
		$elm$core$Maybe$Just(198))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('BMW 745Li 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(73195))(
		$elm$core$Maybe$Just(66830))(
		$elm$core$Maybe$Just(4.4))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(325))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(4464))(
		$elm$core$Maybe$Just(123))(
		$elm$core$Maybe$Just(204))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('BMW M3 convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(56595))(
		$elm$core$Maybe$Just(51815))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(333))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(3781))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('BMW M3 coupe 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(48195))(
		$elm$core$Maybe$Just(44170))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(333))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3415))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('BMW X3 3.0i')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(37000))(
		$elm$core$Maybe$Just(33873))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(4023))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('BMW X5 4.4i')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(52195))(
		$elm$core$Maybe$Just(47720))(
		$elm$core$Maybe$Just(4.4))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(325))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(4824))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('BMW Z4 convertible 2.5i 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(33895))(
		$elm$core$Maybe$Just(31065))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(2932))(
		$elm$core$Maybe$Just(98))(
		$elm$core$Maybe$Just(161))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('BMW Z4 convertible 3.0i 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(41045))(
		$elm$core$Maybe$Just(37575))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(2998))(
		$elm$core$Maybe$Just(98))(
		$elm$core$Maybe$Just(161))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Buick Century Custom 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22180))(
		$elm$core$Maybe$Just(20351))(
		$elm$core$Maybe$Just(3.1))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3353))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(195))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Buick LeSabre Custom 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26470))(
		$elm$core$Maybe$Just(24282))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(205))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3567))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Buick LeSabre Limited 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(32245))(
		$elm$core$Maybe$Just(29566))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(205))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3591))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Buick Park Avenue 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(35545))(
		$elm$core$Maybe$Just(32244))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(205))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3778))(
		$elm$core$Maybe$Just(114))(
		$elm$core$Maybe$Just(207))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Buick Park Avenue Ultra 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(40720))(
		$elm$core$Maybe$Just(36927))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3909))(
		$elm$core$Maybe$Just(114))(
		$elm$core$Maybe$Just(207))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Buick Rainier')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(37895))(
		$elm$core$Maybe$Just(34357))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(275))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(4600))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(193))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Buick Regal GS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(28345))(
		$elm$core$Maybe$Just(26047))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3536))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(196))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Buick Regal LS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(24895))(
		$elm$core$Maybe$Just(22835))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3461))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(196))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Buick Rendezvous CX')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26545))(
		$elm$core$Maybe$Just(24085))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(4024))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Cadillac CTS VVT 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(30835))(
		$elm$core$Maybe$Just(28575))(
		$elm$core$Maybe$Just(3.6))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(255))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3694))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Cadillac Deville 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(45445))(
		$elm$core$Maybe$Just(41650))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(275))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3984))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(207))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Cadillac Deville DTS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(50595))(
		$elm$core$Maybe$Just(46362))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(300))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(4044))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(207))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Cadillac Escalade EXT')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(52975))(
		$elm$core$Maybe$Just(48541))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(345))(
		$elm$core$Maybe$Just(13))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(5879))(
		$elm$core$Maybe$Just(130))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Cadillac Escaladet')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(52795))(
		$elm$core$Maybe$Just(48377))(
		$elm$core$Maybe$Just(5.3))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(295))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(5367))(
		$elm$core$Maybe$Just(116))(
		$elm$core$Maybe$Just(199))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('Cadillac Seville SLS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(47955))(
		$elm$core$Maybe$Just(43841))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(275))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3992))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Cadillac SRX V8')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(46995))(
		$elm$core$Maybe$Just(43523))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(320))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(4302))(
		$elm$core$Maybe$Just(116))(
		$elm$core$Maybe$Just(195))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Cadillac XLR convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(76200))(
		$elm$core$Maybe$Just(70546))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(320))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3647))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Astro')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(26395))(
		$elm$core$Maybe$Just(23954))(
		$elm$core$Maybe$Just(4.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(4605))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Avalanche 1500')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(36100))(
		$elm$core$Maybe$Just(31689))(
		$elm$core$Maybe$Just(5.3))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(295))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(5678))(
		$elm$core$Maybe$Just(130))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Aveo 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(11690))(
		$elm$core$Maybe$Just(10965))(
		$elm$core$Maybe$Just(1.6))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(34))(
		$elm$core$Maybe$Just(2370))(
		$elm$core$Maybe$Just(98))(
		$elm$core$Maybe$Just(167))(
		$elm$core$Maybe$Just(66)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Aveo LS 4dr hatch')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(12585))(
		$elm$core$Maybe$Just(11802))(
		$elm$core$Maybe$Just(1.6))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(34))(
		$elm$core$Maybe$Just(2348))(
		$elm$core$Maybe$Just(98))(
		$elm$core$Maybe$Just(153))(
		$elm$core$Maybe$Just(66)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Cavalier 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(14610))(
		$elm$core$Maybe$Just(13697))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(37))(
		$elm$core$Maybe$Just(2617))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Cavalier 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(14810))(
		$elm$core$Maybe$Just(13884))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(37))(
		$elm$core$Maybe$Just(2676))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Cavalier LS 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(16385))(
		$elm$core$Maybe$Just(15357))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(37))(
		$elm$core$Maybe$Just(2617))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Colorado Z85')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(18760))(
		$elm$core$Maybe$Just(17070))(
		$elm$core$Maybe$Just(2.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(3623))(
		$elm$core$Maybe$Just(111))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Corvette 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(44535))(
		$elm$core$Maybe$Just(39068))(
		$elm$core$Maybe$Just(5.7))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(350))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3246))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Corvette convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(51535))(
		$elm$core$Maybe$Just(45193))(
		$elm$core$Maybe$Just(5.7))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(350))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3248))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Impala 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(21900))(
		$elm$core$Maybe$Just(20095))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(3465))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Impala LS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(25000))(
		$elm$core$Maybe$Just(22931))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3476))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Impala SS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(27995))(
		$elm$core$Maybe$Just(25672))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3606))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Malibu 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(18995))(
		$elm$core$Maybe$Just(17434))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(145))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(34))(
		$elm$core$Maybe$Just(3174))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Malibu LS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(20370))(
		$elm$core$Maybe$Just(18639))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3297))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Malibu LT 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23495))(
		$elm$core$Maybe$Just(21551))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(3315))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Malibu Maxx LS')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22225))(
		$elm$core$Maybe$Just(20394))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3458))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Monte Carlo LS 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(21825))(
		$elm$core$Maybe$Just(20026))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(3340))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(198))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Monte Carlo SS 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(24225))(
		$elm$core$Maybe$Just(22222))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3434))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(198))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Silverado 1500 Regular Cab')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(20310))(
		$elm$core$Maybe$Just(18480))(
		$elm$core$Maybe$Just(4.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(4142))(
		$elm$core$Maybe$Just(119))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Silverado SS')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(40340))(
		$elm$core$Maybe$Just(35399))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(300))(
		$elm$core$Maybe$Just(13))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(4804))(
		$elm$core$Maybe$Just(144))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Chevrolet SSR')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(41995))(
		$elm$core$Maybe$Just(39306))(
		$elm$core$Maybe$Just(5.3))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(300))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(4760))(
		$elm$core$Maybe$Just(116))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Suburban 1500 LT')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(42735))(
		$elm$core$Maybe$Just(37422))(
		$elm$core$Maybe$Just(5.3))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(295))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(4947))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(219))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Tahoe LT')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(41465))(
		$elm$core$Maybe$Just(36287))(
		$elm$core$Maybe$Just(5.3))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(295))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(5050))(
		$elm$core$Maybe$Just(116))(
		$elm$core$Maybe$Just(197))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Tracker')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(20255))(
		$elm$core$Maybe$Just(19108))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(165))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(2866))(
		$elm$core$Maybe$Just(98))(
		$elm$core$Maybe$Just(163))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet TrailBlazer LT')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(30295))(
		$elm$core$Maybe$Just(27479))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(275))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(4425))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Chevrolet Venture LS')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(27020))(
		$elm$core$Maybe$Just(24518))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3699))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Chrvsler PT Cruiser GT 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(25955))(
		$elm$core$Maybe$Just(24172))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3217))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(169))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Chrysler 300M 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(29865))(
		$elm$core$Maybe$Just(27797))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(250))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3581))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(198))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Chrysler 300M Special Edition 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(33295))(
		$elm$core$Maybe$Just(30884))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(255))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3650))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(198))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Chrysler Concorde LX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(24130))(
		$elm$core$Maybe$Just(22452))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3479))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(208))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Chrysler Concorde LXi 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26860))(
		$elm$core$Maybe$Just(24909))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(232))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3548))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(208))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Chrysler Crossfire 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(34495))(
		$elm$core$Maybe$Just(32033))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3060))(
		$elm$core$Maybe$Just(95))(
		$elm$core$Maybe$Just(160))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Chrysler Pacifica')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(31230))(
		$elm$core$Maybe$Just(28725))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(250))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(4675))(
		$elm$core$Maybe$Just(116))(
		$elm$core$Maybe$Just(199))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('Chrysler PT Cruiser 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(17985))(
		$elm$core$Maybe$Just(16919))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(150))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3101))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(169))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Chrysler PT Cruiser Limited 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22000))(
		$elm$core$Maybe$Just(20573))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(150))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3105))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(169))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Chrysler Sebring 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19090))(
		$elm$core$Maybe$Just(17805))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(150))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3173))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(191))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Chrysler Sebring convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(25215))(
		$elm$core$Maybe$Just(23451))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(150))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3357))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(64)),
		$author$project$Uebung2aufgabe5$Car('Chrysler Sebring Limited convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(30950))(
		$elm$core$Maybe$Just(28613))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3448))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Chrysler Sebring Touring 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(21840))(
		$elm$core$Maybe$Just(20284))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3222))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(191))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Chrysler Town and Country Limited')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(38380))(
		$elm$core$Maybe$Just(35063))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4331))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('Chrysler Town and Country LX')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(27490))(
		$elm$core$Maybe$Just(25371))(
		$elm$core$Maybe$Just(3.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(4068))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('CMC Yukon 1500 SLE')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(35725))(
		$elm$core$Maybe$Just(31361))(
		$elm$core$Maybe$Just(4.8))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(285))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(5042))(
		$elm$core$Maybe$Just(116))(
		$elm$core$Maybe$Just(199))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('Dodge Caravan SE')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(21795))(
		$elm$core$Maybe$Just(20508))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(150))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3862))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('Dodge Dakota Club Cab')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(20300))(
		$elm$core$Maybe$Just(18670))(
		$elm$core$Maybe$Just(3.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(3829))(
		$elm$core$Maybe$Just(131))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Dodge Dakota Regular Cab')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(17630))(
		$elm$core$Maybe$Just(16264))(
		$elm$core$Maybe$Just(3.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(3714))(
		$elm$core$Maybe$Just(112))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Dodge Durango SLT')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(32235))(
		$elm$core$Maybe$Just(29472))(
		$elm$core$Maybe$Just(4.7))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(230))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(4987))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Dodge Grand Caravan SXT')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(32660))(
		$elm$core$Maybe$Just(29812))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4440))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('Dodge Intrepid ES 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(24885))(
		$elm$core$Maybe$Just(23058))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(232))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3487))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(204))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Dodge Intrepid SE 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22035))(
		$elm$core$Maybe$Just(20502))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3469))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(204))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Dodge Neon SE 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(13670))(
		$elm$core$Maybe$Just(12849))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(132))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(36))(
		$elm$core$Maybe$Just(2581))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(174))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Dodge Neon SXT 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15040))(
		$elm$core$Maybe$Just(14086))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(132))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(36))(
		$elm$core$Maybe$Just(2626))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(174))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Dodge Ram 1500 Regular Cab ST')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(20215))(
		$elm$core$Maybe$Just(18076))(
		$elm$core$Maybe$Just(3.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(4542))(
		$elm$core$Maybe$Just(121))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Dodge Stratus SE 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(20220))(
		$elm$core$Maybe$Just(18821))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(150))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3175))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(191))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Dodge Stratus SXT 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(18820))(
		$elm$core$Maybe$Just(17512))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(150))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3182))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(191))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Dodge Viper SRT-10 convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(81795))(
		$elm$core$Maybe$Just(74451))(
		$elm$core$Maybe$Just(8.3))(
		$elm$core$Maybe$Just(10))(
		$elm$core$Maybe$Just(500))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(3410))(
		$elm$core$Maybe$Just(99))(
		$elm$core$Maybe$Just(176))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Ford Crown Victoria 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(24345))(
		$elm$core$Maybe$Just(22856))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(224))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4057))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(212))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Ford Crown Victoria LX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(27370))(
		$elm$core$Maybe$Just(25105))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(224))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4057))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(212))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Ford Crown Victoria LX Sport 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(30315))(
		$elm$core$Maybe$Just(27756))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(239))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4057))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(212))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Ford Escape XLS')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(22515))(
		$elm$core$Maybe$Just(20907))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(3346))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(173))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Ford Excursion 6.8 XLT')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(41475))(
		$elm$core$Maybe$Just(36494))(
		$elm$core$Maybe$Just(6.8))(
		$elm$core$Maybe$Just(10))(
		$elm$core$Maybe$Just(310))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(7190))(
		$elm$core$Maybe$Just(137))(
		$elm$core$Maybe$Just(227))(
		$elm$core$Maybe$Just(80)),
		$author$project$Uebung2aufgabe5$Car('Ford Expedition 4.6 XLT')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(34560))(
		$elm$core$Maybe$Just(30468))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(232))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(5000))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(206))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('Ford Explorer XLT V6')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(29670))(
		$elm$core$Maybe$Just(26983))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(4463))(
		$elm$core$Maybe$Just(114))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Ford F-150 Regular Cab XL')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(22010))(
		$elm$core$Maybe$Just(19490))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(231))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(4788))(
		$elm$core$Maybe$Just(126))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Ford F-150 Supercab Lariat')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(33540))(
		$elm$core$Maybe$Just(29405))(
		$elm$core$Maybe$Just(5.4))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(300))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(5464))(
		$elm$core$Maybe$Just(133))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Ford Focus LX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(13730))(
		$elm$core$Maybe$Just(12906))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(36))(
		$elm$core$Maybe$Just(2606))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(168))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Ford Focus SE 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15460))(
		$elm$core$Maybe$Just(14496))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2606))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(168))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Ford Focus SVT 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19135))(
		$elm$core$Maybe$Just(17878))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(2750))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(168))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Ford Focus ZTW')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(17475))(
		$elm$core$Maybe$Just(16375))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2702))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Ford Focus ZX3 2dr hatch')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(13270))(
		$elm$core$Maybe$Just(12482))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2612))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(168))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Ford Focus ZX5 5dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15580))(
		$elm$core$Maybe$Just(14607))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2691))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(168))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Ford Freestar SE')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26930))(
		$elm$core$Maybe$Just(24498))(
		$elm$core$Maybe$Just(3.9))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(193))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(4275))(
		$elm$core$Maybe$Just(121))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(77)),
		$author$project$Uebung2aufgabe5$Car('Ford Mustang 2dr (convertible)')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(18345))(
		$elm$core$Maybe$Just(16943))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(193))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3290))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Ford Mustang GT Premium convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(29380))(
		$elm$core$Maybe$Just(26875))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(260))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3347))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Ford Ranger 2.3 XL Regular Cab')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(14385))(
		$elm$core$Maybe$Just(13717))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(143))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3028))(
		$elm$core$Maybe$Just(111))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Ford Taurus LX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(20320))(
		$elm$core$Maybe$Just(18881))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(155))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3306))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(198))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Ford Taurus SE')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22290))(
		$elm$core$Maybe$Just(20457))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(155))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3497))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(198))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Ford Taurus SES Duratec 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22735))(
		$elm$core$Maybe$Just(20857))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3313))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(198))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Ford Thunderbird Deluxe convert w/hardtop 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(37530))(
		$elm$core$Maybe$Just(34483))(
		$elm$core$Maybe$Just(3.9))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(280))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3780))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(186))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('GMC Canyon Z85 SL Regular Cab')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(16530))(
		$elm$core$Maybe$Just(14877))(
		$elm$core$Maybe$Just(2.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3351))(
		$elm$core$Maybe$Just(111))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('GMC Envoy XUV SLE')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(31890))(
		$elm$core$Maybe$Just(28922))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(275))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(4945))(
		$elm$core$Maybe$Just(129))(
		$elm$core$Maybe$Just(208))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('GMC Safari SLE')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(25640))(
		$elm$core$Maybe$Just(23215))(
		$elm$core$Maybe$Just(4.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(4309))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('GMC Sierra Extended Cab 1500')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(25717))(
		$elm$core$Maybe$Just(22604))(
		$elm$core$Maybe$Just(4.8))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(285))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(4548))(
		$elm$core$Maybe$Just(144))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('GMC Sierra HD 2500')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(29322))(
		$elm$core$Maybe$Just(25759))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(300))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(5440))(
		$elm$core$Maybe$Just(133))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('GMC Sonoma Crew Cab')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(25395))(
		$elm$core$Maybe$Just(23043))(
		$elm$core$Maybe$Just(4.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(4083))(
		$elm$core$Maybe$Just(123))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('GMC Yukon XL 2500 SLT')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(46265))(
		$elm$core$Maybe$Just(40534))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(325))(
		$elm$core$Maybe$Just(13))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(6133))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(219))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('Honda Accord EX 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22260))(
		$elm$core$Maybe$Just(20080))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(160))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(34))(
		$elm$core$Maybe$Just(3047))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Honda Accord EX V6 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26960))(
		$elm$core$Maybe$Just(24304))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3294))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Honda Accord LX 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19860))(
		$elm$core$Maybe$Just(17924))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(160))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(34))(
		$elm$core$Maybe$Just(2994))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Honda Accord LX V6 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23760))(
		$elm$core$Maybe$Just(21428))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3349))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Honda Civic DX 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(13270))(
		$elm$core$Maybe$Just(12175))(
		$elm$core$Maybe$Just(1.7))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(38))(
		$elm$core$Maybe$Just(2432))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Honda Civic EX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(17750))(
		$elm$core$Maybe$Just(16265))(
		$elm$core$Maybe$Just(1.7))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(127))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(37))(
		$elm$core$Maybe$Just(2601))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Honda Civic HX 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(14170))(
		$elm$core$Maybe$Just(12996))(
		$elm$core$Maybe$Just(1.7))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(117))(
		$elm$core$Maybe$Just(36))(
		$elm$core$Maybe$Just(44))(
		$elm$core$Maybe$Just(2500))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Honda Civic Hybrid 4dr manual (gas/electric)')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(20140))(
		$elm$core$Maybe$Just(18451))(
		$elm$core$Maybe$Just(1.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(93))(
		$elm$core$Maybe$Just(46))(
		$elm$core$Maybe$Just(51))(
		$elm$core$Maybe$Just(2732))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Honda Civic LX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15850))(
		$elm$core$Maybe$Just(14531))(
		$elm$core$Maybe$Just(1.7))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(38))(
		$elm$core$Maybe$Just(2513))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Honda Civic Si 2dr hatch')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19490))(
		$elm$core$Maybe$Just(17849))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(160))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(2782))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(166))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Honda CR-V LX')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(19860))(
		$elm$core$Maybe$Just(18419))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(160))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3258))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Honda Element LX')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(18690))(
		$elm$core$Maybe$Just(17334))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(160))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3468))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(167))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Honda Insight 2dr (gas/electric)')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19110))(
		$elm$core$Maybe$Just(17911))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(73))(
		$elm$core$Maybe$Just(60))(
		$elm$core$Maybe$Just(66))(
		$elm$core$Maybe$Just(1850))(
		$elm$core$Maybe$Just(95))(
		$elm$core$Maybe$Just(155))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Honda Odyssey EX')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(27450))(
		$elm$core$Maybe$Just(24744))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4365))(
		$elm$core$Maybe$Just(118))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Honda Odyssey LX')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(24950))(
		$elm$core$Maybe$Just(22498))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4310))(
		$elm$core$Maybe$Just(118))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Honda Pilot LX')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(27560))(
		$elm$core$Maybe$Just(24843))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(4387))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(77)),
		$author$project$Uebung2aufgabe5$Car('Honda S2000 convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(33260))(
		$elm$core$Maybe$Just(29965))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(2835))(
		$elm$core$Maybe$Just(95))(
		$elm$core$Maybe$Just(162))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Hummer H2')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(49995))(
		$elm$core$Maybe$Just(45815))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(316))(
		$elm$core$Maybe$Just(10))(
		$elm$core$Maybe$Just(12))(
		$elm$core$Maybe$Just(6400))(
		$elm$core$Maybe$Just(123))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(81)),
		$author$project$Uebung2aufgabe5$Car('Hyundai Accent 2dr hatch')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(10539))(
		$elm$core$Maybe$Just(10107))(
		$elm$core$Maybe$Just(1.6))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2255))(
		$elm$core$Maybe$Just(96))(
		$elm$core$Maybe$Just(167))(
		$elm$core$Maybe$Just(66)),
		$author$project$Uebung2aufgabe5$Car('Hyundai Accent GL 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(11839))(
		$elm$core$Maybe$Just(11116))(
		$elm$core$Maybe$Just(1.6))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2290))(
		$elm$core$Maybe$Just(96))(
		$elm$core$Maybe$Just(167))(
		$elm$core$Maybe$Just(66)),
		$author$project$Uebung2aufgabe5$Car('Hyundai Accent GT 2dr hatch')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(11939))(
		$elm$core$Maybe$Just(11209))(
		$elm$core$Maybe$Just(1.6))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2339))(
		$elm$core$Maybe$Just(96))(
		$elm$core$Maybe$Just(167))(
		$elm$core$Maybe$Just(66)),
		$author$project$Uebung2aufgabe5$Car('Hyundai Elantra GLS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(13839))(
		$elm$core$Maybe$Just(12781))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(138))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(34))(
		$elm$core$Maybe$Just(2635))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Hyundai Elantra GT 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15389))(
		$elm$core$Maybe$Just(14207))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(138))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(34))(
		$elm$core$Maybe$Just(2635))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Hyundai Elantra GT 4dr hatch')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15389))(
		$elm$core$Maybe$Just(14207))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(138))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(34))(
		$elm$core$Maybe$Just(2698))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Hyundai Santa Fe GLS')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(21589))(
		$elm$core$Maybe$Just(20201))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(173))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3549))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Hyundai Sonata GLS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19339))(
		$elm$core$Maybe$Just(17574))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3217))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Hyundai Sonata LX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(20339))(
		$elm$core$Maybe$Just(18380))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3217))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Hyundai Tiburon GT V6 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(18739))(
		$elm$core$Maybe$Just(17101))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(172))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3023))(
		$elm$core$Maybe$Just(100))(
		$elm$core$Maybe$Just(173))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Hyundai XG350 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(24589))(
		$elm$core$Maybe$Just(22055))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3651))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Hyundai XG350 L 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26189))(
		$elm$core$Maybe$Just(23486))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3651))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Infiniti FX35')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(34895))(
		$elm$core$Maybe$Just(31756))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(280))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(4056))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Infiniti FX45')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(36395))(
		$elm$core$Maybe$Just(33121))(
		$elm$core$Maybe$Just(4.5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(315))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(4309))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Infiniti G35 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(28495))(
		$elm$core$Maybe$Just(26157))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(260))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3336))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Infiniti G35 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(32445))(
		$elm$core$Maybe$Just(29783))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(260))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3677))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Infiniti G35 Sport Coupe 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(29795))(
		$elm$core$Maybe$Just(27536))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(280))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3416))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(182))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Infiniti I35 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(31145))(
		$elm$core$Maybe$Just(28320))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(255))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3306))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Infiniti M45 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(42845))(
		$elm$core$Maybe$Just(38792))(
		$elm$core$Maybe$Just(4.5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(340))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(3851))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(197))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Infiniti Q45 Luxury 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(52545))(
		$elm$core$Maybe$Just(47575))(
		$elm$core$Maybe$Just(4.5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(340))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(3977))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Isuzu Ascender S')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(31849))(
		$elm$core$Maybe$Just(29977))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(275))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(4967))(
		$elm$core$Maybe$Just(129))(
		$elm$core$Maybe$Just(208))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Isuzu Rodeo S')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(20449))(
		$elm$core$Maybe$Just(19261))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(193))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(3836))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Jaguar S-Type 3.0 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(43895))(
		$elm$core$Maybe$Just(40004))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(235))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3777))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Jaguar S-Type 4.2 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(49995))(
		$elm$core$Maybe$Just(45556))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(294))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3874))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Jaguar S-Type R 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(63120))(
		$elm$core$Maybe$Just(57499))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(390))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(4046))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Jaguar Vanden Plas 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(68995))(
		$elm$core$Maybe$Just(62846))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(294))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3803))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Jaguar XJ8 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(59995))(
		$elm$core$Maybe$Just(54656))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(294))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3803))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Jaguar XJR 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(74995))(
		$elm$core$Maybe$Just(68306))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(390))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3948))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Jaguar XK8 convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(74995))(
		$elm$core$Maybe$Just(68306))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(294))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3980))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Jaguar XK8 coupe 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(69995))(
		$elm$core$Maybe$Just(63756))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(294))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3779))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Jaguar XKR convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(86995))(
		$elm$core$Maybe$Just(79226))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(390))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(4042))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Jaguar XKR coupe 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(81995))(
		$elm$core$Maybe$Just(74676))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(390))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(3865))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Jaguar X-Type 2.5 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(29995))(
		$elm$core$Maybe$Just(27355))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3428))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Jaguar X-Type 3.0 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(33995))(
		$elm$core$Maybe$Just(30995))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(227))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3516))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Jeep Grand Cherokee Laredo')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(27905))(
		$elm$core$Maybe$Just(25686))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(195))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(3790))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(181))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Jeep Liberty Sport')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(20130))(
		$elm$core$Maybe$Just(18973))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(150))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3826))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(174))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Jeep Wrangler Sahara convertible 2dr')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(25520))(
		$elm$core$Maybe$Just(23275))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(3575))(
		$elm$core$Maybe$Just(93))(
		$elm$core$Maybe$Just(150))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Kia Amanti 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26000))(
		$elm$core$Maybe$Just(23764))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(195))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(196))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Kia Optima LX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(16040))(
		$elm$core$Maybe$Just(14910))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(138))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3281))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(186))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Kia Optima LX V6 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(18435))(
		$elm$core$Maybe$Just(16850))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3279))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(186))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Kia Rio 4dr auto')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(11155))(
		$elm$core$Maybe$Just(10705))(
		$elm$core$Maybe$Just(1.6))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(2458))(
		$elm$core$Maybe$Just(95))(
		$elm$core$Maybe$Just(167))(
		$elm$core$Maybe$Just(66)),
		$author$project$Uebung2aufgabe5$Car('Kia Rio 4dr manual')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(10280))(
		$elm$core$Maybe$Just(9875))(
		$elm$core$Maybe$Just(1.6))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2403))(
		$elm$core$Maybe$Just(95))(
		$elm$core$Maybe$Just(167))(
		$elm$core$Maybe$Just(66)),
		$author$project$Uebung2aufgabe5$Car('Kia Rio Cinco')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(11905))(
		$elm$core$Maybe$Just(11410))(
		$elm$core$Maybe$Just(1.6))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2447))(
		$elm$core$Maybe$Just(95))(
		$elm$core$Maybe$Just(167))(
		$elm$core$Maybe$Just(66)),
		$author$project$Uebung2aufgabe5$Car('Kia Sedona LX')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(20615))(
		$elm$core$Maybe$Just(19400))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(195))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(4802))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Kia Sorento LX')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19635))(
		$elm$core$Maybe$Just(18630))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(4112))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Kia Spectra 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(12360))(
		$elm$core$Maybe$Just(11630))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(124))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(2661))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Kia Spectra GS 4dr hatch')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(13580))(
		$elm$core$Maybe$Just(12830))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(124))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(2686))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Kia Spectra GSX 4dr hatch')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(14630))(
		$elm$core$Maybe$Just(13790))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(124))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(2697))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Land Rover Discovery SE')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(39250))(
		$elm$core$Maybe$Just(35777))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(217))(
		$elm$core$Maybe$Just(12))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(4576))(
		$elm$core$Maybe$Just(100))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Land Rover Freelander SE')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(25995))(
		$elm$core$Maybe$Just(23969))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(174))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(3577))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Land Rover Range Rover HSE')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(72250))(
		$elm$core$Maybe$Just(65807))(
		$elm$core$Maybe$Just(4.4))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(282))(
		$elm$core$Maybe$Just(12))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(5379))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(195))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Lexus ES 330 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(32350))(
		$elm$core$Maybe$Just(28755))(
		$elm$core$Maybe$Just(3.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3460))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(191))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Lexus GS 300 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(41010))(
		$elm$core$Maybe$Just(36196))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3649))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Lexus GS 430 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(48450))(
		$elm$core$Maybe$Just(42232))(
		$elm$core$Maybe$Just(4.3))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(300))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(3715))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Lexus GX 470')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(45700))(
		$elm$core$Maybe$Just(39838))(
		$elm$core$Maybe$Just(4.7))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(235))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(4740))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Lexus IS 300 4dr auto')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(32415))(
		$elm$core$Maybe$Just(28611))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3285))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Lexus IS 300 4dr manual')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(31045))(
		$elm$core$Maybe$Just(27404))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3255))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Lexus IS 300 SportCross')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(32455))(
		$elm$core$Maybe$Just(28647))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3410))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Lexus LS 430 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(55750))(
		$elm$core$Maybe$Just(48583))(
		$elm$core$Maybe$Just(4.3))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(290))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3990))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(197))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Lexus LX 470')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(64800))(
		$elm$core$Maybe$Just(56455))(
		$elm$core$Maybe$Just(4.7))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(235))(
		$elm$core$Maybe$Just(13))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(5590))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(193))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Lexus RX 330')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(39195))(
		$elm$core$Maybe$Just(34576))(
		$elm$core$Maybe$Just(3.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(230))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(4065))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(186))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Lexus SC 430 convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(63200))(
		$elm$core$Maybe$Just(55063))(
		$elm$core$Maybe$Just(4.3))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(300))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(3840))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Lincoln Aviator Ultimate')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(42915))(
		$elm$core$Maybe$Just(39443))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(302))(
		$elm$core$Maybe$Just(13))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(4834))(
		$elm$core$Maybe$Just(114))(
		$elm$core$Maybe$Just(193))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Lincoln LS V6 Luxury 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(32495))(
		$elm$core$Maybe$Just(29969))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(232))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3681))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Lincoln LS V6 Premium 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(36895))(
		$elm$core$Maybe$Just(33929))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(232))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3681))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Lincoln LS V8 Sport 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(40095))(
		$elm$core$Maybe$Just(36809))(
		$elm$core$Maybe$Just(3.9))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(280))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3768))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Lincoln LS V8 Ultimate 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(43495))(
		$elm$core$Maybe$Just(39869))(
		$elm$core$Maybe$Just(3.9))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(280))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3768))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Lincoln Navigator Luxury')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(52775))(
		$elm$core$Maybe$Just(46360))(
		$elm$core$Maybe$Just(5.4))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(300))(
		$elm$core$Maybe$Just(13))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(5969))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(206))(
		$elm$core$Maybe$Just(80)),
		$author$project$Uebung2aufgabe5$Car('Lincoln Town Car Signature 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(41815))(
		$elm$core$Maybe$Just(38418))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(239))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4369))(
		$elm$core$Maybe$Just(118))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Lincoln Town Car Ultimate 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(44925))(
		$elm$core$Maybe$Just(41217))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(239))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4369))(
		$elm$core$Maybe$Just(118))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Lincoln Town Car Ultimate L 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(50470))(
		$elm$core$Maybe$Just(46208))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(239))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4474))(
		$elm$core$Maybe$Just(124))(
		$elm$core$Maybe$Just(221))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Mazda B2300 SX Regular Cab')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(14840))(
		$elm$core$Maybe$Just(14070))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(143))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(2960))(
		$elm$core$Maybe$Just(112))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Mazda B4000 SE Cab Plus')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(22350))(
		$elm$core$Maybe$Just(20482))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(207))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(3571))(
		$elm$core$Maybe$Just(126))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Mazda MPV ES')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(28750))(
		$elm$core$Maybe$Just(26600))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3812))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Mazda MX-5 Miata convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(22388))(
		$elm$core$Maybe$Just(20701))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(142))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(2387))(
		$elm$core$Maybe$Just(89))(
		$elm$core$Maybe$Just(156))(
		$elm$core$Maybe$Just(66)),
		$author$project$Uebung2aufgabe5$Car('Mazda MX-5 Miata LS convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(25193))(
		$elm$core$Maybe$Just(23285))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(142))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(2387))(
		$elm$core$Maybe$Just(89))(
		$elm$core$Maybe$Just(156))(
		$elm$core$Maybe$Just(66)),
		$author$project$Uebung2aufgabe5$Car('Mazda RX-8 4dr automatic')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(25700))(
		$elm$core$Maybe$Just(23794))(
		$elm$core$Maybe$Just(1.3))(
		$elm$core$Maybe$Just(-1))(
		$elm$core$Maybe$Just(197))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3053))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(174))($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Mazda RX-8 4dr manual')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(27200))(
		$elm$core$Maybe$Just(25179))(
		$elm$core$Maybe$Just(1.3))(
		$elm$core$Maybe$Just(-1))(
		$elm$core$Maybe$Just(238))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3029))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(174))($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Mazda Tribute DX 2.0')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(21087))(
		$elm$core$Maybe$Just(19742))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3091))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(173))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Mazda3 i 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15500))(
		$elm$core$Maybe$Just(14525))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(148))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(2696))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Mazda3 s 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(17200))(
		$elm$core$Maybe$Just(15922))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(160))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(2762))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Mazda6 i 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19270))(
		$elm$core$Maybe$Just(17817))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(160))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(3042))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz C230 Sport 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(26060))(
		$elm$core$Maybe$Just(24249))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3250))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz C240')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(33780))(
		$elm$core$Maybe$Just(31466))(
		$elm$core$Maybe$Just(2.6))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(168))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3470))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz C240 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(32280))(
		$elm$core$Maybe$Just(30071))(
		$elm$core$Maybe$Just(2.6))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(168))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3360))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz C240 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(33480))(
		$elm$core$Maybe$Just(31187))(
		$elm$core$Maybe$Just(2.6))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(168))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3360))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz C32 AMG 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(52120))(
		$elm$core$Maybe$Just(48522))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(349))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(3540))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz C320 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(37630))(
		$elm$core$Maybe$Just(35046))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3450))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz C320 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(38830))(
		$elm$core$Maybe$Just(36162))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(27))($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz C320 Sport 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(28370))(
		$elm$core$Maybe$Just(26435))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3430))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz C320 Sport 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(35920))(
		$elm$core$Maybe$Just(33456))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3430))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz CL500 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(94820))(
		$elm$core$Maybe$Just(88324))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(302))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(4085))(
		$elm$core$Maybe$Just(114))(
		$elm$core$Maybe$Just(196))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz CL600 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(128420))(
		$elm$core$Maybe$Just(119600))(
		$elm$core$Maybe$Just(5.5))(
		$elm$core$Maybe$Just(12))(
		$elm$core$Maybe$Just(493))(
		$elm$core$Maybe$Just(13))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(4473))(
		$elm$core$Maybe$Just(114))(
		$elm$core$Maybe$Just(196))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz CLK320 coupe 2dr (convertible)')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(45707))(
		$elm$core$Maybe$Just(41966))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3770))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz CLK500 coupe 2dr (convertible)')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(52800))(
		$elm$core$Maybe$Just(49104))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(302))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(3585))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz E320')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(50670))(
		$elm$core$Maybe$Just(47174))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(221))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3966))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz E320 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(48170))(
		$elm$core$Maybe$Just(44849))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(221))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3635))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz E500')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(60670))(
		$elm$core$Maybe$Just(56474))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(302))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(4230))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz E500 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(57270))(
		$elm$core$Maybe$Just(53382))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(302))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(3815))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz G500')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(76870))(
		$elm$core$Maybe$Just(71540))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(292))(
		$elm$core$Maybe$Just(13))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(5423))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(186))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz ML500')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(46470))(
		$elm$core$Maybe$Just(43268))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(288))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(4874))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz S430 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(74320))(
		$elm$core$Maybe$Just(69168))(
		$elm$core$Maybe$Just(4.3))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(275))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(4160))(
		$elm$core$Maybe$Just(122))(
		$elm$core$Maybe$Just(203))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz S500 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(86970))(
		$elm$core$Maybe$Just(80939))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(302))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(4390))(
		$elm$core$Maybe$Just(122))(
		$elm$core$Maybe$Just(203))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz SL500 convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(90520))(
		$elm$core$Maybe$Just(84325))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(302))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(4065))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz SL55 AMG 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(121770))(
		$elm$core$Maybe$Just(113388))(
		$elm$core$Maybe$Just(5.5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(493))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(4235))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz SL600 convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(126670))(
		$elm$core$Maybe$Just(117854))(
		$elm$core$Maybe$Just(5.5))(
		$elm$core$Maybe$Just(12))(
		$elm$core$Maybe$Just(493))(
		$elm$core$Maybe$Just(13))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(4429))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz SLK230 convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(40320))(
		$elm$core$Maybe$Just(37548))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3055))(
		$elm$core$Maybe$Just(95))(
		$elm$core$Maybe$Just(158))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Mercedes-Benz SLK32 AMG 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(56170))(
		$elm$core$Maybe$Just(52289))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(349))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(3220))(
		$elm$core$Maybe$Just(95))(
		$elm$core$Maybe$Just(158))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Mercury Grand Marquis GS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(24695))(
		$elm$core$Maybe$Just(23217))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(224))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4052))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(212))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Mercury Grand Marquis LS Premium 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(29595))(
		$elm$core$Maybe$Just(27148))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(224))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4052))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(212))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Mercury Grand Marquis LS Ultimate 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(30895))(
		$elm$core$Maybe$Just(28318))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(224))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4052))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(212))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Mercury Marauder 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(34495))(
		$elm$core$Maybe$Just(31558))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(302))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(4195))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(212))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Mercury Monterey Luxury')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(33995))(
		$elm$core$Maybe$Just(30846))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(4340))(
		$elm$core$Maybe$Just(121))(
		$elm$core$Maybe$Just(202))(
		$elm$core$Maybe$Just(77)),
		$author$project$Uebung2aufgabe5$Car('Mercury Mountaineer')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(29995))(
		$elm$core$Maybe$Just(27317))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(4374))(
		$elm$core$Maybe$Just(114))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Mercury Sable GS')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22595))(
		$elm$core$Maybe$Just(20748))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(155))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3488))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(198))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Mercury Sable GS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(21595))(
		$elm$core$Maybe$Just(19848))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(155))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3308))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Mercury Sable LS Premium 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23895))(
		$elm$core$Maybe$Just(21918))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3315))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Mini Cooper')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(16999))(
		$elm$core$Maybe$Just(15437))(
		$elm$core$Maybe$Just(1.6))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(37))(
		$elm$core$Maybe$Just(2524))(
		$elm$core$Maybe$Just(97))(
		$elm$core$Maybe$Just(143))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Mini Cooper S')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19999))(
		$elm$core$Maybe$Just(18137))(
		$elm$core$Maybe$Just(1.6))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(163))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(34))(
		$elm$core$Maybe$Just(2678))(
		$elm$core$Maybe$Just(97))(
		$elm$core$Maybe$Just(144))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Diamante LS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(29282))(
		$elm$core$Maybe$Just(27250))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(205))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3549))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Eclipse GTS 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(25092))(
		$elm$core$Maybe$Just(23456))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3241))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Eclipse Spyder GT convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26992))(
		$elm$core$Maybe$Just(25218))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3296))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Endeavor XLS')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(30492))(
		$elm$core$Maybe$Just(28330))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(4134))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Galant ES 2.4L 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19312))(
		$elm$core$Maybe$Just(17957))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(160))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(3351))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(191))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Galant GTS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(25700))(
		$elm$core$Maybe$Just(23883))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(230))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3649))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(191))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Lancer ES 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(14622))(
		$elm$core$Maybe$Just(13751))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(120))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(2656))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(181))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Lancer Evolution 4dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(29562))(
		$elm$core$Maybe$Just(27466))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(271))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3263))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Lancer LS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(16722))(
		$elm$core$Maybe$Just(15718))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(120))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(2795))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(181))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Lancer OZ Rally 4dr auto')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(17232))(
		$elm$core$Maybe$Just(16196))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(120))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(2744))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(181))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Lancer Sportback LS')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(17495))(
		$elm$core$Maybe$Just(16295))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(160))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(3020))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(181))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Montero XLS')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(33112))(
		$elm$core$Maybe$Just(30763))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(215))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(4718))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Mitsubishi Outlander LS')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(18892))(
		$elm$core$Maybe$Just(17569))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(160))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3240))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(179))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Nissan 350Z coupe 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(26910))(
		$elm$core$Maybe$Just(25203))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(287))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3188))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(169))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Nissan 350Z Enthusiast convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(34390))(
		$elm$core$Maybe$Just(31845))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(287))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3428))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(169))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Nissan Altima S 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19240))(
		$elm$core$Maybe$Just(18030))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3039))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Nissan Altima SE 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23290))(
		$elm$core$Maybe$Just(21580))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(245))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3197))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Nissan Frontier King Cab XE V6')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(19479))(
		$elm$core$Maybe$Just(18253))(
		$elm$core$Maybe$Just(3.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(3932))(
		$elm$core$Maybe$Just(116))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Nissan Maxima SE 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(27490))(
		$elm$core$Maybe$Just(25182))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(265))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3473))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Nissan Maxima SL 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(29440))(
		$elm$core$Maybe$Just(26966))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(265))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3476))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Nissan Murano SL')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(28739))(
		$elm$core$Maybe$Just(27300))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(245))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3801))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Nissan Pathfinder Armada SE')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(33840))(
		$elm$core$Maybe$Just(30815))(
		$elm$core$Maybe$Just(5.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(305))(
		$elm$core$Maybe$Just(13))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(5013))(
		$elm$core$Maybe$Just(123))(
		$elm$core$Maybe$Just(207))(
		$elm$core$Maybe$Just(79)),
		$author$project$Uebung2aufgabe5$Car('Nissan Pathfinder SE')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(27339))(
		$elm$core$Maybe$Just(25972))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(3871))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Nissan Quest S')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(24780))(
		$elm$core$Maybe$Just(22958))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(4012))(
		$elm$core$Maybe$Just(124))(
		$elm$core$Maybe$Just(204))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Nissan Quest SE')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(32780))(
		$elm$core$Maybe$Just(30019))(
		$elm$core$Maybe$Just(3.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4175))(
		$elm$core$Maybe$Just(124))(
		$elm$core$Maybe$Just(204))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Nissan Sentra 1.8 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(12740))(
		$elm$core$Maybe$Just(12205))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(126))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(35))(
		$elm$core$Maybe$Just(2513))(
		$elm$core$Maybe$Just(100))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Nissan Sentra 1.8 S 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(14740))(
		$elm$core$Maybe$Just(13747))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(126))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(35))(
		$elm$core$Maybe$Just(2581))(
		$elm$core$Maybe$Just(100))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Nissan Sentra SE-R 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(17640))(
		$elm$core$Maybe$Just(16444))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(165))(
		$elm$core$Maybe$Just(23))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(2761))(
		$elm$core$Maybe$Just(100))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Nissan Titan King Cab XE')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(26650))(
		$elm$core$Maybe$Just(24926))(
		$elm$core$Maybe$Just(5.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(305))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(5287))(
		$elm$core$Maybe$Just(140))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Nissan Xterra XE V6')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(20939))(
		$elm$core$Maybe$Just(19512))(
		$elm$core$Maybe$Just(3.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(3760))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Oldsmobile Alero GLS 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23675))(
		$elm$core$Maybe$Just(21485))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3085))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Oldsmobile Alero GX 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(18825))(
		$elm$core$Maybe$Just(17642))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(2946))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Oldsmobile Silhouette GL')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(28790))(
		$elm$core$Maybe$Just(26120))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3948))(
		$elm$core$Maybe$Just(120))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Pontiac Aztekt')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(21595))(
		$elm$core$Maybe$Just(19810))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3779))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(182))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Pontiac Bonneville GXP 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(35995))(
		$elm$core$Maybe$Just(32997))(
		$elm$core$Maybe$Just(4.6))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(275))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(3790))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(203))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Pontiac Grand Am GT 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22450))(
		$elm$core$Maybe$Just(20595))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3118))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(186))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Pontiac Grand Prix GT1 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22395))(
		$elm$core$Maybe$Just(20545))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3477))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(198))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Pontiac Grand Prix GT2 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(24295))(
		$elm$core$Maybe$Just(22284))(
		$elm$core$Maybe$Just(3.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3484))(
		$elm$core$Maybe$Just(111))(
		$elm$core$Maybe$Just(198))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Pontiac GTO 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(33500))(
		$elm$core$Maybe$Just(30710))(
		$elm$core$Maybe$Just(5.7))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(340))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(3725))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Pontiac Montana')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23845))(
		$elm$core$Maybe$Just(21644))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3803))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Pontiac Montana EWB')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(31370))(
		$elm$core$Maybe$Just(28454))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(4431))(
		$elm$core$Maybe$Just(121))(
		$elm$core$Maybe$Just(201))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Pontiac Sunfire 1SA 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15495))(
		$elm$core$Maybe$Just(14375))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2771))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(182))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Pontiac Sunfire 1SC 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(17735))(
		$elm$core$Maybe$Just(16369))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2771))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(182))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Pontiac Vibe')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(17045))(
		$elm$core$Maybe$Just(15973))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(36))(
		$elm$core$Maybe$Just(2701))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(172))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Porsche 911 Carrera 4S coupe 2dr (convert)')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(84165))(
		$elm$core$Maybe$Just(72206))(
		$elm$core$Maybe$Just(3.6))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(315))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3240))(
		$elm$core$Maybe$Just(93))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Porsche 911 Carrera convertible 2dr (coupe)')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(79165))(
		$elm$core$Maybe$Just(69229))(
		$elm$core$Maybe$Just(3.6))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(315))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3135))(
		$elm$core$Maybe$Just(93))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Porsche 911 GT2 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(192465))(
		$elm$core$Maybe$Just(173560))(
		$elm$core$Maybe$Just(3.6))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(477))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3131))(
		$elm$core$Maybe$Just(93))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Porsche 911 Targa coupe 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(76765))(
		$elm$core$Maybe$Just(67128))(
		$elm$core$Maybe$Just(3.6))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(315))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3119))(
		$elm$core$Maybe$Just(93))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Porsche Boxster convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(43365))(
		$elm$core$Maybe$Just(37886))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(228))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(2811))(
		$elm$core$Maybe$Just(95))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Porsche Boxster S convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(52365))(
		$elm$core$Maybe$Just(45766))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(258))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(2911))(
		$elm$core$Maybe$Just(95))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Porsche Cayenne S')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(56665))(
		$elm$core$Maybe$Just(49865))(
		$elm$core$Maybe$Just(4.5))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(340))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(4950))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Saab 9-3 Aero 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(33360))(
		$elm$core$Maybe$Just(31562))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3175))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Saab 9-3 Aero convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(43175))(
		$elm$core$Maybe$Just(40883))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3700))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(182))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Saab 9-3 Arc convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(40670))(
		$elm$core$Maybe$Just(38520))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3480))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(182))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Saab 9-3 Arc Sport 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(30860))(
		$elm$core$Maybe$Just(29269))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3175))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(183))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Saab 9-5 Aero')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(40845))(
		$elm$core$Maybe$Just(38376))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(250))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3620))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Saab 9-5 Aero 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(39465))(
		$elm$core$Maybe$Just(37721))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(250))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3470))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Saab 9-5 Arc 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(35105))(
		$elm$core$Maybe$Just(33011))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3470))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Saturn Ion1 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(10995))(
		$elm$core$Maybe$Just(10319))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(35))(
		$elm$core$Maybe$Just(2692))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Saturn L300 2')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23560))(
		$elm$core$Maybe$Just(21779))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(34))(
		$elm$core$Maybe$Just(3109))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Saturn L300-2 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(21410))(
		$elm$core$Maybe$Just(19801))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(182))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3197))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Saturn lon2 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(14300))(
		$elm$core$Maybe$Just(13393))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(35))(
		$elm$core$Maybe$Just(2692))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Saturn lon2 quad coupe 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(14850))(
		$elm$core$Maybe$Just(13904))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(35))(
		$elm$core$Maybe$Just(2751))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Saturn lon3 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15825))(
		$elm$core$Maybe$Just(14811))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(35))(
		$elm$core$Maybe$Just(2692))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Saturn lon3 quad coupe 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(16350))(
		$elm$core$Maybe$Just(15299))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(140))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(35))(
		$elm$core$Maybe$Just(2751))(
		$elm$core$Maybe$Just(103))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Saturn VUE')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(20585))(
		$elm$core$Maybe$Just(19238))(
		$elm$core$Maybe$Just(2.2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(143))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3381))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(181))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Scion xA 4dr hatch')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(12965))(
		$elm$core$Maybe$Just(12340))(
		$elm$core$Maybe$Just(1.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(38))(
		$elm$core$Maybe$Just(2340))(
		$elm$core$Maybe$Just(93))(
		$elm$core$Maybe$Just(154))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Scion xB')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(14165))(
		$elm$core$Maybe$Just(13480))(
		$elm$core$Maybe$Just(1.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(31))(
		$elm$core$Maybe$Just(35))(
		$elm$core$Maybe$Just(2425))(
		$elm$core$Maybe$Just(98))(
		$elm$core$Maybe$Just(155))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Subaru Baja')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(24520))(
		$elm$core$Maybe$Just(22304))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(165))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3485))(
		$elm$core$Maybe$Just(104))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Subaru Forester X')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(21445))(
		$elm$core$Maybe$Just(19646))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(165))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3090))(
		$elm$core$Maybe$Just(99))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Subaru Impreza 2.5 RS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(19945))(
		$elm$core$Maybe$Just(18399))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(165))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(2965))(
		$elm$core$Maybe$Just(99))(
		$elm$core$Maybe$Just(174))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Subaru Impreza WRX 4dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(25045))(
		$elm$core$Maybe$Just(23022))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(227))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3085))(
		$elm$core$Maybe$Just(99))(
		$elm$core$Maybe$Just(174))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Subaru Impreza WRX STi 4dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(31545))(
		$elm$core$Maybe$Just(29130))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(300))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3263))(
		$elm$core$Maybe$Just(100))(
		$elm$core$Maybe$Just(174))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Subaru Legacy GT 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(25645))(
		$elm$core$Maybe$Just(23336))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(165))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3395))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Subaru Legacy L 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(20445))(
		$elm$core$Maybe$Just(18713))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(165))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3285))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Subaru Outback')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(23895))(
		$elm$core$Maybe$Just(21773))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(165))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3430))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Subaru Outback H6 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(29345))(
		$elm$core$Maybe$Just(26660))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(212))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3610))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Subaru Outback H-6 VDC 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(31545))(
		$elm$core$Maybe$Just(28603))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(212))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3630))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Subaru Outback Limited Sedan 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(27145))(
		$elm$core$Maybe$Just(24687))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(165))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3495))(
		$elm$core$Maybe$Just(104))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Suzuki Aeno S 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(12884))(
		$elm$core$Maybe$Just(12719))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(155))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(31))(
		$elm$core$Maybe$Just(2676))(
		$elm$core$Maybe$Just(98))(
		$elm$core$Maybe$Just(171))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Suzuki Aerio LX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(14500))(
		$elm$core$Maybe$Just(14317))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(155))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(31))(
		$elm$core$Maybe$Just(2676))(
		$elm$core$Maybe$Just(98))(
		$elm$core$Maybe$Just(171))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Suzuki Aerio SX')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(16497))(
		$elm$core$Maybe$Just(16291))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(155))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(2932))(
		$elm$core$Maybe$Just(98))(
		$elm$core$Maybe$Just(167))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Suzuki Forenza EX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15568))(
		$elm$core$Maybe$Just(15378))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(2756))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Suzuki Forenza S 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(12269))(
		$elm$core$Maybe$Just(12116))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(31))(
		$elm$core$Maybe$Just(2701))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(177))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Suzuki Verona LX 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(17262))(
		$elm$core$Maybe$Just(17053))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(155))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3380))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(188))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Suzuki Vitara LX')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(17163))(
		$elm$core$Maybe$Just(16949))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(165))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(3020))(
		$elm$core$Maybe$Just(98))(
		$elm$core$Maybe$Just(163))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Suzuki XL-7 EX')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23699))(
		$elm$core$Maybe$Just(22307))(
		$elm$core$Maybe$Just(2.7))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(3682))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Toyota 4Runner SR5 V6')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(27710))(
		$elm$core$Maybe$Just(24801))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(245))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(4035))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(74)),
		$author$project$Uebung2aufgabe5$Car('Toyota Avalon XL 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26560))(
		$elm$core$Maybe$Just(23693))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3417))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Toyota Avalon XLS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(30920))(
		$elm$core$Maybe$Just(27271))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3439))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(192))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Toyota Camry LE 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19560))(
		$elm$core$Maybe$Just(17558))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(157))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(3086))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Toyota Camry LE V6 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22775))(
		$elm$core$Maybe$Just(20325))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3296))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Toyota Camry Solara SE 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19635))(
		$elm$core$Maybe$Just(17722))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(157))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(3175))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(193))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Toyota Camry Solara SE V6 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(21965))(
		$elm$core$Maybe$Just(19819))(
		$elm$core$Maybe$Just(3.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3417))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(193))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Toyota Camry Solara SLE V6 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26510))(
		$elm$core$Maybe$Just(23908))(
		$elm$core$Maybe$Just(3.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(225))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3439))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(193))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Toyota Camry XLE V6 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(25920))(
		$elm$core$Maybe$Just(23125))(
		$elm$core$Maybe$Just(3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(210))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(3362))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Toyota Celica GT-S 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(22570))(
		$elm$core$Maybe$Just(20363))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(2500))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(171))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Toyota Corolla CE 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(14085))(
		$elm$core$Maybe$Just(13065))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(40))(
		$elm$core$Maybe$Just(2502))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Toyota Corolla LE 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15295))(
		$elm$core$Maybe$Just(13889))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(40))(
		$elm$core$Maybe$Just(2524))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Toyota Corolla S 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(15030))(
		$elm$core$Maybe$Just(13650))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(40))(
		$elm$core$Maybe$Just(2524))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Toyota Echo 2dr auto')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(11560))(
		$elm$core$Maybe$Just(10896))(
		$elm$core$Maybe$Just(1.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(33))(
		$elm$core$Maybe$Just(39))(
		$elm$core$Maybe$Just(2085))(
		$elm$core$Maybe$Just(93))(
		$elm$core$Maybe$Just(163))(
		$elm$core$Maybe$Just(65)),
		$author$project$Uebung2aufgabe5$Car('Toyota Echo 2dr manual')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(10760))(
		$elm$core$Maybe$Just(10144))(
		$elm$core$Maybe$Just(1.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(35))(
		$elm$core$Maybe$Just(43))(
		$elm$core$Maybe$Just(2035))(
		$elm$core$Maybe$Just(93))(
		$elm$core$Maybe$Just(163))(
		$elm$core$Maybe$Just(65)),
		$author$project$Uebung2aufgabe5$Car('Toyota Echo 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(11290))(
		$elm$core$Maybe$Just(10642))(
		$elm$core$Maybe$Just(1.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(108))(
		$elm$core$Maybe$Just(35))(
		$elm$core$Maybe$Just(43))(
		$elm$core$Maybe$Just(2055))(
		$elm$core$Maybe$Just(93))(
		$elm$core$Maybe$Just(163))(
		$elm$core$Maybe$Just(65)),
		$author$project$Uebung2aufgabe5$Car('Toyota Highlander V6')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(27930))(
		$elm$core$Maybe$Just(24915))(
		$elm$core$Maybe$Just(3.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(230))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(3935))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Toyota Land Cruiser')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(54765))(
		$elm$core$Maybe$Just(47986))(
		$elm$core$Maybe$Just(4.7))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(325))(
		$elm$core$Maybe$Just(13))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(5390))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(193))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Toyota Matrix XR')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(16695))(
		$elm$core$Maybe$Just(15156))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(130))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(36))(
		$elm$core$Maybe$Just(2679))(
		$elm$core$Maybe$Just(102))(
		$elm$core$Maybe$Just(171))(
		$elm$core$Maybe$Just(70)),
		$author$project$Uebung2aufgabe5$Car('Toyota MR2 Spyder convertible 2dr')($author$project$Uebung2aufgabe5$Sports_Car)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(25130))(
		$elm$core$Maybe$Just(22787))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(138))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(32))(
		$elm$core$Maybe$Just(2195))(
		$elm$core$Maybe$Just(97))(
		$elm$core$Maybe$Just(153))(
		$elm$core$Maybe$Just(67)),
		$author$project$Uebung2aufgabe5$Car('Toyota Prius 4dr (gas/electric)')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(20510))(
		$elm$core$Maybe$Just(18926))(
		$elm$core$Maybe$Just(1.5))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(59))(
		$elm$core$Maybe$Just(51))(
		$elm$core$Maybe$Just(2890))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(175))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Toyota RAV4')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(20290))(
		$elm$core$Maybe$Just(18553))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(161))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3119))(
		$elm$core$Maybe$Just(98))(
		$elm$core$Maybe$Just(167))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Toyota Sequoia SR5')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(35695))(
		$elm$core$Maybe$Just(31827))(
		$elm$core$Maybe$Just(4.7))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(240))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(5270))(
		$elm$core$Maybe$Just(118))(
		$elm$core$Maybe$Just(204))(
		$elm$core$Maybe$Just(78)),
		$author$project$Uebung2aufgabe5$Car('Toyota Sienna CE')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23495))(
		$elm$core$Maybe$Just(21198))(
		$elm$core$Maybe$Just(3.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(230))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(4120))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(77)),
		$author$project$Uebung2aufgabe5$Car('Toyota Sienna XLE Limited')($author$project$Uebung2aufgabe5$Minivan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(28800))(
		$elm$core$Maybe$Just(25690))(
		$elm$core$Maybe$Just(3.3))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(230))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(4165))(
		$elm$core$Maybe$Just(119))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(77)),
		$author$project$Uebung2aufgabe5$Car('Toyota Tacoma')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(12800))(
		$elm$core$Maybe$Just(11879))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(142))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(2750))(
		$elm$core$Maybe$Just(103))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Toyota Tundra Access Cab V6 SR5')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(25935))(
		$elm$core$Maybe$Just(23520))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(14))(
		$elm$core$Maybe$Just(17))(
		$elm$core$Maybe$Just(4435))(
		$elm$core$Maybe$Just(128))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Toyota Tundra Regular Cab V6')($author$project$Uebung2aufgabe5$Pickup)($author$project$Uebung2aufgabe5$Rear_Wheel_Drive)(
		$elm$core$Maybe$Just(16495))(
		$elm$core$Maybe$Just(14978))(
		$elm$core$Maybe$Just(3.4))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(16))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(3925))(
		$elm$core$Maybe$Just(128))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Golf GLS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(18715))(
		$elm$core$Maybe$Just(17478))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(31))(
		$elm$core$Maybe$Just(2897))(
		$elm$core$Maybe$Just(99))(
		$elm$core$Maybe$Just(165))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen GTI 1.8T 2dr hatch')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19825))(
		$elm$core$Maybe$Just(18109))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(31))(
		$elm$core$Maybe$Just(2934))(
		$elm$core$Maybe$Just(99))(
		$elm$core$Maybe$Just(168))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Jetta GL')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(19005))(
		$elm$core$Maybe$Just(17427))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3034))(
		$elm$core$Maybe$Just(99))(
		$elm$core$Maybe$Just(174))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Jetta GLI VR6 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23785))(
		$elm$core$Maybe$Just(21686))(
		$elm$core$Maybe$Just(2.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(200))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3179))(
		$elm$core$Maybe$Just(99))(
		$elm$core$Maybe$Just(172))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Jetta GLS TDI 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(21055))(
		$elm$core$Maybe$Just(19638))(
		$elm$core$Maybe$Just(1.9))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(100))(
		$elm$core$Maybe$Just(38))(
		$elm$core$Maybe$Just(46))(
		$elm$core$Maybe$Just(3003))(
		$elm$core$Maybe$Just(99))(
		$elm$core$Maybe$Just(172))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen New Beetle GLS 1.8T 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(21055))(
		$elm$core$Maybe$Just(19638))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(150))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(31))(
		$elm$core$Maybe$Just(2820))(
		$elm$core$Maybe$Just(99))(
		$elm$core$Maybe$Just(161))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen New Beetle GLS convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23215))(
		$elm$core$Maybe$Just(21689))(
		$elm$core$Maybe$Just(2))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(115))(
		$elm$core$Maybe$Just(24))(
		$elm$core$Maybe$Just(30))(
		$elm$core$Maybe$Just(3082))(
		$elm$core$Maybe$Just(99))(
		$elm$core$Maybe$Just(161))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Passat GLS 1.8T')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(24955))(
		$elm$core$Maybe$Just(22801))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(31))(
		$elm$core$Maybe$Just(3338))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Passat GLS 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(23955))(
		$elm$core$Maybe$Just(21898))(
		$elm$core$Maybe$Just(1.8))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(31))(
		$elm$core$Maybe$Just(3241))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Passat GLX V6 4MOTION 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(33180))(
		$elm$core$Maybe$Just(30583))(
		$elm$core$Maybe$Just(2.8))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3721))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Passat W8')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(40235))(
		$elm$core$Maybe$Just(36956))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(270))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(4067))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(184))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Passat W8 4MOTION 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(39235))(
		$elm$core$Maybe$Just(36052))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(270))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3953))(
		$elm$core$Maybe$Just(106))(
		$elm$core$Maybe$Just(185))(
		$elm$core$Maybe$Just(69)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Phaeton 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(65000))(
		$elm$core$Maybe$Just(59912))(
		$elm$core$Maybe$Just(4.2))(
		$elm$core$Maybe$Just(8))(
		$elm$core$Maybe$Just(335))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(5194))(
		$elm$core$Maybe$Just(118))(
		$elm$core$Maybe$Just(204))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Phaeton W12 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(75000))(
		$elm$core$Maybe$Just(69130))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(12))(
		$elm$core$Maybe$Just(420))($elm$core$Maybe$Nothing)($elm$core$Maybe$Nothing)(
		$elm$core$Maybe$Just(5399))(
		$elm$core$Maybe$Just(118))(
		$elm$core$Maybe$Just(204))(
		$elm$core$Maybe$Just(75)),
		$author$project$Uebung2aufgabe5$Car('Volkswagen Touareg V6')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(35515))(
		$elm$core$Maybe$Just(32243))(
		$elm$core$Maybe$Just(3.2))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(220))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(5086))(
		$elm$core$Maybe$Just(112))(
		$elm$core$Maybe$Just(187))(
		$elm$core$Maybe$Just(76)),
		$author$project$Uebung2aufgabe5$Car('Volvo C70 HPT convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(42565))(
		$elm$core$Maybe$Just(40083))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(242))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3450))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(186))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Volvo C70 LPT convertible 2dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(40565))(
		$elm$core$Maybe$Just(38203))(
		$elm$core$Maybe$Just(2.4))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(197))(
		$elm$core$Maybe$Just(21))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3450))(
		$elm$core$Maybe$Just(105))(
		$elm$core$Maybe$Just(186))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Volvo S40 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(25135))(
		$elm$core$Maybe$Just(23701))(
		$elm$core$Maybe$Just(1.9))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(2767))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(178))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Volvo S60 2.5 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(31745))(
		$elm$core$Maybe$Just(29916))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(208))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3903))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Volvo S60 R 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(37560))(
		$elm$core$Maybe$Just(35382))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(300))(
		$elm$core$Maybe$Just(18))(
		$elm$core$Maybe$Just(25))(
		$elm$core$Maybe$Just(3571))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(181))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Volvo S60 T5 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(34845))(
		$elm$core$Maybe$Just(32902))(
		$elm$core$Maybe$Just(2.3))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(247))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3766))(
		$elm$core$Maybe$Just(107))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(71)),
		$author$project$Uebung2aufgabe5$Car('Volvo S80 2.5T 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(37885))(
		$elm$core$Maybe$Just(35688))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(194))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3691))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Volvo S80 2.9 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(37730))(
		$elm$core$Maybe$Just(35542))(
		$elm$core$Maybe$Just(2.9))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(208))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(28))(
		$elm$core$Maybe$Just(3576))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Volvo S80 T6 4dr')($author$project$Uebung2aufgabe5$Small_Sporty_Compact_Large_Sedan)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(45210))(
		$elm$core$Maybe$Just(42573))(
		$elm$core$Maybe$Just(2.9))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(268))(
		$elm$core$Maybe$Just(19))(
		$elm$core$Maybe$Just(26))(
		$elm$core$Maybe$Just(3653))(
		$elm$core$Maybe$Just(110))(
		$elm$core$Maybe$Just(190))(
		$elm$core$Maybe$Just(72)),
		$author$project$Uebung2aufgabe5$Car('Volvo V40')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$Front_Wheel_Drive)(
		$elm$core$Maybe$Just(26135))(
		$elm$core$Maybe$Just(24641))(
		$elm$core$Maybe$Just(1.9))(
		$elm$core$Maybe$Just(4))(
		$elm$core$Maybe$Just(170))(
		$elm$core$Maybe$Just(22))(
		$elm$core$Maybe$Just(29))(
		$elm$core$Maybe$Just(2822))(
		$elm$core$Maybe$Just(101))(
		$elm$core$Maybe$Just(180))(
		$elm$core$Maybe$Just(68)),
		$author$project$Uebung2aufgabe5$Car('Volvo XC70')($author$project$Uebung2aufgabe5$Wagon)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(35145))(
		$elm$core$Maybe$Just(33112))(
		$elm$core$Maybe$Just(2.5))(
		$elm$core$Maybe$Just(5))(
		$elm$core$Maybe$Just(208))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(27))(
		$elm$core$Maybe$Just(3823))(
		$elm$core$Maybe$Just(109))(
		$elm$core$Maybe$Just(186))(
		$elm$core$Maybe$Just(73)),
		$author$project$Uebung2aufgabe5$Car('Volvo XC90 T6')($author$project$Uebung2aufgabe5$SUV)($author$project$Uebung2aufgabe5$All_Wheel_Drive)(
		$elm$core$Maybe$Just(41250))(
		$elm$core$Maybe$Just(38851))(
		$elm$core$Maybe$Just(2.9))(
		$elm$core$Maybe$Just(6))(
		$elm$core$Maybe$Just(268))(
		$elm$core$Maybe$Just(15))(
		$elm$core$Maybe$Just(20))(
		$elm$core$Maybe$Just(4638))(
		$elm$core$Maybe$Just(113))(
		$elm$core$Maybe$Just(189))(
		$elm$core$Maybe$Just(75))
	]);
var $elm$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					if (md.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var d = md.a;
						return $elm$core$Maybe$Just(
							A4(func, a, b, c, d));
					}
				}
			}
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Uebung2aufgabe5$isComplete = function (car) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A5(
			$elm$core$Maybe$map4,
			F4(
				function (_v0, _v1, _v2, _v3) {
					return true;
				}),
			car.cityMPG,
			car.retailPrice,
			car.dealerCost,
			car.carLen));
};
var $author$project$Uebung2aufgabe5$filteredCars = A2($elm$core$List$filter, $author$project$Uebung2aufgabe5$isComplete, $author$project$Uebung2aufgabe5$cars);
var $author$project$Uebung2aufgabe5$selectedClass = $author$project$Uebung2aufgabe5$SUV;
var $author$project$Uebung2aufgabe5$carsInClass = A2(
	$elm$core$List$filter,
	function (car) {
		return _Utils_eq(car.carType, $author$project$Uebung2aufgabe5$selectedClass);
	},
	$author$project$Uebung2aufgabe5$filteredCars);
var $author$project$Uebung2aufgabe5$cityMpg = function (car) {
	return A2($elm$core$Maybe$withDefault, 0, car.cityMPG);
};
var $author$project$Uebung2aufgabe5$mpgToLper100km = function (mpg) {
	return (mpg <= 0) ? 0 : (235.214583 / mpg);
};
var $author$project$Uebung2aufgabe5$cityLper100km = function (car) {
	return $author$project$Uebung2aufgabe5$mpgToLper100km(
		$author$project$Uebung2aufgabe5$cityMpg(car));
};
var $author$project$Uebung2aufgabe5$averageCityLper100km = A2($author$project$Uebung2aufgabe5$averageOf, $author$project$Uebung2aufgabe5$cityLper100km, $author$project$Uebung2aufgabe5$carsInClass);
var $author$project$Uebung2aufgabe5$averageCityMPG = A2($author$project$Uebung2aufgabe5$averageOf, $author$project$Uebung2aufgabe5$cityMpg, $author$project$Uebung2aufgabe5$carsInClass);
var $author$project$Uebung2aufgabe5$carTypeToString = function (carType) {
	switch (carType.$) {
		case 'Small_Sporty_Compact_Large_Sedan':
			return 'Sedan';
		case 'Sports_Car':
			return 'Sports Car';
		case 'SUV':
			return 'SUV';
		case 'Wagon':
			return 'Wagon';
		case 'Minivan':
			return 'Minivan';
		default:
			return 'Pickup';
	}
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Basics$round = _Basics_round;
var $author$project$Uebung2aufgabe5$formatFloat2 = function (value) {
	var rounded = $elm$core$Basics$round(value * 100) / 100;
	return $elm$core$String$fromFloat(rounded);
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $author$project$Uebung2aufgabe5$aboveAverageLper100km = A2(
	$elm$core$List$filter,
	function (car) {
		return _Utils_cmp(
			$author$project$Uebung2aufgabe5$cityLper100km(car),
			$author$project$Uebung2aufgabe5$averageCityLper100km) < 1;
	},
	$author$project$Uebung2aufgabe5$carsInClass);
var $author$project$Uebung2aufgabe5$belowAverageLper100km = A2(
	$elm$core$List$filter,
	function (car) {
		return _Utils_cmp(
			$author$project$Uebung2aufgabe5$cityLper100km(car),
			$author$project$Uebung2aufgabe5$averageCityLper100km) > 0;
	},
	$author$project$Uebung2aufgabe5$carsInClass);
var $author$project$Uebung2aufgabe5$lper100kmSpec = {
	above: $author$project$Uebung2aufgabe5$aboveAverageLper100km,
	averageLabel: 'avg = ' + ($author$project$Uebung2aufgabe5$formatFloat2($author$project$Uebung2aufgabe5$averageCityLper100km) + ' L/100km'),
	averageValue: $author$project$Uebung2aufgabe5$averageCityLper100km,
	below: $author$project$Uebung2aufgabe5$belowAverageLper100km,
	xLabel: 'cityVerbrauch [L / 100 km]',
	xMetric: $author$project$Uebung2aufgabe5$cityLper100km
};
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Uebung2aufgabe5$aboveAverageMpg = A2(
	$elm$core$List$filter,
	function (car) {
		return _Utils_cmp(
			$author$project$Uebung2aufgabe5$cityMpg(car),
			$author$project$Uebung2aufgabe5$averageCityMPG) > -1;
	},
	$author$project$Uebung2aufgabe5$carsInClass);
var $author$project$Uebung2aufgabe5$belowAverageMpg = A2(
	$elm$core$List$filter,
	function (car) {
		return _Utils_cmp(
			$author$project$Uebung2aufgabe5$cityMpg(car),
			$author$project$Uebung2aufgabe5$averageCityMPG) < 0;
	},
	$author$project$Uebung2aufgabe5$carsInClass);
var $author$project$Uebung2aufgabe5$mpgSpec = {
	above: $author$project$Uebung2aufgabe5$aboveAverageMpg,
	averageLabel: 'avg = ' + ($author$project$Uebung2aufgabe5$formatFloat2($author$project$Uebung2aufgabe5$averageCityMPG) + ' MPG'),
	averageValue: $author$project$Uebung2aufgabe5$averageCityMPG,
	below: $author$project$Uebung2aufgabe5$belowAverageMpg,
	xLabel: 'cityMPG',
	xMetric: $author$project$Uebung2aufgabe5$cityMpg
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$Uebung2aufgabe5$AboveClassAverage = {$: 'AboveClassAverage'};
var $elm_community$typed_svg$TypedSvg$Types$AnchorMiddle = {$: 'AnchorMiddle'};
var $author$project$Uebung2aufgabe5$BelowClassAverage = {$: 'BelowClassAverage'};
var $author$project$Uebung2aufgabe5$OutsideClass = {$: 'OutsideClass'};
var $author$project$Uebung2aufgabe5$axisStyles = '\n    .axis-line {\n        stroke: #1f2933;\n        stroke-width: 1.5px;\n    }\n    .tick-line {\n        stroke: #52606d;\n        stroke-width: 1px;\n    }\n    .tick-label {\n        fill: #334e68;\n        font-size: 12px;\n        font-family: sans-serif;\n    }\n    .axis-label {\n        fill: #102a43;\n        font-size: 14px;\n        font-family: sans-serif;\n        font-weight: 600;\n    }\n    .boundary-line {\n        stroke: #d64545;\n        stroke-width: 2px;\n        stroke-dasharray: 8 6;\n    }\n    .boundary-label {\n        fill: #b42318;\n        font-size: 12px;\n        font-family: sans-serif;\n    }\n    ';
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm_community$typed_svg$TypedSvg$Core$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm_community$typed_svg$TypedSvg$Attributes$class = function (names) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'class',
		A2($elm$core$String$join, ' ', names));
};
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Uebung2aufgabe5$extentWithPadding = function (values) {
	var minValue = A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$List$minimum(values));
	var maxValue = A2(
		$elm$core$Maybe$withDefault,
		1,
		$elm$core$List$maximum(values));
	var rawRange = maxValue - minValue;
	var paddingValue = (!rawRange) ? 1 : (rawRange * 0.08);
	return {
		max: maxValue + paddingValue,
		min: A2($elm$core$Basics$max, 0, minValue - paddingValue)
	};
};
var $elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString = function (length) {
	switch (length.$) {
		case 'Cm':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'cm';
		case 'Em':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'em';
		case 'Ex':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'ex';
		case 'In':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'in';
		case 'Mm':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'mm';
		case 'Num':
			var x = length.a;
			return $elm$core$String$fromFloat(x);
		case 'Pc':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'pc';
		case 'Percent':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + '%';
		case 'Pt':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'pt';
		case 'Px':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'px';
		default:
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'rem';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$height = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'height',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Types$Px = function (a) {
	return {$: 'Px', a: a};
};
var $elm_community$typed_svg$TypedSvg$Types$px = $elm_community$typed_svg$TypedSvg$Types$Px;
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$height = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$height(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm$virtual_dom$VirtualDom$nodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_nodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm_community$typed_svg$TypedSvg$Core$node = $elm$virtual_dom$VirtualDom$nodeNS('http://www.w3.org/2000/svg');
var $elm_community$typed_svg$TypedSvg$g = $elm_community$typed_svg$TypedSvg$Core$node('g');
var $author$project$Uebung2aufgabe5$plotWidth = 520;
var $elm_community$typed_svg$TypedSvg$circle = $elm_community$typed_svg$TypedSvg$Core$node('circle');
var $elm_community$typed_svg$TypedSvg$Attributes$cx = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'cx',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$cx = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$cx(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$cy = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'cy',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$cy = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$cy(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $author$project$Uebung2aufgabe5$groupColors = function (pointGroup) {
	switch (pointGroup.$) {
		case 'OutsideClass':
			return {fill: '#cbd2d9', opacity: '0.5', stroke: '#9aa5b1', strokeWidth: '1'};
		case 'BelowClassAverage':
			return {fill: '#4c6ef5', opacity: '0.75', stroke: '#364fc7', strokeWidth: '1'};
		default:
			return {fill: '#ff5a36', opacity: '1', stroke: '#8f1d14', strokeWidth: '2'};
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$r = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'r',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$r = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$r(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $author$project$Uebung2aufgabe5$renderPoint = F3(
	function (pointGroup, xPos, yPos) {
		var s = $author$project$Uebung2aufgabe5$groupColors(pointGroup);
		return A2(
			$elm_community$typed_svg$TypedSvg$circle,
			_List_fromArray(
				[
					$elm_community$typed_svg$TypedSvg$Attributes$InPx$cx(xPos),
					$elm_community$typed_svg$TypedSvg$Attributes$InPx$cy(yPos),
					$elm_community$typed_svg$TypedSvg$Attributes$InPx$r(5),
					A2($elm_community$typed_svg$TypedSvg$Core$attribute, 'fill', s.fill),
					A2($elm_community$typed_svg$TypedSvg$Core$attribute, 'stroke', s.stroke),
					A2($elm_community$typed_svg$TypedSvg$Core$attribute, 'stroke-width', s.strokeWidth),
					A2($elm_community$typed_svg$TypedSvg$Core$attribute, 'opacity', s.opacity)
				]),
			_List_Nil);
	});
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm_community$typed_svg$TypedSvg$Core$text = $elm$virtual_dom$VirtualDom$text;
var $elm_community$typed_svg$TypedSvg$text_ = $elm_community$typed_svg$TypedSvg$Core$node('text');
var $elm_community$typed_svg$TypedSvg$Attributes$x = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'x',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$x = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$x(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$y = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'y',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$y = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$y(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $author$project$Uebung2aufgabe5$legendBox = F3(
	function (yPos, pointGroup, labelText) {
		return A2(
			$elm_community$typed_svg$TypedSvg$g,
			_List_Nil,
			_List_fromArray(
				[
					A3($author$project$Uebung2aufgabe5$renderPoint, pointGroup, $author$project$Uebung2aufgabe5$plotWidth - 200, yPos),
					A2(
					$elm_community$typed_svg$TypedSvg$text_,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x($author$project$Uebung2aufgabe5$plotWidth - 186),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(yPos + 4),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['tick-label']))
						]),
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Core$text(labelText)
						]))
				]));
	});
var $author$project$Uebung2aufgabe5$legend = A2(
	$elm_community$typed_svg$TypedSvg$g,
	_List_Nil,
	_List_fromArray(
		[
			A3($author$project$Uebung2aufgabe5$legendBox, 36, $author$project$Uebung2aufgabe5$OutsideClass, 'nicht in Klasse'),
			A3($author$project$Uebung2aufgabe5$legendBox, 58, $author$project$Uebung2aufgabe5$BelowClassAverage, 'schlechter als Durchschnitt'),
			A3($author$project$Uebung2aufgabe5$legendBox, 80, $author$project$Uebung2aufgabe5$AboveClassAverage, 'besser als Durchschnitt')
		]));
var $elm_community$typed_svg$TypedSvg$line = $elm_community$typed_svg$TypedSvg$Core$node('line');
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Uebung2aufgabe5$notInClass = A2(
	$elm$core$List$filter,
	function (car) {
		return !_Utils_eq(car.carType, $author$project$Uebung2aufgabe5$selectedClass);
	},
	$author$project$Uebung2aufgabe5$filteredCars);
var $author$project$Uebung2aufgabe5$padding = 70;
var $author$project$Uebung2aufgabe5$plotHeight = 420;
var $author$project$Uebung2aufgabe5$retailPriceValue = function (car) {
	return A2($elm$core$Maybe$withDefault, 0, car.retailPrice);
};
var $author$project$Uebung2aufgabe5$scale = F5(
	function (value, domainMin, domainMax, rangeMin, rangeMax) {
		if (_Utils_eq(domainMax, domainMin)) {
			return (rangeMin + rangeMax) / 2;
		} else {
			var ratio = (value - domainMin) / (domainMax - domainMin);
			return rangeMin + (ratio * (rangeMax - rangeMin));
		}
	});
var $author$project$Uebung2aufgabe5$scaleX = F2(
	function (xExtent, value) {
		return A5($author$project$Uebung2aufgabe5$scale, value, xExtent.min, xExtent.max, $author$project$Uebung2aufgabe5$padding, $author$project$Uebung2aufgabe5$plotWidth - $author$project$Uebung2aufgabe5$padding);
	});
var $author$project$Uebung2aufgabe5$scaleY = F2(
	function (yExtent, value) {
		return A5($author$project$Uebung2aufgabe5$scale, value, yExtent.min, yExtent.max, $author$project$Uebung2aufgabe5$plotHeight - $author$project$Uebung2aufgabe5$padding, $author$project$Uebung2aufgabe5$padding);
	});
var $author$project$Uebung2aufgabe5$renderPoints = F5(
	function (xMetric, pointGroup, carsToRender, xExtent, yExtent) {
		return A2(
			$elm$core$List$map,
			function (car) {
				return A3(
					$author$project$Uebung2aufgabe5$renderPoint,
					pointGroup,
					A2(
						$author$project$Uebung2aufgabe5$scaleX,
						xExtent,
						xMetric(car)),
					A2(
						$author$project$Uebung2aufgabe5$scaleY,
						yExtent,
						$author$project$Uebung2aufgabe5$retailPriceValue(car)));
			},
			carsToRender);
	});
var $elm_community$typed_svg$TypedSvg$style = $elm_community$typed_svg$TypedSvg$Core$node('style');
var $elm_community$typed_svg$TypedSvg$svg = $elm_community$typed_svg$TypedSvg$Core$node('svg');
var $elm_community$typed_svg$TypedSvg$TypesToStrings$anchorAlignmentToString = function (anchorAlignment) {
	switch (anchorAlignment.$) {
		case 'AnchorInherit':
			return 'inherit';
		case 'AnchorStart':
			return 'start';
		case 'AnchorMiddle':
			return 'middle';
		default:
			return 'end';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$textAnchor = function (anchorAlignment) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'text-anchor',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$anchorAlignmentToString(anchorAlignment));
};
var $elm_community$typed_svg$TypedSvg$Attributes$viewBox = F4(
	function (minX, minY, vWidth, vHeight) {
		return A2(
			$elm_community$typed_svg$TypedSvg$Core$attribute,
			'viewBox',
			A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					$elm$core$String$fromFloat,
					_List_fromArray(
						[minX, minY, vWidth, vHeight]))));
	});
var $elm_community$typed_svg$TypedSvg$Attributes$width = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'width',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$width = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$width(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$x1 = function (position) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'x1',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(position));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$x1 = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$x1(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$x2 = function (position) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'x2',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(position));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$x2 = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$x2(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $author$project$Uebung2aufgabe5$formatTick = function (value) {
	var rounded = $elm$core$Basics$round(value * 10) / 10;
	return $elm$core$String$fromFloat(rounded);
};
var $author$project$Uebung2aufgabe5$tickCount = 5;
var $elm_community$typed_svg$TypedSvg$Attributes$y1 = function (position) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'y1',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(position));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$y1 = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$y1(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$y2 = function (position) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'y2',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(position));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$y2 = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$y2(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $author$project$Uebung2aufgabe5$xTicks = function (xExtent) {
	return A2(
		$elm$core$List$concatMap,
		function (tickIndex) {
			var ratio = tickIndex / $author$project$Uebung2aufgabe5$tickCount;
			var tickValue = xExtent.min + (ratio * (xExtent.max - xExtent.min));
			var tickX = A2($author$project$Uebung2aufgabe5$scaleX, xExtent, tickValue);
			return _List_fromArray(
				[
					A2(
					$elm_community$typed_svg$TypedSvg$line,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x1(tickX),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y1($author$project$Uebung2aufgabe5$plotHeight - $author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x2(tickX),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y2(($author$project$Uebung2aufgabe5$plotHeight - $author$project$Uebung2aufgabe5$padding) + 6),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['tick-line']))
						]),
					_List_Nil),
					A2(
					$elm_community$typed_svg$TypedSvg$text_,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(tickX),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(($author$project$Uebung2aufgabe5$plotHeight - $author$project$Uebung2aufgabe5$padding) + 24),
							$elm_community$typed_svg$TypedSvg$Attributes$textAnchor($elm_community$typed_svg$TypedSvg$Types$AnchorMiddle),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['tick-label']))
						]),
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Core$text(
							$author$project$Uebung2aufgabe5$formatTick(tickValue))
						]))
				]);
		},
		A2($elm$core$List$range, 0, $author$project$Uebung2aufgabe5$tickCount));
};
var $elm_community$typed_svg$TypedSvg$Types$AnchorEnd = {$: 'AnchorEnd'};
var $author$project$Uebung2aufgabe5$yTicks = function (yExtent) {
	return A2(
		$elm$core$List$concatMap,
		function (tickIndex) {
			var ratio = tickIndex / $author$project$Uebung2aufgabe5$tickCount;
			var tickValue = yExtent.min + (ratio * (yExtent.max - yExtent.min));
			var tickY = A2($author$project$Uebung2aufgabe5$scaleY, yExtent, tickValue);
			return _List_fromArray(
				[
					A2(
					$elm_community$typed_svg$TypedSvg$line,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x1($author$project$Uebung2aufgabe5$padding - 6),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y1(tickY),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x2($author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y2(tickY),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['tick-line']))
						]),
					_List_Nil),
					A2(
					$elm_community$typed_svg$TypedSvg$text_,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x($author$project$Uebung2aufgabe5$padding - 10),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(tickY + 4),
							$elm_community$typed_svg$TypedSvg$Attributes$textAnchor($elm_community$typed_svg$TypedSvg$Types$AnchorEnd),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['tick-label']))
						]),
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Core$text(
							$elm$core$String$fromInt(
								$elm$core$Basics$round(tickValue)))
						]))
				]);
		},
		A2($elm$core$List$range, 0, $author$project$Uebung2aufgabe5$tickCount));
};
var $author$project$Uebung2aufgabe5$scatterplot = function (spec) {
	var allCars = _Utils_ap($author$project$Uebung2aufgabe5$notInClass, $author$project$Uebung2aufgabe5$carsInClass);
	var xExtent = $author$project$Uebung2aufgabe5$extentWithPadding(
		A2($elm$core$List$map, spec.xMetric, allCars));
	var averageLineX = A2($author$project$Uebung2aufgabe5$scaleX, xExtent, spec.averageValue);
	var yExtent = $author$project$Uebung2aufgabe5$extentWithPadding(
		A2($elm$core$List$map, $author$project$Uebung2aufgabe5$retailPriceValue, allCars));
	return A2(
		$elm_community$typed_svg$TypedSvg$svg,
		_List_fromArray(
			[
				A4($elm_community$typed_svg$TypedSvg$Attributes$viewBox, 0, 0, $author$project$Uebung2aufgabe5$plotWidth, $author$project$Uebung2aufgabe5$plotHeight),
				$elm_community$typed_svg$TypedSvg$Attributes$InPx$width($author$project$Uebung2aufgabe5$plotWidth),
				$elm_community$typed_svg$TypedSvg$Attributes$InPx$height($author$project$Uebung2aufgabe5$plotHeight)
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm_community$typed_svg$TypedSvg$style,
					_List_Nil,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Core$text($author$project$Uebung2aufgabe5$axisStyles)
						])),
					A2(
					$elm_community$typed_svg$TypedSvg$line,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x1($author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y1($author$project$Uebung2aufgabe5$plotHeight - $author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x2($author$project$Uebung2aufgabe5$plotWidth - $author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y2($author$project$Uebung2aufgabe5$plotHeight - $author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['axis-line']))
						]),
					_List_Nil),
					A2(
					$elm_community$typed_svg$TypedSvg$line,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x1($author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y1($author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x2($author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y2($author$project$Uebung2aufgabe5$plotHeight - $author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['axis-line']))
						]),
					_List_Nil),
					A2(
					$elm_community$typed_svg$TypedSvg$line,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x1(averageLineX),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y1($author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x2(averageLineX),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y2($author$project$Uebung2aufgabe5$plotHeight - $author$project$Uebung2aufgabe5$padding),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['boundary-line']))
						]),
					_List_Nil),
					A2(
					$elm_community$typed_svg$TypedSvg$text_,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(averageLineX + 6),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y($author$project$Uebung2aufgabe5$padding + 14),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['boundary-label']))
						]),
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Core$text(spec.averageLabel)
						])),
					A2(
					$elm_community$typed_svg$TypedSvg$text_,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x($author$project$Uebung2aufgabe5$plotWidth / 2),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y($author$project$Uebung2aufgabe5$plotHeight - 18),
							$elm_community$typed_svg$TypedSvg$Attributes$textAnchor($elm_community$typed_svg$TypedSvg$Types$AnchorMiddle),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['axis-label']))
						]),
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Core$text(spec.xLabel)
						])),
					A2(
					$elm_community$typed_svg$TypedSvg$text_,
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(14),
							$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(30),
							$elm_community$typed_svg$TypedSvg$Attributes$class(
							_List_fromArray(
								['axis-label']))
						]),
					_List_fromArray(
						[
							$elm_community$typed_svg$TypedSvg$Core$text('retailPrice')
						]))
				]),
			_Utils_ap(
				$author$project$Uebung2aufgabe5$xTicks(xExtent),
				_Utils_ap(
					$author$project$Uebung2aufgabe5$yTicks(yExtent),
					_Utils_ap(
						A5($author$project$Uebung2aufgabe5$renderPoints, spec.xMetric, $author$project$Uebung2aufgabe5$OutsideClass, $author$project$Uebung2aufgabe5$notInClass, xExtent, yExtent),
						_Utils_ap(
							A5($author$project$Uebung2aufgabe5$renderPoints, spec.xMetric, $author$project$Uebung2aufgabe5$BelowClassAverage, spec.below, xExtent, yExtent),
							_Utils_ap(
								A5($author$project$Uebung2aufgabe5$renderPoints, spec.xMetric, $author$project$Uebung2aufgabe5$AboveClassAverage, spec.above, xExtent, yExtent),
								_List_fromArray(
									[$author$project$Uebung2aufgabe5$legend]))))))));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Uebung2aufgabe5$plotColumn = F3(
	function (titleText, description, spec) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'flex', '1'),
					A2($elm$html$Html$Attributes$style, 'min-width', '520px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h3,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(titleText)
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(description)
						])),
					$author$project$Uebung2aufgabe5$scatterplot(spec)
				]));
	});
var $author$project$Uebung2aufgabe5$main = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'font-family', 'sans-serif'),
			A2($elm$html$Html$Attributes$style, 'padding', '16px'),
			A2($elm$html$Html$Attributes$style, 'line-height', '1.5')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h2,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Zusatzaufgabe 2.5')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text(
					'Gewählte Klasse: ' + $author$project$Uebung2aufgabe5$carTypeToString($author$project$Uebung2aufgabe5$selectedClass))
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text(
					'Durchschnitt cityMPG: ' + ($author$project$Uebung2aufgabe5$formatFloat2($author$project$Uebung2aufgabe5$averageCityMPG) + (' MPG  /  ' + ($author$project$Uebung2aufgabe5$formatFloat2($author$project$Uebung2aufgabe5$averageCityLper100km) + ' L pro 100 km'))))
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Beide Scatterplots zeigen retailPrice gegen den Stadtverbrauch der gewählten Klasse. Links der Original-Plot aus Aufgabe 2.3 mit cityMPG, rechts derselbe Plot mit auf Liter pro 100 km umgerechnetem Verbrauch. Für den rechten Plot wurden Durchschnitt und die Teilmengen unter beziehungsweise über dem Durchschnitt neu berechnet, da bei L/100 km ein hoher Wert schlechte Effizienz bedeutet (umgekehrt zu MPG).')
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'gap', '24px'),
					A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start')
				]),
			_List_fromArray(
				[
					A3($author$project$Uebung2aufgabe5$plotColumn, 'Original: cityMPG', 'Höhere MPG-Werte stehen für geringeren Verbrauch. Die Teilmenge oberhalb des Durchschnitts liegt rechts der gestrichelten Linie.', $author$project$Uebung2aufgabe5$mpgSpec),
					A3($author$project$Uebung2aufgabe5$plotColumn, 'Umgerechnet: Liter pro 100 km', 'cityMPG wurde mit 235,214583 / mpg in L/100 km umgerechnet. Niedrigere Werte bedeuten jetzt geringeren Verbrauch, die hervorgehobene Teilmenge liegt links der gestrichelten Linie.', $author$project$Uebung2aufgabe5$lper100kmSpec)
				])),
			A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin-top', '24px')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Beobachtung: Die Punktwolke wirkt auf der MPG-Achse fast linear gestreckt, während sie nach Umrechnung in L/100 km zusammengeschoben und nichtlinear verzerrt erscheint. Da L/100 km der reziproke Wert von MPG ist, werden Unterschiede zwischen sparsamen Autos kleiner und Unterschiede zwischen verbrauchsstarken Autos größer dargestellt. Genau dieses Phänomen beschreibt der Zeit-Artikel „Die paradoxe Mathematik des Benzinverbrauchs“: Eine Verbesserung um wenige MPG bei einem ohnehin durstigen Fahrzeug spart in absoluten Litern viel mehr Kraftstoff als eine vergleichbare Verbesserung bei einem effizienten Fahrzeug.')
				]))
		]));
_Platform_export({'Uebung2aufgabe5':{'init':_VirtualDom_init($author$project$Uebung2aufgabe5$main)(0)(0)}});}(this));