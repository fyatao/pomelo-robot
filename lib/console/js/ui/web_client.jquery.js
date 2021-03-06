/*  
 * Instantiates WebClient(), binds document.ready()
 */

var web_client = new WebClient(io);

// Update statistics widget
setInterval(function() {
  var now = new Date();
  var elapsed = (now.getTime() - web_client.stats.start.getTime()) / 1000;
  var minutes = parseInt(elapsed / 60);
  var seconds = parseInt(elapsed % 60);
  var rate = web_client.stats.messages/elapsed;
  $("#stats")
    .find(".nodes b").html(web_client.stats.nodes).end()
    .find(".elapsed b").html(minutes + ":" + (seconds < 10 ? "0" : "") + seconds).end();
    //.find(".rate b").html((rate).toFixed(2));
}, 1000);

setInterval(function() {
	web_client.socket.emit('webreport',{});
}, 5000);


// Event bindings, main method
$(document).ready(function() {
  var bottom_height = $(".stat:first").height();
  var bar_height = $(".bar:first").height();

  // Calculate individual screen size
  function calc_screen_size(scount) {
    if (!scount) { scount = $("#screens .screen").length; }
    var ssize = (($(window).height() - bottom_height - 20) / scount)
      - (bar_height + 53);
    return ssize;
  }
  
  // Resize screens
  web_client.resize = function(scount, resize_bottom) {
    if (!resize_bottom) { resize_bottom = true; }
    //$("#controls2, #right").height($(window).height());
    //$(".console").height(calc_screen_size(scount));
    var screen_width = $(window).width() - $("#controls2").width();
    $("#right" + (resize_bottom ? ", #bottom" : ""))
      .width(screen_width).css('max-width', screen_width);
  };
  $(window).resize(function() {
    web_client.resize();
  });

	//$("#run-button").css('display','none');
	$("#runcode-button").css('display','none');
	$("#codeinput").css('display','none');
	
  web_client.resize();
  
  $("#ready-button").click(function() {
  		var agent = $("#agentinput").val();
  		var user = $("#maxuserinput").val();
  		var time = $("#timeinput").val();
  		//var robot = $("#robotinput").val();
  		var data = {agent:agent,maxuser:user,time:time};
  		//console.log('%j',data)
  		web_client.socket.emit('ready',data);
  		$(this).attr('disable',true);
  		$('#conndiv').html();
  		$('#run-button').css('display','none');
  });
  
  $("#run-button").click(function() {
		var agent = $("#agentinput").val();
		var maxuser = $("#maxuserinput").val();
		var time = $("#timeinput").val();
		var robot = $("#robotinput").val();
		var data = {agent:agent,maxuser:maxuser,time:time,robot:robot};
		web_client.socket.emit('run',data);
		$("#hitdiv").html('运行中');
  });
  $("#runcode-button").click(function() {
  	var val = $("#codeinput").val();
  	try {
  		var params = JSON.parse($("#codeinput").val());
  		web_client.socket.emit('runcode',params);
  	} catch(err) {
  		alert('输入错误' + err);	
  		return;
  	}
  });
  
  $("#sumbtn").click(function() {
  	showDetailAgent();
  });
  
  $("#avgbtn").click(function() {
  	showDetailAgentAvg();
  });

  
  $("#qsbtn").click(function() {
  	showDetailAgentQs();
  });
  
});
