#ifdef GL_ES
precision highp float;
#endif

uniform vec4 ambient;
uniform vec4 emission;

uniform sampler2D tex;
varying vec2 fragColor_coord;

void main() {
    // gl_FragColor = texture2D(tex, fragColor_coord)*(ambient + vec4(emission.xyz, 0));
    gl_FragColor = texture2D(tex, fragColor_coord)*(ambient + vec4(emission.xyz, 0));
}
