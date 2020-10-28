/**
 * KeyframeAnimation
 * @constructor
 * @param	{CGFscene}	scene	Scene the animation belongs to
 */
class KeyframeAnimation extends Animation {
	constructor(scene) {
        super(scene);
        this.scene = scene;
        this.keyframes = {};
        this.visible = false;
        this.M = mat4.create();
    }
    addKeyframe(t, keyframe){
        this.keyframes[t] = keyframe;
    }
    update(t){
        let keys = Object.keys(this.keyframes).sort();
        if(keys[keys.length] <= t){
            this.visible = false;
            this.M = this.keyframes[keys[keys.length]].getMatrix();
        } else if(t <= keys[0]) {
            this.visible = false;
            this.M = this.keyframes[keys[0]].getMatrix();
        } else {
            this.visible = true;
            let idx;
            for(idx = 0; idx < keys.length; ++idx){
                if(keys[idx] <= t) break;
            }
            let t1 = keys[idx];
            let t2 = keys[idx+1];
            this.M = Keyframe.interpolate(
                this.keyframes[t1],
                this.keyframes[t2],
                (t-t1)/(t2-t1)
            ).getMatrix();
        }
    }
    isVisible(){
        return this.visible;
    }
    apply(){
        this.scene.multMatrix(this.M);
    }
}
