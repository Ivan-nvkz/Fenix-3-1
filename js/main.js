'use strict';

document.addEventListener('DOMContentLoaded', () => {

   // Плавный скролл кнопки наверх  ====================================================
   let btnUp = document.querySelector('.btn__up');

   btnUp.addEventListener('click', function (e) {
      scrollToY(0);
   });

   let scrolls = 0;
   window.addEventListener('scroll', function (e) {
      // console.log(++scrolls);
      let pos = window.pageYOffset;

      if (pos > window.innerHeight) {
         btnUp.classList.add('btn__up-open');
      }
      else {
         btnUp.classList.remove('btn__up-open');
      }

   });

   function scrollToY(pos) {
      window.scrollTo({
         top: pos,
         behavior: "smooth"
      });
   }
   // Плавный скролл кнопки наверх  ====================================================


//==== Модуь работы со спойлерами  start =======================================================================================================================================================================================================================
   /*
   Для родителя слойлеров пишем атрибут data-spollers
   Для заголовков слойлеров пишем атрибут data-spoller
   Если нужно включать\выключать работу спойлеров на разных размерах экранов
   пишем параметры ширины и типа брейкпоинта.
   
   Например: 
   data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
   data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px
   
   Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
   */

   const spollersArray = document.querySelectorAll('[data-spollers]');
   if (spollersArray.length > 0) {
      // Получение обычных слойлеров
      const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
         return !item.dataset.spollers.split(",")[0];
      });
      // Инициализация обычных слойлеров
      if (spollersRegular.length > 0) {
         initSpollers(spollersRegular);
      }
      // Получение слойлеров с медиа запросами
      const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
         return item.dataset.spollers.split(",")[0];
      });
      // Инициализация слойлеров с медиа запросами
      if (spollersMedia.length > 0) {
         const breakpointsArray = [];
         spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
         });
         // Получаем уникальные брейкпоинты
         let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
         });
         mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
         });
         // Работаем с каждым брейкпоинтом
         mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);
            // Объекты с нужными условиями
            const spollersArray = breakpointsArray.filter(function (item) {
               if (item.value === mediaBreakpoint && item.type === mediaType) {
                  return true;
               }
            });
            // Событие
            matchMedia.addEventListener("change", function () {
               initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
         });
      }
      // Инициализация
      function initSpollers(spollersArray, matchMedia = false) {
         spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
               spollersBlock.classList.add('_spoller-init');
               initSpollerBody(spollersBlock);
               spollersBlock.addEventListener("click", setSpollerAction);
            } else {
               spollersBlock.classList.remove('_spoller-init');
               initSpollerBody(spollersBlock, false);
               spollersBlock.removeEventListener("click", setSpollerAction);
            }
         });
      }
      // Работа с контентом
      function initSpollerBody(spollersBlock, hideSpollerBody = true) {
         const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
         if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
               if (hideSpollerBody) {
                  spollerTitle.removeAttribute('tabindex');
                  if (!spollerTitle.classList.contains('_spoller-active')) {
                     spollerTitle.nextElementSibling.hidden = true;
                  }
               } else {
                  spollerTitle.setAttribute('tabindex', '-1');
                  spollerTitle.nextElementSibling.hidden = false;
               }
            });
         }
      }
      function setSpollerAction(e) {
         const el = e.target;
         if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if (!spollersBlock.querySelectorAll('._slide').length) {
               if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
                  hideSpollersBody(spollersBlock);
               }
               spollerTitle.classList.toggle('_spoller-active');
               _slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
         }
      }
      function hideSpollersBody(spollersBlock) {
         const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
         if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_spoller-active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
         }
      }
   }

   //==== 
   //==== Вспомогательные модули плавного расскрытия и закрытия объекта ======================================================================================================================================================================
   let _slideUp = (target, duration = 500, showmore = 0) => {
      if (!target.classList.contains('_slide')) {
         target.classList.add('_slide');
         target.style.transitionProperty = 'height, margin, padding';
         target.style.transitionDuration = duration + 'ms';
         target.style.height = `${target.offsetHeight}px`;
         target.offsetHeight;
         target.style.overflow = 'hidden';
         target.style.height = showmore ? `${showmore}px` : `0px`;
         target.style.paddingTop = 0;
         target.style.paddingBottom = 0;
         target.style.marginTop = 0;
         target.style.marginBottom = 0;
         window.setTimeout(() => {
            target.hidden = !showmore ? true : false;
            !showmore ? target.style.removeProperty('height') : null;
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            !showmore ? target.style.removeProperty('overflow') : null;
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
         }, duration);
      }
   }
   let _slideDown = (target, duration = 500, showmore = 0) => {
      if (!target.classList.contains('_slide')) {
         target.classList.add('_slide');
         target.hidden = target.hidden ? false : null;
         showmore ? target.style.removeProperty('height') : null;
         let height = target.offsetHeight;
         target.style.overflow = 'hidden';
         target.style.height = showmore ? `${showmore}px` : `0px`;
         target.style.paddingTop = 0;
         target.style.paddingBottom = 0;
         target.style.marginTop = 0;
         target.style.marginBottom = 0;
         target.offsetHeight;
         target.style.transitionProperty = "height, margin, padding";
         target.style.transitionDuration = duration + 'ms';
         target.style.height = height + 'px';
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
         }, duration);
      }
   }
   let _slideToggle = (target, duration = 500) => {
      if (target.hidden) {
         return _slideDown(target, duration);
      } else {
         return _slideUp(target, duration);
      }
   }
   //===
   //==== Модуь работы со спойлерами  end    ===============================================================





   // Меню бургер ======================================================================================
   //Burger start   ====================================================================================
   const iconMenu = document.querySelector(".icon-menu");
   const menuBody = document.querySelector(".menu__list");
  

   if (iconMenu) {
      iconMenu.addEventListener("click", function (e) {
         document.body.classList.toggle("_lock");
         iconMenu.classList.toggle("menu-open");
         menuBody.classList.toggle("menu-open");
         menuBody.classList.toggle('menu__list--active');
      });
   }
   if (menuBody) {
      menuBody.addEventListener('click', function () {
         iconMenu.classList.remove("menu-open");
         menuBody.classList.remove("menu__list--active");
         menuBody.classList.remove("menu-open");
         document.body.classList.remove("_lock");
      });
   }




   //Burger  end  ==========================================================================================

   //DYNAMIC ADAPT  start ===================================================================================
   // Dynamic Adapt v.1
   // HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
   // e.x. data-da=".item,992,2"
   // Andrikanych Yevhen 2020
   // https://www.youtube.com/c/freelancerlifestyle

   // "use strict";

   function DynamicAdapt(type) {
      this.type = type;
   }

   DynamicAdapt.prototype.init = function () {
      const _this = this;
      // массив объектов
      this.оbjects = [];
      this.daClassname = "_dynamic_adapt_";
      // массив DOM-элементов
      this.nodes = document.querySelectorAll("[data-da]");

      // наполнение оbjects объктами
      for (let i = 0; i < this.nodes.length; i++) {
         const node = this.nodes[i];
         const data = node.dataset.da.trim();
         const dataArray = data.split(",");
         const оbject = {};
         оbject.element = node;
         оbject.parent = node.parentNode;
         оbject.destination = document.querySelector(dataArray[0].trim());
         оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
         оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
         оbject.index = this.indexInParent(оbject.parent, оbject.element);
         this.оbjects.push(оbject);
      }

      this.arraySort(this.оbjects);

      // массив уникальных медиа-запросов
      this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
         return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
      }, this);
      this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
         return Array.prototype.indexOf.call(self, item) === index;
      });

      // навешивание слушателя на медиа-запрос
      // и вызов обработчика при первом запуске
      for (let i = 0; i < this.mediaQueries.length; i++) {
         const media = this.mediaQueries[i];
         const mediaSplit = String.prototype.split.call(media, ',');
         const matchMedia = window.matchMedia(mediaSplit[0]);
         const mediaBreakpoint = mediaSplit[1];

         // массив объектов с подходящим брейкпоинтом
         const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
            return item.breakpoint === mediaBreakpoint;
         });
         matchMedia.addListener(function () {
            _this.mediaHandler(matchMedia, оbjectsFilter);
         });
         this.mediaHandler(matchMedia, оbjectsFilter);
      }
   };

   DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
      if (matchMedia.matches) {
         for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
         }
      } else {
         for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) {
               this.moveBack(оbject.parent, оbject.element, оbject.index);
            }
         }
      }
   };

   // Функция перемещения
   DynamicAdapt.prototype.moveTo = function (place, element, destination) {
      element.classList.add(this.daClassname);
      if (place === 'last' || place >= destination.children.length) {
         destination.insertAdjacentElement('beforeend', element);
         return;
      }
      if (place === 'first') {
         destination.insertAdjacentElement('afterbegin', element);
         return;
      }
      destination.children[place].insertAdjacentElement('beforebegin', element);
   }

   // Функция возврата
   DynamicAdapt.prototype.moveBack = function (parent, element, index) {
      element.classList.remove(this.daClassname);
      if (parent.children[index] !== undefined) {
         parent.children[index].insertAdjacentElement('beforebegin', element);
      } else {
         parent.insertAdjacentElement('beforeend', element);
      }
   }

   // Функция получения индекса внутри родителя
   DynamicAdapt.prototype.indexInParent = function (parent, element) {
      const array = Array.prototype.slice.call(parent.children);
      return Array.prototype.indexOf.call(array, element);
   };

   // Функция сортировки массива по breakpoint и place 
   // по возрастанию для this.type = min
   // по убыванию для this.type = max
   DynamicAdapt.prototype.arraySort = function (arr) {
      if (this.type === "min") {
         Array.prototype.sort.call(arr, function (a, b) {
            if (a.breakpoint === b.breakpoint) {
               if (a.place === b.place) {
                  return 0;
               }

               if (a.place === "first" || b.place === "last") {
                  return -1;
               }

               if (a.place === "last" || b.place === "first") {
                  return 1;
               }

               return a.place - b.place;
            }

            return a.breakpoint - b.breakpoint;
         });
      } else {
         Array.prototype.sort.call(arr, function (a, b) {
            if (a.breakpoint === b.breakpoint) {
               if (a.place === b.place) {
                  return 0;
               }

               if (a.place === "first" || b.place === "last") {
                  return 1;
               }

               if (a.place === "last" || b.place === "first") {
                  return -1;
               }

               return b.place - a.place;
            }

            return b.breakpoint - a.breakpoint;
         });
         return;
      }
   };

   const da = new DynamicAdapt("max");
   da.init();


   // DYNAMIC ADAPT  end =====================================================================================

});

//=====  JQuery  start  =============================================================

$(document).ready(function () {
   $("form").submit(function () { // Событие отправки с формы
      var form_data = $(this).serialize(); // Собираем данные из полей
      $.ajax({
         type: "POST", // Метод отправки
         url: "send.php", // Путь к PHP обработчику sendform.php
         data: form_data,
         success: function () {
            $('.overley').addClass('overley-visible');
            $('.modal').addClass('modal__visible');
         }
      }).done(function () {
         $(this).find('input').val('');
         $('form').trigger('reset');
      });
      event.preventDefault();
   });
});


// Slick slider start ====================================================================
$(function () {
   $('.header-slider').slick({
      dots:true,
      prevArrow: '<button class="header-slider-btn header-slider-btn__left"><svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="85" height="85" transform="matrix(-1 0 0 1 85 0)" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M38.7761 43.1667H48.5V41.8334H38.7761L42.9714 37.6381L42.0286 36.6953L36.2239 42.5001L42.0286 48.3048L42.9714 47.362L38.7761 43.1667Z" fill="#BF9D77"/></svg></button>',
      nextArrow: '<button class="header-slider-btn header-slider-btn__right"><svg width="136" height="85" viewBox="0 0 136 85" fill="none" xmlns="http://www.w3.org/2000/svg">   <rect x="0.5" y="0.5" width="136" height="85" fill="#BF9D77"/>    <rect x="0.5" y="0.5" width="136" height="85" stroke="#BF9D77"/>         <path  fill-rule="evenodd" clip-rule="evenodd" d="M103.724 43.4714H30V42.1381H103.724L99.5286 37.9428L100.471 37L106.276 42.8047L100.471 48.6095L99.5286 47.6667L103.724 43.4714Z" fill="white"/>         </svg></button>',
     
      //  nextArrow: '<button class="header-slider-btn header-slider-btn__right"><svg width="136" height="85" viewBox="0 0 136 85" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="0.5" y="0.5" width="135" height="84" fill="#BF9D77"/><path fill-rule="evenodd" clip-rule="evenodd" d="M103.724 43.4714H30V42.1381H103.724L99.5286 37.9428L100.471 37L106.276 42.8047L100.471 48.6095L99.5286 47.6667L103.724 43.4714Z" fill="white"/><rect x="0.5" y="0.5" width="135" height="84" stroke="#BF9D77"/></svg></button>'
   });


   $('.production-slider').slick({
      dots:false,
      // centerMode: true,
      // centerPadding: '60px',
      //  slidesToShow:3,

      variableWidth: true,
      prevArrow: '<button class="production-slider-btn   production-slider-btn__left"> <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="60" height="60" transform="matrix(-1 0 0 1 60 0)" fill="#BF9D77"/><path fill-rule="evenodd" clip-rule="evenodd" d="M26.2761 30.6667H36V29.3334H26.2761L30.4714 25.1381L29.5286 24.1953L23.7239 30.0001L29.5286 35.8048L30.4714 34.862L26.2761 30.6667Z" fill="white"/></svg></button>',
      nextArrow: '<button class="production-slider-btn   production-slider-btn__right">  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="60" height="60" fill="#F9F9F9"/><path fill-rule="evenodd" clip-rule="evenodd" d="M33.7239 30.6667H24V29.3334H33.7239L29.5286 25.1381L30.4714 24.1953L36.2761 30.0001L30.4714 35.8048L29.5286 34.862L33.7239 30.6667Z" fill="#2B323C"/></svg>   </button>',
     
   });

   $('.partners-slider').slick({
      dots:false,
      // speed: 300,
      // slidesToShow: 4,
      // slidesToScroll: 4,
      // responsive: [
      //   {
      //     breakpoint: 1024,
      //     settings: {
      //       slidesToShow: 3,
      //       slidesToScroll: 3,
      //       infinite: true,
      //       dots: true
      //     }
      //   },
      //   {
      //     breakpoint: 600,
      //     settings: {
      //       slidesToShow: 2,
      //       slidesToScroll: 2
      //     }
      //   },
      //   {
      //     breakpoint: 480,
      //     settings: {
      //       slidesToShow: 1,
      //       slidesToScroll: 1
      //     }
      //   }
    
      // ],




      
      prevArrow: '<button class="partners-slider-btn   partners-slider-btn__left"> <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="60" height="60" transform="matrix(-1 0 0 1 60 0)" fill="#BF9D77"/><path fill-rule="evenodd" clip-rule="evenodd" d="M26.2761 30.6667H36V29.3334H26.2761L30.4714 25.1381L29.5286 24.1953L23.7239 30.0001L29.5286 35.8048L30.4714 34.862L26.2761 30.6667Z" fill="white"/></svg></button>',
      nextArrow: '<button class="partners-slider-btn   partners-slider-btn__right">  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="60" height="60" fill="#F9F9F9"/><path fill-rule="evenodd" clip-rule="evenodd" d="M33.7239 30.6667H24V29.3334H33.7239L29.5286 25.1381L30.4714 24.1953L36.2761 30.0001L30.4714 35.8048L29.5286 34.862L33.7239 30.6667Z" fill="#2B323C"/></svg>   </button>',
     
   });




});

// Slick slider finish ====================================================================

//=====  JQuery  finish ===================================================================
