    // 難度按鈕選擇
    function selectDifficulty(button) {
        document.querySelectorAll('.difficulty-button').forEach(btn => {
          btn.classList.remove('selected');
        });
        button.classList.add('selected');
        
      }
  
      document.addEventListener('DOMContentLoaded', function() {
        const difficultyButtons = document.querySelectorAll('.difficulty-button');
        difficultyButtons.forEach(button => {
          button.addEventListener('click', function() {
            selectDifficulty(this);
          });
        });
      });