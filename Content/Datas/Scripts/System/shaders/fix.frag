uniform sampler2D texture;
uniform vec4 colorD;
uniform float alpha_threshold;

varying vec2 vUv;

void main() {
	vec4 color = texture2D(texture, vUv);
	if (color.a <= alpha_threshold)
        discard;
    vec3 rgb = vec3(color.x + colorD.x, color.y + colorD.y, color.z + colorD.z);
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    color = vec4(mix(intensity, rgb, colorD.w), color.a);

	gl_FragColor = color;
}