attribute vec3 aPos;
attribute vec4 aColor;
varying vec4 Color;

uniform mat4 ViewProjection;
uniform mat4 Model;

void main() {
  Color = aColor;
  gl_Position =
      ViewProjection * Model * vec4(aPos.xy * 0.5 - 0.25, aPos.z, 1.0);
}