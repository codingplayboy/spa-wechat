/**
 * spa.shell.js
 * Shell module for SPA
 */
/** global $, spa */

spa.shell = (function() {
	'use strict';
	/** Begin module scope variables */
	var configMap = {
		anchor_schema_map: {
			chat: {
				opened: true,
				closed: true
			}
		},
		main_html: String()
			+ '<div class="spa-shell-head">'
				+ '<div class="spa-shell-head-logo">'
					+ '<h1>SPA CHAT</h1>'
					+ '<p>javascript end to end</p>'
				+ '</div>'
				+ '<div class="spa-shell-head-acct"></div>'
				+ '<div class="spa-shell-head-search"></div>'
			+ '</div>'
			+ '<div class="spa-shell-main">'
				+ '<div class="spa-shell-main-nav"></div>'
				+ '<div class="spa-shell-main-content"></div>'
			+ '</div>'
			+ '<div class="spa-shell-foot"></div>'
			+ '<div class="spa-shell-chat"></div>'
			+ '<div class="spa-shell-modal"></div>',
		chat_extend_time: 600,
		chat_retract_time: 300,
		chat_extend_height: 450,
		chat_retract_height: 15,
		chat_extended_title: 'click to retract',
		chat_retracted_title: 'click to extend',

		resize_interval: 200
	},
	stateMap = {
		$container: undefined,
		anchor_map: {},
		is_chat_retracted: true,
		resize_idto: undefined
	},
	jqueryMap = {},
	copyAnchorMap, changeAnchorPart, onHashchange, onResize,
	onTapAcct, onLogin, onLogout,
	setChatAnchor, setJqueryMap, /*toggleChat, onClickChat,*/ initModule;
	/** End module scope variables */

	/** Begin utility methods */
	copyAnchorMap = function() {
		return $.extend(true, {}, stateMap.anchor_map);
	}
	/** End utility methods */

	changeAnchorPart = function(arg_map) {
		var anchor_map_revise = copyAnchorMap(),
			bool_return = true,
			key_name, key_name_dep;
		//Begin merge changes into anchor map
		KEYVAL:
		for (key_name in arg_map) {
			if (arg_map.hasOwnProperty(key_name)) {
				//skip dependent keys during iteration
				if (key_name.indexOf('_') === 0) {
					continue KEYVAL;
				}
				//update independent key value
				anchor_map_revise[key_name] = arg_map[key_name];
				//update matching dependent key
				key_name_dep = '_' + key_name;
				if (arg_map[key_name_dep]) {
					anchor_map_revise[key_name_dep] = arg_map[key_name_dep]
				}else {
					delete anchor_map_revise[key_name_dep];
					delete anchor_map_revise['_s' + key_name_dep];
				}
			}
		}
		//End merge changes into anchor map
		//Begin attempt to update URI, revert if not successful
		try {
			$.uriAnchor.setAnchor(anchor_map_revise);
		}catch(error) {
			//replace URI with existing state
			$.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
			bool_return = false;
		}
		//End attempt to update URI...
		return bool_return;

	};
	/** Begin DOM method /setJqueryMap */
	setJqueryMap = function() {
		var $container = stateMap.$container;
		jqueryMap = {
			$container: $container,
			// $chat: $container.find('.spa-shell-chat')
			$acct: $container.find('.spa-shell-head-acct'),
			$nav: $container.find('.spa-shell-main-nav')
		};
	};
	/** End DOM method setJqueryMap */

	/** Begin DOM method /toggleChat */
	/*toggleChat = function(do_extend, callback) {
		var px_chat_ht = jqueryMap.$chat.height(),
			is_open = px_chat_ht === configMap.chat_extend_height,
			is_closed = px_chat_ht === configMap.chat_retract_height,
			is_sliding = !is_open && !is_closed;
		if (is_sliding) {
			return false;
		}
		if (do_extend) {
			jqueryMap.$chat.animate(
				{
					height: configMap.chat_extend_height
				},
				configMap.chat_extend_time,
				function() {
					jqueryMap.$chat.attr(
						'title', configMap.chat_extended_title
					);
					stateMap.is_chat_retracted = false;
					if (callback) {
						callback(jqueryMap.$chat);
					}
				}
			);
			return true;
		}
		jqueryMap.$chat.animate(
			{height: configMap.chat_retract_height},
			configMap.chat_retract_time,
			function() {
				jqueryMap.$chat.attr(
					'title', configMap.chat_retracted_title
				);
				stateMap.is_chat_retracted = true;
				if (callback) {
					callback(jqueryMap.$chat);
				}
			}
		);
		return true;
	};*/
	/** End DOM method /toggleChat/ */

	/** Begin event handlers */
	onHashchange = function(event) {
		var anchor_map_previous = copyAnchorMap(),
			is_ok = true,
			anchor_map_proposed,
			_s_chat_previous, _s_chat_proposed, s_chat_proposed;
		//attempt tp parse anchor
		try {
			anchor_map_proposed = $.uriAnchor.makeAnchorMap();
		}catch(error) {
			$.uriAnchor.setAnchor(anchor_map_previous, null, true);
			return false;
		}
		stateMap.anchor_map = anchor_map_proposed;
		//convenience vars
		_s_chat_previous = anchor_map_previous._s_chat;
		_s_chat_proposed = anchor_map_proposed._s_chat;
		//Begin adjust chat component if changed
		if (!anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
			s_chat_proposed = anchor_map_proposed.chat;
			switch(s_chat_proposed) {
				case 'opened':
					//toggleChat(true);
					is_ok = spa.chat.setSliderPosition('opened');
					break;
				case 'closed':
					// toggleChat(false);
					is_ok = spa.chat.setSliderPosition('closed');
					break;
				default:
				// toggleChat(false);
				spa.chat.setSliderPosition('closed');
				delete anchor_map_proposed.chat;
				$.uriAnchor.setAnchor(anchor_map_proposed, null, true);
			}
		}
		//End adjust chat component if changed
		//Begin revert anchor if slider change denied
		if (!is_ok) {
			if (anchor_map_previous) {
				$.uriAnchor.setAnchor(anchor_map_previous, null, true);
				stateMap.anchor_map = anchor_map_previous;
			}else {
				delete anchor_map_proposed.chat;
				$.uriAnchor.setAnchor(anchor_map_proposed, null, true);
			}
		}
		//End revert anchor if slider change denied
		return false;
	};
	setChatAnchor = function(position_type) {
		return changeAnchorPart({chat: position_type});
	};
	onResize = function() {
		if (stateMap.resize_idto) {
			return true;
		}
		spa.chat.handleResize();
		stateMap.resize_idto = setTimeout(
			function() {
				stateMap.resize_idto = undefined;
			}, 
			configMap.resize_interval
		);
		return true;
	};
	/*onClickChat = function(event) {
		changeAnchorPart({
			chat: (stateMap.is_chat_retracted ? 'open' : 'closed')
		});
		return false;
	};*/
	onTapAcct = function(event) {
		var acct_text, user_name, user = spa.model.people.get_user(), flag;
		if (user.get_is_anon()) {
			user_name = prompt('please sign-in');
			spa.model.people.login(user_name);
			jqueryMap.$acct.text('...processing...');
		}else {
			flag = confirm('Be sure to logout?');
			if (flag) {
				spa.model.people.logout();
			}
		}
		return false;
	};
	onLogin = function(event, login_user) {
		jqueryMap.$acct.text(login_user.name);
	};
	onLogout = function(event, logout_user) {
		jqueryMap.$acct.text('Please sign-in');
	};
	/** End event handlers */

	/** Begin public methods */
	//public method /initModule/
	initModule = function($container) {
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();

		//initialize chat_slider and bind click handler
		/*stateMap.is_chat_retracted = true;
		jqueryMap.$chat
			.attr('title', configMap.chat_retracted_title)
			.on('click', onClickChat);*/
		//configure uriAnchor to use schema
		$.uriAnchor.configModule({
			schema_map: configMap.anchor_schema_map
		});
		//configure and initialize feature modules
		spa.chat.configModule({
			set_chat_anchor: setChatAnchor,
			chat_model: spa.model.chat,
			people_model: spa.model.people
		});
		spa.chat.initModule(jqueryMap.$container);//$chat
		spa.avtr.configModule({
			chat_model: spa.model.chat,
			people_model: spa.model.people
		});
		spa.avtr.initModule(jqueryMap.$nav);
		spa.group.configModule({
			chat_model: spa.model.chat,
			people_model: spa.model.people
		});
		spa.group.initModule(jqueryMap.$nav);
		$(window).bind('resize', onResize)
				 .bind('hashchange', onHashchange)
				 .trigger('hashchange');

		$.gevent.subscribe($container, 'spa-login', onLogin);
		$.gevent.subscribe($container, 'spa-logout', onLogout);

		jqueryMap.$acct
				 .text('Please sign-in')
				 .bind('utap', onTapAcct);
	};
	//End public method /initModule/
	return {initModule: initModule};
	/** End public methods */
}());