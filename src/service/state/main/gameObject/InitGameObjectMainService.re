open MainStateDataType;

open GameObjectType;

let initGameObject = (uid: int, {gameObjectRecord} as state) => {
  let state =
    switch ([@bs] GetComponentGameObjectService.getBoxGeometryComponent(uid, gameObjectRecord)) {
    | Some(geometry) =>
      InitGeometryMainService.handleInitComponent(
        geometry,
        MappedIndexService.getMappedIndex(
          geometry,
          RecordBoxGeometryMainService.getRecord(state).mappedIndexMap
        ),
        state
      )
    | None => state
    };
  let state =
    switch ([@bs] GetComponentGameObjectService.getBasicMaterialComponent(uid, gameObjectRecord)) {
    | Some(material) =>
      InitBasicMaterialMainService.handleInitComponent(
        [@bs] DeviceManagerService.unsafeGetGl(state.deviceManagerRecord),
        material,
        state
      )
    | None => state
    };
  let state =
    switch ([@bs] GetComponentGameObjectService.getLightMaterialComponent(uid, gameObjectRecord)) {
    | Some(material) =>
      InitLightMaterialMainService.handleInitComponent(
        [@bs] DeviceManagerService.unsafeGetGl(state.deviceManagerRecord),
        material,
        state
      )
    | None => state
    };
  state
};