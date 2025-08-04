// 遊戲結束頁面功能 JavaScript

// ==================== Markdown 功能 ====================

// 簡單的Markdown解析函數
window.parseMarkdown = function(text) {
    return text
        // 標題
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // 粗體
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // 斜體
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // 程式碼
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // 列表
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        // 分隔線
        .replace(/^---$/gim, '<hr>')
        // 換行
        .replace(/\n/g, '<br>');
}

// 切換內容預覽
window.toggleContentPreview = function(textareaId, previewId) {
    const textarea = document.getElementById(textareaId);
    const preview = document.getElementById(previewId);
    const toggleBtn = textarea.parentElement.querySelector('.content-toggle');
    
    if (preview.classList.contains('active')) {
        preview.classList.remove('active');
        textarea.style.display = 'block';
        toggleBtn.textContent = '完成';
    } else {
        preview.classList.add('active');
        textarea.style.display = 'none';
        toggleBtn.textContent = '編輯';
        updateContentPreview(textareaId, previewId);
    }
};

// 更新內容預覽
window.updateContentPreview = function(textareaId, previewId) {
    const textarea = document.getElementById(textareaId);
    const preview = document.getElementById(previewId);
    
    if (textarea && preview) {
        const content = textarea.value;
        const parsedContent = window.parseMarkdown(content);
        preview.innerHTML = parsedContent;
    }
};

// ==================== 收藏功能 ====================

// 當前選中的主題
let currentFavoriteSubject = "數學";

// 當前要收藏的題目信息
let currentQuestionData = null;
let currentFavoriteNoteId = null; // 選中的筆記ID

// 題目數據（模擬從遊戲結果中獲取）
const questionData = {
    1: {
        question: "判斷101-200之間有多少個質數並輸出所有質數",
        userAnswer: "A10個",
        correctAnswer: "B17個",
        status: "incorrect"
    },
    2: {
        question: "計算1到100的和",
        userAnswer: "5050",
        correctAnswer: "5050",
        status: "correct"
    },
    3: {
        question: "求斐波那契數列第10項",
        userAnswer: "34",
        correctAnswer: "55",
        status: "incorrect"
    },
    4: {
        question: "判斷一個數是否為回文數",
        userAnswer: "是",
        correctAnswer: "是",
        status: "correct"
    },
    5: {
        question: "求最大公約數",
        userAnswer: "6",
        correctAnswer: "12",
        status: "incorrect"
    }
};

// 打開收藏模態框
window.openFavoriteModal = function(button, questionNumber) {
    // 獲取題目數據
    const question = questionData[questionNumber];
    if (!question) {
        console.error('找不到題目數據:', questionNumber);
        return;
    }

    // 設置當前題目數據
    currentQuestionData = {
        number: questionNumber,
        ...question
    };

    // 更新模態框中的題目內容
    const questionTextElement = document.getElementById('favoriteQuestionText');
    const questionPreviewElement = document.getElementById('favoriteQuestionPreview');
    if (questionTextElement && questionPreviewElement) {
        const fullQuestionContent = `# ${question.question}

**您的答案：** ${question.userAnswer}
**正確答案：** ${question.correctAnswer}`;
        questionTextElement.value = fullQuestionContent;
        
        // 初始化為預覽模式
        questionTextElement.style.display = 'none';
        questionPreviewElement.classList.add('active');
        updateContentPreview('favoriteQuestionText', 'favoriteQuestionPreview');
        
        // 設置按鈕文字為編輯
        const toggleBtn = questionTextElement.parentElement.querySelector('.content-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '編輯';
        }
    }

    // 設置默認筆記標題
    const noteTitleElement = document.getElementById('favorite-note-title');
    if (noteTitleElement) {
        noteTitleElement.value = `收藏題目 - 第${questionNumber}題`;
    }

    // 更新主題選擇器
    updateFavoriteSubjectSelect();
    
    // 更新筆記選擇器
    updateFavoriteNoteSelect();
    
    // 根據當前選擇的筆記選項自動顯示或隱藏標題輸入框
    const noteTitleInput = document.getElementById('favorite-note-title-input');
    if (noteTitleInput) {
        if (currentFavoriteNoteId === 'add_note') {
            noteTitleInput.style.display = 'block';
        } else {
            noteTitleInput.style.display = 'none';
        }
    }

    // 顯示模態框
    const modal = document.getElementById('favoriteModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 添加點擊背景關閉功能
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeFavoriteModal();
        }
    });

    // 添加 ESC 鍵關閉功能
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeFavoriteModal();
        }
    });
}

// 關閉收藏模態框
window.closeFavoriteModal = function() {
    const modal = document.getElementById('favoriteModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // 清空筆記標題輸入欄位
    const noteTitleElement = document.getElementById('favorite-note-title');
    if (noteTitleElement) {
        noteTitleElement.value = '';
    }
    
    // 重置數據
    currentQuestionData = null;
    currentFavoriteSubject = "數學";
    currentFavoriteNoteId = null;
}

// 更新收藏主題選擇器
function updateFavoriteSubjectSelect() {
    const dropdown = document.getElementById('favorite-custom-dropdown');
    const selectedText = document.getElementById('favorite-selected-option-text');
    
    if (dropdown && selectedText) {
        dropdown.innerHTML = '';
        
        // 添加主題選項
        const subjects = window.subjects || ["數學", "英文", "程式設計", "物理"];
        
        subjects.forEach(subject => {
            const option = document.createElement('button');
            option.className = 'favorite-dropdown-option';
            option.dataset.value = subject;
            if (subject === currentFavoriteSubject) {
                option.classList.add('selected');
            }
            
            option.innerHTML = `
                <span class="favorite-option-text">${subject}</span>
            `;
            
            // 添加點擊事件
            option.addEventListener('click', function(e) {
                selectFavoriteOption(subject, subject);
            });
            
            dropdown.appendChild(option);
        });
        
        // 添加分隔線
        const separator = document.createElement('div');
        separator.style.cssText = 'height: 1px; background-color: #eee; margin: 8px 16px;';
        dropdown.appendChild(separator);
        
        // 添加新增主題選項
        const addOption = document.createElement('button');
        addOption.className = 'favorite-dropdown-option';
        addOption.dataset.value = 'add_subject';
        addOption.innerHTML = `
            <span class="favorite-option-text">新增主題</span>
        `;
        addOption.onclick = function(e) {
            e.stopPropagation();
            addNewFavoriteSubject();
            document.getElementById('favorite-custom-dropdown').classList.remove('active');
        };
        
        dropdown.appendChild(addOption);
        
        // 更新選中的文字
        selectedText.textContent = currentFavoriteSubject;
    }
}

// 切換收藏下拉選單
window.toggleFavoriteDropdown = function() {
    const dropdown = document.getElementById('favorite-custom-dropdown');
    const arrow = document.querySelector('.favorite-select-arrow');
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        
        // 旋轉箭頭
        if (arrow) {
            arrow.style.transform = dropdown.classList.contains('active') 
                ? 'translateY(-50%) rotate(180deg)' 
                : 'translateY(-50%) rotate(0deg)';
        }
        
        // 如果下拉選單打開，添加點擊外部關閉的事件
        if (dropdown.classList.contains('active')) {
            setTimeout(() => {
                document.addEventListener('click', closeFavoriteDropdownOnClickOutside);
            }, 0);
        }
    }
}

// 點擊外部關閉收藏下拉選單
function closeFavoriteDropdownOnClickOutside(event) {
    const dropdown = document.getElementById('favorite-custom-dropdown');
    const selectContainer = document.querySelector('.favorite-custom-select-container');
    
    if (dropdown && dropdown.classList.contains('active') && 
        !selectContainer.contains(event.target)) {
        dropdown.classList.remove('active');
        const arrow = document.querySelector('.favorite-select-arrow');
        if (arrow) {
            arrow.style.transform = 'translateY(-50%) rotate(0deg)';
        }
        document.removeEventListener('click', closeFavoriteDropdownOnClickOutside);
    }
}

// 切換收藏筆記下拉選單
window.toggleFavoriteNoteDropdown = function() {
    const dropdown = document.getElementById('favorite-note-dropdown');
    const arrow = document.querySelector('.favorite-note-select-arrow');
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        
        // 旋轉箭頭
        if (arrow) {
            arrow.style.transform = dropdown.classList.contains('active') 
                ? 'translateY(-50%) rotate(180deg)' 
                : 'translateY(-50%) rotate(0deg)';
        }
        
        // 如果下拉選單打開，添加點擊外部關閉的事件
        if (dropdown.classList.contains('active')) {
            setTimeout(() => {
                document.addEventListener('click', closeFavoriteNoteDropdownOnClickOutside);
            }, 0);
        }
    }
}

// 點擊外部關閉收藏筆記下拉選單
function closeFavoriteNoteDropdownOnClickOutside(event) {
    const dropdown = document.getElementById('favorite-note-dropdown');
    const selectContainer = document.querySelector('.favorite-note-select-container');
    
    if (dropdown && dropdown.classList.contains('active') && 
        !selectContainer.contains(event.target)) {
        dropdown.classList.remove('active');
        const arrow = document.querySelector('.favorite-note-select-arrow');
        if (arrow) {
            arrow.style.transform = 'translateY(-50%) rotate(0deg)';
        }
        document.removeEventListener('click', closeFavoriteNoteDropdownOnClickOutside);
    }
}

// 更新收藏筆記選擇器
function updateFavoriteNoteSelect() {
    const dropdown = document.getElementById('favorite-note-dropdown');
    const selectedText = document.getElementById('favorite-selected-note-text');
    
    if (dropdown && selectedText) {
        dropdown.innerHTML = '';
        
        // 添加現有筆記選項
        const notes = window.notes || [];
        const filteredNotes = notes.filter(note => note.subject === currentFavoriteSubject);
        
        // 設置默認選中的筆記
        if (filteredNotes.length > 0 && currentFavoriteNoteId === null) {
            // 如果沒有選中的筆記，默認選中第一篇
            currentFavoriteNoteId = filteredNotes[0].id;
        } else if (filteredNotes.length === 0) {
            // 如果沒有筆記，默認選中新增筆記
            currentFavoriteNoteId = 'add_note';
        }
        
        if (filteredNotes.length > 0) {
            filteredNotes.forEach(note => {
                const option = document.createElement('button');
                option.className = 'favorite-note-dropdown-option';
                option.dataset.value = note.id;
                option.dataset.noteId = note.id;
                
                if (note.id === currentFavoriteNoteId) {
                    option.classList.add('selected');
                }
                
                // 截取筆記標題，避免過長
                const title = note.title.length > 20 ? note.title.substring(0, 20) + '...' : note.title;
                
                option.innerHTML = `
                    <span class="favorite-note-option-text">${title}</span>
                `;
                
                option.addEventListener('click', function(e) {
                    selectFavoriteNoteOption(note.id, title);
                });
                
                dropdown.appendChild(option);
            });
        } else {
            // 如果沒有筆記，顯示提示
            const noNoteOption = document.createElement('div');
            noNoteOption.style.cssText = 'padding: 14px 18px; color: #999; text-align: center;';
            noNoteOption.textContent = '該主題下暫無筆記';
            dropdown.appendChild(noNoteOption);
        }
        
        // 添加分隔線
        const separator = document.createElement('div');
        separator.style.cssText = 'height: 1px; background-color: #eee; margin: 8px 16px;';
        dropdown.appendChild(separator);
        
        // 添加新增筆記選項（放在最下面）
        const addNoteOption = document.createElement('button');
        addNoteOption.className = 'favorite-note-dropdown-option';
        addNoteOption.dataset.value = 'add_note';
        
        if (currentFavoriteNoteId === 'add_note') {
            addNoteOption.classList.add('selected');
        }
        
        addNoteOption.innerHTML = `
            <span class="favorite-note-option-text">新增筆記</span>
        `;
        addNoteOption.addEventListener('click', function(e) {
            selectFavoriteNoteOption('add_note', '新增筆記');
        });
        dropdown.appendChild(addNoteOption);
        
        // 更新選中的文字
        if (currentFavoriteNoteId === 'add_note') {
            selectedText.textContent = '新增筆記';
        } else {
            const selectedNote = notes.find(note => note.id === currentFavoriteNoteId);
            if (selectedNote) {
                const title = selectedNote.title.length > 20 ? selectedNote.title.substring(0, 20) + '...' : selectedNote.title;
                selectedText.textContent = title;
            } else {
                selectedText.textContent = '新增筆記';
            }
        }
    }
}

// 選擇收藏主題選項
function selectFavoriteOption(value, text) {
    currentFavoriteSubject = value;
    
    // 更新選中的文字
    const selectedText = document.getElementById('favorite-selected-option-text');
    if (selectedText) {
        selectedText.textContent = text;
    }
    
    // 更新選中狀態
    const options = document.querySelectorAll('.favorite-dropdown-option');
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.value === value) {
            option.classList.add('selected');
        }
    });
    
    // 關閉下拉選單
    document.getElementById('favorite-custom-dropdown').classList.remove('active');
    const arrow = document.querySelector('.favorite-select-arrow');
    if (arrow) {
        arrow.style.transform = 'translateY(-50%) rotate(0deg)';
    }
    
    // 重新更新筆記選擇器，因為主題改變了
    updateFavoriteNoteSelect();
    
    // 根據當前選擇的筆記選項自動顯示或隱藏標題輸入框
    const noteTitleInput = document.getElementById('favorite-note-title-input');
    if (noteTitleInput) {
        if (currentFavoriteNoteId === 'add_note') {
            noteTitleInput.style.display = 'block';
        } else {
            noteTitleInput.style.display = 'none';
        }
    }
}

// 選擇收藏筆記選項
function selectFavoriteNoteOption(value, text) {
    currentFavoriteNoteId = value;
    
    // 更新選中的文字
    const selectedText = document.getElementById('favorite-selected-note-text');
    if (selectedText) {
        selectedText.textContent = text;
    }
    
    // 更新選中狀態
    const options = document.querySelectorAll('.favorite-note-dropdown-option');
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.value === value) {
            option.classList.add('selected');
        }
    });
    
    // 控制筆記標題輸入欄位的顯示
    const noteTitleInput = document.getElementById('favorite-note-title-input');
    if (noteTitleInput) {
        if (value === 'add_note') {
            noteTitleInput.style.display = 'block';
        } else {
            noteTitleInput.style.display = 'none';
        }
    }
    
    // 關閉下拉選單
    document.getElementById('favorite-note-dropdown').classList.remove('active');
    const arrow = document.querySelector('.favorite-note-select-arrow');
    if (arrow) {
        arrow.style.transform = 'translateY(-50%) rotate(0deg)';
    }
}

// 新增收藏主題
function addNewFavoriteSubject() {
    if (window.showGameoverCustomPrompt) {
        window.showGameoverCustomPrompt('請輸入新主題名稱：', (newSubject) => {
            if (newSubject && newSubject.trim()) {
                const trimmedSubject = newSubject.trim();
                
                // 檢查是否已存在
                const currentSubjects = window.subjects || ["數學", "英文", "程式設計", "物理"];
                if (currentSubjects.includes(trimmedSubject)) {
                    if (window.showCustomAlert) {
                        window.showCustomAlert('主題已存在！');
                    }
                    return;
                }
                
                // 添加到主題列表
                if (!window.subjects) {
                    window.subjects = ["數學", "英文", "程式設計", "物理"];
                }
                window.subjects.push(trimmedSubject);
                currentFavoriteSubject = trimmedSubject;
                
                // 重新更新選擇器
                updateFavoriteSubjectSelect();
                
                // 重置筆記選擇為新增筆記
                currentFavoriteNoteId = 'add_note';
                
                // 更新筆記選擇器
                updateFavoriteNoteSelect();
                
                // 根據當前選擇的筆記選項自動顯示或隱藏標題輸入框
                const noteTitleInput = document.getElementById('favorite-note-title-input');
                if (noteTitleInput) {
                    if (currentFavoriteNoteId === 'add_note') {
                        noteTitleInput.style.display = 'block';
                    } else {
                        noteTitleInput.style.display = 'none';
                    }
                }
                
                // 顯示下拉選單
                document.getElementById('favorite-custom-dropdown').classList.add('active');
                
                // 顯示成功消息
                if (window.showCustomAlert) {
                    window.showCustomAlert(`主題「${trimmedSubject}」新增成功！`);
                }
            }
        });
    }
}

// 確認收藏
window.confirmFavorite = function() {
    if (!currentQuestionData) {
        if (window.showCustomAlert) {
            window.showCustomAlert('沒有要收藏的題目數據！');
        }
        return;
    }

    try {
        if (currentFavoriteNoteId === 'add_note' || currentFavoriteNoteId === null) {
            // 新增筆記
            const questionTextElement = document.getElementById('favoriteQuestionText');
            const noteTitleElement = document.getElementById('favorite-note-title');
            const noteContent = questionTextElement ? questionTextElement.value : `# ${currentQuestionData.question}
**您的答案：** ${currentQuestionData.userAnswer}
**正確答案：** ${currentQuestionData.correctAnswer}`;

            // 獲取用戶輸入的標題，如果沒有輸入則使用默認標題
            const userTitle = noteTitleElement ? noteTitleElement.value.trim() : '';
            const noteTitle = userTitle || `收藏題目 - 第${currentQuestionData.number}題`;

            // 創建新的筆記對象
            const newNote = {
                id: Date.now(), // 使用時間戳作為唯一ID
                title: noteTitle,
                content: noteContent,
                subject: currentFavoriteSubject
            };

            // 添加到筆記系統
            if (window.addNoteToSystem) {
                window.addNoteToSystem(newNote);
            } else {
                // 如果 addNoteToSystem 不存在，直接添加到 window.notes
                if (!window.notes) {
                    window.notes = [];
                }
                window.notes.push(newNote);
            }

            // 顯示成功消息
            if (window.showCustomAlert) {
                window.showCustomAlert(`題目已收藏到「${currentFavoriteSubject}」主題！`);
            }
        } else {
            // 添加到現有筆記
            const notes = window.notes || [];
            const targetNote = notes.find(note => note.id === currentFavoriteNoteId);
            
            if (targetNote) {
                // 在現有筆記內容後添加新的內容
                const questionTextElement = document.getElementById('favoriteQuestionText');
                const questionContent = questionTextElement ? questionTextElement.value : `# ${currentQuestionData.question}
**您的答案：** ${currentQuestionData.userAnswer}
**正確答案：** ${currentQuestionData.correctAnswer}`;

                const updatedContent = `${targetNote.content}

---

## 新增題目

${questionContent}`;

                // 更新筆記內容
                targetNote.content = updatedContent;
                
                // 觸發筆記系統的重新渲染
                if (window.renderNotes && typeof window.renderNotes === 'function') {
                    window.renderNotes();
                }
                
                // 顯示成功消息
                if (window.showCustomAlert) {
                    window.showCustomAlert(`題目已添加到筆記「${targetNote.title}」中！`);
                }
            } else {
                if (window.showCustomAlert) {
                    window.showCustomAlert('找不到選中的筆記！');
                }
                return;
            }
        }

        // 關閉模態框
        closeFavoriteModal();
        
    } catch (error) {
        console.error('收藏失敗:', error);
        if (window.showCustomAlert) {
            window.showCustomAlert('收藏失敗，請重試！');
        }
    }
}

// ==================== 解析功能 ====================

// 解析對話框功能
function openAnalysis() {
    document.getElementById('analysisOverlay').classList.add('active');
    document.getElementById('overlayBackdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAnalysis() {
    document.getElementById('analysisOverlay').classList.remove('active');
    document.getElementById('overlayBackdrop').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 解析內容收藏功能
let currentAnalysisContent = "AI的回答在這裡";
let currentAnalysisSubject = "數學";
let currentAnalysisNote = "";
let currentAnalysisNoteId = null; // 選中的筆記ID

// 完整對話收藏功能
let currentAnalysisFullSubject = "數學";
let currentAnalysisFullNoteId = null; // 選中的筆記ID

// 打開解析收藏模態框
window.openAnalysisFavoriteModal = function() {
    // 更新模態框中的內容
    const contentTextElement = document.getElementById('analysisFavoriteContentText');
    const contentPreviewElement = document.getElementById('analysisFavoriteContentPreview');
    if (contentTextElement && contentPreviewElement) {
        // 将内容格式化为 ## 标题格式
        const formattedContent = `## ${currentAnalysisContent}`;
        contentTextElement.value = formattedContent;
        
        // 初始化為預覽模式
        contentTextElement.style.display = 'none';
        contentPreviewElement.classList.add('active');
        updateContentPreview('analysisFavoriteContentText', 'analysisFavoriteContentPreview');
        
        // 設置按鈕文字為編輯
        const toggleBtn = contentTextElement.parentElement.querySelector('.content-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '編輯';
        }
    }
    
    // 設置默認筆記標題
    const noteTitleElement = document.getElementById('analysis-favorite-note-title');
    if (noteTitleElement) {
        noteTitleElement.value = `解析內容收藏 - ${new Date().toLocaleDateString('zh-TW')}`;
    }

    // 更新主題選擇器
    updateAnalysisFavoriteSubjectSelect();
    
    // 更新筆記選擇器
    updateAnalysisFavoriteNoteSelect();
    
    // 根據當前選擇的筆記選項自動顯示或隱藏標題輸入框
    const noteTitleInput = document.getElementById('analysis-favorite-note-title-input');
    if (noteTitleInput) {
        if (currentAnalysisNoteId === 'add_note') {
            noteTitleInput.style.display = 'block';
        } else {
            noteTitleInput.style.display = 'none';
        }
    }
    
    // 顯示模態框
    const modal = document.getElementById('analysisFavoriteModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 添加點擊背景關閉功能
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAnalysisFavoriteModal();
        }
    });
};

// 關閉解析收藏模態框
window.closeAnalysisFavoriteModal = function() {
    const modal = document.getElementById('analysisFavoriteModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // 清空筆記標題輸入欄位
    const noteTitleElement = document.getElementById('analysis-favorite-note-title');
    if (noteTitleElement) {
        noteTitleElement.value = '';
    }
    
    // 重置數據
    currentAnalysisSubject = "數學";
    currentAnalysisNote = "";
    currentAnalysisNoteId = null;
};

// 更新解析收藏主題選擇器
function updateAnalysisFavoriteSubjectSelect() {
    const dropdown = document.getElementById('analysis-favorite-custom-dropdown');
    const selectedText = document.getElementById('analysis-favorite-selected-option-text');
    
    if (dropdown && selectedText) {
        dropdown.innerHTML = '';
        
        // 添加主題選項
        (window.subjects || ["數學", "英文", "程式設計", "物理"]).forEach(subject => {
            const option = document.createElement('button');
            option.className = 'analysis-favorite-dropdown-option';
            option.dataset.value = subject;
            if (subject === currentAnalysisSubject) {
                option.classList.add('selected');
            }
            
            option.innerHTML = `
                <span class="analysis-favorite-option-text">${subject}</span>
            `;
            
            // 添加點擊事件
            option.addEventListener('click', function(e) {
                selectAnalysisFavoriteOption(subject, subject);
            });
            
            dropdown.appendChild(option);
        });
        
        // 添加分隔線
        const separator = document.createElement('div');
        separator.style.cssText = 'height: 1px; background-color: #eee; margin: 8px 16px;';
        dropdown.appendChild(separator);
        
        // 添加新增主題選項
        const addOption = document.createElement('button');
        addOption.className = 'analysis-favorite-dropdown-option';
        addOption.dataset.value = 'add_subject';
        addOption.innerHTML = `
            <span class="analysis-favorite-option-text">新增主題</span>
        `;
        addOption.onclick = function(e) {
            e.stopPropagation();
            addNewAnalysisFavoriteSubject();
            document.getElementById('analysis-favorite-custom-dropdown').classList.remove('active');
        };
        
        dropdown.appendChild(addOption);
        
        // 更新選中的文字
        selectedText.textContent = currentAnalysisSubject;
    }
}

// 更新解析收藏筆記選擇器
function updateAnalysisFavoriteNoteSelect() {
    const dropdown = document.getElementById('analysis-favorite-note-dropdown');
    const selectedText = document.getElementById('analysis-favorite-selected-note-text');
    
    if (dropdown && selectedText) {
        dropdown.innerHTML = '';
        
        // 添加現有筆記選項
        const notes = window.notes || [];
        const filteredNotes = notes.filter(note => note.subject === currentAnalysisSubject);
        
        // 設置默認選中的筆記
        if (filteredNotes.length > 0 && currentAnalysisNoteId === null) {
            // 如果沒有選中的筆記，默認選中第一篇
            currentAnalysisNoteId = filteredNotes[0].id;
        } else if (filteredNotes.length === 0) {
            // 如果沒有筆記，默認選中新增筆記
            currentAnalysisNoteId = 'add_note';
        }
        
        if (filteredNotes.length > 0) {
            filteredNotes.forEach(note => {
                const option = document.createElement('button');
                option.className = 'analysis-favorite-note-dropdown-option';
                option.dataset.value = note.id;
                option.dataset.noteId = note.id;
                
                if (note.id === currentAnalysisNoteId) {
                    option.classList.add('selected');
                }
                
                // 截取筆記標題，避免過長
                const title = note.title.length > 20 ? note.title.substring(0, 20) + '...' : note.title;
                
                option.innerHTML = `
                    <span class="analysis-favorite-note-option-text">${title}</span>
                `;
                
                option.addEventListener('click', function(e) {
                    selectAnalysisFavoriteNoteOption(note.id, title);
                });
                
                dropdown.appendChild(option);
            });
        } else {
            // 如果沒有筆記，顯示提示
            const noNoteOption = document.createElement('div');
            noNoteOption.style.cssText = 'padding: 14px 18px; color: #999; font-style: italic; text-align: center;';
            noNoteOption.textContent = '該主題下暫無筆記';
            dropdown.appendChild(noNoteOption);
        }
        
        // 添加分隔線
        const separator = document.createElement('div');
        separator.style.cssText = 'height: 1px; background-color: #eee; margin: 8px 16px;';
        dropdown.appendChild(separator);
        
        // 添加新增筆記選項（放在最下面）
        const addNoteOption = document.createElement('button');
        addNoteOption.className = 'analysis-favorite-note-dropdown-option';
        addNoteOption.dataset.value = 'add_note';
        
        if (currentAnalysisNoteId === 'add_note') {
            addNoteOption.classList.add('selected');
        }
        
        addNoteOption.innerHTML = `
            <span class="analysis-favorite-note-option-text">新增筆記</span>
        `;
        addNoteOption.addEventListener('click', function(e) {
            selectAnalysisFavoriteNoteOption('add_note', '新增筆記');
        });
        dropdown.appendChild(addNoteOption);
        
        // 更新選中的文字
        if (currentAnalysisNoteId === 'add_note') {
            selectedText.textContent = '新增筆記';
        } else {
            const selectedNote = notes.find(note => note.id === currentAnalysisNoteId);
            if (selectedNote) {
                const title = selectedNote.title.length > 20 ? selectedNote.title.substring(0, 20) + '...' : selectedNote.title;
                selectedText.textContent = title;
            } else {
                selectedText.textContent = '新增筆記';
            }
        }
    }
}

// 切換解析收藏下拉選單
window.toggleAnalysisFavoriteDropdown = function() {
    const dropdown = document.getElementById('analysis-favorite-custom-dropdown');
    const arrow = document.querySelector('.analysis-favorite-select-arrow');
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        
        // 旋轉箭頭
        if (arrow) {
            arrow.style.transform = dropdown.classList.contains('active') 
                ? 'translateY(-50%) rotate(180deg)' 
                : 'translateY(-50%) rotate(0deg)';
        }
        
        // 如果下拉選單打開，添加點擊外部關閉的事件
        if (dropdown.classList.contains('active')) {
            setTimeout(() => {
                document.addEventListener('click', closeAnalysisFavoriteDropdownOnClickOutside);
            }, 0);
        }
    }
};

// 點擊外部關閉解析收藏下拉選單
function closeAnalysisFavoriteDropdownOnClickOutside(event) {
    const dropdown = document.getElementById('analysis-favorite-custom-dropdown');
    const selectContainer = document.querySelector('.analysis-favorite-custom-select-container');
    
    if (dropdown && dropdown.classList.contains('active') && 
        !selectContainer.contains(event.target)) {
        dropdown.classList.remove('active');
        const arrow = document.querySelector('.analysis-favorite-select-arrow');
        if (arrow) {
            arrow.style.transform = 'translateY(-50%) rotate(0deg)';
        }
        document.removeEventListener('click', closeAnalysisFavoriteDropdownOnClickOutside);
    }
}

// 切換解析收藏筆記下拉選單
window.toggleAnalysisFavoriteNoteDropdown = function() {
    const dropdown = document.getElementById('analysis-favorite-note-dropdown');
    const arrow = document.querySelector('.analysis-favorite-note-select-arrow');
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        
        // 旋轉箭頭
        if (arrow) {
            arrow.style.transform = dropdown.classList.contains('active') 
                ? 'translateY(-50%) rotate(180deg)' 
                : 'translateY(-50%) rotate(0deg)';
        }
        
        // 如果下拉選單打開，添加點擊外部關閉的事件
        if (dropdown.classList.contains('active')) {
            setTimeout(() => {
                document.addEventListener('click', closeAnalysisFavoriteNoteDropdownOnClickOutside);
            }, 0);
        }
    }
};

// 點擊外部關閉解析收藏筆記下拉選單
function closeAnalysisFavoriteNoteDropdownOnClickOutside(event) {
    const dropdown = document.getElementById('analysis-favorite-note-dropdown');
    const selectContainer = document.querySelector('.analysis-favorite-note-select-container');
    
    if (dropdown && dropdown.classList.contains('active') && 
        !selectContainer.contains(event.target)) {
        dropdown.classList.remove('active');
        const arrow = document.querySelector('.analysis-favorite-note-select-arrow');
        if (arrow) {
            arrow.style.transform = 'translateY(-50%) rotate(0deg)';
        }
        document.removeEventListener('click', closeAnalysisFavoriteNoteDropdownOnClickOutside);
    }
}

// 選擇解析收藏主題選項
function selectAnalysisFavoriteOption(value, text) {
    currentAnalysisSubject = value;
    
    // 更新選中的文字
    const selectedText = document.getElementById('analysis-favorite-selected-option-text');
    if (selectedText) {
        selectedText.textContent = text;
    }
    
    // 更新選中狀態
    const options = document.querySelectorAll('.analysis-favorite-dropdown-option');
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.value === value) {
            option.classList.add('selected');
        }
    });
    
    // 關閉下拉選單
    document.getElementById('analysis-favorite-custom-dropdown').classList.remove('active');
    const arrow = document.querySelector('.analysis-favorite-select-arrow');
    if (arrow) {
        arrow.style.transform = 'translateY(-50%) rotate(0deg)';
    }
    
    // 重新更新筆記選擇器，因為主題改變了
    updateAnalysisFavoriteNoteSelect();
    
    // 根據當前選擇的筆記選項自動顯示或隱藏標題輸入框
    const noteTitleInput = document.getElementById('analysis-favorite-note-title-input');
    if (noteTitleInput) {
        if (currentAnalysisNoteId === 'add_note') {
            noteTitleInput.style.display = 'block';
        } else {
            noteTitleInput.style.display = 'none';
        }
    }
}

// 選擇解析收藏筆記選項
function selectAnalysisFavoriteNoteOption(value, text) {
    currentAnalysisNoteId = value;
    
    // 更新選中的文字
    const selectedText = document.getElementById('analysis-favorite-selected-note-text');
    if (selectedText) {
        selectedText.textContent = text;
    }
    
    // 更新選中狀態
    const options = document.querySelectorAll('.analysis-favorite-note-dropdown-option');
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.value === value) {
            option.classList.add('selected');
        }
    });
    
    // 控制筆記標題輸入欄位的顯示
    const noteTitleInput = document.getElementById('analysis-favorite-note-title-input');
    if (noteTitleInput) {
        if (value === 'add_note') {
            noteTitleInput.style.display = 'block';
        } else {
            noteTitleInput.style.display = 'none';
        }
    }
    
    // 關閉下拉選單
    document.getElementById('analysis-favorite-note-dropdown').classList.remove('active');
    const arrow = document.querySelector('.analysis-favorite-note-select-arrow');
    if (arrow) {
        arrow.style.transform = 'translateY(-50%) rotate(0deg)';
    }
}

// 新增解析收藏主題
function addNewAnalysisFavoriteSubject() {
    if (window.showGameoverCustomPrompt) {
        window.showGameoverCustomPrompt('請輸入新主題名稱：', (newSubject) => {
            if (newSubject && newSubject.trim()) {
                const trimmedSubject = newSubject.trim();
                
                // 檢查是否已存在
                const currentSubjects = window.subjects || ["數學", "英文", "程式設計", "物理"];
                if (currentSubjects.includes(trimmedSubject)) {
                    if (window.showCustomAlert) {
                        window.showCustomAlert('主題已存在！');
                    }
                    return;
                }
                
                // 添加到主題列表
                if (!window.subjects) {
                    window.subjects = ["數學", "英文", "程式設計", "物理"];
                }
                window.subjects.push(trimmedSubject);
                currentAnalysisSubject = trimmedSubject;
                
                // 重新更新選擇器
                updateAnalysisFavoriteSubjectSelect();
                
                // 重置筆記選擇為新增筆記
                currentAnalysisNoteId = 'add_note';
                
                // 更新筆記選擇器
                updateAnalysisFavoriteNoteSelect();
                
                // 根據當前選擇的筆記選項自動顯示或隱藏標題輸入框
                const noteTitleInput = document.getElementById('analysis-favorite-note-title-input');
                if (noteTitleInput) {
                    if (currentAnalysisNoteId === 'add_note') {
                        noteTitleInput.style.display = 'block';
                    } else {
                        noteTitleInput.style.display = 'none';
                    }
                }
                
                // 顯示下拉選單
                document.getElementById('analysis-favorite-custom-dropdown').classList.add('active');
                
                // 顯示成功消息
                if (window.showCustomAlert) {
                    window.showCustomAlert(`新主題「${trimmedSubject}」已創建！`);
                }
            }
        });
    }
}

// 確認解析收藏
window.confirmAnalysisFavorite = function() {
    if (!currentAnalysisContent) {
        if (window.showCustomAlert) {
            window.showCustomAlert('沒有要收藏的內容！');
        }
        return;
    }

    if (currentAnalysisNoteId === 'add_note' || currentAnalysisNoteId === null) {
        // 新增筆記
        const contentTextElement = document.getElementById('analysisFavoriteContentText');
        const noteTitleElement = document.getElementById('analysis-favorite-note-title');
        const noteContent = contentTextElement ? contentTextElement.value : `## ${currentAnalysisContent}`;

        // 獲取用戶輸入的標題，如果沒有輸入則使用默認標題
        const userTitle = noteTitleElement ? noteTitleElement.value.trim() : '';
        const noteTitle = userTitle || `解析內容收藏 - ${new Date().toLocaleDateString('zh-TW')}`;

        // 創建新的筆記對象
        const newNote = {
            id: Date.now(),
            title: noteTitle,
            content: noteContent,
            subject: currentAnalysisSubject
        };

        // 添加到筆記系統
        if (window.addNoteToSystem) {
            window.addNoteToSystem(newNote);
        } else {
            // 如果 addNoteToSystem 不存在，直接添加到 window.notes
            if (!window.notes) {
                window.notes = [];
            }
            window.notes.push(newNote);
        }

        // 顯示成功消息
        if (window.showCustomAlert) {
            window.showCustomAlert(`內容已收藏到「${currentAnalysisSubject}」主題！`);
        }
    } else {
        // 添加到現有筆記
        const notes = window.notes || [];
        const targetNote = notes.find(note => note.id === currentAnalysisNoteId);
        
        if (targetNote) {
            // 在現有筆記內容後添加新的內容
            const contentTextElement = document.getElementById('analysisFavoriteContentText');
            const content = contentTextElement ? contentTextElement.value : `## ${currentAnalysisContent}`;
            
            const updatedContent = `${targetNote.content}

---

## 新增內容

${content}`;

            // 更新筆記內容
            targetNote.content = updatedContent;
            
            // 顯示成功消息
            if (window.showCustomAlert) {
                window.showCustomAlert(`內容已添加到筆記「${targetNote.title}」中！`);
            }
        } else {
            if (window.showCustomAlert) {
                window.showCustomAlert('找不到選中的筆記！');
            }
            return;
        }
    }

    // 關閉模態框
    closeAnalysisFavoriteModal();
};

// ==================== 通用功能 ====================

// 添加筆記到系統（如果還沒有定義）
if (!window.addNoteToSystem) {
    window.addNoteToSystem = function(note) {
        try {
            // 檢查是否已經存在相同的筆記（基於內容和主題）
            const existingNote = window.notes ? window.notes.find(n => 
                n.content.includes(note.content.split('\n')[0]) && 
                n.subject === (note.subject || currentFavoriteSubject)
            ) : null;
            
            if (existingNote) {
                if (window.showCustomAlert) {
                    window.showCustomAlert('此內容已經收藏過了！');
                }
                return;
            }
            
            // 如果 window.notes 不存在，創建它
            if (!window.notes) {
                window.notes = [];
            }
            
            // 添加新筆記
            window.notes.push(note);
            
            // 同步主題數據
            const noteSubject = note.subject || currentFavoriteSubject;
            if (!window.subjects) {
                window.subjects = ["數學", "英文", "程式設計", "物理"];
            }
            if (!window.subjects.includes(noteSubject)) {
                window.subjects.push(noteSubject);
            }
            
            // 觸發筆記系統的重新渲染（如果存在）
            if (window.renderNotes && typeof window.renderNotes === 'function') {
                window.renderNotes();
            }
            
            // 觸發主題選擇器的更新（如果存在）
            if (window.updateSubjectSelect && typeof window.updateSubjectSelect === 'function') {
                window.updateSubjectSelect();
            }

        } catch (error) {
            console.error('添加筆記失敗:', error);
            if (window.showCustomAlert) {
                window.showCustomAlert('保存失敗，請重試！');
            }
        }
    };
}

// 顯示收藏成功消息
window.showFavoriteSuccess = function(subject) {
    if (window.showCustomAlert) {
        window.showCustomAlert(`內容已收藏到「${subject || currentFavoriteSubject || '未知'}」主題！`);
    }
}

// 自定義提示模態框
if (!window.showCustomAlert) {
    window.showCustomAlert = function(message) {
        const modal = document.getElementById('customAlertModal');
        const messageElement = document.getElementById('customAlertMessage');
        
        if (modal && messageElement) {
            messageElement.textContent = message;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
}

window.closeCustomAlert = function() {
    const modal = document.getElementById('customAlertModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// ==================== 自定義模態框功能 ====================

// 自定義輸入模態框
let gameoverCustomPromptCallback = null;

window.showGameoverCustomPrompt = function(title, callback) {
    const modal = document.getElementById('customPromptModal');
    const titleElement = document.getElementById('customPromptTitle');
    const inputElement = document.getElementById('customPromptInput');
    
    if (modal && titleElement && inputElement) {
        titleElement.textContent = title;
        inputElement.value = '';
        gameoverCustomPromptCallback = callback;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 聚焦到輸入框
        setTimeout(() => {
            inputElement.focus();
        }, 100);
    }
}

window.closeGameoverCustomPrompt = function() {
    const modal = document.getElementById('customPromptModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (gameoverCustomPromptCallback) {
            gameoverCustomPromptCallback(null);
            gameoverCustomPromptCallback = null;
        }
    }
}

window.confirmGameoverCustomPrompt = function() {
    const inputElement = document.getElementById('customPromptInput');
    const value = inputElement ? inputElement.value.trim() : '';
    
    if (gameoverCustomPromptCallback) {
        gameoverCustomPromptCallback(value);
        gameoverCustomPromptCallback = null;
    }
    
    closeGameoverCustomPrompt();
}

// ==================== 初始化功能 ====================

function initAnalysis() {
    const overlayBackdrop = document.getElementById('overlayBackdrop');
    if (overlayBackdrop) {
        overlayBackdrop.addEventListener('click', closeAnalysis);
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAnalysis();
            closeAnalysisFavoriteModal();
        }
    });
}

// 頁面加載完成後初始化
function initGameoverSystem() {
    // 延遲初始化，確保筆記系統已加載
    setTimeout(() => {
        syncSubjectsWithNoteSystem();
    }, 100);
    
    // 添加鍵盤事件監聽
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeCustomAlert();
            closeGameoverCustomPrompt();
        } else if (event.key === 'Enter') {
            const promptModal = document.getElementById('customPromptModal');
            if (promptModal && promptModal.classList.contains('active')) {
                confirmGameoverCustomPrompt();
            }
        }
    });
}

// 同步主題數據
let syncAttempts = 0;
const maxSyncAttempts = 10;

function syncSubjectsWithNoteSystem() {
    // 防止無限遞迴
    if (syncAttempts >= maxSyncAttempts) {
        return;
    }
    
    syncAttempts++;
    
    // 確保筆記系統的數據是最新的
    if (window.notes && Array.isArray(window.notes)) {
        // 筆記數據同步成功
    }
    
    if (window.subjects && Array.isArray(window.subjects)) {
        // 主題數據同步成功
    }
    
    // 如果筆記系統還沒有初始化，等待一下再同步
    if (!window.notes || !window.subjects) {
        setTimeout(syncSubjectsWithNoteSystem, 200);
    } else {
        // 同步成功，重置計數器
        syncAttempts = 0;
    }
}

// ==================== 完整對話收藏功能 ====================

// 打開完整對話收藏模態框
window.openAnalysisFullFavoriteModal = function() {
    // 獲取所有對話內容
    const chatMessages = document.querySelector('.chat-messages');
    let fullContent = '';
    
    if (chatMessages) {
        const messages = chatMessages.querySelectorAll('.message');
        messages.forEach((message, index) => {
            if (message.classList.contains('ai')) {
                fullContent += `## ${message.textContent.trim()}\n\n`;
            } else if (message.classList.contains('user')) {
                fullContent += `## ${message.textContent.trim()}\n\n`;
            } else if (message.classList.contains('placeholder')) {
                // 获取placeholder消息的文本内容（排除+图标）
                const textNodes = Array.from(message.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
                const textContent = textNodes.map(node => node.textContent.trim()).join(' ').trim();
                if (textContent) {
                    fullContent += `## ${textContent}\n\n`;
                }
            }
        });
    }
    
    // 更新模態框中的內容
    const contentTextElement = document.getElementById('analysisFullFavoriteContentText');
    const contentPreviewElement = document.getElementById('analysisFullFavoriteContentPreview');
    if (contentTextElement && contentPreviewElement) {
        const formattedContent = fullContent ? `# 完整對話記錄

${fullContent}` : '暫無對話內容';
        contentTextElement.value = formattedContent;
        
        // 初始化為預覽模式
        contentTextElement.style.display = 'none';
        contentPreviewElement.classList.add('active');
        updateContentPreview('analysisFullFavoriteContentText', 'analysisFullFavoriteContentPreview');
        
        // 設置按鈕文字為編輯
        const toggleBtn = contentTextElement.parentElement.querySelector('.content-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '編輯';
        }
    }
    
    // 設置默認筆記標題
    const noteTitleElement = document.getElementById('analysis-full-favorite-note-title');
    if (noteTitleElement) {
        noteTitleElement.value = `完整對話收藏 - ${new Date().toLocaleDateString('zh-TW')}`;
    }

    // 更新主題選擇器
    updateAnalysisFullFavoriteSubjectSelect();
    
    // 更新筆記選擇器
    updateAnalysisFullFavoriteNoteSelect();
    
    // 根據當前選擇的筆記選項自動顯示或隱藏標題輸入框
    const noteTitleInput = document.getElementById('analysis-full-favorite-note-title-input');
    if (noteTitleInput) {
        if (currentAnalysisFullNoteId === 'add_note') {
            noteTitleInput.style.display = 'block';
        } else {
            noteTitleInput.style.display = 'none';
        }
    }
    
    // 顯示模態框
    const modal = document.getElementById('analysisFullFavoriteModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 添加點擊背景關閉功能
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAnalysisFullFavoriteModal();
        }
    });
};

// 關閉完整對話收藏模態框
window.closeAnalysisFullFavoriteModal = function() {
    const modal = document.getElementById('analysisFullFavoriteModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // 清空筆記標題輸入欄位
    const noteTitleElement = document.getElementById('analysis-full-favorite-note-title');
    if (noteTitleElement) {
        noteTitleElement.value = '';
    }
    
    // 重置數據
    currentAnalysisFullSubject = "數學";
    currentAnalysisFullNoteId = null;
};

// 更新完整對話收藏主題選擇器
function updateAnalysisFullFavoriteSubjectSelect() {
    const dropdown = document.getElementById('analysis-full-favorite-custom-dropdown');
    const selectedText = document.getElementById('analysis-full-favorite-selected-option-text');
    
    if (dropdown && selectedText) {
        dropdown.innerHTML = '';
        
        // 添加主題選項
        (window.subjects || ["數學", "英文", "程式設計", "物理"]).forEach(subject => {
            const option = document.createElement('button');
            option.className = 'analysis-full-favorite-dropdown-option';
            option.dataset.value = subject;
            if (subject === currentAnalysisFullSubject) {
                option.classList.add('selected');
            }
            
            option.innerHTML = `
                <span class="analysis-full-favorite-option-text">${subject}</span>
            `;
            
            // 添加點擊事件
            option.addEventListener('click', function(e) {
                selectAnalysisFullFavoriteOption(subject, subject);
            });
            
            dropdown.appendChild(option);
        });
        
        // 添加分隔線
        const separator = document.createElement('div');
        separator.style.cssText = 'height: 1px; background-color: #eee; margin: 8px 16px;';
        dropdown.appendChild(separator);
        
        // 添加新增主題選項
        const addOption = document.createElement('button');
        addOption.className = 'analysis-full-favorite-dropdown-option';
        addOption.dataset.value = 'add_subject';
        addOption.innerHTML = `
            <span class="analysis-full-favorite-option-text">新增主題</span>
        `;
        addOption.onclick = function(e) {
            e.stopPropagation();
            addNewAnalysisFullFavoriteSubject();
            document.getElementById('analysis-full-favorite-custom-dropdown').classList.remove('active');
        };
        
        dropdown.appendChild(addOption);
        
        // 更新選中的文字
        selectedText.textContent = currentAnalysisFullSubject;
    }
}

// 更新完整對話收藏筆記選擇器
function updateAnalysisFullFavoriteNoteSelect() {
    const dropdown = document.getElementById('analysis-full-favorite-note-dropdown');
    const selectedText = document.getElementById('analysis-full-favorite-selected-note-text');
    
    if (dropdown && selectedText) {
        dropdown.innerHTML = '';
        
        // 添加現有筆記選項
        const notes = window.notes || [];
        const filteredNotes = notes.filter(note => note.subject === currentAnalysisFullSubject);
        
        // 設置默認選中的筆記
        if (filteredNotes.length > 0 && currentAnalysisFullNoteId === null) {
            // 如果沒有選中的筆記，默認選中第一篇
            currentAnalysisFullNoteId = filteredNotes[0].id;
        } else if (filteredNotes.length === 0) {
            // 如果沒有筆記，默認選中新增筆記
            currentAnalysisFullNoteId = 'add_note';
        }
        
        if (filteredNotes.length > 0) {
            filteredNotes.forEach(note => {
                const option = document.createElement('button');
                option.className = 'analysis-full-favorite-note-dropdown-option';
                option.dataset.value = note.id;
                option.dataset.noteId = note.id;
                
                if (note.id === currentAnalysisFullNoteId) {
                    option.classList.add('selected');
                }
                
                // 截取筆記標題，避免過長
                const title = note.title.length > 20 ? note.title.substring(0, 20) + '...' : note.title;
                
                option.innerHTML = `
                    <span class="analysis-full-favorite-note-option-text">${title}</span>
                `;
                
                option.addEventListener('click', function(e) {
                    selectAnalysisFullFavoriteNoteOption(note.id, title);
                });
                
                dropdown.appendChild(option);
            });
        } else {
            // 如果沒有筆記，顯示提示
            const noNoteOption = document.createElement('div');
            noNoteOption.style.cssText = 'padding: 14px 18px; color: #999; font-style: italic; text-align: center;';
            noNoteOption.textContent = '該主題下暫無筆記';
            dropdown.appendChild(noNoteOption);
        }
        
        // 添加分隔線
        const separator = document.createElement('div');
        separator.style.cssText = 'height: 1px; background-color: #eee; margin: 8px 16px;';
        dropdown.appendChild(separator);
        
        // 添加新增筆記選項（放在最下面）
        const addNoteOption = document.createElement('button');
        addNoteOption.className = 'analysis-full-favorite-note-dropdown-option';
        addNoteOption.dataset.value = 'add_note';
        
        if (currentAnalysisFullNoteId === 'add_note') {
            addNoteOption.classList.add('selected');
        }
        
        addNoteOption.innerHTML = `
            <span class="analysis-full-favorite-note-option-text">新增筆記</span>
        `;
        addNoteOption.addEventListener('click', function(e) {
            selectAnalysisFullFavoriteNoteOption('add_note', '新增筆記');
        });
        dropdown.appendChild(addNoteOption);
        
        // 更新選中的文字
        if (currentAnalysisFullNoteId === 'add_note') {
            selectedText.textContent = '新增筆記';
        } else {
            const selectedNote = notes.find(note => note.id === currentAnalysisFullNoteId);
            if (selectedNote) {
                const title = selectedNote.title.length > 20 ? selectedNote.title.substring(0, 20) + '...' : selectedNote.title;
                selectedText.textContent = title;
            } else {
                selectedText.textContent = '新增筆記';
            }
        }
    }
}

// 切換完整對話收藏下拉選單
window.toggleAnalysisFullFavoriteDropdown = function() {
    const dropdown = document.getElementById('analysis-full-favorite-custom-dropdown');
    const arrow = document.querySelector('.analysis-full-favorite-select-arrow');
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        
        // 旋轉箭頭
        if (arrow) {
            arrow.style.transform = dropdown.classList.contains('active') 
                ? 'translateY(-50%) rotate(180deg)' 
                : 'translateY(-50%) rotate(0deg)';
        }
        
        // 如果下拉選單打開，添加點擊外部關閉的事件
        if (dropdown.classList.contains('active')) {
            setTimeout(() => {
                document.addEventListener('click', closeAnalysisFullFavoriteDropdownOnClickOutside);
            }, 0);
        }
    }
};

// 點擊外部關閉完整對話收藏下拉選單
function closeAnalysisFullFavoriteDropdownOnClickOutside(event) {
    const dropdown = document.getElementById('analysis-full-favorite-custom-dropdown');
    const selectContainer = document.querySelector('.analysis-full-favorite-custom-select-container');
    
    if (dropdown && dropdown.classList.contains('active') && 
        !selectContainer.contains(event.target)) {
        dropdown.classList.remove('active');
        const arrow = document.querySelector('.analysis-full-favorite-select-arrow');
        if (arrow) {
            arrow.style.transform = 'translateY(-50%) rotate(0deg)';
        }
        document.removeEventListener('click', closeAnalysisFullFavoriteDropdownOnClickOutside);
    }
}

// 切換完整對話收藏筆記下拉選單
window.toggleAnalysisFullFavoriteNoteDropdown = function() {
    const dropdown = document.getElementById('analysis-full-favorite-note-dropdown');
    const arrow = document.querySelector('.analysis-full-favorite-note-select-arrow');
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        
        // 旋轉箭頭
        if (arrow) {
            arrow.style.transform = dropdown.classList.contains('active') 
                ? 'translateY(-50%) rotate(180deg)' 
                : 'translateY(-50%) rotate(0deg)';
        }
        
        // 如果下拉選單打開，添加點擊外部關閉的事件
        if (dropdown.classList.contains('active')) {
            setTimeout(() => {
                document.addEventListener('click', closeAnalysisFullFavoriteNoteDropdownOnClickOutside);
            }, 0);
        }
    }
};

// 點擊外部關閉完整對話收藏筆記下拉選單
function closeAnalysisFullFavoriteNoteDropdownOnClickOutside(event) {
    const dropdown = document.getElementById('analysis-full-favorite-note-dropdown');
    const selectContainer = document.querySelector('.analysis-full-favorite-note-select-container');
    
    if (dropdown && dropdown.classList.contains('active') && 
        !selectContainer.contains(event.target)) {
        dropdown.classList.remove('active');
        const arrow = document.querySelector('.analysis-full-favorite-note-select-arrow');
        if (arrow) {
            arrow.style.transform = 'translateY(-50%) rotate(0deg)';
        }
        document.removeEventListener('click', closeAnalysisFullFavoriteNoteDropdownOnClickOutside);
    }
}

// 選擇完整對話收藏主題選項
function selectAnalysisFullFavoriteOption(value, text) {
    currentAnalysisFullSubject = value;
    
    // 更新選中的文字
    const selectedText = document.getElementById('analysis-full-favorite-selected-option-text');
    if (selectedText) {
        selectedText.textContent = text;
    }
    
    // 更新選中狀態
    const options = document.querySelectorAll('.analysis-full-favorite-dropdown-option');
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.value === value) {
            option.classList.add('selected');
        }
    });
    
    // 關閉下拉選單
    document.getElementById('analysis-full-favorite-custom-dropdown').classList.remove('active');
    const arrow = document.querySelector('.analysis-full-favorite-select-arrow');
    if (arrow) {
        arrow.style.transform = 'translateY(-50%) rotate(0deg)';
    }
    
    // 重新更新筆記選擇器，因為主題改變了
    updateAnalysisFullFavoriteNoteSelect();
    
    // 根據當前選擇的筆記選項自動顯示或隱藏標題輸入框
    const noteTitleInput = document.getElementById('analysis-full-favorite-note-title-input');
    if (noteTitleInput) {
        if (currentAnalysisFullNoteId === 'add_note') {
            noteTitleInput.style.display = 'block';
        } else {
            noteTitleInput.style.display = 'none';
        }
    }
}

// 選擇完整對話收藏筆記選項
function selectAnalysisFullFavoriteNoteOption(value, text) {
    currentAnalysisFullNoteId = value;
    
    // 更新選中的文字
    const selectedText = document.getElementById('analysis-full-favorite-selected-note-text');
    if (selectedText) {
        selectedText.textContent = text;
    }
    
    // 更新選中狀態
    const options = document.querySelectorAll('.analysis-full-favorite-note-dropdown-option');
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.value === value) {
            option.classList.add('selected');
        }
    });
    
    // 控制筆記標題輸入欄位的顯示
    const noteTitleInput = document.getElementById('analysis-full-favorite-note-title-input');
    if (noteTitleInput) {
        if (value === 'add_note') {
            noteTitleInput.style.display = 'block';
        } else {
            noteTitleInput.style.display = 'none';
        }
    }
    
    // 關閉下拉選單
    document.getElementById('analysis-full-favorite-note-dropdown').classList.remove('active');
    const arrow = document.querySelector('.analysis-full-favorite-note-select-arrow');
    if (arrow) {
        arrow.style.transform = 'translateY(-50%) rotate(0deg)';
    }
}

// 新增完整對話收藏主題
function addNewAnalysisFullFavoriteSubject() {
    if (window.showGameoverCustomPrompt) {
        window.showGameoverCustomPrompt('請輸入新主題名稱：', (newSubject) => {
            if (newSubject && newSubject.trim()) {
                const trimmedSubject = newSubject.trim();
                
                // 檢查是否已存在
                const currentSubjects = window.subjects || ["數學", "英文", "程式設計", "物理"];
                if (currentSubjects.includes(trimmedSubject)) {
                    if (window.showCustomAlert) {
                        window.showCustomAlert('主題已存在！');
                    }
                    return;
                }
                
                // 添加到主題列表
                if (!window.subjects) {
                    window.subjects = ["數學", "英文", "程式設計", "物理"];
                }
                window.subjects.push(trimmedSubject);
                currentAnalysisFullSubject = trimmedSubject;
                
                // 重新更新選擇器
                updateAnalysisFullFavoriteSubjectSelect();
                
                // 重置筆記選擇為新增筆記
                currentAnalysisFullNoteId = 'add_note';
                
                // 更新筆記選擇器
                updateAnalysisFullFavoriteNoteSelect();
                
                // 根據當前選擇的筆記選項自動顯示或隱藏標題輸入框
                const noteTitleInput = document.getElementById('analysis-full-favorite-note-title-input');
                if (noteTitleInput) {
                    if (currentAnalysisFullNoteId === 'add_note') {
                        noteTitleInput.style.display = 'block';
                    } else {
                        noteTitleInput.style.display = 'none';
                    }
                }
                
                // 顯示下拉選單
                document.getElementById('analysis-full-favorite-custom-dropdown').classList.add('active');
                
                // 顯示成功消息
                if (window.showCustomAlert) {
                    window.showCustomAlert(`新主題「${trimmedSubject}」已創建！`);
                }
            }
        });
    }
}

// 確認完整對話收藏
window.confirmAnalysisFullFavorite = function() {
    // 獲取所有對話內容
    const chatMessages = document.querySelector('.chat-messages');
    let fullContent = '';
    
    if (chatMessages) {
        const messages = chatMessages.querySelectorAll('.message');
        messages.forEach((message, index) => {
            if (message.classList.contains('ai')) {
                fullContent += `## ${message.textContent.trim()}\n\n`;
            } else if (message.classList.contains('user')) {
                fullContent += `## ${message.textContent.trim()}\n\n`;
            } else if (message.classList.contains('placeholder')) {
                // 获取placeholder消息的文本内容（排除+图标）
                const textNodes = Array.from(message.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
                const textContent = textNodes.map(node => node.textContent.trim()).join(' ').trim();
                if (textContent) {
                    fullContent += `## ${textContent}\n\n`;
                }
            }
        });
    }
    
    if (!fullContent.trim()) {
        if (window.showCustomAlert) {
            window.showCustomAlert('沒有要收藏的對話內容！');
        }
        return;
    }

    if (currentAnalysisFullNoteId === 'add_note' || currentAnalysisFullNoteId === null) {
        // 新增筆記
        const contentTextElement = document.getElementById('analysisFullFavoriteContentText');
        const noteTitleElement = document.getElementById('analysis-full-favorite-note-title');
        const noteContent = contentTextElement ? contentTextElement.value : `# 完整對話記錄

${fullContent}`;

        // 獲取用戶輸入的標題，如果沒有輸入則使用默認標題
        const userTitle = noteTitleElement ? noteTitleElement.value.trim() : '';
        const noteTitle = userTitle || `完整對話收藏 - ${new Date().toLocaleDateString('zh-TW')}`;

        // 創建新的筆記對象
        const newNote = {
            id: Date.now(),
            title: noteTitle,
            content: noteContent,
            subject: currentAnalysisFullSubject
        };

        // 添加到筆記系統
        if (window.addNoteToSystem) {
            window.addNoteToSystem(newNote);
        } else {
            // 如果 addNoteToSystem 不存在，直接添加到 window.notes
            if (!window.notes) {
                window.notes = [];
            }
            window.notes.push(newNote);
        }

        // 顯示成功消息
        if (window.showCustomAlert) {
            window.showCustomAlert(`完整對話已收藏到「${currentAnalysisFullSubject}」主題！`);
        }
    } else {
        // 添加到現有筆記
        const notes = window.notes || [];
        const targetNote = notes.find(note => note.id === currentAnalysisFullNoteId);
        
        if (targetNote) {
            // 在現有筆記內容後添加新的內容
            const contentTextElement = document.getElementById('analysisFullFavoriteContentText');
            const content = contentTextElement ? contentTextElement.value : fullContent;
            
            const updatedContent = `${targetNote.content}

---

## 新增完整對話

${content}`;

            // 更新筆記內容
            targetNote.content = updatedContent;
            
            // 顯示成功消息
            if (window.showCustomAlert) {
                window.showCustomAlert(`完整對話已添加到筆記「${targetNote.title}」中！`);
            }
        } else {
            if (window.showCustomAlert) {
                window.showCustomAlert('找不到選中的筆記！');
            }
            return;
        }
    }

    // 關閉模態框
    closeAnalysisFullFavoriteModal();
};

// 如果頁面已經加載完成，立即初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initAnalysis();
        initGameoverSystem();
        initQuestionsScrollStack();
    });
} else {
    // 頁面已經加載完成，立即初始化
    initAnalysis();
    initGameoverSystem();
    initQuestionsScrollStack();
}

// ==================== ScrollStack 功能 ====================

// 初始化題目 ScrollStack
function initQuestionsScrollStack() {
    const questionsGrid = document.getElementById('details').querySelector('.questions-grid');
    if (!questionsGrid) return;

    // 檢查是否為手機版
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // 處理視窗大小變化
    function handleResize() {
        if (isMobile()) {
            renderQuestionsWithScrollStack(questionsGrid);
        } else {
            // 桌面版恢復正常顯示
            cleanupScrollStack(questionsGrid);
        }
    }

    // 初始檢查
    handleResize();

    // 監聽視窗大小變化
    window.addEventListener('resize', handleResize);
}

// 手機版 ScrollStack 渲染
function renderQuestionsWithScrollStack(container) {
    if (!container) return;

    // 清理之前的 ScrollStack
    cleanupScrollStack(container);

    // 清理之前的 ScrollStack 清理函數
    if (container._scrollStackCleanup && typeof container._scrollStackCleanup === 'function') {
        container._scrollStackCleanup();
        container._scrollStackCleanup = null;
    }

    // 獲取所有題目卡片
    const questionCards = Array.from(container.querySelectorAll('.question-card'));
    if (questionCards.length === 0) return;

    // 創建 ScrollStack 容器
    const scrollStackContainer = document.createElement('div');
    scrollStackContainer.className = 'scroll-stack-container';

    // 將每個題目卡片轉換為 scroll-stack-card
    questionCards.forEach((card, index) => {
        const scrollStackCard = card.cloneNode(true);
        scrollStackCard.className = 'scroll-stack-card';
        
        // 重新綁定事件處理器
        const favoriteBtn = scrollStackCard.querySelector('.btn-favorite');
        const analysisBtn = scrollStackCard.querySelector('.btn-analysis');
        
        if (favoriteBtn) {
            favoriteBtn.onclick = function() {
                openFavoriteModal(this, index + 1);
            };
        }
        
        if (analysisBtn) {
            analysisBtn.onclick = function() {
                openAnalysis();
            };
        }
        
        scrollStackContainer.appendChild(scrollStackCard);
    });

    // 添加結束標記
    const endMarker = document.createElement('div');
    endMarker.className = 'scroll-stack-end';
    scrollStackContainer.appendChild(endMarker);

    container.appendChild(scrollStackContainer);

    // 初始化 ScrollStack 效果並保存清理函數
    container._scrollStackCleanup = initScrollStack(container);
}

// 清理 ScrollStack
function cleanupScrollStack(container) {
    if (!container) return;

    // 移除 ScrollStack 容器
    const scrollStackContainer = container.querySelector('.scroll-stack-container');
    if (scrollStackContainer) {
        scrollStackContainer.remove();
    }

    // 清理清理函數
    if (container._scrollStackCleanup && typeof container._scrollStackCleanup === 'function') {
        container._scrollStackCleanup();
        container._scrollStackCleanup = null;
    }
}

// 初始化 ScrollStack 效果
function initScrollStack(container) {
    if (!container) return;
    
    const scroller = container;
    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));
    
    if (cards.length === 0) return;
    
    // ScrollStack 配置 - 針對手機版優化
    const config = {
        itemDistance: 60,  // 增加卡片間距，減少重疊
        itemScale: 0.02,   // 減少縮放效果，減少晃動
        itemStackDistance: 10,  // 減少堆疊距離，增加重疊效果
        stackPosition: '9%',   // 調整堆疊位置
        scaleEndPosition: '1', // 調整縮放結束位置
        baseScale: 0.9,   // 提高基礎縮放，減少極端變化
        rotationAmount: 0,
        blurAmount: 0
    };
    
    // 設置卡片初始樣式
    cards.forEach((card, i) => {
        if (i < cards.length - 1) {
            card.style.marginBottom = `${config.itemDistance}px`;
        }
        card.style.willChange = 'transform, filter';
        card.style.transformOrigin = 'top center';
        card.style.backfaceVisibility = 'hidden';
        card.style.transform = 'translateZ(0)';
        card.style.webkitTransform = 'translateZ(0)';
        card.style.perspective = '1000px';
        card.style.webkitPerspective = '1000px';
    });
    
    // 緩存變換數據
    const lastTransforms = new Map();
    let isUpdating = false;
    
    // 計算進度
    function calculateProgress(scrollTop, start, end) {
        if (scrollTop < start) return 0;
        if (scrollTop > end) return 1;
        return (scrollTop - start) / (end - start);
    }
    
    // 解析百分比
    function parsePercentage(value, containerHeight) {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return parseFloat(value);
    }
    
    // 更新卡片變換
    function updateCardTransforms() {
        if (!scroller || !cards.length || isUpdating) {
            isUpdating = false;
            return;
        }
        
        isUpdating = true;
        
        const scrollTop = scroller.scrollTop;
        const containerHeight = scroller.clientHeight;
        const stackPositionPx = parsePercentage(config.stackPosition, containerHeight);
        const scaleEndPositionPx = parsePercentage(config.scaleEndPosition, containerHeight);
        const endElement = scroller.querySelector('.scroll-stack-end');
        const endElementTop = endElement ? endElement.offsetTop : 0;
        
        cards.forEach((card, i) => {
            if (!card || !card.offsetTop) return;
            
            const cardTop = card.offsetTop;
            const triggerStart = cardTop - stackPositionPx - (config.itemStackDistance * i);
            const triggerEnd = cardTop - scaleEndPositionPx;
            const pinStart = cardTop - stackPositionPx - (config.itemStackDistance * i);
            const pinEnd = endElementTop - containerHeight / 2;
            
            const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
            const targetScale = config.baseScale + (i * config.itemScale);
            const scale = 1 - scaleProgress * (1 - targetScale);
            const rotation = config.rotationAmount ? i * config.rotationAmount * scaleProgress : 0;
            
            let blur = 0;
            if (config.blurAmount) {
                let topCardIndex = 0;
                for (let j = 0; j < cards.length; j++) {
                    const jCardTop = cards[j].offsetTop;
                    const jTriggerStart = jCardTop - stackPositionPx - (config.itemStackDistance * j);
                    if (scrollTop >= jTriggerStart) {
                        topCardIndex = j;
                    }
                }
                
                if (i < topCardIndex) {
                    const depthInStack = topCardIndex - i;
                    blur = Math.max(0, depthInStack * config.blurAmount);
                }
            }
            
            let translateY = 0;
            const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
            
            if (isPinned) {
                translateY = scrollTop - cardTop + stackPositionPx + (config.itemStackDistance * i);
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx + (config.itemStackDistance * i);
            }
            
            // 應用變換
            const transform = `translateY(${translateY}px) scale(${scale}) rotateX(${rotation}deg)`;
            const filter = blur > 0 ? `blur(${blur}px)` : 'none';
            
            // 檢查是否需要更新
            const currentTransform = `${transform} ${filter}`;
            const lastTransform = lastTransforms.get(card);
            
            if (lastTransform !== currentTransform) {
                card.style.transform = transform;
                card.style.filter = filter;
                lastTransforms.set(card, currentTransform);
            }
        });
        
        isUpdating = false;
    }
    
    // 滾動事件處理
    function handleScroll() {
        requestAnimationFrame(updateCardTransforms);
    }
    
    // 添加滾動監聽器
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    
    // 初始更新
    updateCardTransforms();
    
    // 返回清理函數
    return function cleanup() {
        scroller.removeEventListener('scroll', handleScroll);
        lastTransforms.clear();
        
        // 重置卡片樣式
        cards.forEach(card => {
            card.style.transform = '';
            card.style.filter = '';
            card.style.willChange = '';
            card.style.transformOrigin = '';
            card.style.backfaceVisibility = '';
            card.style.perspective = '';
            card.style.webkitPerspective = '';
            card.style.marginBottom = '';
        });
    };
} 
