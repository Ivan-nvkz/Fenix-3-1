

document.addEventListener('DOMContentLoaded', () => {

 

   const toggleColorBtns = document.querySelectorAll('.buy-page__item-title ');

   toggleColorBtns.forEach(toggleColorBtn => {
      toggleColorBtn.addEventListener('click', function () {
         toggleColorBtn.classList.toggle('buy-page__item-title--active');
      });
   });

   

});
