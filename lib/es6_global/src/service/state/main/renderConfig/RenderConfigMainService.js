// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

import * as Caml_array                        from "../../../../../../../node_modules/bs-platform/lib/es6/caml_array.js";
import * as Log$WonderLog                     from "../../../../../../../node_modules/wonder-log/lib/es6_global/src/Log.js";
import * as Contract$WonderLog                from "../../../../../../../node_modules/wonder-log/lib/es6_global/src/Contract.js";
import * as ArrayService$Wonderjs             from "../../../atom/ArrayService.js";
import * as MainStateData$Wonderjs            from "../data/MainStateData.js";
import * as OptionService$Wonderjs            from "../../../atom/OptionService.js";
import * as JobConfigService$Wonderjs         from "../../../primitiive/JobConfigService.js";
import * as IsDebugMainService$Wonderjs       from "../state/IsDebugMainService.js";
import * as ArrayService$WonderCommonlib      from "../../../../../../../node_modules/wonder-commonlib/lib/es6_global/src/ArrayService.js";
import * as JudgeInstanceMainService$Wonderjs from "../instance/JudgeInstanceMainService.js";

function _unsafeGetRenderConfig(state) {
  Contract$WonderLog.requireCheck((function () {
          return Contract$WonderLog.test(Log$WonderLog.buildAssertMessage("render job config exist", "not"), (function () {
                        return Contract$WonderLog.assertExist(state[/* renderConfigRecord */4]);
                      }));
        }), IsDebugMainService$Wonderjs.getIsDebug(MainStateData$Wonderjs.stateData));
  return OptionService$Wonderjs.unsafeGet(state[/* renderConfigRecord */4]);
}

function getShaders(state) {
  return _unsafeGetRenderConfig(state)[/* shaders */0];
}

function getShaderLibs(state) {
  return _unsafeGetRenderConfig(state)[/* shader_libs */1];
}

function _findFirstShaderData(shaderLibName, shaderLibs) {
  return JobConfigService$Wonderjs.unsafeFindFirst(shaderLibs, shaderLibName, (function (item) {
                return JobConfigService$Wonderjs.filterTargetName(item[/* name */0], shaderLibName);
              }));
}

function _getMaterialShaderLibDataArrByGroup(groups, name, shaderLibs, resultDataArr) {
  return resultDataArr.concat(JobConfigService$Wonderjs.unsafeFindFirst(groups, name, (function (item) {
                        return JobConfigService$Wonderjs.filterTargetName(item[/* name */0], name);
                      }))[/* value */1].map((function (name) {
                    return _findFirstShaderData(name, shaderLibs);
                  })));
}

function _getMaterialShaderLibDataArrByStaticBranchInstance(param, param$1, resultDataArr) {
  var value = param$1[1];
  var state = param[1];
  return ArrayService$Wonderjs.push(_findFirstShaderData(JudgeInstanceMainService$Wonderjs.isSourceInstance(param[0], state) ? (
                    JudgeInstanceMainService$Wonderjs.isSupportInstance(state) ? Caml_array.caml_array_get(value, 1) : Caml_array.caml_array_get(value, 2)
                  ) : Caml_array.caml_array_get(value, 0), param$1[0]), resultDataArr);
}

function _getMaterialShaderLibDataArrByStaticBranch(param, param$1, resultDataArr) {
  var static_branchs = param$1[0];
  var name = param[1];
  var exit = 0;
  switch (name) {
    case "modelMatrix_instance" : 
    case "normalMatrix_instance" : 
        exit = 1;
        break;
    default:
      Log$WonderLog.debugJson((function () {
              var partial_arg = "static_branchs";
              return (function (param) {
                  return Log$WonderLog.buildDebugJsonMessage(partial_arg, static_branchs, param);
                });
            }), IsDebugMainService$Wonderjs.getIsDebug(MainStateData$Wonderjs.stateData));
      return Log$WonderLog.fatal(Log$WonderLog.buildFatalMessage("_getMaterialShaderLibDataArrByStaticBranch", "unknown name:" + (String(name) + ""), "", "", ""));
  }
  if (exit === 1) {
    var match = JobConfigService$Wonderjs.unsafeFindFirst(static_branchs, name, (function (item) {
            return JobConfigService$Wonderjs.filterTargetName(item[/* name */0], name);
          }));
    return _getMaterialShaderLibDataArrByStaticBranchInstance(/* tuple */[
                param[0],
                param[2]
              ], /* tuple */[
                param$1[1],
                match[/* value */1]
              ], resultDataArr);
  }
  
}

function _getMaterialShaderLibDataArrByType(param, param$1, resultDataArr) {
  var shaderLibs = param$1[0];
  var name = param[2];
  var type_ = param[0];
  switch (type_) {
    case "group" : 
        return _getMaterialShaderLibDataArrByGroup(param[1], name, shaderLibs, resultDataArr);
    case "static_branch" : 
        return _getMaterialShaderLibDataArrByStaticBranch(/* tuple */[
                    param[3],
                    name,
                    param[4]
                  ], /* tuple */[
                    param$1[1],
                    shaderLibs
                  ], resultDataArr);
    default:
      Log$WonderLog.debugJson((function () {
              var partial_arg = "shaderLibs";
              return (function (param) {
                  return Log$WonderLog.buildDebugJsonMessage(partial_arg, shaderLibs, param);
                });
            }), IsDebugMainService$Wonderjs.getIsDebug(MainStateData$Wonderjs.stateData));
      return Log$WonderLog.fatal(Log$WonderLog.buildFatalMessage("_getMaterialShaderLibDataArrByType", "unknown type_:" + (String(type_) + ""), "", "", ""));
  }
}

function getMaterialShaderLibDataArr(gameObject, param, state) {
  var shaderLibs = param[2];
  var match = param[0];
  var groups = match[/* groups */1];
  var static_branchs = match[/* static_branchs */0];
  return ArrayService$WonderCommonlib.reduceOneParam((function (resultDataArr, param) {
                var name = param[/* name */1];
                var type_ = param[/* type_ */0];
                if (type_) {
                  return _getMaterialShaderLibDataArrByType(/* tuple */[
                              type_[0],
                              groups,
                              name,
                              gameObject,
                              state
                            ], /* tuple */[
                              shaderLibs,
                              static_branchs
                            ], resultDataArr);
                } else {
                  return ArrayService$Wonderjs.push(_findFirstShaderData(name, shaderLibs), resultDataArr);
                }
              }), ArrayService$WonderCommonlib.createEmpty(/* () */0), param[1]);
}

export {
  _unsafeGetRenderConfig                             ,
  getShaders                                         ,
  getShaderLibs                                      ,
  _findFirstShaderData                               ,
  _getMaterialShaderLibDataArrByGroup                ,
  _getMaterialShaderLibDataArrByStaticBranchInstance ,
  _getMaterialShaderLibDataArrByStaticBranch         ,
  _getMaterialShaderLibDataArrByType                 ,
  getMaterialShaderLibDataArr                        ,
  
}
/* Log-WonderLog Not a pure module */