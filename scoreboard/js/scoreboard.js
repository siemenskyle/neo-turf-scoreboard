window.onload = init;

function init(){
	
	var xhr = new XMLHttpRequest(); //AJAX data request sent to server(in this case server being local json file)
	var streamJSON = '../streamcontrol.json'; //specifies path for streamcontrol output json
	var scObj; //variable to hold data extracted from parsed json
	var cBust = 0; //variable to hold cache busting value
	
	xhr.overrideMimeType('application/json'); //explicitly declares that json should always be processed as a json filetype
	
	function pollJSON() {
		xhr.open('GET',streamJSON+'?v='+cBust,true); //string query-style cache busting, forces non-cached new version of json to be opened each time
		xhr.send();
		cBust++;		
	}
	
	pollJSON();
	setInterval(function(){pollJSON();},500); //runs polling function twice per second
	
	xhr.onreadystatechange = parseJSON; //runs parseJSON function every time XMLHttpRequest ready state changes
	
	function parseJSON() {
		if(xhr.readyState === 4){ //loads data from json into scObj variable each time that XMLHttpRequest ready state reports back as '4'(successful)
			scObj = JSON.parse(xhr.responseText);
			scoreboard(); //runs scoreboard function each time readyState reports back as 4 as long as it has already run once and changed animated value to false
		}
	}
	
	function scoreboard(){
		var p1Name = scObj['p1Name']; 
		var p2Name = scObj['p2Name'];
		var p1Char = scObj['p1Char'];
		var p2Char = scObj['p2Char'];
		var scores = [];
		for (var i = 1; i <= 18; i++) {
			scores.push(scObj['hole'+i]);
		}
		
		if($('#p1Name').text() != p1Name) {
			$('#p1Name').html(p1Name);
			if (p1Name.length > 14) {
				$('#p1Wrapper').css('font-size', '18px');
			} else if (p1Name.length > 11) {
				$('#p1Wrapper').css('font-size', '22px');
			} else {
				$('#p1Wrapper').css('font-size', '28px');
			}
		}
		
		if($('#p2Name').text() != p2Name) {
			$('#p2Name').html(p2Name);
			if (p2Name.length > 14) {
				$('#p2Wrapper').css('font-size', '18px');
			} else if (p2Name.length > 11) {
				$('#p2Wrapper').css('font-size', '22px');
			} else {
				$('#p2Wrapper').css('font-size', '28px');
			}
		}
		
		var p1CharLink = 'img/' + p1Char + '.gif';
		if (!p1Char) {
			var p1CharLink = 'img/e.png';
		} 
		if ($('#p1Portrait').attr('src') != p1CharLink) {
			$('#p1Portrait').attr('src', p1CharLink);
		}
		
		var p2CharLink = 'img/' + p2Char + '.gif';
		if (!p2Char) {
			var p2CharLink = 'img/e.png';
		} 
		if ($('#p2Portrait').attr('src') != p2CharLink) {
			$('#p2Portrait').attr('src', p2CharLink);
		}
		
		var stringifiedScores = JSON.stringify(scores);
		if ($('#scores').text != stringifiedScores) {
			$('#scores').html(stringifiedScores);
			setScorecard(scores)
		}
	}
	
	function setScorecard(scores) {
		var up = 0;
		var lastHole = 0;
		for (var i = 0; i <= 17; i++) {
			// Set scorecard
			var hole = i+1;
			switch (scores[i]) {
				case '1':
					$('#h'+ hole +'p1').attr('src', 'img/W.png');
					$('#h'+ hole +'p2').attr('src', 'img/L.png');
					up += 1;
					lastHole = hole;
					break;
				case '2':
					$('#h'+ hole +'p1').attr('src', 'img/L.png');
					$('#h'+ hole +'p2').attr('src', 'img/W.png');
					up -= 1;
					lastHole = hole;
					break;
				case '3':
					$('#h'+ hole +'p1').attr('src', 'img/T.png');
					$('#h'+ hole +'p2').attr('src', 'img/T.png');
					lastHole = hole;
					break;
				default:
					$('#h'+ hole +'p1').attr('src', 'img/e.png');
					$('#h'+ hole +'p2').attr('src', 'img/e.png');
			}
		}
		setUp(up, lastHole);
	}
	
	function setUp(up, lastHole) {
		if (up > 0) {
			// P1 Winning
			var upimg = 'img/' + up + '.png';
			if ($('#p1UpNum').attr('src') != upimg){
				$('#p1UpNum').attr('src', upimg);
			}
			$('#p2Dormie').fadeTo(0, 0);
			
			if (up + lastHole == 17) {
				$('#p1Dormie').attr('src', 'img/updormie.png');
				$('#p1Dormie').fadeTo(0, 1);
				$('#square').fadeTo(0, 0);
				$('#p1Up').fadeTo(0, 0);
				$('#p2Up').fadeTo(0, 0);
				$('#p1UpNum').fadeTo(0, 0);
				$('#p2UpNum').fadeTo(0, 0);
			} else if (up + lastHole > 17) {
				$('#p1Dormie').attr('src', 'img/dormie.png');
				$('#p1Dormie').fadeTo(0, 1);
				$('#square').fadeTo(0, 0);
				$('#p1Up').fadeTo(0, 0);
				$('#p2Up').fadeTo(0, 0);
				$('#p1UpNum').fadeTo(0, 0);
				$('#p2UpNum').fadeTo(0, 0);
			} else {
				$('#p1Dormie').fadeTo(0, 0);
				$('#square').fadeTo(0, 0);
				$('#p1Up').fadeTo(0, 1);
				$('#p2Up').fadeTo(0, 0);
				$('#p1UpNum').fadeTo(0, 1);
				$('#p2UpNum').fadeTo(0, 0);
			}
		} else if (up < 0) {
			// P2 Winning
			up = Math.abs(up)
			var upimg = 'img/' + up + '.png';
			if ($('#p2UpNum').attr('src') != upimg){
				$('#p2UpNum').attr('src', upimg);
			}
			$('#p1Dormie').fadeTo(0, 0);
			
			if (up + lastHole == 17) {
				$('#p2Dormie').attr('src', 'img/updormie.png');
				$('#p2Dormie').fadeTo(0, 1);
				$('#square').fadeTo(0, 0);
				$('#p1Up').fadeTo(0, 0);
				$('#p2Up').fadeTo(0, 0);
				$('#p1UpNum').fadeTo(0, 0);
				$('#p2UpNum').fadeTo(0, 0);
			} else if (up + lastHole > 17) {
				$('#p2Dormie').attr('src', 'img/dormie.png');
				$('#p2Dormie').fadeTo(0, 1);
				$('#square').fadeTo(0, 0);
				$('#p1Up').fadeTo(0, 0);
				$('#p2Up').fadeTo(0, 0);
				$('#p1UpNum').fadeTo(0, 0);
				$('#p2UpNum').fadeTo(0, 0);
			} else {
				$('#p2Dormie').fadeTo(0, 0);
				$('#square').fadeTo(0, 0);
				$('#p1Up').fadeTo(0, 0);
				$('#p2Up').fadeTo(0, 1);
				$('#p1UpNum').fadeTo(0, 0);
				$('#p2UpNum').fadeTo(0, 1);
			}
		} else {
			// All Square
			if (lastHole == 18) {
				// Sudden death!
				$('#square').attr('src', 'img/sudden-death.png');
			} else {
				$('#square').attr('src', 'img/square.png');
			}
			$('#square').fadeTo(0, 1);
			$('#p1Up').fadeTo(0, 0);
			$('#p2Up').fadeTo(0, 0);
			$('#p1UpNum').fadeTo(0, 0);
			$('#p2UpNum').fadeTo(0, 0);		
			$('#p1Dormie').fadeTo(0, 0);
			$('#p2Dormie').fadeTo(0, 0);
		}
	}
}