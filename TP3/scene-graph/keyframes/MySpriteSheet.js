/**
 * MySpriteSheet
 * @constructor
 * @param scene   - Reference to MyScene object
 * @param texture - Path of spritesheet texture
 * @param sizeM   - Number of columns in texture
 * @param sizeN   - Number of rows in texture
 */
class MySpriteSheet {
    static _current_scene = null;
    static shader = null;

    constructor(scene, texture, sizeM, sizeN){
        this.scene = scene;
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.sizeVec = vec2.fromValues(1.0/sizeM, 1.0/sizeN);
        this.texture = new CGFtexture(this.scene, texture);
        if(MySpriteSheet._current_scene !== this.scene){
            MySpriteSheet._current_scene = this.scene;
            MySpriteSheet.shader = new MyShader(
                MySpriteSheet._current_scene.gl, 
                "scenes/spritesheets/spritesheet.vert", 
                "scenes/spritesheets/spritesheet.frag"
            );
        }
    }
    activateCellMN(m, n){
        MySpriteSheet.shader.addUniformsValues({
            m: m,
            n: n,
            sizeVec: this.sizeVec
        });
        this.texture.bind(0);
    }
    activateCellP(p){
        let m = p % this.sizeM;
        let n = Math.floor(p / this.sizeM);
        this.activateCellMN(m, n);
    }
}
