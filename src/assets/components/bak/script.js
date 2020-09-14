'use strict';

// Global components list
let components = window.components = {};

components.fonts = {
	selector: 'html',
	styles: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
};

components.mdi = {
	selector: '[class*="mdi"]',
	styles: '/assets/components/mdi/mdi.css'
};

components.accordion = {
	selector: '.accordion',
	script: [
		'/assets/components/jquery/jquery.min.js',
		'/assets/components/current-device/current-device.min.js',
		'/assets/components/multiswitch/multiswitch.min.js'
	],
	init: function ( nodes ) {
		nodes.forEach( function ( node ) {
			let
				items = node.querySelectorAll( '.accordion-item' ),
				click = device.ios() ? 'touchstart' : 'click';

			items.forEach( function ( item ) {
				let
					head = item.querySelector( '.accordion-head' ),
					body = item.querySelector( '.accordion-body' );

				MultiSwitch({
					node: head,
					targets: [ item, body ],
					isolate: node.querySelectorAll( '.accordion-head' ),
					state: item.classList.contains( 'active' ),
					event: click,
				});

				if ( !body.multiSwitchTarget.groups.active.state ) body.style.display = 'none';

				body.addEventListener( 'switch:active', function () {
					let $this = $( this );

					if ( this.multiSwitchTarget.groups.active.state ) {
						$this.stop().slideDown( 300 );
					} else {
						$this.stop().slideUp( 300 );
					}
				});
			});
		});
	}
};

components.animate = {
	selector: '[data-animate]',
	script: '/assets/components/current-device/current-device.min.js',
	init: function ( nodes ) {
		let observer = new IntersectionObserver( function ( entries, observer ) {
			entries.forEach( function ( entry ) {
				let node = entry.target;

				if ( entry.isIntersecting ) {
					node.animationStart();
					observer.unobserve( node );
				}
			});
		});

		nodes.forEach( function ( node ) {
			let params = parseJSON( node.getAttribute( 'data-animate' ) );
			params.class = params.class ? [ 'animated' ].concat( params.class ) : [ 'animated' ];
			if ( params.delay ) { node.style.animationDelay = params.delay; }
			if ( params.duration ) { node.style.animationDuration = params.duration; }

			node.animationStart = ( function () {
				this.classList.add.apply( this.classList, params.class );
			}).bind( node );

			observer.observe( node );
		});
	}
};

components.countdown = {
	selector: '[data-countdown]',
	script: [
		'/assets/components/progress-circle/progress-circle.min.js',
		'/assets/components/countdown/countdown.min.js'
	],
	init: function ( nodes ) {
		nodes.forEach( function ( node ) {
			new Countdown( strictMerge({
				node: node,
				from: null,
				to: null,
				count: 'auto',
				tick: 100
			}, parseJSON( node.getAttribute( 'data-countdown' ) ) ) );
		} )
	}
};

components.counter = {
	selector: '[data-counter]',
	script: '/assets/components/counter/counter.min.js',
	init: function ( nodes ) {
		let observer = new IntersectionObserver( function ( entries, observer ) {
			entries.forEach( function ( entry ) {
				let node = entry.target;

				if ( entry.isIntersecting ) {
					node.counter.run();
					observer.unobserve( node );
				}
			});
		}, {
			rootMargin: '0px',
			threshold: 1.0
		});

		nodes.forEach( function ( node ) {
			let counter = new bCounter( Object.assign( {
				node: node,
				duration: 1000,
				autorun: false
			}, parseJSON( node.getAttribute( 'data-counter' ) ) ) );

			if ( window.xMode ) {
				counter.run();
			} else {
				observer.observe( node );
			}
		})
	}
};

// components.blotter = {
// 	selector: '#blotter',
// 	script: [
// 		'/assets/components/jquery/jquery.min.js',
// 		'/assets/components/blotter/blotter.min.js',
// 		'/assets/components/blotter/liquidDistortMaterial.js'
// 	],
// 	init: function () {
// 		let text = new Blotter.Text( 'observation', {
// 			family : "'EB Garamond', serif",
// 			size : 120,
// 			fill : "#fff"
// 		});
//
// 		var material = new Blotter.LiquidDistortMaterial();
//
// 		material.uniforms.uSpeed.value = 0;
//
// 		let blotter = new Blotter( material, {
// 			texts : text
// 		});
//
// 		let
// 			elem = document.getElementById( 'blotter' ),
// 			scope = blotter.forText( text );
//
// 		scope.appendTo( elem );
//
// 		elem.addEventListener( 'mouseover', function() {
// 			material.uniforms.uSpeed.value = 0.25;
// 		} );
//
// 		elem.addEventListener( 'mouseleave', function() {
// 			material.uniforms.uSpeed.value = 1;
// 		} );
// 	}
// };

// TODO move to blurb component
components.currentDevice = {
	selector: 'html',
	script: '/assets/components/current-device/current-device.min.js'
};

components.fullpage = {
	selector: '.fullpage',
	script: [
		'/assets/components/jquery/jquery.min.js',
		'/assets/components/fullpage/fullpage.min.js',
		'/assets/components/util/util.min.js'
	],
	init: function ( nodes ) {
		nodes.forEach( function ( node ) {
			let
				timerId = null,
				animationIsFinished = false,
				state = null,
				newState = null,
				defaults = {
					navigation: true,
					navigationPosition: 'left',
					easingcss3: 'ease-in',
					// afterLoad: function ( anchorLink, index ) {
					// 	let
					// 		section = node.children[ index - 1 ],
					// 		animations = section.querySelectorAll( '[data-animate], .layer' );
					//
					// 	if ( animations.length ) {
					// 		animations.forEach( function ( node ) {
					// 			node.animate();
					// 		});
					// 	}
					//
					// 	animationIsFinished = false;
					// },
					// onLeave: function( index, nextIndex ) {
					// 	if ( !animationIsFinished && !timerId ) {
					// 		let
					// 			section = node.children[ index - 1 ],
					// 			animations = section.querySelectorAll( '[data-animate], .layer' );
					//
					// 		if ( animations.length ) {
					// 			animations.forEach( function ( node ) {
					// 				node.reanimate();
					// 			});
					// 		}
					//
					// 		timerId = setTimeout( function() {
					// 			animationIsFinished = true;
					// 			$.fn.fullpage.moveTo( nextIndex );
					// 			timerId = null;
					// 		}, 600 );
					// 	}
					//
					// 	return animationIsFinished;
					// }
				},
				mobile = {
					navigation: false,
					paddingTop: '60px'
				},
				resizeHandler = function () {
					if ( window.matchMedia("( min-width: 1200px )").matches ) {
						newState = 'desktop';
					} else {
						newState = 'mobile';
					}

					if ( state !== newState ) {
						if ( document.documentElement.classList.contains( 'fp-enabled' ) ) $.fn.fullpage.destroy( 'all' );
						state = newState;

						switch( state ) {
							case 'desktop':
								$( node ).fullpage( defaults );
								break;
							case 'mobile':
								$( node ).fullpage( Object.assign( defaults, mobile ) );
								break;
						}
					}
				};

			resizeHandler();
			window.addEventListener( 'resize', resizeHandler );
		});
	}
};

components.imageHover = {
	selector: '.image-hover',
	script: [
		'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js',
		'/assets/components/image-hover/three.min.js',
		'/assets/components/image-hover/hover.js'
	],
	init: function ( nodes ) {
		nodes.forEach( function ( node ) {
			let
				img = node.querySelector( 'img' ),
				imgSrcFrom = img.getAttribute( 'src' ),
				imgSrcTo = img.getAttribute( 'data-image-to' );

			new hoverEffect({
				parent: node,
				intensity: -0.2,
				speedIn: 1.2,
				image1: imgSrcFrom,
				image2: imgSrcTo ? imgSrcTo : imgSrcFrom,
				displacementImage: 'components/image-hover/displacement/4.png'
			});
		});
	}
};

components.lightgallery = {
	selector: '[data-lightgallery]',
	script: [
		'/assets/components/jquery/jquery.min.js',
		'/assets/components/lightgallery/lightgallery.min.js'
	],
	init: function ( nodes ) {
		if ( !window.xMode ) {
			nodes.forEach( function ( node ) {
				let
					$node = $( node ),
					params = merge( {
						selector: 'this',
						hash: false
					}, parseJSON( $node.attr( 'data-lightgallery' ) ) );

				if ( params.dynamic ) {
					node.addEventListener( 'click', function () {
						$node.lightGallery( params );
					});
				} else {
					$node.lightGallery( params );
				}
			});
		}
	}
};

components.modalBtn = {
	selector: '[data-modal-trigger]',
	dependencies: 'modal',
	init: function ( nodes ) {
		nodes.forEach( function ( node ) {
			let params = parseJSON( node.getAttribute( 'data-modal-trigger' ) );

			node.addEventListener( 'click', function () {
				let modal = document.querySelector( params.target );
				if ( modal.classList.contains( 'show' ) ) {
					$( modal ).modal( 'hide' );
				} else {
					$( modal ).modal( 'show' );
				}
			});
		});
	}
};

components.modal = {
	selector: '.modal',
	script: [
		'/assets/components/jquery/jquery.min.js',
		'/assets/components/bootstrap/js/popper.min.js',
		'/assets/components/bootstrap/js/bootstrap.min.js'
	],
	init: function ( nodes ) {
		nodes.forEach( function ( node ) {
			$( node ).modal({
				show: false,
				focus: false
			});
		});
	}
};

components.multiswitch = {
	selector: '[data-multi-switch]',
	script: [
		'/assets/components/current-device/current-device.min.js',
		'/assets/components/multiswitch/multiswitch.min.js'
	],
	dependencies: 'rdNavbar',
	init: function ( nodes ) {
		let click = device.ios() ? 'touchstart' : 'click';

		nodes.forEach( function ( node ) {
			if ( node.tagName === 'A' ) {
				node.addEventListener( click, function ( event ) {
					event.preventDefault();
				});
			}

			MultiSwitch( Object.assign( {
				node: node,
				event: click,
			}, parseJSON( node.getAttribute( 'data-multi-switch' ) ) ) );
		});
	}
};

components.nav = {
	selector: '.nav',
	script: [
		'/assets/components/jquery/jquery.min.js',
		'/assets/components/bootstrap/js/popper.min.js',
		'/assets/components/bootstrap/js/bootstrap.min.js'
	],
	init: function ( nodes ) {
		nodes.forEach( function ( node ) {
			$( node ).on( 'click', function ( event ) {
				event.preventDefault();
				$( this ).tab( 'show' );
			});

			$( node ).find( 'a[data-toggle="tab"]' ).on( 'shown.bs.tab', function () {
				window.dispatchEvent( new Event( 'resize' ) );
			});
		});
	}
};

components.owl = {
	selector: '.owl-carousel',
	script: [
		'/assets/components/jquery/jquery.min.js',
		'/assets/components/owl-carousel/owl.carousel.min.js',
		'/assets/components/util/util.min.js'
	],
	init: function ( nodes ) {
		nodes.forEach( function ( node ) {
			let
				params = parseJSON( node.getAttribute( 'data-owl' ) ),
				defaults = {
					items: 1,
					margin: 30,
					loop: true,
					mouseDrag: true,
					stagePadding: 0,
					nav: false,
					navText: [],
					dots: false,
					autoplay: true,
					autoplayHoverPause: true
				},
				xMode = {
					autoplay: false,
					loop: false,
					mouseDrag: false
				};

			node.owl = $( node );

			let tmp = Util.merge( window.xMode ? [ defaults, params, xMode ] : [ defaults, params ] );

			$( node ).owlCarousel( tmp );
		});
	}
};

components.pageReveal = {
	selector: 'html',
	init: function( nodes ) {
		window.addEventListener( 'components:ready', function () {
			window.dispatchEvent( new CustomEvent( 'resize' ) );
			document.documentElement.classList.add( 'components-ready' );

			setTimeout( function() {
				document.documentElement.classList.add( 'page-loaded' );
			}, 300 );
		}, { once: true } );
	}
};


components.rdNavbar = {
	selector: '.rd-navbar',
	script: [
		'/assets/components/jquery/jquery.min.js',
		'/assets/components/util/util.min.js',
		'/assets/components/current-device/current-device.min.js',
		'/assets/components/rd-navbar/rd-navbar.min.js'
	],
	dependencies: 'currentDevice',
	init: function ( nodes ) {
		nodes.forEach( function ( node ) {
			let
				backButtons = node.querySelectorAll( '.navbar-navigation-back-btn' ),
				params = parseJSON( node.getAttribute( 'data-rd-navbar' ) ),
				defaults = {
					stickUpClone: false,
					anchorNav: true,
					autoHeight: false,
					stickUpOffset: '1px',
					responsive: {
						0: {
							layout: 'rd-navbar-fixed',
							deviceLayout: 'rd-navbar-fixed',
							focusOnHover: 'ontouchstart' in window,
							stickUp: false
						},
						992: {
							layout: 'rd-navbar-fixed',
							deviceLayout: 'rd-navbar-fixed',
							focusOnHover: 'ontouchstart' in window,
							stickUp: false
						},
						1200: {
							layout: 'rd-navbar-fullwidth',
							deviceLayout: 'rd-navbar-fullwidth',
							stickUp: true,
							stickUpOffset: '1px'
						}
					},
					callbacks: {
						onStuck: function () {
							document.documentElement.classList.add( 'rd-navbar-stuck' );
						},
						onUnstuck: function () {
							document.documentElement.classList.remove( 'rd-navbar-stuck' );
						},
						onDropdownToggle: function () {
							if ( this.classList.contains( 'opened' ) ) {
								this.parentElement.classList.add( 'overlaid' );
							} else {
								this.parentElement.classList.remove( 'overlaid' );
							}
						},
						onDropdownClose: function () {
							this.parentElement.classList.remove( 'overlaid' );
						}
					}
				},
				xMode = {
					stickUpClone: false,
					anchorNav: false,
					responsive: {
						0: {
							stickUp: false,
							stickUpClone: false
						},
						992: {
							stickUp: false,
							stickUpClone: false
						},
						1200: {
							stickUp: false,
							stickUpClone: false
						}
					},
					callbacks: {
						onDropdownOver: function () { return false; }
					}
				},
				navbar = node.RDNavbar = new RDNavbar( node, Util.merge( window.xMode ? [ defaults, params, xMode ] : [ defaults, params ] ) );

			if ( backButtons.length ) {
				backButtons.forEach( function ( btn ) {
					btn.addEventListener( 'click', function () {
						let
							submenu = this.closest( '.rd-navbar-submenu' ),
							parentmenu = submenu.parentElement;

						navbar.dropdownToggle.call( submenu, navbar );
					});
				});
			}
		})
	}
};

components.slick = {
	selector: '.slick-slider',
	script: [
		'/assets/components/jquery/jquery.min.js',
		'/assets/components/slick/slick.min.js',
		'/assets/components/util/util.min.js'
	],
	init: function ( nodes ) {
		nodes.forEach( function ( node ) {
			let
				defaults = {
					autoplay:  true,
					prevArrow: '<button type="button" class="slick-prev"></button>',
					nextArrow: '<button type="button" class="slick-next"></button>'
				},
				breakpoint = { xs: 480, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1600 }, // slick slider uses desktop first principle
				responsive = [],
				params;

			// Making responsive parameters
			for ( let key in breakpoint ) {
				if ( node.hasAttribute( 'data-slick-' + key ) ) {
					responsive.push({
						breakpoint: breakpoint[ key ],
						settings: parseJSON( node.getAttribute( 'data-slick-' + key ) )
					});
				}
			}

			params = {
				responsive: responsive
			};

			let tmp = Util.merge( [ defaults, params ] );

			$( node ).slick( tmp );

			// Filtering
			let links = document.querySelectorAll( '.slick-filter-link' );
			links.forEach( function( element ) {
				element.addEventListener( 'click', function () {
					let filter = element.getAttribute( 'data-filter' );
					$( node ).slick( 'slickUnfilter' );
					if( filter !== '*' ) {
						$( node ).slick( 'slickFilter', '[data-category="' + filter + '"]' );
					}
				});
			});
		});
	}
};

components.swiper = {
	selector: '.swiper-container',
	script: [
		'/assets/components/swiper/swiper.min.js',
		'/assets/components/swiper/swiper-progress-circle.min.js',
		'/assets/components/util/util.min.js'
	],
	init: function ( nodes ) {
		nodes.forEach( function ( node ) {

			// Pagination decimal leading zero
			function pad( number, length ) {
				let str = '' + number;
				while ( str.length < length ) {
					str = '0' + str;
				}

				return str;
			}

			/**
			 * Update of secondary numeric pagination
			 * @this {object}  - swiper instance
			 */
			function updSwiperNumericPagination() {
				if ( this.el.querySelector( '.swiper-counter' ) ) {
					this.el.querySelector('.swiper-counter')
							.innerHTML = '<span class="swiper-counter-count">' +  formatIndex((this.realIndex + 1)) + '</span><span class="swiper-counter-divider"></span><span class="swiper-counter-total">' + formatIndex((this.slides.length)) + '</span>';
				}
			}
			function formatIndex(index) {
				return index < 10 ? '0' + index : index;
			}

			let
				slides = node.querySelectorAll( '.swiper-slide[data-slide-bg]' ),
				animate = node.querySelectorAll( '.swiper-wrapper [data-caption-animate]' ),
				videos = node.querySelectorAll( '.swiper-wrapper video' ),
				pagOrdered = node.querySelector( '.swiper-pagination[data-pagination-ordered]' ),
				pagProgress = node.querySelector( '.swiper-pagination[data-pagination-progress]' ),
				progress,
				timer,
				params = merge({
					speed: 500,
					loop: true,
					autoHeight: false,
					pagination: {
						el: '.swiper-pagination',
						clickable: true,
						renderBullet: function ( index, className ) {
							return (
								'<span class="' + className + '">' +
								( pagOrdered ? pad( ( index + 1 ), 2 ) : '' ) +
								( pagProgress ?
									'<svg class="swiper-progress" x="0px" y="0px" width="100" height="100" viewbox="0 0 100 100">' +
									'<circle class="swiper-progress-bg" cx="50" cy="50" r="50"></circle>' +
									'<circle class="swiper-progress-dot" cx="50" cy="50" r="14"></circle>' +
									'<circle class="clipped" cx="50" cy="50" r="48"></circle>' +
									'</svg>' : '' ) +
								'</span>'
							)
						}
					},
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					},
					scrollbar: {
						el: '.swiper-scrollbar'
					},
					autoplay: {
						delay: 5000,
						disableOnInteraction: false
					},
					on: {

						init: updSwiperNumericPagination,
						slideChange: updSwiperNumericPagination,
						paginationUpdate: function() {
							if( pagProgress ) {
								let
									bullets = pagProgress.querySelectorAll( '.swiper-pagination-bullet' ),
									bulletActive = pagProgress.querySelector( '.swiper-pagination-bullet-active .swiper-progress' );

								progress = new aProgressCircle({ node: bulletActive });
								timer = new VirtualTimer({ onTick: function () {
									progress.render( this.progress / this.duration * 360 );
								}});

								timer.reset();
								timer.duration = this.originalParams.autoplay.delay - 100;
								timer.start();

								bullets.forEach( function( bullet ) {
									bullet.addEventListener( 'click', function() {
										timer.stop();
									} )
								} );
							}
						},
						sliderMove: function() {
							timer.stop();
							timer.reset();
						}
					}
				}, parseJSON( node.getAttribute( 'data-swiper' ) ) );

			// Specific params for Novi builder
			if ( window.xMode ) {
				params = merge( params, {
					autoplay: false,
					loop: false,
					simulateTouch: false
				});
			}

			// Set background image for slides with `data-slide-bg` attribute
			slides.forEach( function ( slide ) {
				slide.style.backgroundImage = 'url('+ slide.getAttribute( 'data-slide-bg' ) +')';
			});

			// Animate captions with `data-caption-animate` attribute
			if ( animate.length ) {
				if ( !params.on ) params.on = {};
				params.on.transitionEnd = function () {
					let
						active = this.wrapperEl.children[ this.activeIndex ],
						prev = this.wrapperEl.children[ this.previousIndex ];

					active.querySelectorAll( '[data-caption-animate]' ).forEach( function ( node ) {
						node.classList.add( node.getAttribute( 'data-caption-animate' ) );
						node.classList.add( 'animated' );
					});

					prev.querySelectorAll( '[data-caption-animate]' ).forEach( function ( node ) {
						node.classList.remove( node.getAttribute( 'data-caption-animate' ) );
						node.classList.remove( 'animated' );
					})
				}
			}

			// Stop video on inactive slides
			if ( videos.length ) {
				if ( !params.on ) params.on = {};
				params.on.transitionStart = function () {
					let
						active = this.wrapperEl.children[ this.activeIndex ],
						prev = this.wrapperEl.children[ this.previousIndex ];

					active.querySelectorAll( 'video' ).forEach( function ( video ) { if ( video.paused ) video.play(); });
					prev.querySelectorAll( 'video' ).forEach( function ( video ) { if ( !video.paused ) video.pause(); })
				}
			}

			// Initialization if there are related swipers
			if ( params.thumbs && params.thumbs.swiper ) {
				let target = document.querySelector( params.thumbs.swiper );

				if ( !target.swiper ) {
					target.addEventListener( 'swiper:ready', function () {
						params.thumbs.swiper = target.swiper;
						new Swiper( node, params );
						node.dispatchEvent( new CustomEvent( 'swiper:ready' ) );
					});
				} else {
					params.thumbs.swiper = target.swiper;
					new Swiper( node, params );
					node.dispatchEvent( new CustomEvent( 'swiper:ready' ) );
				}
			} else {
				new Swiper( node, params );
				node.dispatchEvent( new CustomEvent( 'swiper:ready' ) );
			}
		});
	}
};

components.regula = {
	selector: '[data-constraints]',
	script: [
		'/assets/components/jquery/jquery.min.js',
		'/assets/components/regula/regula.min.js'
	],
	init: function ( nodes ) {
		let elements = $( nodes );

		// Custom validator - phone number
		regula.custom({
			name: 'PhoneNumber',
			defaultMessage: 'Invalid phone number format',
			validator: function() {
				if ( this.value === '' ) return true;
				else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test( this.value );
			}
		});

		for (let i = 0; i < elements.length; i++) {
			let o = $(elements[i]), v;
			o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
			v = o.parent().find(".form-validation");
			if (v.is(":last-child")) o.addClass("form-control-last-child");
		}

		elements.on('input change propertychange blur', function (e) {
			let $this = $(this), results;

			if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
			if ($this.parents('.rd-mailform').hasClass('success')) return;

			if (( results = $this.regula('validate') ).length) {
				for (let i = 0; i < results.length; i++) {
					$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
				}
			} else {
				$this.siblings(".form-validation").text("").parent().removeClass("has-error")
			}
		}).regula('bind');

		let regularConstraintsMessages = [
			{
				type: regula.Constraint.Required,
				newMessage: "The text field is required."
			},
			{
				type: regula.Constraint.Email,
				newMessage: "The email is not a valid email."
			},
			{
				type: regula.Constraint.Numeric,
				newMessage: "Only numbers are required"
			},
			{
				type: regula.Constraint.Selected,
				newMessage: "Please choose an option."
			}
		];


		for (let i = 0; i < regularConstraintsMessages.length; i++) {
			let regularConstraint = regularConstraintsMessages[i];

			regula.override({
				constraintType: regularConstraint.type,
				defaultMessage: regularConstraint.newMessage
			});
		}
	}
};

components.tooltip = {
	selector: '[data-toggle="tooltip"]',
	script: [
		'/assets/components/jquery/jquery.min.js',
		'/assets/components/bootstrap/js/popper.min.js',
		'/assets/components/bootstrap/js/bootstrap.min.js'
	],
	init: function( nodes ) {
		nodes.forEach( function ( node ) {
			$( node ).tooltip();
		} );
	}
};

components.preloader = {
	selector: '.preloader',
};

components.toTop = {
	selector: 'html',
	script: '/assets/components/jquery/jquery.min.js',
	init: function () {
		if ( !window.xMode ) {
			let node = document.createElement( 'div' );
			node.className = 'to-top mdi-chevron-up';
			document.body.appendChild( node );

			node.addEventListener( 'mousedown', function () {
				this.classList.add( 'active' );

				$( 'html, body' ).stop().animate( { scrollTop:0 }, 500, 'swing', (function () {
					this.classList.remove( 'active' );
				}).bind( this ));
			});

			document.addEventListener( 'scroll', function () {
				if ( window.scrollY > window.innerHeight ) node.classList.add( 'show' );
				else node.classList.remove( 'show' );
			});
		}
	}
};

/**
 * Wrapper to eliminate json errors
 * @param {string} str - JSON string
 * @returns {object} - parsed or empty object
 */
function parseJSON ( str ) {
	try {
		if ( str )  return JSON.parse( str );
		else return {};
	} catch ( error ) {
		console.warn( error );
		return {};
	}
}

/**
 * Get tag of passed data
 * @param {*} data
 * @return {string}
 */
function objectTag ( data ) {
	return Object.prototype.toString.call( data ).slice( 8, -1 );
}

/**
 * Merging of two objects
 * @param {Object} source
 * @param {Object} merged
 * @return {Object}
 */
function merge( source, merged ) {
	for ( let key in merged ) {
		let tag = objectTag( merged[ key ] );

		if ( tag === 'Object' ) {
			if ( typeof( source[ key ] ) !== 'object' ) source[ key ] = {};
			source[ key ] = merge( source[ key ], merged[ key ] );
		} else if ( tag !== 'Null' ) {
			source[ key ] = merged[ key ];
		}
	}

	return source;
}

/**
 * Strict merging of two objects. Merged only parameters from the original object and with the same data type. Merge only simple data types, arrays and objects.
 * @param source
 * @param merged
 * @return {object}
 */
function strictMerge( source, merged ) {
	for ( let key in source ) {
		let
			sTag = objectTag( source[ key ] ),
			mTag = objectTag( merged[ key ] );

		if ( [ 'Object', 'Array', 'Number', 'String', 'Boolean', 'Null', 'Undefined' ].indexOf( sTag ) > -1 ) {
			if ( sTag === 'Object' && sTag === mTag ) {
				source[ key ] = strictMerge( source[ key ], merged[ key ] );
			} else if ( mTag !== 'Undefined' && ( sTag === 'Undefined' || sTag === 'Null' || sTag === mTag ) ) {
				source[ key ] = merged[ key ];
			}
		}
	}

	return source;
}


// Main
window.addEventListener( 'load', function () {
	new ZemezCore({
		debug: true,
		components: components,
		observeDOM: window.xMode,
		IEHandler: function ( version ) {
			document.documentElement.classList.add( 'ie-'+ version );
		}
	});
});
