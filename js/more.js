'use strict';

document.addEventListener('DOMContentLoaded', () => {
   // Показать ещё отзывы  start ==========================================================================

   let btnShowAllReviews = document.querySelector('.production-mobile__all-btn');
   let panelWrapper = document.querySelector('.panel-wrapper');

   btnShowAllReviews.addEventListener('click', function () {
      if (panelWrapper.style.maxHeight) {
         panelWrapper.style.maxHeight = null;
          btnShowAllReviews.textContent = 'Смотреть все позиции';
      } else {
         panelWrapper.style.maxHeight = panelWrapper.scrollHeight + "px";
          btnShowAllReviews.textContent = 'Свернуть';
      }

   });
   // Показать ещё отзывы end ==============================================================================
});








