import { getVertices } from "../../component/geometry/GeometrySystem";
import { EBufferType } from "../enum/EBufferType";
import { isBufferExist } from "./bufferUtils";
import { createMap } from "../../utils/objectUtils";

export var getOrCreateBuffer = (gl:WebGLRenderingContext, geometryIndex:number, bufferType:string, GeometryData:any, ArrayBufferData:any) => {
    var buffers = ArrayBufferData.buffers,
        buffer = buffers[geometryIndex];

    if(isBufferExist(buffer)){
        return buffer;
    }

    buffer = gl.createBuffer();

    buffers[geometryIndex] = buffer;

    _initBuffer(gl, getVertices(geometryIndex, GeometryData), buffer, ArrayBufferData);

    ArrayBufferData.bufferDataMap[geometryIndex] = {
        size:3,
        type:EBufferType.FLOAT
    };

    return buffer;
}

var _initBuffer = (gl:WebGLRenderingContext, data: Float32Array, buffer:WebGLBuffer, ArrayBufferData:any) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    _resetBindedBuffer(gl, ArrayBufferData);
}

var _resetBindedBuffer = (gl:WebGLRenderingContext, ArrayBufferData:any) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

export var initData = (ArrayBufferData:any) => {
    ArrayBufferData.buffers = [];
    ArrayBufferData.bufferDataMap = createMap();
}
