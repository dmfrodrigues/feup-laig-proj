class MyShader extends CGFshader {
    constructor(gl, vert, frag){
        super(gl, vert, frag);
        this._uniforms = [];
    }
    clearUniforms(){ this._uniforms = []; }
    addUniformsValues(obj){
        for(let property in obj){
            this._uniforms[property] = obj[property];
        }
    }
    updateUniforms(){
        super.setUniformsValues(this._uniforms);
    }
}
