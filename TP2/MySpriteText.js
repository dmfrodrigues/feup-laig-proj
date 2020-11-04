/**
 * MySpriteSheet
 * @constructor
 * @param scene   - Reference to MyScene object
 * @param text    - String to be displayed
 */
class MySpriteText{
    constructor(scene, text){
        this.scene = scene;
        this.text = text;
        this.geometry = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5, 1, 1);
        this.spriteSheet = new MySpriteSheet(scene, "scenes/spritesheets/oolite-font.png", 16, 16);
    }
    getCharacterPosition(character){
        return character.charCodeAt();
    }
    display(){
        for (var i = 0; i < this.text.length; i++) {
            this.spriteSheet.activateCellP(this.getCharacterPosition(this.text[i]));
            this.geometry.display();
            this.scene.translate(1, 0, 0);
        }
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
