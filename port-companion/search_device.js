import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';import {	TMP_SCREEN,	midText,	whiteSkin,
	lightGraySkin,
	lightGraySmallText,	device_list_item_padding,	device_list_topbar_height} from "global_settings";

import {
	HomeContentTemplate,
	HomeScreenTemplate,
	HomeContent,
	HomeScreen,
	LoadHomeContent,
} from "home";export var SearchScreen;export var SearchContent;export var SearchScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    skin: lightGraySkin, //whiteSkin,    contents: [        VerticalScroller($, {             active: true, top: 0, bottom: 0,            contents: [                $.SearchContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),    ]}));export var SearchContentTemplate = Column.template($ => ({    top: 0, left: 0, right: 0,     contents: [    	new SearchTopBar(),        ['#1ACC45', '#79FFBF', '#FF6F3A', '#998060', '#CC7E1A'].map(color =>             new Container({ top: 0, height: 120, left: 0, right: 0,             skin: new Skin({ fill: color }) }))    ]}));var SearchTopBar = Container.template($ => ({	// top-bar	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,	height: device_list_topbar_height,	contents: [
		new Column( { contents: [
			new Line( { contents: [
				new CancelTemplate(),
			] }),			new Label({				string: "SELECT DEVICE TO ADD",				style: midText,			}),
		]}),		/*		new Line({						contents: [				//				new AddSearchTemplate({}),			]		}),		*/	]}));

let CancelTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Label({			string: "CANCEL",
			style: lightGraySmallText,			// top: 50, left: 240, right: home_list_item_padding, width: home_list_topbar_img_size, height: home_list_topbar_img_size,		})
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			application.remove(TMP_SCREEN);
        	HomeContent = HomeContentTemplate({});
        	LoadHomeContent(HomeContent);
        	HomeScreen = new HomeScreenTemplate({ HomeContent });
        	TMP_SCREEN = HomeScreen;
        	application.add(TMP_SCREEN);
		}
	})
}));