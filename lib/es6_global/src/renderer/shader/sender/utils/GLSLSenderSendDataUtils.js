// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

import * as Caml_builtin_exceptions         from "../../../../../../../node_modules/bs-platform/lib/es6/caml_builtin_exceptions.js";
import * as ArraySystem$WonderCommonlib     from "../../../../../../../node_modules/wonder-commonlib/lib/es6_global/src/ArraySystem.js";
import * as GLSLSenderStateUtils$Wonderjs   from "./GLSLSenderStateUtils.js";
import * as HashMapSystem$WonderCommonlib   from "../../../../../../../node_modules/wonder-commonlib/lib/es6_global/src/HashMapSystem.js";
import * as ExceptionHandleSystem$Wonderjs  from "../../../../exception/ExceptionHandleSystem.js";
import * as SparseMapSystem$WonderCommonlib from "../../../../../../../node_modules/wonder-commonlib/lib/es6_global/src/SparseMapSystem.js";

function getBufferSizeByType(type_) {
  if (type_ === "vec3") {
    return 3;
  } else {
    return ExceptionHandleSystem$Wonderjs.throwMessage("invalide type_:" + (String(type_) + ""));
  }
}

function _enableVertexAttribArray(gl, pos, vertexAttribHistoryArray, state) {
  var match = ArraySystem$WonderCommonlib.isNotEqual(pos, /* true */1, vertexAttribHistoryArray);
  if (match !== 0) {
    gl.enableVertexAttribArray(pos);
    vertexAttribHistoryArray[pos] = /* true */1;
    return state;
  } else {
    return state;
  }
}

function sendBuffer(gl, param, buffer, state) {
  var pos = param[1];
  var data = GLSLSenderStateUtils$Wonderjs.getGLSLSenderData(state);
  var vertexAttribHistoryArray = data[/* vertexAttribHistoryArray */7];
  var lastSendArrayBuffer = data[/* lastSendArrayBuffer */8];
  var exit = 0;
  if (lastSendArrayBuffer) {
    if (lastSendArrayBuffer[0] === buffer) {
      return state;
    } else {
      exit = 1;
    }
  } else {
    exit = 1;
  }
  if (exit === 1) {
    data[/* lastSendArrayBuffer */8] = /* Some */[buffer];
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(pos, param[0], gl.FLOAT, false, 0, 0);
    return _enableVertexAttribArray(gl, pos, vertexAttribHistoryArray, state);
  }
  
}

function sendMatrix4(gl, pos, data) {
  gl.uniformMatrix4fv(pos, false, data);
  return /* () */0;
}

function _getCache(shaderCacheMap, name) {
  return HashMapSystem$WonderCommonlib.get(name, shaderCacheMap);
}

function _setCache(shaderCacheMap, name, data) {
  return HashMapSystem$WonderCommonlib.set(name, data, shaderCacheMap);
}

function getCacheMap(shaderIndex, param) {
  return SparseMapSystem$WonderCommonlib.get(shaderIndex, param[/* uniformCacheMap */2]);
}

function _queryIsNotCacheWithCache(cache, x, y, z) {
  var isNotCached = /* false */0;
  if (cache[0] !== x) {
    cache[0] = x;
    isNotCached = /* true */1;
  }
  if (cache[1] !== y) {
    cache[1] = y;
    isNotCached = /* true */1;
  }
  if (cache[2] !== z) {
    cache[2] = z;
    isNotCached = /* true */1;
  }
  return isNotCached;
}

function _isNotCacheVector3(shaderCacheMap, name, param) {
  var z = param[2];
  var y = param[1];
  var x = param[0];
  var match = HashMapSystem$WonderCommonlib.get(name, shaderCacheMap);
  if (match) {
    return _queryIsNotCacheWithCache(match[0], x, y, z);
  } else {
    HashMapSystem$WonderCommonlib.set(name, /* float array */[
          x,
          y,
          z
        ], shaderCacheMap);
    return /* true */1;
  }
}

function sendFloat3(gl, shaderCacheMap, param, param$1) {
  if (param$1.length !== 3) {
    throw [
          Caml_builtin_exceptions.match_failure,
          [
            "/Users/y/Github/Wonder.js/src/renderer/shader/sender/utils/GLSLSenderSendDataUtils.re",
            83,
            2
          ]
        ];
  } else {
    var x = param$1[0];
    var y = param$1[1];
    var z = param$1[2];
    if (_isNotCacheVector3(shaderCacheMap, param[0], /* tuple */[
            x,
            y,
            z
          ])) {
      gl.uniform3f(param[1], x, y, z);
      return /* () */0;
    } else {
      return /* () */0;
    }
  }
}

export {
  getBufferSizeByType       ,
  _enableVertexAttribArray  ,
  sendBuffer                ,
  sendMatrix4               ,
  _getCache                 ,
  _setCache                 ,
  getCacheMap               ,
  _queryIsNotCacheWithCache ,
  _isNotCacheVector3        ,
  sendFloat3                ,
  
}
/* ArraySystem-WonderCommonlib Not a pure module */