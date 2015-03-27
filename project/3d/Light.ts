module Engine3D.Light{
    //export class Attenuation{
    //
    //}

    //export class BaseLight{
    //
    //}
    //
    //export class PointLight{
    //
    //}

        export class DirectionLight {
            constructor(direction, color, intensity) {
                this._direction = direction;
                this._color = color;
                this._intensity = intensity;
            }

            private _direction:number = null;
            get direction(){
                return this._direction;
            }
            set direction(direction:number){
                this._direction = direction;
            }

            private _color:number[] = null;
            get color(){
                return this._color;
            }
            set color(color:number[]){
                this._color = color;
            }

            private _intensity:number = null;
            get intensity(){
                return this._intensity;
            }
            set intensity(intensity:number){
                this._intensity = intensity;
            }

            initWhenCreate() {
            }

            public static create(direction, color, intensity) {
                var obj = new this(direction, color, intensity);

                obj.initWhenCreate();

                return obj;
            }
        }
    }
