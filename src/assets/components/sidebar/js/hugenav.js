/*
 *    Huge Nav v1.0
 *    by CoderExperts
 *    Author: Sayfur Rahman
 *    Author URI: http://coderexperts.com/
 *    Template URI: http://coderexperts.com/
 */
(function($) {
	"use strict";
	//
	// Huge Nav One Pager Animation
	// 
	$('.hugenav li>a[href*="#"]:not([href="#"])').on('click', function() {
		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
		if (target.length) {
			$('html, body').animate({
				scrollTop: target.offset().top
			}, 1000);
			return false;
		}
	}); // Huge Nav One Pager Animation END
	
	//
	// Huge Nav Sidebar Menu
	// 
	$("nav.navbar.hugenav .hugeNav-account").each(function() {
		$("li.hugeNav-sideMenu > a", this).on("click", function(e) {
			e.preventDefault();
			$("nav.navbar.hugenav > .hugeNav-sidebarMenuContent").toggleClass("on");
			if ($("nav.navbar.hugenav > .hugeNav-sidebarMenuContent").hasClass("sideBar-leftOpen")) {
				$("body").toggleClass("leftOpen-hugeNav-sidebarMenuContent");
			} else {
				$("body").toggleClass("on-hugeNav-sidebarMenuContent");
			}
		});
	});
	$(".hugeNav-sidebarMenuContent .close-hugeNav-sidebarMenuContent").on("click", function(e) {
		e.preventDefault();
		$("nav.navbar.hugenav > .hugeNav-sidebarMenuContent").removeClass("on");
		if ($("nav.navbar.hugenav > .hugeNav-sidebarMenuContent").hasClass("sideBar-leftOpen")) {
			$("body").removeClass("leftOpen-hugeNav-sidebarMenuContent");
		} else {
			$("body").removeClass("on-hugeNav-sidebarMenuContent");
		}
	}); // Huge Nav Sidebar Menu END
	
	
	//
	// Huge Nav Multi DropDown Option
	// 
	$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(this).parent().siblings().removeClass('open');
		$(this).parent().toggleClass('open');
	}); // Huge Nav Multi DropDown Option END
	
	
	//
	// Huge Nav DropDown Option open when click something like Accordin
	//	
	window.prettyPrint && prettyPrint()
	$(document).on('click', '.hugenav .dropdown-menu', function(e) {
		e.stopPropagation()
	}); // Huge Nav DropDown Option open when click something like Accordin END
	
	
	var hugenav = {
		initialize: function() {
			this.hoverDropdown();
		},
		function() {
			// ------------------------------------------------------------------------------ //
			// Huge Sidebar Wrapper
			// ------------------------------------------------------------------------------ //
			$("body").wrapInner("<div class='huge-sidebarWrap'></div>");
		},
		// ------------------------------------------------------------------------------ //
		// Change dropdown to hover on dekstop
		// ------------------------------------------------------------------------------ //
		hoverDropdown: function() {
			var getNav = $("nav.navbar.hugenav.hover"),
				getWindow = $(window).width(),
				getHeight = $(window).height(),
				getIn = getNav.find("ul.nav").data("in"),
				getOut = getNav.find("ul.nav").data("out");
			if (getWindow > 991) {
				// Hover effect Default Menu
				$("nav.navbar.hugenav.hover ul.nav").each(function() {
					$("a.dropdown-toggle", this).off('click');
					$("a.dropdown-toggle", this).on('click', function(e) {
						e.stopPropagation();
					});
					$(".hugeNav-megamenu", this).each(function() {
						$(".title", this).off("click");
						$("a.dropdown-toggle", this).off("click");
						$(".content").removeClass("animated");
					});
					$(".dropdown-menu", this).addClass("animated");
					$("li.dropdown", this).on("mouseenter", function() {
						$(".dropdown-menu", this).eq(0).removeClass(getOut);
						$(".dropdown-menu", this).eq(0).stop().fadeIn().addClass(getIn);
						$(this).addClass("on");
						return false;
					});
					$("li.dropdown", this).on("mouseleave", function() {
						$(".dropdown-menu", this).eq(0).removeClass(getIn);
						$(".dropdown-menu", this).eq(0).stop().fadeOut().addClass(getOut);
						$(this).removeClass("on");
					});
					$(this).on("mouseleave", function() {
						$(".dropdown-menu", this).removeClass(getIn);
						$(".dropdown-menu", this).eq(0).stop().fadeOut(3000).addClass(getOut);
						$("li.dropdown", this).removeClass("on");
						return false;
					});
				});
				// ------------------------------------------------------------------------------ //
				// Hover effect Atribute Navigation
				// ------------------------------------------------------------------------------ //
				$("nav.navbar.hugenav.hover .hugeNav-account").each(function() {
					$("a.dropdown-toggle", this).off('click');
					$("a.dropdown-toggle", this).on('click', function(e) {
						e.stopPropagation();
					});
					$(".dropdown-menu", this).addClass("animated");
					$("li.dropdown", this).on("mouseenter", function() {
						$(".dropdown-menu", this).eq(0).removeClass(getOut);
						$(".dropdown-menu", this).eq(0).stop().fadeIn().addClass(getIn);
						$(this).addClass("on");
						return false;
					});
					$("li.dropdown", this).on("mouseleave", function() {
						$(".dropdown-menu", this).eq(0).removeClass(getIn);
						$(".dropdown-menu", this).eq(0).stop().fadeOut().addClass(getOut);
						$(this).removeClass("on");
					});
				});
			}
		},
	};
	
	
	//
	// Huge Nav Sticky Top Option
	//
	if ($(".hugenav").hasClass("hugenav-stickyTop")) {
		var stickyNavTop = $('.hugenav-stickyTop').offset().top;
	}
	$(window).scroll(function() {
		if ($(window).scrollTop() > stickyNavTop) {
			$('.hugenav-stickyTop').addClass('navbar-fixed-top');
		} else {
			$('.hugenav-stickyTop').removeClass('navbar-fixed-top');
		}
	});
	// Huge Nav Sticky Top Option END
	
	
	// Initialize
	$(document).ready(function() {
		hugenav.initialize();
	});
}(jQuery));