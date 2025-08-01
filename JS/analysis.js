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


function initAnalysis() {

  const overlayBackdrop = document.getElementById('overlayBackdrop');
  if (overlayBackdrop) {
    overlayBackdrop.addEventListener('click', closeAnalysis);
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeAnalysis();
    }
  });
}
document.addEventListener('DOMContentLoaded', function() {
  initAnalysis();
}); 