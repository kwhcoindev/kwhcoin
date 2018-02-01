import { Component, OnInit } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

declare var jQuery;

@Component({
  selector: 'app-ico-information',
  templateUrl: './ico-information.component.html',
  styleUrls: ['./ico-information.component.scss']
})
export class IcoInformationComponent implements OnInit {

  	constructor(private sanitizer: DomSanitizer) { 
  	}

  	ngOnInit() {
  		jQuery('#mc-script').append("<script type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script><script type='text/javascript'>(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='MMERGE3';ftypes[3]='text';}(jQuery));var $mcj = jQuery</script>");
  	}

}
