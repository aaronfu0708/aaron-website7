// 用戶頁面切換功能

// 初始化用戶頁面
function initUserPage() {
}

function switchTab(tabName) {
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => panel.classList.remove('active'));

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    const selectedPanel = document.getElementById(tabName + '-tab');
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }

    const selectedButton = event.target;
    selectedButton.classList.add('active');
}

function changePassword() {
    alert('更改密碼功能即將推出');
}

document.addEventListener('DOMContentLoaded', function() {
    initUserPage();
});
