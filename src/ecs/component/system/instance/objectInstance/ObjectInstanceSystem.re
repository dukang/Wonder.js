open ComponentSystem;

open ObjectInstanceType;

let isAlive = (objectInstance: objectInstance, state: StateDataType.state) =>
  ObjectInstanceDisposeComponentCommon.isAlive(objectInstance, state);

let _setSourceInstance = (objectInstance, sourceInstance, sourceInstanceMap) =>
  sourceInstanceMap |> WonderCommonlib.SparseMapSystem.set(objectInstance, sourceInstance);

let create = (sourceInstance, uid, state: StateDataType.state) => {
  let {index, sourceInstanceMap, gameObjectMap, disposedIndexArray} as record =
    ObjectInstanceStateCommon.getObjectInstanceData(state);
  let (index, newIndex, disposedIndexArray) = generateIndex(index, disposedIndexArray);
  (
    {
      ...state,
      objectInstanceData: {
        ...record,
        index: newIndex,
        sourceInstanceMap: sourceInstanceMap |> _setSourceInstance(index, sourceInstance),
        gameObjectMap: gameObjectMap |> AddComponentService.addComponentToGameObjectMap(index, uid)
      }
    },
    index
  )
};

let deepCopyForRestore = ObjectInstanceStateCommon.deepCopyForRestore;