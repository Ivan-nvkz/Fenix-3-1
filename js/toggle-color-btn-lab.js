

document.addEventListener('DOMContentLoaded', () => {

   // Смена цвета надписи кнопки спойлера на странице отдела снабжения 

   const toggleColorBtns = document.querySelectorAll('.color__btns');

   toggleColorBtns.forEach(toggleColorBtn => {
      toggleColorBtn.addEventListener('click', function () {
         toggleColorBtn.classList.toggle('color__btns--active');
      });
   });

   // Смена цвета надписи кнопки спойлера на странице отдела снабжения 

});
