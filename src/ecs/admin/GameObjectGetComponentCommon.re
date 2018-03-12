open GameObjectType;

open ComponentType;

open GameObjectComponentCommon;

let _unsafeGetComponent = (uid: int, componentMap: array(int)) =>
  WonderCommonlib.SparseMapSystem.unsafeGet(uid, componentMap)
  |> WonderLog.Contract.ensureCheck(
       (component) =>
         WonderLog.(
           Contract.(
             Operators.(
               test(
                 Log.buildAssertMessage(~expect={j|component exist|j}, ~actual={j|not|j}),
                 () => component |> assertNullableExist
               )
             )
           )
         ),
       StateData.stateData.isDebug
     );

let getSourceInstanceComponent =
  [@bs]
  (
    (uid: int, state: StateDataType.state) =>
      state.gameObjectRecord.sourceInstanceMap |> getComponent(uid)
  );

let unsafeGetSourceInstanceComponent = (uid: int, state: StateDataType.state) =>
  state.gameObjectRecord.sourceInstanceMap |> _unsafeGetComponent(uid);

let getObjectInstanceComponent =
  [@bs]
  (
    (uid: int, state: StateDataType.state) =>
      state.gameObjectRecord.objectInstanceMap |> getComponent(uid)
  );

let unsafeGetObjectInstanceComponent = (uid: int, state: StateDataType.state) =>
  state.gameObjectRecord.objectInstanceMap |> _unsafeGetComponent(uid);

let getBasicCameraViewComponent =
  [@bs] ((uid: int, gameObjectRecord) => gameObjectRecord.basicCameraViewMap |> getComponent(uid));

let _batchGetComponent = (uidArray: array(int), componentMap, state: StateDataType.state) =>
  uidArray
  |> WonderCommonlib.ArraySystem.reduceOneParam(
       [@bs]
       (
         (arr, uid) =>
           switch (componentMap |> getComponent(uid)) {
           | None => arr
           | Some(component) =>
             arr |> Js.Array.push(component) |> ignore;
             arr
           }
       ),
       [||]
     );

let batchGetSourceInstanceComponent = (uidArray: array(int), state: StateDataType.state) =>
  _batchGetComponent(
    uidArray,
    state.gameObjectRecord.sourceInstanceMap,
    state
  );

let batchGetObjectInstanceComponent = (uidArray: array(int), state: StateDataType.state) =>
  _batchGetComponent(
    uidArray,
    state.gameObjectRecord.objectInstanceMap,
    state
  );
