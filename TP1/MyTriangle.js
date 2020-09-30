/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate 1
 * @param y1 - y coordinate 1
 * @param x2 - x coordinate 2
 * @param y2 - y coordinate 2
 * @param x3 - x coordinate 3
 * @param y3 - y coordinate 3
 */
class MyTriangle extends ObjectAmp {
	constructor(scene, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
		this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,
			this.x2, this.y2, 0,
            this.x3, this.y3, 0,
            
            this.x1, this.y1, 0,
			this.x2, this.y2, 0,
			this.x3, this.y3, 0
		];

		this.indices = [
			0, 1, 2,
            2, 1, 0
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
            0, 0, 1
		];
		

		let a = Math.sqrt(Math.pow(this.x2-this.x1, 2) + Math.pow(this.y2-this.y1, 2));
		let b = Math.sqrt(Math.pow(this.x3-this.x2, 2) + Math.pow(this.y3-this.y2, 2));
		let c = Math.sqrt(Math.pow(this.x1-this.x3, 2) + Math.pow(this.y1-this.y3, 2));

		let cos_alpha = (a*a - b*b +c*c)/(2*a*c);
		let sin_alpha = Math.sqrt(1-cos_alpha*cos_alpha);

		this.texCoordsOriginal = [
			0, 0,
			a/this.afs, 0,
			c*cos_alpha/this.afs, c*sin_alpha/this.aft
		]

		this.updateTexCoords(this.texCoordsOriginal);
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}

