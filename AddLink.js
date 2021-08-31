$(function() {
	$('#ProcessPageEdit').on('click', '.url-upload-toggle', function(e) {
		e.preventDefault();

		var $this = $(this);
		var fieldName = $this.data('fieldname');
		var filename = $this.data('filename');
		var $fileList = $('.Inputfield_' + fieldName + ' .InputfieldFileList');
		var $progressItem = $('<li class="InputfieldFile ui-widget AjaxUpload"><p class="InputfieldFileInfo ui-widget ui-widget-header InputfieldItemHeader"></p></li>');
		//MP: not used? var	$progressBar = $('<div class="ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>');
		//MP: not used? var	$progressBarValue = $('<div class="ui-progressbar-value ui-widget-header InputfieldItemHeader ui-corner-left" style="width: 0%;"></div>');
		var doneTimer = null;
		var xhr;

		var form = $this.parents('form');
		var $repeaterItem = $this.closest('.InputfieldRepeaterItem');
		var postUrl = $repeaterItem.length ? $repeaterItem.attr('data-editUrl') : form.attr('action');
		postUrl += (postUrl.indexOf('?') > -1 ? '&' : '?') + 'InputfieldFileAjax=1';

		//MP Present file info and append it to the list of files
		var fileData = '' +
			'<span class="InputfieldFileName" onmouseover="this.style.textDecoration=\'none\';this.style.cursor=\'auto\'" >' + '&nbsp;' + '</span>' +
			'<span class="InputfieldFileStats"> ' + '' + " </span>";

		$progressItem.find('p.ui-widget-header').html(fileData);
		$fileList.append($progressItem);
		var $inputfield = $fileList.closest('.Inputfield');
		$inputfield.addClass('InputfieldStateChanged');
		var numFiles = $inputfield.find('.InputfieldFileItem').length;
		if(numFiles == 1) {
			$inputfield.removeClass('InputfieldFileEmpty').removeClass('InputfieldFileMultiple').addClass('InputfieldFileSingle');
		} else if(numFiles > 1) {
			$inputfield.removeClass('InputfieldFileEmpty').removeClass('InputfieldFileSingle').addClass('InputfieldFileMultiple');
		}

		//MP generate random number 8 chars long
		var rnd = Math.floor(Math.random() * (99999999 - 10000000) ) + 10000000;
		filename = filename.replace('#', rnd);

		//var crypto = window.crypto;
		//var typedArray = new Uint16Array(2);
		//crypto.getRandomValues(typedArray);
		//filename = filename.replace('#', '' + typedArray[0] + typedArray[1]);

		var $postToken = form.find('input._post_token');
		var postTokenName = $postToken.attr('name');
		var postTokenValue = $postToken.val();
		var response;

		xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				xhr.getAllResponseHeaders();
				console.log(xhr.responseText);
				//MP response = [{"error":false,"message":"Added link: Povezava-3p07.link","file":"\/site\/assets\/files\/1015\/Povezava-3p07.link","size":0,"markup":"<li id='file_2547eccbe595b60721931da27a2b12c9' class='InputfieldFileItem ui-widget ui-widget-content'><p class='InputfieldFileInfo InputfieldItemHeader ui-state-default ui-widget-header'><i class='fa fa-link fa-fw HideIfEmpty'><\/i>&nbsp;<a class='InputfieldFileName' title='castle.png' target='_blank' href='\/site\/assets\/files\/1015\/castle.png'>Povezava-30p9.link<\/a> <span class='InputfieldFileStats'>0&nbsp;B<\/span> <label class='InputfieldFileDelete'><input type='checkbox' name='delete_datoteka_2547eccbe595b60721931da27a2b12c9' value='1' title='Delete' \/><i class='fa fa-fw fa-trash'><\/i><\/label><\/p><div class='InputfieldFileData description ui-widget-content'><div class='hasLangTabs langTabsContainer'><div class='langTabs'><ul ><li><a data-lang='1189' class='langTab1189' href='#langTab_datoteka_2547eccbe595b60721931da27a2b12c9__1189'>Sloven&scaron;\u010dina<\/a><\/li><li><a data-lang='1231' class='langTab1231' href='#langTab_datoteka_2547eccbe595b60721931da27a2b12c9__1231'>Angle&scaron;\u010dina<\/a><\/li><\/ul><div class='InputfieldFileDescription LanguageSupport' data-language='1189' id='langTab_datoteka_2547eccbe595b60721931da27a2b12c9__1189'><label for='description_datoteka_2547eccbe595b60721931da27a2b12c9' class='detail LanguageSupportLabel'>Sloven&scaron;\u010dina<\/label><input type='text' name='description_datoteka_2547eccbe595b60721931da27a2b12c9' id='description_datoteka_2547eccbe595b60721931da27a2b12c9'  value='' \/><\/div><div class='InputfieldFileDescription LanguageSupport' data-language='1231' id='langTab_datoteka_2547eccbe595b60721931da27a2b12c9__1231'><label for='description1231_datoteka_2547eccbe595b60721931da27a2b12c9' class='detail LanguageSupportLabel'>Angle&scaron;\u010dina<\/label><input type='text' name='description1231_datoteka_2547eccbe595b60721931da27a2b12c9' id='description1231_datoteka_2547eccbe595b60721931da27a2b12c9'  value='' \/><\/div><\/div><\/div><script>setupLanguageTabs($('#wrap_Inputfield_datoteka'));<\/script><input class='InputfieldFileSort' type='text' name='sort_datoteka_2547eccbe595b60721931da27a2b12c9' value='4' \/><\/div><\/li>","replace":false,"overwrite":0}];
				response = $.parseJSON(xhr.responseText);
				upload(response);
			}
		};
		//MP todo: xhr on fail do what?
		xhr.open("POST", postUrl, true); //MP /processwire/page/edit/?id=1015&InputfieldFileAjax=1
		xhr.setRequestHeader("X-FILENAME", encodeURIComponent(filename));
		xhr.setRequestHeader("X-FIELDNAME", fieldName);
		xhr.setRequestHeader("Content-Type", "application/octet-stream");
		xhr.setRequestHeader("X-" + postTokenName, postTokenValue);
		xhr.setRequestHeader("X-REQUESTED-WITH", 'XMLHttpRequest');
		xhr.send("X"); //MP the content of "uploaded" file must not be empty, PW ignores it

		//display "uploaded" file
		function upload(response) {
			for(var n = 0; n < response.length; n++) {
				var r = response[n];
				var $markup = $(r.markup);
				if(r.error) {
					var $pi = $progressItem.clone();
					$pi.find('.InputfieldFileInfo').addClass('ui-state-error');
					//MP $pi.find('.InputfieldFileStats').text(' - ' + r.message);
					$pi.find('.InputfieldFileName').text(r.message);
					$pi.find('.ui-progressbar').remove();
					$progressItem.after($pi);
				} else {
					//MP don't need this
					if(r.replace) {
						var $child = $this.find('.InputfieldFileList').children('li:eq(0)');
						if($child.size() > 0) $child.slideUp('fast', function() { $child.remove(); });
					}

					// ie10 file field stays populated, this fixes that
					//MP don't need this
					//var $input = $this.find('input[type=file]');
					//if($input.val()) $input.replaceWith($input.clone(true));

					$markup.hide();

					// look for and handle replacements
					//MP don't need this, as we will always insert
					if(r.overwrite) {
						var basename = $markup.find('.InputfieldFileName').text();
						var $item = null;
						// find an existing item having the same basename
						$fileList.children('.InputfieldFileItemExisting').each(function() {
							if($item === null && $(this).find('.InputfieldFileName').text() == basename) {
								// filenames match
								$item = $(this);
							}
						});
						if($item !== null) {
							// found replacement
							var $newInfo = $markup.find('.InputfieldFileInfo');
							var $newLink = $markup.find('.InputfieldFileLink');
							var $info = $item.find('.InputfieldFileInfo');
							var $link = $item.find('.InputfieldFileLink');
							$info.html($newInfo.html() + "<i class='fa fa-check'></i>");
							$link.html($newLink.html());
							$item.addClass('InputfieldFileItemExisting');
							$item.effect('highlight', 500);
						} else {
							// didn't find a match, just append
							$fileList.append($markup);
							$markup.slideDown();
							$markup.addClass('InputfieldFileItemExisting');
						}

					} else {
						// overwrite mode not active
						// add input field for link address
						//$markup.find('.InputfieldFileData').append("<input type='text' name='linkaddress' style='margin-top:1em'>");
						$fileList.append($markup);
						$markup.slideDown();
					}
				}

				setTimeout(function() {
					//MP $markup is undefined on error
					var $inputfields = $markup.find('.Inputfield');
					if($inputfields.length) {
						InputfieldsInit($markup.find('.Inputfields'));
						$inputfields.trigger('reloaded', ['InputfieldFileUpload']);
					}
				}, 100);

			} // for

			$progressItem.remove();

			if(doneTimer) clearTimeout(doneTimer);
			var doneTimer = setTimeout(function() {
				$('body').removeClass('pw-uploading');
				//MP if(maxFiles != 1 && !$fileList.is('.ui-sortable')) initSortable($fileList);
				$fileList.trigger('AjaxUploadDone'); // for things like fancybox that need to be re-init'd
			}, 500);

		}

	});
});
