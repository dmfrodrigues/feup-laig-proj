#ifdef GL_ES
precision highp float;
#endif

varying vec2 tex_coord;
uniform float m;
uniform float n;
uniform sampler2D tex;

void main() {
    gl_FragColor = texture2D(tex, tex_coord + vec2(m*(1.0/16.0), n*(1.0/16.0)));
}
