try{
SmartWorks.FormRuntime = SmartWorks.FormRuntime || {};

SmartWorks.FormRuntime.RefFormFieldBuilder = {};

SmartWorks.FormRuntime.RefFormFieldBuilder.build = function(config) {
	var options = {
		mode : 'edit', // view or edit
		container : $('<div></div>'),
		entity : null,
		dataField : '',
		refreshData : false,
		layoutInstance : null,
		isDataGrid : false
	};
	
	SmartWorks.extend(options, config);
	if(!options.refreshData)
		options.container.html('');

	var $entity = options.entity;
	var $refForm = $entity.find('refForm');	
	var $refFormField = $refForm.find('field');	
	var refFormId = $refForm.attr('id');
	var refFormFieldId = $refFormField.attr('id');
	var refFormFieldType = $refFormField.attr('type');
	var refRecordId = (options.dataField && options.dataField.refRecordId) || '';
	var value = (options.dataField && options.dataField.value) || '';
	options.container.attr('refForm', refFormId).attr('refFormField', refFormFieldId).attr('refRecordId', refRecordId).attr('refFormFieldType', refFormFieldType);
	
	var $graphic = $entity.find('graphic');
	var readOnly = $graphic.attr('readOnly') === 'true' || options.mode === 'view';
	var id = $entity.attr('id');
	var name = $entity.attr('name');
	
	var labelWidth = (isEmpty(options.layoutInstance)) ? parseInt($graphic.attr('labelWidth')) : options.layoutInstance.getLabelWidth(id);
	var valueWidth = 100 - (options.isDataGrid ? 0 : labelWidth);
	var $label = $('<div class="form_label" style="width:' + labelWidth + '%"><span>' + name + '</span></div>');
	var required = $entity.attr('required');
	if(required === 'true' && !readOnly){
		$label.addClass('required_label');
		required = " class='fieldline sw_required' ";
	}else{
		required = "class='fieldline' ";
	}
	if(!options.refreshData && !options.isDataGrid)
		$label.appendTo(options.container);
	
	var $refForm = null;
	if(readOnly){
		$refForm = $('<div class="form_value" style="width:' + valueWidth + '%"><span><a href="" tabindex="-1" instanceId="' + refRecordId + '" formId="' + refFormId + '" class="linkline js_show_instance"></a></span></div>');
		$refForm.find('a').text(value);
	}else{	
		$refForm = $('<div class="form_value" style="width:' + valueWidth + '%"><div class="icon_fb_space"><input readonly="readonly" type="text" name="' + id + '"' + required + '><a href="" tabindex="-1" class="linkline js_workitempicker_button"><span class="icon_fb_work"></span></a></div></div>');
		$refForm.find('input').attr('value', value);
		$refForm.attr('title', $entity.attr('toolTip'));
	}
	if ($graphic.attr('hidden') == 'true'){
		options.container.hide();
	}

	if(!options.refreshData){
		$refForm.appendTo(options.container);
	}else{
		options.container.find('.form_value').html($refForm.children());		
	}
	
	if (readOnly) {
		var $refFormHiddenInput = options.container.find('#refFormHiddenInput'+id);
		if ($refFormHiddenInput.length === 0) {
			options.container.append('<input id="refFormHiddenInput'+id+'" type="hidden" name="' + id + '" value="' + value + '">');
		} else {
			$refFormHiddenInput.attr('value', value);
		}
	}
	
	var isHidden =  (options.dataField && options.dataField.isHidden) || null;
	var isReadOnly =  (options.dataField && options.dataField.isReadOnly) || null;
	var isRequired =  (options.dataField && options.dataField.isRequired) || null;
	if(options.refreshData && (isHidden || isRequired || isReadOnly)){
		var formLabel = options.container.find('.form_label:first');
		var formValue = options.container.find('.form_value:first');
		if(isHidden == 'true'){
			options.container.hide();
		}else if(isHidden == 'false'){
			options.container.show().parent().show();
		}
		
		if(options.mode == 'edit'){
			if(isReadOnly == 'true'){
				formValue.html('<span><a href="" tabindex="-1" instanceId="' + refRecordId + '" formId="' + refFormId + '" class="linkline js_show_instance"></a></span>');
				formValue.find('a').text(value);
				var $refFormHiddenInput = $('#refFormHiddenInput'+id);
				if ($refFormHiddenInput.length === 0) {
					options.container.append('<input id="refFormHiddenInput'+id+'" type="hidden" name="' + id + '" value="' + value + '">');
				} else {
					$refFormHiddenInput.attr('value', value);
				}
				formValue.removeAttr('title');
				formLabel.removeClass('required_label');
			}else if(isReadOnly == 'false'){			
				formValue.html('<div class="icon_fb_space"><input readonly="readonly" type="text" name="' + id + '"' + required + '><a href="" tabindex="-1" class="js_workitempicker_button"><span class="icon_fb_work"></span></a></div>');
				formValue.find('input').attr('value', value);
				$('#refFormHiddenInput'+id).remove();
				formValue.attr('title', $entity.attr('toolTip'));
				if($entity.attr('required') === 'true')
					formLabel.addClass('required_label');
			}
				
			if(isRequired == 'true'){
				formLabel.addClass('required_label');
				formValue.find('input').addClass('sw_required');
			}else if(isRequired == 'false'){
				formLabel.removeClass('required_label');
				formValue.find('input').removeClass('sw_required');			
			}
		}
	}else if(isHidden){
		if(isHidden == 'true'){
			options.container.hide();
		}else if(isHidden == 'false'){
			options.container.show().parent().show();
		}		
	}
	
	return options.container;
};

SmartWorks.FormRuntime.RefFormFieldBuilder.buildEx = function(config){
	var options = {
			container : $('<tr></tr>'),
			fieldId: '',
			fieldName: '',
			refFormId: '',
			refFormFieldId: '',
			refRecordId: '',
			value: '',
			columns: 1,
			colSpan: 1,
			required: false,
			readOnly: false		
	};
	SmartWorks.extend(options, config);

	var labelWidth = 12;
	if(options.columns >= 1 && options.columns <= 4 && options.colSpan <= options.columns) labelWidth = 12 * options.columns/options.colSpan;
	$formEntity =  $($.parseXML('<formEntity id="' + options.fieldId + '" name="' + options.fieldName + '" systemType="string" required="' + options.required + '" system="false">' +
						'<format type="refFormField" viewingType="refFormField"/>' +
				        	'<refForm id="'+ options.refFormId +'" ver="0">' +
								'<name>null</name><category id="null">null</category><field id="' + refFormFieldId + '"></field>' +
							'</refForm>' +
					    '<graphic hidden="false" readOnly="'+ options.readOnly +'" labelWidth="'+ labelWidth + '"/>' +
					'</formEntity>')).find('formEntity');
	var $formCol = $('<td class="form_col js_type_refFormField" fieldid="' + options.fieldId+ '" colspan="' + options.colSpan + '" width="' + options.colSpan/options.columns*100 + '%" rowspan="1">');
	$formCol.appendTo(options.container);
	SmartWorks.FormRuntime.RefFormFieldBuilder.build({
			mode : options.readOnly, // view or edit
			container : $formCol,
			entity : $formEntity,
			dataField : SmartWorks.FormRuntime.RefFormFieldBuilder.dataField({
				fieldId: options.fieldId,
				refRecordId: options.refRecordId,
				value: options.value					
			})
	});
	
};

SmartWorks.FormRuntime.RefFormFieldBuilder.serializeObject = function(refFormFields){
	var refFormsJson = {};
	for(var i=0; i<refFormFields.length; i++){
		var refFormField = $(refFormFields[i]);
//		if(!isEmpty(refFormField.parents('td.js_type_dataGrid'))) continue;
		refFormsJson[refFormField.attr('fieldId')] =  {refForm: refFormField.attr('refForm'), refFormField: refFormField.attr('refFormField'), refRecordId: refFormField.attr('refRecordId'), refFormFieldType: refFormField.attr('refFormFieldType'), value: refFormField.find('input').attr('value').trim()};
	}
	return refFormsJson;
};

SmartWorks.FormRuntime.RefFormFieldBuilder.validate = function(refFormFields){
	var refFormsValid = true;
	for(var i=0; i<refFormFields.length; i++){
		var refFormField = $(refFormFields[i]).find('input.sw_required');
		var value = refFormField.attr('value');
		var refRecordId = $(refFormFields[i]).attr('refRecordId');
		//if(!isEmpty(refFormField) && (isEmpty(value) || isEmpty(refRecordId))){
		if(!isEmpty(refFormField) && (isEmpty(value))){
			refFormField.addClass("sw_error");
			refFormsValid = false;
		}
	}
	return refFormsValid;
};

SmartWorks.FormRuntime.RefFormFieldBuilder.dataField = function(config){
	var options = {
			fieldName: '',
			fieldId:'',
			formXml: '',
			refRecordId: '',
			value: ''
	};

	SmartWorks.extend(options, config);
	$formXml = isEmpty(options.formXml) ? [] : $($.parseXML(options.formXml)).find('form');
	var dataField = {};
	var fieldId = (isEmpty(options.fieldId)) ? $formXml.find('formEntity[name="'+options.fieldName+'"]').attr('id') : options.fieldId;
	if(isEmpty(fieldId)) fieldId = ($formXml.attr("name") === options.fieldName) ? $formXml.attr('id') : "";
	if(isEmpty(fieldId)) return dataField;
	
	dataField = {
			id: fieldId,
			refRecordId: options.refRecordId,
			value: options.value
	};
	return dataField;
};
}catch(error){
	smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[ref_form_field script]', null, error);
}