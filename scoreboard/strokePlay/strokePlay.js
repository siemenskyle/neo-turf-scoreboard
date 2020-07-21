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
		var parPlayed = 0, totalScore = 0, pace = 0;
		/* Styles */
		var baseLeft = 96;
		var baseTop = 266;
		var leftIncrement = 42.5;
		var topIncrement = 111;
		
		for (var i = 0; i <= 17; i++) {
			// Set scorecard
			var hole = i+1;
			var textClass = 'par';
			
			// Set scorecard
			if (scores[i] != 0) {
				totalScore += scores[i];
				parPlayed += pars[i];
				
				if (scores[i] == pars[i] - 1)
					textClass = 'good';
				else if (scores[i] < pars[i])
					textClass = 'great';
				else if (scores[i] == pars[i] + 1)
					textClass = 'bad';
				else if (scores[i] > pars[i])
					textClass = 'poor';

				var holePar = scores[i] - pars[i];
				pace += holePar;
				
				// TODO if (is Single Player) {
				$('#h'+ hole).html(scores[i]).css({
					left: ( baseLeft + ( i % 9 ) * leftIncrement ) + 'px',
					top: ( baseTop + ( hole > 9 ? topIncrement : 0 ) ) + 'px'
				}).removeClass('par','poor','good','bad','great').addClass(textClass);
				
				
				if ( hole == 9 || hole == 18) {
					textClass = 'par';
					
					if (totalScore < parPlayed)
						textClass = 'good';
					else if (totalScore > parPlayed)
						textClass = 'bad';
					
					$(hole == 9 ? '#frontNine' : '#backNine').html(totalScore).css({
						left: ( baseLeft + ( i % 9 ) * leftIncrement + leftIncrement ) + 'px',
						top: ( baseTop + ( hole > 9 ? topIncrement : 0 ) ) + 'px'
					}).addClass(textClass);
				}
					
				// } else { } (multiPlayer)
			} else {
				pace += -1;
				$('#h'+ hole).html('');
				if ( hole == 9 ) $('#frontNine').html('');
				if ( hole == 18 ) $('#backNine').html('');
			}
		}
		
		var currentScore = totalScore - parPlayed;
		// TODO do something with this?
		if (currentScore == 0) 
			$('#currentScore').html('EVEN').removeClass('par','poor','good').addClass('par');
		else if (currentScore > 0)
			$('#currentScore').html('+' + currentScore).removeClass('par','poor','good').addClass('poor');
		else
			$('#currentScore').html(currentScore).removeClass('par','poor','good').addClass('good');

		if (pace > 0) 
			$('#pace').html('+' + pace);
		else
			$('#pace').html(pace);

		if (pace < -15)
			$('#pace').removeClass(['par','poor','good']).addClass('good');
		else if (pace > -9)
			$('#pace').removeClass(['par','poor','good']).addClass('poor');
		else
			$('#pace').removeClass(['par','poor','good']).addClass('par');
	}
}
