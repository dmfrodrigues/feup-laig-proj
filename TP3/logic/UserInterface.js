class UserInterface extends CGFobject {
    constructor(scene){
        super(scene);
        this._idObj = null;
        this._obj = null;
        this._transformation = null;
        this._panelID = null;
        this._panel = null;
        this._valueID = null;
        this._value = null;
        this._buttonsIDs        = [];
        this._buttons           = [];
    }
    set idObj(id){ this._idObj = id; }
    get idObj(){ return this._idObj; }

    set obj(obj){ this._obj = obj; }
    get obj(){ return this._obj; }

    set panelID(panelID){ this._panelID = panelID; }
    get panelID(){ return this._panelID; }

    set panel(panel){ this._panel = panel; }
    get panel(){ return this._panel; }

    set transformation(transformation){ this._transformation = transformation; }
    get transformation(){ return this._transformation; }

    get buttons(){ return this._buttons; }
    get buttonsIDs(){ return this._buttonsIDs; }
    addButtonID(button_id){this._buttonsIDs.push(button_id);}

    set valueID(valueID){ this._valueID = valueID; }
    get valueID(){ return this._valueID; }

    set valueNode(valueNode){ this._value = valueNode; }
    get valueNode(){ return this._value; }

    setValue(value){
        this._value.text = (Math.round(value*10)/10).toFixed(1);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transformation);
        this.panel.display();
        for(let i=0; i<this._buttons.length;i++){
            this._buttons[i].display();
        }
        this.scene.popMatrix();
    }
}
