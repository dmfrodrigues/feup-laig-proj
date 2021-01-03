class CameraAnimation{
    constructor(scene, graph){
        this.scene = scene;
        this.graph = graph;

        this.transitions1 = [];
        this.transitions2 = [];
        this.idx = 0;

        this.lastinstant1 = 3.0;
        this.lastinstant2 = 3.0;
    }

    startCameraAnimation(){
        this.graph.cameraAnimation = true;
        this.graph.cameraAnimStartTime = 0;
    }

    setCameraPos(cam1, cam2){
        cam1.setTarget(cam2.target);
        cam1.setPosition(cam2.position);
    }
    
    interpolate(k1, k2, cam, w){
        cam.setTarget(
            vec4.fromValues(
                k1.target[0] + w*(k2.target[0] - k1.target[0]),
                k1.target[1] + w*(k2.target[1] - k1.target[1]),
                k1.target[2] + w*(k2.target[2] - k1.target[2]),
                0
            )
        );

        cam.setPosition(
            vec4.fromValues(
                k1.position[0] + w*(k2.position[0] - k1.position[0]),
                k1.position[1] + w*(k2.position[1] - k1.position[1]),
                k1.position[2] + w*(k2.position[2] - k1.position[2]),
                0
            )
        );
    }

    handleCameraAnimation(t) {
        if(this.graph.cameraAnimation){
            if(this.graph.cameraAnimStartTime == 0){
                this.idx = 0;

                if(this.scene.cameraPosition == 1)
                    this.keys = Object.keys(this.transitions1).map(Number).sort(function (a,b){ return a-b; });
                else this.keys = Object.keys(this.transitions2).map(Number).sort(function (a,b){ return a-b; });
                
                this.key1 = 0;
                this.key2 = this.keys[this.idx];

                this.p1Keyframe = new CameraKeyframe(
                    this.graph.views.list[this.graph.views.p1_camera].position,
                    this.graph.views.list[this.graph.views.p1_camera].target
                );
                this.p2Keyframe = new CameraKeyframe(
                    this.graph.views.list[this.graph.views.p2_camera].position,
                    this.graph.views.list[this.graph.views.p2_camera].target
                );
                
                this.graph.cameraAnimStartTime = t;
                this.graph.cameraAnimLastTime = t;
                this.graph.views.current = this.graph.views.move_camera;
                this.scene.updateViews();
            }

            if((this.scene.cameraPosition == 1 && t - this.graph.cameraAnimStartTime < this.lastinstant1)
                || (this.scene.cameraPosition == 2 && t - this.graph.cameraAnimStartTime < this.lastinstant2)){

                if(t - this.graph.cameraAnimStartTime > this.key2 && this.key2 != null){
                    this.idx++;
                    this.key1 = this.key2;

                    if(this.idx > this.keys.length - 1)
                        this.key2 = null;
                    else
                        this.key2 = this.keys[this.idx];           
                          
                    this.graph.cameraAnimLastTime = t;
                }
                if(this.scene.cameraPosition == 1){
                    if(this.key1 == 0)
                        this.interpolate(this.p1Keyframe, this.transitions1[this.key2], this.scene.camera,  (t-this.graph.cameraAnimLastTime)/(this.key2));
                    else if(this.key2 == null)
                        this.interpolate(this.transitions1[this.key1], this.p2Keyframe, this.scene.camera,  (t-this.graph.cameraAnimLastTime)/(this.lastinstant1-this.key1));
                    else
                        this.interpolate(this.transitions1[this.key1], this.transitions1[this.key2], this.scene.camera, (t-this.graph.cameraAnimLastTime)/(this.key2-this.key1));
                    }
                else{
                    if(this.key1 == 0)
                        this.interpolate(this.p2Keyframe, this.transitions2[this.key2], this.scene.camera, (t-this.graph.cameraAnimLastTime)/(this.key2));
                    else if(this.key2 == null)
                        this.interpolate(this.transitions2[this.key1], this.p1Keyframe, this.scene.camera, (t-this.graph.cameraAnimLastTime)/(this.lastinstant2-this.key1));
                    else
                        this.interpolate(this.transitions2[this.key1], this.transitions2[this.key2], this.scene.camera, (t-this.graph.cameraAnimLastTime)/(this.key2-this.key1));
                }
            }
            else{
                if(this.scene.cameraPosition == 1)
                    this.graph.views.current = this.graph.views.p2_camera;
                else this.graph.views.current = this.graph.views.p1_camera;
                this.scene.updateViews();
                this.graph.cameraAnimation = false;
                this.scene.cameraPosition = (this.scene.cameraPosition) % 2 + 1;
            }
        }
    }
}