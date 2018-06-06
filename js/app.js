let qs = q => document.querySelector(q);
let qsa = q => document.querySelectorAll(q);

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
new Download();
/* /download */

document.addEventListener('DOMContentLoaded', _ => {
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