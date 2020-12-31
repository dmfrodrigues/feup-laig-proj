/**
 * MySpriteSheet
 * @constructor
 * @param scene   - Reference to MyScene object
 * @param text    - String to be displayed
 * @param exp     - Optional custom expression to evaluate
 */
class MySpriteText{
    constructor(scene, font, text, exp, format){
        this.scene = scene;
        this._text = text;
        this.func = null;
        if(exp !== null) this.func = new Function(exp);
        this.format = null;
        if(format != null) this.format = new Function(format);
        this.geometries = [];
        for(let i = 0; i < this._text.length; ++i){
            let x1 = -this._text.length/2 + i;
            let x2 = x1+1;
            this.geometries.push(new MyRectangle(this.scene, x1, -0.5, x2, +0.5, 1, 1));
        }
        this.spriteSheet = font;
    }

    set text(text){
        this._text = text;
        if(this.format !== null) this._text = this.format(this._text);
        let geometries = [];
        for(let i = 0; i < this._text.length; ++i){
            let x1 = -this._text.length/2 + i;
            let x2 = x1+1;
            geometries.push(new MyRectangle(this.scene, x1, -0.5, x2, +0.5, 1, 1));
        }
        this.geometries = geometries;
    }

    getCharacterPosition(character){
        return character.charCodeAt();
    }
    update(){
        if(this.func !== null){
            this.text = this.func();
        }
    }
    display(){
        this.scene.setActiveShaderSimple(MySpriteSheet.shader);
        this.scene.pushMatrix();
        for (var i = 0; i < this._text.length; i++) {
            MySpriteSheet.shader.clearUniforms();
            MySpriteSheet.shader.addUniformsValues({
                ambient : this.scene.appearance.ambient,
                emission: this.scene.appearance.emission
            });
            this.spriteSheet.activateCellP(this.getCharacterPosition(this._text[i]));
            MySpriteSheet.shader.updateUniforms();
            this.geometries[i].display();
        }
        this.scene.popMatrix();
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }
}
