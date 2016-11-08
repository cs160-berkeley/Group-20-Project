import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,
    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';

import {
	TMP_SCREEN
} from "global_settings";

export var DeviceScreen;
export var DeviceContent;export var DeviceScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    contents: [        VerticalScroller($, {             active: true, top: 0, bottom: 0,            contents: [                $.DeviceContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),    ]}));

export var DeviceContentTemplate = Column.template($ => ({    top: 0, left: 0, right: 0,     contents: [        ['#1ACC45', '#79FFBF', '#FF6F3A', '#998060', '#CC7E1A'].map(color =>             new Container({ top: 0, height: 120, left: 0, right: 0,             skin: new Skin({ fill: color }) }))    ]}));
