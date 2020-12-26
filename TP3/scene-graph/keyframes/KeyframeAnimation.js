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
    static easings = {
        easeInSine:       (x) => 1-Math.cos((Math.PI*x)/2),
        easeOutSine:      (x) =>   Math.sin((Math.PI*x)/2),
        easeInOutSine:    (x) => -(Math.cos(Math.PI*x)-1)/2,
        easeInMidOutSine: (x) => x-Math.sin(4*Math.PI*x)/(4*Math.PI)
    };

	constructor(scene, loop) {
        super(scene);
        this.scene = scene;
        this.loop = loop;
        this.keyframes = {};
        this.visible = false;
        this.M = mat4.create();
        this.tmin = +1000000000;
        this.tmax = -1000000000;
        this.xmin = this.tmin/this.tmax;
        
        this.idx   = 1;
        this.keyframe1 = {};
        this.keyframe2 = {};
        this.x1    = 0;
        this.x2_x1 = 1;

        this._easing = function (x) { return x; }
    }
    addKeyframe(t, keyframe){
        this.keyframes[t] = keyframe;
        this.tmin = Math.min(t, this.tmin);
        this.tmax = Math.max(t, this.tmax);
        // Recalculate keyframeTimes
        let keyframeTimes = Object.keys(this.keyframes).map(Number).sort(function (a,b){ return a-b; });
        // Recalculate keyframeVals
        this.keyframeVals = [];
        for(let i = 0; i < keyframeTimes.length; ++i){
            this.keyframeVals.push(this.keyframes[keyframeTimes[i]]);
        }
        // Recalculate keyframeX
        this.keyframeX = keyframeTimes.map((t) => t/this.tmax);
        // Recalculate some numbers
        if(keyframeTimes.length >= 2){
            this.x1    = this.keyframeX[this.idx-1];
            this.x2_x1 = this.keyframeX[this.idx] - this.x1;
            this.keyframe1 = this.keyframeVals[this.idx-1];
            this.keyframe2 = this.keyframeVals[this.idx  ];
        }
    }
    setEasing(easing){
        if(KeyframeAnimation.easings[easing] != undefined)
            this._easing = KeyframeAnimation.easings[easing];
        else
            eval('this._easing = function(x){ return (' + easing + '); }');
    }
    update(t){
        if(this.loop && t > 0) t %= this.tmax;
        let x = this._easing(t/this.tmax);
        if(1 <= x){
            this.visible = true;
            this.M = this.keyframes[this.tmax].getMatrix();
        } else if(x <= this.xmin) {
            if(x < this.xmin) this.visible = false;
            this.M = this.keyframes[this.tmin].getMatrix();
        } else {
            this.visible = true;
            while(!(this.keyframeX[this.idx-1] <= x && x < this.keyframeX[this.idx])){
                this.idx = this.idx+1;
                if(this.idx >= this.keyframeX.length) this.idx = 1;

                this.x1    = this.keyframeX[this.idx-1];
                this.x2_x1 = this.keyframeX[this.idx] - this.x1;
                this.keyframe1 = this.keyframeVals[this.idx-1];
                this.keyframe2 = this.keyframeVals[this.idx  ];
            }
            this.M = Keyframe.interpolate(
                this.keyframe1,
                this.keyframe2,
                (x-this.x1)/(this.x2_x1)
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
