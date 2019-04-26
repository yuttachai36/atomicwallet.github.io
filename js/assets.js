

/* download */
class Download {
    constructor() {
        this.modalObj = qs('#downloadModal');
        this.buttonObj = qs('#downloadButton');
        this.formObj = qs('#downloadForm');
        this.typeObj = qs('#downloadType');
        this.emailObj = qs('#downloadEmail');
        this.html = qs('html');

        this.sending = false;

        if(this.modalObj) {
            this.binds();
        }
    }

    binds() {
        qsa('[data-download]').forEach(el => {
            el.onclick = ev => {
                ev.preventDefault();
                this.setStep(1);
                this.openModal(el.dataset.download);
                return false;
            };
        });

        this.modalObj.onclick = el => {
            if(el.target.classList.contains('modal') || el.target.classList.contains('container')) {
                this.modalClose();
            }
        };
        qs('[data-download-close]').onclick = _ => this.modalClose();

        // this.formObj.onsubmit = ev => {
        //     ev.preventDefault();
        //     this.send();
        //     return false;
        // }
    }

    openModal(type) {
        // this.typeObj.value = type.toLowerCase();
        this.modalObj.dataset.downloadType = type.toLowerCase();

        this.html.style.overflow = 'hidden';
        // this.html.style.position = 'fixed';
        this.modalObj.classList.add('modal-open');
    }

    modalClose() {
        this.html.style.overflow = 'auto';
        // this.html.style.position = 'relative';
        this.modalObj.classList.remove('modal-open')
    }

    send() {
        if(this.sending) return;

        this.sending = true;
        this.buttonObj.setAttribute('disabled', 'disabled');

        fetch(this.formObj.getAttribute('action'), {
            method: 'POST',
            body: new FormData(this.formObj)
        })
            .then(r => r.json())
            .then(r => {
                this.emailObj.value = '';
                this.sending = false;
                this.buttonObj.removeAttribute('disabled');

                if(r.status) {
                    this.setStep(2);
                } else {
                    alert(r.message);
                }
            });
    }

    setStep(step) {
        this.modalObj.classList.remove('modal-step-1');
        this.modalObj.classList.remove('modal-step-2');
        this.modalObj.classList.add('modal-step-' + step);
    }
}
/* /download */

/* table-list */
class TableList {
    constructor() {
        this.obj = $('#list-table');

        if(this.obj.length > 0) {
            this.itemsCol1Obj = this.obj.find('#list-table-items-1');
            this.itemsCol2Obj = this.obj.find('#list-table-items-2');
            this.preloader = this.obj.find('#list-table-preloader');
            this.searchObj = this.obj.find('#list-table-search');
            this.searchText = '';

            this.init();
        }
    }

    init() {
        $.getJSON( "assets.js", data => {
            this.items = data;

            this.refresh();
            this.binds();
        });
    }

    refresh() {
        this.itemsCol1Obj.html('');
        this.itemsCol2Obj.html('');

        for(let i in this.items) {
            let item = this.items[i];

            if(
                item.fullName.toLowerCase().includes(this.searchText.toLowerCase().trim())
                || item.name.toLowerCase().includes(this.searchText.toLowerCase().trim())
                || this.searchText === ''
            ) this.addItem(item);
        }

        this.preloader.remove();
    }

    addItem(item) {
        this.itemsCol1Obj.append(`
           <a href="${item.coinLink}" class="link-coins"> <div class="list-table-item" title="${item.fullName} (${item.name})">
                <img src="css/images/crypto-icon/${item.iconName}">
                <span class="list-table-fullname">${item.fullName}</span> <span class="list-table-abbname">${item.name}</span>
            </div></a>
        `);

        this.itemsCol2Obj.append(`
            <div class="list-table-row cfx">
                <div class="list-table-items-col"><span class="${item.status.send.class}"><span id="${item.status.coinID.text}-cap"></span></div>
                 <div class="list-table-items-col"><a href="${item.coinPriceLink}" class="link-coins"><span id="${item.status.coinID.text}"></span></a></div>
                <div class="list-table-items-col"><span id="${item.status.coinID.text}-volume"></span></div>
                <div class="list-table-items-col"><span id="${item.status.coinID.text}-change"></span><span>&nbsp %</span></div>
                <div class="list-table-items-col"><a href="${item.link}"<div class="wallet-list-item"><span class="wallet-list">Get Wallet</span></a></div></div>

            </div>
        `);
    }

    binds() {
        this.searchObj.on('input', () => {
            this.searchText = this.searchObj.val();
            this.refresh();
        });

        let width = this.obj.find('#list-table-width').width(),
            swipedEl = this.obj.find('#list-table-swiped'),
            fullWidth = swipedEl.find('#list-table-items-2').width(),
            maxMargin = fullWidth - width,
            startMargin = 0;

        this.obj.find('#list-table-swiped-zone').swipe({
            swipeStatus: (event, phase, direction, distance) => {
                if($(window).width() <= 830) {
                    if (phase === 'start') {
                        startMargin = ~~(swipedEl.css('margin-left').replace('px', ''));
                    }

                    distance *= direction === 'left' ? -1 : 1;
                    distance += startMargin;

                    if (distance > 0) {
                        distance = 0;
                    } else if (distance < -maxMargin) {
                        distance = -maxMargin;
                    }

                    if(distance == 0) {
                        this.obj.find('#list-table-width').addClass('start-swiped');
                    } else {
                        this.obj.find('#list-table-width').removeClass('start-swiped');
                    }

                    swipedEl.css('margin-left', distance + 'px');
                }
            },
            allowPageScroll: 'vertical'
        });
    }
}
/* /table-list */

document.addEventListener('DOMContentLoaded', () => {
    /* list */
    let listHide = true,
        $listAll = qs('#list-all'),
        $listFull = qs('#list-full'),
        $listFullDescription = qs('#list-full-description');

    if($listFull) {
        $listFull.onclick = _ => {
            let text = $listFull.dataset.text,
                textDescription = $listFullDescription.dataset.text;

            $listFull.dataset.text = $listFull.innerHTML;
            $listFull.innerHTML = text;

            $listFullDescription.dataset.text = $listFullDescription.innerHTML;
            $listFullDescription.innerHTML = textDescription;

            $listAll.classList.toggle('list-items-hide');
            listHide = !listHide;
        };
    }
    /* /list */

    /* slider */
    class Slider {
        constructor(el) {
            this.container = el.querySelector('[data-slider-container]');
            this.list = this.container.querySelector('[data-slider-list]');
            this.width = this.container.clientWidth,
            this.allWidth = this.list.clientWidth;
            this.step = 0;
            this.arrows = {
                left: el.querySelector('[data-slider-left]'),
                right: el.querySelector('[data-slider-right]')
            };

            this.arrows.left.onclick = _ => this.go('left');
            this.arrows.right.onclick = _ => this.go('right');

            window.onresize = this.reset;
            this.reset();
        }

        go(direction) {
            let margin = (this.list.currentStyle || window.getComputedStyle(this.list)).marginLeft.replace('px', '') * 1;

            if (direction === 'left') {
                margin += this.step;
            } else {
                margin -= this.step;
            }

            this.arrows.right.disabled = false;
            this.arrows.left.disabled = false;

            if (margin >= 0) {
                margin = 0;
                this.arrows.left.disabled = true;
            }

            if (margin <= -(this.allWidth - this.width)) {
                margin = -(this.allWidth - this.width);
                this.arrows.right.disabled = true;
            }

            this.list.style.marginLeft = margin + 'px';
        }

        reset() {
            let item = this.container.querySelector('.comments-item:nth-child(2)');
            this.step = item.clientWidth + (item.currentStyle || window.getComputedStyle(item)).marginLeft.replace('px', '') * 1;
            this.list.style.marginLeft = 0;

            if(this.width >= this.allWidth) {
                this.arrows.right.disabled = true;
                this.arrows.left.disabled = true;
            }
        }
    }
    let $slider = qsa('[data-slider]');

    if($slider) {
        $slider.forEach(el => new Slider(el));
    }
    /* /slider */

    /* menu-mobile */
    let $menu = qs('#menu-mobile'),
        body = qs('body');


    if($menu) {
        let MenuOpen = _=> {
            $menu.classList.remove('header-menu-close');
            body.style.overflow = 'hidden';
            body.style.overflowX = 'hidden';
        };
        let MenuClose = _=> {
            $menu.classList.add('header-menu-close');
            body.style.overflow = 'auto';
            body.style.overflowX = 'hidden';
        };

        let $menuLinks = qsa('#menu-mobile a');
        for (let i in $menuLinks) $menuLinks[i].onclick = MenuClose;

        qs('#menu-button-close').onclick = MenuClose;
        qs('#menu-button-open').onclick = MenuOpen;
    }
    /* /menu-mobile */

});

class Page {
    constructor() {
        $(document).ready(_=> {
            this.scrollList();
            this.swipe();

            new Download();
            new TableList();
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

        if($('#list').length > 0) {
            window.onscroll = functionOnScroll;
            functionOnScroll();
        }
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

}

let qs = q => document.querySelector(q);
let qsa = q => document.querySelectorAll(q);

const COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE = 0.05
const URL_BUY_LITECOIN_PAGE = 'buy-litecoin'
const URL_BUY_BITCOINCASH_PAGE = 'buy-bitcoin-cash'
const URL_BUY_BITCOIN_PAGE = 'buy-bitcoin'
const URL_BUY_RIPPLE_PAGE = 'buy-ripple'
const URL_BUY_ETHEREUM_PAGE = 'buy-ethereum'
const URL_BUY_ZCASH_PAGE = 'buy-zcash'
const URL_BUY_DOGECOIN_PAGE = 'buy-dogecoin'
const URL_BUY_NEO_PAGE = 'buy-neo'
const URL_BUY_TRON_PAGE = 'buy-tron'
const URL_BUY_STELLAR_PAGE = 'buy-stellar'

const URL_BUY_LITECOIN_PRICE_PAGE = 'litecoin-price'
const URL_BUY_BITCOINCASH_PRICE_PAGE = 'bitcoin-cash-price'
const URL_BUY_BITCOIN_PRICE_PAGE = 'bitcoin-price'
const URL_BUY_RIPPLE_PRICE_PAGE = 'ripple-price'
const URL_BUY_ETHEREUM_PRICE_PAGE = 'ethereum-price'
const URL_BUY_ETHEREUM_PRICE_PREDICTION_PAGE = 'ethereum-price-prediction'


const URL_BUY_NEO_PRICE_PAGE = 'neo-price'
const URL_BUY_DOGECOIN_PRICE_PAGE = 'dogecoin-price'
const URL_BUY_DOGECOIN_PRICE_PREDICTION_PAGE = 'dogecoin-price-prediction'
const URL_BUY_RIPPLE_PRICE_PREDICTION_PAGE = 'ripple-price-prediction'
const URL_BUY_ZCASH_PRICE_PAGE = 'zcash-price'
const URL_BUY_BTG_PRICE_PAGE = 'bitcoin-gold-price'
const URL_BUY_LITECOIN_PRICE_PREDICTION_PAGE = 'litecoin-price-prediction'
const URL_BUY_STELLAR_PRICE_PAGE = 'stellar-price'
const URL_BUY_TRON_PRICE_PAGE = 'tron-price'

const URL_ASSETS_PAGE = 'new-assets'



/* buy bitcoin-cash */

class BuyBitcoinCash {
    constructor() {
        if(window.location.href.includes(URL_BUY_BITCOINCASH_PRICE_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
        if(window.location.href.includes(URL_BUY_BITCOINCASH_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
    }

    getPrice () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=BCH")
          .then(r => r.json())
          .then(r => {
              const price = r.RAW.BCH.USD.PRICE

              if (!price) return

              this.hundredRateSpan.innerHTML = Number((100 / price) + (100 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.fivehundredRateSpan.innerHTML = Number((500 / price) + (500 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.thousandRateSpan.innerHTML = Number((1000 / price) + (1000 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
          })
          .catch(console.log)
    }
}

/* buy bitcoin */

class BuyBitcoin {
    constructor() {
        if(window.location.href.includes(URL_BUY_BITCOIN_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
        if(window.location.href.includes(URL_BUY_BITCOIN_PRICE_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
    }

    getPrice () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=BTC")
          .then(r => r.json())
          .then(r => {
              const price = r.RAW.BTC.USD.PRICE

              if (!price) return
              this.hundredRateSpan.innerHTML = Number((100 / price) + (100 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.fivehundredRateSpan.innerHTML = Number((500 / price) + (500 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.thousandRateSpan.innerHTML = Number((1000 / price) + (1000 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)

          })
          .catch(console.log)
    }
}


/* buy litecoin */

class BuyLitecoin {
    constructor() {
        if(window.location.href.includes(URL_BUY_LITECOIN_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
        if(window.location.href.includes(URL_BUY_LITECOIN_PRICE_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
        if(window.location.href.includes(URL_BUY_LITECOIN_PRICE_PREDICTION_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
    }

    getPrice () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=LTC")
          .then(r => r.json())
          .then(r => {
              const price = r.RAW.LTC.USD.PRICE

              if (!price) return

              this.hundredRateSpan.innerHTML = Number((100 / price) + (100 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.fivehundredRateSpan.innerHTML = Number((500 / price) + (500 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.thousandRateSpan.innerHTML = Number((1000 / price) + (1000 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
          })
          .catch(console.log)
    }
}

/* buy ripple */

class BuyRipple {
    constructor() {
        if(window.location.href.includes(URL_BUY_RIPPLE_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
        if(window.location.href.includes(URL_BUY_RIPPLE_PRICE_PREDICTION_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
        if(window.location.href.includes(URL_BUY_RIPPLE_PRICE_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
    }

    getPrice () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=XRP")
          .then(r => r.json())
          .then(r => {
              const price = r.RAW.XRP.USD.PRICE

              if (!price) return

              this.hundredRateSpan.innerHTML = Number((100 / price) + (100 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(0)
              this.fivehundredRateSpan.innerHTML = Number((500 / price) + (500 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(0)
              this.thousandRateSpan.innerHTML = Number((1000 / price) + (1000 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(0)
          })
          .catch(console.log)
    }
}

/* buy ethereum */

class BuyEthereum {
    constructor() {
        if(window.location.href.includes(URL_BUY_ETHEREUM_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
        if(window.location.href.includes(URL_BUY_ETHEREUM_PRICE_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
        if(window.location.href.includes(URL_BUY_ETHEREUM_PRICE_PREDICTION_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
    }

    getPrice () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=ETH")
          .then(r => r.json())
          .then(r => {
              const price = r.RAW.ETH.USD.PRICE

              if (!price) return

              this.hundredRateSpan.innerHTML = Number((100 / price) + (100 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.fivehundredRateSpan.innerHTML = Number((500 / price) + (500 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.thousandRateSpan.innerHTML = Number((1000 / price) + (1000 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
          })
          .catch(console.log)
    }
}

/* buy dogecoin */

class BuyDogecoin {
    constructor() {
        if(window.location.href.includes(URL_BUY_DOGECOIN_PRICE_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
        if(window.location.href.includes(URL_BUY_DOGECOIN_PRICE_PREDICTION_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
        if(window.location.href.includes(URL_BUY_DOGECOIN_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
    }


    getPrice () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=DOGE")
          .then(r => r.json())
          .then(r => {
              const price = r.RAW.DOGE.USD.PRICE

              if (!price) return

              this.hundredRateSpan.innerHTML = Number((100 / price) + (100 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(0)
              this.fivehundredRateSpan.innerHTML = Number((500 / price) + (500 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(0)
              this.thousandRateSpan.innerHTML = Number((1000 / price) + (1000 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(0)
          })
          .catch(console.log)
    }
}

class BuyZCash {
    constructor() {
        if(window.location.href.includes(URL_BUY_ZCASH_PRICE_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }

            if(window.location.href.includes(URL_BUY_ZCASH_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
    }



    getPrice () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=ZEC")
          .then(r => r.json())
          .then(r => {
              const price = r.RAW.ZEC.USD.PRICE

              if (!price) return

              this.hundredRateSpan.innerHTML = Number((100 / price) + (100 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(3)
              this.fivehundredRateSpan.innerHTML = Number((500 / price) + (500 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(3)
              this.thousandRateSpan.innerHTML = Number((1000 / price) + (1000 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(3)
          })
          .catch(console.log)
    }
}

class BuyTRON {
    constructor() {
        if(window.location.href.includes(URL_BUY_TRON_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }

            if(window.location.href.includes(URL_BUY_TRON_PRICE_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
    }



    getPrice () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=TRX")
          .then(r => r.json())
          .then(r => {
              const price = r.RAW.TRX.USD.PRICE

              if (!price) return

              this.hundredRateSpan.innerHTML = Number((100 / price) + (100 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(0)
              this.fivehundredRateSpan.innerHTML = Number((500 / price) + (500 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(0)
              this.thousandRateSpan.innerHTML = Number((1000 / price) + (1000 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(0)
          })
          .catch(console.log)
    }
}


class BuyStellar {
    constructor() {
        if(window.location.href.includes(URL_BUY_STELLAR_PRICE_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
        if(window.location.href.includes(URL_BUY_STELLAR_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
    }


    getPrice () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=XLM")
          .then(r => r.json())
          .then(r => {
              const price = r.RAW.XLM.USD.PRICE

              if (!price) return

              this.hundredRateSpan.innerHTML = Number((100 / price) + (100 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(1)
              this.fivehundredRateSpan.innerHTML = Number((500 / price) + (500 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(1)
              this.thousandRateSpan.innerHTML = Number((1000 / price) + (1000 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(1)
          })
          .catch(console.log)
    }
}


class BuyNEO {
    constructor() {
        if(window.location.href.includes(URL_BUY_NEO_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
    }


    getPrice () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=NEO")
          .then(r => r.json())
          .then(r => {
              const price = r.RAW.NEO.USD.PRICE

              if (!price) return

              this.hundredRateSpan.innerHTML = Number((100 / price) + (100 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.fivehundredRateSpan.innerHTML = Number((500 / price) + (500 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.thousandRateSpan.innerHTML = Number((1000 / price) + (1000 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
          })
          .catch(console.log)
    }
}

class BuyBitcoinGold {
    constructor() {
        if(window.location.href.includes(URL_BUY_BTG_PRICE_PAGE)) {
            this.hundredRateSpan = qs('#hundred-dollar-rate');
            this.fivehundredRateSpan = qs('#five-hundred-coin-rate');
            this.thousandRateSpan = qs('#thousand-coin-rate');

            this.getPrice()
        }
    }


    getPrice () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=BTG")
          .then(r => r.json())
          .then(r => {
              const price = r.RAW.BTG.USD.PRICE

              if (!price) return

              this.hundredRateSpan.innerHTML = Number((100 / price) + (100 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.fivehundredRateSpan.innerHTML = Number((500 / price) + (500 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
              this.thousandRateSpan.innerHTML = Number((1000 / price) + (1000 / price * COEFFICIENT_FOR_CUSTOMER_BUY_PURPOSE)).toFixed(4)
          })
          .catch(console.log)
    }
}

/* Assets */

class Assets {
    constructor() {
        if(window.location.href.includes(URL_ASSETS_PAGE)) {

        
            this.getPrice2();
            this.getPrice3();
            this.getPrice4();
            this.getPrice5();
            this.getMarketCap1();
            this.getMarketCap2();
            this.getMarketCap3();
            this.getMarketCap4();
            this.getVolumeData();
            this.getVolumeData1();
            this.getVolumeData2();
            this.getVolumeData3();
            this.getChangeData();
            this.getChangeData1();
            this.getChangeData2();
            this.getChangeData3();
        }
    }





    getPrice2 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,BCH,XLM,EOS,LTC,USDT,ADA,XMR,BSV,TRX,DASH,BNB,ETC,XTZ,ZEC,BTG,VET,MKR,OMG,MGO,DOGE,ZRX,DCR,QTUM,AE,ZIL,BCD,DGB,NPXS,PMA,MITH,TUSD,GUSD,AWC,BTM,USDC,PPT,PAX,REP,REP,GNT,HOT,IOST,WAX,BZNT,DGTX,MANA,WTC,NEXO,BNT,TPAY,BTT,DAI,VTHO,SMART,EURS,ABYSS,MXM,XYO,ODE,1ST,300,ADST,ADT,ADX,AIR&tsyms=USD")
          .then(r => r.json())
          .then(r => {
        
            const coinTickers = Object.keys(r.DISPLAY)

            coinTickers.forEach(ticker => {
              const price = r.DISPLAY[ticker].USD.PRICE

              try {
                document.getElementById(ticker.toLowerCase()).innerHTML = price
              } catch (error) {
                console.log(ticker, 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }

    getPrice3 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=IOTA,ALIS,AMIS,ANT,APT,ARC,ARN,ART,ATH,IOTX,ATL,AVA,AVT,BCDN,BEER,BET,BLX,BMC,BMT,BNC,BOR,BRAT,BQX,BTE,CAG,CAT,CCC,CDT,CFI,CMC,COB,CRB,CREDO,CTL,CVC,DATA,DDF,DENT,DGX,DICE,DNT,DRP,EDOO,EDG,ELIX,EURT,FRD,FUEL,FUN,GBT,GNO,GUP,H2O,HGT,GMQ,HST,ICE,ICN,ICOS,IFT,IND,IXT,JET,KICK,KIN,KNC,RFR,LATX,LIFE,LINK&tsyms=USD")
          .then(r => r.json())
          .then(r => {
        
            const coinTickers = Object.keys(r.DISPLAY)

            coinTickers.forEach(ticker => {
              const price = r.DISPLAY[ticker].USD.PRICE

              try {
                document.getElementById(ticker.toLowerCase()).innerHTML = price
              } catch (error) {
                console.log(ticker, 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }
    getPrice4 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=LNC,LRC,LBT,LUN,MCAP,MCO,MDA,MNE,MSP,MTH,MTL,MTX,MYST,NET,NMR,NXX,OAX,OPT,PAY,PIX,PLAY,PLBT,PLR,PLU,POE,POS,PRO,PTOY,QAU,BAT,RLT,RLX,RVT,SALT,SCL,SENSE,SHIT,SKIN,SNC,SNGLS,SND,SNM,SNT,STORJ,STRC,STX,SUB,SWT,TAAS,TBT,TFL,TBC2,TIME,TIX,TKN,TNT,TRST,VERI,VIBE,VIB,VIU,VRS,VSL,VSM,WIC,WINGS,WOLK,XAUR,XID&tsyms=USD")
          .then(r => r.json())
          .then(r => {

            const coinTickers = Object.keys(r.DISPLAY)

            coinTickers.forEach(ticker => {
              const price = r.DISPLAY[ticker].USD.PRICE

              try {
                document.getElementById(ticker.toLowerCase()).innerHTML = price
              } catch (error) {
                console.log(ticker, 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }
    getPrice5 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=XNN,XRL,BCPT,BIX,R,GTO,EKT,SRN,OCN,ELF,GVT,EVX,TNB,RUFF,AMB,BTM,THETA,POLY,APPC,JNT,QUN,NAS,DTA,SXUT,LEND,POWR,ITC,RCN,ENJ,RDN,MTN,REQ,WPR,DLT,GNX,ST,AST,CMT,AIDOC,YOYOW,NULS,MOD,UKG,BRD,GTC,BKX,MDS,CND,ENG,DPY,C20,LEV,ATM,STORM,MOF,QSP,QASH,SPHTX,CS,DRGN,ETHOS,DCN,NOW&tsyms=USD")
          .then(r => r.json())
          .then(r => {
        
            const coinTickers = Object.keys(r.DISPLAY)

            coinTickers.forEach(ticker => {
              const price = r.DISPLAY[ticker].USD.PRICE

              try {
                document.getElementById(ticker.toLowerCase()).innerHTML = price
              } catch (error) {
                console.log(ticker, 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }
    getMarketCap1 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,BCH,XLM,EOS,LTC,USDT,ADA,XMR,BSV,TRX,DASH,BNB,ETC,XTZ,ZEC,BTG,VET,MKR,OMG,MGO,DOGE,ZRX,DCR,QTUM,AE,ZIL,BCD,DGB,NPXS,PMA,MITH,TUSD,GUSD,AWC,BTM,USDC,PPT,PAX,REP,REP,GNT,HOT,IOST,WAX,BZNT,DGTX,MANA,WTC,NEXO,BNT,TPAY,BTT,DAI,VTHO,SMART,EURS,ABYSS,MXM,XYO,ODE,1ST,300,ADST,ADT,ADX,AIR&tsyms=USD")
          .then(r => r.json())
          .then(r => {

            const marketCap = Object.keys(r.DISPLAY)
            marketCap.forEach(coin => {

              const mcap = r.DISPLAY[coin].USD.MKTCAP

              try {
                document.getElementById(coin.toLowerCase()+"-cap").innerHTML = mcap
              } catch (error) {
                console.log(coin.toLowerCase()+"-cap", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }  
    getMarketCap2 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=IOTA,ALIS,AMIS,ANT,APT,ARC,ARN,ART,ATH,IOTX,ATL,AVA,AVT,BCDN,BET,BLX,BMC,BMT,BNC,BRAT,BQX,BTE,CAG,CAT,CCC,CDT,CFI,CMC,COB,CRB,CREDO,CTL,CVC,DATA,DDF,DENT,DGX,DICE,DNT,DRP,EDG,ELIX,EURT,FRD,FUEL,FUN,GBT,GNO,GUP,H2O,HGT,HST,ICE,ICN,ICOS,IFT,IND,IXT,JET,KICK,KIN,KNC,RFR,LATX,LIFE,LINK&tsyms=USD")
          .then(r => r.json())
          .then(r => {
    
            const marketCap = Object.keys(r.DISPLAY)
            marketCap.forEach(coin => {

              const mcap = r.DISPLAY[coin].USD.MKTCAP

              try {
                document.getElementById(coin.toLowerCase()+"-cap").innerHTML = mcap
                console.log()
              } catch (error) {
                console.log(coin.toLowerCase()+"-cap", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }
    getMarketCap3 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=LNC,LRC,LBT,LUN,MCAP,MCO,MDA,MNE,MSP,MTH,MTL,MTX,MYST,NET,NMR,NXX,OAX,OPT,PAY,PIX,PLAY,PLBT,PLR,PLU,POE,POS,PRO,PTOY,QAU,BAT,RLT,RLX,RVT,SALT,SCL,SENSE,SHIT,SKIN,SNC,SNGLS,SND,SNM,SNT,STORJ,STRC,STX,SUB,SWT,TAAS,TBT,TFL,TBC2,TIME,TIX,TKN,TNT,TRST,VERI,VIBE,VIB,VIU,VRS,VSL,VSM,WIC,WINGS,WOLK,XAUR,XID&tsyms=USD")
          .then(r => r.json())
          .then(r => {
        
            const marketCap = Object.keys(r.DISPLAY)
            marketCap.forEach(coin => {

              const mcap = r.DISPLAY[coin].USD.MKTCAP

              try {
                document.getElementById(coin.toLowerCase()+"-cap").innerHTML = mcap
              } catch (error) {
                console.log(coin.toLowerCase()+"-cap", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }

    getMarketCap4 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=XNN,XRL,BCPT,BIX,R,GTO,EKT,SRN,OCN,ELF,GVT,EVX,TNB,RUFF,AMB,BTM,THETA,POLY,APPC,JNT,QUN,NAS,DTA,SXUT,LEND,POWR,ITC,RCN,ENJ,RDN,MTN,REQ,WPR,DLT,GNX,ST,AST,CMT,AIDOC,YOYOW,NULS,MOD,UKG,BRD,GTC,BKX,MDS,CND,ENG,DPY,C20,LEV,ATM,STORM,MOF,QSP,QASH,SPHTX,CS,DRGN,ETHOS,DCN,NOW&tsyms=USD")
          .then(r => r.json())
          .then(r => {
        
            const marketCap = Object.keys(r.DISPLAY)
            marketCap.forEach(coin => {

              const mcap = r.DISPLAY[coin].USD.MKTCAP

              try {
                document.getElementById(coin.toLowerCase()+"-cap").innerHTML = mcap
              } catch (error) {
                console.log(coin.toLowerCase()+"-cap", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }
    getVolumeData () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,BCH,XLM,EOS,LTC,USDT,ADA,XMR,BSV,TRX,DASH,BNB,ETC,XTZ,ZEC,BTG,VET,MKR,OMG,MGO,DOGE,ZRX,DCR,QTUM,AE,ZIL,BCD,DGB,NPXS,PMA,MITH,TUSD,GUSD,AWC,BTM,USDC,PPT,PAX,REP,REP,GNT,HOT,IOST,WAX,BZNT,DGTX,MANA,WTC,NEXO,BNT,TPAY,BTT,DAI,VTHO,SMART,EURS,ABYSS,MXM,XYO,ODE,1ST,300,ADST,ADT,ADX,AIR&tsyms=USD")
          .then(r => r.json())
          .then(r => {
        
            const volumeData = Object.keys(r.DISPLAY)
            volumeData.forEach(coinvolume => {

              const volume = r.DISPLAY[coinvolume].USD.TOTALVOLUME24HTO
  

              try {
                document.getElementById(coinvolume.toLowerCase()+"-volume").innerHTML = volume

              } catch (error) {
                console.log(coinvolume.toLowerCase()+"-volume", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }  
        getVolumeData1 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=IOTA,ALIS,AMIS,ANT,APT,ARC,ARN,ART,ATH,IOTX,ATL,AVA,AVT,BCDN,BET,BLX,BMC,BMT,BNC,BRAT,BQX,BTE,CAG,CAT,CCC,CDT,CFI,CMC,COB,CRB,CREDO,CTL,CVC,DATA,DDF,DENT,DGX,DICE,DNT,DRP,EDG,ELIX,EURT,FRD,FUEL,FUN,GBT,GNO,GUP,H2O,HGT,HST,ICE,ICN,ICOS,IFT,IND,IXT,JET,KICK,KIN,KNC,RFR,LATX,LIFE,LINK&tsyms=USD")
          .then(r => r.json())
          .then(r => {

            const volumeData = Object.keys(r.DISPLAY)
            volumeData.forEach(coinvolume => {

              const volume = r.DISPLAY[coinvolume].USD.TOTALVOLUME24HTO
             

              try {
                document.getElementById(coinvolume.toLowerCase()+"-volume").innerHTML = volume
            
              } catch (error) {
                console.log(coinvolume.toLowerCase()+"-volume", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }  
        getVolumeData2 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=LNC,LRC,LBT,LUN,MCAP,MCO,MDA,MNE,MSP,MTH,MTL,MTX,MYST,NET,NMR,NXX,OAX,OPT,PAY,PIX,PLAY,PLBT,PLR,PLU,POE,POS,PRO,PTOY,QAU,BAT,RLT,RLX,RVT,SALT,SCL,SENSE,SHIT,SKIN,SNC,SNGLS,SND,SNM,SNT,STORJ,STRC,STX,SUB,SWT,TAAS,TBT,TFL,TBC2,TIME,TIX,TKN,TNT,TRST,VERI,VIBE,VIB,VIU,VRS,VSL,VSM,WIC,WINGS,WOLK,XAUR,XID&tsyms=USD")
          .then(r => r.json())
          .then(r => {
        
            const volumeData = Object.keys(r.DISPLAY)
            volumeData.forEach(coinvolume => {

              const volume = r.DISPLAY[coinvolume].USD.TOTALVOLUME24HTO
  

              try {
                document.getElementById(coinvolume.toLowerCase()+"-volume").innerHTML = volume

              } catch (error) {
                console.log(coinvolume.toLowerCase()+"-volume", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }  
    getVolumeData3 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=XNN,XRL,BCPT,BIX,R,GTO,EKT,SRN,OCN,ELF,GVT,EVX,TNB,RUFF,AMB,BTM,THETA,POLY,APPC,JNT,QUN,NAS,DTA,SXUT,LEND,POWR,ITC,RCN,ENJ,RDN,MTN,REQ,WPR,DLT,GNX,ST,AST,CMT,AIDOC,YOYOW,NULS,MOD,UKG,BRD,GTC,BKX,MDS,CND,ENG,DPY,C20,LEV,ATM,STORM,MOF,QSP,QASH,SPHTX,CS,DRGN,ETHOS,DCN,NOW&tsyms=USD")
          .then(r => r.json())
          .then(r => {
            const volumeData = Object.keys(r.DISPLAY)
            volumeData.forEach(coinvolume => {

              const volume = r.DISPLAY[coinvolume].USD.TOTALVOLUME24HTO
    

              try {
                document.getElementById(coinvolume.toLowerCase()+"-volume").innerHTML = volume
              } catch (error) {
                console.log(coinvolume.toLowerCase()+"-volume", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }  
     getChangeData () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,BCH,XLM,EOS,LTC,USDT,ADA,XMR,BSV,TRX,DASH,BNB,ETC,XTZ,ZEC,BTG,VET,MKR,OMG,MGO,DOGE,ZRX,DCR,QTUM,AE,ZIL,BCD,DGB,NPXS,PMA,MITH,TUSD,GUSD,AWC,BTM,USDC,PPT,PAX,REP,REP,GNT,HOT,IOST,WAX,BZNT,DGTX,MANA,WTC,NEXO,BNT,TPAY,BTT,DAI,VTHO,SMART,EURS,ABYSS,MXM,XYO,ODE,1ST,300,ADST,ADT,ADX,AIR&tsyms=USD")
          .then(r => r.json())
          .then(r => {
            const changeData = Object.keys(r.DISPLAY)
            changeData.forEach(coinchange => {

              const change = r.DISPLAY[coinchange].USD.CHANGEPCT24HOUR
              

              try {
                document.getElementById(coinchange.toLowerCase()+"-change").innerHTML = change

              } catch (error) {
                console.log(coinchange.toLowerCase()+"-change", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }  
    getChangeData1 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=IOTA,ALIS,AMIS,ANT,APT,ARC,ARN,ART,ATH,IOTX,ATL,AVA,AVT,BCDN,BET,BLX,BMC,BMT,BNC,BRAT,BQX,BTE,CAG,CAT,CCC,CDT,CFI,CMC,COB,CRB,CREDO,CTL,CVC,DATA,DDF,DENT,DGX,DICE,DNT,DRP,EDG,ELIX,EURT,FRD,FUEL,FUN,GBT,GNO,GUP,H2O,HGT,HST,ICE,ICN,ICOS,IFT,IND,IXT,JET,KICK,KIN,KNC,RFR,LATX,LIFE,LINK&tsyms=USD")
          .then(r => r.json())
          .then(r => {
    
            const changeData = Object.keys(r.DISPLAY)
            changeData.forEach(coinchange => {

              const change = r.DISPLAY[coinchange].USD.CHANGEPCT24HOUR
 
              try {
                document.getElementById(coinchange.toLowerCase()+"-change").innerHTML = change
              } catch (error) {
                console.log(coinchange.toLowerCase()+"-change", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }  
    getChangeData2 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=LNC,LRC,LBT,LUN,MCAP,MCO,MDA,MNE,MSP,MTH,MTL,MTX,MYST,NET,NMR,NXX,OAX,OPT,PAY,PIX,PLAY,PLBT,PLR,PLU,POE,POS,PRO,PTOY,QAU,BAT,RLT,RLX,RVT,SALT,SCL,SENSE,SHIT,SKIN,SNC,SNGLS,SND,SNM,SNT,STORJ,STRC,STX,SUB,SWT,TAAS,TBT,TFL,TBC2,TIME,TIX,TKN,TNT,TRST,VERI,VIBE,VIB,VIU,VRS,VSL,VSM,WIC,WINGS,WOLK,XAUR,XID&tsyms=USD")
          .then(r => r.json())
          .then(r => {
            const changeData = Object.keys(r.DISPLAY)
            changeData.forEach(coinchange => {

              const change = r.DISPLAY[coinchange].USD.CHANGEPCT24HOUR
           

              try {
                document.getElementById(coinchange.toLowerCase()+"-change").innerHTML = change
              } catch (error) {
                console.log(coinchange.toLowerCase()+"-change", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }  
    getChangeData3 () {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=XNN,XRL,BCPT,BIX,R,GTO,EKT,SRN,OCN,ELF,GVT,EVX,TNB,RUFF,AMB,BTM,THETA,POLY,APPC,JNT,QUN,NAS,DTA,SXUT,LEND,POWR,ITC,RCN,ENJ,RDN,MTN,REQ,WPR,DLT,GNX,ST,AST,CMT,AIDOC,YOYOW,NULS,MOD,UKG,BRD,GTC,BKX,MDS,CND,ENG,DPY,C20,LEV,ATM,STORM,MOF,QSP,QASH,SPHTX,CS,DRGN,ETHOS,DCN,NOW&tsyms=USD")
          .then(r => r.json())
          .then(r => {
            const changeData = Object.keys(r.DISPLAY)
            changeData.forEach(coinchange => {

              const change = r.DISPLAY[coinchange].USD.CHANGEPCT24HOUR
            

              try {
                document.getElementById(coinchange.toLowerCase()+"-change").innerHTML = change
              } catch (error) {
                console.log(coinchange.toLowerCase()+"-change", 'not found')
              }
            })


        
            
          })
          .catch(console.log)
    }  




}



new Page();
new BuyBitcoin();
new BuyLitecoin();
new BuyRipple();
new BuyBitcoinCash();
new BuyDogecoin();
new BuyNEO();
new BuyEthereum();
new BuyBitcoinGold();
new BuyStellar();
new BuyZCash();
new BuyTRON();
setTimeout(() => {
  new Assets();
}, 200)

