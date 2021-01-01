#version 300 es
precision highp float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float m;
uniform float n;
uniform vec2 sizeVec;
uniform vec4 ambient;
uniform vec4 emission;
out vec2 vTextureCoord;

void main()
{
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = (aTextureCoord + vec2(m, n))*sizeVec;
}
