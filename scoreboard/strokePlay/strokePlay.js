window.onload = init;

function init(){
	
	var xhr = new XMLHttpRequest(); //AJAX data request sent to server(in this case server being local json file)
	var streamJSON = '../../streamcontrol.json'; //specifies path for streamcontrol output json
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
		// Get data from the streamcontrol json object
		var course = scObj['stroke.strokeCourse']; 
		var scores = [];
		for (var i = 1; i <= 18; i++) {
			scores.push(parseInt(scObj['stroke.hole'+i]));
		}

		var pars = []
		switch (course) {
			case "GERMANY":
				pars = [4,4,3,5,4,4,5,3,4,5,3,4,4,3,4,4,5,4];
				break;
			case "JAPAN":
				pars = [4,4,3,4,5,4,4,5,3,4,5,4,4,3,4,5,3,4];
				break;
			case "USA":
				pars = [4,4,3,5,4,4,4,5,3,4,5,3,4,4,3,4,5,4];
				break;
			case "AUSTRALIA":
				pars = [4,4,3,5,4,4,5,3,4,4,4,3,4,4,5,3,4,5];
				break;
		}
		$('#scorecard').attr('class', course);
		
		// Update scorecard if it has changed.
		var stringifiedScores = JSON.stringify(scores);
		if ($('#scores').text != stringifiedScores) {
			$('#scores').html(stringifiedScores);
			setScorecard(scores, pars)
		}
	}
	
	function setScorecard(scores, pars) {
		var parPlayed = 0, totalScore = 0;
		/* Styles */
		var baseLeft = 94;
		var baseTop = 271;
		var leftIncrement = 42.5;
		var topIncrement = 110;
		
		for (var i = 0; i <= 17; i++) {
			// Set scorecard
			var hole = i+1;
			var textClass = 'par';
			
			// Set scorecard
			if (scores[i] != 0) {
				totalScore += scores[i];
				parPlayed += pars[i];
				
				if (scores[i] == pars[i] - 1)
					textClass = 'nice';
				else if (scores[i] < pars[i])
					textClass = 'godlike';
				else if (scores[i] == pars[i] + 1)
					textClass = 'shithappens';
				else if (scores[i] > pars[i])
					textClass = 'gitgud';

				var holePar = scores[i] - pars[i];
				
				// TODO if (is Single Player) {
				$('#h'+ hole).html(scores[i]).css({
					left: ( baseLeft + ( i % 9 ) * leftIncrement ) + 'px',
					top: ( baseTop + ( hole > 9 ? topIncrement : 0 ) ) + 'px'
				}).addClass(textClass);
				
				
				if ( hole == 9 || hole == 18)
				{
					textClass = 'par';
					
					if (totalScore < parPlayed)
						textClass = 'nice';
					else if (totalScore > parPlayed)
						textClass = 'gitgud';
					
					$(hole == 9 ? '#frontNine' : '#backNine').html(totalScore).css({
						left: ( baseLeft + ( i % 9 ) * leftIncrement + leftIncrement ) + 'px',
						top: ( baseTop + ( hole > 9 ? topIncrement : 0 ) ) + 'px'
					}).addClass(textClass);
				}
					
				// } else { }
			} else {
				$('#h'+ hole).html('');
				if ( hole == 9 ) $('#frontNine').html('');
				if ( hole == 18 ) $('#backNine').html('');
			}
		}
		var abovePar = totalScore - parPlayed;
		// TODO do something with this?
	}
}
