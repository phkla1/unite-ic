import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import {ModalService} from './modal.service'; 

@Component({
  selector: 'app-modalbasic',
  templateUrl: './modalbasic.component.html',
  styleUrls: ['./modalbasic.component.scss']
})
export class ModalbasicComponent implements OnInit, OnDestroy {
    @Input() id: string;
    private element: any;

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // close modal on background click
        this.element.addEventListener('click', el => {
            if (el.target.className === 'basic-modal') {
                this.close();
            }
        });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);

		//close modal in case not closed by default
		this.close();
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('basic-modal-open');
    }

    // close modal
    close(): void {
        this.element.style.display = 'none';
        document.body.classList.remove('basic-modal-open');
    }

	/*
    // open or close modal
    toggle(): void {
        this.element.style.display = 'block';
        document.body.classList.toggle('basic-modal-open');
    }
	*/
}
