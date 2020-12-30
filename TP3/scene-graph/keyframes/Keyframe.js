/**
 * @brief Keyframe
 * 
 * @constructor
 * @param	{float}		x	Translation x coordinate
 * @param	{float}		y	Translation y coordinate
 * @param	{float}		z	Translation z coordinate
 * @param	{float}		rx	Angle of rotation in x-axis
 * @param	{float}		ry	Angle of rotation in y-axis
 * @param	{float}		rz	Angle of rotation in z-axis
 * @param	{float}		sx	Scaling factor in x-axis
 * @param	{float}		sy	Scaling factor in y-axis
 * @param	{float}		sz	Scaling factor in z-axis
 */
class Keyframe {
	constructor(x, y, z, rx, ry, rz, sx, sy, sz) {
		this. x =  x;
		this. y =  y;
		this. z =  z;
		this.rx = rx;
		this.ry = ry;
		this.rz = rz;
		this.sx = sx;
		this.sy = sy;
		this.sz = sz;

		this.M = mat4.create();
		mat4.translate(this.M, this.M, vec3.fromValues(this.x, this.y, this.z));
		mat4.rotateX(this.M, this.M, this.rx);
		mat4.rotateY(this.M, this.M, this.ry);
		mat4.rotateZ(this.M, this.M, this.rz);
		mat4.scale(this.M, this.M, vec3.fromValues(this.sx, this.sy, this.sz));
	}
	/**
	 * @brief Interpolate two keyframes with different weights
	 * 
	 * @param {Keyframe} 	frame1 	First keyframe
	 * @param {Keyframe} 	frame2 	Second keyframe
	 * @param {float} 		r 		Weight of the second keyframe, in [0, 1];
	 * 								the first keyframe has weight (1-r)
	 * @return {Keyframe}			Interpolated keyframe
	 */
	static interpolate(frame1, frame2, r){
		return new Keyframe(
			frame1. x + r * (frame2. x - frame1. x),
			frame1. y + r * (frame2. y - frame1. y),
			frame1. z + r * (frame2. z - frame1. z),
			frame1.rx + r * (frame2.rx - frame1.rx),
			frame1.ry + r * (frame2.ry - frame1.ry),
			frame1.rz + r * (frame2.rz - frame1.rz),
			frame1.sx + r * (frame2.sx - frame1.sx),
			frame1.sy + r * (frame2.sy - frame1.sy),
			frame1.sz + r * (frame2.sz - frame1.sz)
		);
	}

	/**(t-this.cameraAnimLastTime)/animDuration
	 * Get transformation matrix.
	 * 
	 * @return {mat4}	Transformation matrix of keyframe
	 */
	getMatrix(){
		return this.M;
	}
}

