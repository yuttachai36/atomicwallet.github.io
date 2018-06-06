class Page {
    constructor() {
        $(document).ready(_=> {
            this.scrollList();
            this.downloadButton();
            this.swipe();
            this.mobileMenu()
        });
    }

    scrollList() {
        let functionOnScroll = () => {
            let list = $('#list'),
                windowHeight = window.innerHeight,
                scrollBottom = window.pageYOffset + windowHeight,
                offsetTop = list.offset().top,
                overviewHeight = list.parent().height(),
                fullHeight = list.outerHeight(),
                maxMargin = fullHeight - overviewHeight,
                startScroll = ~~(offsetTop + windowHeight * 0.8),
                finishScroll = ~~(offsetTop + windowHeight + overviewHeight + windowHeight * 0.1),
                startFinishDiff = finishScroll - startScroll;

            if(scrollBottom > startScroll && scrollBottom < finishScroll) {
                let percentScroll = (scrollBottom - startScroll) * 100 / startFinishDiff;
                list.css('margin-top', -(maxMargin * percentScroll / 100) + 'px');
            } else if(scrollBottom >= finishScroll) {
                list.css('margin-top', -maxMargin + 'px');
            }
        };

        window.onscroll = functionOnScroll;
        functionOnScroll();
    }

    downloadButton() {
        this.openDownload = false;

        let link = $('[data-download-link]'),
            list = $('[data-download-list]'),
            checkbox = $('#product-button-checkbox');

        $('[data-download]').click(ev => {
            let el = $(ev.target),
                elClone = el.clone(true, true);

            if(el.index() === 0) return;
            checkbox.prop('checked', checkbox.is('checked'));
            link.attr('href', el.attr('data-download'));

            el.remove();
            list.prepend(elClone);
        });

        checkbox.bind('change', () => {
            this.openDownload = checkbox.prop('checked');
            console.log(this.openDownload);
        });

        $('body').click(ev => {
            if(this.openDownload && !$(ev.target).hasClass('product-button-list-item') && !$(ev.target).hasClass('product-button-checkbox')) {
                checkbox.prop('checked', false);
            }
        });
    }

    swipe() {
        $('[data-swipe]').each((i, el) => {
            el = $(el);
            let width = el.width(),
                swipedEl = el.find('.media-list'),
                fullWidth = swipedEl.find('span').width(),
                maxMargin = ~~((fullWidth - width) / 2),
                startMargin = 0;

            el.swipe({
                swipeStatus: (event, phase, direction, distance) => {
                    if($(window).width() <= 700) {
                        if (phase === 'start') {
                            startMargin = ~~(swipedEl.css('margin-left').replace('px', ''));
                        }

                        distance *= direction === 'left' ? -1 : 1;
                        distance += startMargin;

                        if (distance > maxMargin) {
                            distance = maxMargin;
                        } else if (distance < -maxMargin) {
                            distance = -maxMargin;
                        }

                        swipedEl.css('margin-left', distance + 'px');
                    }
                },
                allowPageScroll: 'vertical'
            });
        });

        $(window).resize(_=> {
            $('[data-swipe] .media-list').css('margin-left', '0px');
        });
    }

    mobileMenu() {
        let menu = $('[data-menu="menu"]');

        $('[data-menu="button"]').click(_=> menu.toggleClass('header-menu-open'));

        $('body').click(ev => {
            if(!$(ev.target).hasClass('header-menu') && !$(ev.target).hasClass('header-menu-button')) {
                menu.removeClass('header-menu-open');
            }
        });
    }
}

new Page();