        // Orb組件配置
        const orbConfig = {
            hue: 0,
            hoverIntensity: 0.8,
            rotateOnHover: true,
            forceHoverState: false
        };
        
        // 檢測是否為移動設備
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 如果是移動設備，調整配置
        if (isMobile) {
            orbConfig.hoverIntensity = 0.6; // 降低移動端強度
        }

        // WebGL Orb實現
        class Orb {
            constructor(canvas, config) {
                this.canvas = canvas;
                this.gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false });
                this.config = config;
                
                if (!this.gl) {
                    console.error('WebGL2 not supported');
                    return;
                }

                this.init();
                this.setupEventListeners();
                this.animate();
            }

            init() {
                const gl = this.gl;
                
                // 創建著色器程序
                this.program = this.createProgram();
                
                // 創建幾何體
                this.geometry = this.createGeometry();
                
                // 獲取uniform位置
                this.uniforms = {
                    iTime: gl.getUniformLocation(this.program, 'iTime'),
                    iResolution: gl.getUniformLocation(this.program, 'iResolution'),
                    hue: gl.getUniformLocation(this.program, 'hue'),
                    hover: gl.getUniformLocation(this.program, 'hover'),
                    rot: gl.getUniformLocation(this.program, 'rot'),
                    hoverIntensity: gl.getUniformLocation(this.program, 'hoverIntensity')
                };
                
                // 設置canvas尺寸（在uniforms初始化之後）
                this.resize();
                
                // 初始化狀態
                this.targetHover = 0;
                this.currentHover = 0;
                this.currentRot = 0;
                this.rotationSpeed = 1.1;
                this.lastTime = 0;
            }

            createShader(type, source) {
                const gl = this.gl;
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                    return null;
                }
                
                return shader;
            }

            createProgram() {
                const gl = this.gl;
                
                const vertexShader = this.createShader(gl.VERTEX_SHADER, `
                    attribute vec2 position;
                    attribute vec2 uv;
                    varying vec2 vUv;
                    
                    void main() {
                        vUv = uv;
                        gl_Position = vec4(position, 0.0, 1.0);
                    }
                `);
                
                const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, `
                    precision highp float;
                    
                    uniform float iTime;
                    uniform vec3 iResolution;
                    uniform float hue;
                    uniform float hover;
                    uniform float rot;
                    uniform float hoverIntensity;
                    varying vec2 vUv;
                    
                    vec3 rgb2yiq(vec3 c) {
                        float y = dot(c, vec3(0.299, 0.587, 0.114));
                        float i = dot(c, vec3(0.596, -0.274, -0.322));
                        float q = dot(c, vec3(0.211, -0.523, 0.312));
                        return vec3(y, i, q);
                    }
                    
                    vec3 yiq2rgb(vec3 c) {
                        float r = c.x + 0.956 * c.y + 0.621 * c.z;
                        float g = c.x - 0.272 * c.y - 0.647 * c.z;
                        float b = c.x - 1.106 * c.y + 1.703 * c.z;
                        return vec3(r, g, b);
                    }
                    
                    vec3 adjustHue(vec3 color, float hueDeg) {
                        float hueRad = hueDeg * 3.14159265 / 180.0;
                        vec3 yiq = rgb2yiq(color);
                        float cosA = cos(hueRad);
                        float sinA = sin(hueRad);
                        float i = yiq.y * cosA - yiq.z * sinA;
                        float q = yiq.y * sinA + yiq.z * cosA;
                        yiq.y = i;
                        yiq.z = q;
                        return yiq2rgb(yiq);
                    }
                    
                    vec3 hash33(vec3 p3) {
                        p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
                        p3 += dot(p3, p3.yxz + 19.19);
                        return -1.0 + 2.0 * fract(vec3(
                            p3.x + p3.y,
                            p3.x + p3.z,
                            p3.y + p3.z
                        ) * p3.zyx);
                    }
                    
                    float snoise3(vec3 p) {
                        const float K1 = 0.333333333;
                        const float K2 = 0.166666667;
                        vec3 i = floor(p + (p.x + p.y + p.z) * K1);
                        vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
                        vec3 e = step(vec3(0.0), d0 - d0.yzx);
                        vec3 i1 = e * (1.0 - e.zxy);
                        vec3 i2 = 1.0 - e.zxy * (1.0 - e);
                        vec3 d1 = d0 - (i1 - K2);
                        vec3 d2 = d0 - (i2 - K1);
                        vec3 d3 = d0 - 0.5;
                        vec4 h = max(0.6 - vec4(
                            dot(d0, d0),
                            dot(d1, d1),
                            dot(d2, d2),
                            dot(d3, d3)
                        ), 0.0);
                        vec4 n = h * h * h * h * vec4(
                            dot(d0, hash33(i)),
                            dot(d1, hash33(i + i1)),
                            dot(d2, hash33(i + i2)),
                            dot(d3, hash33(i + 1.0))
                        );
                        return dot(vec4(31.316), n);
                    }
                    
                    vec4 extractAlpha(vec3 colorIn) {
                        float a = max(max(colorIn.r, colorIn.g), colorIn.b);
                        return vec4(colorIn.rgb / (a + 1e-5), a);
                    }
                    
                    const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
                    const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
                    const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
                    const float innerRadius = 0.6;
                    const float noiseScale = 0.65;
                    
                    float light1(float intensity, float attenuation, float dist) {
                        return intensity / (1.0 + dist * attenuation);
                    }
                    
                    float light2(float intensity, float attenuation, float dist) {
                        return intensity / (1.0 + dist * dist * attenuation);
                    }
                    
                    vec4 draw(vec2 uv) {
                        vec3 color1 = adjustHue(baseColor1, hue);
                        vec3 color2 = adjustHue(baseColor2, hue);
                        vec3 color3 = adjustHue(baseColor3, hue);
                        
                        float ang = atan(uv.y, uv.x);
                        float len = length(uv);
                        float invLen = len > 0.0 ? 1.0 / len : 0.0;
                        
                        float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
                        float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
                        float d0 = distance(uv, (r0 * invLen) * uv);
                        float v0 = light1(1.0, 10.0, d0);
                        v0 *= smoothstep(r0 * 1.05, r0, len);
                        float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
                        
                        float a = iTime * -2.8;
                        vec2 pos = vec2(cos(a), sin(a)) * r0;
                        float d = distance(uv, pos);
                        float v1 = light2(1.5, 5.0, d);
                        v1 *= light1(1.0, 50.0, d0);
                        
                        float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
                        float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
                        
                        vec3 col = mix(color1, color2, cl);
                        col = mix(color3, col, v0);
                        col = (col + v1) * v2 * v3;
                        col = clamp(col, 0.0, 1.0);
                        
                        return extractAlpha(col);
                    }
                    
                    vec4 mainImage(vec2 fragCoord) {
                        vec2 center = iResolution.xy * 0.5;
                        float size = min(iResolution.x, iResolution.y);
                        vec2 uv = (fragCoord - center) / size * 2.0;
                        
                        float angle = rot;
                        float s = sin(angle);
                        float c = cos(angle);
                        uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
                        
                        uv.x += hover * hoverIntensity * 0.15 * sin(uv.y * 12.0 + iTime);
                        uv.y += hover * hoverIntensity * 0.15 * sin(uv.x * 12.0 + iTime);
                        
                        return draw(uv);
                    }
                    
                    void main() {
                        vec2 fragCoord = vUv * iResolution.xy;
                        vec4 col = mainImage(fragCoord);
                        gl_FragColor = vec4(col.rgb * col.a, col.a);
                    }
                `);
                
                const program = gl.createProgram();
                gl.attachShader(program, vertexShader);
                gl.attachShader(program, fragmentShader);
                gl.linkProgram(program);
                
                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    console.error('Program linking error:', gl.getProgramInfoLog(program));
                    return null;
                }
                
                gl.useProgram(program);
                return program;
            }

            createGeometry() {
                const gl = this.gl;
                
                // 創建三角形幾何體
                const positions = new Float32Array([
                    -1, -1,
                     3, -1,
                    -1,  3
                ]);
                
                const uvs = new Float32Array([
                    0, 0,
                    2, 0,
                    0, 2
                ]);
                
                const positionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
                
                const positionLocation = gl.getAttribLocation(this.program, 'position');
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                
                const uvBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
                
                const uvLocation = gl.getAttribLocation(this.program, 'uv');
                gl.enableVertexAttribArray(uvLocation);
                gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);
            }

            resize() {
                const gl = this.gl;
                const dpr = window.devicePixelRatio || 1;
                const rect = this.canvas.getBoundingClientRect();
                const width = rect.width * dpr;
                const height = rect.height * dpr;
                
                this.canvas.width = width;
                this.canvas.height = height;
                gl.viewport(0, 0, width, height);
                
                if (this.uniforms.iResolution) {
                    gl.uniform3f(this.uniforms.iResolution, width, height, width / height);
                }
            }

            setupEventListeners() {
                // 滑鼠事件（桌面端）
                this.canvas.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    this.updateHoverState(x, y, rect.width, rect.height);
                });
                
                this.canvas.addEventListener('mouseleave', () => {
                    this.targetHover = 0;
                });
                
                // 觸控事件（手機端）
                this.canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const rect = this.canvas.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = touch.clientX - rect.left;
                    const y = touch.clientY - rect.top;
                    this.updateHoverState(x, y, rect.width, rect.height);
                });
                
                this.canvas.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    const rect = this.canvas.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = touch.clientX - rect.left;
                    const y = touch.clientY - rect.top;
                    this.updateHoverState(x, y, rect.width, rect.height);
                });
                
                this.canvas.addEventListener('touchend', () => {
                    this.targetHover = 0;
                });
                
                this.canvas.addEventListener('touchcancel', () => {
                    this.targetHover = 0;
                });
                
                window.addEventListener('resize', () => {
                    this.resize();
                });
            }
            
            updateHoverState(x, y, width, height) {
                const size = Math.min(width, height);
                const centerX = width / 2;
                const centerY = height / 2;
                const uvX = ((x - centerX) / size) * 2.0;
                const uvY = ((y - centerY) / size) * 2.0;
                
                if (Math.sqrt(uvX * uvX + uvY * uvY) < 0.8) {
                    this.targetHover = 1;
                } else {
                    this.targetHover = 0;
                }
            }

            animate() {
                const gl = this.gl;
                const currentTime = performance.now();
                const dt = (currentTime - this.lastTime) * 0.001;
                this.lastTime = currentTime;
                
                // 更新uniforms
                gl.uniform1f(this.uniforms.iTime, currentTime * 0.001);
                gl.uniform1f(this.uniforms.hue, this.config.hue);
                gl.uniform1f(this.uniforms.hoverIntensity, this.config.hoverIntensity);
                
                // 更新hover狀態
                const effectiveHover = this.config.forceHoverState ? 1 : this.targetHover;
                this.currentHover += (effectiveHover - this.currentHover) * 0.08;
                gl.uniform1f(this.uniforms.hover, this.currentHover);
                
                // 更新旋轉
                if (this.config.rotateOnHover && effectiveHover > 0.5) {
                    this.currentRot += dt * this.rotationSpeed;
                }
                gl.uniform1f(this.uniforms.rot, this.currentRot);
                
                // 渲染
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                
                requestAnimationFrame(() => this.animate());
            }
        }

        // 初始化Orb
        document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('orbCanvas');
            if (canvas) {
                new Orb(canvas, orbConfig);
            }
        });

        // 打字機效果實現
        class Typewriter {
            constructor(element, text, options = {}) {
                this.element = element;
                this.text = text;
                this.currentCharIndex = 0;
                this.isDeleting = false;
                
                // 預設選項
                this.options = {
                    typeSpeed: options.typeSpeed || 100,
                    deleteSpeed: options.deleteSpeed || 50,
                    waitTime: options.waitTime || 2000,
                    loop: options.loop !== false,
                    ...options
                };
                
                this.start();
            }
            
            start() {
                this.type();
            }
            
            type() {
                if (this.isDeleting) {
                    // 刪除模式
                    this.currentCharIndex--;
                    this.element.textContent = this.text.substring(0, this.currentCharIndex);
                    
                    if (this.currentCharIndex === 0) {
                        this.isDeleting = false;
                        setTimeout(() => this.type(), 800);
                        return;
                    }
                    
                    setTimeout(() => this.type(), this.options.deleteSpeed);
                } else {
                    // 打字模式
                    this.currentCharIndex++;
                    this.element.textContent = this.text.substring(0, this.currentCharIndex);
                    
                    if (this.currentCharIndex === this.text.length) {
                        // 完成當前文字
                        if (this.options.loop) {
                            setTimeout(() => {
                                this.isDeleting = true;
                                this.type();
                            }, this.options.waitTime);
                        }
                        return;
                    }
                    
                    // 隨機化打字速度，使其更自然
                    const randomDelay = this.options.typeSpeed + Math.random() * 30;
                    setTimeout(() => this.type(), randomDelay);
                }
            }
        }
        
        // 頁面載入完成後啟動打字機效果
        document.addEventListener('DOMContentLoaded', () => {
            const typewriterElement = document.getElementById('typewriterText');
            
            if (typewriterElement) {
                // 將兩行文字合併為一個字串，用換行符分隔
                const fullText = "NoteQ智能學習平台\n學習更有效率，筆記更有條理";
                
                new Typewriter(typewriterElement, fullText, {
                    typeSpeed: 50,
                    deleteSpeed: 50,
                    waitTime: 1500,
                    loop: true
                });
            }
        });