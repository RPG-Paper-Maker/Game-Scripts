uniform sampler2D texture;
uniform float alpha_threshold;

varying vec2 vUv;

void main() {
	vec4 color = texture2D(texture, vUv);
	if (color.a <= alpha_threshold)
        discard;
	gl_FragColor = texture2D(texture, vUv);
}