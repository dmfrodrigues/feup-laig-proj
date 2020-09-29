/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);

        this.appearance_stack = [];
        this.texture_stack = [];
        this.appearance = this.defaultAppearance;
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var folder_lights = this.interface.gui.addFolder("Lights");

        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                // this.lights[i] = new CGFlight(this, key);
                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                folder_lights.add(this.lights[i], 'enabled').name(key);

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.sceneInited = true;
    }

    pushAppearance(){
        this.appearance_stack.push(this.appearance);
        this.texture_stack.push(this.texture);
    }
    popAppearance(){
        this.appearance = this.appearance_stack.pop();
        this.texture = this.texture_stack.pop();
        this.appearance.apply();
    }
    clone_material(material){
        if(material == "same") return "same";
        var ret = new CGFappearance(material.scene);
        ret.setAmbient  (material.ambient  [0], material.ambient  [1], material.ambient  [2], material.ambient  [3]);
        ret.setDiffuse  (material.diffuse  [0], material.diffuse  [1], material.diffuse  [2], material.diffuse  [3]);
        ret.setEmission (material.emission [0], material.emission [1], material.emission [2], material.emission [3]);
        ret.setShininess(material.shininess);
        ret.setSpecular (material.specular [0], material.specular [1], material.specular [2], material.specular [3]);
        return ret;
    }
    setAppearance(material, tex){
        // material
        if(material == "same") this.appearance = this.clone_material(this.appearance_stack[this.appearance_stack.length-1]);
        else                   this.appearance = this.clone_material(material);
        // texture
        if(tex == "same") this.texture = this.texture_stack[this.texture_stack.length-1];
        else              this.texture = tex;
        this.appearance.setTexture(this.texture);
        // finally
        this.appearance.apply();
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(false);
            this.lights[i].update();
        }

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();
 
            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}