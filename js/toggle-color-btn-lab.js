

document.addEventListener('DOMContentLoaded', () => {

  

   const toggleColorBtns = document.querySelectorAll('.color__btns');

   toggleColorBtns.forEach(toggleColorBtn => {
      toggleColorBtn.addEventListener('click', function () {
         toggleColorBtn.classList.toggle('color__btns--active');
      });
   });

   

});
