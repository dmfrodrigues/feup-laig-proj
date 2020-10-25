const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.parseFloat(refNode, 'length', "<initials>");
        if (typeof axis_length === "string"){
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");
            this.referenceLength = 1;
        }

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        
        this.views = {};
        this.views.list = {};
        this.views.default = viewsNode.attributes.default.value;
        
        for(let i = 0; i < viewsNode.children.length; ++i){
            let camera = viewsNode.children[i];
            
            // Checks for repeated IDs.
            if (this.views.list[camera.id] != null)
                return "ID must be unique for each view (conflict: ID = " + camera.id + ")";

            let camera_obj;
            if(camera.nodeName == "perspective"){
                camera_obj = this.parsePerspectiveCamera(camera, camera.id);
            } else if(camera.nodeName == "ortho"){
                camera_obj = this.parseOrthoCamera(camera, camera.id);
            } else {
                this.onXMLMinorError(`no such camera type "${camera.nodeName}"; ignored`);
                continue;
            }
            if(typeof camera_obj === "string") return camera_obj;
            this.views.list[camera.id] = camera_obj;
        }

        if(Object.keys(this.views.list).length == 0){
            this.views.list["default"] = new CGFcamera(
                45.0*DEGREE_TO_RAD,
                0.1,
                500,
                vec3.fromValues(1, 1, 1),
                vec3.fromValues(0, 0, 0)
            );
            this.onXMLError(`no views were read; default view being used`);
        }

        if(this.views.list[this.views.default] == null){
            this.views.default = Object.keys(this.views.list)[0];
            this.onXMLError(`no such view "${this.views.default}" to use as default; using "${this.views.default}"`);
        }

        this.views.current = this.views.default;

        this.log("Parsed views");
        
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        if(ambientIndex >= 0) var color = this.parseColor(children[ambientIndex], "ambient");
        else{
            var color = [1, 1, 1, 1];
            this.onXMLMinorError(`no ambient color; using default ${color}`);
        }
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        if(backgroundIndex >= 0) color = this.parseColor(children[backgroundIndex], "background");
        else{
            color = [1, 1, 1, 1];
            this.onXMLMinorError(`no background color; using default ${color}`);
        }
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed illumination");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0){
            this.lights["default"] = [
                true,
                [0, 1, 0, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1]
            ];
            this.onXMLMinorError("at least one light must be defined; using default light");
        } else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        this.textures = {};
        for(let i = 0; i < texturesNode.children.length; ++i){
            let texture = texturesNode.children[i];

        // Checks for repeated IDs.
        if (this.textures[texture.id] != null)
            return "ID must be unique for each texture (conflict: ID = " + texture.id + ")";

            this.textures[texture.id] = new CGFtexture(
                this.scene,
                texture.attributes.path.value
            );
        }

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            grandChildren = children[i].children;
            
            nodeNames = [];

            var mat = new CGFappearance(this.scene);
            
            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            let ambientIndex   = nodeNames.indexOf("ambient"  ); 
            let diffuseIndex   = nodeNames.indexOf("diffuse"  ); 
            let emissionIndex  = nodeNames.indexOf("emissive" ); 
            let specularIndex  = nodeNames.indexOf("specular" ); 
            let shininessIndex = nodeNames.indexOf("shininess");

            if(ambientIndex  >= 0){ mat.ambient  = this.parseColor(grandChildren[ambientIndex ], "ambient" ); if(typeof mat.ambient  === "string") return mat.ambient ; }
            else { this.onXMLMinorError("missing "+"ambient" +" component, using default value"); mat.ambient  = [0, 0, 0, 1]; }
            if(diffuseIndex  >= 0){ mat.diffuse  = this.parseColor(grandChildren[diffuseIndex ], "diffuse" ); if(typeof mat.diffuse  === "string") return mat.diffuse ; }
            else { this.onXMLMinorError("missing "+"diffuse" +" component, using default value"); mat.diffuse  = [1, 1, 1, 1]; }
            if(emissionIndex >= 0){ mat.emission = this.parseColor(grandChildren[emissionIndex], "emissive"); if(typeof mat.emission === "string") return mat.emission; }
            else { this.onXMLMinorError("missing "+"emissive"+" component, using default value"); mat.emission = [0, 0, 0, 1]; }
            if(specularIndex >= 0){ mat.specular = this.parseColor(grandChildren[specularIndex], "specular"); if(typeof mat.specular === "string") return mat.specular; }
            else { this.onXMLMinorError("missing "+"specular"+" component, using default value"); mat.specular =           1 ; }
            
            mat.shininess = this.parseFloat(grandChildren[shininessIndex], "value");
            if(typeof mat.shininess === "string") return mat.shininess;

            this.materials[materialID] = mat;
        }

        this.scene.materials = this.materials;

        this.log("Parsed materials");

        return null;
    }

    /**
     * Parses transformations.
     * @param {transformations array} transformations
     * @param {matrix} M
     */
    parseTransformations(transformations, M){
            if(transformations != null){
                transformations = transformations.children;
                for(let i = 0; i < transformations.length; ++i){
                    let trans = transformations[i];
                    switch(trans.nodeName){
                        case "translation":
                            let T = this.parseCoordinates3D(trans); if(typeof T === "string") return T;
                            mat4.translate(M, M, vec3.fromValues(...T));
                            break;
                        case "rotation":
                            let angle = this.parseFloat(trans, 'angle', `<transformations>, node ${nodeID}`); if(typeof angle === "string") return angle;
                            angle *= DEGREE_TO_RAD;
                            if(trans.attributes.axis  == null) return `rotation of node ${nodeID} is missing axis`;
                            switch(trans.attributes.axis.value){
                                case "x": mat4.rotateX(M, M, angle); break;
                                case "y": mat4.rotateY(M, M, angle); break;
                                case "z": mat4.rotateZ(M, M, angle); break;
                                default: return `no such rotation axis "${trans.attributes.axis.value}"`;
                            }
                            break;
                        case "scale":
                            let sx = this.parseFloat(trans, 'sx', `<transformations>, node ${nodeID}`); if(typeof sx === "string") return sx;
                            let sy = this.parseFloat(trans, 'sy', `<transformations>, node ${nodeID}`); if(typeof sy === "string") return sy;
                            let sz = this.parseFloat(trans, 'sz', `<transformations>, node ${nodeID}`); if(typeof sz === "string") return sz;
                            mat4.scale(M, M, vec3.fromValues(sx, sy, sz));
                            break;
                        default:
                            return `no such transformation "${trans.nodeName}"`;
                    }
                }
            }
        return null;
    }

    /**
     * Parses the <nodes> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var nodeNames = [];

        let nodeDescendants = {};

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");

            let node = new Node(this.scene, nodeID);
            // Transformations
            let transformations = grandChildren[transformationsIndex];
            let M = mat4.create();
            let error;
            if((error = this.parseTransformations(transformations, M)) != null) return error;
            node.setTransformation(M);
            // Material
            let material = grandChildren[materialIndex];
            if(material == null) return `<material> block is mandatory (node "${nodeID}")`;
            let mat = (material.id == "null" ? "same" : this.materials[material.id]);
            if(mat == null) return `no such material "${material.id}"`;
            node.setMaterial(mat);
            // Texture
            let texture = grandChildren[textureIndex];
            if(texture  == null) return `<texture> block is mandatory (node "${nodeID}")`;
            let tex;
            switch(texture.id){
                case "null" : tex = "same"; break;
                case "clear": tex = null; break;
                default: tex = this.textures[texture.id]; break;
            }
            if(typeof tex == "undefined") return `no such texture "${texture.id}"`;
            node.setTexture (tex);
            let afs = undefined, aft = undefined;
            for(let i = 0; i < texture.children.length; ++i){
                let child = texture.children[i];
                switch(child.nodeName){
                    case "amplification":
                        afs = this.parseFloat(child, 'afs', `<texture>, node ${nodeID}`); if(typeof afs === "string") return afs;
                        aft = this.parseFloat(child, 'aft', `<texture>, node ${nodeID}`); if(typeof aft === "string") return aft;
                        break;
                    default: return `block with tag "${child.nodeName}" not allowed inside <texture> block`;
                }
            }
            if(afs == null || aft == null){
                if(texture.id != "clear") console.warn(`node "${nodeID}": Undefined amplification, using defaults`);
                afs = 1; aft = 1;
            } else {
                if(texture.id == "clear") console.warn(`node "${nodeID}": Texture "clear" does not require amplification`);
            }
            // Descendants
            let descendants = grandChildren[descendantsIndex].children;
            nodeDescendants[nodeID] = [];
            for(let j = 0; j < descendants.length; ++j){
                let descendant = descendants[j];
                if(descendant.nodeName == 'noderef'){
                    nodeDescendants[nodeID].push(descendant.id);
                } else if(descendant.nodeName == 'leaf'){
                    let leaf = {};
                    switch(descendant.attributes.type.value){
                        case "rectangle": leaf = this.parseRectangle(descendant, afs, aft, descendant.id); break;
                        case "triangle" : leaf = this.parseTriangle (descendant, afs, aft, descendant.id); break;
                        case "cylinder" : leaf = this.parseCylinder (descendant,           descendant.id); break;
                        case "sphere"   : leaf = this.parseSphere   (descendant,           descendant.id); break;
                        case "torus"    : leaf = this.parseTorus    (descendant,           descendant.id); break;
                        default:
                            return `no such leaf type "${descendant.attributes.type}"`;
                    }
                    if(typeof leaf === "string") return leaf;
                    node.addChild(leaf);
                } else return `no such descendant type "${descendant.nodeName}"`;
            }

            if(this.nodes[nodeID] != null) return "node with same id already exists";
            this.nodes[nodeID] = node;
        }

        for(let nodeID in nodeDescendants){
            let node = this.nodes[nodeID];
            let descendants = nodeDescendants[nodeID];
            for(let i = 0; i < descendants.length; ++i){
                let childID = descendants[i];
                let child = this.nodes[childID];
                if(child == null) return `node "${nodeID}" has child "${childID}" which does not exist`;
                node.addChild(child);
            }
        }

        if(this.nodes[this.idRoot] == null)
            return `No such root node "${this.idRoot}"`;
        
        this.log("Parsed nodes");
    }

    /**
     * Parses a boolean
     * @param {XMLnode} node XML node
     * @param {string} name Name
     * @param {string} messageError String to print in case of error
     */
    parseBoolean(node, name, messageError){
        var boolVal;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
        {
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");
            return true;
        }
        return boolVal;
    }

    parseFloat(node, name, messageError){
        let ret = this.reader.getFloat(node, name);
        if(ret == null || isNaN(ret)) return `unable to parse ${name}: ${messageError}`;
        return ret;
    }

    parseInt(node, name, messageError){
        let ret = this.reader.getInteger(node, name);
        if(ret == null || isNaN(ret)) return `unable to parse ${name}: ${messageError}`;
        return ret;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        let x = this.parseFloat(node, 'x', messageError); if (typeof x === "string") return x;
        let y = this.parseFloat(node, 'y', messageError); if (typeof y === "string") return y;
        let z = this.parseFloat(node, 'z', messageError); if (typeof z === "string") return z;

        return [x,y,z];
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        let position = this.parseCoordinates3D(node, messageError);
        if (!Array.isArray(position))
            return position;

        let w = this.parseFloat(node, 'w', messageError); if(typeof w === "string") return w;
        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        let r = this.parseFloat(node, 'r', messageError); if(typeof r === "string") return r; if(!(0 <= r && r <= 1)) return `r component outside range: ${messageError}`;
        let g = this.parseFloat(node, 'g', messageError); if(typeof g === "string") return g; if(!(0 <= g && g <= 1)) return `g component outside range: ${messageError}`;
        let b = this.parseFloat(node, 'b', messageError); if(typeof b === "string") return b; if(!(0 <= b && b <= 1)) return `b component outside range: ${messageError}`;
        let a = this.parseFloat(node, 'a', messageError); if(typeof a === "string") return a; if(!(0 <= a && a <= 1)) return `a component outside range: ${messageError}`;

        return [r,g,b,a];
    }

    /**
     * Parse the perspective camera from a node
     * @param {block element} camera
     * @param {message to be displayed in case of error} messageError
     */
    parsePerspectiveCamera(camera, messageError){
        let fromAttr = null;
        let toAttr   = null;
        for(let j = 0; j < camera.children.length; ++j){
            if(camera.children[j].nodeName == "from") fromAttr = camera.children[j];
            if(camera.children[j].nodeName == "to"  ) toAttr   = camera.children[j];
        }
        if(fromAttr === null) return `does not have fromAttr: ${messageError}`;
        if(toAttr   === null) return `does not have toAttr  : ${messageError}`;

        let angle  = this.parseFloat(camera, 'angle' , camera.id); if(typeof angle  === "string") return angle ;
        let near   = this.parseFloat(camera, 'near'  , camera.id); if(typeof near   === "string") return near  ;
        let far    = this.parseFloat(camera, 'far'   , camera.id); if(typeof far    === "string") return far   ;
        let from   = this.parseCoordinates3D(fromAttr, camera.id); if(typeof from   === "string") return from  ;
        let to     = this.parseCoordinates3D(toAttr  , camera.id); if(typeof to     === "string") return to    ;

        return new CGFcamera(angle*DEGREE_TO_RAD, near, far, vec3.fromValues(...from), vec3.fromValues(...to));
    }

    /**
     * Parse the orthographic camera from a node
     * @param {block element} camera
     * @param {message to be displayed in case of error} messageError
     */
    parseOrthoCamera(camera, messageError){
        let fromAttr = null;
        let toAttr   = null;
        let upAttr   = null;
        for(let j = 0; j < camera.children.length; ++j){
            if(camera.children[j].nodeName == "from") fromAttr = camera.children[j];
            if(camera.children[j].nodeName == "to"  ) toAttr   = camera.children[j];
            if(camera.children[j].nodeName == "up"  ) upAttr   = camera.children[j];
        }
        if(fromAttr === null) return `does not have fromAttr: ${messageError}`;
        if(toAttr   === null) return `does not have toAttr  : ${messageError}`;
        if(upAttr   === null) return `does not have upAttr  : ${messageError}`;

        let left   = this.parseFloat(camera, 'left'  , camera.id); if(typeof left   === "string") return left  ;
        let right  = this.parseFloat(camera, 'right' , camera.id); if(typeof right  === "string") return right ;
        let bottom = this.parseFloat(camera, 'bottom', camera.id); if(typeof bottom === "string") return bottom;
        let top    = this.parseFloat(camera, 'top'   , camera.id); if(typeof top    === "string") return top   ;
        let near   = this.parseFloat(camera, 'near'  , camera.id); if(typeof near   === "string") return near  ;
        let far    = this.parseFloat(camera, 'far'   , camera.id); if(typeof far    === "string") return far   ;
        let from   = this.parseCoordinates3D(fromAttr, camera.id); if(typeof from   === "string") return from  ;
        let to     = this.parseCoordinates3D(toAttr  , camera.id); if(typeof to     === "string") return to    ;
        let up     = this.parseCoordinates3D(upAttr  , camera.id); if(typeof up     === "string") return up    ;

        return new CGFcameraOrtho(
            left, right, bottom, top, near, far,
            vec3.fromValues(...from), vec3.fromValues(...to), vec3.fromValues(...up)
        );
    }

    parseRectangle(node, afs, aft, messageError){
        let x1 = this.parseFloat(node, 'x1', messageError); if(typeof x1 === "string") return x1;
        let y1 = this.parseFloat(node, 'y1', messageError); if(typeof y1 === "string") return y1;
        let x2 = this.parseFloat(node, 'x2', messageError); if(typeof x2 === "string") return x2;
        let y2 = this.parseFloat(node, 'y2', messageError); if(typeof y2 === "string") return y2;
        return new MyRectangle(this.scene, x1, y1, x2, y2, afs, aft);
    }

    parseTriangle(node, afs, aft, messageError){
        let x1 = this.parseFloat(node, 'x1', messageError); if(typeof x1 === "string") return x1;
        let y1 = this.parseFloat(node, 'y1', messageError); if(typeof y1 === "string") return y1;
        let x2 = this.parseFloat(node, 'x2', messageError); if(typeof x2 === "string") return x2;
        let y2 = this.parseFloat(node, 'y2', messageError); if(typeof y2 === "string") return y2;
        let x3 = this.parseFloat(node, 'x3', messageError); if(typeof x3 === "string") return x3;
        let y3 = this.parseFloat(node, 'y3', messageError); if(typeof y3 === "string") return y3;
        return new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3, afs, aft);
    }

    parseCylinder(node, messageError){
        let bottomRadius = this.parseFloat(node, 'bottomRadius', messageError); if(typeof bottomRadius === "string") return bottomRadius;
        let topRadius    = this.parseFloat(node, 'topRadius'   , messageError); if(typeof topRadius    === "string") return topRadius   ;
        let height       = this.parseFloat(node, 'height'      , messageError); if(typeof height       === "string") return height      ;
        let slices       = this.parseFloat(node, 'slices'      , messageError); if(typeof slices       === "string") return slices      ;
        let stacks       = this.parseFloat(node, 'stacks'      , messageError); if(typeof stacks       === "string") return stacks      ;
        return new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks);
    }

    parseSphere(node, messageError){
        let radius = this.parseFloat(node, 'radius', messageError); if(typeof radius === "string") return radius;
        let slices = this.parseInt  (node, 'slices', messageError); if(typeof slices === "string") return slices;
        let stacks = this.parseInt  (node, 'stacks', messageError); if(typeof stacks === "string") return stacks;
        return new MySphere(this.scene, radius, slices, stacks);
    }

    parseTorus(node, messageError){
        let inner  = this.parseFloat(node, 'inner' , messageError); if(typeof inner  === "string") return inner ;
        let outer  = this.parseFloat(node, 'outer' , messageError); if(typeof outer  === "string") return outer ;
        let slices = this.parseFloat(node, 'slices', messageError); if(typeof slices === "string") return slices;
        let loops  = this.parseFloat(node, 'loops' , messageError); if(typeof loops  === "string") return loops ;
        return new MyTorus(this.scene, inner, outer, slices, loops);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        
        //TODO: Create display loop for transversing the scene graph, calling the root node's display function
        
        this.nodes[this.idRoot].display();
    }
}
