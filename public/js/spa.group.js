/**
 * spa.group.js
 * 
 */

/** global $, spa */
 spa.group = (function() {
 	'use stict';

 	var configMap = {
 		main_html: String()
 			+ '<div class="spa-group-wrapper">'
 				+ '<div class="spa-group-roster-groups">'
 					+ '<div class="spa-group-roster-contacts"></div>'
 				+ '</div>'
 			+ '</div>',
 		chat_model: null,
		people_model: null
 	},
 	
	settable_map = null,
 	stateMap =  {
		$append_target: null,
		
		// $container: null
	},
	jqueryMap = {},
	setJqueryMap, addGroup, configModule, initModule;

	setJqueryMap = function() {
		// var $container = stateMap.$container;
		var $append_target = stateMap.$append_target,
			$roster = $append_target.find('.spa-group-wrapper');
		jqueryMap = {
			$roster: $roster,
			//$head: $roster.find('.spa-chat-head'),
			$groupFir: $roster.find('.spa-group-roster-groups'),
			$groupSec: $roster.find('.spa-group-roster-contacts'),
			//$group-thi: $roster.find('.spa-group-roster-groups'),
			/*$title: $roster.find('.spa-chat-head-title'),
			$sizer: $roster.find('.spa-chat-sizer'),
			$list_box: $roster.find('.spa-chat-list-box'),
			$msg_log: $roster.find('.spa-chat-msg-log'),
			$msg_in: $roster.find('.spa-chat-msg-in'),
			$input: $roster.find('.spa-chat-msg-in input[type=text]'),
			$send: $roster.find('.spa-chat-msg-send'),
			$form: $roster.find('.spa-chat-msg-form'),*/
			$window: $(window)
			// $container: $container
		};
	};

	addGroup = function() {
		var list_html = String(), select_class,
			people_db = configMap.people_model.get_db(),
			chatee = configMap.chat_model.get_chatee();
		people_db().each(function(person, idx) {
			select_class = '';
			if (person.get_is_anon() || person.get_is_user()) {
				return true;
			}
			if (chatee && chatee.id === person.id) {
				select_class = 'spa-x-select';
			}
			list_html += '<div class="pass spa-group-list-name '
				+ select_class + '" data-id="' + person.id + '"'
				+ 'title="' + person.id + '">'
				+ spa.util_b.encodeHtml(person.name)
				+ '<div class="spa-group-roster-contacts"></div>'
				+ '</div>';
		});
		if (!list_html) {
			list_html = String()
				+ '<div class="spa-group-list-note">'
					+ 'To chat alone is the fate of all great souls...<br><br>'
					+ 'No one is online'
				+ '</div>';
		}
		jqueryMap.$groupFir.html(list_html);
		addSubGroups();
	};

	addSubGroups = function() {
		var list_html = String(), select_class,
			datas = [
			{
				name: 'Betty',
				_id: 'id_101',
				pid: 'id_01',
				css_map: {
					top: 20,
					left: 20,
					'background-color': 'rgb(128, 128, 128)'
				}
			},
			{
				name: 'Mike',
				_id: 'id_102',
				pid: 'id_01',
				css_map: {
					top: 60,
					left: 20,
					'background-color': 'rgb(128, 255, 128)'
				}
			},
			{
				name: 'Pebbles',
				_id: 'id_203',
				pid: 'id_02',
				css_map: {
					top: 100,
					left: 20,
					'background-color': 'rgb(128, 192, 192)'
				}
			},
			{
				name: 'Wilma',
				_id: 'id_304',
				pid: 'id_03',
				css_map: {
					top:140,
					left: 20,
					'background-color': 'rgb(192, 128, 128)'
				}
			}
		];
		var $groupSec = jqueryMap.$roster.find('.spa-group-list-name');
		$(datas).each(function(id) {
			select_class = '';
			list_html += '<div class="spa-group-list-name '
				+ select_class + '" data-id="' + datas[id].id + '"'
				+ 'title="' + datas[id].id + '" style="margin-left:10px;">'
				+ spa.util_b.encodeHtml(datas[id].name)
				+ '<div class="spa-group-roster-contacts"></div>'
				+ '</div>';
			$groupSec.each(function(idx){
				if ($($groupSec[idx]).attr('data-id') === datas[id].pid) {
					$($groupSec[idx]).find('.spa-group-roster-contacts').before(list_html);
				}
			});
		});
	};

	configModule = function(input_map) {
		spa.util.setConfigMap({
			input_map: input_map,
			settable_map: configMap.settable_map,
			configmap: configMap
		});
		return true;
	};
	initModule = function($append_target) {
		var $list_box;
		$append_target.append(configMap.main_html);
		stateMap.$append_target = $append_target;
		setJqueryMap();
		addGroup();
		/*$container.html(configMap.main_html);
		stateMap.$container = $container;
		setJqueryMap();*/
		//initialize chat roster to default title and state
		//jqueryMap.$toggle.prop('title', configMap.roster_closed_title);
		//stateMap.position_type = 'closed';

		//$list_box = jqueryMap.$list_box;
		/*$.gevent.subscribe($list_box, 'spa-listchange', onListchange);
		$.gevent.subscribe($list_box, 'spa-setchatee', onSetchatee);
		$.gevent.subscribe($list_box, 'spa-updatechat', onUpdatechat);
		$.gevent.subscribe($list_box, 'spa-login', onLogin);
		$.gevent.subscribe($list_box, 'spa-logout', onLogout);*/
/*
		jqueryMap.$head.bind('utap', onTapToggle);
		jqueryMap.$list_box.bind('utap', onTapList);
		jqueryMap.$send.bind('utap', onSubmitMsg);
		jqueryMap.$form.bind('submit', onSubmitMsg);*/

		return true;
	};

	return {
		configModule: configModule,
		initModule: initModule
	}
 }());