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
        this.texture = new CGFtexture(this.scene, texture);
        let frag = "scene/shaders/" + texture.replace(/\.[^/.]+$/, "") + ".frag";
        let vert = "scene/shaders/" + texture.replace(/\.[^/.]+$/, "") + ".vert";
        this.shader = new CGFshader(this.scene.gl, vert, frag);
    }
    activateCellMN(m, n){
        this.shader.setUniformsValues({m: m, n: n});
        this.scene.setActiveShader(this.shader);
        this.text.bind(0);
    }
    activateCellP(p){
        let m = p % this.sizeM + 1;
        let n = Math.floor(p / this.sizeM) + 1;
        this.activateCellMN(m, n);
    }
}