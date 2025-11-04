$(document).ready(function () {
	var max_scroll = $(document).height() - ($(document).height() - $(window).height());
	var win_w = $(window).width();

	$(window).scroll(function () {
		var scrolled = $(window).scrollTop();

		var new_width = (win_w * scrolled) / max_scroll;
		$("#statusbar").css({
			width: new_width
		});
	});
});

$(function () {
	const $scrollContainer = $(".scroll-container");
	const $horizontalSection = $(".horizontal-section");

	let containerOffsetTop = 0;
	let containerHeight = 0;

	function updateSizes() {
		containerOffsetTop = $scrollContainer.offset().top;
		containerHeight = $scrollContainer.outerHeight() - $(window).height();
	}

	updateSizes();
	$(window).on("resize", updateSizes);

	$(window).on("scroll", function () {
		const scrolled = $(window).scrollTop();
		let scrollPercentage = 0;

		if (
			scrolled > containerOffsetTop &&
			scrolled < containerOffsetTop + containerHeight
		) {
			scrollPercentage = (scrolled - containerOffsetTop) / containerHeight;
		} else if (scrolled >= containerOffsetTop + containerHeight) {
			scrollPercentage = 1;
		}

		const maxScroll = $horizontalSection.outerWidth() - $(window).width();
		const horizontalScroll = scrollPercentage * maxScroll;

		$horizontalSection.css("transform", `translateX(-${horizontalScroll}px)`);
	});

	const $scrollContainerR = $(".scroll-container-reverse");
	const $horizontalSectionR = $(".horizontal-section-reverse");

	let containerOffsetTopR = 0;
	let containerHeightR = 0;

	function updateSizesR() {
		containerOffsetTopR = $scrollContainerR.offset().top;
		containerHeightR = $scrollContainerR.outerHeight() - $(window).height();
	}

	updateSizesR();
	$(window).on("resize", updateSizesR);

	function applyScrollR() {
		const scrolled = $(window).scrollTop();
		let scrollPercentage = 0;

		if (
			scrolled > containerOffsetTopR &&
			scrolled < containerOffsetTopR + containerHeightR
		) {
			scrollPercentage = (scrolled - containerOffsetTopR) / containerHeightR;
		} else if (scrolled >= containerOffsetTopR + containerHeightR) {
			scrollPercentage = 1;
		}

		const maxScroll = $horizontalSectionR.outerWidth() - $(window).width();
		// 初始位置：向左位移 maxScroll (顯示第一個項目)，隨著 scrollPercentage 增加，位移趨近於 0
		const horizontalScroll = -maxScroll + scrollPercentage * maxScroll;

		$horizontalSectionR.css("transform", `translateX(${horizontalScroll}px)`);
	}

	// apply on load/resize/scroll
	applyScrollR();
	$(window).on("resize scroll", applyScrollR);
});