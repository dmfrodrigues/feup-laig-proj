/**
 * MySpriteSheet
 * @constructor
 * @param scene   - Reference to MyScene object
 * @param texture - Path of spritesheet texture
 * @param sizeM   - Columns
 * @param sizeN   - Rows
 */
class MySpriteSheet {
    constructor(scene, texture, sizeM, sizeN){
        this.scene = scene;
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.sizeVec = vec2.fromValues(1.0/sizeM, 1.0/sizeN);
        this.texture = new CGFtexture(this.scene, texture);
        this.shader = new CGFshader(this.scene.gl, 
        "scenes/spritesheets/spritesheet.vert", 
        "scenes/spritesheets/spritesheet.frag");
    }
    activateCellMN(m, n){
        this.scene.setActiveShader(this.shader);
        this.shader.setUniformsValues({m: m, n: n, sizeVec: this.sizeVec});
        this.texture.bind(0);
    }
    activateCellP(p){
        let m = p % this.sizeM;
        let n = Math.floor(p / this.sizeM);
        this.activateCellMN(m, n);
    }
}
