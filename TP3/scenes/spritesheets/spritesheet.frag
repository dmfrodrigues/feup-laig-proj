#version 300 es
precision highp float;

uniform vec4 ambient;
uniform vec4 emission;

in vec2 vTextureCoord;

out vec4 fragColor;

uniform sampler2D uSampler;

void main() {
    fragColor = texture(uSampler, vTextureCoord)*(ambient + vec4(emission.xyz, 0));
}
