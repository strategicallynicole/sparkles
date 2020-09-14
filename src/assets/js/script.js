/*
 * Polyfills
 */
// import './polyfills/object-fit';

/*
 * Modules
 */

const $win = $(window);

$win.on('load', function() {
	if ($win.width() >= 1024) {
		if (!$('.js-slider').length) {
			return
		}

		$('.js-slider').pagepiling({
			css3: false,
			sectionSelector: '.section',
			anchors: ['Section-1', 'Section-2', 'Section-3', 'Section-4', 'Section-5'],
			onLeave: function(index, nextIndex, direction) {
				direction =='down' ? doLoadingAnimation() : doLoadingAnimation();
			}
		});
	}
});

function initAnimationSpread (arguments) {
	const $animation = $('.js-animation-spread');

	$animation.each(function() {
		const $items = $animation.find('.js-animation-item');
		const $timingStart = .6;
		const $timingStep = .1;
		const $timingGroup = 4;

		for (let i = 0; i < $items.length; i++) {
			$($items[i]).css({
				transitionDelay:  $timingStart + Math.floor(i / $timingGroup) * $timingStep + 's',
			});
		}
	});
}

initAnimationSpread();

const splitTextToNewLines = () => {
	const $element = $('.js-split-new-line');

	$element.each(function(index, el) {
		if (! $(el).length) {
			return;
		}

		const elementText = $(el).html().trim();
		const textArray = elementText.split(' ');

		$(el).empty();

		textArray.map(item => $(el).append(`<span class="animation__item js-animation-item">${item}&nbsp;</>`));
	});

}

splitTextToNewLines();

// Preloader

const $animationContainer = $('.js-animation-container');

const $animationContainerFirst = $('.js-animation-container:first-child');
const $animationsFirst = $animationContainerFirst.find('.js-init-animation');

$win.on('load', function() {
	$animationsFirst.addClass('animate')
});

const doLoadingAnimation = () => {
	$animationContainer.each(function(index, el) {
		const $animations = $(el).find('.js-init-animation');

		if ($(this).hasClass('active')) {
			$animations.addClass('animate');
		} else {
			$animations.removeClass('animate');
		}
	});
}

// Animation For Mobile

if ($win.width() < 1024) {
	$animationContainer.each(function(index, el) {
		const $this = $(this);
		const $animations = $(el).find('.js-init-animation');
		let space = 400;

		$win.on('scroll', function() {
			const scroll = $win.scrollTop() + $win.height();
			const offset = $this.offset().top;

			if (offset < scroll - space) {
				$animations.addClass('animate');
			} else {
				$animations.removeClass('animate');
			}
		});
	});
}

// Scroll To Section And Change Hash For Mobile

if ($win.width() < 1024) {
	const hashCheck = () => {
		$('.js-scroll-to').on('click', function(event) {
			event.preventDefault()

			let hash = this.hash;
			let scrollTo = $(this).attr('href');

			$('html, body').animate({
				scrollTop: $(scrollTo).offset().top,
			}, 500, function () {
				window.location.hash = hash;
			})
		});
	}

	hashCheck();

	$win.on('hashchange', hashCheck);
}

// Toggle Nav

const $navTrigger = $('.js-nav-trigger');
const $nav = $('.js-nav');

$navTrigger.on('click', function(event) {
	event.preventDefault();
	$(this).toggleClass('is-hidden');
	$('.bar').toggleClass('is-open');

	$nav.slideToggle();
});

// Tabs

$('.tabs__nav a').on('click', function(event) {
	event.preventDefault();
	const $this = $(this);
	const target = $this.attr('href');

	$this.parent()
		.add($(target))
		.addClass('is-active')
		.siblings()
		.removeClass('is-active');
});

// Dropdown

const $dropdown = $('.dropdown');
const $trigger = $dropdown.find(' > a');
const $dropdownContent = $dropdown.find(' > ul');

$trigger.on('click', function(event) {
	event.preventDefault();
	$dropdownContent.slideToggle();
});

// Range Slider
$( '.js-range-slider' ).slider({
  range: 'min',
  value: 0,
  min: 1,
  max: 7000,
});


// Accordion

const $accordion = $('.accordion');
const $accordionTrigger = $accordion.find('.accordion__head');

//Handle the show/hide logic
$accordionTrigger.on('click', function (event) {
	$(this).next().stop().slideToggle()
		.parent().toggleClass('is-active')
		.siblings().removeClass('is-active')
			.find('.accordion__body').slideUp();
});
