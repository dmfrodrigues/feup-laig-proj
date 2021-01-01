#version 300 es
precision highp float;

in vec3 aVertexPosition;

uniform bool uUseTexture;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform vec4 uPickColor;

void main() {
    // Transformed Vertex position
    gl_Position = uPMatrix * (uMVMatrix * vec4(aVertexPosition, 1.0));
}
