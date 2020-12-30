ANIM_DUR = 3.0;

/**
 * CameraAnimation
 */
class CameraAnimation{
    constructor(scene, graph){
        this.scene = scene;
        this.graph = graph
    }

    startCameraAnimation(){
        this.graph.cameraAnimation = true;
        this.graph.cameraAnimStartTime = 0;
    }

	interpolateCameras(cam1, cam2, cam3, w){
        cam3.setTarget(
            vec4.fromValues(
                cam1.target[0] + w*(cam2.target[0] - cam1.target[0]),
                cam1.target[1] + w*(cam2.target[1] - cam1.target[1]),
                cam1.target[2] + w*(cam2.target[2] - cam1.target[2]),
                0
            )
        );
        cam3.setPosition(
            vec4.fromValues(
                cam1.position[0] + w*(cam2.position[0] - cam1.position[0]),
                cam1.position[1] + w*(cam2.position[1] - cam1.position[1]),
                cam1.position[2] + w*(cam2.position[2] - cam1.position[2]),
                0
            )
        );
	}

    handleCameraAnimation(t) {
        if(this.graph.cameraAnimation){
            if(this.graph.cameraAnimStartTime == 0){
                this.graph.cameraAnimStartTime = t;
                this.graph.cameraAnimLastTime = t;
                this.graph.views.current = this.graph.views.move_camera;
                this.scene.updateViews();
            }
            if(t - this.graph.cameraAnimStartTime < ANIM_DUR/2.0){
                if(this.scene.cameraPosition == 1){
                    this.interpolateCameras(
                        this.graph.views.list[this.graph.views.p1_camera],
                        this.graph.views.list[this.graph.views.p1transition_camera], 
                        this.scene.camera,
                        (t-this.graph.cameraAnimStartTime)/(ANIM_DUR/2.0)
                    );
                }else{
                    this.interpolateCameras(
                        this.graph.views.list[this.graph.views.p2_camera],
                        this.graph.views.list[this.graph.views.p2transition_camera], 
                        this.scene.camera,
                        (t-this.graph.cameraAnimStartTime)/(ANIM_DUR/2.0)
                    );
                }
                this.graph.cameraAnimLastTime = t;
            }
            else if(t - this.graph.cameraAnimStartTime < ANIM_DUR){
                if(this.scene.cameraPosition == 1){
                    this.interpolateCameras(
                        this.graph.views.list[this.graph.views.p1transition_camera],
                        this.graph.views.list[this.graph.views.p2_camera], 
                        this.scene.camera,
                        (t-this.graph.cameraAnimLastTime)/(ANIM_DUR/2.0)
                    );
                }else{
                    this.interpolateCameras(
                        this.graph.views.list[this.graph.views.p2transition_camera],
                        this.graph.views.list[this.graph.views.p1_camera], 
                        this.scene.camera,
                        (t-this.graph.cameraAnimLastTime)/(ANIM_DUR/2.0)
                    );
                }
            }
            else{
                if(this.scene.cameraPosition == 1)
                    this.graph.views.current = this.graph.views.p2_camera;
                else this.graph.views.current = this.graph.views.p1_camera;
                this.scene.updateViews();
                this.graph.cameraAnimation = false;
                this.scene.cameraPosition = (this.scene.cameraPosition)%2 + 1;
            }
        }
    }
}