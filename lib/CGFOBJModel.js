/**
* CGFOBJModel
* @constructor
* Basic support for OBJ models. 
* Loads a set of faces defined by vertices positions, texture coordinates and normals.
* Supports triangles and quads.
* Does not support loading materials, or individual meshes/groups (contributions welcome).
*
* based on snippet from https://dannywoodz.wordpress.com/2014/12/16/webgl-from-scratch-loading-a-mesh/
* and optimized to reduce vertex duplication
*/

class CGFOBJModel extends CGFobject {

    constructor(scene, url, wireframe) {
        super(scene);
        this.scene = scene;

        this.url = url;

        // false for triangles, true for lines (wireframe)
        this.wireframe = wireframe || false;

        // init with empty object, so that there are no problems while the data is being loaded
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        this.indices = [];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

        // spawn resource reading
        this.rr = new CGFresourceReader();
        this.rr.open(url, this);

        this.mtllib = null;
        this.groups = {};
    };
    onResourceError(string) {
        console.log("Error loading resource " + this.url + ": " + string);
    }

    async onResourceReady(string) {
        var lines = string.split("\n");
        var positions = [];
        var normals = [];
        var vertices = [];
        var texCoords = [];

        this.vcount = 0;
        this.fcount = 0;

        var lut = [];  // this look-up table allows only repeating vertices that have different coords/tex/normals triplets
        let group = null;

        for (var i = 0; i < lines.length; i++) {
            var parts = lines[i].trimRight().split(/\s+/);
            if (parts.length > 0) {
                switch (parts[0]) {
                    case 'mtllib':
                        let mtllib_url = this.url.substr(0, this.url.lastIndexOf("/")) + "/" + parts[1];
                        this.mtllib = new CGFMTLModel(this.scene, mtllib_url);
                        await this.mtllib.wait();
                        break;
                    case 'v':       // vertex
                        positions.push(
                            [
                                parseFloat(parts[1]),
                                parseFloat(parts[2]),
                                parseFloat(parts[3])
                            ]
                        );
                        break;
                    case 'vn':      // vertex normals
                        normals.push(
                            [
                                parseFloat(parts[1]),
                                parseFloat(parts[2]),
                                parseFloat(parts[3])
                            ]
                        );
                        break;
                    case 'vt':      // vertex texture
                        texCoords.push(
                            [
                                parseFloat(parts[1]),
                                1-parseFloat(parts[2])
                            ]
                        );
                        break;
                    case 'g':
                        group = new CGFOBJGroupModel(this.scene, this.wireframe);
                        let groupId = parts[1];
                        this.groups[groupId] = group;
                        break;
                    case 'usemtl':
                        if(this.mtllib === null) break;
                        let materialId = parts[1];
                        let material = this.mtllib.materials[materialId];
                        if(typeof material === 'undefined') console.error(`No such material ${materialId}`);
                        else group.material = this.mtllib.materials[materialId];
                        break;
                    case 'f': {     // face element
                        function procVert(model, group, str) {
                            str = str.trim();
                            if (lut[str]) //already stored
                                // just add the index
                                group.indices.push(lut[str]);
                            else // not stored
                            {
                                // add coords/tex/norms to corresponding buffers and add the index

                                var f = str.split('/');

                                Array.prototype.push.apply(
                                    model.vertices, positions[parseInt(f[0]) - 1]
                                );

                                if (f[1])
                                    Array.prototype.push.apply(
                                        model.texCoords, texCoords[parseInt(f[1]) - 1]
                                    );
                                if (f[2])
                                    Array.prototype.push.apply(
                                        model.normals, normals[parseInt(f[2]) - 1]
                                    );

                                // store index in lut

                                lut[str] = model.vcount;

                                group.indices.push(model.vcount);

                                model.vcount++
                            }
                        }

                        if (!this.wireframe) {
                            procVert(this, group, parts[1]);
                            procVert(this, group, parts[2]);
                            procVert(this, group, parts[3]);
                            if (parts.length > 4) {
                                procVert(this, group, parts[1]);
                                procVert(this, group, parts[3]);
                                procVert(this, group, parts[4]);
                            }
                        }
                        else {
                            procVert(this, group, parts[1]);
                            procVert(this, group, parts[2]);
                            procVert(this, group, parts[2]);
                            procVert(this, group, parts[3]);
                            procVert(this, group, parts[3]);
                            if (parts.length > 4) {
                                procVert(this, group, parts[4]);
                                procVert(this, group, parts[4]);
                            }
                            procVert(this, group, parts[1]);
                        }

                        this.fcount++;

                        break;
                    }
                }
            }
        }
        console.log("Loaded mesh " + this.url + " with " + this.vcount + " vertices / " + this.fcount + " faces");

        if (this.texCoords.length == 0)
            this.texCoords = null;

        if (!this.wireframe)
            this.primitiveType = this.scene.gl.TRIANGLES;
        else
            this.primitiveType = this.scene.gl.LINES;

        let backface_culling = false;
        if(!backface_culling){
            let numVertices = this.vertices.length/3;
            this.vertices = this.vertices.concat(this.vertices);
            this.texCoords = this.texCoords.concat(this.texCoords);
            this.normals = this.normals.concat(this.normals.map((x) => -x));
        }

        for(let groupId in this.groups){
            let group = this.groups[groupId];
            group.vertices = this.vertices;
            group.normals = this.normals;
            group.texCoords = this.texCoords;
            if(!backface_culling){
                let length = group.indices.length;
                for(let i = 0; i < length; i += 3){
                    group.indices.push(
                        numVertices + group.indices[i+2],
                        numVertices + group.indices[i+1],
                        numVertices + group.indices[i+0]
                    );
                }
            }
            group.initGLBuffers();
        }
    }

    display(){
        for(let groupId in this.groups){
            let group = this.groups[groupId];
            group.display();
        }
    }
}

/**
 * Don't forget to call initGLBuffers();
 */
class CGFOBJGroupModel extends CGFobject {
    constructor(scene, wireframe) {
        super(scene);
        this.scene = scene;

        // false for triangles, true for lines (wireframe)
        this.wireframe = wireframe || false;

        // init with empty object, so that there are no problems while the data is being loaded
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        this.indices = [];

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.material = null;
    }

    display(){
        if(this.material !== null) this.material.apply();
        super.display();
    }
}

class CGFMTLModel {
    constructor(scene, url){
        this.scene = scene;
    
        this.url = url;

        this.materials = {};

        // spawn resource reading
        this.ready = false;
        this.rr = new CGFresourceReader();
        this.rr.open(this.url, this);
    }
    onResourceError(string) {
        console.log("Error loading resource " + this.url + ": " + string);
    }

    onResourceReady(string) {
        var lines = string.split("\n");
        this.materials = {};

        let material = null;

        for (var i = 0; i < lines.length; i++) {
            var parts = lines[i].trimRight().split(/\s+/);
            if (parts.length > 0) {
                switch (parts[0]) {
                    case 'newmtl':
                        material = new CGFappearance(this.scene);
                        let materialId = parts[1];
                        this.materials[materialId] = material;
                        break;
                    case 'Ka':
                        material.setAmbient(
                            parseFloat(parts[1]),
                            parseFloat(parts[2]),
                            parseFloat(parts[3]),
                            1
                        );
                        break;
                    case 'Kd':
                        material.setDiffuse(
                            parseFloat(parts[1]),
                            parseFloat(parts[2]),
                            parseFloat(parts[3]),
                            1
                        );
                        break;
                    case 'Ks':
                        material.setSpecular(
                            parseFloat(parts[1]),
                            parseFloat(parts[2]),
                            parseFloat(parts[3]),
                            1
                        );
                        break;
                    case 'Ns':
                        material.setShininess(parseFloat(parts[1]));
                        break;
                    case 'map_Ka':
                    case 'map_Kd':
                    case 'map_Ks':
                        let texture_url = this.url.substr(0, this.url.lastIndexOf("/")) + "/" + parts[1];
                        material.setTexture(new CGFtexture(this.scene, texture_url));
                }
            }
        }
        console.log("Loaded material library " + this.url + " with " + this.materials.length + " materials");

        this.ready = true;
    };

    async wait(){
        while(!this.ready){
            await sleep(100);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
