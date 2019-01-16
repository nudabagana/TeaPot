precision mediump float;
    
varying vec3 vPosition; 
varying vec3 vPosInCamera;
varying vec3 vNormal; 
varying vec2 vUv;
uniform float uDirX, uDirY, uShininess;

void main(void) {
    vUv = uv;
    vNormal = normalMatrix * normal;
    vPosition = position;
    vPosInCamera = (viewMatrix * modelMatrix * vec4(position, 1.0 )).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );       
}