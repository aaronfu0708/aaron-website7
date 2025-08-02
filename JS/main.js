// 主要JavaScript文件

function toggleMenu() {
  const menuDropdown = document.getElementById('menuDropdown');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const menuButton = document.querySelector('.menu-button');
  
  menuDropdown.classList.toggle('active');
  menuBackdrop.classList.toggle('active');
  menuButton.classList.toggle('active');
  
  if (menuDropdown.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}

function closeMenu() {
  const menuDropdown = document.getElementById('menuDropdown');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const menuButton = document.querySelector('.menu-button');
  
  menuDropdown.classList.remove('active');
  menuBackdrop.classList.remove('active');
  menuButton.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function initMenu() {
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
  
  // 為登出按鈕添加事件監聽器，改善手機版兼容性
  const logoutButtons = document.querySelectorAll('.menu-item[onclick*="logout"]');
  logoutButtons.forEach(button => {
    // 移除內聯onclick事件
    button.removeAttribute('onclick');
    // 添加事件監聽器
    button.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initMenu();

  if (typeof initAnalysis === 'function') {
    initAnalysis();
  }

  initPageSpecific();
  
  // 防止雙擊縮放 - 只針對按鈕和輸入框
  document.addEventListener('touchstart', function(event) {
    const target = event.target;
    const isInteractiveElement = target.tagName === 'BUTTON' || 
                                target.tagName === 'INPUT' || 
                                target.tagName === 'TEXTAREA' || 
                                target.tagName === 'SELECT' ||
                                target.closest('.custom-select') ||
                                target.closest('.menu-button') ||
                                target.closest('.action-item');
    
    if (isInteractiveElement && event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });
});

// 自定義對話框系統
function showCustomAlert(message, callback) {
  const alertModal = document.createElement('div');
  alertModal.className = 'custom-alert-modal';
  alertModal.innerHTML = `
    <div class="custom-alert-content">
      <div class="custom-alert-message">${message}</div>
      <button class="custom-alert-btn" onclick="closeCustomAlert()">確定</button>
    </div>
  `;
  
  document.body.appendChild(alertModal);
  
  // 存儲回調函數
  window.customAlertCallback = callback;
  
  // 禁用背景滾動
  document.body.style.overflow = 'hidden';
  
  // 添加動畫
  setTimeout(() => {
    alertModal.classList.add('active');
  }, 10);
}

function showCustomConfirm(message, onConfirm, onCancel) {
  const confirmModal = document.createElement('div');
  confirmModal.className = 'custom-confirm-modal';
  confirmModal.innerHTML = `
    <div class="custom-confirm-content">
      <div class="custom-confirm-message">${message}</div>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-cancel" onclick="closeCustomConfirm(false)">取消</button>
        <button class="custom-confirm-btn custom-confirm-ok" onclick="closeCustomConfirm(true)">確定</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(confirmModal);
  
  // 存儲回調函數
  window.customConfirmCallbacks = { onConfirm, onCancel };
  
  // 禁用背景滾動
  document.body.style.overflow = 'hidden';
  
  // 添加動畫
  setTimeout(() => {
    confirmModal.classList.add('active');
  }, 10);
}

window.showCustomPrompt = function(title, callback) {
  const promptModal = document.createElement('div');
  promptModal.className = 'custom-prompt-modal';
  promptModal.innerHTML = `
    <div class="custom-prompt-content">
      <div class="custom-prompt-title">${title}</div>
      <input type="text" class="custom-prompt-input" id="customPromptInput" placeholder="請輸入...">
      <div class="custom-prompt-buttons">
        <button class="custom-prompt-btn custom-prompt-btn-secondary" onclick="closeCustomPrompt()">取消</button>
        <button class="custom-prompt-btn custom-prompt-btn-primary" onclick="confirmCustomPrompt()">確定</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(promptModal);
  
  // 存儲回調函數
  window.customPromptCallback = callback;
  
  // 禁用背景滾動
  document.body.style.overflow = 'hidden';
  
  // 添加動畫
  setTimeout(() => {
    promptModal.classList.add('active');
    // 聚焦到輸入框
    const input = document.getElementById('customPromptInput');
    if (input) {
      input.focus();
    }
  }, 10);
}

window.closeCustomPrompt = function() {
  const modal = document.querySelector('.custom-prompt-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      // 恢復背景滾動
      document.body.style.overflow = 'auto';
      if (window.customPromptCallback) {
        window.customPromptCallback(null);
        window.customPromptCallback = null;
      }
    }, 300);
  }
}

window.confirmCustomPrompt = function() {
  const input = document.getElementById('customPromptInput');
  const value = input ? input.value.trim() : '';
  
  const modal = document.querySelector('.custom-prompt-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      // 恢復背景滾動
      document.body.style.overflow = 'auto';
      if (window.customPromptCallback) {
        window.customPromptCallback(value);
        window.customPromptCallback = null;
      }
    }, 300);
  }
}

function closeCustomAlert() {
  const modal = document.querySelector('.custom-alert-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      // 恢復背景滾動
      document.body.style.overflow = 'auto';
      if (window.customAlertCallback) {
        window.customAlertCallback();
        window.customAlertCallback = null;
      }
    }, 300);
  }
}

function closeCustomConfirm(result) {
  const modal = document.querySelector('.custom-confirm-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      // 恢復背景滾動
      document.body.style.overflow = 'auto';
      if (window.customConfirmCallbacks) {
        if (result && window.customConfirmCallbacks.onConfirm) {
          window.customConfirmCallbacks.onConfirm();
        } else if (!result && window.customConfirmCallbacks.onCancel) {
          window.customConfirmCallbacks.onCancel();
        }
        window.customConfirmCallbacks = null;
      }
    }, 300);
  }
}

// 安全的alert和confirm函數 - 直接使用自定義版本
function safeAlert(message, callback) {
  showCustomAlert(message, callback);
}

function safeConfirm(message, onConfirm, onCancel) {
  showCustomConfirm(message, onConfirm, onCancel);
}

function logout() {
  // 使用安全的確認對話框
  safeConfirm('確定要登出嗎？', 
    () => {
      // 清除登入狀態
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      
      // 關閉選單
      closeMenu();
      
      // 使用更可靠的跳轉方式
      try {
        window.location.href = 'index.html';
      } catch (error) {
        // 如果直接跳轉失敗，嘗試其他方式
        window.location.replace('index.html');
      }
    },
    () => {
      // 取消登出，不做任何操作
    }
  );
}

function initPageSpecific() {
  const currentPage = window.location.pathname.split('/').pop();
  
  switch(currentPage) {
    case 'home.html':
    case '':
    case 'index.html':
      if (typeof initHomePage === 'function') {
        initHomePage();
      }
      break;
    case 'note.html':
      break;
    case 'gameover.html':
      break;
  }
}
