uniform sampler2D t;
uniform vec4 colorD;
uniform bool reverseH;
uniform float alpha_threshold;

varying vec2 vUv;

void main() {
	vec2 pos;
	
	if (reverseH)
		pos = vec2(1.0 - vUv.x, vUv.y);
	else
		pos = vUv;
	vec4 color = texture2D(t, pos);
	if (color.a <= alpha_threshold)
        discard;
    vec3 rgb = vec3(color.x + colorD.x, color.y + colorD.y, color.z + colorD.z);
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    color = vec4(mix(intensity, rgb, colorD.w), color.a);

	gl_FragColor = color;
}