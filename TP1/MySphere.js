/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */
class MySphere extends CGFobject {
	constructor(scene, radius, slices, stacks) {
		super(scene);
		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	}
	
	initBuffers() {
		// Vertices and texCoords
		this.vertices  = [];
		this.texCoords = [];

		for(let i = 0; i <= 2*this.stacks; ++i){
			let theta = 0.5*Math.PI - 0.5*Math.PI*i/this.stacks; //elevation
			let t = i/(2*this.stacks);
			for(let j = 0; j <= this.slices; ++j){
				let phi = 2.0*Math.PI*j/this.slices; //azimuth
				
				let x = Math.cos(theta) * Math.cos(phi);
				let y = Math.cos(theta) * Math.sin(phi);
				let z = Math.sin(theta);
				this.vertices.push(x, y, z);

				let s = j/this.slices;
				this.texCoords.push(s, t);
			}
		}
		for(let i = 0; i < this.vertices.length; ++i) this.vertices[i] *= this.radius;

		// Indices
		this.indices   = [];

		for(let stack = 0; stack < 2*this.stacks; ++stack){
			let base1 = (this.slices+1) * stack;
			let base2 = (this.slices+1) * (stack+1);
			let i, j, k, l;
			for(i = base1, j = base1 + 1, k = base2, l = base2+1; j < base2; ++i, ++j, ++k, ++l){
				this.indices.push(i, k, l);
				this.indices.push(i, l, j);
			}
		}

		// Normals
		this.normals = [];
		this.vertices.forEach(i => this.normals.push(i/this.radius));
		
		// Others		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

