$(function(){
		$('.list_of_frames').empty();
		function loader(urlNum){
			if(urlNum > -1 && urlNum<30){
			
			//$('.tempCSS').remove();
			var url = $('.article_list #article_'+urlNum).attr('href');
			var title = $('.article_list #article_'+urlNum).text();
			$('.ladengif').show()
			$('.title-for-HN a').text(title);
			$('.title-for-HN a').attr('href',url);
			$('.list_of_frames').append('<iframe class="article_holder" id="iframe_'+urlNum+'" name="iframe_'+urlNum+'"></iframe>')
			$.ajax({
				url:'/gethtml',
				data:{url:url},
				type:'post',
				async:true,
				success:function(data){
					
					$('.ladengif').hide();
					$.each(data.css, function(i,link){
						$('#iframe_'+urlNum+'').contents().find('head').append('<link class="tempCSS" href="'+link+'" rel="stylesheet">');
					})
					$.each(data.style, function(i,style){
						$('#iframe_'+urlNum+'').contents().find('head').append('<style class="tempCSS">'+style+'</style>');
					})

					console.log('before');
					console.log(data.htmldata)
					$('#iframe_'+urlNum+'').contents().find('body').empty()
					$('#iframe_'+urlNum+'').contents().find('body').append(data.htmldata)
					console.log('hello');
					
					
					
				},
				complete:function(){
					setTimeout(function(){
						document.getElementById('iframe_'+urlNum).style.height = document.getElementById('iframe_'+urlNum).contentWindow.document.body.offsetHeight+50 + 'px';
						console.log(document.getElementById('iframe_'+urlNum).contentWindow.document.body.offsetHeight+50 + 'px');
					},50)
					
						
					
					
						
					$('.modal-backdrop').hide();
				}
				


				})
			}
		}
		function justone(urlNum){
			if(urlNum > -1 && urlNum<30){
			
			//$('.tempCSS').remove();
			var url = $('.article_list #article_'+urlNum).attr('href');
			var title = $('.article_list #article_'+urlNum).text();
			$('.ladengif').show()
			$('.title-for-HN a').text(title);
			$('.title-for-HN a').attr('href',url);
			$('.list_of_frames').empty();
			$('.tempCSS').remove();
			$.ajax({
				url:'/gethtml',
				data:{url:url},
				type:'post',
				dataType: 'json',
				success:function(data){
					
					$('.ladengif').hide();
					$.each(data.css, function(i,link){
						$('head').append('<link class="tempCSS" href="'+link+'" rel="stylesheet">');
					})
					$.each(data.style, function(i,style){
						$('head').append('<style class="tempCSS">'+style+'</style>');
					})

					console.log('before');
					console.log(data.htmldata.length)
					$('.list_of_frames').append('<div>'+data.htmldata+'</div>')
					console.log('hello');
					
					
					
				},
				complete:function(){
					
					$('.modal-backdrop').hide();
				}
				


				})
			}
		}
		var currenturl = 0;
		loader(currenturl);
		$('.navbar-header').delegate('.next-hn','click',function(){
			currenturl++;
			loader(currenturl);
			//justone(currenturl);
		});
		
		$('body').delegate('.previous-hn','click',function(){
			currenturl--;
			loader(currenturl);
			//justone(currenturl);
		});
})