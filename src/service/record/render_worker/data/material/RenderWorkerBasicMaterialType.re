open MaterialType;

type basicMaterialRecord = {
  buffer: WorkerType.sharedArrayBuffer,
  shaderIndices: option(Js.Typed_array.Uint32Array.t),
  colors: option(Js.Typed_array.Float32Array.t),
  index: int,
  disposedIndexArray,
  isSourceInstanceMap: WonderCommonlib.SparseMapService.t(bool)
};