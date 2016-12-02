/*  * this is the part where settings screen is implemented; includes: * 	Variables: *		SetContent	- an instance of SetContentTemplate, settings page's content *		SetScreen	- an instance of SetScreenTemplate, the whole settings page's screen *	Functions: *		LoadSetContent - take in SetContent as its parameter, add the device data to the SetContent *		getStatusURL - 	an assistant function of template OnOffTemplate,  *						used to modify the "on / off" / "lock / unlock" image used to symbolize each device's status *						device type is taken into consideration * 	Templates: *		SetScreenTemplate - the template of the whole settings screen * 			SetContentTemplate - serves as a parameter of the whole screen's template, contains the main contents *				SetTopBar - the title of settings screen, scrolling with content, located on the top * 				DeviceItemTemplate - for each of the listed items (that is, devices) in the data file *					DeviceEntryTemplate - 	appearance is the label telling users the device's name / location  *											functionality is to click it and enter the "device" page *					OnOffTemplate 	- 	appearance is the on / off, or lock / unlock button on the right *										functionality is to update DATA and to change the appearance of itself by calling getStatusURL *			iconTemplate - serves as layout elements stick to the bottom of the screen *				iconButtonTemplate - 	the image used as icon is loaded here *										implemented this way so that we might be able to adapt the icons more easily * 				 */import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';

import { 
	Button,
    ButtonBehavior,
    RadioGroup, 
    RadioGroupBehavior
} from 'lib/buttons';// parameters & frequently-used functionsimport {	TMP_SCREEN,
	img_logo,	img_home,	img_fave,	img_note,	img_sett,	img_plus,	img_off,	img_on,	img_lock,	img_unlock,	on_uri,	off_uri,	lock_uri,	unlock_uri,	BAR_HEIGHT_TOP,	BAR_HEIGHT_BOTTOM,	skins,	texts,	settings_list_topbar_height,	settings_list_item_height,	settings_list_item_padding_w,	settings_list_item_padding_h,	settings_list_tag_width,
	settings_list_topbar_img_size,
	settings_list_item_padding,
	settings_list_setting_height,
	settings_button_height,	bottom_bar_padding,	bottom_bar_img_size,	// load_data,	save_data,	DATA,	deviceURL,	synch_data} from "global_settings"

import {
	WelcomePageTemplate,
} from "main";import {	DeviceScreenTemplate,	DeviceContentTemplate,	DeviceScreen,	DeviceContent} from "device";/*import {	SearchScreenTemplate,	SearchContentTemplate,	SearchScreen,	SearchContent,	loadNewDevicesJSON,	SELECTED} from "search_device";
*/
import {
	HomeContentTemplate,
	HomeScreenTemplate,
	HomeContent,
	HomeScreen,
	LoadHomeContent,
} from "home";

import {
	FavoritesContent,	FavoritesScreen,
	FavoritesContentTemplate,
	FavoritesScreenTemplate,
	LoadFavoritesContent
} from "favorites";// the Content and Screen (screen = content with scroll bar) variablesexport var SetContent;export var SetScreen;// settings screen template, used to implement SetScreenexport var SetScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    skin: skins.background.settings,    contents: [        VerticalScroller($, {             active: true, top: BAR_HEIGHT_TOP, bottom: BAR_HEIGHT_BOTTOM,            contents: [                $.SetContent,                VerticalScrollbar(),           //      TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),        // bottom bar // the navigation bar for now        new Line({             bottom: 0, height: BAR_HEIGHT_BOTTOM, left: 0, right: 0, skin: skins.navbar,             contents: [                new iconTemplate({icon_img: img_home, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "home", activate: false}),                new iconTemplate({icon_img: img_fave, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "favorites", activate: false}),                new iconTemplate({icon_img: img_note, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "notifications", activate: false}),                new iconTemplate({icon_img: img_sett, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "settings", activate: true}),            ]        }),    ]}));// the bottom navigate bar's elements' template // not implemented for nowvar iconTemplate = Column.template($ => ({ 	top: 0, left: 0, right: 0,	active:true,	contents: [				new iconButtonTemplate({			name: $.hint, 			url: $.activate? $.icon_img.activated: $.icon_img.idel,			padding: $.padding, size: 25,		}),				new Label({			string: $.hint,			style: texts.settings.navhint,		}),	],	behavior: Behavior({		onTouchEnded: function(container) {			save_data(DATA);			// trace("going to page " + $.hint + "\n");
			if ($.hint == "home") {
				trace("going to home page\n");
				application.remove(TMP_SCREEN);
				HomeContent = HomeContentTemplate({});
        		LoadHomeContent(HomeContent);
        		HomeScreen = new HomeScreenTemplate({ HomeContent });
        		TMP_SCREEN = HomeScreen;
        		application.add(TMP_SCREEN);
			}
			else if ($.hint == "favorites") {
				trace("going to favorites page\n");
				application.remove(TMP_SCREEN);
				FavoritesContent = FavoritesContentTemplate({});
        		LoadFavoritesContent(FavoritesContent);
        		FavoritesScreen = new FavoritesScreenTemplate({ FavoritesContent });
        		TMP_SCREEN = FavoritesScreen;
        		application.add(TMP_SCREEN);
        		
			}
			else if ($.hint == "notifications") {
				trace("going to notifications page\n");
			}
			else if ($.hint == "settings") {
				trace("staying on settings page\n");
				/*
				application.remove(TMP_SCREEN);
				SetContent = SetContentTemplate({});
        		LoadSetContent(SetContent);
        		SetScreen = new SetScreenTemplate({ SetContent });
        		TMP_SCREEN = SetScreen;
        		application.add(TMP_SCREEN);
        		*/
			}		}	})}));let iconButtonTemplate = Container.template($ => ({ // the icons in the bottom navigation bar	contents: [		new Picture({			name: $.name,			url: $.url,			top: $.padding, left: $.padding, right: $.padding, width: $.size, height: $.size,		}),	],}));// settings content template, used to implement SetContent
export var Divide = Line.template($ => ({
	top: 0, left: settings_list_item_padding, right: settings_list_item_padding, bottom: 0,
	height: $.height, width: $.length, skin: skins.foreground.settings,
}));export let SetContentTemplate = Column.template($ => ({     top: 10, left: 0, right: 0,    contents: [    	new SetTopBar(),	// the top bar    	// content could be added latter by the function LoadSetContent    	// but for now, just hard-coded
    	/// hard-coded part ///
    	new Column ( { //Line ( {
			contents: [
				new Picture({
					url:  DATA.users[0].img,
					top: 0, left: 0, right: 0, width: 100, height: 100,
				}),
				new Line({height: 10}),
				new Label({
					string: DATA.users[0].name,
					style: texts.settings.name,
				}),
				new Line({height: 24}),
				new UserSettingOptions({label: "ACCOUNT", idx: 0}), // idx is the user's user id
				new Divide({height: 1, length: 200}),
				new UserSettingOptions({label: "ABOUT", idx: 0}), // idx is the user's user id
				new Divide({height: 1, length: 200}),
				new Line({height: 50}),
				new logoutButtonTemplate({textForLabel: "SIGN OUT"}),
				
			]
		}),
    	///
    	    ],}));
// the button to enter the home pagelet logoutButtonTemplate = Button.template($ => ({    top: 0, width: 200, /*right: 0,*/ height: settings_button_height,    contents: [        Label($, {top: 2,left: 0, right: 0, height: settings_button_height, string: $.textForLabel, style: texts.settings.button})    ],    Behavior: class extends ButtonBehavior {        onTap(button){              	application.remove(TMP_SCREEN);
        	TMP_SCREEN = new WelcomePageTemplate({ skin: skins.background.welcome, img_url: img_logo, title: "HoM"});
			application.add(TMP_SCREEN);        }       }}));// functions used to load device data contents to settings page, from the device data stored in a fileexport function LoadSetContent(settingsContent) {
	// just in case if we want to implement switch user, etc.
	/*	var len = DATA.init.length;	for (var i = 0; i < len; i++) {		var data_elem = DATA.init[i];
		trace(data_elem.favorite + "\n");
		if (!data_elem.favorite) continue;		var item = new DeviceItemTemplate({ 			DeviceName: data_elem.DeviceName, 			DeviceGroup: data_elem.DeviceGroup, 			id: data_elem.id, 			type: data_elem.type,			value: data_elem.value,			idx: i,		});		settingsContent.add(item);	}
	*/}// the "top" navigate bar of settings screen (not really stick to the top, it goes up and down with the scrollervar SetTopBar = Container.template($ => ({	// top-bar	top: settings_list_item_padding_h, left: settings_list_item_padding_w, right: settings_list_item_padding_w, bottom: settings_list_item_padding_h,	height: settings_list_topbar_height,	contents: [		new Label({			string: "My Settings",			style: texts.settings.title,		}),
		/*		new Line({						contents: [				new AddDeviceTemplate({}),			]		}),*/	]}));//
let Blank = Container.template($ => ({
	width: $.length,
}));

var UserSettingOptions = Line.template($ => ({
	
	top: settings_list_item_padding, left: settings_list_item_padding, right: settings_list_item_padding, bottom: settings_list_item_padding,
	height: settings_list_setting_height,
	
	active: true,
	contents: [
		new Label({
			string: $.label,
			style: texts.settings.options,
			width: 100,
		}),
		new Blank({length: 120}),
		new Label({
			string: ">",
			style: texts.settings.options,
		}),
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			trace("selecting " + $.label + "\n")
			var command = $.label;
			if (command == "TIMING") {
				application.remove(TMP_SCREEN);
				TimingContent = TimingContentTemplate({idx: $.idx});
	        	TimingScreen = new TimingScreenTemplate({ TimingContent });
	        	TMP_SCREEN = TimingScreen;
	        	application.add(TMP_SCREEN);
			} 
        	
		}
	})	
}));