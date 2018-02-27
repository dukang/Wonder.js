// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

import * as LightAdmin$Wonderjs       from "./LightAdmin.js";
import * as PointLightSystem$Wonderjs from "../../../component/system/light/point/PointLightSystem.js";

var getColor = PointLightSystem$Wonderjs.getColor;

var getIntensity = PointLightSystem$Wonderjs.getIntensity;

var getConstant = PointLightSystem$Wonderjs.getConstant;

var getLinear = PointLightSystem$Wonderjs.getLinear;

var getQuadratic = PointLightSystem$Wonderjs.getQuadratic;

var getRange = PointLightSystem$Wonderjs.getRange;

function getPosition(index, state) {
  return LightAdmin$Wonderjs.getPosition(PointLightSystem$Wonderjs.unsafeGetGameObject(index, state), state);
}

var getLightData = PointLightSystem$Wonderjs.getLightData;

var deepCopyStateForRestore = PointLightSystem$Wonderjs.deepCopyStateForRestore;

var restore = PointLightSystem$Wonderjs.restore;

var getLightCount = PointLightSystem$Wonderjs.getLightCount;

export {
  getLightData            ,
  getColor                ,
  getIntensity            ,
  getConstant             ,
  getLinear               ,
  getQuadratic            ,
  getRange                ,
  getPosition             ,
  deepCopyStateForRestore ,
  restore                 ,
  getLightCount           ,
  
}
/* LightAdmin-Wonderjs Not a pure module */