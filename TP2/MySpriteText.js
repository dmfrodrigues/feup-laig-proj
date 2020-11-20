/**
 * MySpriteSheet
 * @constructor
 * @param scene   - Reference to MyScene object
 * @param text    - String to be displayed
 * @param eval    - Optional custom expression to evaluate
 */
class MySpriteText{
    constructor(scene, text, eval){
        this.scene = scene;
        this.text = text;
        this.eval = eval;
        this.geometry = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5, 1, 1);
        this.spriteSheet = new MySpriteSheet(scene, "scenes/spritesheets/oolite-font.png", 16, 16);
    }
    getCharacterPosition(character){
        return character.charCodeAt();
    }
    display(){
        this.scene.setActiveShaderSimple(this.spriteSheet.shader);
        if(this.eval != null)
            eval(this.eval);
        this.scene.pushMatrix();
        for (var i = 0; i < this.text.length; i++) {
            this.spriteSheet.activateCellP(this.getCharacterPosition(this.text[i]));
            this.geometry.display();
            this.scene.translate(1, 0, 0);
        }
        this.scene.popMatrix();
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }
}
