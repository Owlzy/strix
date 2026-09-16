#version 300 es
// vertex: a_position is now WORLD space; u_matrix is projection only (set once per frame)
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_texCoord;
layout(location = 2) in vec4 a_color;
uniform mat3 u_matrix;
out vec2 v_texCoord;
out vec4 v_color;
void main() {
    gl_Position = vec4((u_matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);
    v_texCoord = a_texCoord;
    v_color = a_color;
}