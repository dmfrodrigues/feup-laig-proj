/**
 * Finds first element of v that is larger than x.
 * 
 * @param {Array} v 
 * @param {float} x 
 */
function upper_bound(v, x){
    let l = 0, r = v.length+1;
    while(r-l > 1){
        let m = Math.floor((l+r-1)/2);
        if(v[m] <= x) l = m+1;
        else          r = m+1;
    }
    return l;
}

/**
 * KeyframeAnimation
 * @constructor
 * @param	{CGFscene}	scene	Scene the animation belongs to
 * @param   {bool}      loop    Loop scene (or not)
 */
class KeyframeAnimation extends Animation {
	constructor(scene, loop) {
        super(scene);
        this.scene = scene;
        this.loop = loop;
        this.keyframes = {};
        this.visible = false;
        this.M = mat4.create();
        this.tmin = +1000000000;
        this.tmax = -1000000000;
    }
    addKeyframe(t, keyframe){
        this.keyframes[t] = keyframe;
        this.tmin = Math.min(t, this.tmin);
        this.tmax = Math.max(t, this.tmax);
        this.keyframeTimes = Object.keys(this.keyframes).map(Number).sort(function (a,b){ return a-b; });
    }
    update(t){
        if(this.loop && t > 0) t %= this.tmax;
        if(this.tmax <= t){
            this.visible = true;
            this.M = this.keyframes[this.tmax].getMatrix();
        } else if(t <= this.tmin) {
            if(t < this.tmin) this.visible = false;
            this.M = this.keyframes[this.tmin].getMatrix();
        } else {
            this.visible = true;
            let idx = upper_bound(this.keyframeTimes, t);
            let t1 = this.keyframeTimes[idx-1];
            let t2 = this.keyframeTimes[idx];
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
