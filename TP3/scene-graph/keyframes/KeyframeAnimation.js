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
        
        this.idx   = 1;
        this.keyframe1 = {};
        this.keyframe2 = {};
        this.t1    = 0;
        this.t2_t1 = 1;
    }
    addKeyframe(t, keyframe){
        this.keyframes[t] = keyframe;
        this.tmin = Math.min(t, this.tmin);
        this.tmax = Math.max(t, this.tmax);
        // Recalculate keyframeTimes
        this.keyframeTimes = Object.keys(this.keyframes).map(Number).sort(function (a,b){ return a-b; });
        // Recalculate keyframeVals
        this.keyframeVals = [];
        for(let i = 0; i < this.keyframeTimes.length; ++i){
            this.keyframeVals.push(this.keyframes[this.keyframeTimes[i]]);
        }
        if(this.keyframeTimes.length >= 2){
            this.t1    = this.keyframeTimes[this.idx-1];
            this.t2_t1 = this.keyframeTimes[this.idx] - this.t1;
            this.keyframe1 = this.keyframeVals[this.idx-1];
            this.keyframe2 = this.keyframeVals[this.idx  ];
        }
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
            while(!(this.keyframeTimes[this.idx-1] <= t && t < this.keyframeTimes[this.idx])){
                this.idx = this.idx+1;
                if(this.idx >= this.keyframeTimes.length) this.idx = 1;

                this.t1    = this.keyframeTimes[this.idx-1];
                this.t2_t1 = this.keyframeTimes[this.idx] - this.t1;
                this.keyframe1 = this.keyframeVals[this.idx-1];
                this.keyframe2 = this.keyframeVals[this.idx  ];
            }
            this.M = Keyframe.interpolate(
                this.keyframe1,
                this.keyframe2,
                (t-this.t1)/(this.t2_t1)
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
