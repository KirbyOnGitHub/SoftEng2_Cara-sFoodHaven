document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const orderCards = document.querySelectorAll('.order-card');
  
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const status = button.getAttribute('data-status');
  
        orderCards.forEach(card => {
          const cardStatus = card.getAttribute('data-status');
  
          if (status === 'ALL' || status === cardStatus) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });
  