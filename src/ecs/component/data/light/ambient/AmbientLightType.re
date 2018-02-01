open ComponentType;

type ambientLightData = {
  mutable index: int,
  buffer: Js.Typed_array.array_buffer,
  colors: Js.Typed_array.Float32Array.t,
  gameObjectMap
};