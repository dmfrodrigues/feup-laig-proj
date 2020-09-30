/**
 * ObjectAmp
 * 
 * Allows to amplify texture.
 */
class ObjectAmp extends CGFobject {
    constructor(scene) {
        super(scene);
        this.afs = 1;
        this.aft = 1;
        this.texCoordsOriginal = [];
    }
    setAmplification(afs, aft){
        this.afs = afs;
        this.aft = aft;
        this.updateTexCoords(this.texCoordsOriginal);
    }
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        for(let i = 0; i < coords.length; i += 2){
            this.texCoords[i  ] = this.texCoords[i  ]*this.afs;
            this.texCoords[i+1] = this.texCoords[i+1]*this.aft;
        }
        this.updateTexCoordsGLBuffers();
    }
}
