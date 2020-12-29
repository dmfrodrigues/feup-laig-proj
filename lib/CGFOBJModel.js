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

function newId(){
    return "id" + Math.random().toString(16).slice(2);
}

class CGFOBJModel extends CGFobject {

    constructor(scene, url, wireframe) {
        super(scene);
        this.scene = scene;

        this.url = url;
        console.log("Started creating object from url " + this.url);

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
        this.objects = {};
        this.display_list = [];
    };
    onResourceError(string) {
        console.log("Error loading resource " + this.url + ": " + string);
    }

    async onResourceReady(string) {
        console.log("Starting to load mesh " + this.url);

        var lines = string.split("\n");
        var positions = [];
        var normals = [];
        var vertices = [];
        var texCoords = [];

        let object = new CGFOBJObjectModel(this.scene, this.wireframe);
        let objectId = newId();
        this.objects[objectId] = object;

        let group = new CGFOBJGroupModel(this.scene, this.wireframe);
        let groupId = newId();
        object.groups[groupId] = group;

        for (let i = 0; i < lines.length; i++) {
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
                    case 'o':
                        object = new CGFOBJObjectModel(this.scene, this.wireframe);
                        objectId = parts[1];
                        this.objects[objectId] = object;

                        group = new CGFOBJGroupModel(this.scene, this.wireframe);
                        groupId = newId();
                        object.groups[groupId] = group;

                        break;
                    case 'g':
                        group = new CGFOBJGroupModel(this.scene, this.wireframe);
                        groupId = parts[1];
                        object.groups[groupId] = group;
                        break;
                    case 'usemtl':
                        if(this.mtllib === null) break;
                        let materialId = parts[1];
                        let material = this.mtllib.materials[materialId];
                        if(typeof material === 'undefined') console.error(`No such material ${materialId}`);
                        else {
                            if(groupId.slice(0, 2) === "id") object.material = this.mtllib.materials[materialId];
                            else                             group .material = this.mtllib.materials[materialId];
                        }
                        break;
                    case 'f': {     // face element
                        function procVert(object, group, str) {
                            str = str.trim();
                            {
                                // add coords/tex/norms to corresponding buffers and add the index

                                var f = str.split('/');

                                let pos = positions[parseInt(f[0]) - 1];
                                let tex = (f[1] ? texCoords[parseInt(f[1]) - 1] : [0,0]);
                                let norm = (f[2] ? normals[parseInt(f[2]) - 1] : [1,0,0]);

                                Array.prototype.push.apply(group.vertices , pos );
                                Array.prototype.push.apply(group.texCoords, tex );
                                Array.prototype.push.apply(group.normals  , norm);
                                group.indices.push(group.vcount++);
                            }
                        }

                        if (!this.wireframe) {
                            for(let i = 2; i+1 < parts.length; ++i){
                                procVert(object, group, parts[1]);
                                procVert(object, group, parts[i]);
                                procVert(object, group, parts[i+1]);
                            }
                        }
                        else {
                            for(let i = 1; i+1 < parts.length; ++i){
                                procVert(object, group, parts[i]);
                                procVert(object, group, parts[i+1]);
                            }
                            procVert(object, group, parts[parts.length-1]);
                            procVert(object, group, parts[1]);
                        }

                        object.fcount++;

                        break;
                    }
                    case '#':
                        break;
                    case '':
                        break;
                    case 's':
                        break;
                    default:
                        console.error(`Unknown line meaning '${parts.join(' ')}'`);
                        break;
                }
            }
        }
        console.log("Loaded mesh " + this.url);

        if (this.texCoords.length == 0)
            this.texCoords = null;

        if (!this.wireframe)
            this.primitiveType = this.scene.gl.TRIANGLES;
        else
            this.primitiveType = this.scene.gl.LINES;

        for(let objectId in this.objects){
            let object = this.objects[objectId];
            object.initGLBuffers();
        }

        let keys = Object.keys(this.objects).sort();
        this.display_list = [];
        for(let key of keys){
            this.display_list.push(this.objects[key]);
        }
    }

    display(){
        // let first = false;
        for(let object of this.display_list){
            // if(first) this.scene.gl.depthMask(false);
            object.display();
            // if(first) this.scene.gl.depthMask(true);
            // first = true;
        }
    }
}

/**
 * Don't forget to call initGLBuffers();
 */
class CGFOBJObjectModel extends CGFobject {
    constructor(scene, wireframe) {
        super(scene);
        this.scene = scene;

        this.groups = {};
        this.material = null;
    }

    initGLBuffers(){
        for(let groupId in this.groups){
            let group = this.groups[groupId];
            group.initGLBuffers();
        }
    }

    display(){
        if(this.material !== null) this.material.apply();
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
        this.vcount = 0;

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.material = null;
    }

    display(){
        if(this.indices.length <= 0) return;
        if(this.material !== null) this.material.apply();
        super.display();
    }
}

class CGFMTLModel {
    constructor(scene, url){
        this.scene = scene;
    
        this.url = url;

        this.materials = {};
        this.textures = {};

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
                            material.ambient[3]
                        );
                        break;
                    case 'Kd':
                        material.setDiffuse(
                            parseFloat(parts[1]),
                            parseFloat(parts[2]),
                            parseFloat(parts[3]),
                            material.diffuse[3]
                        );
                        break;
                    case 'Ks':
                        material.setSpecular(
                            parseFloat(parts[1]),
                            parseFloat(parts[2]),
                            parseFloat(parts[3]),
                            material.specular[3]
                        );
                        break;
                    case 'Ke':
                        material.setEmission(
                            parseFloat(parts[1]),
                            parseFloat(parts[2]),
                            parseFloat(parts[3]),
                            material.emission[3]
                        );
                        break;
                    case 'Ns':
                        material.setShininess(parseFloat(parts[1]));
                        break;
                    case 'd':
                        material.setAmbient(
                            material.ambient[0],
                            material.ambient[1],
                            material.ambient[2],
                            parseFloat(parts[1])
                        );
                        material.setDiffuse(
                            material.diffuse[0],
                            material.diffuse[1],
                            material.diffuse[2],
                            parseFloat(parts[1])
                        );
                        material.setSpecular(
                            material.specular[0],
                            material.specular[1],
                            material.specular[2],
                            parseFloat(parts[1])
                        );
                        material.setEmission(
                            material.emission[0],
                            material.emission[1],
                            material.emission[2],
                            parseFloat(parts[1])
                        );
                        break;
                    case 'map_Ka':
                    case 'map_Kd':
                    case 'map_Ks':
                        let idx = 1;
                        if(parts[idx] === '-s') idx = 5;
                        let texture_url = this.url.substr(0, this.url.lastIndexOf("/")) + "/" + parts[idx];
                        let texture;
                        if(typeof this.textures[texture_url] === 'undefined'){
                            texture = new CGFtexture(this.scene, texture_url);
                            this.textures[texture_url] = texture;
                        } else texture = this.textures[texture_url];
                        material.setTexture(texture);
                        break;
                    case 'map_d':
                        console.warn(`${this.url}, line ${i}: map_d (alpha map) is not supported independently, but can be specified in Ka/Kd/Ks textures`);
                        break;
                    case 'Ni':
                        break;
                    case 'refl':
                        break;
                    case 'illum':
                        break;
                    case '#':
                        break;
                    case '':
                        break;
                    default:
                        console.error(`Unknown line meaning '${parts.join(' ')}'`);
                        break;
                }
            }
        }
        console.log("Loaded material library " + this.url + " with " + Object.keys(this.materials).length + " materials");

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
