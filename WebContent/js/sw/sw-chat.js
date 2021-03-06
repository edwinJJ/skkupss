try{
function updateChattingBoxTitle(chatId, chatterInfos) {
	try{
		var title = "";
		var chatterList = new Array();
		if (!isEmpty(chatterInfos)) {
			for ( var i = 0, j = 0; i < chatterInfos.length; i++) {
				if (chatterInfos[i].userId !== currentUser.userId)
					chatterList[j++] = chatterInfos[i];
			}
			if (!isEmpty(chatterList)) {
				title = chatterList[0].longName;
				if (chatterList.length > 2) {
					title = title + smartMessage.get('chatUserAnd') + (chatterList.length - 1) + smartMessage.get('chatUserMore');
				} else {
					for ( var i = 1; i < chatterList.length; i++) {
						title = title + "," + chatterList[i].longName;
					}
				}
				$('#' + chatId).find('.js_chatting_title').html(title);
			} else {
				var lastChat = $('#' + chatId).find('.js_chatting_message_list li:last');
				var lastSenderId = lastChat.attr('senderId');
				if(isEmpty(lastChat)){
					title = smartMessage.get('chatNoChattersNoMessage');
				}else{
					title = smartMessage.get('chatNoChatters');
				}
				$('#' + chatId).find('.js_chatting_title').html(title);
				$('#' + chatId).find('div.js_chat_input textarea').attr('disabled', 'disabled');
				$('#' + chatId).find('a.js_admin_chatting_box').removeClass('js_admin_chatting_box').removeAttr('href');
				if(isEmpty(lastChat)){
					setTimeout(function(){
						try{
							$('#' + chatId).find('a.js_close_chatting_box').click();					
						}catch(error){
							smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat updateChattingBoxTitle setTimeout close]', null, error);
						}			
					}, 5000);
					if(isBlinkingOn(chatId)) return;
					var repeatBlinking = function(){
						setTimeout(function(){
							try{
								if(isEmpty($('#' + chatId))) return;
								$('#' + chatId).fadeTo('slow', 0.2).fadeTo('slow', 1.0);							
								repeatBlinking();
							}catch(error){
								smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat updateChattingBoxTitle setTimeout blinking]', null, error);
							}			
						}, 1000);			
					};
					repeatBlinking();
				}else{
					if(isBlinkingOn(chatId)) return;
					var repeatBlinking = function(){
						setTimeout(function(){
							try{
								if(isEmpty($('#' + chatId))) return;
								$('#' + chatId).fadeTo('slow', 0.2).fadeTo('slow', 1.0);							
								repeatBlinking();
							}catch(error){
								smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat updateChattingBoxTitle setTimeout blinking]', null, error);
							}			
						}, 5000);			
					};
					repeatBlinking();
				}
			}
		}else{
			$('#' + chatId).find('a.js_close_chatting_box').click();
		}
	}catch(error){
		smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat updateChattingBoxTitle]', null, error);
	}			
}

function fetchAllasyncMessages(chatId){
	try{
		$.ajax({
			url : "fetch_async_messages_by_chatid.sw",
			data : {
				chatId : chatId,
				receiverId : currentUser.userId
			},
			success : function(data, status, jqXHR) {
				try{
					if(!isEmpty(data.messages)){
						for(var i=0; i<data.messages.length; i++){
							var message = {};
							message['chatId'] = data.messages[i].chatId;
							message['chatMessage'] = data.messages[i].chatMessage;
							message['msgType'] = msgType.CHAT_MESSAGE;
							var senderInfo = {};
							senderInfo['userId'] = data.messages[i].senderId;
							senderInfo['longName'] = data.messages[i].senderLongName;
							senderInfo['nickName'] = data.messages[i].senderNickName;
							senderInfo['minPicture'] = data.messages[i].senderMinPicture;
							message['senderInfo'] = senderInfo;
							message['sendDate'] = (new Date((new Date(data.messages[i].lastModifiedDate)).getTime() + currentUser.timeOffset*1000*60*60));
							receivedMessageOnChatId(message);
							chatHistory.setHistory(chatId, message);
						}
					}
				}catch(error){
					smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat fetchAllasyncMessage fetch_async_messages_by_chatid]', null, error);
				}			
			},
			error : function(xhr, ajaxOptions, thrownError){
				smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat fetchAllayncMessage fetch_async_messages_by_chatid]', null, thrownError);
			}
		});		
	}catch(error){
		smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat fetchAllasyncMessages]', null, error);
	}			
};



var chattingBoxPadding = 3;

function getGroupPrevWidth(){
	try{
		var width = 0;
		var groupPrev = $('div.js_chatting_group_prev');
		if(groupPrev.css("display")==="none")
			return 0;
		else
			return (groupPrev.width() + chattingBoxPadding);
	}catch(error){
		smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat getGroupPrevWidth]', null, error);
	}			
}

function setRightPosition(type, chattingBox){
	try{
		if(type==="new" && chattingBox!=null){
			var prevElements = chattingBox.prevAll('div.js_chatting_box');
			var prevElementsWidth = $('div.js_chatter_list').width() + chattingBoxPadding;
			if(isEmpty(prevElements)){
				chattingBox.css({"right" : + prevElementsWidth + "px"});
			}else{
				prevElementsWidth = prevElementsWidth + getGroupPrevWidth();
				for(var i=0; i<prevElements.length; i++){
					prevElementsWidth = prevElementsWidth + $(prevElements[i]).width() + chattingBoxPadding;
				}
				chattingBox.css({"right" : + prevElementsWidth + "px"});
				prevElementsWidth = prevElementsWidth + chattingBox.width() + chattingBoxPadding;
				$('div.js_chatting_group_next').css({"right" : + prevElementsWidth + "px"});
			}
		}else if(type==="resize" && chattingBox!=null){
			var prevElements = chattingBox.prevAll('div.js_chatting_box');
			var prevElementsWidth = $('div.js_chatter_list').width() + chattingBoxPadding;
			prevElementsWidth = prevElementsWidth + getGroupPrevWidth();
			for(var i=0; i<prevElements.length; i++)
				prevElementsWidth = prevElementsWidth + $(prevElements[i]).width() + chattingBoxPadding;
			prevElementsWidth = prevElementsWidth + chattingBox.width() + chattingBoxPadding;
			var nextElements = chattingBox.nextAll('div.js_chatting_box');
			for(var i=0; i<nextElements.length; i++){
				$(nextElements[i]).css({"right" : + prevElementsWidth + "px"});
				prevElementsWidth = prevElementsWidth + $(nextElements[i]).width() + chattingBoxPadding;
			}
			$('div.js_chatting_group_next').css({"right" : + prevElementsWidth + "px"});
		}else if(type==="remove" && chattingBox!=null){
			var prevElements = chattingBox.prevAll('div.js_chatting_box');
			var prevElementsWidth = $('div.js_chatter_list').width() + chattingBoxPadding;
			prevElementsWidth = prevElementsWidth + getGroupPrevWidth();
			for(var i=0; i<prevElements.length; i++)
				prevElementsWidth = prevElementsWidth + $(prevElements[i]).width() + chattingBoxPadding;
			var nextElements = chattingBox.nextAll('div.js_chatting_box');
			for(var i=0; i<nextElements.length; i++){
				$(nextElements[i]).css({"right" : + prevElementsWidth + "px"});
				prevElementsWidth = prevElementsWidth + $(nextElements[i]).width() + chattingBoxPadding;
			}
			$('div.js_chatting_group_next').css({"right" : + prevElementsWidth + "px"});		
		}else if(type==="resize" && chattingBox==null){
			var prevElementsWidth = $('div.js_chatter_list').width() + chattingBoxPadding;
			var groupPrev = $('div.js_chatting_group_prev'); 
			groupPrev.css({"right" : + prevElementsWidth + "px"});
			prevElementsWidth = prevElementsWidth + getGroupPrevWidth();
			var nextElements = $('div.js_chatting_box_list').children('div.js_chatting_box');
			for(var i=0; i<nextElements.length; i++){
				$(nextElements[i]).css({"right" : + prevElementsWidth + "px"});
				prevElementsWidth = prevElementsWidth + $(nextElements[i]).width() + chattingBoxPadding;
			}
			$('div.js_chatting_group_next').css({"right" : + prevElementsWidth + "px"});
		}else if(type==="groupPrev" && chattingBox!=null){
			var prevElementsWidth = $('div.js_chatter_list').width() + chattingBoxPadding;
			chattingBox.css({"right" : + prevElementsWidth + "px"});
			prevElementsWidth = prevElementsWidth + getGroupPrevWidth();
			var nextElements = $('div.js_chatting_box_list').children('div.js_chatting_box');
			for(var i=0; i<nextElements.length; i++){
				$(nextElements[i]).css({"right" : + prevElementsWidth + "px"});
				prevElementsWidth = prevElementsWidth + $(nextElements[i]).width() + chattingBoxPadding;
			}
			$('div.js_chatting_group_next').css({"right" : + prevElementsWidth + "px"});
		}else if(type==="groupNext" && chattingBox!=null){
			var prevElementsWidth = $('div.js_chatter_list').width() + chattingBoxPadding;
			var prevElements = $('div.js_chatting_box_list').children('div.js_chatting_box');
			for(var i=0; i<prevElements.length; i++){
				prevElementsWidth = prevElementsWidth + $(prevElements[i]).width() + chattingBoxPadding;
			}
			chattingBox.css({"right" : + prevElementsWidth + "px"});
		}
	}catch(error){
		smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat setRightPosition]', null, error);
	}			
}
function shiftBoxToGroup(type, chattingBox){
	try{
		if(type === "prev"){
			chattingBox.hide();
			var groupPrev = chattingBox.parent().prev('div.js_chatting_group_prev');
			chattingBox.remove();
			groupPrev.append(chattingBox);
			groupPrev.find('span.js_group_prev_count').text(groupPrev.children('div.js_chatting_box').length);
			groupPrev.show();
			setRightPosition("groupPrev", groupPrev);
		}else if(type === "next"){
			chattingBox.hide();
			var groupNext = chattingBox.parent().siblings('div.js_chatting_group_next');
			chattingBox.remove();
			groupNext.append(chattingBox);
			groupNext.find('span.js_group_next_count').text(groupNext.children('div.js_chatting_box').length);
			groupNext.show();
			setRightPosition("groupNext", groupNext);
		}
	}catch(error){
		smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat shiftBoxToGroup]', null, error);
	}			
}

function shiftBoxFromGroup(type, chattingBox){
	try{
		if(type === "prev"){
			var groupPrev = $('div.js_chatting_group_prev');
			chattingBox.show();
			chattingBox.remove();
			$('div.js_chatting_box_list').prepend(chattingBox);
			chattingBox.find('div.js_chatting_title_icons').show();
			chattingBox.find('div.js_chatting_body').slideDown(500);
			var prevCount = groupPrev.children('div.js_chatting_box').length;
			groupPrev.find('span.js_group_prev_count').text(prevCount);
			if(prevCount==0){
				groupPrev.hide();
				setRightPosition("groupPrev", groupPrev);
			}
		}else if(type === "next"){
			var groupNext = $('div.js_chatting_group_next');
			chattingBox.show();
			chattingBox.remove();
			$('div.js_chatting_box_list').append(chattingBox);
			chattingBox.find('div.js_chatting_title_icons').show();
			chattingBox.find('div.js_chatting_body').slideDown(500);
			var nextCount = groupNext.children('div.js_chatting_box').length;
			groupNext.find('span.js_group_next_count').text(nextCount);
			if(nextCount==0){
				groupNext.hide();
			}		
		}
	}catch(error){
		smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat shiftBoxFromGroup]', null, error);
	}			
}

function startChattingWindow(message) {
	try{
		var target = $('div.js_chatting_box_list');
		var chattingBoxs = target.find('div.js_chatting_box');
		for(var i=0; i<chattingBoxs.length; i++ )
			if($(chattingBoxs[i]).attr('id') === message.chatId)
				return;
		
		var chatId = message.chatId;
		var chatterInfos = chatManager.chatterInfos(message.chatId);
		if(isEmpty(chatId) || isEmpty(chatterInfos)) return;
		$.ajax({
			url : "chatting_box.sw",
			data : {},
			success : function(data, status, jqXHR) {
				try{
					if(chattingBoxs.length == 3){
						shiftBoxToGroup("prev", $(chattingBoxs[0]));
					}
					var chattingBox = $(data);
					chattingBox.attr("id", chatId);
					target.append(chattingBox);
					setRightPosition("new", $('#'+chatId));
					updateChattingBoxTitle(chatId, chatterInfos);
					fetchAllasyncMessages(chatId);
					for ( var i = 0; i < chatterInfos.length; i++){
						updateChatterStatus(chatId, chatterInfos[i], chatterInfos[i].status);
					}
					chattingBox.slideDown(1000);
				}catch(error){
					smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat startChattingWindow chatting_box]', null, error);
				}			
			},
			error : function(xhr, ajaxOptions, thrownError){
				smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat startChattingWindow chatting_box]', null, thrownError);
			}
		});
	}catch(error){
		smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat startChattingWindow]', null, error);
	}			
}

var blinkingOn = new Array();
function isBlinkingOn(chatId){
	try{
		for(var i=0; i<blinkingOn.length; i++){
			if(blinkingOn[i] === chatId){
				return true;
			}
		}
	}catch(error){
		smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat isBlinkingOn]', null, error);
	}			
	return false;
}
function removeBlinkingOn(chatId){
	try{
		for(var i=0; i<blinkingOn.length; i++){
			if(blinkingOn[i] === chatId){
				blinkingOn.splice(i,1);
				return;
			}
		}
	}catch(error){
		smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat removeBlinkingOn]', null, error);
	}			
}

function receivedMessageOnChatId(message) {
	try{
		var chatId = message.chatId;
		var senderInfo = message.senderInfo;
		var chatMessage = message.chatMessage;
		var senderName = (senderInfo.userId === currentUserId) ? '' : '<div class="t_s11">' + senderInfo.longName + '</div>';
		var sendDate = new Date(message.sendDate);
		var target = $('#' + chatId).find('div.js_chatting_message_list');
		if(!isEmpty(target)){
			var data = "<li senderId='" + senderInfo.userId + "'>" + 
							"<div class='noti_pic'>" +
								"<img src='" + senderInfo.minPicture + "' class='profile_size_s' title='" + senderInfo.longName+ "'>" + 
							"</div>" + 
							"<div class='noti_in'>" + senderName + chatMessage + "<span class='t_date ml3' >" + printDateTime(sendDate) + "</span></div>" +
						"</li>";
			target.find('ul').append(data);
			target[0].scrollTop = target[0].scrollHeight;
			var chattingBox = $('#'+chatId);
			if(chattingBox.find('div.js_chatting_body').css('display') === "none"){
				if(isBlinkingOn(chatId)) return;
				blinkingOn.push(chatId);
				var repeatBlinking = function(){
					var id = chatId;
					setTimeout(function(){
						try{
							chattingBox.fadeTo('slow', 0.2).fadeTo('slow', 1.0);							
							if(isBlinkingOn(id)) repeatBlinking();
						}catch(error){
							smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat receivedMessageOnChatId setTimeout]', null, error);
						}			
					}, 3000);			
				};
				repeatBlinking();
			}
		}else{
//			smartTalk.restartSubOnChatId(message);
//			startChattingWindow(message);
//			fetchAllasyncMessages(message.chatId);
		}
	}catch(error){
		smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat receivedMessageOnChatId]', null, error);
	}			
}

function writingStatusOnChatId(chatId, sender) {
}

function updateChatterStatus(chatId, chatterInfo, status) {
	try{
		if(!chatterInfo) return;
		var userId = chatterInfo.userId;
		var longName = chatterInfo.longName;
		var target = $('#' + chatId).find('div.js_chatter_status_list');
		var statusList = target.children();
		for ( var i = 0; i < statusList.length; i++) {
			if ($(statusList[i]).attr('userId') === userId) {
				$(statusList[i]).remove();
			}
		}
		if (status === userStatus.ONLINE) {
		} else if (status === userStatus.OFFLINE) {
			var data = "<div class='msg_section' userId='" + userId
					+ "'><span class='t_name'>" + longName
					+ "</span>" + smartMessage.get('chatUserOfflineMessage') + "</div>";
			target.append(data);
		}else if(status === userStatus.LEAVED){
			
		}
	}catch(error){
		smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat updateChatterStatus]', null, error);
	}			
}
$(function() {
	$('#available_chatter_list a').live('click', function(e) {
		try{
			var input = $(targetElement(e)).parents('a');
			if(isEmpty(input)) input = $(targetElement(e));
			var userId = input.attr('userId');
			//var comId = input.attr('comId');
			var img = input.find('img');
			var longName = img.attr('title');
			var minPicture = img.attr('src');
			var nickNameBase = ($('.js_chatter_list_page').attr('nickNameBase') === 'true');
			smartTalk.chattingRequest(new Array({
				userId : currentUserId,
				longName : nickNameBase ? currentUser.nickName : currentUser.longName,
				minPicture : currentUser.minPicture
			}, {
				userId : userId,
				longName : longName,
				minPicture : minPicture
			}));
			input.parents('div.js_chatter_list').find('div.js_chatter_search_area').slideUp(500);
			setTimeout(function(){
				try{
					setRightPosition("resize", null);
				}catch(error){
					smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat available_chatter_list setTimeout]', null, error);
				}			
			}, 600);
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat available_chatter_list]', null, error);
		}			
		return false;
	});
	
	$('a.js_close_chatting_box').live('click', function(e) {
		try{
			var input = $(targetElement(e));
			var target = input.parents('div.js_chatting_box:first');
			var chatId = target.attr('id');
			setRightPosition("remove", target);
			target.remove();
			smartTalk.stopSubOnChatId(chatId);
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_close_chatting_box]', null, error);
		}			
		return false;
	});
	
	$('a.js_min_chatting_box').live('click',function(e) {
		try{
			var input = $(targetElement(e));
			input.parents('div.js_chatting_title_icons:first').hide().parents('div.js_chatting_header').siblings('div.js_chatting_body').slideUp(500);
			var target = input.parents('div.js_chatting_box');
			setTimeout(function(){
				try{
					setRightPosition("resize", target);
				}catch(error){
					smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_min_chatting_box setTimeout]', null, error);
				}			
			}, 600);
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_min_chatting_box]', null, error);
		}			
		return false;
	});
	
	$('div.js_chatting_header').live('click',function(e) {
		try{
			var input = $(targetElement(e)).parents('div.js_chatting_box:first').children('div.js_chatting_header');
			if (input.children('div.js_chatting_title_icons').css("display") === "none") {
				input.children('div.js_chatting_title_icons:first').show().parents('div.js_chatting_header').siblings('div.js_chatting_body').slideDown(500);
				var target = input.parents('div.js_chatting_box');
				setRightPosition("resize", target);
	
			}
			removeBlinkingOn(input.parents('div.js_chatting_box').attr('id'));
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_chatting_header]', null, error);
		}			
		return false;
	});
	
	$('a.js_admin_chatting_box').live('click',function(e) {
		try{
			var input = $(targetElement(e));
			input.parents('div.js_chatting_header:first').siblings('div.js_chatting_body').children('div.js_chatters_search_box').slideDown(500);
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_admin_chatting_box]', null, error);
		}			
		return false;
	});
	
	$('a.js_toggle_chatter_list').live('click',function(e) {
		try{
			var input = $(targetElement(e));
			var chatterList = input.parents('div.js_chatter_list_page');
			var target = chatterList.find('div.js_chatter_search_area');
			var display = target.css('display');
			if (display !== "none") {
				if(!isEmpty(target.find('input.js_auto_complete').attr('value')) || target.find('.js_chatter_list').hasClass('searching')){
					target.find('.js_chatter_list').html('').removeClass('searching');
					target.find('input.js_auto_complete').attr('value', '');
				}
				setTimeout(function(){ setRightPosition("resize", null); }, 600);
			}else if(isEmpty(target.find('.js_chatter_list').html())){
				$.ajax({
					url : 'available_chatter_list.sw',
					data : {},
					success : function(data, status, jqXHR) {
						try{
							target.find('.js_chatter_list').html(data);
							setRightPosition("resize", null);
						}catch(error){
							smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_toggle_chatter_list availabe_chatter_list]', null, error);
						}			
					},
					error : function(xhr, ajaxOptions, thrownError){
						smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_toggle_chatter_list available_chatter_list]', null, thrownError);
					}
				});
				target.find('input.js_auto_complete').focus();
			}else{
				setTimeout(function(){ setRightPosition("resize", null); }, 600);
				target.find('input.js_auto_complete').focus();
			}
			target.slideToggle(500);
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_toggle_chatter_list]', null, error);
		}			
		return false;
	});
	
	$('div.js_chatting_group_prev a').live('click',function(e) {
		try{
			var input = $(targetElement(e)).parents('div.js_chatting_group_prev');
			var lastChattingBox = input.children('div.js_chatting_box:last');
			if(isEmpty(lastChattingBox)) return false;
			var chattingBoxs = $('div.js_chatting_box_list').children('div.js_chatting_box');
			if(chattingBoxs.length==3){
				shiftBoxToGroup("next", $(chattingBoxs[2]));
			}
			shiftBoxFromGroup("prev", lastChattingBox);
			setRightPosition("groupPrev", input);				
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_chatting_group_prev]', null, error);
		}			
		return false;
	});
	
	$('div.js_chatting_group_next a').live('click',function(e) {
		try{
			var input = $(targetElement(e)).parents('div.js_chatting_group_next');
			var firstChattingBox = input.children('div.js_chatting_box:first');
			if(isEmpty(firstChattingBox)) return false;
			var chattingBoxs = $('div.js_chatting_box_list').children('div.js_chatting_box');
			if(chattingBoxs.length==3){
				shiftBoxToGroup("prev", $(chattingBoxs[0]));
			}
			shiftBoxFromGroup("next", firstChattingBox);
			setRightPosition("groupNext", input);				
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_cahtting_group_next]', null, error);
		}			
		return false;
	});
	
	$('a.js_add_chatters').live('click',function(e) {
		try{
			var input = $(targetElement(e));
			var chatId = input.parents('div.js_chatting_box:first').attr('id');
			var target = input.parents('div.js_chatter_names').find(
					'div.js_selected_chatters');
			var chatterList = target.children('span.js_chatter_item');
			var chatterInfos = new Array();
			for ( var i = 0; i < chatterList.length; i++) {
				var chatter = $(chatterList[i]);
				chatterInfos.push({
					userId : chatter.attr('comId'),
					longName : chatter.attr('comName'),
					minPicture : chatter.attr('minPicture')
				});
			}
			chatterList.remove();
			smartTalk.addJoinChatters(chatId, chatterInfos);
			input.parents('div.js_chatters_search_box').slideUp(500);
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_add_chatters]', null, error);
		}			
		return false;
	});
	
	$('div.js_chat_input textarea').live('keypress', function(e) {
		try{
			var e = window.event || e;
			var keyCode = e.which || e.keyCode;
			if (keyCode == $.ui.keyCode.ENTER) {
				var input = $(targetElement(e));
				var chattingBox = input.parents('div.js_chatting_box:first');
				var chatId = chattingBox.attr('id');
				var message = input.attr('value');
				if (!isEmpty(message)) {
					smartTalk.publishChatMessage(chatId, message);
				}
				input.attr('value', '');
				return false;
			}
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_chat_input keypress]', null, error);
		}			
	});
	
	$('div.js_chat_input textarea').live('focusin', function(e) {
		try{
			var input = $(targetElement(e));
			var chatId = input.parents('div.js_chatting_box:first').attr('id');
			smartTalk.publishWritingStatus(chatId);
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_chat_input focusin]', null, error);
		}			
	});
	
	$('.js_invite_chatter a').live( 'click', function(e) {
		try{
			var input = $(targetElement(e));
			var comId = input.attr('userId');
			var comName = input.children('img').attr('title');
			var minPicture = input.children('img').attr('src');
			var target = input.parents('div.js_chatter_list').siblings('div.js_chatter_names').find('div.js_selected_chatters');
			var oldHTML = target.html();
			if (oldHTML == null)
				oldHTML = "";
			var chatterItems = $(target).find('span.js_chatter_item');
			var isSameId = false;
			for ( var i = 0; i < chatterItems.length; i++) {
				var oldComId = $(chatterItems[i]).attr('comId');
				if (oldComId != null && oldComId === comId) {
					isSameId = true;
					break;
				}
			}
			if (!isSameId) {
				var newHTML = oldHTML
						+ "<span class='js_chatter_item user_select' comId='"
						+ comId
						+ "' comName='"
						+ comName
						+ "' minPicture='"
						+ minPicture
						+ "'>"
						+ comName
						+ "<span class='btn_x_gr'><a class='js_remove_chatter' href=''> x</a></span></span>";
				target.html(newHTML);
			}
			target.next().focus();
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_invite_chatter]', null, error);
		}			
		return false;
	});
	
	$('.js_remove_chatter').live('click', function(e) {
		try{
			var input = $(targetElement(e));
			var selected_users = input.parents('div.js_selected_chatters');
			input.parents('span.js_chatter_item').remove();
			selected_users.next().focus();
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_remove_chatter]', null, error);
		}			
		return false;
	});

	$('a.js_start_chat_with_user').live('click', function(e){
		try{
			var input = $(targetElement(e));
			var chatId = input.attr('chatId');
			var chatterId = input.attr('userId');
			var chatterName = input.attr('longName');
			var chatterPicture = input.attr('minPicture');
			smartTalk.chattingRequest(new Array({
				userId : currentUserId,
				longName : currentUser.longName,
				minPicture : currentUser.minPicture
			}, {
				userId : chatterId,
				longName : chatterName,
				minPicture : chatterPicture
			}), chatId);
			setTimeout(function(){
				try{
					setRightPosition("resize", null);
				}catch(error){
					smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat hs_start_chat_with_user setTimeout]', null, error);
				}			
			}, 600);
			input.parents('#sw_pop_user_info').hide();
			input.parents('#notice_message_box').find('.js_close_message a').click();
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat js_start_chat_with_user]', null, error);
		}			
		return false;
	});
});
}catch(error){
	smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-chat script]', null, error);
}
