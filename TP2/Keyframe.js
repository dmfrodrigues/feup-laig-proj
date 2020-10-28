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
			frame1. x * (1-r) + frame2. x * r,
			frame1. y * (1-r) + frame2. y * r,
			frame1. z * (1-r) + frame2. z * r,
			frame1.rx * (1-r) + frame2.rx * r,
			frame1.ry * (1-r) + frame2.ry * r,
			frame1.rz * (1-r) + frame2.rz * r,
			frame1.sx * (1-r) + frame2.sx * r,
			frame1.sy * (1-r) + frame2.sy * r,
			frame1.sz * (1-r) + frame2.sz * r
		);
	}

	/**
	 * Get transformation matrix.
	 * 
	 * @return {mat4}	Transformation matrix of keyframe
	 */
	getMatrix(){
		return this.M;
	}
}

