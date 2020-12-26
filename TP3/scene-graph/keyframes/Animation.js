/**
 * Animation
 * @constructor
 * @param	{CGFscene}	scene	Scene the animation belongs to
 */
class Animation {
	constructor(scene) {
        if(this.constructor === Animation){
            throw new TypeError('Abstract class "Animation" cannot be instantiated directly');
        }
        if(this.update === undefined){
            throw new TypeError('Extending class does not implement Animation.update');
        }
        if(this.isVisible === undefined){
            throw new TypeError('Extending class does not implement Animation.isVisible');
        }
        if(this.apply === undefined){
            throw new TypeError('Extending class does not implement Animation.apply');
        }
        this.scene = scene;
        this._timeupdate = true;
    }
    get timeupdate(){ return this._timeupdate; }
    set timeupdate(timeupdate){ this._timeupdate = timeupdate; }
}
