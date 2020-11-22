/**
 * MySpriteSheet
 * @constructor
 * @param scene   - Reference to MyScene object
 * @param text    - String to be displayed
 * @param exp    - Optional custom expression to evaluate
 */
class MySpriteText{
    constructor(scene, text, exp){
        this.scene = scene;
        this.text = text;
        this.exp = exp;
        if(this.exp != null) this.func = new Function(this.exp);
        this.geometries = [];
        for(let i = 0; i < text.length; ++i){
            let x1 = -text.length/2 + i;
            let x2 = x1+1;
            this.geometries.push(new MyRectangle(this.scene, x1, -0.5, x2, +0.5, 1, 1));
        }
        this.spriteSheet = new MySpriteSheet(scene, "scenes/spritesheets/oolite-font.png", 16, 16);
    }
    getCharacterPosition(character){
        return character.charCodeAt();
    }
    display(){
        this.scene.setActiveShaderSimple(this.spriteSheet.shader);
        if(this.exp != null)
            this.text = this.func();
        this.scene.pushMatrix();
        for (var i = 0; i < this.text.length; i++) {
            this.spriteSheet.activateCellP(this.getCharacterPosition(this.text[i]));
            this.geometries[i].display();
        }
        this.scene.popMatrix();
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }
}
