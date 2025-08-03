// 筆記系統JavaScript功能

// 模擬資料庫
let notes = [
    {
        id: 1,
        title: "質數判斷練習",
        content: "題目:判斷101-200之間有多少個質數\n並輸出所有質數\n正確答案:17個\n解析:質數是指大於1且只能被1和自己整除的正整數。在101-200之間，共有17個質數：101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 191, 193, 197, 199。",
        subject: "數學"
    },
    {
        id: 2,
        title: "二次方程式求解",
        content: "題目:求解二次方程式 x² - 5x + 6 = 0\n\n正確答案:x = 2 或 x = 3\n\n解析:使用因式分解法，將 x² - 5x + 6 分解為 (x - 2)(x - 3) = 0\n因此 x - 2 = 0 或 x - 3 = 0\n所以 x = 2 或 x = 3\n\n驗證:\n當 x = 2 時：2² - 5×2 + 6 = 4 - 10 + 6 = 0 ✓\n當 x = 3 時：3² - 5×3 + 6 = 9 - 15 + 6 = 0 ✓",
        subject: "數學"
    },
    {
        id: 3,
        title: "圓的面積與周長計算",
        content: "題目:計算圓的面積和周長，已知半徑 r = 5\n\n正確答案:\n面積 = 25π ≈ 78.54\n周長 = 10π ≈ 31.42\n\n解析:\n圓的面積公式：A = πr²\n圓的周長公式：C = 2πr\n\n計算過程：\n面積 = π × 5² = π × 25 = 25π ≈ 78.54\n周長 = 2π × 5 = 10π ≈ 31.42\n\n注意：π ≈ 3.14159",
        subject: "數學"
    },
    {
        id: 4,
        title: "線性方程組求解",
        content: "題目:求解線性方程組\n2x + 3y = 8\n4x - y = 7\n\n正確答案:x = 2, y = 1\n\n解析:使用代入法或消元法求解\n\n方法一：代入法\n從第二個方程式：y = 4x - 7\n代入第一個方程式：2x + 3(4x - 7) = 8\n2x + 12x - 21 = 8\n14x = 29\nx = 2\n代入 y = 4×2 - 7 = 1\n\n驗證：\n2×2 + 3×1 = 4 + 3 = 7 ✓\n4×2 - 1 = 8 - 1 = 7 ✓",
        subject: "數學"
    }
];

let subjects = ["數學", "英文", "程式設計", "物理"];

// 將數據暴露到全局作用域，供其他模組使用
window.notes = notes;
window.subjects = subjects;

// 暴露必要的函數給全局使用
window.renderNotes = renderNotes;
window.updateSubjectSelect = updateSubjectSelect;

// 暴露筆記系統的添加函數
window.addNoteToSystem = function(note) {
    try {
        // 檢查是否已經存在相同的筆記（基於內容和主題）
        const existingNote = notes.find(n => 
            n.content.includes(note.content.split('\n')[0]) && 
            n.subject === note.subject
        );
        
        if (existingNote) {
            if (window.showCustomAlert) {
                window.showCustomAlert('此內容已經收藏過了！');
            } else {
                alert('此內容已經收藏過了！');
            }
            return;
        }
        
        // 添加新筆記
        notes.push(note);
        window.notes = notes;
        
        // 同步主題數據
        if (!subjects.includes(note.subject)) {
            subjects.push(note.subject);
            window.subjects = subjects;
        }
        
        // 如果當前在筆記頁面，重新渲染
        if (document.getElementById('notesGrid')) {
            updateSubjectSelect();
            renderNotes();
        }
        
    } catch (error) {
        console.error('添加筆記失敗:', error);
        if (window.showCustomAlert) {
            window.showCustomAlert('保存失敗，請重試！');
        } else {
            alert('保存失敗，請重試！');
        }
    }
};

// 暴露Markdown解析函數（如果全局還沒有定義）
if (typeof window.parseMarkdown === 'undefined') {
    window.parseMarkdown = parseMarkdown;
}

// 當前選中的主題
let currentSubject = "數學";

// 初始化頁面
function initNotePage() {
    // 筆記頁面初始化完成
    
    // 同步全局數據
    syncGlobalData();
    
    // 檢查是否有主題，如果沒有則設置為null
    if (subjects.length === 0) {
        currentSubject = null;
    } else if (!currentSubject || !subjects.includes(currentSubject)) {
        // 如果當前主題不存在，設置為第一個主題
        currentSubject = subjects[0];
    }
    
    updateSubjectSelect();
    renderNotes();
}

// 同步全局數據
function syncGlobalData() {
    // 確保全局資料與本地一致
    if (window.notes) {
        notes = window.notes;
    }
    if (window.subjects) {
        subjects = window.subjects;
    }
    
    // 確保是陣列格式
    if (!Array.isArray(notes)) {
        notes = [];
        window.notes = notes;
    }
    if (!Array.isArray(subjects)) {
        subjects = [];
        window.subjects = subjects;
    }
    
    // 修正 currentSubject
    if (subjects.length === 0) {
        currentSubject = null;
    } else if (!currentSubject || !subjects.includes(currentSubject)) {
        currentSubject = subjects[0];
    }
    
    // 更新全局引用
    window.notes = notes;
    window.subjects = subjects;
}

// 更新主題選擇器
function updateSubjectSelect() {
    const dropdown = document.getElementById('custom-dropdown');
    const selectedText = document.getElementById('selected-option-text');
    
    if (dropdown && selectedText) {
        dropdown.innerHTML = '';
        
        if (subjects.length === 0) {
            // 沒主題時提示新增
            currentSubject = null;
            selectedText.textContent = '新增主題';
            
            // 當沒有主題時，只顯示新增主題選項
            const addOption = document.createElement('button');
            addOption.className = 'custom-dropdown-option';
            addOption.dataset.value = 'add_subject';
            addOption.innerHTML = `<span class="option-text">新增主題</span>`;
            addOption.addEventListener('click', function() {
                addNewSubject();
                dropdown.classList.remove('active');
            });
            dropdown.appendChild(addOption);
        } else {
            // 有主題：生成主題選項
            subjects.forEach(subject => {
                const option = document.createElement('button');
                option.className = 'custom-dropdown-option';
                option.dataset.value = subject;
                if (subject === currentSubject) {
                    option.classList.add('selected');
                }
                
                option.innerHTML = `
                    <span class="option-text">${subject}</span>
                    <button class="delete-option-btn" onclick="deleteSubject('${subject}', event)">
                        <img src="img/Vector-25.png" alt="刪除">
                    </button>
                `;
                
                option.addEventListener('click', function(e) {
                    if (!e.target.closest('.delete-option-btn')) {
                        selectOption(subject, subject);
                    }
                });
                
                dropdown.appendChild(option);
            });
            
            // 更新選中文字
            selectedText.textContent = currentSubject;
            
            // 分隔線
            const separator = document.createElement('div');
            separator.style.cssText = 'height: 1px; background-color: rgba(255, 255, 255, 0.2); margin: 8px 16px;';
            dropdown.appendChild(separator);
            
            // 新增主題選項
            const addOption = document.createElement('button');
            addOption.className = 'custom-dropdown-option';
            addOption.dataset.value = 'add_subject';
            addOption.innerHTML = `<span class="option-text">新增主題</span>`;
            addOption.addEventListener('click', function() {
                addNewSubject();
                dropdown.classList.remove('active');
            });
            dropdown.appendChild(addOption);
        }
    }
}

// 渲染筆記列表
function renderNotes() {
    const container = document.getElementById('notesContainer');
    if (!container) return;
    
    if (!currentSubject || subjects.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: gray;">尚未建立任何主題，請新增主題。</p>';
        return;
    }
    
    const subjectNotes = notes.filter(note => note.subject === currentSubject);
    
    if (subjectNotes.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: gray;">目前主題尚無筆記，開始新增吧！</p>';
        return;
    }
    
    // 渲染筆記（請根據你原本的筆記結構調整）
    container.innerHTML = subjectNotes.map(note => `
        <div class="note-card">
            <div class="note-content">${note.content}</div>
        </div>
    `).join('');
}

// 渲染筆記列表
function renderNotes() {
    const notesGrid = document.getElementById('notesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!notesGrid) return;

    notesGrid.innerHTML = '';
    
    // 檢查是否有主題
    if (!currentSubject || subjects.length === 0) {
        notesGrid.style.display = 'none';
        emptyState.style.display = 'block';
        // 更新空狀態的內容
        const emptyIcon = emptyState.querySelector('.empty-icon img');
        const emptyTitle = emptyState.querySelector('h3');
        const emptyDesc = emptyState.querySelector('p');
        
        if (emptyIcon) emptyIcon.src = 'img/Vector-32.png';
        if (emptyTitle) emptyTitle.textContent = '還沒有主題';
        if (emptyDesc) emptyDesc.textContent = '請新增主題，然後開始記錄你的學習筆記吧！';
        return;
    }
    
    const filteredNotes = notes.filter(note => note.subject === currentSubject);
    
    if (filteredNotes.length === 0) {
        notesGrid.style.display = 'none';
        emptyState.style.display = 'block';
        // 更新空狀態的內容為沒有筆記
        const emptyIcon = emptyState.querySelector('.empty-icon img');
        const emptyTitle = emptyState.querySelector('h3');
        const emptyDesc = emptyState.querySelector('p');
        
        if (emptyIcon) emptyIcon.src = 'img/Vector-32.png';
        if (emptyTitle) emptyTitle.textContent = '還沒有筆記';
        if (emptyDesc) emptyDesc.textContent = '點擊「新增筆記」開始記錄你的學習筆記吧！';
    } else {
        notesGrid.style.display = 'grid';
        emptyState.style.display = 'none';
        
        filteredNotes.forEach(note => {
            const noteCard = createNoteCard(note);
            notesGrid.appendChild(noteCard);
        });
    }
}

// 清理文字內容 - 保留換行符
function cleanTextContent(text) {
    return text
        .replace(/\r\n/g, '\n')  // 統一換行符
        .replace(/\r/g, '\n')    // 統一換行符
        .replace(/\n\s*\n\s*\n+/g, '\n\n')  // 多個連續換行符合併為兩個
        .trim();                 // 移除首尾空白
}

// 本地Markdown解析函數
function parseMarkdown(text) {
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

// 創建筆記卡片
function createNoteCard(note) {
    const article = document.createElement('article');
    article.className = 'note-card';
    article.dataset.noteId = note.id;
    
    const cleanedContent = cleanTextContent(note.content);
    const parsedContent = parseMarkdown(cleanedContent);
    
    article.innerHTML = `
        <div class="card-content">
            <h3 class="note-title">${note.title}</h3>
            <div class="note-text">${parsedContent}</div>
        </div>

        <div class="add-button">
            <div class="generate-button" onclick="generateQuestions(this)">
                <span class="arrow-up">↑</span>
                <span class="generate-text">生成題目</span>
            </div>
            <span class="add-plus" onclick="toggleActionBar(this)">
                <img src="img/Vector-31.png" alt="Add">
            </span>
            <div class="action-bar">
                <span class="action-item" onclick="deleteNote(this)">刪除</span>
                <span class="action-item" onclick="moveNote(this)">搬移</span>
                <span class="action-item" onclick="viewNote(this)">查看</span>
                <span class="action-item" onclick="editNote(this)">編輯</span>
            </div>
        </div>
    `;
    
    return article;
}

// 切換動作欄
function toggleActionBar(element) {
    closeAllActionBars();
    const actionBar = element.nextElementSibling;
  const backdrop = document.getElementById('actionBackdrop');

    if (actionBar && actionBar.classList.contains('action-bar')) {
        actionBar.classList.add('active');
        backdrop.classList.add('active');
    }
}

// 關閉所有動作欄
function closeAllActionBars() {
  const actionBars = document.querySelectorAll('.action-bar');
  const backdrop = document.getElementById('actionBackdrop');

    actionBars.forEach(bar => bar.classList.remove('active'));
  backdrop.classList.remove('active');
}

// 新增筆記 - 大尺寸模態框
function addNewNote() {
    // 檢查是否有主題
    if (!currentSubject || subjects.length === 0) {
        safeAlert('請新增主題！');
        return;
    }
    
    const modal = createModal(`
        <div class="modal-header">
            <h2 class="modal-title">新增筆記</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div style="margin-bottom: 15px;">
                <label for="newNoteTitle" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">筆記名稱：</label>
                <input type="text" id="newNoteTitle" placeholder="請輸入筆記名稱" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
            </div>
            <div style="margin-bottom: 15px;">
                <label for="newNoteContent" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">筆記內容：</label>
                <p style="margin-bottom: 10px; color: #666; font-size: 14px;">支援 Markdown 語法</p>
                <textarea class="modal-textarea" id="newNoteContent" placeholder="請輸入筆記內容...

範例格式：
# 題目標題
## 題目內容
這裡是題目描述

## 正確答案
這裡是答案

## 解析
這裡是詳細解析

**支援 Markdown 語法：**
- 粗體：**文字**
- 斜體：*文字*
- 標題：# ## ###
- 列表：- 項目
- 程式碼：\`code\`"></textarea>
            </div>
        </div>
        <div class="modal-footer">
            <button class="modal-btn modal-btn-secondary" onclick="closeModal()">取消</button>
            <button class="modal-btn modal-btn-primary" onclick="saveNewNote()">儲存筆記</button>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// 儲存新筆記
function saveNewNote() {
    const titleInput = document.getElementById('newNoteTitle');
    const textarea = document.getElementById('newNoteContent');
    
    if (!titleInput || !textarea) {
        console.error('找不到必要的元素');
        return;
    }
    
    const title = titleInput.value.trim();
    const content = textarea.value.trim();
    
    if (!title) {
        safeAlert('請輸入筆記名稱！');
        return;
    }
    
    if (!content) {
        safeAlert('請輸入筆記內容！');
        return;
    }
    
    const newNote = {
        id: Date.now(),
        title: title,
        content: content,
        subject: currentSubject
    };
    
    notes.push(newNote);
    renderNotes();
    closeModal();
    safeAlert('筆記新增成功！');
}

// 刪除筆記
function deleteNote(element) {
  const noteCard = element.closest('.note-card');
    const noteId = parseInt(noteCard.dataset.noteId);
    
    safeConfirm('確定要刪除這則筆記嗎？', 
        () => {
            notes = notes.filter(note => note.id !== noteId);
            renderNotes();
            closeAllActionBars();
            safeAlert('筆記已刪除！');
        },
        () => {
            // 取消刪除，不做任何操作
        }
    );
}

// 搬移筆記
function moveNote(element) {
    const noteCard = element.closest('.note-card');
    const noteId = parseInt(noteCard.dataset.noteId);
    const note = notes.find(n => n.id === noteId);
    
    if (!note) return;
    
    const modal = createModal(`
        <div class="modal-header">
            <h2 class="modal-title">搬移筆記</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p style="margin-bottom: 15px;">選擇要搬移到的主題：</p>
            <div class="move-custom-select-container" style="margin-bottom: 15px;">
                <div class="move-custom-select" id="move-custom-select" onclick="toggleMoveDropdown()">
                    <span id="move-selected-option-text">${note.subject}</span>
                    <img src="img/Vector-17.png" class="move-select-arrow">
                </div>
                <div class="move-custom-dropdown" id="move-custom-dropdown">
                    ${subjects.map(subject => `
                        <button class="move-dropdown-option ${subject === note.subject ? 'selected' : ''}" data-value="${subject}" onclick="selectMoveOption('${subject}')">
                            <span class="move-option-text">${subject}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            <p style="color: #666; font-size: 14px;">或輸入新主題名稱：</p>
            <input type="text" id="newSubjectInput" placeholder="輸入新主題名稱" style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px;">
        </div>
        <div class="modal-footer">
            <button class="modal-btn modal-btn-secondary" onclick="closeModal()">取消</button>
            <button class="modal-btn modal-btn-primary" onclick="confirmMoveNote()">確認搬移</button>
        </div>
    `);
    
    document.body.appendChild(modal);
  closeAllActionBars();
}

// 確認搬移筆記
function confirmMoveNote() {
    const selectedText = document.getElementById('move-selected-option-text');
    const input = document.getElementById('newSubjectInput');
    const noteCard = document.querySelector('.note-card[data-note-id]');
    const noteId = parseInt(noteCard.dataset.noteId);
    const note = notes.find(n => n.id === noteId);
    
    if (!note) return;
    
    let newSubject = input.value.trim() || selectedText.textContent;
    
    if (!newSubject) {
        safeAlert('請選擇或輸入主題名稱！');
        return;
    }
    
    if (!subjects.includes(newSubject)) {
        subjects.push(newSubject);
        updateSubjectSelect();
    }
    
    note.subject = newSubject;
    renderNotes();
    closeModal();
    safeAlert(`筆記已搬移到 ${newSubject} 主題！`);
}

// 查看筆記 - 大尺寸模態框
function viewNote(element) {
    const noteCard = element.closest('.note-card');
    const noteId = parseInt(noteCard.dataset.noteId);
    const note = notes.find(n => n.id === noteId);
    
    if (!note) return;
    
    const cleanedContent = cleanTextContent(note.content);
    const parsedContent = parseMarkdown(cleanedContent);
    
    const modal = createModal(`
        <div class="modal-header">
            <h2 class="modal-title">查看筆記</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div style="margin-bottom: 20px;">
                <p><strong>${note.title}</strong></p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; line-height: 1.6;">
                ${parsedContent}
            </div>
        </div>
        <div class="modal-footer">
            <button class="modal-btn modal-btn-primary" onclick="closeModal()">關閉</button>
        </div>
    `);
    
    document.body.appendChild(modal);
      closeAllActionBars();
    }

// 編輯筆記 - 大尺寸模態框
function editNote(element) {
    const noteCard = element.closest('.note-card');
    const noteId = parseInt(noteCard.dataset.noteId);
    const note = notes.find(n => n.id === noteId);
    
    if (!note) return;
    
    const modal = createModal(`
        <div class="modal-header">
            <h2 class="modal-title">編輯筆記</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div style="margin-bottom: 15px;">
                <label for="editNoteTitle" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">筆記名稱：</label>
                <input type="text" id="editNoteTitle" value="${note.title}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
            </div>
            <div style="margin-bottom: 15px;">
                <label for="editNoteContent" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">筆記內容：</label>
                <p style="margin-bottom: 10px; color: #666; font-size: 14px;">支援 Markdown 語法</p>
                <textarea class="modal-textarea" id="editNoteContent">${note.content}</textarea>
            </div>
        </div>
        <div class="modal-footer">
            <button class="modal-btn modal-btn-secondary" onclick="closeModal()">取消</button>
            <button class="modal-btn modal-btn-primary" onclick="saveEditNote()">儲存修改</button>
        </div>
    `);
    
    document.body.appendChild(modal);
      closeAllActionBars();
}

// 儲存編輯的筆記
function saveEditNote() {
    const titleInput = document.getElementById('editNoteTitle');
    const textarea = document.getElementById('editNoteContent');
    
    if (!titleInput || !textarea) {
        console.error('找不到必要的元素');
        return;
    }
    
    const title = titleInput.value.trim();
    const content = textarea.value.trim();
    
    if (!title) {
        safeAlert('請輸入筆記名稱！');
        return;
    }
    
    if (!content) {
        safeAlert('請輸入筆記內容！');
        return;
    }
    
    const noteCard = document.querySelector('.note-card[data-note-id]');
    const noteId = parseInt(noteCard.dataset.noteId);
    const note = notes.find(n => n.id === noteId);
    
    if (note) {
        note.title = title;
        note.content = content;
        renderNotes();
        closeModal();
        safeAlert('筆記編輯成功！');
    }
}

// 生成題目
function generateQuestions(element) {
    const noteCard = element.closest('.note-card');
    const noteId = parseInt(noteCard.dataset.noteId);
    const note = notes.find(n => n.id === noteId);
    
    if (!note) return;
    
    safeAlert(`正在根據筆記「${note.title}」生成題目...\n\n題目已生成完成！\n\n題目：基於${note.subject}的相關練習題\n\n請前往遊戲頁面查看新生成的題目。`);
}

// 主題變更
function onSubjectChange() {
    const select = document.getElementById('subject-select');
    if (select) {
        const selectedValue = select.value;
        
        if (selectedValue === 'add_subject') {
            addNewSubject();
            // 重置選擇器到當前主題
            setTimeout(() => {
                if (currentSubject) {
                    select.value = currentSubject;
                } else {
                    select.value = 'add_subject';
                }
            }, 100);
        } else if (selectedValue === 'delete_subject') {
            deleteSubject();
            // 重置選擇器到當前主題
            setTimeout(() => {
                if (currentSubject) {
                    select.value = currentSubject;
                } else {
                    select.value = 'add_subject';
                }
            }, 100);
        } else {
            currentSubject = selectedValue;
            renderNotes();
        }
    }
}

// 新增主題
function addNewSubject() {
    const modal = createModal(`
        <div class="modal-header">
            <h2 class="modal-title">新增主題</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p style="margin-bottom: 15px;">請輸入新主題名稱：</p>
            <input type="text" id="newSubjectName" placeholder="例如：程式設計、英文、數學..." style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px;">
        </div>
        <div class="modal-footer">
            <button class="modal-btn modal-btn-secondary" onclick="closeModal()">取消</button>
            <button class="modal-btn modal-btn-primary" onclick="confirmAddSubject()">新增主題</button>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// 確認新增主題
function confirmAddSubject() {
    const input = document.getElementById('newSubjectName');
    const newSubject = input.value.trim();
    
    if (!newSubject) {
        safeAlert('請輸入主題名稱！');
        return;
    }
    
    if (subjects.includes(newSubject)) {
        safeAlert('此主題已存在！');
        return;
    }
    
    subjects.push(newSubject);
    currentSubject = newSubject; // 設置為當前選中的主題
    updateSubjectSelect();
    renderNotes(); // 重新渲染筆記列表
    closeModal();
    safeAlert(`主題「${newSubject}」新增成功！`);
}

// 刪除主題
function deleteSubject() {
    
    const modal = createModal(`
        <div class="modal-header">
            <h2 class="modal-title">刪除主題</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p style="margin-bottom: 15px; color: #d32f2f;">刪除該主題的所有筆記</p>
            <p style="margin-bottom: 15px;">請選擇要刪除的主題：</p>
            <div style="position: relative;">
                <select id="deleteSubjectSelect" class="custom-select" style="width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; background-color: var(--select-bg); color: black; appearance: none; -webkit-appearance: none; -moz-appearance: none; cursor: pointer;">
                    ${subjects.map(subject => `<option value="${subject}">${subject}</option>`).join('')}
                </select>
                <img src="img/Vector-17.png" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; pointer-events: none;">
            </div>
        </div>
        <div class="modal-footer">
            <button class="modal-btn modal-btn-secondary" onclick="closeModal()">取消</button>
            <button class="modal-btn" onclick="confirmDeleteSubject()" style="background: #d32f2f; color: white;">確認刪除</button>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// 確認刪除主題
function confirmDeleteSubject() {
    const select = document.getElementById('deleteSubjectSelect');
    const subjectToDelete = select.value;
    
    safeConfirm(`確定要刪除主題「${subjectToDelete}」嗎？\n\n 此操作會刪除該主題的所有筆記，且無法復原！`, 
        () => {
            // 刪除該主題的所有筆記
            notes = notes.filter(note => note.subject !== subjectToDelete);
            
            // 刪除主題
            subjects = subjects.filter(subject => subject !== subjectToDelete);
            
            // 如果當前主題被刪除，檢查是否還有其他主題
            if (currentSubject === subjectToDelete) {
                if (subjects.length === 0) {
                    currentSubject = null;
                } else {
                    currentSubject = subjects[0];
                }
            }
            
            updateSubjectSelect();
            renderNotes();
            closeModal();
            safeAlert(`主題「${subjectToDelete}」已刪除！`);
        },
        () => {
            // 取消刪除，不做任何操作
        }
    );
}

// 創建模態框
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal();
        }
    };
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = content;
    
    modal.appendChild(modalContent);
    
    return modal;
}

// 關閉模態框
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}



// 自定義下拉選單功能
function toggleCustomDropdown() {
    const dropdown = document.getElementById('custom-dropdown');
    dropdown.classList.toggle('active');
}

function selectOption(value, text) {
    document.getElementById('selected-option-text').textContent = text;
    document.getElementById('custom-dropdown').classList.remove('active');
    
    // 更新選中狀態
    const options = document.querySelectorAll('.custom-dropdown-option');
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.value === value) {
            option.classList.add('selected');
        }
    });
    
    // 更新當前主題並重新渲染
    if (value !== 'add_subject') {
        currentSubject = value;
        renderNotes();
    }
}

function deleteSubject(subjectValue, event) {
    event.stopPropagation(); // 防止觸發選項選擇
    
    // 使用現有的模態框樣式
    const modal = createModal(`
        <div class="modal-header">
            <h2 class="modal-title">刪除主題</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p style="margin-bottom: 15px; color: #d32f2f;">確定要刪除主題「${subjectValue}」嗎？</p>
            <p style="margin-bottom: 15px; color: #d32f2f;">此操作會刪除該主題的所有筆記，且無法復原！</p>
        </div>
        <div class="modal-footer">
            <button class="modal-btn modal-btn-secondary" onclick="closeModal()">取消</button>
            <button class="modal-btn" onclick="confirmDeleteSubjectFromDropdown('${subjectValue}')" style="background: #d32f2f; color: white;">確認刪除</button>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function confirmDeleteSubjectFromDropdown(subjectValue) {
    // 刪除該主題的所有筆記
    notes = notes.filter(note => note.subject !== subjectValue);
    
    // 刪除主題
    subjects = subjects.filter(subject => subject !== subjectValue);
    
    // 如果當前主題被刪除，檢查是否還有其他主題
    if (currentSubject === subjectValue) {
        if (subjects.length === 0) {
            currentSubject = null;
        } else {
            currentSubject = subjects[0];
        }
    }
    
    updateSubjectSelect();
    renderNotes();
    closeModal();
    safeAlert(`主題「${subjectValue}」已刪除！`);
}

// 頁面加載完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    // 檢查是否在筆記頁面
    if (document.getElementById('notesGrid')) {
        // 延遲初始化，確保所有數據都已加載
        setTimeout(() => {
            initNotePage();
        }, 100);
        
        // 點擊外部關閉下拉選單
        document.addEventListener('click', function(event) {
            const container = document.querySelector('.custom-select-container');
            const dropdown = document.getElementById('custom-dropdown');
            
            if (container && dropdown && !container.contains(event.target) && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        });
        
        // 綁定ESC鍵關閉模態框
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
                closeAllActionBars();
                // 關閉下拉選單
                const dropdown = document.getElementById('custom-dropdown');
                if (dropdown && dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                }
            }
        });
    }
});

// 頁面可見性變化時重新同步數據（當用戶從其他頁面返回時）
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && document.getElementById('notesGrid')) {
        // 頁面變為可見時，重新同步數據
        setTimeout(() => {
            syncGlobalData();
            updateSubjectSelect();
            renderNotes();
        }, 100);
    }
});

// 搬移模態框下拉選單功能
function toggleMoveDropdown() {
    const dropdown = document.getElementById('move-custom-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function selectMoveOption(value) {
    const selectedText = document.getElementById('move-selected-option-text');
    const dropdown = document.getElementById('move-custom-dropdown');
    
    if (selectedText) {
        selectedText.textContent = value;
    }
    
    // 更新選中狀態
    const options = dropdown.querySelectorAll('.move-dropdown-option');
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.value === value) {
            option.classList.add('selected');
        }
    });
    
    // 關閉下拉選單
    dropdown.classList.remove('active');
}