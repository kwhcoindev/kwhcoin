import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'dashboard-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

	@Input() user: any = {};
	@Input() wallet: any = null;

	search: string = "";
	showChat: boolean = false;
	selectedContact: number = -1;

	contacts: Array<any> = [{
		name: 'Louis Litt',
		email: 'louis@abc.com',
		id: 1,
		lastChat: 'Yesterday'
	},
	{
		name: 'Harvey Specter',
		email: 'harvey_spec@gmail.com',
		id: 2,
		lastChat: 'Yesterday'
	},
	{
		name: 'Rachel Zane',
		email: 'rachel.zane@yahoo.com',
		id: 3,
		lastChat: '2 days ago'
	},
	{
		name: 'Donna Paulsen',
		email: 'donna2016@idea.us',
		id: 4,
		lastChat: 'Yesterday'
	}];

	chats: Array<any> = [];

	constructor(private service: AppService) { }

 	ngOnInit() {
 		this.wallet = {balance: 300000};
  	}

  	selectContact(idx: any, chatTabs: any) {
  		let contact = this.contacts[idx];
  		this.selectedContact=idx;
  		this.showChat = true;
  		this.chats = [{
  			name: this.user.name,
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			time: '2hr ago, Today',
			me: true
		},
		{
			name: contact.name,
			text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
			time: '1hr 20min ago, Today',
			me: false
		},
		{
			name: this.user.name,
			text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
			time: '30min ago, Today',
			me: true
		},
		{
			name: contact.name,
			text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			time: '12min ago, Today',
			me: false
		}];

  		setTimeout(()=>{ chatTabs.select('chat-tab-2'); }, 20);
  	}
}
