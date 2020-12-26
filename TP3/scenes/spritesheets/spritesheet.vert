#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float m;
uniform float n;
uniform vec2 sizeVec;
uniform vec4 ambient;
uniform vec4 emission;
varying vec2 fragColor_coord;

void main()
{
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    fragColor_coord = (aTextureCoord + vec2(m, n))*sizeVec;
}
