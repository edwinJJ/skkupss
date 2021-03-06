
$(function() {
	
	$('.js_select_space_type a').live('click',function(e) {
		try{
			var input = $(targetElement(e));
			
			var newProductService = input.parents('.js_new_product_service_page');
			var psId = newProductService.attr('psId');
			var isEditMode = newProductService.attr('isEditMode');
			var href = input.attr('href');
			var spaceType = input.attr('spaceType');
			var spaceTypeStr = input.attr('spaceTypeStr');
			var isCVCAEnabledStr = input.attr('isCVCAEnabled') || "true";
			var isCVCAEnabled = isCVCAEnabledStr === 'true';
			input.parent().addClass('current').siblings().removeClass('current');

			var newSpaceTab = newProductService.find('.js_space_tab:visible').clone();
			cloneSelectedValues(newProductService.find('.js_space_tab:visible'), newSpaceTab);

			var newSpaceType = newSpaceTab.attr();
			var oldSameSpaceTab = newProductService.find('form[name="frmNewProductService"]').find('.js_space_tab[spaceType="' + newSpaceTab.attr('spaceType') + '"]:hidden');
			if(!isEmpty(oldSameSpaceTab)) oldSameSpaceTab.parent().remove();
			newProductService.find('form[name="frmNewProductService"]').append($('<form name="frmSpaceTab"></form>').html(newSpaceTab).hide());
			
			var savedSpaceTab = newProductService.find('form[name="frmNewProductService"]').find('.js_space_tab[spaceType="' + spaceType + '"]:hidden');
			if(isEmpty(savedSpaceTab) || (spaceType == '3' && isEditMode) || (spaceType == '8' && isEditMode) || (spaceType == '10' && isEditMode)){
				$.ajax({
					url : href + "?psId=" + psId + "&spaceType=" + spaceType + "&isEditMode=" + isEditMode + "&isCVCAEnabled=" + isCVCAEnabled,
					success : function(data, status, jqXHR) {
						newProductService.find('.js_space_view_target').html(data);
						newProductService.attr('spaceType', spaceTypeStr);
						if(spaceType == '8' && !isEmpty(savedSpaceTab)){
							newProductService.find('.js_space_view_target .js_type_richEditor textarea').val(savedSpaceTab.find('textarea').val());
						}
					}
				});
			}else{
				var newSavedSpaceTab = savedSpaceTab.clone();
				cloneSelectedValues(savedSpaceTab, newSavedSpaceTab);
				newProductService.find('.js_space_view_target').html(newSavedSpaceTab);
				savedSpaceTab.parent().remove();
				newProductService.attr('spaceType', spaceTypeStr);
			}
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-act-pss js_select_space_type]', null, error);
		}			
		return false;
	});

	$('.js_remove_element_item').live('click',function(e) {
		try{
			var input = $(targetElement(e));
			var elementSiblings = input.parents('.js_element_item:first').siblings();
			if(isEmpty(elementSiblings)){
				input.parents('.js_element_item:first').find('.js_action_element_item').text('');
				input.parents('.js_view_element_item:first').hide().next().attr('value', '').show();
			}else{
				input.parents('.js_element_item:first').remove();
			}
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-act-pss js_select_space_type]', null, error);
		}			
		return false;
	});
	
	$('.js_add_element_item').live('click',function(e) {
		try{
			var input = $(targetElement(e));
			input.parents('.js_element_item:first').after(input.parents('.js_space_tab:first').find('.js_dummy_element_item:first').html());
			var itemName = input.parents('.js_element_item:first').attr('itemName');
			if(!isEmpty(input.parents('.js_value_space, .js_service_space'))){
				input.parents('.js_element_item:first').next().attr('itemName', itemName).find('input:first:visible').attr('name', 'txt' + itemName + 'Item');
			}else if(!isEmpty(input.parents('.js_biz_model_space'))){
				input.parents('.js_element_item:first').next().attr('itemName', itemName).find('input:first:visible');
				input.parents('.js_element_item:first').next().append(input.parents('.js_biz_model_space:first').find('.js_dummy_select_item:first .js_select_element_item[itemName="' + itemName + '"]').clone());				
			}
			input.parents('.js_element_item:first').next().find('input:first:visible').focus();
			
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-act-pss js_add_element_item]', null, error);
		}			
		return false;
	});
	
	$('.js_action_element_item').live('dblclick', function(e) {
		try{
			var input = $(targetElement(e));
			if(!isEmpty(input.parents('.js_service_space'))){
				editElementItem = input.parents('.js_view_element_item:first').next();
				editElementItem.attr('value', editElementItem.attr('value').replace(/%KEY%/g, ""));
			}
			input.parents('.js_view_element_item:first').hide().next().show().focus();
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-act-pss js_action_element_item]', null, error);
		}			
	});

	$('input.js_edit_element_item').live('keydown', function(e) {
		var e = window.event || e;
		var keyCode = e.which || e.keyCode;
		if(keyCode == $.ui.keyCode.ENTER){
			var input = $(targetElement(e));
			if(input.attr('value') === ''){
				input.prev().find('.js_remove_element_item').click();
			}else{
				input.css({"width": "auto"}).nextAll('.js_select_element_item').remove();
				input.hide().prevAll('.js_view_element_item').show().find('.js_action_element_item').attr('title', input.attr('value')).text(input.attr('value'));
				if(!isEmpty(input.parents('.js_biz_model_space'))){
					input.parents('.js_element_item:first').css({"color": "blue"});
					input.attr('name', "txt" + input.parents('.js_element_item:first').attr('itemName') + "UserItem");
				}else if(!isEmpty(input.parents('.js_service_space'))){
					$.ajax({
						url : "get_service_value_html.sw?serviceValue=" + input.attr('value'),
						success : function(data, status, jqXHR) {
							input.prevAll('.js_view_element_item').find('.js_action_element_item:first').html(data);
						}
					});
				}

			}
		}
	});
	
	$('input.js_edit_element_item').live('dblclick', function(e) {
		var input = $(targetElement(e));
		if(isEmpty(input.parents('.js_service_space'))) return false;
		
		if(input.attr('value') === ''){
			input.prev().find('.js_remove_element_item').click();
		}else{
	        var selectedWord = getSelectedText();
	        var regex = new RegExp(selectedWord, "gi");
	        var valueHtml = input.attr('value').replace(regex, function(matched) {return "<span style=\"color:blue\">" + matched + "</span>";});
	        var valueString = input.attr('value').replace(regex, function(matched) {return "%KEY%" + matched;});
	        deselectText();
			input.css({"width": "auto"}).nextAll('.js_select_element_item').remove();
			input.hide().prevAll('.js_view_element_item').show().find('.js_action_element_item').attr('title', input.attr('value')).html(valueHtml);
			input.attr('value', valueString);
		}
	});
	
	$('select.js_select_element_item').live('change', function(e) {
		var input = $(targetElement(e));
		var selectValue = input.find('option:selected').text();
		if(selectValue === ''){
			input.parents('.js_element_item:first').find('.js_remove_element_item').click();
		}else{
			input.css({"width": "110px"}).prevAll('.js_edit_element_item').remove();
			input.hide().prevAll('.js_view_element_item').show().find('.js_action_element_item').attr('title', selectValue).text(selectValue);
			input.parents('.js_element_item:first').css({"color": "red"});
			input.attr('name', "txt" + input.parents('.js_element_item:first').attr('itemName') + "Item");
		}
	});
	
	$('select.js_select_space_name').live('change', function(e){
		var input = $(targetElement(e));
		var progressSpan = input.siblings('.js_progress_span:first');
		var similarityMatrix = input.parents('.js_similarity_matrix_page');
		if(isEmpty(similarityMatrix)){
			selectListParam(progressSpan, false);
		}else{
			var spaceType = input.find('option:selected').attr('value');
			
			if(spaceType=='complexSpace'){
				var wValue=similarityMatrix.attr('valueSpace');
				var wProductService=similarityMatrix.attr('productServiceSpace');
				var wProduct=similarityMatrix.attr('productSpace');
				var wService=similarityMatrix.attr('serviceSpace');
				var wTouchPoint=similarityMatrix.attr('touchPointSpace');
				var wCustomer=similarityMatrix.attr('customerSpace');
				var wBizModel=similarityMatrix.attr('bizModelSpace');
				var wActor=similarityMatrix.attr('actorSpace');
				var wSociety=similarityMatrix.attr('societySpace');
				var wContext=similarityMatrix.attr('contextSpace');
				var wTime=similarityMatrix.attr('timeSpace');
				var wEnvironment=similarityMatrix.attr('environmentSpace');
				smartPop.selectSpaceCombination(wValue||null, wProductService||null, wProduct||null, wService||null, wTouchPoint||null, wCustomer||null, wBizModel||null, wActor||null, wSociety||null, wContext||null, wTime||null, wEnvironment||null);
			}else{
				smartPop.progressCenter();
				$.ajax({
					url : "psSimilarityMatrix.jsp?spaceType=" + spaceType,
					success : function(data, status, jqXHR) {
						$('#content').html(data);
						smartPop.closeProgress();
					}
				});
			}
		}
		return false;
	});
	
	$('select.js_select_item_space_name').live('click', function(e){
		e.stopPropagation();
	});
	
	$('select.js_select_item_space_name').live('change', function(e){
		var input = $(targetElement(e));
		var spaceType = input.find('option:selected').attr('value');
		var psId = input.parents('tr:first').attr('psId');
		var url;
		if(spaceType == 'valueSpace')
			url = "viewValueSpace.jsp?psId="+psId;
		else if(spaceType == 'productServiceSpace')
			url = "viewProductServiceSpace.jsp?psId="+psId;
		else if(spaceType == 'productSpace')
			url = "viewProductSpace.jsp?psId="+psId;
		else if(spaceType == 'serviceSpace')
			url = "viewServiceSpace.jsp?psId="+psId;
		else if(spaceType == 'touchPointSpace')
			url = "viewTouchPointSpace.jsp?psId="+psId;
		else if(spaceType == 'customerSpace')
			url = "viewCustomerSpace.jsp?psId="+psId;
		else if(spaceType == 'bizModelSpace')
			url = "viewBizModelSpace.jsp?psId="+psId;
		else if(spaceType == 'actorSpace')
			url = "viewActorSpace.jsp?psId="+psId;
		else if(spaceType == 'actorCvcaSpace')
			url = "viewActorSpace.jsp?psId="+psId + '&isCVCAEnabled=true';
		else if(spaceType == 'societySpace')
			url = "viewSocietySpace.jsp?psId="+psId;
		else if(spaceType == 'contextSpace')
			url = "viewContextSpace.jsp?psId="+psId;
		else if(spaceType == 'timeSpace')
			url = "viewTimeSpace.jsp?psId="+psId;
		else if(spaceType == 'environmentSpace')
			url = "viewEnvironmentSpace.jsp?psId="+psId;
		$.ajax({
			url : url,
			success : function(data, status, jqXHR) {
				input.next().html(data);
			}
		});
		return false;
	});
	
	$('a.js_similarity_calculation').live('click',function(e) {
		var input = $(targetElement(e));
		
		var checkInstances  = $("#iwork_instance_list_page .js_work_instance_list .js_check_instance:checked");
		
		var psIds = new Array();
		var psNames = new Array();
		for(var i=0; i<checkInstances.length; i++){
			psIds[i] = $(checkInstances[i]).parents('.js_work_instance_list:first').attr('psId');
			psNames[i] = $(checkInstances[i]).parents('.js_work_instance_list:first').attr('psName');
			if(isEmpty(psIds[i])){
				psIds[i] = $(checkInstances[i]).parents('td').attr('psId');
				psNames[i] = $(checkInstances[i]).parents('td').attr('psName');
			}
			if(isEmpty(psIds[i])){
				psIds[i] = $(checkInstances[i]).parents('li').attr('psId');
				psNames[i] = $(checkInstances[i]).parents('li').attr('psName');
			}
		}
			
		if(isEmpty(psIds) || psIds.length<=1){
			smartPop.showInfo(smartPop.WARN, smartMessage.get('pssSimilaritySelectError'), null);
			return false;
		}
		var spaceType = $('select.js_select_space_name option:selected').attr('value');

		var paramsJson = {};
		paramsJson["spaceType"] = spaceType;
		paramsJson["psIds"] = psIds;
		paramsJson["psNames"] = psNames;
		paramsJson["href"] = "psSimilarityMatrix.sw";
		console.log(JSON.stringify(paramsJson));
		smartPop.progressCenter();
		$.ajax({
			url : "calculate_ps_similarities.sw",
			contentType : 'application/json',
			type : 'POST',
			data : JSON.stringify(paramsJson),
			success : function(data, status, jqXHR) {
				$('#content').html(data);
				smartPop.closeProgress();
			}
		});
		
		return false;
	});
	
	$('a.js_eyeball_comparison').live('click',function(e) {
		var input = $(targetElement(e));
		
		var checkInstances  = $("#iwork_instance_list_page .js_work_instance_list .js_check_instance:checked");
		var psIds = new Array();
		for(var i=0; i<checkInstances.length; i++){
			psIds[i] = $(checkInstances[i]).parents('.js_work_instance_list:first').attr('psId');
			if(isEmpty(psIds[i]))
				psIds[i] = $(checkInstances[i]).parents('td').attr('psId');
			if(isEmpty(psIds[i]))
				psIds[i] = $(checkInstances[i]).parents('li').attr('psId');
		}
			
		if(isEmpty(psIds) || psIds.length!=2){
			smartPop.showInfo(smartPop.WARN, smartMessage.get('pssEyeballComparisonSelectError'), null);
			return false;
		}
		
		var spaceType = $('select.js_select_space_name option:selected').attr('value');
		smartPop.progressCenter();
		$.ajax({
			url : "doubleProductServices.sw?sourcePsId=" + psIds[0] + "&targetPsId=" + psIds[1] + "&spaceType=" + spaceType,
			success : function(data, status, jqXHR) {
				$('#content').html(data);
				smartPop.closeProgress();
			}
		});
		
		return false;
	});

	$('.js_instance_detail').live('click', function(e) {
		try{
			var input = $(targetElement(e));
			if(!input.hasClass('js_instance_detail')) input = input.parents('.js_instance_detail:first');
			var url = input.attr('href');
			var target = $('#content');
			$.ajax({
				url : url,
				success : function(data, status, jqXHR) {
					target.html(data);
				}				
			});
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-act-work js_create_new_work]', null, error);
		}			
		return false;
	});	
	
	$('a.js_remove_product_service').live('click', function(e) {
		try{
			var input = $(targetElement(e));
			input = input.parents('.js_remove_product_service:first');
			var psId = input.attr('psId');
			smartPop.confirm( smartMessage.get('pssRemoveProductServiceConfirm'), function(){			
				var paramsJson = {};
				paramsJson["psId"] = psId;
				console.log(JSON.stringify(paramsJson));
				smartPop.progressCenter();
				$.ajax({
					url : "remove_product_service.sw",
					contentType : 'application/json',
					type : 'POST',
					data : JSON.stringify(paramsJson),
					success : function(data, status, jqXHR) {
						smartPop.closeProgress();
						location.href = "home.sw";
					}
				});
			});			
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-act-work js_create_new_work]', null, error);
		}			
		return false;
	});	
	
	$('.js_saveas_product_service').live('click', function(e) {
		try{
			var input = $(targetElement(e));
			input = input.parents('.js_saveas_product_service');
			var newProductService = input.parents('.js_new_product_service_page');
			var psId = input.attr('psId');
			var spaceType = newProductService.attr('spaceType');
			var paramsJson = {};
			$.ajax({
				url : 'clone_product_service.sw?psId=' + psId,
				contentType : 'application/json',
				type : 'POST',
				data : JSON.stringify(paramsJson),
				success : function(clonedPsId, status, jqXHR) {
					var url = 'newProductService.jsp?psId=' + clonedPsId + '&isEditMode=true' + '&spaceType=' + spaceType;
					var target = $('#content');
					$.ajax({
						url : url,
						success : function(data, status, jqXHR) {
							target.html(data);
						}				
					});
				}				
			});
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-act-work js_create_new_work]', null, error);
		}			
		return false;
	});	
	
	$('.js_modify_product_service').live('click', function(e) {
		try{
			var input = $(targetElement(e));
			input = input.parents('.js_modify_product_service');
			var newProductService = input.parents('.js_new_product_service_page');
			var psId = input.attr('psId');
			var spaceType = newProductService.attr('spaceType');
			var isCVCAEnabled = newProductService.attr('isCVCAEnabled');
			if(spaceType === 'actorSpace' && isCVCAEnabled === 'true')
				spaceType = 'actorCvcaSpace';
			var url = 'newProductService.jsp?psId=' + psId + '&isEditMode=true' + '&spaceType=' + spaceType;
			var target = $('#content');
			$.ajax({
				url : url,
				success : function(data, status, jqXHR) {
					target.html(data);
				}				
			});
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-act-work js_create_new_work]', null, error);
		}			
		return false;
	});	
	
	$('.js_cancel_modify_ps').live('click', function(e) {
		try{
			var input = $(targetElement(e));
			input = input.parents('.js_cancel_modify_ps');
			var newProductService = input.parents('.js_new_product_service_page');
			var psId = input.attr('psId');
			var spaceType = newProductService.attr('spaceType');
			var url = 'newProductService.jsp?psId=' + psId + '&isEditMode=false' + '&spaceType=' + spaceType;
			var target = $('#content');
			$.ajax({
				url : url,
				success : function(data, status, jqXHR) {
					target.html(data);
				}				
			});
		}catch(error){
			smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[sw-act-work js_create_new_work]', null, error);
		}			
		return false;
	});	

	$('input.js_toggle_use_sim_color').live('click', function(e) {
		var input = $(targetElement(e));
		if(input.is(":checked")){
			useColorValues();
		}else{
			clearColorValues();
		}
	});			

	$('input.js_toggle_actor_sim_cvca').live('click', function(e) {
		var input = $(targetElement(e));
		var isCVCAEnabled = input.is(":checked");
		var useSimColor = input.siblings('.js_toggle_use_sim_color').is(":checked");
		var progressSpan = input.siblings('.js_progress_span:first');
		var similarityMatrix = input.parents('.js_similarity_matrix_page');
		smartPop.progressCenter();
		$.ajax({
			url : "psSimilarityMatrix.jsp?spaceType=actorCvcaSpace&isCVCAEnabled=" + isCVCAEnabled + '&useSimColor=' + useSimColor,
			success : function(data, status, jqXHR) {
				$('#content').html(data);
				smartPop.closeProgress();
			}
		});
		return false;
	});			

	$('select.js_select_double_space_name').live('change', function(e){
		var input = $(targetElement(e));
		var doubleProductService = $('.js_double_product_services_page:first');
		var progressSpan = input.siblings('.js_progress_span:first');
		var spaceType = input.find('option:selected').attr('spaceType');
		var url = input.find('option:selected').attr('href');
		var sourcePsId = input.attr('sourcePsId');
		var targetPsId = input.attr('targetPsId');
		var sourceRootNodeId = doubleProductService.attr('sourceRootNodeId');
		var targetRootNodeId = doubleProductService.attr('targetRootNodeId');
		var isCVCAEnabled = true;
		if(spaceType === '8')
			isCVCAEnabled = false;
		smartPop.progressCenter();
		$.ajax({
			url : url + "?psId=" + sourcePsId + "&spaceType=" + spaceType + "&isCVCAEnabled=" + isCVCAEnabled + "&rootNodeId=" + sourceRootNodeId,
			success : function(data, status, jqXHR) {
				$('#source_view_target').html(data);
				smartPop.closeProgress();
			}
		});
		$.ajax({
			url : url + "?psId=" + targetPsId + "&spaceType=" + spaceType + "&isCVCAEnabled=" + isCVCAEnabled + "&rootNodeId=" + targetRootNodeId,
			success : function(data, status, jqXHR) {
				$('#target_view_target').html(data);
				smartPop.closeProgress();
			}
		});
	});

	$('.js_toggle_creation_tool a').live('click', function(e) {
		var input = $(targetElement(e));
		var canvasId = input.parents('.js_context_space:first').find('canvas:first').attr('canvasId');
		var canvasCtrl = CD$CONTROLLERS.findControllerById(canvasId, canvasId);
		if(isEmpty(canvasCtrl)){
			canvasId = input.parents('.js_actor_space:first').find('canvas:first').attr('canvasId');
			canvasCtrl = AD$CONTROLLERS.findControllerById(canvasId, canvasId);
		}
		input.parents('tr:first').siblings().find('a.selected').removeClass('selected').parent().css('background-color', 'white');
		if(input.hasClass('selected')){
			input.removeClass('selected');
			input.parent().css('background-color', 'white');
			canvasCtrl.selectedTool = 0;
		}else{
			input.addClass('selected');
			input.parent().css('background-color', 'red');
			canvasCtrl.selectedTool = parseInt(input.attr('toolId'));
		}
		return false;
	});			

	$('input.js_input_node_name').live('keyup', function(e) {
		var input = $(targetElement(e));
		var canvasId = input.parents('.js_object_properties:first').attr('canvasId');
		var objectId = input.parents('.js_object_properties:first').attr('objectId');
		var canvasCtrl = CD$CONTROLLERS.findControllerById(canvasId, canvasId);
		if(!isEmpty(canvasCtrl)){
			var ctrl = CD$CONTROLLERS.findControllerById(canvasId, objectId);
			ctrl.model.name = input.attr('value');
			CD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ContextDiagram.redraw(canvasId);
		}else{
			canvasCtrl = AD$CONTROLLERS.findControllerById(canvasId, canvasId);
			var ctrl = AD$CONTROLLERS.findControllerById(canvasId, objectId);
			ctrl.model.name = input.attr('value');
			AD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ActorDiagram.redraw(canvasId);
		}
	});			

	$('select.js_select_node_type').live('change', function(e) {
		var input = $(targetElement(e));
		var canvasId = input.parents('.js_object_properties:first').attr('canvasId');
		var objectId = input.parents('.js_object_properties:first').attr('objectId');
		var canvasCtrl = CD$CONTROLLERS.findControllerById(canvasId, canvasId);
		if(!isEmpty(canvasCtrl)){
			var ctrl = CD$CONTROLLERS.findControllerById(canvasId, objectId);
			ctrl.model.type = input.find('option:selected').attr('value');
			CD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ContextDiagram.redraw(canvasId);
		}else{
			canvasCtrl = AD$CONTROLLERS.findControllerById(canvasId, canvasId);
			var ctrl = AD$CONTROLLERS.findControllerById(canvasId, objectId);
			ctrl.model.type = input.find('option:selected').attr('value');
			AD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ActorDiagram.redraw(canvasId);
		}
	});			

	$('input.js_input_line_label').live('keyup', function(e) {
		var input = $(targetElement(e));
		var canvasId = input.parents('.js_object_properties:first').attr('canvasId');
		var objectId = input.parents('.js_object_properties:first').attr('objectId');
		var canvasCtrl = CD$CONTROLLERS.findControllerById(canvasId, canvasId);
		if(!isEmpty(canvasCtrl)){
			var ctrl = CD$CONTROLLERS.findControllerById(canvasId, objectId);
			ctrl.model.label = input.attr('value');
			CD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ContextDiagram.redraw(canvasId);
		}else{
			canvasCtrl = AD$CONTROLLERS.findControllerById(canvasId, canvasId);
			var ctrl = AD$CONTROLLERS.findControllerById(canvasId, objectId);
			ctrl.model.label = input.attr('value');
			AD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ActorDiagram.redraw(canvasId);
		}
	});			

	$('select.js_select_line_arrow').live('change', function(e) {
		var input = $(targetElement(e));
		var canvasId = input.parents('.js_object_properties:first').attr('canvasId');
		var objectId = input.parents('.js_object_properties:first').attr('objectId');
		var canvasCtrl = CD$CONTROLLERS.findControllerById(canvasId, canvasId);
		if(!isEmpty(canvasCtrl)){
			var ctrl = CD$CONTROLLERS.findControllerById(canvasId, objectId);
			ctrl.model.direction = parseInt(input.find('option:selected').attr('value'));
			CD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ContextDiagram.redraw(canvasId);
		}else{
			canvasCtrl = AD$CONTROLLERS.findControllerById(canvasId, canvasId);
			var ctrl = AD$CONTROLLERS.findControllerById(canvasId, objectId);
			ctrl.model.direction = parseInt(input.find('option:selected').attr('value'));
			AD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ActorDiagram.redraw(canvasId);
		}
	});			

	$('select.js_select_line_type').live('change', function(e) {
		var input = $(targetElement(e));
		var canvasId = input.parents('.js_object_properties:first').attr('canvasId');
		var objectId = input.parents('.js_object_properties:first').attr('objectId');
		var canvasCtrl = CD$CONTROLLERS.findControllerById(canvasId, canvasId);
		if(!isEmpty(canvasCtrl)){
			var ctrl = CD$CONTROLLERS.findControllerById(canvasId, objectId);
			var lineType = parseInt(input.find('option:selected').attr('value'));
			var lineBreak = null;
			var breakLevel = input.parents('.js_object_properties:first').find('.js_select_break_level:first');
			breakLevel.find('option[value="50"]').attr('selected', 'selected');
			switch(lineType){
			case CD$ARROW_ALIGN_CENTER:
				lineBreak = {align:CD$ARROW_ALIGN_CENTER, breaks:0};
				breakLevel.parents('tr:first').hide();
				break;
			case CD$ARROW_ALIGN_LEFT*10+1:
				lineBreak = {align:CD$ARROW_ALIGN_LEFT, breaks:1, level:50};
				breakLevel.parents('tr:first').show();
				break;
			case CD$ARROW_ALIGN_LEFT*10+2:
				lineBreak = {align:CD$ARROW_ALIGN_LEFT, breaks:2};
				breakLevel.parents('tr:first').show();
				break;
			case CD$ARROW_ALIGN_RIGHT*10+1:
				lineBreak = {align:CD$ARROW_ALIGN_RIGHT, breaks:1};
				breakLevel.parents('tr:first').show();
				break;
			case CD$ARROW_ALIGN_RIGHT*10+2:
				lineBreak = {align:CD$ARROW_ALIGN_RIGHT, breaks:2};
				breakLevel.parents('tr:first').show();
				break;
			}
			ctrl.model.lineBreak = lineBreak;
			CD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ContextDiagram.redraw(canvasId);
		}else{
			canvasCtrl = AD$CONTROLLERS.findControllerById(canvasId, canvasId);
			var ctrl = AD$CONTROLLERS.findControllerById(canvasId, objectId);
			var lineType = parseInt(input.find('option:selected').attr('value'));
			var lineBreak = null;
			var breakLevel = input.parents('.js_object_properties:first').find('.js_select_break_level:first');
			breakLevel.find('option[value="50"]').attr('selected', 'selected');
			switch(lineType){
			case AD$ARROW_ALIGN_CENTER:
				lineBreak = {align:AD$ARROW_ALIGN_CENTER, breaks:0};
				breakLevel.parents('tr:first').hide();
				break;
			case AD$ARROW_ALIGN_LEFT*10+1:
				lineBreak = {align:AD$ARROW_ALIGN_LEFT, breaks:1, level:50};
				breakLevel.parents('tr:first').show();
				break;
			case AD$ARROW_ALIGN_LEFT*10+2:
				lineBreak = {align:AD$ARROW_ALIGN_LEFT, breaks:2};
				breakLevel.parents('tr:first').show();
				break;
			case AD$ARROW_ALIGN_RIGHT*10+1:
				lineBreak = {align:AD$ARROW_ALIGN_RIGHT, breaks:1};
				breakLevel.parents('tr:first').show();
				break;
			case AD$ARROW_ALIGN_RIGHT*10+2:
				lineBreak = {align:AD$ARROW_ALIGN_RIGHT, breaks:2};
				breakLevel.parents('tr:first').show();
				break;
			}
			ctrl.model.lineBreak = lineBreak;
			AD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ActorDiagram.redraw(canvasId);
		}
	});			

	$('select.js_select_break_level').live('change', function(e) {
		var input = $(targetElement(e));
		var canvasId = input.parents('.js_object_properties:first').attr('canvasId');
		var objectId = input.parents('.js_object_properties:first').attr('objectId');
		var canvasCtrl = CD$CONTROLLERS.findControllerById(canvasId, canvasId);
		if(!isEmpty(canvasCtrl)){
			var ctrl = CD$CONTROLLERS.findControllerById(canvasId, objectId);
			var breakLevel = parseInt(input.find('option:selected').attr('value'));
			var lineBreak = ctrl.model.lineBreak || {};
			lineBreak.level = breakLevel; 
			ctrl.model.lineBreak = lineBreak;
			CD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ContextDiagram.redraw(canvasId);
		}else{
			canvasCtrl = AD$CONTROLLERS.findControllerById(canvasId, canvasId);
			var ctrl = AD$CONTROLLERS.findControllerById(canvasId, objectId);
			var breakLevel = parseInt(input.find('option:selected').attr('value'));
			var lineBreak = ctrl.model.lineBreak || {};
			lineBreak.level = breakLevel; 
			ctrl.model.lineBreak = lineBreak;
			AD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ActorDiagram.redraw(canvasId);
		}
	});			

	$('select.js_select_line_color').live('change', function(e) {
		var input = $(targetElement(e));
		var canvasId = input.parents('.js_object_properties:first').attr('canvasId');
		var objectId = input.parents('.js_object_properties:first').attr('objectId');
		var canvasCtrl = CD$CONTROLLERS.findControllerById(canvasId, canvasId);
		if(!isEmpty(canvasCtrl)){
			var ctrl = CD$CONTROLLERS.findControllerById(canvasId, objectId);
			ctrl.model.lineColor = input.find('option:selected').attr('value');
			CD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ContextDiagram.redraw(canvasId);
		}else{
			canvasCtrl = AD$CONTROLLERS.findControllerById(canvasId, canvasId);
			var ctrl = AD$CONTROLLERS.findControllerById(canvasId, objectId);
			ctrl.model.lineColor = input.find('option:selected').attr('value');
			AD$CONTROLLERS.updateModel(canvasId, ctrl.model);
			ActorDiagram.redraw(canvasId);
		}
	});			

	$('select.js_select_node_type_name').live('change', function(e) {
		var input = $(targetElement(e));
		var canvasId = input.parents('.js_object_properties:first').attr('canvasId');
		var objectId = input.parents('.js_object_properties:first').attr('objectId');
		canvasCtrl = AD$CONTROLLERS.findControllerById(canvasId, canvasId);
		var ctrl = AD$CONTROLLERS.findControllerById(canvasId, objectId);
		ctrl.model.typeName = input.attr('value');
		AD$CONTROLLERS.updateModel(canvasId, ctrl.model);

		var nodeTypePrimary = input.parents('.js_object_properties:first').find('.js_select_node_type_primary:first');
		if(ctrl.model.typeName === 'receiver'){
			nodeTypePrimary.parents('.js_node_type_property:first').show();
			nodeTypePrimary.attr('checked', ctrl.model.isPrimaryNode);
		}else{
			nodeTypePrimary.attr('checked', false);
			nodeTypePrimary.parents('.js_node_type_property:first').hide();			
		}
	});			

	$('input.js_select_node_type_primary').live('change', function(e) {
		var input = $(targetElement(e));
		var canvasId = input.parents('.js_object_properties:first').attr('canvasId');
		var objectId = input.parents('.js_object_properties:first').attr('objectId');
		canvasCtrl = AD$CONTROLLERS.findControllerById(canvasId, canvasId);
		var ctrl = AD$CONTROLLERS.findControllerById(canvasId, objectId);
		ctrl.model.isPrimaryNode = input.is(':checked');
		AD$CONTROLLERS.updateModel(canvasId, ctrl.model);
	});			

	$('input.js_toggle_time_value').live('click', function(e) {
		var input = $(targetElement(e));		
		var position = input.parent().prevAll().length;
		var timeValueDesc = input.parents('.js_time_space').find('.js_time_value_desc');
		if($(timeValueDesc[position]).hasClass('checked')){
			$(timeValueDesc[position]).removeClass('checked');
			input.removeAttr('checked');
		}else{
			$(timeValueDesc[position]).addClass('checked');
			input.attr('checked', 'checked');
		}
	});			

	$('select.js_select_unspsc_code0').live('change', function(e) {
		var input = $(targetElement(e));
		var value = input.find('option:selected').attr('value');
		var params = "&level0" + "=" + value;
		$.ajax({
			url : "get_unspsc_names.sw" + "?level=1" + params,
			success : function(result, status, jqXHR) {
				input.next().html(result.data);
				input.next().nextAll('.js_select_unspsc_code').each(function() {
					$(this).html('<option value="00">' + smartMessage.get('textNone') + '</option');
				});
				smartPop.closeProgress();
			}
		});
		var unspscCode="";
		var productSpace = input.parents('.js_product_space:first');
		productSpace.find('.js_select_unspsc_code').each(function() {
			unspscCode = unspscCode + $(this).find('option:selected').attr('value');
		});		
		productSpace.find('.js_unspsc_name').html(smartMessage.get(unspscCode));
	});			

	$('select.js_select_unspsc_code').live('change', function(e) {
		var input = $(targetElement(e));
		var prevAlls = input.prevAll('.js_select_unspsc_code');
		var level = prevAlls.length;
		if(level<3){
			var value = input.find('option:selected').attr('value');
			var params = "&level" + (level+1) + "=" + value;
			for(var i=level-1, k=1; i>=0; i--, k++){
				var code = $(prevAlls[i]).find('option:selected').attr('value');
				params = params + "&level" + k + "=" + code;
			}
			$.ajax({
				url : "get_unspsc_names.sw" + "?level=" + (level+2) + params,
				success : function(result, status, jqXHR) {
					input.next().html(result.data);
					input.next().nextAll('.js_select_unspsc_code').each(function() {
						$(this).html('<option value="00">' + smartMessage.get('textNone') + '</option');
					});
					smartPop.closeProgress();
				}
			});
		}
		var unspscCode="";
		var productSpace = input.parents('.js_product_space:first');
		productSpace.find('.js_select_unspsc_code').each(function() {
			unspscCode = unspscCode + $(this).find('option:selected').attr('value');
		});		
		productSpace.find('.js_unspsc_name').html(smartMessage.get(unspscCode));
	});			

	$('select.js_select_customer_type').live('change', function(e) {
		var input = $(targetElement(e));
		var prevAlls = input.prevAll('.js_select_customer_type');
		var level = prevAlls.length;
		if(level<3){
			var value = input.find('option:selected').attr('value');
			var params = "&level" + (level+1) + "=" + value;
			for(var i=level-1, k=1; i>=0; i--, k++){
				var code = $(prevAlls[i]).find('option:selected').attr('value');
				params = params + "&level" + k + "=" + code;
			}
			$.ajax({
				url : "get_customer_types.sw" + "?level=" + (level+2) + params,
				success : function(result, status, jqXHR) {
					input.next().html(result.data);
					input.next().nextAll('.js_select_customer_type').each(function() {
						$(this).html('<option value="00">' + smartMessage.get('textNone') + '</option');
					});
					smartPop.closeProgress();
				}
			});
		}
	});			

	$('select.js_select_customer_activity_type').live('change', function(e) {
		var input = $(targetElement(e));
		var prevAlls = input.prevAll('.js_select_customer_activity_type');
		var level = prevAlls.length;
		if(level<3){
			var value = input.find('option:selected').attr('value');
			var params = "&level" + (level+1) + "=" + value;
			for(var i=level-1, k=1; i>=0; i--, k++){
				var code = $(prevAlls[i]).find('option:selected').attr('value');
				params = params + "&level" + k + "=" + code;
			}
			$.ajax({
				url : "get_customer_types.sw" + "?level=" + (level+2) + params,
				success : function(result, status, jqXHR) {
					input.next().html(result.data);
					input.next().nextAll('.js_select_customer_activity_type').each(function() {
						$(this).html('<option value="00">' + smartMessage.get('textNone') + '</option');
					});
					smartPop.closeProgress();
				}
			});
		}
	});			

	$('.js_select_sim_space input[type="checkbox"]').live('change', function(e) {
		var input = $(targetElement(e));
		var weightText = input.parents('tr:first').find('input[type="text"]');
		if(input.is(':checked')){
			weightText.removeAttr('readonly').addClass('fieldline').addClass('sw_required').show();
		}else{
			weightText.attr('readonly', 'readonly').removeClass('fieldline').removeClass('sw_required');
			weightText.attr('value', '0.0').hide();
			var simWeights = input.parents('table:first').find('.js_sim_weight');
			var simWeight = 0;
			simWeights.each(function(){ simWeight = simWeight + parseFloat($(this).attr('value'))});
			input.parents('table:first').find('.js_weight_summary').attr('value', simWeight);
		}
	});			
	
	$('.js_select_sim_space input[type="text"]').live('change', function(e) {
		var input = $(targetElement(e));
		var simValue = parseFloat(input.attr('value'));
	    if(!(/^\-?([0-9]+(\.[0-9]+)?|Infinity)$/.test(simValue)) || simValue>1){
	    	input.attr('value', '0.0');
	    	return;
	    }
		
		var simWeights = input.parents('table:first').find('.js_sim_weight');
		var simWeight = 0;
		simWeights.each(function(){ simWeight = simWeight + parseFloat($(this).attr('value'))});
		input.parents('table:first').find('.js_weight_summary').attr('value', simWeight);
	});		
	
	$('a.js_toggle_affordance').live('click', function(e) {
		var input = $(targetElement(e));
		var iconSpan = input.next();
		if(iconSpan.hasClass('icon_in_down')){
			iconSpan.removeClass('icon_in_down').addClass('icon_in_up');
		}else{
			iconSpan.addClass('icon_in_down').removeClass('icon_in_up');
		}
		input.parents('tr:first').next().toggle();
		return false;
	});			

	$('.js_select_interaction_type').live('change', function(e) {
		var input = $(targetElement(e));
		var selectedValue = input.find('option:selected').text();
		input.parents('th:first').find('.js_interaction_details li[value="' + selectedValue + '"]').show().siblings().hide();
	});		
	
	$('a.js_select_ps_item').live('click', function(e) {
		var input = $(targetElement(e));
		var target = input.parents('.js_ps_item:first');
		if(target.hasClass('selected_background')) target.removeClass('selected_background');
		else target.addClass('selected_background').siblings().removeClass('selected_background');
		return false;
	});			

	$('a.js_add_raffordance_item').live('click', function(e) {
		var input = $(targetElement(e));
		var target = input.parents('td:first').find('ul:first');
		var raffordanceItem = target.find('.js_hidden_raffordance').clone().removeClass('js_hidden_raffordance');
		target.append(raffordanceItem);
		raffordanceItem.find('textarea').attr('name', 'txtRAffordanceName');
		var affordanceFields = raffordanceItem.find('.js_affordance_fields').removeClass('js_affordance_fields').addClass('js_raffordance_fields');
		var gridRow = SmartWorks.GridLayout.newGridRow();
		var gridTable = SmartWorks.GridLayout.newGridTable();
		affordanceFields.html(gridTable.html(gridRow));
		
		SmartWorks.FormRuntime.ImageBoxBuilder.buildEx({
			container: gridRow,
			fieldId: "imgRAffordance",
			fieldName: "picture profile",
			pictureWidth: 100,
			pictureHeight: 100,
			required: false,
			readOnly: false						
		}); 
		
		gridRow.find('.form_label').css('margin-top', '-26px').css('margin-left', '16px');
		gridRow.find('.form_value').attr('style', 'padding-top:0px!important;margin:0px!important');
		
		raffordanceItem.show();
		return false;
	});			

	$('a.js_add_paffordance_item').live('click', function(e) {
		var input = $(targetElement(e));
		var target = input.parents('td:first').find('ul:first');
		var paffordanceItem = target.find('.js_hidden_paffordance').clone().removeClass('js_hidden_paffordance');
		target.append(paffordanceItem);
		paffordanceItem.find('textarea').attr('name', 'txtPAffordanceName');
		var affordanceFields = paffordanceItem.find('.js_affordance_fields').removeClass('js_affordance_fields').addClass('js_paffordance_fields');
		var gridRow = SmartWorks.GridLayout.newGridRow();
		var gridTable = SmartWorks.GridLayout.newGridTable();
		affordanceFields.html(gridTable.html(gridRow));
		
		SmartWorks.FormRuntime.ImageBoxBuilder.buildEx({
			container: gridRow,
			fieldId: "imgPAffordance",
			fieldName: "picture profile",
			pictureWidth: 100,
			pictureHeight: 100,
			required: false,
			readOnly: false						
		}); 
		
		gridRow.find('.form_label').css('margin-top', '-26px').css('margin-left', '16px');
		gridRow.find('.form_value').attr('style', 'padding-top:0px!important;margin:0px!important');
		
		paffordanceItem.show();
		return false;
	});			

	$('a.js_delete_affordance_item').live('click', function(e) {
		var input = $(targetElement(e));
		input.parents('li:first').remove();
		return false;
	});			

	$('a.js_add_touch_point_item').live('click', function(e) {
		var input = $(targetElement(e));
		var target = input.parents('.js_touch_point_space:first');
		var touchPointItem = target.find('.js_hidden_touch_point').clone().removeClass('js_hidden_touch_point');
		target.append(touchPointItem);

		var touchPointField = touchPointItem.find('.js_touch_point_fields:first');
		var gridRow = SmartWorks.GridLayout.newGridRow();
		var gridTable = SmartWorks.GridLayout.newGridTable();
		touchPointField.html(gridTable.html(gridRow));
		
		SmartWorks.FormRuntime.ImageBoxBuilder.buildEx({
			container: gridRow,
			fieldId: "imgTouchPoint",
			fieldName: "picture profile",
 			imgSource: '<%=touchPointImg%>',
			pictureWidth: 100,
			pictureHeight: 100,
			required: false,
			readOnly: false							
		}); 
		
		gridRow.find('.form_label').css('margin-top', '-26px').css('margin-left', '16px');
		gridRow.find('.form_value').attr('style', 'padding-top:0px!important;margin:0px!important');
		touchPointField.find('.js_type_imageBox:first').css('padding', '0px');
		
		touchPointItem.show();
		return false;
	});			

	$('a.js_delete_touch_point_item').live('click', function(e) {
		var input = $(targetElement(e));
		input.parents('form:first').remove();
		return false;
	});			

	$('a.js_add_customer_type').live('click', function(e) {
		var input = $(targetElement(e));
		var target = input.parents('.js_customer_space').find('.js_customer_type .form_value:first');
		var customerTypeItem = target.find('.js_hidden_customer_type').clone().removeClass('js_hidden_customer_type').addClass('js_customer_type_list');
		target.append(customerTypeItem);
		
		customerTypeItem.find('.js_select_customer_type').each(function(index){
			$(this).attr('name', 'selTypeCode' + (index+1));
		});
		customerTypeItem.show();
		return false;
	});			

	$('a.js_add_customer_activity_type').live('click', function(e) {
		var input = $(targetElement(e));
		var target = input.parents('.js_customer_space').find('.js_customer_activity_type .form_value:first');
		var customerActivityTypeItem = target.find('.js_hidden_customer_activity_type').clone().removeClass('js_hidden_customer_activity_type').addClass('js_customer_activity_type_list');
		target.append(customerActivityTypeItem);
		
		customerActivityTypeItem.find('.js_select_customer_activity_type').each(function(index){
			$(this).attr('name', 'selActivityTypeCode' + (index+1));
		});
		customerActivityTypeItem.show();
		return false;
	});			

	$('a.js_delete_customer_type').live('click', function(e) {
		var input = $(targetElement(e));
		input.parents('.js_customer_type_list:first').remove();
		return false;
	});			

	$('a.js_delete_customer_activity_type').live('click', function(e) {
		var input = $(targetElement(e));
		input.parents('.js_customer_activity_type_list:first').remove();
		return false;
	});			

	$('a.js_toggle_actor_cvca').live('click', function(e) {
		e.stopPropagation();
		var input = $(targetElement(e));
		var actorSpace = input.parents('.js_actor_space:first');
		var psId = actorSpace.attr('psId');
		var isCVCAEnabled = input.attr('isCVCAEnabled');
		var rootNodeId = actorSpace.attr('rootNodeId');
		var params = "?psId=" + psId + "&isCVCAEnabled=" + isCVCAEnabled + "&rootNodeId=" + rootNodeId;
		$.ajax({
			url : "viewActorSpace.sw" + params,
			success : function(result, status, jqXHR) {
				actorSpace.parent().html(result);
			}
		});
		return false;
	});			

});
