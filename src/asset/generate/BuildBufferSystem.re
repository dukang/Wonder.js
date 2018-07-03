open Js.Typed_array;

let _fillVertexBuffer = (buffer, points, offset) => {
  TypeArrayService.setFloat32Array(
    points,
    Float32Array.fromBufferRange(
      buffer,
      ~offset,
      ~length=points |> Float32Array.length,
    ),
  )
  |> ignore;

  buffer;
};

let _fillIndexBuffer = (buffer, indices, offset) => {
  TypeArrayService.setUint16Array(
    indices,
    Uint16Array.fromBufferRange(
      buffer,
      ~offset,
      ~length=indices |> Uint16Array.length,
    ),
  )
  |> ignore;

  buffer;
};

let _fillImageUint8ArrayBuffer = (buffer, uint8Array, offset) => {
  TypeArrayService.setUint8Array(
    uint8Array,
    Uint8Array.fromBufferRange(
      buffer,
      ~offset,
      ~length=uint8Array |> Uint8Array.length,
    ),
  )
  |> ignore;

  buffer;
};

let build =
    (
      totalByteLength,
      (geometryEndByteOffset, (vertexDataArr, indexDataArr)),
      imageUint8DataArr,
    ) => {
  let buffer = ArrayBuffer.make(totalByteLength);

  let buffer =
    vertexDataArr
    |> WonderCommonlib.ArrayService.reduceOneParam(
         (. buffer, (bufferViewOffset, points)) =>
           _fillVertexBuffer(buffer, points, bufferViewOffset),
         buffer,
       );

  let buffer =
    indexDataArr
    |> WonderCommonlib.ArrayService.reduceOneParam(
         (. buffer, (bufferViewOffset, indices)) =>
           _fillIndexBuffer(buffer, indices, bufferViewOffset),
         buffer,
       );

  imageUint8DataArr
  |> WonderCommonlib.ArrayService.reduceOneParam(
       (. buffer, {uint8Array, byteOffset}: GenerateSceneGraphType.imageData) =>
         _fillImageUint8ArrayBuffer(buffer, uint8Array, byteOffset),
       buffer,
     );
};