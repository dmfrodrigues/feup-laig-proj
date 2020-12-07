/**
 * MySpriteAnimation
 * @constructor
 * @param scene     - Reference to MyScene object
 * @param ssid      - Sprite sheet ID
 * @param startCell - Initial cell of the animation
 * @param endCell   - Last cell of the animation
 * @param duration  - Duration of one animation cycle
 */
class MySpriteAnimation{
    constructor(scene, ssid, startCell, endCell, duration){
        this.scene = scene;
        this.activeCell = startCell;
        this.startCell = startCell;
        this.endCell = endCell;
        this.duration = duration;
        this.factor = (this.endCell - this.startCell + 1) / this.duration;
        this.ssid = ssid;
        this.spriteSheet = this.scene.graph.spriteSheets[this.ssid];
        this.geometry = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5, 1, 1);
    }
    update(t){
        t %= this.duration;
        this.activeCell = this.startCell + Math.floor(t * this.factor);
    }
    display(){
        this.scene.setActiveShaderSimple(this.spriteSheet.shader);
        this.spriteSheet.shader.clearUniforms();
        this.spriteSheet.shader.addUniformsValues({
            ambient : this.scene.appearance.ambient,
            emission: this.scene.appearance.emission
        });
        this.spriteSheet.activateCellP(this.activeCell);
        this.spriteSheet.shader.updateUniforms();
        this.geometry.display();
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }
}
