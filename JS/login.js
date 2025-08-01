const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const loginSection = document.getElementById('loginSection');
        const signupSection = document.getElementById('signupSection');
        const showSignup = document.getElementById('showSignup');
        const showLogin = document.getElementById('showLogin');

        function showLoginForm() {
            loginSection.classList.remove('hidden');
            signupSection.classList.add('hidden');
        }

        function showSignupForm() {
            signupSection.classList.remove('hidden');
            loginSection.classList.add('hidden');
        }

        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });

        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSignupForm();
        });

        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            showSignupForm();
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });

        showLoginForm();
if (window.location.search.includes('signup=1')) {
    showSignupForm();
} else {
    showLoginForm();
}
        // 優化Spline模型載入速度
        document.addEventListener('DOMContentLoaded', function() {
            const splineViewer = document.querySelector('spline-viewer');
            if (splineViewer) {
                // 預先設置容器尺寸，避免重排
                const container = splineViewer.closest('.spline-container');
                if (container) {
                    container.style.minHeight = '600px';
                    container.style.minWidth = '400px';
                }
                
                // 設置載入優化選項
                splineViewer.setAttribute('loading-anim-type', 'none');
                splineViewer.setAttribute('loading-anim-duration', '0');
                
                // 監聽載入完成事件
                splineViewer.addEventListener('load', function() {
                    console.log('Spline model loaded successfully');
                });
                
                // 監聽錯誤事件
                splineViewer.addEventListener('error', function(e) {
                    console.warn('Spline model loading error:', e);
                });
            }
            
            // 密碼顯示/隱藏功能
            const passwordToggles = document.querySelectorAll('.password-toggle');
            passwordToggles.forEach(toggle => {
                toggle.addEventListener('click', function() {
                    const input = this.previousElementSibling;
                    const showIcon = this.querySelector('img[src*="Vector-39"]');
                    const hideIcon = this.querySelector('img[src*="Vector-38"]');
                    
                    if (input.type === 'password') {
                        input.type = 'text';
                        showIcon.classList.add('hidden');
                        hideIcon.classList.remove('hidden');
                    } else {
                        input.type = 'password';
                        hideIcon.classList.add('hidden');
                        showIcon.classList.remove('hidden');
                    }
                });
            });
        });