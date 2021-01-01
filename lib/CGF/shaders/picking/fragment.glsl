#version 300 es
precision highp float;

uniform vec4 uPickColor;
out vec4 fragColor;

void main() {
	fragColor = uPickColor;	
}