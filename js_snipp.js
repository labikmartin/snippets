//- ### ### ### ### ### ### ### ###
//- UTILITY FUNCTIONS
//- ### ### ### ### ### ### ###

//- ### ### ### SEARCH PARENTS
function findParents(el, cls) {
  while (el.parentNode) {
      el = el.parentNode;
      if (el.classList.contains(cls))
          return el;
  }
  return null;
}

//- ### ### ### RETURN ALL SIBLINGS
function siblings(el) {
  var result = [],
    node = el.parentNode.firstChild;

    for ( ; node; node = node.nextSibling )
       if ( node.nodeType == 1 && node != el)
          result
            .push(node);
    return result;
}

//- ### ### ###  DEBOUNCER (call something with interval)
function debouncer( func , timeout ) {
   var timeoutID, timeout = timeout || 200;
   return function () {
      var scope = this,
          args =  arguments;
      clearTimeout( timeoutID );
      timeoutID = setTimeout( function () {
          func
            .apply( scope , Array.prototype.slice.call( args ) );
      }, timeout );
   };
}

//- ### ### ### SUBSTRING / UNSUBSTRING
function substringAnswer(ths, len) {
  var string = ths.innerText,
      substr = string.substring(0, len);
  if (string.length > len) {
    ths
      .innerText = substr + '... ';
  }
  else {
    ths
      .nextSibling.style.display = 'none';
  }
}

function unsubstringAnswer(ths, orig, el) {
  var sibling =   ths.previousSibling,
      origArray = orig,
      elem =      el;
  for (i = 0; i < elem.length; i++) {
    if (elem.indexOf(sibling) === i) {
      sibling
        .innerText = orig[i];
      ths
        .style.display = 'none';
    }
  }
}

// EXAMPLES
var answer =        document.getElementsByClassName('sectionFaq__answer'),
    answerText =    document.getElementsByClassName('sectionFaq__answerText'),
    unsubstring =   document.getElementsByClassName('js-answer'),
    saveOriginal =  [],
    saveElem =      [];

    // substring
    for (i = 0; i < answerText.length; i ++) {
      var text = answerText[i].innerText,
          elem = answerText[i];
      saveOriginal.push(text);
      saveElem.push(elem);
      substringAnswer(elem);
    }

    // unsubstring
    for (i = 0; i < unsubstring.length; i ++) {
      if (unsubstring) {
        unsubstring[i]
          .addEventListener('click', function() {
            unsubstringAnswer(this, saveOriginal, saveElem);
          }, false);
      }
    }

//- ### ### ### ### ### ### ### ###
//- WORKING WITH CLASSESS
//- ### ### ### ### ### ### ###

//- ### ### ### ADD CLASS
function classAdd(el, cls) {
  el
    .classList
    .add(cls);
}

//- ### ### ### REMOVE CLASS
function classRem(el, cls) {
  el
    .classList
    .remove(cls);
}

//- ### ### ### TOGGLE CLASS
function classTog(el, cls) {
  el
    .classList
    .toggle(cls);
}

//- ### ### ### TOGGLE CLASS
function classCont(el, cls) {
  el
    .classList
    .contains(cls);
}

//- ### ### ### ### ### ### ### ###
//- EFFECTS
//- ### ### ### ### ### ### ###

//- ### ### ### SLIDE TOGGLE
function rollContent(ths) {
  if (ths.classList.contains('active')) {
    ths
      .classList
      .remove('active');
  }
  else {
    ths
      .classList
      .add('active');
  }
}

//- ### ### ### SCROLLER
function scroll(toElement, speed) {
  var windowObject =  window,
      windowPos =     windowObject.pageYOffset,
      pointer =       toElement.getAttribute('href').slice(1),
      elem =          document.getElementById(pointer),
      elemOffset =    elem.offsetTop - 100; // (- fixed nav)
  var counter = setInterval(function() {
    windowPos;
    if (windowPos > elemOffset) { //bottom to top
      windowObject
        .scrollTo(0, windowPos);
      windowPos-=speed;
      if (windowPos <= elemOffset) { // cancel scrolling
        clearInterval(counter);
        windowObject
          .scrollTo(0, elemOffset+1);
      }
    } else { //top to bottom
      windowObject
        .scrollTo(0, windowPos);
      windowPos+=speed;
      if (windowPos >= elemOffset) { // cancel scrolling
        clearInterval(counter);
        windowObject
          .scrollTo(0, elemOffset+2);
      }
    }
  }, 15);
}

//- ### ### ### PARALLAX LAUNCHER
function startParallax() {
  // for top/bottom sections see navbarSwitch function
  var parallaxEl = document.getElementsByClassName('js-parallax');
      halfWin = (win.innerHeight / 2) + (win.innerHeight / 10) - 130;
      for (var i = 0; i < parallaxEl.length; i++) {
        var parallaxPos = parallaxEl[i].getBoundingClientRect().top;
        if ((parallaxPos > -(halfWin) && parallaxPos < halfWin)) {
          parallaxEl[i]
            .classList.add('parallax');
        }
      }
}

//- ### ### ### MOUSEMOVE PARALLAX BACKGROUND
function parallaxMove(el) {
  el && el
    .addEventListener('mousemove', debouncer(
      function(e) {
        var elHeight =    el.offsetHeight,
            cursorX =     e.clientX,
            cursorY =     e.clientY,
            cursorYRel =  cursorY / 40;
        if (window.navigator.userAgent.indexOf('Firefox') > -1) {
          var cursorXRel =  cursorX / 40;
        }
        else {
          var cursorXRel =  cursorX / 5;
        }
        var bgPosX =      50 + cursorXRel,
            bgPosY =      50 + cursorYRel;
        this
          .style.backgroundPosition = bgPosX + '% ' + bgPosY + '%';
      }, 8), true
    );
}

//- ### ### ### POPUP
function popup(ths, cls) {
  var popupId =     ths.attr('data-popup'),
      directPopup = $('#' + popupId),
      popup =       popupId ? directPopup : ths.next('.popup'), // can be direct or next sibling
      popupClass =  cls = (typeof cls === 'undefined') ? 'popup' : cls; // class is optional, default class is popup
  popup
    .addClass(popupClass);
}

// POPUP CLOSE
function popupHide(ths, cls) {
  var popupClass =  cls = (typeof cls === 'undefined') ? 'popup' : cls, // class is optional, default class is popup
      popup = findParents(ths, popupClass);
  popup.style.display = 'none';
}


//- ### ### ### ### ### ### ### ###
//- ELEMENTS
//- ### ### ### ### ### ### ###

//- ### ### ### NAVBAR SWITCHER
// change active nav link on window scroll
var documentHeight;
var offsets =             [],
    pageSections =        document.getElementsByClassName('js-scroll'),
    pageSectionsLength =  pageSections.length,
    navItems =            document.getElementsByClassName('navigation__link'),
    navItemsLength =      navItems.length;

win
  .addEventListener('load', function() {
    // store full page height
    documentHeight = html.scrollHeight;
    // store vertical position of page sections
    for (i = 0; i < pageSectionsLength; i++) {
      var  offset = pageSections[i].offsetTop;
      offsets.push(offset);
    }
    //navbar switcher
    navbarSwitch(offsets, documentHeight);
  });

function navbarSwitch(offsets, documentHeight) {
  var imgSource,
      windowOffset = this.pageYOffset,
      lastSection = pageSections[pageSectionsLength-1].offsetTop < windowOffset,
      bottomSection =   window.innerHeight + windowOffset;
  // change active navbar item according to current window position
  for (i = 0; i < pageSectionsLength; i++) {
    var section =       pageSections[i].id,
        link =          document.getElementsByClassName(section)[0],
        startSection =  pageSections[i].offsetTop <= windowOffset,
        endSection =    windowOffset < (offsets[i+1] || documentHeight);
    if (startSection && endSection) {
      // prevent adding class for better performance
      if (!(link.classList.contains('active'))) {
        var activeParallax = pageSections[i].querySelector('.js-parallax');
        link
          .classList.add('active');
        // launch parallax for top/bottom sections
        if (win.innerWidth > 960 && activeParallax !== null) {
          activeParallax
            .classList.add('parallax');
        }
        else {
          activeParallax
            .classList.remove('parallax');
        }
      }
    // fix for bottom section
  } else if (documentHeight === bottomSection || lastSection) {
      navItems[navItemsLength-2]
        .classList.remove('active');
      navItems[navItemsLength-1]
        .classList.add('active');
    } else {
      link
        .classList.remove('active');
    }
  }
}

//- ### ### ### CREATE PSEUDO SELECT PAGINATION FOR SWIPER SLIDER
// pagWrapper is top element of pagination
// desc = selector of element with text to be used as <option>
function selectPagination(pagWrapper, desc) {
  if (win.innerWidth <= 960 && pagWrapper.classList.contains('active')) {
    var bulletDesc =  pagWrapper.querySelector(desc),
        descText =    bulletDesc.innerHTML,
        select =      document.createElement('div'),
        pagination =  pagWrapper.firstElementChild;
    select
      .innerHTML = descText;
    select
      .classList.add('pagination__select');
    // substring large text
    substringTxt(select, 30);
    // keep select active after selecting another option
    if (pagWrapper.previousElementSibling) {
      select
        .classList.add('active');
    }
    pagWrapper
      .parentNode.insertBefore(select, pagWrapper);
    // find position of select element and align item list with it
    var selectTop =     select.offsetTop,
        selectLeft =    select.offsetLeft,
        selectHeight =  select.offsetHeight,
        topPosition =   selectTop + selectHeight;
    // set list position only if select is visible
    if (select.offsetWidth > 0 && select.offsetHeight > 0) {
      pagWrapper
        .style.top = topPosition + 'px';
      pagWrapper
        .style.left = selectLeft + 'px';
    }
    else {
      pagWrapper
        .removeAttribute('style');
    }
  }
  else {
    pagWrapper
      .removeAttribute('style');
  }
}
