open GameObjectType;

open ObjectInstanceType;

open StateDataType;

open ComponentDisposeComponentCommon;

open ObjectInstanceStateCommon;

let isAlive = (objectInstance: objectInstance, state: StateDataType.state) =>
  ComponentDisposeComponentCommon.isAlive(
    objectInstance,
    getObjectInstanceData(state).disposedIndexArray
  );

let _unsafeGetSourceInstance = (objectInstance: objectInstance, {sourceInstanceMap}) =>
  sourceInstanceMap
  |> WonderCommonlib.SparseMapSystem.unsafeGet(objectInstance)
  |> WonderLog.Contract.ensureCheck(
       (sourceInstance) =>
         WonderLog.(
           Contract.(
             Operators.(
               test(
                 Log.buildAssertMessage(~expect={j|souceInstance exist|j}, ~actual={j|not|j}),
                 () => sourceInstance |> assertNullableExist
               )
             )
           )
         ),
       StateData.stateData.isDebug
     );

let _disposeData = (objectInstance: objectInstance, state: StateDataType.state) => {
  let {sourceInstanceMap, gameObjectMap} as record = getObjectInstanceData(state);
  {
    ...state,
    objectInstanceData: {
      ...record,
      sourceInstanceMap: sourceInstanceMap |> disposeSparseMapData(objectInstance),
      gameObjectMap: gameObjectMap |> disposeSparseMapData(objectInstance)
    }
  }
};

let handleDisposeComponent = (objectInstance: objectInstance, state: StateDataType.state) => {
  WonderLog.Contract.requireCheck(
    () =>
      WonderLog.(
        Contract.(
          Operators.(
            ComponentDisposeComponentCommon.checkComponentShouldAlive(
              objectInstance,
              isAlive,
              state
            )
          )
        )
      ),
    StateData.stateData.isDebug
  );
  let ({disposedIndexArray} as record): objectInstanceData = getObjectInstanceData(state);
  let state =
    state
    |> InstanceDisposeComponentUtils.disposeObjectInstance(
         _unsafeGetSourceInstance(objectInstance, record),
         ObjectInstanceGameObjectCommon.unsafeGetGameObject(objectInstance, state)
       )
    |> _disposeData(objectInstance);
  {
    ...state,
    objectInstanceData: {
      ...record,
      disposedIndexArray: disposedIndexArray |> ArrayService.push(objectInstance)
    }
  }
};

let handleBatchDisposeComponent =
  [@bs]
  (
    (
      objectInstanceArray: array(objectInstance),
      isGameObjectDisposedMap: array(bool),
      state: StateDataType.state
    ) => {
      WonderLog.Contract.requireCheck(
        () => {
          open WonderLog;
          open Contract;
          open Operators;
          let objectInstanceLen = objectInstanceArray |> Js.Array.length;
          test(
            Log.buildAssertMessage(
              ~expect={j|objectInstanceArray has one objectInstance at least|j},
              ~actual={j|$objectInstanceLen|j}
            ),
            () => objectInstanceLen > 0
          );
          test(
            Log.buildAssertMessage(
              ~expect={j|all objectInstance belong to the same sourceInstance|j},
              ~actual={j|not|j}
            ),
            () => {
              let record = getObjectInstanceData(state);
              let sourceInstance = _unsafeGetSourceInstance(objectInstanceArray[0], record);
              objectInstanceArray
              |> WonderCommonlib.ArraySystem.forEach(
                   [@bs]
                   (
                     (objectInstance) =>
                       _unsafeGetSourceInstance(objectInstance, record) == sourceInstance
                   )
                 )
            }
          )
        },
        StateData.stateData.isDebug
      );
      let ({disposedIndexArray} as record): objectInstanceData = getObjectInstanceData(state);
      let record = {
        ...record,
        disposedIndexArray: disposedIndexArray |> Js.Array.concat(objectInstanceArray)
      };
      let disposedUidArr =
        objectInstanceArray
        |> Js.Array.map(
             (objectInstance) =>
               ObjectInstanceGameObjectCommon.unsafeGetGameObject(objectInstance, state)
           );
      let isGameObjectDisposedMap =
        ECSDisposeUtils.buildMapFromArray(
          disposedUidArr,
          WonderCommonlib.SparseMapSystem.createEmpty()
        );
      let sourceInstance = _unsafeGetSourceInstance(objectInstanceArray[0], record);
      let state =
        InstanceDisposeComponentUtils.batchDisposeObjectInstance(
          sourceInstance,
          isGameObjectDisposedMap,
          disposedUidArr,
          state
        );
      objectInstanceArray
      |> ArraySystem.reduceState(
           [@bs] ((state, objectInstance) => state |> _disposeData(objectInstance)),
           state
         )
    }
  );