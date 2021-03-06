try{
SmartWorks.FormRuntime = SmartWorks.FormRuntime || {};

SmartWorks.FormRuntime.RadioButtonBuilder = {};

SmartWorks.FormRuntime.RadioButtonBuilder.build = function(config) {
	var options = {
		mode : 'edit', // view or edit
		container : $('<div></div>'),
		entity : null,
		value : '',
		dataField : '',
		refreshData : false,
		layoutInstance : null,
		isDataGrid : false
	};

	SmartWorks.extend(options, config);
	if(!options.refreshData)
		options.container.html('');

	var value = (options.dataField && options.dataField.value) || '';
	var $entity = options.entity;
	var $graphic = $entity.find('graphic');
	var $format = $entity.find('format');

	var readOnly = $graphic.attr('readOnly') == 'true' || options.mode == 'view';
	var id = $entity.attr('id');
	var name = $entity.attr('name');
	
	var labelWidth = (isEmpty(options.layoutInstance)) ? parseInt($graphic.attr('labelWidth')) : options.layoutInstance.getLabelWidth(id);
	var valueWidth = 100 - (options.isDataGrid ? 0 : labelWidth);
	var $label = $('<div class="form_label" style="width:' + labelWidth + '%"><span>' + name + '</span></div>');
	var required = $entity.attr('required');
	if(required === 'true' && !readOnly){
		$label.addClass('required_label');
		required = " class='sw_required'";
	}else{
		required = "";
	}
	if(!options.refreshData && !options.isDataGrid)
		$label.appendTo(options.container);
	
	var $staticItems = $format.find('list staticItems staticItem');
	var $input_container = $('<div class="form_value" style="width:' + valueWidth + '%"><span></span></div>');
	
	var $fieldset = $('<fieldset' + required + '></fieldset>');
	for ( var i = 0; i < $staticItems.length; i++) {
		var $staticItem = $staticItems.eq(i);
		var text = $staticItem.text();
		var checked = (value === text ) ? 'checked' : '' ;

		var $inputLabel = $('<label><input type="radio" ' + checked + ' name="' + id + '" value="' + text + '">' + text + '</input></label>');
		var $input = $inputLabel.find('input');
		$input.attr('fieldId', id);
		if (readOnly) {
			$input.attr('disabled', 'disabled');
		}
		if ($graphic.attr('hidden') == 'true'){
			options.container.hide();		
		}

		$inputLabel.appendTo($fieldset);
	}
	$fieldset.appendTo($input_container);

	if(!options.refreshData)	
		$input_container.appendTo(options.container);
	else
		options.container.find('.form_value').html($input_container.children());

	if ($graphic.attr('hidden') == 'true') {
		options.container.hide();
	}

	if (readOnly) {
		var $radioHiddenInput = options.container.find('#radioHiddenInput'+id);
		if ($radioHiddenInput.length === 0) {
			options.container.append('<input id="radioHiddenInput'+id+'" type="hidden" name="' + id + '" value="' + value + '">');
		} else {
			$radioHiddenInput.attr('value', value);
		}
	}else{
		$input_container.attr('title', $entity.attr('toolTip'));
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
				formValue.find('input').attr('disabled', 'disabled');
				var $radioHiddenInput = $('#radioHiddenInput'+id);
				if ($radioHiddenInput.length === 0) {
					options.container.append('<input id="radioHiddenInput'+id+'" type="hidden" name="' + id + '" value="' + value + '">');
				} else {
					$radioHiddenInput.attr('value', value);
				}
				formValue.removeAttr('title');
				formLabel.removeClass('required_label');
			}else if(isReadOnly == 'false'){			
				formValue.find('input').removeAttr('disabled');
				$('#radioHiddenInput'+id).remove();
				formValue.attr('title', $entity.attr('toolTip'));
				if($entity.attr('required') === 'true')
					formLabel.addClass('required_label');
			}
				
			if(isRequired == 'true'){
				formLabel.addClass('required_label');
				formValue.find('fieldset').addClass('sw_required');
			}else if(isRequired == 'false'){
				formLabel.removeClass('required_label');
				formValue.find('fieldset').removeClass('sw_required');			
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

SmartWorks.FormRuntime.RadioButtonBuilder.buildEx = function(config){
	var options = {
			container : $('<tr></tr>'),
			fieldId: '',
			fieldName: '',
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
						'<format type="radioButton" viewingType="radioButton"/>' +
					    '<graphic hidden="false" readOnly="'+ options.readOnly +'" labelWidth="'+ labelWidth + '"/>' +
					'</formEntity>')).find('formEntity');
	var $formCol = $('<td class="form_col js_type_radioButton" fieldid="' + options.fieldId+ '" colspan="' + options.colSpan + '" width="' + options.colSpan/options.columns*100 + '%" rowspan="1">');
	$formCol.appendTo(options.container);
	SmartWorks.FormRuntime.RadioButtonBuilder.build({
			mode : options.readOnly, // view or edit
			container : $formCol,
			entity : $formEntity,
			dataField : SmartWorks.FormRuntime.RadioButtonBuilder.dataField({
				fieldId: options.fieldId,
				value: options.value			
			})
	});
	
};

SmartWorks.FormRuntime.RadioButtonBuilder.dataField = function(config){
	var options = {
			fieldName: '',
			formXml: '',
			fieldId: '',
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
			value: options.value
	};
	return dataField;
};

SmartWorks.FormRuntime.RadioButtonBuilder.validate = function(radioButtons){
	var radioButtonsValid = true;
	for(var i=0; i<radioButtons.length; i++){
		var radioButton = $(radioButtons[i]);
		var fieldset = radioButton.find('fieldset.sw_required');
		if(isEmpty(fieldset)) continue;
		if(isEmpty(fieldset.find('input:checked'))){
			fieldset.addClass("sw_error");
			radioButtonsValid = false;
		}
	}
	return radioButtonsValid;
};
}catch(error){
	smartPop.showInfo(smartPop.ERROR, smartMessage.get('technicalProblemOccured') + '[radio_button script]', null, error);
}