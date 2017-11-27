open GLSLLocationType;

let getAttribLocation = (program, name, attributeLocationMap, gl) =>
  switch (attributeLocationMap |> WonderCommonlib.HashMapSystem.get(name)) {
  | Some(pos) => pos
  | None =>
    let pos = Gl.getAttribLocation(program, name, gl);
    attributeLocationMap |> WonderCommonlib.HashMapSystem.set(name, pos) |> ignore;
    pos
  };

let getUniformLocation = (program, name, uniformLocationMap, gl) =>
  switch (uniformLocationMap |> WonderCommonlib.HashMapSystem.get(name)) {
  | Some(pos) => pos
  | None =>
    let pos = Gl.getUniformLocation(program, name, gl);
    uniformLocationMap |> WonderCommonlib.HashMapSystem.set(name, pos) |> ignore;
    pos
  };

let getAttributeLocationMap = (shaderIndex: int, state: StateDataType.state) =>
  state.glslLocationData.attributeLocationMap |> WonderCommonlib.SparseMapSystem.get(shaderIndex);

let setAttributeLocationMap =
    (shaderIndex: int, attributeLocationMap, state: StateDataType.state) => {
  state.glslLocationData.attributeLocationMap
  |> WonderCommonlib.SparseMapSystem.set(shaderIndex, attributeLocationMap)
  |> ignore;
  state
};

let getUniformLocationMap = (shaderIndex: int, state: StateDataType.state) =>
  state.glslLocationData.uniformLocationMap |> WonderCommonlib.SparseMapSystem.get(shaderIndex);

let setUniformLocationMap =
    (shaderIndex: int, uniformLocationMap, state: StateDataType.state) => {
  state.glslLocationData.uniformLocationMap
  |> WonderCommonlib.SparseMapSystem.set(shaderIndex, uniformLocationMap)
  |> ignore;
  state
};

let createLocationMap = () => WonderCommonlib.HashMapSystem.createEmpty();

let initData = () => {
  attributeLocationMap: WonderCommonlib.SparseMapSystem.createEmpty(),
  uniformLocationMap: WonderCommonlib.SparseMapSystem.createEmpty()
};