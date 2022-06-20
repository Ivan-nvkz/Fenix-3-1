

document.addEventListener('DOMContentLoaded', () => {

   // Смена цвета надписи кнопки спойлера на странице отдела снабжения 

   const toggleColorBtns = document.querySelectorAll('.buy-page__item-title');

   toggleColorBtns.forEach(toggleColorBtn => {
      toggleColorBtn.addEventListener('click', function () {
         toggleColorBtn.classList.toggle('buy-page__item-title--active');
      });
   });

   // Смена цвета надписи кнопки спойлера на странице отдела снабжения 

});
